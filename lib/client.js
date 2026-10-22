window.__ModuleLoader__.load({
  id: "dsh-sidebar-token-usage",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let react = require("react");

    const NS = "sidebarTokenUsage";
    const UNKNOWN = "\u2014";
    const BUCKETS = ["uncachedInputTokens", "outputTokens", "cacheReadTokens", "cacheWriteTokens"];

    const zh = {
      "row.label": "\u4f1a\u8bdd token \u603b\u91cf",
      "footer.label": "\u5168\u90e8\u4f1a\u8bdd",
      "footer.labelWeek": "\u4e00\u5468\u5185\u4f1a\u8bdd",
      "footer.labelDay": "\u4e00\u5929\u5185\u4f1a\u8bdd",
      "foot.current": "\u5f53\u524d",
      "foot.balance": "\u4f59\u989d",
      "balance.live": "\u5e73\u53f0\u63a2\u6d4b",
      "balance.recorded": "\u65e7\u8bb0\u5f55",
      "latest.title": "\u672c\u8f6e\u7528\u91cf",
      "latest.usage": "\u7528\u91cf",
      "latest.tok": "tok",
      "latest.provider": "\u63d0\u4f9b\u65b9 / \u6a21\u578b",
      "latest.uncachedInput": "\u672a\u7f13\u5b58\u8f93\u5165",
      "latest.cacheRead": "\u7f13\u5b58\u8bfb\u53d6",
      "latest.cacheWrite": "\u7f13\u5b58\u5199\u5165",
      "field.input": "\u8f93\u5165",
      "field.output": "\u8f93\u51fa",
      "field.cacheRead": "\u7f13\u5b58\u8bfb",
      "field.cacheWrite": "\u7f13\u5b58\u5199",
      "field.context": "\u4e0a\u4e0b\u6587",
      "field.sessions": "\u4f1a\u8bdd\u6570",
      "field.total": "\u5408\u8ba1",
      "field.models": "\u6a21\u578b\u7528\u91cf",
      "models.loading": "\u8bfb\u53d6\u4e2d\u2026",
      "models.none": "\u6682\u65e0\u6a21\u578b\u8bb0\u5f55",
      "field.model": "\u6a21\u578b",
      "field.effort": "\u601d\u8003\u5f3a\u5ea6",
      "field.cacheHit": "\u7f13\u5b58\u547d\u4e2d",
      "field.turns": "\u8f6e\u6b21",
      "field.steps": "\u6b65\u6570",
      "field.duration": "\u7d2f\u8ba1\u8017\u65f6",
      "field.ttft": "\u9996\u5b57\u5ef6\u8fdf",
      "field.speed": "\u89e3\u7801\u901f\u5ea6",
      "field.permission": "\u6743\u9650",
      "field.preset": "Agent \u9884\u8bbe",
      "field.cwd": "\u5de5\u4f5c\u76ee\u5f55",
      "settings.title": "\u4fa7\u8fb9\u680f token \u7528\u91cf",
      "settings.hint": "\u52fe\u9009\u8981\u5728\u4f1a\u8bdd\u60ac\u505c\u5361\u91cc\u663e\u793a\u7684\u9879\uff1b\u884c\u5185\u59cb\u7ec8\u53ea\u663e\u793a\u7d2f\u8ba1 token\u3002",
      "show.usage": "\u8f93\u5165 / \u8f93\u51fa / \u7f13\u5b58\u660e\u7ec6",
      "show.context": "\u4e0a\u4e0b\u6587\u5360\u7528",
      "show.model": "\u5f53\u524d\u6a21\u578b\u4e0e\u601d\u8003\u5f3a\u5ea6",
      "show.cache": "\u7f13\u5b58\u547d\u4e2d\u7387",
      "show.activity": "\u8f6e\u6b21 / \u6b65\u6570 / \u8017\u65f6",
      "show.speed": "\u9996\u5b57\u5ef6\u8fdf / \u89e3\u7801\u901f\u5ea6",
      "show.env": "\u6743\u9650 / \u9884\u8bbe / \u5de5\u4f5c\u76ee\u5f55",
      "show.byModel": "\u6309\u6a21\u578b\u7528\u91cf\uff08\u542b\u4f30\u7b97\u8d39\u7528\uff09",
      "show.cost": "\u4f30\u7b97\u8d39\u7528\uff08\u4ec5 DeepSeek \u8def\u7531\uff09",
      "show.footCost": "\u4f30\u7b97\u8d39\u7528\u5408\u8ba1",
      "settings.hover": "\u4f1a\u8bdd\u60ac\u505c\u5361",
      "settings.footer": "\u4fa7\u8fb9\u680f\u5e95\u90e8",
      "show.footSessions": "\u4f1a\u8bdd\u6570",
      "show.footTokens": "\u5408\u8ba1\u4e0e\u56db\u9879\u5206\u9879",
      "show.footStatus": "\u8fd0\u884c / \u5f52\u6863\u72b6\u6001",
      "show.footActivity": "\u603b\u8f6e\u6b21 / \u6b65\u6570 / \u8017\u65f6",
      "show.footSpeed": "\u5e73\u5747\u9996\u5b57 / \u89e3\u7801\u901f\u5ea6",
      "show.footCache": "\u7f13\u5b58\u547d\u4e2d\u7387\uff08\u5168\u90e8\uff09",
      "show.footModels": "\u5f53\u524d\u6a21\u578b\u5206\u5e03",
      "preview.title": "\u6548\u679c\u9884\u89c8",
      "preview.hover": "\u4f1a\u8bdd\u60ac\u505c\u5361",
      "preview.footer": "\u4fa7\u8fb9\u680f\u5e95\u90e8",
      "preview.sample": "\u4ee5\u4e00\u6761\u793a\u4f8b\u4f1a\u8bdd\u6e32\u67d3\uff0c\u6539\u4e0a\u9762\u7684\u9009\u9879\u4f1a\u7acb\u5373\u53d8\u5316",
      "preview.label": "\u6548\u679c\u9884\u89c8",
      "ring.label": "\u4e0a\u4e0b\u6587\u5360\u7528",
      "popover.title": "\u4f1a\u8bdd\u7528\u91cf",
      "popover.close": "\u5173\u95ed",
      "show.rowRing": "\u884c\u5185\u663e\u793a\u4e0a\u4e0b\u6587\u5706\u73af",
      "show.footRing": "\u5e95\u90e8\u663e\u793a\u4e0a\u4e0b\u6587\u5706\u73af",
      "choice.title": "\u663e\u793a\u5185\u5bb9",
      "choice.rowMetric": "\u4f1a\u8bdd\u884c\u4e0a\u663e\u793a",
      "choice.footMetric": "\u5e95\u90e8\u4e3b\u6570\u5b57\u663e\u793a",
      "choice.footerRange": "\u5e95\u90e8\u7edf\u8ba1\u8303\u56f4",
      "choice.rowExpand": "\u4f1a\u8bdd\u5c55\u5f00\u65b9\u5f0f",
      "choice.footExpand": "\u5e95\u90e8\u5c55\u5f00\u65b9\u5f0f",
      "choice.hover": "\u9f20\u6807\u79fb\u5165",
      "choice.click": "\u70b9\u51fb",
      "choice.tokens": "\u7528\u91cf",
      "choice.cost": "\u8d39\u7528",
      "choice.noPrice": "\u8be5\u6a21\u578b\u65e0\u4ef7\u683c\u4fe1\u606f",
      "price.title": "\u4ef7\u683c\u8868\uff08CNY / \u767e\u4e07 token\uff09",
      "price.hint": "\u6539\u5b8c\u7acb\u5373\u751f\u6548\uff1b\u9ed8\u8ba4\u503c\u6765\u81ea DeepSeek \u5b98\u65b9\u4ef7\u76ee\u8868\u3002",
      "price.flash": "flash \u6863",
      "price.pro": "v4-pro \u6863",
      "price.cacheHit": "\u7f13\u5b58\u547d\u4e2d",
      "price.inputMiss": "\u8f93\u5165\u672a\u547d\u4e2d",
      "price.output": "\u8f93\u51fa",
      "price.offPeak": "\u95f2\u65f6",
      "price.peak": "\u9ad8\u5cf0",
      "price.providers": "\u8ba1\u4ef7\u8def\u7531\uff08\u9017\u53f7\u5206\u9694\uff09",
      "field.cost": "\u4f30\u7b97\u8d39\u7528",
      "field.top": "\u6700\u8d35\u4f1a\u8bdd",
      "field.pressure": "\u4e0a\u4e0b\u6587\u5360\u7528",
      "field.overShare": "\u544a\u6025\uff08\u226580%\uff09",
      "field.avg": "\u5747\u6bcf\u4f1a\u8bdd",
      "field.outputShare": "\u8f93\u51fa\u5360\u6bd4",
      "field.span": "\u6d3b\u52a8\u8de8\u5ea6",
      "field.presetSpread": "Agent \u9884\u8bbe",
      "field.permissionSpread": "\u6743\u9650",
      "show.footTop": "\u6700\u8d35\u7684\u4e09\u4e2a\u4f1a\u8bdd",
      "show.footPressure": "\u4e0a\u4e0b\u6587\u5360\u7528\u4e0e\u544a\u6025\u4f1a\u8bdd\u6570",
      "show.footAvg": "\u5747\u6bcf\u4f1a\u8bdd\u7528\u91cf\u4e0e\u8f93\u51fa\u5360\u6bd4",
      "show.footSpan": "\u6d3b\u52a8\u65f6\u95f4\u8de8\u5ea6",
      "show.footEnv": "Agent \u9884\u8bbe\u4e0e\u6743\u9650\u5206\u5e03",
      "field.balance": "\u4f59\u989d\uff08\u6700\u8fd1\u8bb0\u5f55\uff09",
      "show.footBalance": "\u4f59\u989d\uff08\u6bcf 60 \u79d2\u5237\u65b0\uff09",
      "cost.estimated": "\u6d3e\u751f\u81ea token\u6570\u4e0e\u5b98\u65b9\u4ef7\u8868\uff0c\u975e\u8d26\u5355",
      "range.all": "\u5168\u90e8",
      "range.week": "\u4e00\u5468\u5185",
      "range.day": "\u4e00\u5929\u5185",
      "range.hint": "\u6309\u4f1a\u8bdd\u6700\u540e\u6d3b\u52a8\u65f6\u95f4\u7b5b\u9009",
      "field.running": "\u8fd0\u884c\u4e2d",
      "field.archived": "\u5df2\u5f52\u6863",
      "unit.sessions": "\u4e2a\u4f1a\u8bdd",
      "unit.tokensPerSecond": "tok/s"
    };

    const en = {
      "row.label": "Session token total",
      "footer.label": "All sessions",
      "footer.labelWeek": "Sessions \u00b7 7 days",
      "footer.labelDay": "Sessions \u00b7 24 hours",
      "foot.current": "Current",
      "foot.balance": "Balance",
      "balance.live": "platform probe",
      "balance.recorded": "recorded",
      "latest.title": "This turn",
      "latest.usage": "Usage",
      "latest.tok": "tok",
      "latest.provider": "Provider / model",
      "latest.uncachedInput": "Uncached input",
      "latest.cacheRead": "Cache read",
      "latest.cacheWrite": "Cache write",
      "field.input": "Input",
      "field.output": "Output",
      "field.cacheRead": "Cache read",
      "field.cacheWrite": "Cache write",
      "field.context": "Context",
      "field.sessions": "Sessions",
      "field.total": "Total",
      "field.models": "Models",
      "models.loading": "Loading\u2026",
      "models.none": "No model records yet",
      "field.model": "Model",
      "field.effort": "Reasoning",
      "field.cacheHit": "Cache hit",
      "field.turns": "Turns",
      "field.steps": "Steps",
      "field.duration": "Total time",
      "field.ttft": "First token",
      "field.speed": "Decode speed",
      "field.permission": "Permission",
      "field.preset": "Agent preset",
      "field.cwd": "Working dir",
      "settings.title": "Sidebar token usage",
      "settings.hint": "Pick what the Session hover card shows. The row badge always shows the running token total.",
      "show.usage": "Input / output / cache detail",
      "show.context": "Context occupancy",
      "show.model": "Current model and reasoning effort",
      "show.cache": "Cache hit rate",
      "show.activity": "Turns / steps / elapsed",
      "show.speed": "First-token latency / decode speed",
      "show.env": "Permission / preset / working dir",
      "show.byModel": "Per-model usage (with est. cost)",
      "show.cost": "Estimated cost (DeepSeek routes only)",
      "show.footCost": "Total estimated cost",
      "settings.hover": "Session hover card",
      "settings.footer": "Sidebar footer",
      "show.footSessions": "Session count",
      "show.footTokens": "Total and the four buckets",
      "show.footStatus": "Running / archived",
      "show.footActivity": "Total turns / steps / elapsed",
      "show.footSpeed": "Average first token / decode speed",
      "show.footCache": "Cache hit rate (all sessions)",
      "show.footModels": "Current model spread",
      "preview.title": "Preview",
      "preview.hover": "Session hover card",
      "preview.footer": "Sidebar footer",
      "preview.sample": "Rendered from one sample Session; the options above apply immediately",
      "preview.label": "Preview",
      "ring.label": "Context use",
      "popover.title": "Session usage",
      "popover.close": "Close",
      "show.rowRing": "Context ring on the session row",
      "show.footRing": "Context ring in the footer",
      "choice.title": "Display",
      "choice.rowMetric": "Session row shows",
      "choice.footMetric": "Footer main figure",
      "choice.footerRange": "Footer range",
      "choice.rowExpand": "Session expands on",
      "choice.footExpand": "Footer expands on",
      "choice.hover": "Hover",
      "choice.click": "Click",
      "choice.tokens": "Tokens",
      "choice.cost": "Cost",
      "choice.noPrice": "This model has no price row",
      "price.title": "Price list (CNY / 1M tokens)",
      "price.hint": "Edits apply immediately. Defaults come from DeepSeek's published list.",
      "price.flash": "flash row",
      "price.pro": "v4-pro row",
      "price.cacheHit": "Cache hit",
      "price.inputMiss": "Input miss",
      "price.output": "Output",
      "price.offPeak": "off-peak",
      "price.peak": "peak",
      "price.providers": "Priced routes (comma separated)",
      "field.cost": "Est. cost",
      "field.top": "Priciest sessions",
      "field.pressure": "Context use",
      "field.overShare": "Tight (\u226580%)",
      "field.avg": "Per session",
      "field.outputShare": "Output share",
      "field.span": "Activity span",
      "field.presetSpread": "Agent preset",
      "field.permissionSpread": "Permission",
      "show.footTop": "Three priciest sessions",
      "show.footPressure": "Context use and tight sessions",
      "show.footAvg": "Average per session and output share",
      "show.footSpan": "Activity span",
      "show.footEnv": "Agent preset and permission spread",
      "field.balance": "Balance (last record)",
      "show.footBalance": "Balance (refreshed every 60s)",
      "cost.estimated": "Derived from token counts and the published price list, not a bill",
      "range.all": "All",
      "range.week": "7 days",
      "range.day": "24 hours",
      "range.hint": "Filtered by each Session's last activity",
      "field.running": "Running",
      "field.archived": "Archived",
      "unit.sessions": "sessions",
      "unit.tokensPerSecond": "tok/s"
    };

    const CSS = [
      ".stu-inline-wrap{display:inline-flex;align-items:center;gap:5px;min-width:0;",
      "margin-inline-end:12px}",
      ".stu-inline-wrap .stu-inline{margin-inline-end:0}",
      ".stu-ring{flex:none;color:var(--dsw-alias-state-business-primary)}",
      ".stu-ring-bg{stroke:color-mix(in srgb,currentColor 22%,transparent)}",
      ".stu-ring-fg{stroke:currentColor;transition:stroke-dasharray 160ms ease}",
      ".stu-ring[data-tight=\"true\"]{color:var(--dsw-alias-state-error-primary)}",
      ".stu-foot-right{display:inline-flex;align-items:center;gap:6px;flex:none}",
      ".stu-foot-pressure{font-size:10px;line-height:16px;font-variant-numeric:tabular-nums;",
      "color:var(--dsw-alias-label-tertiary)}",
      ".stu-pop-backdrop{position:fixed;inset:0;z-index:80;background:transparent}",
      ".stu-pop-card{position:fixed;z-index:81;box-sizing:border-box;max-width:320px;padding:8px 10px;",
      "border:1px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);",
      "background:var(--dsw-alias-button-elevated-fill);",
      "box-shadow:0 10px 28px rgba(0,0,0,.18);",
      "color:var(--dsw-alias-label-secondary)}",
      ".stu-pop-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;",
      "margin-bottom:4px}",
      ".stu-pop-title{font-size:10px;line-height:14px;font-weight:600;letter-spacing:.2px;",
      "text-transform:uppercase;color:var(--dsw-alias-label-caption)}",
      ".stu-pop-close{border:0;background:transparent;cursor:pointer;padding:0 2px;",
      "color:var(--dsw-alias-label-tertiary);font:inherit;font-size:13px;line-height:14px}",
      ".stu-pop-close:hover{color:var(--dsw-alias-label-primary)}",
      ".stu-inline{flex:none;box-sizing:border-box;display:inline-flex;align-items:center;",
      "justify-content:center;height:16px;min-width:16px;padding:0 4px;border-radius:999px;",
      "font-size:9.5px;line-height:1;font-weight:600;letter-spacing:-.2px;",
      "font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",
      "max-width:56px;margin-inline-end:12px;color:var(--dsw-alias-state-business-primary);",
      "background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 12%,transparent);",
      "box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--dsw-alias-state-business-primary) 26%,transparent);",
      "transition:background 120ms ease,box-shadow 120ms ease}",
      "[class*=\"_sessionRow\"]:hover .stu-inline{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 20%,transparent);",
      "box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--dsw-alias-state-business-primary) 38%,transparent)}",
      ".stu-inline[data-unknown=\"true\"]{color:var(--dsw-alias-label-tertiary);",
      "background:transparent;box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l4);font-weight:500}",
      "[class*=\"_slot\"]:has(> .stu-inline),",
      "[class*=\"slot\"]:has(> .stu-inline),",
      "[class*=\"_slot\"]:has(> .stu-inline-wrap),",
      "[class*=\"slot\"]:has(> .stu-inline-wrap){width:auto !important;max-width:96px !important;",
      "min-width:0;flex:none;margin-inline-start:2px;justify-content:flex-start}",
      ".stu-hover{display:flex;flex-direction:column;gap:6px;min-width:180px}",
      ".stu-sep{padding-top:6px;border-top:1px solid var(--dsw-alias-border-l4)}",
      ".stu-settings{display:flex;flex-direction:column;gap:10px;font-size:12px;line-height:18px;",
      "color:var(--dsw-alias-label-secondary)}",
      ".stu-settings-hint{margin:0;font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary)}",
      ".stu-settings-groups{display:flex;flex-direction:column;gap:14px}",
      ".stu-choice{display:flex;align-items:center;gap:10px;min-width:0;flex-wrap:wrap}",
      ".stu-choice-label{flex:0 0 auto;color:var(--dsw-alias-label-secondary);font-size:12px}",
      ".stu-seg-group{display:inline-flex;gap:2px;padding:2px;border-radius:999px;",
      "background:color-mix(in srgb,var(--dsw-alias-label-tertiary) 12%,transparent)}",
      ".stu-seg{border:0;padding:2px 10px;border-radius:999px;cursor:pointer;font:inherit;",
      "font-size:11px;line-height:16px;background:transparent;",
      "color:var(--dsw-alias-label-tertiary);transition:background 120ms ease,color 120ms ease}",
      ".stu-seg:hover{color:var(--dsw-alias-label-secondary)}",
      ".stu-seg-active{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 20%,transparent);",
      "color:var(--dsw-alias-state-business-primary);font-weight:600}",
      ".stu-two-col{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:start}",
      "@media (max-width:720px){.stu-two-col{grid-template-columns:minmax(0,1fr)}}",
      ".stu-col{display:flex;flex-direction:column;gap:8px;min-width:0}",
      ".stu-choice-list{display:flex;flex-direction:column;gap:8px}",
      ".stu-preview{min-width:0}",
      ".stu-preview-hover{box-sizing:border-box;max-width:300px;padding:8px 10px;",
      "border:1px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);",
      "background:var(--dsw-alias-button-elevated-fill)}",
      ".stu-preview-foot{box-sizing:border-box;max-width:300px;padding:0;",
      "border:0;border-radius:0;background:transparent}",
      ".stu-preview .stu-foot-detail{display:flex}",
      ".stu-preview .stu-foot{margin-bottom:0;width:100%}",
      ".stu-preview-label{margin-top:2px;font-size:11px;line-height:16px;",
      "color:var(--dsw-alias-label-tertiary)}",
      ".stu-price-rows{display:flex;flex-direction:column;gap:8px}",
      ".stu-price-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:4px 12px}",
      ".stu-price-cell{display:flex;align-items:center;gap:6px;min-width:0;cursor:default}",
      ".stu-price-label{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;",
      "white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-size:11px}",
      ".stu-price-input{flex:none;width:64px;min-width:0;box-sizing:border-box;",
      "border:1px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-sm);",
      "background:var(--dsw-alias-button-elevated-fill);color:var(--dsw-alias-label-primary);",
      "font:inherit;font-size:11px;padding:1px 4px;text-align:right;",
      "font-variant-numeric:tabular-nums}",
      ".stu-price-input:focus{outline:none;",
      "border-color:var(--dsw-alias-state-business-primary)}",
      ".stu-price-text{width:100%;text-align:left}",
      ".stu-price-providers{flex-direction:column;align-items:stretch;gap:4px;margin-top:2px}",
      ".stu-settings-group{display:flex;flex-direction:column;gap:6px}",
      ".stu-check-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));",
      "gap:6px 14px}",
      ".stu-check{display:flex;align-items:center;gap:7px;min-width:0;cursor:pointer}",
      ".stu-check input{flex:none;margin:0;cursor:pointer;",
      "accent-color:var(--dsw-alias-state-business-primary)}",
      ".stu-check-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".stu-models{display:flex;flex-direction:column;gap:2px;padding-top:6px;",
      "border-top:1px solid var(--dsw-alias-border-l4)}",
      ".stu-models-head{font-size:10px;line-height:14px;font-weight:600;letter-spacing:.2px",
      ";text-transform:uppercase;color:var(--dsw-alias-label-caption)}",
      ".stu-model-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;",
      "font-family:var(--dsw-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);font-size:10px}",
      ".stu-detail{display:grid;grid-template-columns:auto 1fr;gap:1px 10px;margin:2px 0 0;",
      "font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary)}",
      ".stu-detail dt{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".stu-detail dd{margin:0;text-align:right;font-variant-numeric:tabular-nums;",
      "color:var(--dsw-alias-label-secondary)}",
      ".stu-foot{box-sizing:border-box;flex:none;width:100%;min-width:0;display:flex;",
      "flex-direction:column;padding:6px 10px;margin-bottom:5px;font-size:11px;line-height:17px;",
      "border:1px solid var(--dsw-alias-border-l4);",
      "border-radius:var(--dsw-radius-md);",
      "background:var(--dsw-alias-button-elevated-fill);",
      "color:var(--dsw-alias-label-secondary);transition:background 120ms ease,border-color 120ms ease}",
      ".stu-foot:hover{border-color:var(--dsw-alias-border-l2);",
      "background:var(--dsw-alias-button-elevated-fill)}",
      ".stu-tabs{display:flex;gap:2px;padding:2px;border-radius:999px;",
      "background:color-mix(in srgb,var(--dsw-alias-label-tertiary) 12%,transparent)}",
      ".stu-tab{flex:1 1 0;min-width:0;border:0;padding:1px 6px;border-radius:999px;cursor:pointer;",
      "background:transparent;color:var(--dsw-alias-label-tertiary);font:inherit;font-size:10px;",
      "line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",
      "transition:background 120ms ease,color 120ms ease}",
      ".stu-tab:hover{color:var(--dsw-alias-label-secondary)}",
      ".stu-tab-active{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 20%,transparent);",
      "color:var(--dsw-alias-state-business-primary);font-weight:600}",
      ".stu-foot-main{display:flex;align-items:center;justify-content:space-between;",
      "gap:6px;min-width:0}",
      ".stu-foot[data-clickable=\"true\"]{cursor:pointer;border-radius:var(--dsw-radius-md)}",
      ".stu-foot[data-clickable=\"true\"]:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);",
      "outline-offset:2px}",
      ".stu-foot-label{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;",
      "white-space:nowrap;color:var(--dsw-alias-label-tertiary)}",
      ".stu-foot-total{flex:none;font-variant-numeric:tabular-nums;font-weight:600;font-size:12px;",
      "line-height:17px;color:var(--dsw-alias-state-business-primary)}",
      ".stu-foot-cost-hint{flex:none;font-size:12px;line-height:17px;font-weight:600;",
      "font-variant-numeric:tabular-nums;color:var(--dsw-alias-state-business-primary)}",
      ".stu-foot-current{display:flex;flex-direction:column;gap:2px;min-width:0;margin-top:3px;",
      "font-size:10px;line-height:14px}",
      ".stu-foot-current-row{display:flex;align-items:center;gap:5px;min-width:0}",
      ".stu-foot-current-tag{flex:none;color:var(--dsw-alias-label-tertiary)}",
      ".stu-foot-current-title{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;",
      "white-space:nowrap;color:var(--dsw-alias-label-secondary)}",
      ".stu-foot-current-value{flex:none;font-variant-numeric:tabular-nums;",
      "color:var(--dsw-alias-label-primary)}",
      ".stu-foot-current-price{flex:none;font-variant-numeric:tabular-nums;",
      "color:var(--dsw-alias-label-primary)}",
      ".stu-foot-latest-row{display:flex;align-items:center;justify-content:space-between;",
      "gap:6px;min-width:0;margin-top:1px}",
      ".stu-foot-latest-chip{flex:none;display:inline-flex;align-items:center;max-width:100%;min-width:0;",
      "border:0;padding:0 5px;height:16px;border-radius:999px;cursor:pointer;",
      "background:color-mix(in srgb,var(--dsw-alias-label-tertiary) 12%,transparent);",
      "color:var(--dsw-alias-label-secondary);font:inherit;font-size:9.5px;line-height:16px;",
      "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;",
      "transition:background 120ms ease,color 120ms ease}",
      ".stu-foot-latest-chip:hover{color:var(--dsw-alias-label-primary);",
      "background:color-mix(in srgb,var(--dsw-alias-label-tertiary) 20%,transparent)}",
      ".stu-foot-latest-price{flex:none;font-variant-numeric:tabular-nums;font-size:10px;",
      "color:var(--dsw-alias-label-primary)}",
      ".stu-foot-balance{display:flex;align-items:center;justify-content:space-between;gap:6px;",
      "min-width:0;margin-top:2px;font-size:9.5px;line-height:13px}",
      ".stu-foot-balance-label{flex:1 1 auto;min-width:0;color:var(--dsw-alias-label-tertiary)}",
      ".stu-foot-balance-time{flex:none;font-variant-numeric:tabular-nums;",
      "color:var(--dsw-alias-label-tertiary)}",
      ".stu-foot-balance-value{flex:none;font-variant-numeric:tabular-nums;font-size:12px;line-height:17px;",
      "font-weight:600;color:var(--dsw-alias-label-primary)}",
      ".stu-latest-backdrop{position:fixed;inset:0;z-index:82;background:transparent}",
      ".stu-latest-card{position:fixed;z-index:83;box-sizing:border-box;width:268px;max-width:calc(100vw - 24px);",
      "padding:10px 12px;border:1px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);",
      "background:var(--dsw-alias-button-elevated-fill);box-shadow:0 10px 28px rgba(0,0,0,.18);",
      "color:var(--dsw-alias-label-secondary);font-size:11px;line-height:16px}",
      ".stu-latest-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;",
      "margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid var(--dsw-alias-border-l4)}",
      ".stu-latest-title{font-weight:600;color:var(--dsw-alias-label-primary)}",
      ".stu-latest-total{font-variant-numeric:tabular-nums;font-weight:600;",
      "color:var(--dsw-alias-label-primary)}",
      ".stu-latest-card .stu-detail dd{overflow-wrap:anywhere}",
      ".stu-foot-detail{display:none;flex-direction:column;gap:6px;",
      "padding-top:5px;margin-top:5px;border-top:1px solid var(--dsw-alias-border-l4)}",
      ".stu-foot[data-expand=\"hover\"]:hover .stu-foot-detail{display:flex}",
      ".stu-foot[data-open=\"true\"] .stu-foot-detail{display:flex}",
      ".stu-foot-group{display:flex;flex-direction:column}",
      ".stu-foot[data-wide=\"false\"]{width:auto;max-width:34px;padding:3px 2px;",
      "align-items:center;margin-bottom:2px}",
      ".stu-foot[data-wide=\"false\"] .stu-foot-main{justify-content:center}",
      ".stu-foot[data-wide=\"false\"] .stu-foot-label{display:none}",
      ".stu-foot[data-wide=\"false\"] .stu-foot-total{font-size:9px}",
      ".stu-foot[data-wide=\"false\"] .stu-foot-cost-hint{display:none}",
      ".stu-foot[data-wide=\"false\"] .stu-foot-current{display:none}",
      ".stu-foot[data-wide=\"false\"] .stu-foot-balance{display:none}",
      ".stu-foot[data-wide=\"false\"] .stu-foot-detail{display:none}"
    ].join("");

    function mountStyle() {
      if (typeof document === "undefined" || document.head === undefined) return undefined;
      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-sidebar-token-usage";
      tag.textContent = CSS;
      document.head.appendChild(tag);
      return tag;
    }

    function numberOr(value) {
      return typeof value === "number" && Number.isFinite(value) ? value : undefined;
    }

    function trimZero(fixed) {
      return fixed.slice(-2) === ".0" ? fixed.slice(0, -2) : fixed;
    }

    /** Compact token count: raw below 1000, otherwise K/M/B with one decimal and no trailing .0. */
    function formatCount(value) {
      if (typeof value !== "number" || !Number.isFinite(value)) return UNKNOWN;
      if (Math.abs(value) < 1e3) return String(Math.round(value));
      const units = [[1e3, "K"], [1e6, "M"], [1e9, "B"]];
      for (let index = 0; index < units.length; index += 1) {
        const scaled = Math.round((value / units[index][0]) * 10) / 10;
        // A unit whose rounding reaches 1000 carries into the next larger unit.
        if (Math.abs(scaled) >= 1e3 && index < units.length - 1) continue;
        return trimZero(scaled.toFixed(1)) + units[index][1];
      }
      return UNKNOWN;
    }

    function groupDigits(value) {
      return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function textOr(value) {
      return value === undefined ? UNKNOWN : groupDigits(value);
    }

    function compactOr(value) {
      return value === undefined ? UNKNOWN : formatCount(value);
    }

    /** Sum of the four usage buckets; undefined when the projection carries no number at all. */
    function sumUsage(usage) {
      if (usage === undefined || usage === null || typeof usage !== "object") return undefined;
      let total = 0;
      let seen = false;
      for (const bucket of BUCKETS) {
        const value = numberOr(usage[bucket]);
        if (value === undefined) continue;
        seen = true;
        total += value;
      }
      return seen ? total : undefined;
    }

    function projectionValues(snapshot, sessionId) {
      const byId = snapshot === undefined || snapshot === null ? undefined : snapshot.byId;
      if (byId === undefined || byId === null || typeof byId !== "object") return undefined;
      const entry = byId[sessionId];
      if (entry === undefined || entry === null) return undefined;
      const values = entry.projectionValues;
      return values === undefined || values === null || typeof values !== "object" ? undefined : values;
    }

    // ---- hover-card field settings ------------------------------------------------
    // Which groups the hover card renders. Persisted per browser; the row badge is
    // deliberately not configurable — it always shows the running token total.
    const FIELD_STORAGE_KEY = "dsh-sidebar-token-usage:fields";
    const FIELD_OPTIONS = [
      ["usage", "show.usage", true, "hover"],
      ["context", "show.context", true, "hover"],
      ["model", "show.model", true, "hover"],
      ["cache", "show.cache", false, "hover"],
      ["activity", "show.activity", false, "hover"],
      ["speed", "show.speed", false, "hover"],
      ["env", "show.env", false, "hover"],
      ["cost", "show.cost", true, "hover"],
      ["rowRing", "show.rowRing", false, "hover"],
      ["byModel", "show.byModel", true, "hover"],
      ["footSessions", "show.footSessions", true, "footer"],
      ["footTokens", "show.footTokens", true, "footer"],
      ["footStatus", "show.footStatus", false, "footer"],
      ["footActivity", "show.footActivity", false, "footer"],
      ["footSpeed", "show.footSpeed", false, "footer"],
      ["footCache", "show.footCache", false, "footer"],
      ["footModels", "show.footModels", false, "footer"],
      ["footCost", "show.footCost", true, "footer"],
      ["footBalance", "show.footBalance", true, "footer"],
      ["footTop", "show.footTop", false, "footer"],
      ["footPressure", "show.footPressure", true, "footer"],
      ["footAvg", "show.footAvg", false, "footer"],
      ["footRing", "show.footRing", false, "footer"],
      ["footSpan", "show.footSpan", false, "footer"],
      ["footEnv", "show.footEnv", false, "footer"]
    ];

    /** Single-choice settings: a label plus the values it offers, first one is the default. */
    const CHOICE_OPTIONS = [
      { id: "rowMetric", label: "choice.rowMetric", scope: "hover", values: [["tokens", "choice.tokens"], ["cost", "choice.cost"]] },
      { id: "rowExpand", label: "choice.rowExpand", scope: "hover", values: [["hover", "choice.hover"], ["click", "choice.click"]] },
      { id: "footMetric", label: "choice.footMetric", scope: "footer", values: [["tokens", "choice.tokens"], ["cost", "choice.cost"]] },
      { id: "footerRange", label: "choice.footerRange", scope: "footer", values: [["all", "range.all"], ["week", "range.week"], ["day", "range.day"]] },
      { id: "footExpand", label: "choice.footExpand", scope: "footer", values: [["hover", "choice.hover"], ["click", "choice.click"]] }
    ];

    function defaultFields() {
      const flags = {};
      for (const option of FIELD_OPTIONS) flags[option[0]] = option[2];
      for (const option of CHOICE_OPTIONS) flags[option.id] = option.values[0][0];
      return flags;
    }

    function readFields() {
      const flags = defaultFields();
      try {
        if (typeof localStorage === "undefined" || localStorage === null) return flags;
        const raw = localStorage.getItem(FIELD_STORAGE_KEY);
        if (raw === null) return flags;
        const parsed = JSON.parse(raw);
        if (parsed === null || typeof parsed !== "object") return flags;
        for (const option of FIELD_OPTIONS) {
          if (typeof parsed[option[0]] === "boolean") flags[option[0]] = parsed[option[0]];
        }
        for (const option of CHOICE_OPTIONS) {
          const value = parsed[option.id];
          if (option.values.some((pair) => pair[0] === value)) flags[option.id] = value;
        }
      } catch (error) {
        void error;
      }
      return flags;
    }

    function writeFields(flags) {
      try {
        if (typeof localStorage === "undefined" || localStorage === null) return;
        localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(flags));
      } catch (error) {
        void error;
      }
    }

    /** Snapshot store: the snapshot identity changes only when a flag changes. */
    function createFieldStore() {
      let flags = readFields();
      const listeners = new Set();
      return {
        getSnapshot: function () {
          return flags;
        },
        subscribe: function (listener) {
          listeners.add(listener);
          return function () {
            listeners.delete(listener);
          };
        },
        setField: function (id, on) {
          if (flags[id] === on) return;
          flags = Object.assign({}, flags, { [id]: on });
          writeFields(flags);
          for (const listener of [...listeners]) listener();
        },
        setChoice: function (id, value) {
          const option = CHOICE_OPTIONS.find((entry) => entry.id === id);
          if (option === undefined || !option.values.some((pair) => pair[0] === value)) return;
          if (flags[id] === value) return;
          flags = Object.assign({}, flags, { [id]: value });
          writeFields(flags);
          for (const listener of [...listeners]) listener();
        }
      };
    }

    /**
     * The Session the main view currently holds, if any. Retention is host-reported
     * and can lag, so the freshest non-archived row is the fallback.
     */
    function currentEntry(snapshot) {
      const byId = snapshot === undefined || snapshot === null ? undefined : snapshot.byId;
      if (byId === undefined || byId === null || typeof byId !== "object") return undefined;
      const entries = Object.values(byId).filter((entry) => entry !== null && typeof entry === "object");
      for (const entry of entries) {
        if ((entry.retainedBy?.mainView ?? 0) > 0) return entry;
      }
      let freshest;
      for (const entry of entries) {
        if (entry.archived === true || entry.blank === true) continue;
        const at = numberOr(entry.updatedAt);
        if (at === undefined) continue;
        if (freshest === undefined || at > freshest.at) freshest = { at, entry };
      }
      return freshest === undefined ? undefined : freshest.entry;
    }

    function pickEntry(snapshot, sessionId) {
      const byId = snapshot === undefined || snapshot === null ? undefined : snapshot.byId;
      if (byId === undefined || byId === null || typeof byId !== "object") return undefined;
      const entry = byId[sessionId];
      return entry === undefined || entry === null ? undefined : entry;
    }

    function formatDuration(milliseconds) {
      const value = numberOr(milliseconds);
      if (value === undefined || value <= 0) return UNKNOWN;
      const seconds = Math.round(value / 1000);
      if (seconds < 60) return seconds + "s";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) {
        const rest = seconds % 60;
        return rest === 0 ? minutes + "m" : minutes + "m " + rest + "s";
      }
      const hours = Math.floor(minutes / 60);
      const restMinutes = minutes % 60;
      return restMinutes === 0 ? hours + "h" : hours + "h " + restMinutes + "m";
    }

    function formatRate(part, milliseconds, unit) {
      const value = numberOr(part);
      const span = numberOr(milliseconds);
      if (value === undefined || span === undefined || span <= 0) return UNKNOWN;
      const perSecond = value / (span / 1000);
      const rounded = perSecond >= 100 ? Math.round(perSecond) : Math.round(perSecond * 10) / 10;
      return rounded + " " + unit;
    }

    function contextText(pressure) {
      if (pressure === undefined || pressure === null || typeof pressure !== "object") return UNKNOWN;
      const used = numberOr(pressure.pressureTokens) ?? numberOr(pressure.projectedTokens);
      if (used === undefined) return UNKNOWN;
      const window = numberOr(pressure.contextWindow);
      if (window === undefined || window <= 0) return groupDigits(used);
      return groupDigits(used) + " / " + groupDigits(window) + " \u00b7 " + Math.round((used / window) * 100) + "%";
    }

    /**
     * Fold every listed Session into the footer's counters. A Session that was
     * never opened carries no projection, so it counts as a Session but
     * contributes nothing else.
     */
    function aggregate(snapshot, windowMs, prices) {
      const buckets = { uncachedInputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 };
      const ids = snapshot === undefined || snapshot === null || !Array.isArray(snapshot.ids) ? [] : snapshot.ids;
      const byId = snapshot === undefined || snapshot === null ? {} : (snapshot.byId ?? {});
      let totals;
      let sessions = 0;
      let running = 0;
      let archived = 0;
      let turns = 0;
      let steps = 0;
      let spent = 0;
      let ttftMs = 0;
      let ttftSteps = 0;
      let decodeTokens = 0;
      let decodeMs = 0;
      const modelMap = new Map();
      const now = Date.now();
      let cost;
      let priced = 0;
      const ranked = [];
      let maxPressure;
      let overShare = 0;
      const presetCounts = new Map();
      const permissionCounts = new Map();
      let oldest;
      let newest;
      for (const id of ids) {
        const entry = byId[id];
        if (windowMs !== undefined) {
          const updatedAt = entry === undefined || entry === null ? undefined : numberOr(entry.updatedAt);
          if (updatedAt === undefined || now - updatedAt > windowMs) continue;
        }
        sessions += 1;
        if (entry !== undefined && entry !== null && typeof entry === "object") {
          if (entry.running === true) running += 1;
          if (entry.archived === true) archived += 1;
        }
        const updatedAt = entry === undefined || entry === null ? undefined : numberOr(entry.updatedAt);
        if (updatedAt !== undefined) {
          if (oldest === undefined || updatedAt < oldest) oldest = updatedAt;
          if (newest === undefined || updatedAt > newest) newest = updatedAt;
        }
        const values = projectionValues(snapshot, id);
        if (values === undefined) continue;

        const pressure = values.contextPressure;
        const pressureUsed = pressure === undefined || pressure === null
          ? undefined
          : (numberOr(pressure.pressureTokens) ?? numberOr(pressure.projectedTokens));
        const pressureWindow = pressure === undefined || pressure === null ? undefined : numberOr(pressure.contextWindow);
        if (pressureUsed !== undefined && pressureWindow !== undefined && pressureWindow > 0) {
          const ratio = pressureUsed / pressureWindow;
          if (ratio >= 0.8) overShare += 1;
          if (maxPressure === undefined || ratio > maxPressure.ratio) maxPressure = { ratio, used: pressureUsed, window: pressureWindow };
        }

        if (typeof values.agentPreset === "string" && values.agentPreset.length > 0) {
          presetCounts.set(values.agentPreset, (presetCounts.get(values.agentPreset) ?? 0) + 1);
        }
        const permissions = values.permissions;
        const permission = permissions === undefined || permissions === null ? undefined : permissions.preset;
        if (typeof permission === "string" && permission.length > 0) {
          permissionCounts.set(permission, (permissionCounts.get(permission) ?? 0) + 1);
        }

        const stats = values.sessionStats;
        if (stats !== undefined && stats !== null && typeof stats === "object") {
          turns += numberOr(stats.turns) ?? 0;
          steps += numberOr(stats.steps) ?? 0;
          spent += (numberOr(stats.llmMs) ?? 0) + (numberOr(stats.toolMs) ?? 0);
          ttftMs += numberOr(stats.ttftMs) ?? 0;
          ttftSteps += numberOr(stats.ttftSteps) ?? 0;
          decodeTokens += numberOr(stats.decodeTokens) ?? 0;
          decodeMs += numberOr(stats.decodeMs) ?? 0;
        }
        const usage = values.tokenUsage;
        const total = sumUsage(usage);
        if (total !== undefined) {
          totals = (totals ?? 0) + total;
          for (const bucket of BUCKETS) buckets[bucket] += numberOr(usage[bucket]) ?? 0;
        }
        const selection = values.modelSelection;
        const used = selection === undefined || selection === null ? undefined : selection.lastUsed;
        const model = used === undefined || used === null ? undefined : used.model;
        const spend = estimateCost(used === undefined || used === null ? undefined : used.provider, model, usage, now, prices);
        if (spend !== undefined) {
          cost = (cost ?? 0) + spend;
          priced += 1;
          const title = typeof values.title === "string" && values.title.length > 0
            ? values.title
            : (typeof entry?.title === "string" && entry.title.length > 0 ? entry.title : id);
          ranked.push({ title, cost: spend });
        }
        if (typeof model === "string" && model.length > 0) {
          const row = modelMap.get(model) ?? { model, sessions: 0, total: 0 };
          row.sessions += 1;
          row.total += total ?? 0;
          modelMap.set(model, row);
        }
      }
      const models = [...modelMap.values()].sort((left, right) => right.total - left.total);
      ranked.sort((left, right) => right.cost - left.cost);
      const top = ranked.slice(0, 3);
      const avgTokens = totals !== undefined && sessions > 0 ? totals / sessions : undefined;
      const outputShare = totals !== undefined && totals > 0 ? (buckets.outputTokens / totals) * 100 : undefined;
      return {
        totals, sessions, buckets, running, archived, turns, steps, spent,
        ttftMs, ttftSteps, decodeTokens, decodeMs, models, cost, priced,
        top, maxPressure, overShare, avgTokens, outputShare,
        presetCounts, permissionCounts, oldest, newest
      };
    }

    // ---- cost estimate -----------------------------------------------------------
    // DeepSeek's published rows, CNY per 1M tokens, peak vs off-peak. Mirrors the
    // price book the installed usage plugin bills against; a model outside these
    // families has no price information and shows no cost at all.
    const PRICE_STORAGE_KEY = "dsh-sidebar-token-usage:prices";
    /** Rows the editor exposes, in display order. */
    const PRICE_ROWS = [
      ["flash", "price.flash"],
      ["pro", "price.pro"]
    ];
    /** Columns of one price row, in display order. */
    const PRICE_COLUMNS = [
      ["cacheHit", "price.cacheHit"],
      ["inputMiss", "price.inputMiss"],
      ["output", "price.output"]
    ];
    function publishedPrices() {
      return {
        providers: ["deepseek-account", "deepseek-official", "llm-deepseek"],
        flash: {
          cacheHit: { offPeak: 0.02, peak: 0.04 },
          inputMiss: { offPeak: 1, peak: 2 },
          output: { offPeak: 4, peak: 8 }
        },
        pro: {
          cacheHit: { offPeak: 0.15, peak: 0.3 },
          inputMiss: { offPeak: 4.5, peak: 9 },
          output: { offPeak: 13.5, peak: 27 }
        }
      };
    }

    function numericOr(value) {
      return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined;
    }

    /** Merge a stored document over the published table, ignoring anything malformed. */
    function normalizePrices(stored) {
      const base = publishedPrices();
      if (stored === null || typeof stored !== "object") return base;
      if (Array.isArray(stored.providers)) {
        const providers = stored.providers.filter((name) => typeof name === "string" && name.length > 0);
        if (providers.length > 0) base.providers = providers;
      }
      for (const [rowKey] of PRICE_ROWS) {
        const row = stored[rowKey];
        if (row === null || typeof row !== "object") continue;
        for (const [columnKey] of PRICE_COLUMNS) {
          const column = row[columnKey];
          if (column === null || typeof column !== "object") continue;
          for (const tier of ["offPeak", "peak"]) {
            const value = numericOr(column[tier]);
            if (value !== undefined) base[rowKey][columnKey][tier] = value;
          }
        }
      }
      return base;
    }

    function readPrices() {
      try {
        if (typeof localStorage === "undefined" || localStorage === null) return publishedPrices();
        const raw = localStorage.getItem(PRICE_STORAGE_KEY);
        if (raw === null) return publishedPrices();
        return normalizePrices(JSON.parse(raw));
      } catch (error) {
        void error;
        return publishedPrices();
      }
    }

    function writePrices(prices) {
      try {
        if (typeof localStorage === "undefined" || localStorage === null) return;
        localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(prices));
      } catch (error) {
        void error;
      }
    }

    function createPriceStore() {
      let prices = readPrices();
      const listeners = new Set();
      const publish = () => {
        writePrices(prices);
        for (const listener of [...listeners]) listener();
      };
      return {
        getSnapshot: function () {
          return prices;
        },
        subscribe: function (listener) {
          listeners.add(listener);
          return function () {
            listeners.delete(listener);
          };
        },
        setPrice: function (rowKey, columnKey, tier, value) {
          const amount = numericOr(value);
          if (amount === undefined) return;
          if (prices[rowKey][columnKey][tier] === amount) return;
          const next = Object.assign({}, prices, {
            [rowKey]: Object.assign({}, prices[rowKey], {
              [columnKey]: Object.assign({}, prices[rowKey][columnKey], { [tier]: amount })
            })
          });
          prices = next;
          publish();
        },
        setProviders: function (text) {
          const providers = String(text)
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name.length > 0);
          if (providers.length === 0) return;
          const next = Object.assign({}, prices, { providers });
          prices = next;
          publish();
        },
        restorePublished: function () {
          prices = publishedPrices();
          publish();
        }
      };
    }
    /** Instant DeepSeek folded v4-pro billing into the flash row: 2026-09-14 12:00 +08:00. */
    const PRO_FOLDED_AT_MS = Date.UTC(2026, 8, 14, 4, 0);
    /** Weekday peak windows in Beijing minutes-from-midnight: 09:00-12:00, 14:00-18:00. */
    const PEAK_WINDOWS = [[540, 720], [840, 1080]];
    const BEIJING_OFFSET_MS = 8 * 36e5;

    function isPricedRoute(prices, provider) {
      return typeof provider === "string" && Array.isArray(prices.providers) && prices.providers.includes(provider);
    }

    function isPeakInstant(atMs) {
      const shifted = new Date(atMs + BEIJING_OFFSET_MS);
      const weekday = shifted.getUTCDay();
      if (weekday < 1 || weekday > 5) return false;
      const minute = shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
      return PEAK_WINDOWS.some(([from, to]) => minute >= from && minute < to);
    }

    /**
     * Estimated CNY spend for one usage bucket set on one route.
     * Public holidays are not modelled, so a holiday weekday prices at peak —
     * the estimate reads high rather than low.
     * @returns the amount, or undefined when the route carries no price row.
     */
    function estimateCost(provider, model, usage, atMs, prices) {
      if (usage === undefined || usage === null || typeof usage !== "object") return undefined;
      if (!isPricedRoute(prices, provider) || typeof model !== "string" || model.length === 0) return undefined;
      const row = model.indexOf("v4-pro") >= 0 && atMs < PRO_FOLDED_AT_MS ? prices.pro : prices.flash;
      const column = isPeakInstant(atMs) ? "peak" : "offPeak";
      const cacheRead = numberOr(usage.cacheReadTokens) ?? 0;
      const input = (numberOr(usage.uncachedInputTokens) ?? 0) + (numberOr(usage.cacheWriteTokens) ?? 0);
      const output = numberOr(usage.outputTokens) ?? 0;
      const spend = (cacheRead * row.cacheHit[column] + input * row.inputMiss[column] + output * row.output[column]) / 1e6;
      return spend;
    }

    /** Sum one Turn's per-route spends; undefined when no route carries a price. */
    function costOfRoutes(routes, prices, atMs) {
      let total;
      for (const route of routes === undefined ? [] : routes) {
        const spend = estimateCost(route.provider, route.model, route.usage, atMs, prices);
        if (spend === undefined) continue;
        total = (total ?? 0) + spend;
      }
      return total;
    }

    function trimZeros(text) {
      return text.indexOf(".") < 0 ? text : text.replace(/0+$/, "").replace(/\.$/, "");
    }

    /** CNY with enough decimals to stay readable at fraction-of-a-cent scale. */
    function formatMoney(value) {
      const amount = numberOr(value);
      if (amount === undefined) return UNKNOWN;
      if (amount <= 0) return "\u00a50";
      if (amount >= 1) return "\u00a5" + trimZeros(amount.toFixed(2));
      if (amount >= 0.01) return "\u00a5" + trimZeros(amount.toFixed(4));
      return "\u00a5" + trimZeros(amount.toFixed(6));
    }

    const RANGES = [
      ["all", "range.all", undefined],
      ["week", "range.week", 7 * 24 * 60 * 60 * 1000],
      ["day", "range.day", 24 * 60 * 60 * 1000]
    ];
    /** "standard 4 · cordis 2", largest group first, or undefined when empty. */
    function spreadText(counts) {
      if (counts === undefined || counts.size === 0) return undefined;
      return [...counts.entries()]
        .sort((left, right) => right[1] - left[1])
        .slice(0, 3)
        .map(([key, count]) => key + " " + count)
        .join(" \u00b7 ");
    }

    function percentOf(part, whole) {
      const value = numberOr(part);
      const denominator = numberOr(whole);
      if (value === undefined || denominator === undefined || denominator <= 0) return UNKNOWN;
      return Math.round((value / denominator) * 100) + "%";
    }

    const MODELS_PATH = "api/sidebar-token-usage/models";
    // The Web shell answers app routes document-relative; an Electron window
    // reaches the same route through the absolute form. Probe once, then reuse.
    let modelsBase = null;

    function requestModels(base, sessionId) {
      return fetch(base + "?session=" + encodeURIComponent(sessionId), {
        headers: { accept: "application/json" }
      }).then(function (response) {
        if (!response.ok) return undefined;
        return response.json();
      }).then(function (body) {
        if (body === undefined || body === null || !Array.isArray(body.models)) return undefined;
        return body.models.filter(function (row) {
          return row !== null && typeof row === "object" && typeof row.model === "string";
        });
      }, function () {
        return undefined;
      });
    }

    /**
     * Ask the Host for one Session's per-model totals. Resolves undefined when
     * the request is impossible or fails, so the card simply omits the section.
     */
    function fetchModels(sessionId) {
      if (typeof fetch !== "function") return Promise.resolve(undefined);
      if (modelsBase !== null) return requestModels(modelsBase, sessionId);
      const absolute = "/" + MODELS_PATH;
      return requestModels(absolute, sessionId).then(function (absoluteRows) {
        if (absoluteRows !== undefined) {
          modelsBase = absolute;
          return absoluteRows;
        }
        return requestModels(MODELS_PATH, sessionId).then(function (relativeRows) {
          if (relativeRows !== undefined) modelsBase = MODELS_PATH;
          return relativeRows;
        });
      });
    }

    const LATEST_PATH = "api/sidebar-token-usage/latest";
    let latestBase = null;

    /** Normalize one bucket set; absent numbers become 0 because the Host always sends all four. */
    function normalizeBuckets(raw) {
      const source = raw === undefined || raw === null || typeof raw !== "object" ? {} : raw;
      return {
        uncachedInputTokens: numberOr(source.uncachedInputTokens) ?? 0,
        outputTokens: numberOr(source.outputTokens) ?? 0,
        cacheReadTokens: numberOr(source.cacheReadTokens) ?? 0,
        cacheWriteTokens: numberOr(source.cacheWriteTokens) ?? 0
      };
    }

    /** Shape the Host's latest Turn into buckets plus its per-route split. */
    function normalizeLatest(body) {
      if (body === undefined || body === null || body.ok !== true) return undefined;
      const latest = body.latest;
      if (latest === null) return null;
      if (latest === undefined || typeof latest !== "object") return undefined;
      // Older Host halves report a flat single settlement; keep the page readable
      // until the Host restarts onto the Turn-shaped payload.
      if (latest.usage === undefined) {
        const usage = normalizeBuckets(latest);
        const routes = latest.provider === undefined && latest.model === undefined
          ? []
          : [{ provider: latest.provider ?? undefined, model: latest.model ?? undefined, usage }];
        return { usage, routes };
      }
      const routes = Array.isArray(latest.routes)
        ? latest.routes.filter((route) => route !== null && typeof route === "object").map((route) => ({
          provider: typeof route.provider === "string" ? route.provider : undefined,
          model: typeof route.model === "string" ? route.model : undefined,
          usage: normalizeBuckets(route.usage)
        }))
        : [];
      return { usage: normalizeBuckets(latest.usage), routes };
    }

    function requestLatest(base, sessionId) {
      return fetch(base + "?session=" + encodeURIComponent(sessionId), {
        headers: { accept: "application/json" }
      }).then(function (response) {
        if (!response.ok) return undefined;
        return response.json();
      }).then(normalizeLatest, function () {
        return undefined;
      });
    }

    /**
     * The current Session's latest Assistant settlement. The footer shows it while
     * collapsed, so it refetches whenever that Session's own usage moves.
     */
    function fetchLatest(sessionId) {
      if (typeof fetch !== "function") return Promise.resolve(undefined);
      if (latestBase !== null) return requestLatest(latestBase, sessionId);
      const absolute = "/" + LATEST_PATH;
      return requestLatest(absolute, sessionId).then(function (absoluteValue) {
        if (absoluteValue !== undefined) {
          latestBase = absolute;
          return absoluteValue;
        }
        return requestLatest(LATEST_PATH, sessionId).then(function (relativeValue) {
          if (relativeValue !== undefined) latestBase = LATEST_PATH;
          return relativeValue;
        });
      });
    }

    const BALANCE_PATH = "api/sidebar-token-usage/balance";
    const BALANCE_REFRESH_MS = 60_000;
    let balanceBase = null;
    let balanceCache;
    let balanceCacheAt = 0;

    function readBalance(base) {
      return fetch(base, { headers: { accept: "application/json" } }).then(function (response) {
        if (!response.ok) return undefined;
        return response.json();
      }).then(function (body) {
        if (body === undefined || body === null || body.ok !== true) return undefined;
        const balance = body.balance;
        if (balance === null || typeof balance !== "object" || typeof balance.amount !== "number") return undefined;
        return balance;
      }, function () {
        return undefined;
      });
    }

    /**
     * The account balance. The Host probes the Platform wallet on its own TTL and
     * falls back to the local ledger; this side only dedupes the two mounts that
     * can ask at the same moment, then refreshes on the poll interval.
     */
    function fetchBalance(fresh) {
      const now = Date.now();
      if (fresh !== true && balanceCache !== undefined && now - balanceCacheAt < 10_000) return balanceCache;
      if (typeof fetch !== "function") return Promise.resolve(undefined);
      const read = function (base) {
        return readBalance(base).then(function (value) {
          if (value !== undefined) balanceBase = base;
          return value;
        });
      };
      if (balanceBase !== null) {
        balanceCache = read(balanceBase);
      } else {
        const absolute = "/" + BALANCE_PATH;
        balanceCache = read(absolute).then(function (value) {
          return value !== undefined ? value : read(BALANCE_PATH);
        });
      }
      balanceCacheAt = now;
      return balanceCache;
    }

    function useBalance() {
      const [balance, setBalance] = react.useState(undefined);
      react.useEffect(function () {
        let live = true;
        const load = function (fresh) {
          fetchBalance(fresh).then(function (value) {
            if (live) setBalance(value === undefined ? null : value);
          });
        };
        load(false);
        if (typeof setInterval !== "function") {
          return function () {
            live = false;
          };
        }
        const timer = setInterval(function () {
          load(true);
        }, BALANCE_REFRESH_MS);
        if (timer !== undefined && timer !== null && typeof timer.unref === "function") timer.unref();
        return function () {
          live = false;
          clearInterval(timer);
        };
      }, []);
      return balance;
    }

    /** "10-20 18:07" in local time, or undefined when the record carries no instant. */
    function shortStamp(ms) {
      const value = numberOr(ms);
      if (value === undefined || value <= 0) return undefined;
      const date = new Date(value);
      const pad = (n) => String(n).padStart(2, "0");
      return pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes());
    }

    /** Per-model rows: one line per model that billed tokens in this Session. */
    function useModels(sessionId, skip) {
      const [models, setModels] = react.useState(undefined);
      react.useEffect(function () {
        if (skip === true) return undefined;
        let live = true;
        setModels(undefined);
        fetchModels(sessionId).then(function (rows) {
          if (live) setModels(rows === undefined ? null : rows);
        });
        return function () {
          live = false;
        };
      }, [sessionId, skip]);
      return models;
    }

    /**
     * The current Session's latest Turn. `stamp` moves when that Session settles a
     * Turn, so the line re-reads then; keeping the previous value while a refetch
     * is in flight stops the chip from flickering on every streaming update.
     */
    function useLatest(sessionId, stamp) {
      const [entry, setEntry] = react.useState({ id: undefined, value: undefined });
      react.useEffect(function () {
        if (sessionId === undefined || sessionId === null) return undefined;
        let live = true;
        fetchLatest(sessionId).then(function (value) {
          if (live) setEntry({ id: sessionId, value: value === undefined ? undefined : value });
        });
        return function () {
          live = false;
        };
      }, [sessionId, stamp]);
      return entry.id === sessionId ? entry.value : undefined;
    }

    function modelSection(models, t, prices) {
      const head = react.createElement("div", { key: "head", className: "stu-models-head" }, t("field.models"));
      if (models === undefined) {
        return react.createElement("div", {
          key: "byModel",
          className: "stu-models stu-sep",
          "data-stu-section": "byModel"
        }, [
          head,
          react.createElement("div", { key: "hint", className: "stu-models-head" }, t("models.loading"))
        ]);
      }
      if (models === null || models.length === 0) return null;
      const now = Date.now();
      const rows = models.map(function (row) {
        const spend = estimateCost(row.provider, row.model, row, now, prices);
        const value = compactOr(numberOr(row.total)) + (spend === undefined ? "" : " \u00b7 " + formatMoney(spend));
        return [row.model, value];
      });
      return react.createElement("div", {
        key: "byModel",
        className: "stu-models stu-sep",
        "data-stu-section": "byModel"
      }, [
        head,
        react.createElement("dl", { key: "list", className: "stu-detail" }, fieldRows(rows))
      ]);
    }

    /** Context occupancy of one Session as a 0..1 ratio, or undefined. */
    function pressureRatio(values) {
      const pressure = values === undefined ? undefined : values.contextPressure;
      if (pressure === undefined || pressure === null) return undefined;
      const used = numberOr(pressure.pressureTokens) ?? numberOr(pressure.projectedTokens);
      const window = numberOr(pressure.contextWindow);
      if (used === undefined || window === undefined || window <= 0) return undefined;
      return used / window;
    }

    /**
     * A small radial gauge. The fill colour comes from CSS so the theme owns it;
     * the data attribute marks a Session close to its compaction threshold.
     */
    function ContextRing(props) {
      const size = props.size === undefined ? 14 : props.size;
      const stroke = props.size === undefined ? 2 : 2.5;
      const ratio = props.ratio;
      const radius = (size - stroke) / 2;
      const circumference = 2 * Math.PI * radius;
      const filled = ratio === undefined ? 0 : Math.max(0, Math.min(1, ratio));
      const label = props.t === undefined
        ? String(Math.round(filled * 100)) + "%"
        : props.t("ring.label") + ": " + Math.round(filled * 100) + "%";
      return react.createElement("svg", {
        className: "stu-ring",
        width: size,
        height: size,
        viewBox: "0 0 " + size + " " + size,
        role: "img",
        "aria-label": label,
        "data-tight": ratio !== undefined && ratio >= 0.8 ? "true" : "false"
      }, [
        react.createElement("circle", {
          key: "bg", className: "stu-ring-bg", cx: size / 2, cy: size / 2, r: radius,
          fill: "none", "stroke-width": stroke
        }),
        react.createElement("circle", {
          key: "fg", className: "stu-ring-fg", cx: size / 2, cy: size / 2, r: radius,
          fill: "none", "stroke-width": stroke, "stroke-linecap": "round",
          "stroke-dasharray": (circumference * filled) + " " + circumference,
          transform: "rotate(-90 " + (size / 2) + " " + (size / 2) + ")"
        })
      ]);
    }

    function badgeTitle(total, t) {
      return t("row.label") + ": " + (total === undefined ? UNKNOWN : groupDigits(total));
    }

    /** The Session's own value for the configured metric. */
    function sessionFigure(values, prices, metric, atMs) {
      if (values === undefined) return undefined;
      const usage = values.tokenUsage;
      if (metric !== "cost") return sumUsage(usage);
      const selection = values.modelSelection;
      const used = selection === undefined || selection === null ? undefined : selection.lastUsed;
      return estimateCost(used === undefined || used === null ? undefined : used.provider, used === undefined || used === null ? undefined : used.model, usage, atMs, prices);
    }

    /**
     * DSH pins the slot around this plugin to its own width through a
     * module-hashed class. Overriding it from a stylesheet needs both `:has()`
     * and that exact class; writing the parent's inline styles is class-agnostic
     * and always wins, so the pill takes its real width instead of spilling over
     * the Session title.
     */
    let layoutReported = false;

    /** Describe one element the way a stylesheet would need to see it. */
    function describeElement(element) {
      let computed = {};
      try {
        const style = getComputedStyle(element);
        computed = { width: style.width, maxWidth: style.maxWidth, display: style.display, flex: style.flex };
      } catch (error) {
        void error;
      }
      return {
        tag: element.tagName,
        cls: typeof element.className === "string" ? element.className : String(element.className),
        inline: {
          width: element.style.width,
          maxWidth: element.style.maxWidth,
          flex: element.style.flex,
          justifyContent: element.style.justifyContent
        },
        computed
      };
    }

    /** Send the real ancestor chain to the Host once, so layout can be diagnosed. */
    function reportLayoutOnce(node) {
      if (layoutReported) return;
      if (typeof fetch !== "function") return;
      layoutReported = true;
      const chain = [];
      let element = node.parentElement;
      for (let depth = 0; depth < 5 && element !== null; depth += 1) {
        chain.push(describeElement(element));
        element = element.parentElement;
      }
      const payload = {
        at: Date.now(),
        self: describeElement(node),
        chain,
        rowText: (node.parentElement && node.parentElement.parentElement
          ? node.parentElement.parentElement.textContent || ""
          : "").slice(0, 120)
      };
      const path = "api/sidebar-token-usage/diag?data=" + encodeURIComponent(JSON.stringify(payload));
      fetch("/" + path).catch(function () {
        return fetch(path).catch(function () {
          return undefined;
        });
      });
    }

    /** Any ancestor narrower than this is a slot box, not the row. */
    const SLOT_WIDTH_LIMIT = 48;
    const SLOT_RELEASE_DEPTH = 4;

    function useWidthForContent(ref) {
      react.useEffect(function () {
        const node = ref.current;
        if (node === null || node === undefined) return undefined;
        if (typeof getComputedStyle !== "function") return undefined;
        const touched = [];
        let element = node.parentElement;
        for (let depth = 0; depth < SLOT_RELEASE_DEPTH && element !== null; depth += 1) {
          let width = 0;
          try {
            width = Number.parseFloat(getComputedStyle(element).width);
          } catch (error) {
            void error;
            width = 0;
          }
          if (Number.isFinite(width) && width > 0 && width <= SLOT_WIDTH_LIMIT) {
            touched.push({
              element,
              width: element.style.width,
              maxWidth: element.style.maxWidth,
              flex: element.style.flex,
              justifyContent: element.style.justifyContent,
              marginInlineStart: element.style.marginInlineStart
            });
            element.style.width = "auto";
            element.style.maxWidth = "none";
            element.style.flex = "none";
            element.style.justifyContent = "flex-start";
            if (depth === 0) element.style.marginInlineStart = "2px";
          }
          element = element.parentElement;
        }
        reportLayoutOnce(node);
        if (touched.length === 0) return undefined;
        return function () {
          for (const saved of touched) {
            saved.element.style.width = saved.width;
            saved.element.style.maxWidth = saved.maxWidth;
            saved.element.style.flex = saved.flex;
            saved.element.style.justifyContent = saved.justifyContent;
            saved.element.style.marginInlineStart = saved.marginInlineStart;
          }
        };
      }, [ref]);
    }

    function RowBadge(props) {
      const sessionId = props.sessionId;
      const slotRef = react.useRef(null);
      useWidthForContent(slotRef);
      const values = props.useSessionList((snapshot) => projectionValues(snapshot, sessionId));
      const flags = props.useFieldSettings((value) => value);
      const prices = props.usePriceSettings((value) => value);
      const metric = flags.rowMetric;
      const figure = sessionFigure(values, prices, metric, Date.now());
      const shown = metric === "cost" ? formatMoney(figure) : formatCount(figure);
      const title = metric === "cost"
        ? props.t("field.cost") + ": " + shown
        : badgeTitle(figure, props.t);
      const ring = flags.rowRing
        ? react.createElement(ContextRing, { key: "ring", ratio: pressureRatio(values), t: props.t })
        : null;
      const onClick = typeof props.openPopover === "function"
        ? (event) => {
          event.stopPropagation();
          props.openPopover({ sessionId, x: event.clientX, y: event.clientY });
        }
        : undefined;
      // Without the ring the pill IS the slot child, exactly as it was before the
      // ring existed: one element, no wrapper, no extra box in the row.
      if (!flags.rowRing) {
        return react.createElement("span", {
          ref: slotRef,
          className: "stu-inline",
          "data-sidebar-token-usage": "row",
          "data-metric": metric,
          "data-unknown": figure === undefined ? "true" : "false",
          title,
          "aria-label": title,
          onClick,
          role: onClick === undefined ? undefined : "button",
          tabIndex: onClick === undefined ? undefined : 0
        }, shown);
      }
      return react.createElement("span", {
        ref: slotRef,
        className: "stu-inline-wrap",
        "data-sidebar-token-usage": "row",
        "data-metric": metric,
        title,
        onClick,
        role: onClick === undefined ? undefined : "button",
        tabIndex: onClick === undefined ? undefined : 0
      }, [
        react.createElement("span", {
          key: "value",
          className: "stu-inline",
          "data-unknown": figure === undefined ? "true" : "false",
          "aria-label": title
        }, shown),
        ring
      ]);
    }

    function fieldRows(entries) {
      const nodes = [];
      for (let index = 0; index < entries.length; index += 1) {
        nodes.push(react.createElement("dt", { key: "k" + index }, entries[index][0]));
        nodes.push(react.createElement("dd", { key: "v" + index }, entries[index][1]));
      }
      return nodes;
    }

    /** One titled group; the first group in the card carries no separator. */
    function group(key, className, entries) {
      const nodes = [react.createElement("dl", { key: "list", className: "stu-detail" }, fieldRows(entries))];
      return react.createElement("div", {
        key,
        className: className + " stu-sep",
        "data-stu-section": key
      }, nodes);
    }

    function RowHover(props) {
      const sessionId = props.sessionId;
      const entry = props.useSessionList((snapshot) => pickEntry(snapshot, sessionId));
      const flags = props.useFieldSettings((value) => value);
      const prices = props.usePriceSettings((value) => value);
      const values = entry === undefined ? undefined : entry.projectionValues;
      const usage = values === undefined ? undefined : values.tokenUsage;
      const pressure = values === undefined ? undefined : values.contextPressure;
      const stats = values === undefined ? undefined : values.sessionStats;
      const t = props.t;
      // Click-to-expand mode: the detail lives in the click popover, so the
      // shell's hover card renders nothing and must not cost a host read either.
      const hidden = props.alwaysShow !== true && flags.rowExpand === "click";
      const fetchedModels = useModels(sessionId, hidden);
      const models = props.previewModels === undefined ? fetchedModels : props.previewModels;
      if (hidden) return null;

      const sections = [];
      const main = [];
      if (flags.usage) {
        main.push([t("field.input"), usage === undefined ? UNKNOWN : textOr(numberOr(usage.uncachedInputTokens))]);
        main.push([t("field.output"), usage === undefined ? UNKNOWN : textOr(numberOr(usage.outputTokens))]);
        main.push([t("field.cacheRead"), usage === undefined ? UNKNOWN : textOr(numberOr(usage.cacheReadTokens))]);
        main.push([t("field.cacheWrite"), usage === undefined ? UNKNOWN : textOr(numberOr(usage.cacheWriteTokens))]);
      }
      if (flags.context) main.push([t("field.context"), contextText(pressure)]);
      if (main.length > 0) {
        sections.push(react.createElement("dl", {
          key: "main",
          className: "stu-detail",
          "data-stu-section": "main"
        }, fieldRows(main)));
      }

      if (flags.model) {
        const last = values === undefined ? undefined : values.modelSelection;
        const used = last === undefined || last === null ? undefined : last.lastUsed;
        const model = used === undefined || used === null ? UNKNOWN : String(used.model ?? UNKNOWN);
        const effort = used === undefined || used === null ? UNKNOWN : String(used.reasoningEffort ?? UNKNOWN);
        sections.push(group("model", "stu-hover-group", [
          [t("field.model"), model],
          [t("field.effort"), effort]
        ]));
      }

      if (flags.cache) {
        const read = usage === undefined ? undefined : numberOr(usage.cacheReadTokens);
        const input = usage === undefined ? undefined : numberOr(usage.uncachedInputTokens);
        const write = usage === undefined ? undefined : numberOr(usage.cacheWriteTokens);
        const denominator = read === undefined && input === undefined && write === undefined
          ? undefined
          : (read ?? 0) + (input ?? 0) + (write ?? 0);
        const percent = denominator === undefined || denominator <= 0 || read === undefined
          ? UNKNOWN
          : Math.round((read / denominator) * 100) + "%";
        sections.push(group("cache", "stu-hover-group", [[t("field.cacheHit"), percent]]));
      }

      if (flags.activity) {
        const turns = stats === undefined ? undefined : numberOr(stats.turns);
        const steps = stats === undefined ? undefined : numberOr(stats.steps);
        const spent = stats === undefined ? undefined : (numberOr(stats.llmMs) ?? 0) + (numberOr(stats.toolMs) ?? 0);
        sections.push(group("activity", "stu-hover-group", [
          [t("field.turns"), turns === undefined ? UNKNOWN : String(turns)],
          [t("field.steps"), steps === undefined ? UNKNOWN : String(steps)],
          [t("field.duration"), stats === undefined ? UNKNOWN : formatDuration(spent)]
        ]));
      }

      if (flags.speed) {
        const ttftMs = stats === undefined ? undefined : numberOr(stats.ttftMs);
        const ttftSteps = stats === undefined ? undefined : numberOr(stats.ttftSteps);
        const firstToken = ttftMs === undefined || ttftSteps === undefined || ttftSteps <= 0
          ? UNKNOWN
          : formatDuration(ttftMs / ttftSteps);
        const decodeTokens = stats === undefined ? undefined : numberOr(stats.decodeTokens);
        const decodeMs = stats === undefined ? undefined : numberOr(stats.decodeMs);
        sections.push(group("speed", "stu-hover-group", [
          [t("field.ttft"), firstToken],
          [t("field.speed"), formatRate(decodeTokens, decodeMs, t("unit.tokensPerSecond"))]
        ]));
      }

      if (flags.env) {
        const permissions = values === undefined ? undefined : values.permissions;
        const permission = permissions === undefined || permissions === null
          ? UNKNOWN
          : String(permissions.preset ?? UNKNOWN);
        const preset = values === undefined || values.agentPreset === undefined
          ? UNKNOWN
          : String(values.agentPreset);
        const cwd = (entry === undefined ? undefined : entry.cwd)
          ?? (values === undefined ? undefined : values.workingDirectory);
        sections.push(group("env", "stu-hover-group", [
          [t("field.permission"), permission],
          [t("field.preset"), preset],
          [t("field.cwd"), cwd === undefined ? UNKNOWN : String(cwd)]
        ]));
      }

      if (flags.cost) {
        const last = values === undefined ? undefined : values.modelSelection;
        const used = last === undefined || last === null ? undefined : last.lastUsed;
        const spend = estimateCost(used === undefined || used === null ? undefined : used.provider, used === undefined || used === null ? undefined : used.model, usage, Date.now(), prices);
        if (spend !== undefined) {
          sections.push(group("cost", "stu-hover-group", [[t("field.cost"), formatMoney(spend)]]));
        }
      }

      if (flags.byModel) sections.push(modelSection(models, t, prices));

      return react.createElement("div", {
        className: "stu-hover",
        "data-sidebar-token-usage": "hover"
      }, sections);
    }

    function FooterCard(props) {
      const snapshot = props.useSessionList((value) => value);
      const flags = props.useFieldSettings((value) => value);
      const range = flags.footerRange;
      const metric = flags.footMetric;
      const t = props.t;
      const windowMs = RANGES.find((entry) => entry[0] === range)?.[2];
      const prices = props.usePriceSettings((value) => value);
      const summary = react.useMemo(() => aggregate(snapshot, windowMs, prices), [snapshot, windowMs, prices]);
      const balance = useBalance();
      const balanceStamp = balance === undefined || balance === null ? undefined : shortStamp(balance.asOf);
      const [open, setOpen] = react.useState(false);
      const clickable = flags.footExpand === "click";
      const toggle = () => setOpen((value) => !value);
      const buckets = summary.buckets;
      const totals = summary.totals;
      const known = totals !== undefined;
      const bucketText = (name) => (known ? compactOr(numberOr(buckets[name])) : UNKNOWN);

      // The collapsed face also carries one line about the Session the main view
      // holds: its title and its own tokens (plus cost when a price is known).
      const current = currentEntry(snapshot);
      const currentValues = current === undefined ? undefined : current.projectionValues;
      const currentTitle = currentValues !== undefined && typeof currentValues.title === "string" && currentValues.title.length > 0
        ? currentValues.title
        : (current !== undefined && typeof current.title === "string" && current.title.length > 0 ? current.title : undefined);
      const currentTokens = currentValues === undefined ? undefined : sumUsage(currentValues.tokenUsage);
      const currentCost = currentValues === undefined ? undefined : sessionFigure(currentValues, prices, "cost", Date.now());
      const currentText = compactOr(currentTokens) + (currentCost === undefined ? "" : " \u00b7 " + formatMoney(currentCost));

      // The latest exchange's own settlement, read from the Host log on demand.
      const currentId = current === undefined ? undefined : current.id;
      const previewLatest = props.previewLatest;
      const wantsLatest = previewLatest === undefined && props.wide !== false;
      // Refetch when the Session's own tokens move or when its Turn settles.
      const currentStamp = String(currentTokens ?? "") + "|" + (current !== undefined && current.running === true ? "run" : "idle");
      const fetchedLatest = useLatest(wantsLatest ? currentId : undefined, currentStamp);
      const latest = previewLatest !== undefined ? previewLatest : fetchedLatest;
      const latestUsage = latest === undefined || latest === null ? undefined : latest.usage;
      const latestRoutes = latest === undefined || latest === null || latest.routes === undefined ? [] : latest.routes;
      const latestTotal = latestUsage === undefined ? undefined : sumUsage(latestUsage);
      const latestSpend = costOfRoutes(latestRoutes, prices, Date.now());
      const openLatest = (event) => {
        event.stopPropagation();
        if (typeof props.openLatest !== "function" || latestUsage === undefined) return;
        const rect = event.currentTarget.getBoundingClientRect();
        props.openLatest({
          usage: latestUsage,
          routes: latestRoutes,
          x: rect.left,
          y: rect.top
        });
      };

      const main = [];
      if (flags.footSessions) main.push([t("field.sessions"), String(summary.sessions)]);
      if (flags.footTokens) {
        main.push([t("field.total"), known ? groupDigits(totals) : UNKNOWN]);
        main.push([t("field.input"), bucketText("uncachedInputTokens")]);
        main.push([t("field.output"), bucketText("outputTokens")]);
        main.push([t("field.cacheRead"), bucketText("cacheReadTokens")]);
        main.push([t("field.cacheWrite"), bucketText("cacheWriteTokens")]);
      }

      const groups = [];
      if (main.length > 0) {
        groups.push(react.createElement("dl", {
          key: "main",
          className: "stu-detail",
          "data-stu-section": "footMain"
        }, fieldRows(main)));
      }
      if (flags.footStatus) {
        groups.push(group("footStatus", "stu-foot-group", [[t("field.running"), String(summary.running)], [t("field.archived"), String(summary.archived)]]));
      }
      if (flags.footActivity) {
        groups.push(group("footActivity", "stu-foot-group", [
          [t("field.turns"), String(summary.turns)],
          [t("field.steps"), String(summary.steps)],
          [t("field.duration"), formatDuration(summary.spent)]
        ]));
      }
      if (flags.footSpeed) {
        const firstToken = summary.ttftSteps > 0 ? formatDuration(summary.ttftMs / summary.ttftSteps) : UNKNOWN;
        groups.push(group("footSpeed", "stu-foot-group", [
          [t("field.ttft"), firstToken],
          [t("field.speed"), formatRate(summary.decodeTokens, summary.decodeMs, t("unit.tokensPerSecond"))]
        ]));
      }
      if (flags.footCache) {
        groups.push(group("footCache", "stu-foot-group", [[t("field.cacheHit"), percentOf(buckets.cacheReadTokens, buckets.cacheReadTokens + buckets.uncachedInputTokens + buckets.cacheWriteTokens)]]));
      }
      if (flags.footCost && summary.cost !== undefined) {
        groups.push(group("footCost", "stu-foot-group", [[t("field.cost"), formatMoney(summary.cost)]]));
      }
      if (flags.footTop && summary.top.length > 0) {
        groups.push(group("footTop", "stu-foot-group", summary.top.map((row) => [row.title, formatMoney(row.cost)])));
      }
      if (flags.footPressure && summary.maxPressure !== undefined) {
        const rows = [[t("field.pressure"), Math.round(summary.maxPressure.ratio * 100) + "%"]];
        if (summary.overShare > 0) rows.push([t("field.overShare"), String(summary.overShare)]);
        groups.push(group("footPressure", "stu-foot-group", rows));
      }
      if (flags.footAvg && summary.avgTokens !== undefined) {
        const rows = [[t("field.avg"), compactOr(summary.avgTokens)]];
        if (summary.outputShare !== undefined) rows.push([t("field.outputShare"), Math.round(summary.outputShare) + "%"]);
        groups.push(group("footAvg", "stu-foot-group", rows));
      }
      if (flags.footSpan && summary.oldest !== undefined && summary.newest !== undefined) {
        const from = shortStamp(summary.oldest);
        const to = shortStamp(summary.newest);
        if (from !== undefined && to !== undefined) {
          groups.push(group("footSpan", "stu-foot-group", [[t("field.span"), from + " ~ " + to]]));
        }
      }
      if (flags.footEnv) {
        const rows = [];
        const presetText = spreadText(summary.presetCounts);
        const permissionText = spreadText(summary.permissionCounts);
        if (presetText !== undefined) rows.push([t("field.presetSpread"), presetText]);
        if (permissionText !== undefined) rows.push([t("field.permissionSpread"), permissionText]);
        if (rows.length > 0) groups.push(group("footEnv", "stu-foot-group", rows));
      }
      if (flags.footModels) {
        const rows = summary.models.map(function (row) {
          return [row.model, row.sessions + " " + t("unit.sessions") + " \u00b7 " + compactOr(row.total)];
        });
        if (rows.length > 0) groups.push(group("footModels", "stu-foot-group", rows));
      }

      const mainFigure = metric === "cost" ? formatMoney(summary.cost) : compactOr(totals);
      const figureTitle = metric === "cost" ? t("field.cost") : t("field.total");
      const label = range === "week"
        ? t("footer.labelWeek")
        : (range === "day" ? t("footer.labelDay") : t("footer.label"));
      return react.createElement("div", {
        className: "stu-foot",
        "data-wide": props.wide === false ? "false" : "true",
        "data-expand": clickable ? "click" : "hover",
        "data-open": clickable && open ? "true" : "false",
        "data-clickable": clickable ? "true" : "false",
        "data-sidebar-token-usage": "footer",
        role: clickable ? "button" : undefined,
        tabIndex: clickable ? 0 : undefined,
        "aria-expanded": clickable ? (open ? "true" : "false") : undefined,
        // The card grows upward from the sidebar foot, so a second click on the
        // exact same pixel can land in the detail area: the whole card toggles,
        // while the range tabs stop propagation and keep their own action.
        onClick: clickable ? toggle : undefined,
        onKeyDown: clickable ? (event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          toggle();
        } : undefined,
        title: label + ": " + compactOr(totals)
      }, [
        react.createElement("div", {
          key: "main",
          className: "stu-foot-main"
        }, [
          react.createElement("span", { key: "label", className: "stu-foot-label" }, label),
          react.createElement("span", {
            key: "right",
            className: "stu-foot-right"
          }, [
            flags.footRing
              ? react.createElement(ContextRing, { key: "ring", ratio: summary.maxPressure === undefined ? undefined : summary.maxPressure.ratio, t })
              : null,
            flags.footRing && summary.maxPressure !== undefined
              ? react.createElement("span", {
                key: "pressure",
                className: "stu-foot-pressure",
                "data-stu-pressure": "footer"
              }, Math.round(summary.maxPressure.ratio * 100) + "%")
              : null,
            react.createElement("span", {
              key: "total",
              className: "stu-foot-total",
              "data-metric": metric,
              title: figureTitle
            }, mainFigure),
            metric !== "cost" && summary.cost !== undefined ? react.createElement("span", {
              key: "costHint",
              className: "stu-foot-cost-hint",
              "data-stu-cost-hint": "true",
              title: t("field.cost") + ": " + formatMoney(summary.cost)
            }, "\u2248" + formatMoney(summary.cost)) : null
          ])
        ]),
        current === undefined ? null : react.createElement("div", {
          key: "current",
          className: "stu-foot-current",
          "data-stu-current": "true"
        }, [
          react.createElement("div", {
            key: "row",
            className: "stu-foot-current-row",
            title: (currentTitle === undefined ? t("foot.current") : t("foot.current") + " \u00b7 " + currentTitle) + " \u00b7 " + currentText
          }, [
            react.createElement("span", { key: "tag", className: "stu-foot-current-tag" }, t("foot.current")),
            currentTitle === undefined ? null : react.createElement("span", {
              key: "title",
              className: "stu-foot-current-title"
            }, currentTitle),
            react.createElement("span", { key: "usage", className: "stu-foot-current-value" }, compactOr(currentTokens)),
            currentCost === undefined ? null : react.createElement("span", {
              key: "price",
              className: "stu-foot-current-price"
            }, formatMoney(currentCost))
          ]),
          latestTotal === undefined ? null : react.createElement("div", {
            key: "latest",
            className: "stu-foot-latest-row",
            "data-stu-latest": "true"
          }, [
            react.createElement("button", {
              key: "usage",
              type: "button",
              className: "stu-foot-latest-chip",
              title: t("latest.title"),
              onClick: openLatest
            }, t("latest.usage") + " " + compactOr(latestTotal) + " " + t("latest.tok")),
            latestSpend === undefined ? null : react.createElement("span", {
              key: "price",
              className: "stu-foot-latest-price"
            }, formatMoney(latestSpend))
          ])
        ]),
        balance === undefined || balance === null || flags.footBalance !== true ? null : react.createElement("div", {
          key: "balance",
          className: "stu-foot-balance",
          "data-stu-balance": "true",
          title: t("field.balance") + ": " + formatMoney(balance.amount)
            + (balanceStamp === undefined ? "" : " \u00b7 " + balanceStamp)
            + " \u00b7 " + (balance.source === "platform" ? t("balance.live") : t("balance.recorded"))
        }, [
          react.createElement("span", { key: "label", className: "stu-foot-balance-label" }, t("foot.balance")),
          balanceStamp === undefined ? null : react.createElement("span", {
            key: "time",
            className: "stu-foot-balance-time"
          }, balanceStamp),
          react.createElement("span", { key: "value", className: "stu-foot-balance-value" }, formatMoney(balance.amount))
        ]),
        react.createElement("div", { key: "detail", className: "stu-foot-detail" }, [react.createElement("div", {
            key: "tabs",
            className: "stu-tabs",
            role: "tablist",
            title: t("range.hint")
          }, RANGES.map(([id, label]) => react.createElement("button", {
            key: id,
            type: "button",
            role: "tab",
            className: range === id ? "stu-tab stu-tab-active" : "stu-tab",
            "data-stu-tab": id,
            "aria-selected": range === id ? "true" : "false",
            onClick: (event) => {
              event.stopPropagation();
              props.setChoice("footerRange", id);
            }
          }, t(label))))].concat(groups))
      ]);
    }

    function checkRows(scope, flags, t, setField) {
      return FIELD_OPTIONS.filter(function (option) {
        return option[3] === scope;
      }).map(function (option) {
        const id = option[0];
        return react.createElement("label", { key: id, className: "stu-check" }, [
          react.createElement("input", {
            key: "box",
            type: "checkbox",
            checked: flags[id] === true,
            onChange: function (event) {
              setField(id, event.target.checked === true);
            }
          }),
          react.createElement("span", { key: "text", className: "stu-check-text" }, t(option[1]))
        ]);
      });
    }

    /** One stand-in Session so the settings page can show the real components. */
    function previewSnapshot() {
      return {
        ids: ["preview"],
        byId: {
          preview: {
            id: "preview",
            updatedAt: Date.now(),
            cwd: "D:\\work\\demo",
            retainedBy: { mainView: 1 },
            projectionValues: {
              title: "preview",
              tokenUsage: { uncachedInputTokens: 12400, outputTokens: 3100, cacheReadTokens: 486000, cacheWriteTokens: 0 },
              contextPressure: { pressureTokens: 62000, contextWindow: 128000 },
              sessionStats: {
                turns: 9, steps: 42, llmMs: 320000, toolMs: 180000,
                ttftMs: 270000, ttftSteps: 40, decodeMs: 90000, decodeTokens: 3100
              },
              modelSelection: {
                lastUsed: { provider: "deepseek-account", model: "deepseek-flash", reasoningEffort: "high" },
                pending: null
              },
              permissions: { preset: "workspace-write" },
              agentPreset: "standard"
            }
          }
        }
      };
    }

    const PREVIEW_MODELS = [
      { model: "deepseek-flash", provider: "deepseek-account", total: 501500, uncachedInputTokens: 12400, outputTokens: 3100, cacheReadTokens: 486000, cacheWriteTokens: 0 }
    ];
    /** A sample "latest exchange" so the footer preview exercises the real line. */
    const PREVIEW_LATEST = {
      usage: { uncachedInputTokens: 12400, outputTokens: 3100, cacheReadTokens: 486000, cacheWriteTokens: 0 },
      routes: [{
        provider: "deepseek-account",
        model: "deepseek-flash",
        usage: { uncachedInputTokens: 12400, outputTokens: 3100, cacheReadTokens: 486000, cacheWriteTokens: 0 }
      }]
    };

    /** One editable price table row: three columns by two billing tiers. */
    function PriceRow(props) {
      const t = props.t;
      const values = props.values;
      const cells = [];
      for (const [columnKey, labelKey] of PRICE_COLUMNS) {
        for (const tier of ["offPeak", "peak"]) {
          cells.push(react.createElement("label", {
            key: columnKey + "-" + tier,
            className: "stu-price-cell"
          }, [
            react.createElement("span", { key: "l", className: "stu-price-label" },
              t(labelKey) + " \u00b7 " + t(tier === "peak" ? "price.peak" : "price.offPeak")),
            react.createElement("input", {
              key: "i",
              type: "number",
              min: "0",
              step: "0.01",
              className: "stu-price-input",
              "data-stu-price": props.rowKey + "." + columnKey + "." + tier,
              value: String(values[columnKey][tier]),
              onChange: (event) => {
                const next = Number(event.target.value);
                props.onChange(props.rowKey, columnKey, tier, next);
              }
            })
          ]));
        }
      }
      return react.createElement("div", { className: "stu-price-row", "data-stu-price-row": props.rowKey }, [
        react.createElement("div", { key: "head", className: "stu-models-head" }, t(props.labelKey)),
        react.createElement("div", { key: "cells", className: "stu-price-grid" }, cells)
      ]);
    }

    /** One segmented control: a label plus its mutually exclusive values. */
    function ChoiceRow(props) {
      const t = props.t;
      const buttons = props.option.values.map(function (pair) {
        const active = props.value === pair[0];
        return react.createElement("button", {
          key: pair[0],
          type: "button",
          className: active ? "stu-seg stu-seg-active" : "stu-seg",
          "data-stu-choice": props.option.id + ":" + pair[0],
          "aria-pressed": active ? "true" : "false",
          onClick: () => props.onPick(props.option.id, pair[0])
        }, t(pair[1]));
      });
      return react.createElement("div", { className: "stu-choice", "data-stu-choice-row": props.option.id }, [
        react.createElement("span", { key: "label", className: "stu-choice-label" }, t(props.option.label)),
        react.createElement("span", { key: "seg", className: "stu-seg-group" }, buttons)
      ]);
    }

    function SettingsSection(props) {
      const flags = props.useFieldSettings((value) => value);
      const prices = props.usePriceSettings((value) => value);
      const t = props.t;
      const sample = previewSnapshot();
      const previewList = (selector) => selector(sample);
      const scopes = [
        ["hover", "settings.hover"],
        ["footer", "settings.footer"]
      ];
      const choiceRowsFor = (scope) => CHOICE_OPTIONS
        .filter((option) => option.scope === scope)
        .map((option) => react.createElement(ChoiceRow, {
          key: option.id,
          option,
          value: flags[option.id],
          t,
          onPick: props.setChoice
        }));
      const blocks = scopes.map(function (pair) {
        return react.createElement("div", {
          key: pair[0],
          className: "stu-settings-group",
          "data-stu-group": pair[0]
        }, [
          react.createElement("div", { key: "head", className: "stu-models-head" }, t(pair[1])),
          react.createElement("div", { key: "cols", className: "stu-two-col" }, [
            react.createElement("div", { key: "controls", className: "stu-col" }, [
              react.createElement("div", { key: "choices", className: "stu-choice-list" }, choiceRowsFor(pair[0])),
              react.createElement("div", { key: "list", className: "stu-check-list" }, checkRows(pair[0], flags, t, props.setField))
            ]),
            react.createElement("div", { key: "preview", className: "stu-col stu-preview" }, [
              react.createElement("div", { key: "label", className: "stu-preview-label" }, t("preview.label")),
              react.createElement("div", {
                key: "body",
                className: pair[0] === "hover" ? "stu-preview-hover" : "stu-preview-foot"
              }, react.createElement(pair[0] === "hover" ? RowHover : FooterCard, pair[0] === "hover" ? {
                sessionId: "preview",
                t,
                useSessionList: previewList,
                useFieldSettings: props.useFieldSettings,
                usePriceSettings: props.usePriceSettings,
                previewModels: PREVIEW_MODELS,
                alwaysShow: true
              } : {
                t,
                wide: true,
                useSessionList: previewList,
                useFieldSettings: props.useFieldSettings,
                usePriceSettings: props.usePriceSettings,
                setChoice: props.setChoice,
                previewLatest: PREVIEW_LATEST
              }))
            ])
          ])
        ]);
      });
      const priceRows = PRICE_ROWS.map(function (pair) {
        return react.createElement(PriceRow, {
          key: pair[0],
          rowKey: pair[0],
          labelKey: pair[1],
          values: prices[pair[0]],
          t,
          onChange: props.setPrice
        });
      });
      const priceBlock = react.createElement("div", {
        key: "prices",
        className: "stu-settings-group",
        "data-stu-group": "prices"
      }, [
        react.createElement("div", { key: "head", className: "stu-models-head" }, t("price.title")),
        react.createElement("p", { key: "hint", className: "stu-settings-hint" }, t("price.hint")),
        react.createElement("div", { key: "rows", className: "stu-price-rows" }, priceRows),
        react.createElement("label", { key: "providers", className: "stu-price-cell stu-price-providers" }, [
          react.createElement("span", { key: "l", className: "stu-price-label" }, t("price.providers")),
          react.createElement("input", {
            key: "i",
            type: "text",
            className: "stu-price-input stu-price-text",
            "data-stu-price": "providers",
            defaultValue: prices.providers.join(", "),
            onBlur: (event) => props.setProviders(event.target.value)
          })
        ])
      ]);
      return react.createElement("div", {
        className: "stu-settings",
        "data-sidebar-token-usage": "settings"
      }, [
        react.createElement("p", { key: "hint", className: "stu-settings-hint" }, t("settings.hint")),
        react.createElement("div", { key: "groups", className: "stu-settings-groups" }, blocks),
        priceBlock
      ]);
    }

    /** Which Session's popover is open, and where it was anchored. */
    function createPopoverStore() {
      let value = null;
      const listeners = new Set();
      const publish = () => {
        for (const listener of [...listeners]) listener();
      };
      return {
        getSnapshot: () => value,
        subscribe: function (listener) {
          listeners.add(listener);
          return function () {
            listeners.delete(listener);
          };
        },
        open: function (next) {
          value = next;
          publish();
        },
        close: function () {
          if (value === null) return;
          value = null;
          publish();
        }
      };
    }

    /** The latest-exchange card: its payload plus the anchor that opened it. */
    function createLatestStore() {
      let value = null;
      const listeners = new Set();
      const publish = () => {
        for (const listener of [...listeners]) listener();
      };
      return {
        getSnapshot: () => value,
        subscribe: function (listener) {
          listeners.add(listener);
          return function () {
            listeners.delete(listener);
          };
        },
        open: function (next) {
          value = next;
          publish();
        },
        close: function () {
          if (value === null) return;
          value = null;
          publish();
        }
      };
    }

    /** Break one exchange down the way the reference card does. */
    function LatestPopover(props) {
      const state = props.useLatestCard((value) => value);
      if (state === null) return null;
      const t = props.t;
      const usage = state.usage;
      const total = sumUsage(usage) ?? 0;
      const read = numberOr(usage.cacheReadTokens) ?? 0;
      const input = numberOr(usage.uncachedInputTokens) ?? 0;
      const write = numberOr(usage.cacheWriteTokens) ?? 0;
      const output = numberOr(usage.outputTokens) ?? 0;
      const denominator = read + input + write;
      const hitValue = denominator > 0 ? Math.round((read / denominator) * 1000) / 10 : undefined;
      const hit = hitValue === undefined
        ? UNKNOWN
        : (hitValue === Math.round(hitValue) ? String(Math.round(hitValue)) : hitValue.toFixed(1)) + "%";
      const routeNames = [];
      for (const route of state.routes === undefined ? [] : state.routes) {
        const name = route.provider !== undefined && route.model !== undefined
          ? route.provider + "/" + route.model
          : (route.model === undefined ? UNKNOWN : route.model);
        if (!routeNames.includes(name)) routeNames.push(name);
      }
      const routeText = routeNames.length === 0 ? UNKNOWN : routeNames.join(", ");
      const viewportWidth = typeof window === "undefined" || typeof window.innerWidth !== "number" ? 1280 : window.innerWidth;
      const viewportHeight = typeof window === "undefined" || typeof window.innerHeight !== "number" ? 800 : window.innerHeight;
      const width = 268;
      const anchorX = numberOr(state.x);
      const anchorY = numberOr(state.y);
      const left = Math.min(Math.max(12, anchorX ?? 12), Math.max(12, viewportWidth - width - 12));
      // Anchor above the chip, but never so high that the card leaves the viewport.
      const bottom = Math.min(
        Math.max(12, viewportHeight - (anchorY ?? viewportHeight) + 8),
        Math.max(12, viewportHeight - 220)
      );
      const rows = [
        [t("latest.provider"), routeText],
        [t("field.cacheHit"), hit],
        [t("latest.uncachedInput"), groupDigits(input) + " " + t("latest.tok")],
        [t("latest.cacheRead"), groupDigits(read) + " " + t("latest.tok")],
        [t("latest.cacheWrite"), groupDigits(write) + " " + t("latest.tok")],
        [t("field.output"), groupDigits(output) + " " + t("latest.tok")]
      ];
      return react.createElement("div", {
        className: "stu-latest-backdrop",
        "data-sidebar-token-usage": "latest",
        onClick: props.closeLatest
      }, react.createElement("div", {
        className: "stu-latest-card",
        style: { left: left + "px", bottom: bottom + "px" },
        onClick: (event) => event.stopPropagation()
      }, [
        react.createElement("div", { key: "head", className: "stu-latest-head" }, [
          react.createElement("span", { key: "title", className: "stu-latest-title" }, t("latest.title")),
          react.createElement("span", { key: "total", className: "stu-latest-total" }, groupDigits(total) + " " + t("latest.tok"))
        ]),
        react.createElement("dl", { key: "rows", className: "stu-detail" }, fieldRows(rows))
      ]));
    }

    /** Click-to-open panel: reuses the hover card so both stay in sync. */
    function SessionPopover(props) {
      const state = props.usePopover((value) => value);
      if (state === null) return null;
      const t = props.t;
      const x = typeof state.x === "number" ? Math.min(Math.max(12, state.x - 40), 100000) : 240;
      const y = typeof state.y === "number" ? Math.min(Math.max(12, state.y + 14), 100000) : 240;
      return react.createElement("div", {
        className: "stu-pop-backdrop",
        "data-sidebar-token-usage": "popover",
        onClick: props.closePopover
      }, react.createElement("div", {
        className: "stu-pop-card",
        style: { left: x + "px", top: y + "px" },
        onClick: (event) => event.stopPropagation()
      }, [
        react.createElement("div", { key: "bar", className: "stu-pop-bar" }, [
          react.createElement("span", { key: "title", className: "stu-pop-title" }, t("popover.title")),
          react.createElement("button", {
            key: "close",
            type: "button",
            className: "stu-pop-close",
            "aria-label": t("popover.close"),
            onClick: props.closePopover
          }, "\u00d7")
        ]),
        react.createElement(RowHover, {
          key: "body",
          sessionId: state.sessionId,
          t,
          useSessionList: props.useSessionList,
          useFieldSettings: props.useFieldSettings,
          usePriceSettings: props.usePriceSettings,
          alwaysShow: true
        })
      ]));
    }

    const inject = ["slots", "locale", "sessions"];

    function apply(ctx) {
      // A hook source is the observable itself: { getSnapshot, subscribe }.
      // Passing a function instead makes the renderer treat it as a deferred
      // factory, which calls React hooks outside a component and kills the slot.
      const sessionList = ctx.sessions.list;
      const fieldStore = createFieldStore();
      const priceStore = createPriceStore();
      const popoverStore = createPopoverStore();
      const latestStore = createLatestStore();
      // The footer's range tabs write the same setting the segmented control does.
      const face = () => ({
        hooks: { sessionList, fieldSettings: fieldStore, priceSettings: priceStore },
        setChoice: (id, value) => fieldStore.setChoice(id, value),
        openPopover: (next) => popoverStore.open(next),
        openLatest: (next) => latestStore.open(next)
      });

      ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-sidebar-token-usage: dictionaries");
      ctx.effect(() => {
        const tag = mountStyle();
        return () => {
          if (tag !== undefined && tag.parentNode !== null) tag.parentNode.removeChild(tag);
        };
      }, "dsh-sidebar-token-usage: styles");

      ctx.slots.inject("sidebar.session.row.leading", () => ctx.slots.register({
        name: "sidebar.session.row.leading",
        id: "sidebar-token-usage",
        order: 50,
        locale: NS,
        inject: face
      }, RowBadge));

      ctx.slots.inject("sidebar.session.row.hover", () => ctx.slots.register({
        name: "sidebar.session.row.hover",
        id: "sidebar-token-usage",
        order: 50,
        locale: NS,
        inject: face
      }, RowHover));

      ctx.slots.inject("shell.overlay", () => ctx.slots.register({
        name: "shell.overlay",
        id: "sidebar-token-usage-popover",
        order: 40,
        locale: NS,
        inject: () => ({
          hooks: {
            sessionList, fieldSettings: fieldStore, priceSettings: priceStore, popover: popoverStore
          },
          closePopover: () => popoverStore.close()
        })
      }, SessionPopover));

      ctx.slots.inject("shell.overlay", () => ctx.slots.register({
        name: "shell.overlay",
        id: "sidebar-token-usage-latest",
        order: 50,
        locale: NS,
        inject: () => ({
          hooks: { latestCard: latestStore },
          closeLatest: () => latestStore.close()
        })
      }, LatestPopover));

      ctx.slots.inject("settings.section", () => ctx.slots.register({
        name: "settings.section",
        id: "sidebar-token-usage",
        order: 60,
        label: () => ctx.locale.bind(NS)("settings.title"),
        locale: NS,
        inject: () => ({
          hooks: { fieldSettings: fieldStore, priceSettings: priceStore },
          setField: (id, on) => fieldStore.setField(id, on),
          setChoice: (id, value) => fieldStore.setChoice(id, value),
          setPrice: (rowKey, columnKey, tier, value) => priceStore.setPrice(rowKey, columnKey, tier, value),
          setProviders: (text) => priceStore.setProviders(text)
        })
      }, SettingsSection));

      ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
        name: "sidebar.footer.action",
        id: "sidebar-token-usage",
        order: 50,
        locale: NS,
        inject: face
      }, FooterCard));
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});
