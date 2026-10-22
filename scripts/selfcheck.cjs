#!/usr/bin/env node
// Self-check for lib/client.js: loads the browser half under a fake Module Loader,
// a fake `react` and a fake client cordis ctx, then exercises the real formatters,
// aggregations and registered components. No build step, no dependencies.
"use strict";

const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const clientPath = path.join(__dirname, "..", "lib", "client.js");
const source = fs.readFileSync(clientPath, "utf8");

let loaded;
globalThis.window = {
  __ModuleLoader__: {
    load(entry) {
      loaded = entry;
    }
  }
};

// eslint-disable-next-line no-eval
eval(source);

assert.ok(loaded !== undefined, "Module Loader was never called");
assert.strictEqual(loaded.id, "dsh-sidebar-token-usage");
assert.strictEqual(typeof loaded.factory, "function");

const styleTags = [];
// A tiny hook runtime: one render pass owns an index, so a second pass sees what
// the first pass's effect wrote. Reset the index before every render.
let hookStates = [];
let hookIndex = 0;
const fakeReact = {
  createElement: (type, props, children) => ({ type, props: props || {}, children }),
  useSyncExternalStore: (subscribe, getSnapshot) => getSnapshot(),
  useMemo: (factory) => factory(),
  useState: (initial) => {
    const index = hookIndex;
    hookIndex += 1;
    if (!(index in hookStates)) hookStates[index] = initial;
    return [hookStates[index], (next) => {
      hookStates[index] = typeof next === "function" ? next(hookStates[index]) : next;
    }];
  },
  useEffect: (effect) => { effect(); },
  memo: (value) => value,
  useRef: (initial) => ({ current: initial })
};
// No ambient network in the unit test: every model request is stubbed explicitly.
globalThis.fetch = undefined;

const modules = { react: fakeReact };
const plugin = loaded.factory((name) => {
  if (name in modules) return modules[name];
  throw new Error("unexpected require: " + name);
});

assert.deepStrictEqual(plugin.inject, ["slots", "locale", "sessions"]);
assert.strictEqual(typeof plugin.apply, "function");

