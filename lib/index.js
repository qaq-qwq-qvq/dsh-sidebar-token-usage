/**
 * Host half: answers per-model token usage for one Session on demand.
 *
 * The client's tokenUsage projection only carries whole-Session totals, so a
 * per-model breakdown has to come from the durable log. This route reads one
 * Session's log only when the sidebar hover card asks for it — never at boot,
 * so a large history costs nothing until someone looks at it.
 */
import { readFile, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { execFile, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";

const ROUTE = "/api/sidebar-token-usage/models";
const LATEST_ROUTE = "/api/sidebar-token-usage/latest";
const BALANCE_ROUTE = "/api/sidebar-token-usage/balance";
const DIAG_ROUTE = "/api/sidebar-token-usage/diag";
const RESTART_ROUTE = "/api/sidebar-token-usage/restart";
const RESTART_STATUS_ROUTE = "/api/sidebar-token-usage/restart-status";
const CACHE_TTL_MS = 30_000;
const BALANCE_TTL_MS = 60_000;
// Platform answers through a slow path on some networks (10s+ observed); the
// account settings page allows 30s, so this probe keeps a similar budget.
const BALANCE_PROBE_TIMEOUT_MS = 25_000;
const PLATFORM_BALANCE_URL = "https://platform.deepseek.com/api/v0/users/get_user_summary";
const PLATFORM_GRANT_KEY = "deepseek-account-platform/default";

const execFileAsync = promisify(execFile);

/**
 * Read the executable path of this Host's parent process.
 * @returns the parent pid and its executable path, or undefined when unknown.
 */
async function readParentExecutable() {
  const ppid = process.ppid;
  try {
    const { stdout } = await execFileAsync("powershell.exe", [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `(Get-Process -Id ${ppid} -ErrorAction SilentlyContinue).Path`,
    ], { windowsHide: true, timeout: 8000 });
    const executable = stdout.trim();
    return executable === "" ? undefined : { pid: ppid, executable };
  } catch {
    return undefined;
  }
}

/**
 * Identify the desktop application that owns this Host, if any.
 *
 * `ELECTRON_RUN_AS_NODE` is set by the desktop shell for the Host it spawns, and
 * the parent executable has to be the packaged Electron binary, recognised by
 * the `resources/app.asar` payload next to it. A `dsh web` Host started from a
 * terminal fails both checks, so a stray click can never kill that terminal.
 * @returns the shell pid and executable path, or undefined when not the desktop app.
 */
async function resolveDesktopTarget() {
  if (process.platform !== "win32") return undefined;
  if (process.env.ELECTRON_RUN_AS_NODE !== "1") return undefined;
  const parent = await readParentExecutable();
  if (parent === undefined || !parent.executable.toLowerCase().endsWith(".exe")) return undefined;
  if (!existsSync(join(dirname(parent.executable), "resources", "app.asar"))) return undefined;
  return parent;
}

/** Quote one path for a single-quoted PowerShell string literal. */
function psQuote(value) {
  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * Build the detached relaunch script.
 * @param target - shell pid and executable path resolved by `resolveDesktopTarget`.
 * @param scriptPath - the script's own path, removed after it starts the app.
 * @returns PowerShell source that survives the process it kills.
 */
function relaunchScript(target, scriptPath) {
  return [
    "$ErrorActionPreference = 'SilentlyContinue'",
    `$target = ${target.pid}`,
    `$exe = ${psQuote(target.executable)}`,
    // Let the HTTP answer leave the Host before the tree disappears.
    "Start-Sleep -Milliseconds 1200",
    "& taskkill.exe /PID $target /T /F | Out-Null",
    "Start-Sleep -Milliseconds 2000",
    "Start-Process -FilePath $exe",
    "Start-Sleep -Seconds 3",
    "$name = [IO.Path]::GetFileNameWithoutExtension($exe)",
    "if (-not (Get-Process -Name $name -ErrorAction SilentlyContinue)) { Start-Sleep -Seconds 2; Start-Process -FilePath $exe }",
    `Remove-Item -LiteralPath ${psQuote(scriptPath)} -Force`,
  ].join("\r\n");
}

/**
 * Start the relaunch helper detached from this process tree.
 *
 * `cmd /c start` hands the script to a new process whose parent (cmd) exits at
 * once, so `taskkill /T` on the Electron shell does not reach it.
 * @param target - shell pid and executable path.
 */
async function scheduleRelaunch(target) {
  const scriptPath = join(tmpdir(), `dsh-sidebar-restart-${String(process.pid)}.ps1`);
  await writeFile(scriptPath, relaunchScript(target, scriptPath), "utf8");
  const command = `start "" /b powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "${scriptPath}"`;
  const launcher = spawn("cmd.exe", ["/d", "/s", "/c", command], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  launcher.unref();
}

/**
 * Last recorded account balance, read from the local usage ledger another
 * plugin keeps. This is the fallback when the Platform probe cannot run.
 * @returns the recorded balance, or undefined when nothing is recorded.
 */
async function readRecordedBalance() {
  const file = join(homedir(), ".dsh", ".dshw-usage.json");
  let doc;
  try {
    doc = JSON.parse(await readFile(file, "utf8"));
  } catch {
    return undefined;
  }
  const amount = typeof doc?.lastBalance === "number" && Number.isFinite(doc.lastBalance) ? doc.lastBalance : undefined;
  if (amount === undefined) return undefined;
  let currency = "CNY";
  let asOf;
  const books = doc?.accounting?.books;
  if (books !== undefined && books !== null && typeof books === "object") {
    for (const [id, book] of Object.entries(books)) {
      const suffix = id.split("-").pop();
      if (typeof suffix === "string" && suffix.length === 3) currency = suffix;
      const days = book?.days;
      if (days === undefined || days === null || typeof days !== "object") continue;
      for (const day of Object.values(days)) {
        const at = typeof day?.lastAt === "number" ? day.lastAt : undefined;
        if (at !== undefined && (asOf === undefined || at > asOf)) asOf = at;
      }
    }
  }
  return { amount, currency, asOf: asOf ?? null };
}

/**
 * Live Platform wallet balance for the signed-in DeepSeek account.
 *
 * The browser PKCE login leaves a grant in the host credential store; the same
 * grant and endpoint the account settings page uses are enough to read the
 * wallet summary, so no API key is involved. The probe is best effort: any
 * missing grant or transport/protocol failure resolves undefined and the caller
 * falls back to the recorded ledger.
 * @param ctx - host context holding the credentials service.
 * @returns the summed CNY (or first) wallet, or undefined.
 */
async function readPlatformBalance(ctx) {
  const credentials = ctx.credentials;
  if (credentials === undefined || typeof credentials.readRecord !== "function") return undefined;
  let record;
  try {
    record = await credentials.readRecord(PLATFORM_GRANT_KEY);
  } catch {
    return undefined;
  }
  const token = record?.kind === "grant" && typeof record.payload?.token === "string" ? record.payload.token : undefined;
  if (token === undefined) return undefined;
  let response;
  try {
    response = await fetch(PLATFORM_BALANCE_URL, {
      headers: { accept: "application/json", "x-dsh-auth-token": token },
      signal: AbortSignal.timeout(BALANCE_PROBE_TIMEOUT_MS),
    });
  } catch {
    return undefined;
  }
  if (!response.ok) {
    try {
      await response.body?.cancel();
    } catch {
      // A body that cannot be drained changes nothing: the probe already failed.
    }
    return undefined;
  }
  let body;
  try {
    body = await response.json();
  } catch {
    return undefined;
  }
  const data = body?.data?.biz_data;
  const wallets = data?.normal_wallets;
  if (!Array.isArray(wallets) || wallets.length === 0) return undefined;
  const wallet = wallets.find((row) => row !== null && typeof row === "object" && row.currency === "CNY") ?? wallets[0];
  const normal = Number(wallet?.balance);
  if (!Number.isFinite(normal)) return undefined;
  let bonus = 0;
  if (Array.isArray(data?.bonus_wallets)) {
    for (const row of data.bonus_wallets) {
      if (row === null || typeof row !== "object" || row.currency !== wallet.currency) continue;
      const value = Number(row.balance);
      if (Number.isFinite(value)) bonus += value;
    }
  }
  return {
    amount: normal + bonus,
    currency: typeof wallet.currency === "string" ? wallet.currency : "CNY",
    asOf: Date.now(),
    source: "platform",
    normal,
    bonus,
  };
}

/** A provider bucket, floored to a non-negative integer like the projection does. */
function count(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

/** Model name of one Assistant settlement, or undefined when the source omits it. */
function modelOf(data) {
  const source = data?.message?.source;
  const model = source?.model;
  return typeof model === "string" && model.length > 0 ? model : undefined;
}

/** Provider route of one Assistant settlement; the client prices by it. */
function providerOf(data) {
  const source = data?.message?.source;
  const provider = source?.provider;
  return typeof provider === "string" && provider.length > 0 ? provider : undefined;
}

/**
 * Fold one Session's durable log into per-model totals.
 * Mirrors the tokenUsage projection: only Assistant settlements carrying a
 * provider usage report contribute.
 * @param events - the Session's raw event log.
 * @returns rows sorted by total descending.
 */
function foldModels(events) {
  const byModel = new Map();
  for (const event of events) {
    if (event?.type !== "assistant/message") continue;
    const usage = event.data?.usage;
    if (usage === undefined || usage === null) continue;
    const model = modelOf(event.data);
    if (model === undefined) continue;
    const provider = providerOf(event.data);
    const key = (provider ?? "") + "\u0000" + model;
    let row = byModel.get(key);
    if (row === undefined) {
      row = { model, provider: provider ?? null, uncachedInputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 };
      byModel.set(key, row);
    }
    row.uncachedInputTokens += count(usage.inputTokens);
    row.outputTokens += count(usage.outputTokens);
    row.cacheReadTokens += count(usage.cacheReadTokens);
    row.cacheWriteTokens += count(usage.cacheWriteTokens);
  }
  const rows = [];
  for (const row of byModel.values()) {
    rows.push({
      ...row,
      total: row.uncachedInputTokens + row.outputTokens + row.cacheReadTokens + row.cacheWriteTokens,
    });
  }
  rows.sort((left, right) => right.total - left.total);
  return rows;
}

/** Add one settlement's buckets into an accounting total. */
function accumulate(target, usage) {
  target.uncachedInputTokens += count(usage.inputTokens);
  target.outputTokens += count(usage.outputTokens);
  target.cacheReadTokens += count(usage.cacheReadTokens);
  target.cacheWriteTokens += count(usage.cacheWriteTokens);
}

/** Zeroed accounting buckets. */
function emptyUsage() {
  return { uncachedInputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 };
}

/**
 * Fold one complete Turn into the same accounting the chat's "本轮用量" card shows:
 * every Assistant settlement of that Turn, summed, plus a per-route split so the
 * client can price mixed-model Turns exactly.
 * @param events - the Session's raw event log.
 * @param turn - the Turn number to fold.
 * @returns the Turn's buckets and routes, or null when no settlement carries usage.
 */
function foldTurn(events, turn) {
  const usage = emptyUsage();
  const routes = new Map();
  let found = false;
  for (const event of events) {
    if (event?.type !== "assistant/message" || event.data?.turn !== turn) continue;
    const reported = event.data?.usage;
    if (reported === undefined || reported === null || typeof reported !== "object") continue;
    found = true;
    const provider = providerOf(event.data) ?? null;
    const model = modelOf(event.data) ?? null;
    const key = (provider ?? "") + "\u0000" + (model ?? "");
    let route = routes.get(key);
    if (route === undefined) {
      route = { provider, model, usage: emptyUsage() };
      routes.set(key, route);
    }
    accumulate(usage, reported);
    accumulate(route.usage, reported);
  }
  return found ? { usage, routes: [...routes.values()] } : null;
}

/**
 * The latest completed Turn's usage, i.e. the authoritative "本轮用量". Falls back
 * to the last settlement when the log carries no Turn boundary (seeded slices).
 * @param events - the Session's raw event log.
 * @returns that Turn's buckets and routes, or null when none is logged.
 */
function foldLatest(events) {
  let turn;
  for (let index = events.length - 1; index >= 0; index -= 1) {
    if (events[index]?.type !== "turn/end") continue;
    const value = events[index].data?.turn;
    if (typeof value === "number") {
      turn = value;
      break;
    }
  }
  if (turn !== undefined) {
    const folded = foldTurn(events, turn);
    if (folded !== null) return { ...folded, turn };
  }
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index];
    if (event?.type !== "assistant/message") continue;
    const reported = event.data?.usage;
    if (reported === undefined || reported === null || typeof reported !== "object") continue;
    const usage = emptyUsage();
    accumulate(usage, reported);
    return {
      usage,
      routes: [{ provider: providerOf(event.data) ?? null, model: modelOf(event.data) ?? null, usage }],
    };
  }
  return null;
}

function writeJson(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store",
  });
  res.end(text);
}

export const inject = ["sessionQuery", "webServer", "credentials"];

/** Host plugin body. */
export function apply(ctx) {
  const cache = new Map();
  const balanceCache = { value: undefined, at: 0 };

  /**
   * One Platform probe per TTL, then the recorded ledger as the fallback. A
   * failed probe is not cached, so the next poll retries instead of pinning a
   * stale failure for a minute.
   */
  const balanceFor = async () => {
    const now = Date.now();
    if (balanceCache.value !== undefined && now - balanceCache.at < BALANCE_TTL_MS) return balanceCache.value;
    const live = await readPlatformBalance(ctx);
    if (live !== undefined) {
      balanceCache.value = live;
      balanceCache.at = now;
      return live;
    }
    const recorded = await readRecordedBalance();
    return recorded === undefined ? undefined : { ...recorded, source: "record" };
  };

  /**
   * One log read per Session per TTL, shared by the per-model and latest-exchange
   * routes. The latest route passes `fresh` because a newly settled exchange must
   * show immediately instead of waiting out the cache.
   */
  const foldSession = async (sessionId, fresh) => {
    const hit = cache.get(sessionId);
    const now = Date.now();
    if (fresh !== true && hit !== undefined && now - hit.at < CACHE_TTL_MS) return hit;
    const snapshot = await ctx.sessionQuery.readSession(sessionId);
    const events = snapshot?.events ?? [];
    const entry = { at: now, models: foldModels(events), latest: foldLatest(events) };
    cache.set(sessionId, entry);
    if (cache.size > 64) cache.delete(cache.keys().next().value);
    return entry;
  };

  // One-shot structural report from the browser, so a layout problem can be
  // diagnosed from the real DOM instead of guessed at.
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: DIAG_ROUTE,
    handler: async (request, response) => {
      const payload = new URL(request.url, "http://localhost").searchParams.get("data");
      if (payload !== null && payload !== "") {
        try {
          await writeFile(join(homedir(), ".dsh", "sidebar-token-usage-diag.json"), payload, "utf8");
        } catch (error) {
          writeJson(response, 500, { ok: false, error: String(error?.message ?? error) });
          return;
        }
      }
      writeJson(response, 200, { ok: true });
    },
  }), "sidebar-token-usage: layout diagnostic");

  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: BALANCE_ROUTE,
    handler: async (_request, response) => {
      try {
        const balance = await balanceFor();
        if (balance === undefined) {
          writeJson(response, 200, { ok: false, error: "no balance available" });
          return;
        }
        writeJson(response, 200, { ok: true, balance });
      } catch (error) {
        writeJson(response, 200, { ok: false, error: String(error?.message ?? error) });
      }
    },
  }), "sidebar-token-usage: balance route");

  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: ROUTE,
    handler: async (request, response) => {
      const sessionId = new URL(request.url, "http://localhost").searchParams.get("session");
      if (sessionId === null || sessionId === "") {
        writeJson(response, 400, { ok: false, error: "session is required" });
        return;
      }
      try {
        const entry = await foldSession(sessionId);
        writeJson(response, 200, { ok: true, models: entry.models, latest: entry.latest });
      } catch (error) {
        writeJson(response, 404, { ok: false, error: String(error?.message ?? error) });
      }
    },
  }), "sidebar-token-usage: per-model route");

  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: LATEST_ROUTE,
    handler: async (request, response) => {
      const sessionId = new URL(request.url, "http://localhost").searchParams.get("session");
      if (sessionId === null || sessionId === "") {
        writeJson(response, 400, { ok: false, error: "session is required" });
        return;
      }
      try {
        const entry = await foldSession(sessionId, true);
        writeJson(response, 200, { ok: true, latest: entry.latest });
      } catch (error) {
        writeJson(response, 404, { ok: false, error: String(error?.message ?? error) });
      }
    },
  }), "sidebar-token-usage: latest exchange route");

  // ---- sidebar chrome: can this process restart the desktop app? --------------
  let restarting = false;

  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: RESTART_STATUS_ROUTE,
    handler: async (_request, response) => {
      const target = await resolveDesktopTarget();
      writeJson(response, 200, { ok: true, desktop: target !== undefined });
    },
  }), "sidebar-token-usage: restart status route");

  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: RESTART_ROUTE,
    handler: async (request, response) => {
      if (request.method !== "POST") {
        writeJson(response, 405, { ok: false, reason: "method" });
        return;
      }
      if (restarting) {
        writeJson(response, 409, { ok: false, reason: "restarting" });
        return;
      }
      const target = await resolveDesktopTarget();
      if (target === undefined) {
        writeJson(response, 200, { ok: false, reason: "not-desktop" });
        return;
      }
      restarting = true;
      writeJson(response, 200, { ok: true });
      setTimeout(() => {
        scheduleRelaunch(target).catch((error) => {
          restarting = false;
          console.error("sidebar-token-usage: relaunch failed", error);
        });
      }, 400);
    },
  }), "sidebar-token-usage: restart route");
}