// ---- fake sessions list -------------------------------------------------------
const sessions = {
  alice: { uncachedInputTokens: 1200, outputTokens: 340, cacheReadTokens: 200, cacheWriteTokens: 60 },
  bob: { uncachedInputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
  carol: undefined
};
const pressures = {
  alice: { pressureTokens: 1200, projectedTokens: 1300, contextWindow: 64000 },
  bob: { projectedTokens: 400, contextWindow: 128000 }
};
let snapshot = {
  ids: ["alice", "bob", "carol", "dave"],
  byId: {
    alice: {
      id: "alice",
      cwd: "D:\\work\\demo",
      updatedAt: Date.now() - 60 * 1000,
      projectionValues: {
        tokenUsage: sessions.alice,
        contextPressure: pressures.alice,
        modelSelection: { lastUsed: { provider: "deepseek-account", model: "deepseek-flash", reasoningEffort: "high" }, pending: null },
        sessionStats: { turns: 13, steps: 78, llmMs: 755000, toolMs: 770000, ttftMs: 622782, ttftSteps: 72, decodeMs: 132000, decodeTokens: 36000 },
        permissions: { preset: "workspace-write" },
        agentPreset: "standard"
      }
    },
    bob: { id: "bob", updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000, projectionValues: { tokenUsage: sessions.bob, contextPressure: pressures.bob } },
    carol: { id: "carol", projectionValues: {} },
    dave: { id: "dave" }
  }
};

const originalSnapshot = snapshot;
const listeners = new Set();
const list = {
  getSnapshot: () => snapshot,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

const registrations = [];
const dictionaries = [];
const effects = [];
let disposerCalls = 0;

const fakeDocument = {
  head: {
    appendChild: (tag) => { tag.parentNode = fakeDocument.head; },
    removeChild: (tag) => { disposerCalls += 1; }
  },
  createElement: () => ({ dataset: {}, textContent: "" }),
  querySelector: () => null
};
globalThis.document = fakeDocument;

const ctx = {
  sessions: { list },
  effect: (fn, label) => {
    const disposer = fn();
    effects.push({ label, disposer });
  },
  locale: {
    register: (ns, dicts) => {
      dictionaries.push({ ns, dicts });
      return () => {};
    },
    // Mirrors the real binder: resolve the key against the registered namespace.
    bind: (ns) => (key) => {
      const entry = dictionaries.find((item) => item.ns === ns);
      const dicts = entry === undefined ? undefined : entry.dicts;
      return dicts === undefined ? key : (dicts.zh[key] ?? key);
    }
  },
  slots: {
    inject: (name, factory) => {
      registrations.push({ name, registration: factory() });
      return () => {};
    },
    register: (definition, Component) => ({ definition, Component })
  }
};

plugin.apply(ctx);

assert.ok(dictionaries.every((entry) => entry.ns === "sidebarTokenUsage"));
assert.deepStrictEqual(dictionaries[0].dicts.zh === undefined, false);
assert.deepStrictEqual(
  Object.keys(dictionaries[0].dicts.zh).sort(),
  Object.keys(dictionaries[0].dicts.en).sort(),
  "zh/en dictionaries must share a key set"
);

const byName = new Map(registrations.map((entry) => [entry.name, entry.registration]));
for (const name of ["sidebar.session.row.leading", "sidebar.session.row.hover", "sidebar.footer.action"]) {
  assert.ok(byName.has(name), "missing slot registration: " + name);
  assert.strictEqual(byName.get(name).definition.id, "sidebar-token-usage");
  assert.strictEqual(byName.get(name).definition.locale, "sidebarTokenUsage");
  assert.strictEqual(typeof byName.get(name).Component, "function");
}

const dict = dictionaries[0].dicts.zh;
const t = (key) => dict[key] ?? key;

// The renderer binds each injected hook source as a use<Name> selector prop.
// A FUNCTION entry is a deferred factory invoked outside the component, which is
// how a hook called here would crash the slot — so this mirrors both branches.
function propsOf(registration, extra) {
  const injected = registration.definition.inject();
  const props = { ...extra };
  for (const [name, source] of Object.entries(injected.hooks || {})) {
    const hookName = "use" + name[0].toUpperCase() + name.slice(1);
    props[hookName] = typeof source === "function"
      ? source(undefined, undefined)
      : (selector) => selector(source.getSnapshot());
  }
  for (const [name, value] of Object.entries(injected)) {
    if (name !== "hooks") props[name] = value;
  }
  return props;
}

// ---- hook-source contract (regression for the silent-slot failure) ------------
// Every registration must pass the observable itself, never a wrapper function.
for (const name of ["sidebar.session.row.leading", "sidebar.session.row.hover", "sidebar.footer.action"]) {
  const injected = byName.get(name).definition.inject();
  const source = injected.hooks && injected.hooks.sessionList;
  assert.strictEqual(typeof source, "object", name + ": hooks.sessionList must be an observable source object");
  assert.ok(source !== null, name + ": hooks.sessionList must not be null");
  assert.strictEqual(typeof source.getSnapshot, "function", name + ": source needs getSnapshot()");
  assert.strictEqual(typeof source.subscribe, "function", name + ": source needs subscribe(fn)");
  assert.strictEqual(source, list, name + ": the source must be ctx.sessions.list itself");
}

// ---- settings section ---------------------------------------------------------
const settings = byName.get("settings.section");
assert.ok(settings !== undefined, "settings.section must be registered");
assert.strictEqual(settings.definition.id, "sidebar-token-usage");
assert.strictEqual(typeof settings.definition.label, "function", "the settings section needs a nav label");
assert.strictEqual(settings.definition.label(), dict["settings.title"]);

const settingsProps = propsOf(settings, {});
assert.strictEqual(typeof settingsProps.useFieldSettings, "function", "settings reads the field store");
assert.strictEqual(typeof settingsProps.setField, "function", "settings writes the field store");

/** Depth-first walk over a rendered tree, expanding inline function components. */
function walk(node, visit) {
  if (node === null || node === undefined || typeof node !== "object") return;
  visit(node);
  if (typeof node.type === "function" && node.props !== undefined) {
    walk(node.type(node.props), visit);
    return;
  }
  const children = node.children;
  if (Array.isArray(children)) for (const child of children) walk(child, visit);
  else if (children !== null && typeof children === "object") walk(children, visit);
}
/** Every checkbox label in render order. */
function checkboxes(tree) {
  const found = [];
  walk(tree, (node) => {
    if (typeof node.props?.className === "string" && node.props.className.split(" ").includes("stu-check")) found.push(node);
  });
  return found;
}

hookStates = [];
  hookIndex = 0;
const settingsTree = settings.Component({ ...settingsProps, t });
const boxes = checkboxes(settingsTree);
assert.strictEqual(boxes.length, 25, "one checkbox per configurable group across both scopes");
const checkedOf = (label) => label.children[0].props.checked;
assert.deepStrictEqual(
  boxes.map(checkedOf),
  // Order follows FIELD_OPTIONS: hover groups, then footer groups.
  [true, true, true, false, false, false, false, true, false, true, // hover: usage, context, model, cost, rowRing, byModel
   true, true, false, false, false, false, false, true, true,             // footer: sessions, tokens, cost, balance
   false, true, false, false, false, false],                              // footer: footPressure on, the rest off
  "defaults: the identity fields stay on, every new analytical group stays off"
);

// ---- live preview inside the settings page ------------------------------------
// The preview must render the real components, not a mock picture of them.
hookStates = [];
hookIndex = 0;
const previewTree = settings.Component({ ...settingsProps, t });
const marks = { hover: 0, footer: 0, hoverFrame: 0, footFrame: 0 };
walk(previewTree, (node) => {
  if (!node || !node.props) return;
  const cls = typeof node.props.className === "string" ? node.props.className.split(" ") : [];
  if (node.props["data-sidebar-token-usage"] === "hover") marks.hover += 1;
  if (node.props["data-sidebar-token-usage"] === "footer") marks.footer += 1;
  if (cls.includes("stu-preview-hover")) marks.hoverFrame += 1;
  if (cls.includes("stu-preview-foot")) marks.footFrame += 1;
});
assert.strictEqual(marks.hover, 1, "one preview renders a real hover card");
assert.strictEqual(marks.footer, 1, "one preview renders a real footer card");
assert.strictEqual(marks.hoverFrame, 1, "the hover preview sits in its own frame");
assert.strictEqual(marks.footFrame, 1, "the footer preview sits in its own frame");

// ---- component rendering ------------------------------------------------------
const leading = byName.get("sidebar.session.row.leading");
const leadingProps = propsOf(leading, {});
assert.strictEqual(typeof leadingProps.useSessionList, "function");
// With the ring off the pill is the slot child itself; with the ring on it is the
// wrapper's first child. Both shapes are legal, so read through either.
const badgeValue = (node) => (typeof node.children === "string" ? node.children : node.children[0].children);
const badgeProps = (node) => (typeof node.children === "string" ? node.props : node.children[0].props);
const badge = leading.Component({ ...leadingProps, sessionId: "alice", t });
assert.strictEqual(badge.props.className, "stu-inline", "with the ring off the pill is the slot child");
assert.strictEqual(typeof badge.children, "string", "no wrapper element sits between the slot and the pill");
assert.strictEqual(badgeValue(badge), "1.8K", "1200+340+200+60 = 1800 -> 1.8K");

// The badge releases the slot's fixed width through inline styles, which cannot
// depend on a hashed class name or on :has() support.
// Two narrow ancestors stand in for "a wrapper DSH inserts, then the slot box".
const innerStyle = { width: "16px", maxWidth: "16px", flex: "0 0 auto", justifyContent: "center", marginInlineStart: "" };
const outerStyle = { width: "16px", maxWidth: "16px", flex: "0 0 auto", justifyContent: "center", marginInlineStart: "" };
const rowStyle = { width: "320px", maxWidth: "", flex: "1 1 auto", justifyContent: "", marginInlineStart: "" };
const outerEl = { style: outerStyle, parentElement: { style: rowStyle, parentElement: null } };
const innerEl = { style: innerStyle, parentElement: outerEl };
const savedUseRef = fakeReact.useRef;
fakeReact.useRef = () => ({ current: { parentElement: innerEl } });
globalThis.getComputedStyle = (element) => ({ width: element.style.width });
hookStates = [];
hookIndex = 0;
leading.Component({ ...leadingProps, sessionId: "alice", t });
fakeReact.useRef = savedUseRef;
assert.strictEqual(innerStyle.width, "auto", "the inner narrow box is released");
assert.strictEqual(outerStyle.width, "auto", "the outer narrow box is released too");
assert.strictEqual(outerStyle.maxWidth, "none", "the outer width cap is released");
assert.strictEqual(rowStyle.width, "320px", "the row itself is never touched");

const badgeMissing = leading.Component({ ...leadingProps, sessionId: "dave", t });
assert.strictEqual(badgeValue(badgeMissing), "\u2014", "a Session with no projection renders a placeholder");

const badgeZero = leading.Component({ ...leadingProps, sessionId: "bob", t });
assert.strictEqual(badgeValue(badgeZero), "0", "an all-zero projection is a real 0, not a placeholder");

const hover = byName.get("sidebar.session.row.hover");
const hoverProps = propsOf(hover, {});
hookStates = [];
  hookIndex = 0;
const detail = hover.Component({ ...hoverProps, sessionId: "alice", t });
const detailValues = [];
for (const node of detail.children[0].children) detailValues.push(node.children);
assert.deepStrictEqual(detailValues, [
  dict["field.input"], "1,200",
  dict["field.output"], "340",
  dict["field.cacheRead"], "200",
  dict["field.cacheWrite"], "60",
  dict["field.context"], "1,200 / 64,000 \u00b7 2%"
]);

hookStates = [];
  hookIndex = 0;
const hoverMissing = hover.Component({ ...hoverProps, sessionId: "carol", t });
const missingValues = hoverMissing.children[0].children.map((node) => node.children);
assert.deepStrictEqual(missingValues.slice(1).filter((_, i) => i % 2 === 0), ["\u2014", "\u2014", "\u2014", "\u2014", "\u2014"]);

// Click mode keeps the shell's hover card empty; the detail lives in the popover.
settingsProps.setChoice("rowExpand", "click");
hookStates = [];
hookIndex = 0;
assert.strictEqual(
  hover.Component({ ...hoverProps, sessionId: "alice", t }),
  null,
  "click mode renders nothing into the Session hover card"
);
hookStates = [];
hookIndex = 0;
assert.ok(
  hover.Component({ ...hoverProps, sessionId: "alice", t, alwaysShow: true }) !== null,
  "the click popover and the settings preview still render the detail"
);
settingsProps.setChoice("rowExpand", "hover");

const footer = byName.get("sidebar.footer.action");
const footerProps = propsOf(footer, {});
hookStates = [];
  hookIndex = 0;
const card = footer.Component({ ...footerProps, wide: true, t });
assert.strictEqual(card.props["data-wide"], "true");
const byClass = (tree, name) => tree.children.find((node) => node !== null && node.props && node.props.className === name);
const cardDetail = byClass(card, "stu-foot-detail");
assert.ok(cardDetail !== undefined, "the footer keeps its expandable detail");
const cardValues = cardDetail.children[1].children.map((node) => node.children);
assert.deepStrictEqual(cardValues, [
  dict["field.sessions"], "4",
  dict["field.total"], "1,800",
  dict["field.input"], "1.2K",
  dict["field.output"], "340",
  dict["field.cacheRead"], "200",
  dict["field.cacheWrite"], "60"
]);

// The collapsed face also names the Session the main view holds.
const currentLine = byClass(card, "stu-foot-current");
assert.ok(currentLine !== undefined, "the collapsed footer carries the current Session");
const currentRow = byClass(currentLine, "stu-foot-current-row");
assert.ok(currentRow !== undefined, "the current Session row keeps its own layout box");
const currentTitleNode = byClass(currentRow, "stu-foot-current-title");
const currentValueNode = byClass(currentRow, "stu-foot-current-value");
assert.strictEqual(currentRow.children[0].children, dict["foot.current"]);
assert.strictEqual(currentTitleNode, undefined, "a Session without a title renders no title node");
assert.match(String(currentValueNode.children), /^1\.8K( \u00b7 \u00a5)?/, "the current line shows that Session's own usage");
assert.strictEqual(byClass(currentLine, "stu-foot-latest-row"), undefined, "no latest line while no Host reading is available");

// With a latest settlement the collapsed face shows the compact chip + price.
hookStates = [];
hookIndex = 0;
const latestCard = footer.Component({
  ...footerProps,
  wide: true,
  t,
  previewLatest: {
    usage: { uncachedInputTokens: 12400, outputTokens: 3100, cacheReadTokens: 486000, cacheWriteTokens: 0 },
    routes: [{
      provider: "deepseek-account",
      model: "deepseek-flash",
      usage: { uncachedInputTokens: 12400, outputTokens: 3100, cacheReadTokens: 486000, cacheWriteTokens: 0 }
    }]
  }
});
const latestLine = byClass(byClass(latestCard, "stu-foot-current"), "stu-foot-latest-row");
assert.ok(latestLine !== undefined, "the latest exchange renders under the current Session");
const latestChip = byClass(latestLine, "stu-foot-latest-chip");
const latestPrice = byClass(latestLine, "stu-foot-latest-price");
assert.strictEqual(latestChip.children, dict["latest.usage"] + " 501.5K " + dict["latest.tok"], "the chip stays short");
assert.match(String(latestPrice.children), /^\u00a5/, "the price sits on the right, got " + latestPrice.children);

// Clicking the chip opens the detailed card without toggling the footer.
let stopped = false;
latestChip.props.onClick({
  stopPropagation: () => { stopped = true; },
  currentTarget: { getBoundingClientRect: () => ({ left: 80, top: 500 }) }
});
assert.strictEqual(stopped, true, "the chip click must not bubble into the footer toggle");
const latestReg = registrations.find((entry) => entry.name === "shell.overlay" && entry.registration.definition.id === "sidebar-token-usage-latest");
assert.ok(latestReg !== undefined, "the latest detail rides shell.overlay");
const latestProps = propsOf(latestReg.registration, {});
hookStates = [];
hookIndex = 0;
const latestTree = latestReg.registration.Component({ ...latestProps, t });
assert.ok(latestTree !== null, "the detail card renders after the chip opens it");
assert.strictEqual(latestTree.props["data-sidebar-token-usage"], "latest");
const latestCardNode = latestTree.children;
const latestHead = byClass(latestCardNode, "stu-latest-head");
assert.strictEqual(byClass(latestHead, "stu-latest-title").children, dict["latest.title"]);
assert.strictEqual(byClass(latestHead, "stu-latest-total").children, "501,500 tok");
const latestRowValues = [];
walk(latestCardNode, (node) => {
  if (node && node.type === "dd") latestRowValues.push(node.children);
});
assert.deepStrictEqual(latestRowValues, [
  "deepseek-account/deepseek-flash",
  "97.5%",
  "12,400 tok",
  "486,000 tok",
  "0 tok",
  "3,100 tok"
]);
latestProps.closeLatest();
hookStates = [];
hookIndex = 0;
assert.strictEqual(latestReg.registration.Component({ ...latestProps, t }), null, "closing clears the detail card");

hookStates = [];
  hookIndex = 0;
const railCard = footer.Component({ ...footerProps, wide: false, t });
assert.strictEqual(railCard.props["data-wide"], "false");

// ---- footer expand trigger (hover vs click) -----------------------------------
assert.strictEqual(card.props["data-expand"], "hover", "hover is the default footer trigger");
assert.strictEqual(card.props["data-open"], "false", "a hover card carries no sticky open state");
settingsProps.setChoice("footExpand", "click");
hookStates = [];
hookIndex = 0;
const clickFoot = footer.Component({ ...footerProps, wide: true, t });
assert.strictEqual(clickFoot.props["data-expand"], "click", "the footer follows the stored trigger");
assert.strictEqual(clickFoot.props["data-clickable"], "true");
assert.strictEqual(clickFoot.props.role, "button");
assert.strictEqual(clickFoot.props["aria-expanded"], "false");
assert.strictEqual(clickFoot.props["data-open"], "false", "a click footer starts closed");
clickFoot.props.onClick();
hookIndex = 0;
const openedFoot = footer.Component({ ...footerProps, wide: true, t });
assert.strictEqual(openedFoot.props["data-open"], "true", "a click opens the detail");
assert.strictEqual(openedFoot.props["aria-expanded"], "true");
const openedMain = openedFoot.children[0];
assert.strictEqual(openedMain.props.onClick, undefined, "the moving main row is not the only click target");
openedFoot.props.onClick();
hookIndex = 0;
assert.strictEqual(footer.Component({ ...footerProps, wide: true, t }).props["data-open"], "false", "a second click closes it");
settingsProps.setChoice("footExpand", "hover");
hookStates = [];
hookIndex = 0;

// ---- footer range tabs --------------------------------------------------------
const tabsOf = (tree) => {
  const out = [];
  walk(tree, (node) => {
    if (typeof node.props?.["data-stu-tab"] === "string") out.push(node);
  });
  return out;
};
const renderFoot = () => {
  hookStates = [];
  hookIndex = 0;
  return footer.Component({ ...footerProps, wide: true, t });
};
/** The 会话数 value from the main list. */
const sessionCountOf = (tree) => {
  const detail = tree.children.find((node) => node.props && node.props.className === "stu-foot-detail");
  return detail.children[1].children.map((node) => node.children)[1];
};
/** The collapsed face's label, which names the active range. */
const mainLabelOf = (tree) => tree.children[0].children[0].children;

const tabs = tabsOf(card);
assert.deepStrictEqual(tabs.map((node) => node.props["data-stu-tab"]), ["all", "week", "day"], "three range tabs");
assert.deepStrictEqual(
  tabs.map((node) => node.children),
  [dict["range.all"], dict["range.week"], dict["range.day"]],
  "tab labels come from the locale"
);
assert.strictEqual(tabs[0].props["aria-selected"], "true", "All is the default tab");
assert.strictEqual(sessionCountOf(card), "4", "All counts every listed Session");
assert.strictEqual(mainLabelOf(card), dict["footer.label"], "the default label covers all Sessions");

tabs[1].props.onClick({ stopPropagation() {} });
const weekCard = renderFoot();
assert.strictEqual(sessionCountOf(weekCard), "2", "the 7-day tab keeps alice (1m) and bob (3d)");
assert.strictEqual(tabsOf(weekCard)[1].props["aria-selected"], "true", "the clicked tab becomes active");
assert.strictEqual(mainLabelOf(weekCard), dict["footer.labelWeek"], "the label follows the 7-day range");

tabsOf(weekCard)[2].props.onClick({ stopPropagation() {} });
const dayCard = renderFoot();
assert.strictEqual(sessionCountOf(dayCard), "1", "the 24-hour tab keeps only alice");
assert.strictEqual(mainLabelOf(dayCard), dict["footer.labelDay"], "the label follows the 24-hour range");

// back to All so later assertions see the full window
tabsOf(dayCard)[0].props.onClick({ stopPropagation() {} });
assert.strictEqual(sessionCountOf(renderFoot()), "4", "All restores the full count");

// ---- display choices ----------------------------------------------------------
hookStates = [];
hookIndex = 0;
const settingsForChoices = settings.Component({ ...settingsProps, t });
const choiceRows = [];
const segButtons = [];
walk(settingsForChoices, (node) => {
  if (!node || !node.props) return;
  if (typeof node.props["data-stu-choice-row"] === "string") choiceRows.push(node.props["data-stu-choice-row"]);
  if (typeof node.props["data-stu-choice"] === "string") segButtons.push(node.props["data-stu-choice"]);
});
assert.deepStrictEqual(choiceRows, ["rowMetric", "rowExpand", "footMetric", "footerRange", "footExpand"], "five single-choice settings");
assert.deepStrictEqual(
  segButtons,
  [
    "rowMetric:tokens", "rowMetric:cost",
    "rowExpand:hover", "rowExpand:click",
    "footMetric:tokens", "footMetric:cost",
    "footerRange:all", "footerRange:week", "footerRange:day",
    "footExpand:hover", "footExpand:click"
  ],
  "2 + 2 + 2 + 3 + 2 segmented buttons"
);

// The row badge follows the chosen metric.
settingsProps.setChoice("rowMetric", "cost");
hookStates = [];
hookIndex = 0;
const costBadge = leading.Component({ ...leadingProps, sessionId: "alice", t });
assert.strictEqual(costBadge.props["data-metric"], "cost", "the badge reports the configured metric");
assert.match(String(badgeValue(costBadge)), /^\u00a50\.\d+$/, "a priced Session renders CNY, got " + costBadge.children);
hookStates = [];
hookIndex = 0;
assert.strictEqual(
  badgeProps(leading.Component({ ...leadingProps, sessionId: "dave", t }))["data-unknown"],
  "true",
  "a Session without projections stays a placeholder under the cost metric"
);
settingsProps.setChoice("rowMetric", "tokens");
hookStates = [];
hookIndex = 0;
assert.strictEqual(badgeValue(leading.Component({ ...leadingProps, sessionId: "alice", t })), "1.8K", "switching back restores the token count");

// The footer main figure follows the same choice.
settingsProps.setChoice("footMetric", "cost");
const costFoot = renderFoot();
// The main line now nests the figure in a right-hand group so the ring can sit beside it.
// The right group may hold a ring and a percentage before the figure; find the
// figure by its marker instead of a fixed index.
const footTotal = (card) => {
  const right = card.children[0].children[1];
  for (const node of right.children) {
    if (node && node.props && node.props["data-metric"] !== undefined) return node;
  }
  return undefined;
};
const costTotal = footTotal(costFoot);
assert.strictEqual(costTotal.props["data-metric"], "cost");
assert.match(String(costTotal.children), /^\u00a5/, "the footer total renders CNY, got " + costTotal.children);
settingsProps.setChoice("footMetric", "tokens");
assert.strictEqual(footTotal(renderFoot()).children, "1.8K", "switching back restores the compact token total");

// The range tab and the segmented control are one setting.
settingsProps.setChoice("footerRange", "day");
assert.strictEqual(sessionCountOf(renderFoot()), "1", "the stored range drives the aggregate");
hookStates = [];
hookIndex = 0;
const ranged = settings.Component({ ...settingsProps, t });
const activeSeg = [];
walk(ranged, (node) => {
  if (node && node.props && node.props["data-stu-choice"] === "footerRange:day") activeSeg.push(node.props["aria-pressed"]);
});
assert.deepStrictEqual(activeSeg, ["true"], "the segmented control reflects the stored range");
settingsProps.setChoice("footerRange", "all");

// ---- style lifecycle ----------------------------------------------------------
assert.strictEqual(styleTags.length, 0);
assert.strictEqual(effects.length, 2, "one dictionary effect and one style effect");
for (const effect of effects) {
  if (typeof effect.disposer === "function") effect.disposer();
}
assert.strictEqual(disposerCalls, 1, "the style disposer must remove the injected <style>");

assert.strictEqual(listeners.size, 0, "apply must not subscribe on its own");

const cssText = fs.readFileSync(clientPath, "utf8");
assert.ok(!/#[0-9a-fA-F]{3,8}\b/.test(cssText.replace(/\\u[0-9a-fA-F]{4}/g, "")), "no hard-coded hex colors");
assert.ok(
  !cssText.includes(".stu-preview-hover,.stu-preview-foot"),
  "the footer preview must not sit in the framed box any more"
);

// ---- compact formatter table (acceptance criterion 4) -------------------------
function badgeFor(value) {
  snapshot = { ids: ["probe"], byId: { probe: { id: "probe", projectionValues: { tokenUsage: { uncachedInputTokens: value, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 } } } } };
  return badgeValue(leading.Component({ ...leadingProps, sessionId: "probe", t }));
}
const table = [
  [0, "0"],
  [7, "7"],
  [999, "999"],
  [1000, "1K"],
  [1234, "1.2K"],
  [15000, "15K"],
  [999949, "999.9K"],
  [999950, "1M"],
  [999999, "1M"],
  [1000000, "1M"],
  [1234567, "1.2M"],
  [1200000, "1.2M"],
  [999950000, "1B"],
  [999999999, "1B"],
  [2500000000, "2.5B"]
];
for (const [input, expected] of table) {
  assert.strictEqual(badgeFor(input), expected, "formatCount(" + input + ")");
}

// A Session whose tokenUsage carries a non-numeric bucket must render the placeholder,
// not a computed number: this covers undefined/NaN/Infinity/string inputs.
function badgeForRaw(tokenUsage) {
  snapshot = { ids: ["probe"], byId: { probe: { id: "probe", projectionValues: { tokenUsage } } } };
  return badgeValue(leading.Component({ ...leadingProps, sessionId: "probe", t }));
}
const unknownCases = [
  ["undefined", undefined],
  ["NaN", NaN],
  ["Infinity", Infinity],
  ["string", "1234"]
];
for (const [name, bad] of unknownCases) {
  assert.strictEqual(badgeForRaw({ uncachedInputTokens: bad }), "\u2014", "non-numeric bucket (" + name + ") must render the placeholder");
}
assert.strictEqual(badgeForRaw(undefined), "\u2014", "absent tokenUsage must render the placeholder");


const flush = () => new Promise((resolve) => setImmediate(resolve));

/** Render the hover card twice: the first pass starts the request, the second sees the answer. */
async function resolvedHover(sessionId) {
  hookStates = [];
  hookIndex = 0;
  hover.Component({ ...hoverProps, sessionId, t });
  await flush();
  // Keep the hook table: the resolved models live in the first pass's state.
  hookIndex = 0;
  return hover.Component({ ...hoverProps, sessionId, t });
}

(async () => {
  // Earlier formatter probes replaced the fixture; restore the full Session set.
  snapshot = originalSnapshot;

  // ---- context ring / click popover / latest detail ---------------------------
  const shells = registrations.filter((entry) => entry.name === "shell.overlay");
  assert.strictEqual(shells.length, 2, "the session popover and the latest detail ride shell.overlay");
  const popReg = shells.find((entry) => entry.registration.definition.id === "sidebar-token-usage-popover");
  assert.ok(popReg !== undefined, "the overlay registration carries its own id");

  // The ring appears only when enabled, and marks a Session near compaction.
  settingsProps.setField("rowRing", true);
  hookStates = [];
  hookIndex = 0;
  const ringBadge = leading.Component({ ...leadingProps, sessionId: "alice", t });
  const expand = (node) => (typeof node.type === "function" ? node.type(node.props) : node);
  const ring = expand(ringBadge.children[1]);
  assert.strictEqual(ring.type, "svg", "the ring is an SVG");
  assert.strictEqual(ring.props["data-tight"], "false", "alice sits at 2%, not tight");
  snapshot.byId.alice.projectionValues.contextPressure = { pressureTokens: 60000, contextWindow: 64000 };
  hookStates = [];
  hookIndex = 0;
  assert.strictEqual(
    expand(leading.Component({ ...leadingProps, sessionId: "alice", t }).children[1]).props["data-tight"],
    "true",
    "a Session past 80% of its window is marked tight"
  );
  snapshot.byId.alice.projectionValues.contextPressure = pressures.alice;
  settingsProps.setField("rowRing", false);

  // Clicking the badge opens the popover for that Session.
  hookStates = [];
  hookIndex = 0;
  leading.Component({ ...leadingProps, sessionId: "alice", t }).props.onClick({ stopPropagation() {}, clientX: 120, clientY: 300 });
  const popProps = propsOf(popReg.registration, {});
  hookStates = [];
  hookIndex = 0;
  const popTree = popReg.registration.Component({ ...popProps, t });
  assert.ok(popTree !== null, "the popover renders while open");
  assert.strictEqual(popTree.props["data-sidebar-token-usage"], "popover");
  assert.strictEqual(popTree.children.props.style.left, "80px", "the card is anchored near the click");
  popProps.closePopover();
  hookStates = [];
  hookIndex = 0;
  assert.strictEqual(popReg.registration.Component({ ...popProps, t }), null, "closing clears the popover");

  // ---- per-model section ------------------------------------------------------
  const calls = [];
  const body = {
    ok: true,
    models: [
      { model: "deepseek-flash", total: 1500000 },
      { model: "deepseek-v4.1-flash-free", total: 4200 }
    ]
  };
  globalThis.fetch = (url) => {
    calls.push(String(url));
    return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
  };

  hookStates = [];
  hookIndex = 0;
  const loadingCard = hover.Component({ ...hoverProps, sessionId: "alice", t });
  assert.strictEqual(calls.length, 1, "the hover card must request models exactly once");
  assert.strictEqual(calls[0], "/api/sidebar-token-usage/models?session=alice", "unexpected models URL");
  /** Find one rendered section by its data-stu-section marker. */
  function sectionOf(tree, name) {
    for (const node of tree.children) {
      if (node === null || node === undefined) continue;
      if (node.props && node.props["data-stu-section"] === name) return node;
    }
    return undefined;
  }

  assert.ok(sectionOf(loadingCard, "byModel") !== undefined, "the card shows a placeholder while the Host answers");

  const answeredCard = await resolvedHover("alice");
  const section = sectionOf(answeredCard, "byModel");
  assert.ok(section !== undefined, "the resolved card must carry the per-model section");
  const modelRows = section.children[1].children.map((node) => node.children);
  assert.deepStrictEqual(modelRows, ["deepseek-flash", "1.5M", "deepseek-v4.1-flash-free", "4.2K"]);

  // The other groups are off by default and must not render.
  assert.strictEqual(sectionOf(answeredCard, "cache"), undefined, "cache group is off by default");
  assert.strictEqual(sectionOf(answeredCard, "activity"), undefined, "activity group is off by default");
  assert.strictEqual(sectionOf(answeredCard, "speed"), undefined, "speed group is off by default");
  assert.strictEqual(sectionOf(answeredCard, "env"), undefined, "env group is off by default");
  // Default-on groups render.
  assert.ok(sectionOf(answeredCard, "main") !== undefined, "usage/context group is on by default");
  assert.ok(sectionOf(answeredCard, "model") !== undefined, "model group is on by default");

  const modelGroup = sectionOf(answeredCard, "model");
  const modelValues = modelGroup.children[0].children.map((node) => node.children);
  assert.deepStrictEqual(modelValues, [dict["field.model"], "deepseek-flash", dict["field.effort"], "high"]);

  // ---- estimated cost ---------------------------------------------------------
  const costSection = sectionOf(answeredCard, "cost");
  assert.ok(costSection !== undefined, "a priced DeepSeek route renders the cost group");
  const costValue = costSection.children[0].children.map((node) => node.children)[1];
  assert.match(costValue, /^\u00a50\.\d+$/, "cost reads as CNY, got " + costValue);

  // A route without a price row must stay silent rather than show a fake number.
  const priced = snapshot.byId.alice.projectionValues.modelSelection.lastUsed.provider;
  snapshot.byId.alice.projectionValues.modelSelection.lastUsed.provider = "our-free-model";
  const unpricedCard = await resolvedHover("alice");
  assert.strictEqual(sectionOf(unpricedCard, "cost"), undefined, "an unpriced provider shows no cost group");
  snapshot.byId.alice.projectionValues.modelSelection.lastUsed.provider = priced;

  // Flipping a checkbox in the settings section must reach the hover card.
  settingsProps.setField("cache", true);
  settingsProps.setField("activity", true);
  const toggled = await resolvedHover("alice");
  assert.ok(sectionOf(toggled, "cache") !== undefined, "enabling cache renders the cache group");
  assert.ok(sectionOf(toggled, "activity") !== undefined, "enabling activity renders the activity group");
  const activityRows = sectionOf(toggled, "activity").children[0].children.map((node) => node.children);
  assert.deepStrictEqual(activityRows, [dict["field.turns"], "13", dict["field.steps"], "78", dict["field.duration"], "25m 25s"]);
  const cacheRows = sectionOf(toggled, "cache").children[0].children.map((node) => node.children);
  assert.deepStrictEqual(cacheRows, [dict["field.cacheHit"], "14%"], "cacheRead 200 / (200 + 1200 + 60) rounds to 14%");
  hookStates = [];
  hookIndex = 0;
  const toggledBoxes = checkboxes(settings.Component({ ...settingsProps, t }));
  assert.strictEqual(toggledBoxes[3].children[0].props.checked, true, "the checkbox reflects the stored flag");
  settingsProps.setField("cache", false);
  settingsProps.setField("activity", false);

  globalThis.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true, models: [] }) });
  assert.strictEqual(sectionOf(await resolvedHover("bob"), "byModel"), undefined, "no models -> no section");

  globalThis.fetch = () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
  assert.strictEqual(sectionOf(await resolvedHover("bob"), "byModel"), undefined, "a failed request -> no section");

  // ---- footer card groups -----------------------------------------------------
  function findSection(tree, name) {
    let hit;
    walk(tree, (node) => {
      if (hit === undefined && node.props && node.props["data-stu-section"] === name) hit = node;
    });
    return hit;
  }
  const renderFooter = (wide) => {
    hookStates = [];
  hookIndex = 0;
    return footer.Component({ ...footerProps, wide, t });
  };

  assert.strictEqual(findSection(renderFooter(true), "footStatus"), undefined, "status group is off by default");
  for (const id of ["footStatus", "footActivity", "footSpeed", "footCache", "footModels", "footTop", "footPressure", "footAvg", "footSpan", "footEnv"]) settingsProps.setField(id, true);
  const footFull = renderFooter(true);
  const statusRows = findSection(footFull, "footStatus").children[0].children.map((node) => node.children);
  assert.deepStrictEqual(statusRows, [dict["field.running"], "0", dict["field.archived"], "0"]);
  const footActivityRows = findSection(footFull, "footActivity").children[0].children.map((node) => node.children);
  assert.deepStrictEqual(footActivityRows, [dict["field.turns"], "13", dict["field.steps"], "78", dict["field.duration"], "25m 25s"]);
  const footSpeedRows = findSection(footFull, "footSpeed").children[0].children.map((node) => node.children);
  assert.deepStrictEqual(footSpeedRows, [dict["field.ttft"], "9s", dict["field.speed"], "273 tok/s"]);
  assert.deepStrictEqual(
    findSection(footFull, "footCache").children[0].children.map((node) => node.children),
    [dict["field.cacheHit"], "14%"]
  );
  assert.deepStrictEqual(
    findSection(footFull, "footModels").children[0].children.map((node) => node.children),
    ["deepseek-flash", "1 " + dict["unit.sessions"] + " \u00b7 1.8K"]
  );
  assert.match(
    findSection(footFull, "footCost").children[0].children.map((node) => node.children)[1],
    /^\u00a50\.\d+$|^\u00a50$/,
    "the footer totals the estimated cost of priced routes"
  );
  // New groups: ranking, context pressure, per-session average, span, environment spread.
  const topRows = findSection(footFull, "footTop").children[0].children.map((node) => node.children);
  assert.strictEqual(topRows.length, 2, "one row per priced Session: a name and its cost");
  assert.match(String(topRows[1]), /^\u00a50\.\d+$/, "the ranked row carries CNY");
  assert.match(
    findSection(footFull, "footPressure").children[0].children.map((node) => node.children)[1],
    /^\d+%$/,
    "context pressure renders as a percentage"
  );
  const avgRows = findSection(footFull, "footAvg").children[0].children.map((node) => node.children);
  assert.deepStrictEqual(avgRows.slice(0, 2), [dict["field.avg"], "450"], "1800 tokens over 4 Sessions averages 450");
  assert.deepStrictEqual(avgRows.slice(2), [dict["field.outputShare"], "19%"], "340 of 1800 tokens is output");
  assert.match(
    findSection(footFull, "footSpan").children[0].children.map((node) => node.children)[1],
    /^\d{2}-\d{2} \d{2}:\d{2} ~ \d{2}-\d{2} \d{2}:\d{2}$/,
    "the span reads as two stamps"
  );
  const envRows = findSection(footFull, "footEnv").children[0].children.map((node) => node.children);
  assert.deepStrictEqual(envRows, [dict["field.presetSpread"], "standard 1", dict["field.permissionSpread"], "workspace-write 1"]);

  // Context occupancy is a default-on footer group.
  assert.ok(findSection(footFull, "footPressure") !== undefined, "context occupancy renders without being enabled");

  // Turning the ring on adds the numeric readout beside it.
  settingsProps.setField("footRing", true);
  const withRing = renderFooter(true);
  let pressureText;
  walk(withRing, (node) => {
    if (pressureText === undefined && node && node.props && node.props["data-stu-pressure"] === "footer") pressureText = node.children;
  });
  assert.match(String(pressureText), /^\d+%$/, "the footer shows the context percentage next to the ring");
  settingsProps.setField("footRing", false);

  assert.strictEqual(renderFooter(false).props["data-wide"], "false", "the rail state still reaches the card");
  for (const id of ["footStatus", "footActivity", "footSpeed", "footCache", "footModels", "footTop", "footPressure", "footAvg", "footSpan", "footEnv"]) settingsProps.setField(id, false);

  // ---- editable price table ---------------------------------------------------
  hookStates = [];
  hookIndex = 0;
  const priceTree = settings.Component({ ...settingsProps, t });
  const priceInputs = [];
  walk(priceTree, (node) => {
    if (node && node.props && typeof node.props["data-stu-price"] === "string" && node.props.type === "number") priceInputs.push(node);
  });
  assert.strictEqual(priceInputs.length, 12, "two rows times three columns times two tiers");
  const byKey = (key) => priceInputs.find((node) => node.props["data-stu-price"] === key);
  assert.strictEqual(byKey("flash.cacheHit.peak").props.value, "0.04", "published flash cache-hit peak is pre-filled");
  assert.strictEqual(byKey("flash.inputMiss.offPeak").props.value, "1", "published flash input off-peak is pre-filled");
  assert.strictEqual(byKey("pro.output.peak").props.value, "27", "published v4-pro output peak is pre-filled");

  // Doubling every flash number must double the estimate for a flash Session.
  const costOf = async (id) => {
    const card2 = await resolvedHover(id);
    const node = sectionOf(card2, "cost");
    return node === undefined ? undefined : Number(node.children[0].children.map((n) => n.children)[1].replace("\u00a5", ""));
  };
  const before = await costOf("alice");
  const flashKeys = priceInputs
    .filter((node) => node.props["data-stu-price"].indexOf("flash.") === 0)
    .map((node) => [node.props["data-stu-price"], Number(node.props.value)]);
  for (const [key, value] of flashKeys) {
    const parts = key.split(".");
    settingsProps.setPrice(parts[0], parts[1], parts[2], value * 2);
  }
  const doubled = await costOf("alice");
  assert.ok(doubled > before * 1.9 && doubled < before * 2.1, "doubling the flash row doubles the estimate: " + before + " -> " + doubled);
  for (const [key, value] of flashKeys) {
    const parts = key.split(".");
    settingsProps.setPrice(parts[0], parts[1], parts[2], value);
  }
  assert.ok(Math.abs((await costOf("alice")) - before) < 1e-9, "restoring the numbers restores the estimate");

  // A route list that no longer names the provider must silence pricing entirely.
  settingsProps.setProviders("no-such-provider");
  assert.strictEqual(sectionOf(await resolvedHover("alice"), "cost"), undefined, "a route outside the price list shows no cost");
  settingsProps.setProviders("deepseek-account, deepseek-official, llm-deepseek");

  // ---- host half --------------------------------------------------------------
  const { pathToFileURL } = require("node:url");
  const host = await import(pathToFileURL(path.join(__dirname, "..", "lib", "index.js")).href);
  assert.strictEqual(typeof host.apply, "function");
  assert.deepStrictEqual(host.inject, ["sessionQuery", "webServer"]);

  const routes = [];
  const hostCtx = {
    effect: (fn) => { fn(); },
    webServer: { register: (value) => { routes.push(value); return () => {}; } }
  };
  const log = {
    events: [
      { type: "assistant/message", data: { message: { source: { model: "m-one" } }, usage: { inputTokens: 10, outputTokens: 5, cacheReadTokens: 100, cacheWriteTokens: 0 } } },
      { type: "assistant/message", data: { message: { source: { model: "m-two" } }, usage: { inputTokens: 7, outputTokens: 3 } } },
      { type: "assistant/message", data: { message: { source: { model: "m-one" } }, usage: { inputTokens: 1, outputTokens: 1, cacheReadTokens: 2 } } }
    ]
  };
  hostCtx.sessionQuery = {
    readSession: () => Promise.resolve(log)
  };
  host.apply(hostCtx);

  assert.deepStrictEqual(
    routes.map((value) => value.path).sort(),
    ["/api/sidebar-token-usage/balance", "/api/sidebar-token-usage/diag", "/api/sidebar-token-usage/latest", "/api/sidebar-token-usage/models"],
    "the host half serves models, the latest exchange, balance and the layout diagnostic"
  );
  const route = routes.find((value) => value.path === "/api/sidebar-token-usage/models");
  const latestRoute = routes.find((value) => value.path === "/api/sidebar-token-usage/latest");
  const balanceRoute = routes.find((value) => value.path === "/api/sidebar-token-usage/balance");
  assert.strictEqual(route.kind, "exact");
  assert.strictEqual(typeof route.handler, "function");
  assert.strictEqual(latestRoute.kind, "exact");
  assert.strictEqual(balanceRoute.kind, "exact");

  const balanceAnswer = await callRoute(balanceRoute, "/api/sidebar-token-usage/balance");
  assert.strictEqual(balanceAnswer.status, 200);
  const balanceBody = JSON.parse(balanceAnswer.body);
  assert.strictEqual(typeof balanceBody.ok, "boolean", "the balance route always answers a well-formed body");
  if (balanceBody.ok === true) {
    assert.strictEqual(typeof balanceBody.balance.amount, "number");
    assert.strictEqual(typeof balanceBody.balance.currency, "string");
  }

  const answered = await callRoute(route, "/api/sidebar-token-usage/models?session=s1");
  assert.strictEqual(answered.status, 200);
  const parsed = JSON.parse(answered.body);
  assert.strictEqual(parsed.ok, true);
  assert.deepStrictEqual(parsed.models, [
    { model: "m-one", provider: null, uncachedInputTokens: 11, outputTokens: 6, cacheReadTokens: 102, cacheWriteTokens: 0, total: 119 },
    { model: "m-two", provider: null, uncachedInputTokens: 7, outputTokens: 3, cacheReadTokens: 0, cacheWriteTokens: 0, total: 10 }
  ]);

  const latestAnswer = await callRoute(latestRoute, "/api/sidebar-token-usage/latest?session=s1");
  assert.strictEqual(latestAnswer.status, 200);
  const latestBody = JSON.parse(latestAnswer.body);
  assert.strictEqual(latestBody.ok, true);
  assert.deepStrictEqual(
    latestBody.latest,
    {
      usage: { uncachedInputTokens: 1, outputTokens: 1, cacheReadTokens: 2, cacheWriteTokens: 0 },
      routes: [{
        provider: null,
        model: "m-one",
        usage: { uncachedInputTokens: 1, outputTokens: 1, cacheReadTokens: 2, cacheWriteTokens: 0 }
      }]
    },
    "without Turn boundaries the latest route reports the last Assistant settlement"
  );

  // With Turn boundaries the route must fold the WHOLE latest Turn, matching the
  // chat's own 「本轮用量」 card rather than only the closing settlement.
  const turnLog = {
    events: [
      { type: "turn/start", data: { turn: 1 } },
      { type: "assistant/message", data: { turn: 1, message: { source: { provider: "deepseek-account", model: "deepseek-flash" } }, usage: { inputTokens: 100, outputTokens: 50, cacheReadTokens: 1000, cacheWriteTokens: 10 } } },
      { type: "turn/end", data: { turn: 1 } },
      { type: "turn/start", data: { turn: 2 } },
      { type: "assistant/message", data: { turn: 2, message: { source: { provider: "deepseek-account", model: "deepseek-flash" } }, usage: { inputTokens: 10, outputTokens: 5, cacheReadTokens: 200 } } },
      { type: "tool/call", data: { turn: 2, step: 2 } },
      { type: "assistant/message", data: { turn: 2, message: { source: { provider: "deepseek-account", model: "deepseek-flash" } }, usage: { inputTokens: 1, outputTokens: 1, cacheReadTokens: 2 } } },
      { type: "turn/end", data: { turn: 2 } }
    ]
  };
  const turnRoutes = [];
  host.apply({
    effect: (fn) => { fn(); },
    webServer: { register: (value) => { turnRoutes.push(value); return () => {}; } },
    sessionQuery: { readSession: () => Promise.resolve(turnLog) }
  });
  const turnLatestRoute = turnRoutes.find((value) => value.path === "/api/sidebar-token-usage/latest");
  const turnAnswer = await callRoute(turnLatestRoute, "/api/sidebar-token-usage/latest?session=s2");
  const turnBody = JSON.parse(turnAnswer.body);
  const turnUsage = { uncachedInputTokens: 11, outputTokens: 6, cacheReadTokens: 202, cacheWriteTokens: 0 };
  assert.deepStrictEqual(
    turnBody.latest,
    {
      usage: turnUsage,
      routes: [{ provider: "deepseek-account", model: "deepseek-flash", usage: turnUsage }],
      turn: 2
    },
    "the latest route sums every settlement of the latest Turn"
  );

  const missing = await callRoute(route, "/api/sidebar-token-usage/models");
  assert.strictEqual(missing.status, 400);

  async function callRoute(target, url) {
    const out = {};
    await target.handler({ url }, {
      writeHead: (status, headers) => { out.status = status; out.headers = headers; },
      end: (chunk) => { out.body = chunk; }
    });
    return out;
  }

  console.log("id:", loaded.id, "| factory:", typeof loaded.factory);
  console.log("plugin.inject:", JSON.stringify(plugin.inject));
  console.log("plugin.apply:", typeof plugin.apply);
  console.log("slots:", registrations.map((entry) => entry.name).join(", "));
  console.log("leading(alice):", badgeValue(badge), "| leading(dave):", badgeValue(badgeMissing), "| leading(bob):", badgeValue(badgeZero));
  console.log("hover(alice):", JSON.stringify(detailValues));
  console.log("hover(carol):", JSON.stringify(missingValues));
  console.log("models(alice):", JSON.stringify(modelRows));
  console.log("host route:", route.path);
  console.log("host models:", JSON.stringify(parsed.models));
  console.log("footer(wide):", JSON.stringify(cardValues));
  console.log("footer(rail) data-wide:", railCard.props["data-wide"]);
  console.log("style disposer ran:", disposerCalls === 1);
  console.log("formatter:", table.map(([i, e]) => i + "->" + e).join(" "));
  console.log("SELFCHECK OK");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});