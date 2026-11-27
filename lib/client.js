window.__ModuleLoader__.load({id:`dsh-liangheng`,factory:require=>{var module={exports:{}};var exports=module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let react = require("react");
let react_jsx_runtime = require("react/jsx-runtime");
let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
let react_dom = require("react-dom");
//#region src/client/LiangShenLever.module.css
var LiangShenLever_module_default = {
	"arm": "z1xI9W_arm",
	"banner": "z1xI9W_banner",
	"banner-shake": "z1xI9W_banner-shake",
	"banner-slam": "z1xI9W_banner-slam",
	"bannerName": "z1xI9W_bannerName",
	"burst": "z1xI9W_burst",
	"burst-flash": "z1xI9W_burst-flash",
	"burst-ring": "z1xI9W_burst-ring",
	"code": "z1xI9W_code",
	"code-blink": "z1xI9W_code-blink",
	"control": "z1xI9W_control",
	"error": "z1xI9W_error",
	"flash": "z1xI9W_flash",
	"knob": "z1xI9W_knob",
	"lever": "z1xI9W_lever",
	"lever-jitter": "z1xI9W_lever-jitter",
	"line": "z1xI9W_line",
	"readout": "z1xI9W_readout",
	"ring": "z1xI9W_ring",
	"rod": "z1xI9W_rod",
	"spark": "z1xI9W_spark",
	"spark-fly": "z1xI9W_spark-fly",
	"sparks": "z1xI9W_sparks",
	"track": "z1xI9W_track"
};
//#endregion
//#region src/client/LiangShenLever.tsx
/**
* The homepage lever: a slot-machine arm beside the model selector.
*
* Pull it down and the session about to start becomes LiangShen mode; push it
* up and the preset the user was on comes back. The arm tracks the real preset
* (never a local guess), and the theatrical part — flash, shockwave, sparks,
* and the three-language jackpot banner — plays only once the switch actually
* landed, so a refused switch never celebrates.
*
* The component is pure: every fact and verb arrives through the injected face.
* A pointer drag past {@link DRAG_THRESHOLD_PX} counts as a pull or a push; a
* plain click or a keyboard activation toggles instead.
*/
/** Vertical travel that separates a pull or push from a plain click. */
const DRAG_THRESHOLD_PX = 14;
/** How long the burst overlay stays mounted, matching its CSS duration. */
const BURST_MS = 2200;
/** Jackpot lines that read the same in every language. */
const PIPELINE = "INTENT · INVARIANTS · VERIFIED DIFF";
const STANDARD = "FIRST-PRINCIPLES · HONEST · FAST";
/** One spark per spoke of the burst. */
const SPARKS = Array.from({ length: 14 }, (_, index) => index);
/** Slot entry for `conversation.input.right` (left of the model selector). */
function LiangShenLever(face) {
	const { state, restoreLabel, busy, error, burst } = (0, react.useSyncExternalStore)(face.store.subscribe, face.store.getSnapshot);
	const [burstKey, setBurstKey] = (0, react.useState)(0);
	const seen = (0, react.useRef)(burst);
	const drag = (0, react.useRef)(void 0);
	const actionable = !busy && (state === "on" || state === "off");
	const on = state === "on";
	const errorText = error === void 0 ? void 0 : error.kind === "locked" ? face.t("lever.failed.locked") : error.kind === "missing" ? face.t("lever.failed.missing") : error.kind === "timeout" ? face.t("lever.failed.timeout") : face.t("lever.failed.failed", { reason: error.reason });
	(0, react.useEffect)(() => {
		if (burst > seen.current) setBurstKey(burst);
		seen.current = burst;
	}, [burst]);
	(0, react.useEffect)(() => {
		if (burstKey === 0) return;
		const timer = setTimeout(() => {
			setBurstKey(0);
		}, BURST_MS);
		return () => {
			clearTimeout(timer);
		};
	}, [burstKey]);
	if (state === "locked" || state === "missing" || state === "on" && restoreLabel === "") return null;
	const toggle = () => {
		if (!actionable) return;
		if (on) face.push();
		else face.pull();
	};
	const onPointerDown = (event) => {
		if (!actionable) return;
		drag.current = {
			x: event.clientX,
			y: event.clientY,
			fired: false
		};
		try {
			event.currentTarget.setPointerCapture?.(event.pointerId);
		} catch {}
	};
	const onPointerMove = (event) => {
		const pending = drag.current;
		if (pending === void 0 || pending.fired) return;
		const travelY = event.clientY - pending.y;
		const travelX = event.clientX - pending.x;
		if (Math.hypot(travelX, travelY) >= DRAG_THRESHOLD_PX) {
			pending.fired = true;
			if (on) face.push();
			else face.pull();
		}
	};
	const onPointerUp = () => {
		const pending = drag.current;
		drag.current = void 0;
		if (pending === void 0 || pending.fired) return;
		toggle();
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
		className: LiangShenLever_module_default.lever,
		"data-dsh-plugin": "liangheng",
		"data-dsh-part": "lever",
		"data-state": state,
		"data-busy": busy ? "true" : void 0,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "switch",
				"aria-checked": on,
				"aria-label": face.t("lever.a11y"),
				"aria-busy": busy,
				title: hint(face, state, restoreLabel),
				className: LiangShenLever_module_default.control,
				disabled: !actionable,
				onPointerDown,
				onPointerMove,
				onPointerUp,
				onPointerCancel: onPointerUp,
				onClick: (event) => {
					if (event.detail === 0) toggle();
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: LiangShenLever_module_default.track,
					"data-dsh-part": "lever-track",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
						className: LiangShenLever_module_default.arm,
						"data-dsh-part": "lever-arm",
						viewBox: "0 0 16 26",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
							className: LiangShenLever_module_default.rod,
							x: "6.5",
							y: "3.5",
							width: "3",
							height: "21",
							rx: "1.5"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							className: LiangShenLever_module_default.knob,
							cx: "8",
							cy: "4",
							r: "3.4"
						})]
					})
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: LiangShenLever_module_default.readout,
					children: on ? face.t("lever.readout.on") : face.t("lever.readout.off")
				})]
			}),
			errorText !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: LiangShenLever_module_default.error,
				role: "status",
				title: errorText,
				children: errorText
			}),
			burstKey !== 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Burst, { face }, burstKey)
		]
	});
}
/** The hover hint: what this gesture would do right now. */
function hint(face, state, restoreLabel) {
	if (state === "locked") return face.t("lever.hint.locked");
	if (state === "missing") return face.t("lever.hint.missing");
	if (state === "on") return face.t("lever.hint.push", { preset: restoreLabel === "" ? face.t("lever.state.off") : restoreLabel });
	return face.t("lever.hint.pull");
}
/** The jackpot overlay: flash, shockwave rings, sparks, and the banner. */
function Burst({ face }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
		className: LiangShenLever_module_default.burst,
		"data-dsh-part": "lever-burst",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: LiangShenLever_module_default.flash }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: LiangShenLever_module_default.ring }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: LiangShenLever_module_default.ring }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: LiangShenLever_module_default.ring }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: LiangShenLever_module_default.banner,
				"data-dsh-part": "lever-banner",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: LiangShenLever_module_default.bannerName,
						children: face.t("lever.name")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: LiangShenLever_module_default.line,
						children: face.t("burst.line1")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: LiangShenLever_module_default.line,
						children: face.t("burst.line2")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: LiangShenLever_module_default.code,
						children: PIPELINE
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: LiangShenLever_module_default.code,
						children: STANDARD
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: LiangShenLever_module_default.sparks,
				children: SPARKS.map((spoke) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
					className: LiangShenLever_module_default.spark,
					style: { rotate: `${spoke * (360 / SPARKS.length)}deg` }
				}, spoke))
			})
		]
	});
}
//#endregion
//#region src/client/main-session.ts
/**
* Resolve the Session the main view currently shows.
*
* Reads the catalog's rows rather than a per-id retain-info source: ownership
* counts ride the list snapshot, so this neither allocates observers nor opens
* history, and a subscription to the list still fires when the selection moves.
* @param byId - the session catalog's rows (`SessionListState.byId`), when available.
* @returns the main-view session id, or undefined when the main view shows none.
*/
function mainViewSessionId(byId) {
	if (byId === void 0 || byId === null) return void 0;
	for (const row of Object.values(byId)) if (row !== void 0 && (row.retainedBy?.mainView ?? 0) > 0) return row.id;
}
//#endregion
//#region src/core/lever.ts
/**
* LiangShen lever logic — framework-free, no DOM, compiled by both programs.
*
* The lever is a homepage control beside the model selector: pulling it down
* turns the current session's preset into LiangShen mode, pushing it up
* restores the preset the user was on before. The facts it needs are the
* current session's preset, whether that session may still change preset at
* all, and the preset roster; the decisions are pure so they can be tested
* without the browser runtime.
*
* A preset is fixed once a session starts (the host refuses the switch with
* `agent-preset/locked`), so the lever is only meaningful while the session is
* blank — which is exactly the new-session screen it renders on.
*/
/** The preset id this lever turns on; also the preset directory name. */
const LIANGHENG_PRESET_ID = "liangheng";
/** Backward-compatible alias for the preset id. */
const LIANGSHEN_PRESET_ID = LIANGHENG_PRESET_ID;
/** Resolve what the lever shows for one set of facts. */
function leverState(facts) {
	if (!facts.available.includes("liangheng")) return "missing";
	if (!facts.blank) return "locked";
	return facts.agentPreset === "liangheng" ? "on" : "off";
}
/**
* The preset a push-up restores: the preset the user was on before pulling the
* lever, else the deployment default, else the first usable roster row that is
* not the LiangHeng preset. A candidate is skipped when it is the LiangHeng
* preset itself (restoring it would be a no-op) or when the roster no longer
* supplies it. That last resort is what keeps the push direction alive when the
* deployment default IS LiangHeng mode: `fallback` is skipped then, and after a
* reload `previous` is gone, so without it the gesture would have no target.
*/
function restoreTarget(facts) {
	for (const candidate of [facts.previous, facts.fallback]) {
		if (candidate === void 0 || candidate === "liangheng") continue;
		if (facts.available.includes(candidate)) return candidate;
	}
	return facts.available.find((candidate) => candidate !== LIANGHENG_PRESET_ID);
}
/** Whether the lever can act at all in its current state. */
function isActionable(state) {
	return state === "on" || state === "off";
}
/**
* Settings entry ids whose writes can move the roster this lever reads: the
* agent-preset registry's own entry (its default and selection policy) and this
* plugin's row under either install shape — the aggregate's generated row id
* and the standalone row id — because disabling the plugin unregisters the
* preset it declares.
*/
const ROSTER_SETTINGS_ENTRY_IDS = [
	"agent-preset-registry",
	"web-ui-liangheng",
	"ui-liangheng",
	"liangheng"
];
/** Read the preset a session summary reports, when it reports one. */
function presetOf(session) {
	const value = session?.projectionValues?.["agentPreset"];
	return typeof value === "string" ? value : void 0;
}
/** The lever controller: roster read, session facts, and the preset switch. */
var LeverController = class {
	ctx;
	store;
	/**
	* The browser services this controller reads, resolved defensively: the
	* context proxy throws on any service the fiber did not inject, so a
	* deployment that cannot answer one of them must leave the lever inert
	* rather than take the plugin (and the composer row) down with it.
	*/
	sessions;
	remote;
	/** Roster rows as last read; empty until the first read lands. */
	rows = [];
	/** The preset the user was on before the last pull-down. */
	previous;
	loading = false;
	/** Ceiling on one in-flight switch, so a lost Remote answer cannot hang the row. */
	selectTimeoutMs;
	disposers = [];
	/** The one face this controller hands out: the view reads it on every render. */
	cachedFace;
	/**
	* The translator bound to this plugin's locale namespace, resolved on first
	* use. A lookup that resolved nothing is never cached, so a locale service
	* registered after activation still reaches the same face.
	*/
	cachedTranslate;
	constructor(ctx, options = {}) {
		this.ctx = ctx;
		this.selectTimeoutMs = options.selectTimeoutMs ?? 1e4;
		this.sessions = readService(() => ctx.sessions);
		this.remote = readService(() => ctx.remote.agentPresets);
		this.store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)({
			state: "off",
			restoreLabel: "",
			busy: false,
			burst: 0
		});
	}
	/** The snapshot store the view subscribes to. */
	snapshot() {
		return this.store;
	}
	/** Follow the roster and the current session, then read the roster once. */
	start() {
		const list = this.sessions?.list;
		if (list !== void 0) this.disposers.push(list.subscribe(() => {
			this.refresh();
		}));
		const remote = readService(() => this.ctx.remote);
		if (typeof remote?.$on === "function") this.disposers.push(remote.$on("settings/document-updated", (ns) => {
			if (ROSTER_SETTINGS_ENTRY_IDS.includes(ns)) this.load();
		}));
		this.refresh();
		if (this.remote !== void 0) this.load();
	}
	/** Release every subscription. Idempotent. */
	dispose() {
		for (const dispose of this.disposers.splice(0)) dispose();
	}
	/** The inject face handed to the slot entry; the same instance on every read. */
	face() {
		const cached = this.cachedFace;
		if (cached !== void 0) return cached;
		const face = {
			store: this.store,
			pull: () => {
				this.toggle("down");
			},
			push: () => {
				this.toggle("up");
			},
			t: (key, vars) => {
				const translate = this.translate();
				return translate === void 0 ? key : translate(key, vars);
			}
		};
		this.cachedFace = face;
		return face;
	}
	/**
	* The translator bound to this plugin's locale namespace, or undefined while
	* none answers. The binding is resolved once and only on success: a locale
	* service that arrives later than this controller still gets its chance.
	*/
	translate() {
		const cached = this.cachedTranslate;
		if (cached !== void 0) return cached;
		const bound = readService(() => this.ctx.locale.bind("liangheng"));
		if (typeof bound !== "function") return void 0;
		this.cachedTranslate = bound;
		return bound;
	}
	/** Read the roster; a refusal leaves the lever as it was. */
	async load() {
		if (this.loading) return;
		const remote = this.remote;
		if (remote === void 0) return;
		this.loading = true;
		try {
			const result = await remote.list();
			if (result.ok) this.rows = result.value.presets;
		} catch {} finally {
			this.loading = false;
			this.refresh();
		}
	}
	/**
	* Recompute the snapshot from the current session and the last roster read.
	* Only the derived fields are written: an in-flight switch, the last refusal,
	* and the burst counter belong to the gesture, not to a session refresh.
	*/
	refresh() {
		const facts = this.facts();
		const snapshot = this.store.getSnapshot();
		const state = leverState(facts);
		const restoreLabel = facts.blank ? this.restoreLabelOf(facts) : "";
		if (snapshot.state === state && snapshot.restoreLabel === restoreLabel) return;
		this.store.set({
			...snapshot,
			state,
			restoreLabel
		});
	}
	/** Display name of the preset a push-up would restore; empty when there is none. */
	restoreLabelOf(facts) {
		const target = restoreTarget(facts);
		return target === void 0 ? "" : this.labelOf(target);
	}
	/** The verb behind one gesture direction. */
	async toggle(direction) {
		const snapshot = this.store.getSnapshot();
		if (snapshot.busy) return;
		const remote = this.remote;
		if (remote === void 0) return;
		const facts = this.facts();
		if (!isActionable(leverState(facts))) return;
		const target = direction === "down" ? LIANGHENG_PRESET_ID : restoreTarget(facts);
		const sessionId = this.currentSessionId();
		if (target === void 0 || sessionId === void 0) return;
		if (facts.agentPreset === target) {
			this.refresh();
			return;
		}
		this.store.set({
			...snapshot,
			busy: true,
			error: void 0
		});
		let result;
		try {
			result = await withTimeout(remote.select(sessionId, target), this.selectTimeoutMs);
		} catch (error) {
			const mapped = error instanceof SwitchTimeout ? { kind: "timeout" } : {
				kind: "failed",
				reason: message(error)
			};
			this.store.set({
				...this.store.getSnapshot(),
				busy: false,
				error: mapped
			});
			this.refresh();
			return;
		}
		if (!result.ok) {
			this.store.set({
				...this.store.getSnapshot(),
				busy: false,
				error: refusal(result.error)
			});
			this.refresh();
			return;
		}
		if (direction === "down") {
			const prev = facts.agentPreset ?? this.detectPreset();
			if (prev !== void 0 && prev !== "liangheng") this.rememberPrevious(prev);
		}
		const next = this.store.getSnapshot();
		this.store.set({
			...next,
			busy: false,
			error: void 0,
			burst: direction === "down" ? next.burst + 1 : next.burst
		});
		this.refresh();
	}
	/**
	* Try to detect the active preset from the DOM hero chip or storage
	* when session.projectionValues.agentPreset is absent.
	*/
	detectPreset() {
		try {
			if (typeof document !== "undefined") {
				const text = (document.querySelector("button[aria-haspopup=\"menu\"] span[class*=\"seatLabel\"]") ?? Array.from(document.querySelectorAll("button[aria-haspopup=\"menu\"] span")).find((s) => s.className.includes("seatLabel")))?.textContent?.trim();
				if (text) {
					const matched = this.rows.find((row) => (row.name === text || row.id === text) && row.id !== "liangheng");
					if (matched) return matched.id;
				}
			}
		} catch {}
		try {
			if (typeof sessionStorage !== "undefined") {
				const stored = sessionStorage.getItem("dsh-liangheng:previous-preset");
				if (stored && stored !== "liangheng" && this.rows.some((r) => r.id === stored)) return stored;
			}
		} catch {}
	}
	rememberPrevious(presetId) {
		if (presetId === void 0 || presetId === "liangheng") return;
		this.previous = presetId;
		try {
			if (typeof sessionStorage !== "undefined") sessionStorage.setItem("dsh-liangheng:previous-preset", presetId);
		} catch {}
	}
	/**
	* The facts one decision reads, from the live session and the roster.
	*
	* `previous` is resolved only for a blank session: it exists to name the
	* preset a push-up restores, and only a blank session may switch preset at
	* all. Resolving it costs a DOM chip lookup and a session-storage read
	* ({@link detectPreset}), which a started session -- reported as 'locked' or
	* 'missing' -- would pay for on every roster and session update and never use.
	*/
	facts() {
		const summary = this.currentSession();
		const available = this.rows.filter((row) => row.broken === void 0).map((row) => row.id);
		const fallback = this.rows.find((row) => row.isDefault)?.id;
		const currentPreset = presetOf(summary);
		const blank = summary?.blank === true;
		if (!blank) return {
			blank,
			agentPreset: currentPreset,
			available,
			fallback
		};
		if (currentPreset !== void 0 && currentPreset !== "liangheng") this.rememberPrevious(currentPreset);
		return {
			blank,
			agentPreset: currentPreset,
			available,
			fallback,
			previous: this.previous ?? this.detectPreset()
		};
	}
	currentSessionId() {
		return mainViewSessionId(this.sessions?.list.getSnapshot().byId);
	}
	currentSession() {
		const state = this.sessions?.list.getSnapshot();
		const current = mainViewSessionId(state?.byId);
		if (state === void 0 || current === void 0) return void 0;
		return state.byId[current];
	}
	/** Display name of one preset id, falling back to the id itself. */
	labelOf(id) {
		return this.rows.find((candidate) => candidate.id === id)?.name ?? id;
	}
};
/** Raised when one switch outlives {@link SELECT_TIMEOUT_MS}. */
var SwitchTimeout = class extends Error {
	constructor() {
		super("the preset switch did not answer in time");
		this.name = "SwitchTimeout";
	}
};
/** Resolve with `work`, or reject with a {@link SwitchTimeout} after `ms`. */
function withTimeout(work, ms) {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new SwitchTimeout());
		}, ms);
		work.then((value) => {
			clearTimeout(timer);
			resolve(value);
		}, (error) => {
			clearTimeout(timer);
			reject(error instanceof Error ? error : new Error(String(error)));
		});
	});
}
/**
* Read one context service, treating the proxy's "without inject" refusal (and
* any other resolution fault) as the service being absent.
*/
function readService(read) {
	try {
		return read();
	} catch {
		return;
	}
}
/** The host's own reason for a refusal, mapped to lever copy. */
function refusal(error) {
	if (error.code === "agent-preset/locked") return { kind: "locked" };
	if (error.code === "agent-preset/not-found") return { kind: "missing" };
	const details = error.details;
	if (typeof details === "object" && details !== null && typeof details.reason === "string") return {
		kind: "failed",
		reason: details.reason
	};
	return {
		kind: "failed",
		reason: error.message ?? error.code ?? "unknown"
	};
}
function message(error) {
	return error instanceof Error ? error.message : String(error);
}
//#endregion
//#region src/client/LiangShenMark.tsx
/**
* Render the LiangShen card mark.
* @returns the 18x18 lever mark, in the current text color.
*/
function LiangShenMark() {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 18 18",
		fill: "none",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
			x: "3.6",
			y: "13.2",
			width: "8.8",
			height: "2.8",
			rx: "1.4",
			fill: "currentColor"
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
			transform: "rotate(20 8 14.4)",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
				x: "6.5",
				y: "4.6",
				width: "3",
				height: "9.8",
				rx: "1.5",
				fill: "currentColor"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "4.4",
				r: "2.9",
				fill: "currentColor"
			})]
		})]
	});
}
//#endregion
//#region src/client/settings-card.module.css
var settings_card_module_default = {
	"badge": "_3KtWIa_badge",
	"badges": "_3KtWIa_badges",
	"body": "_3KtWIa_body",
	"card": "_3KtWIa_card",
	"cardNested": "_3KtWIa_cardNested",
	"cardOpen": "_3KtWIa_cardOpen",
	"chevron": "_3KtWIa_chevron",
	"chevronOpen": "_3KtWIa_chevronOpen",
	"control": "_3KtWIa_control",
	"description": "_3KtWIa_description",
	"disclosure": "_3KtWIa_disclosure",
	"failed": "_3KtWIa_failed",
	"field": "_3KtWIa_field",
	"head": "_3KtWIa_head",
	"header": "_3KtWIa_header",
	"headerAction": "_3KtWIa_headerAction",
	"headerStatic": "_3KtWIa_headerStatic",
	"headText": "_3KtWIa_headText",
	"hint": "_3KtWIa_hint",
	"input": "_3KtWIa_input",
	"inputInvalid": "_3KtWIa_inputInvalid",
	"invalid": "_3KtWIa_invalid",
	"label": "_3KtWIa_label",
	"mark": "_3KtWIa_mark",
	"name": "_3KtWIa_name",
	"notExposed": "_3KtWIa_notExposed",
	"rangeAnchor": "_3KtWIa_rangeAnchor",
	"rangeBubble": "_3KtWIa_rangeBubble",
	"rangeEnds": "_3KtWIa_rangeEnds",
	"rangeSlider": "_3KtWIa_rangeSlider",
	"readOnly": "_3KtWIa_readOnly",
	"reset": "_3KtWIa_reset",
	"segment": "_3KtWIa_segment",
	"segmentGroup": "_3KtWIa_segmentGroup",
	"select": "_3KtWIa_select",
	"selectButton": "_3KtWIa_selectButton",
	"selectChevron": "_3KtWIa_selectChevron",
	"selectChevronOpen": "_3KtWIa_selectChevronOpen",
	"selectLabel": "_3KtWIa_selectLabel",
	"selectOption": "_3KtWIa_selectOption",
	"selectOptionActive": "_3KtWIa_selectOptionActive",
	"selectOptionSelected": "_3KtWIa_selectOptionSelected",
	"selectPopup": "_3KtWIa_selectPopup",
	"selectPopupClose": "_3KtWIa_selectPopupClose",
	"selectPopupOpen": "_3KtWIa_selectPopupOpen",
	"selectWrap": "_3KtWIa_selectWrap",
	"settings-card": "_3KtWIa_settings-card",
	"toggle": "_3KtWIa_toggle",
	"toggle-off": "_3KtWIa_toggle-off",
	"toggle-on": "_3KtWIa_toggle-on",
	"toggleThumb": "_3KtWIa_toggleThumb",
	"toggleTrack": "_3KtWIa_toggleTrack"
};
//#endregion
//#region src/client/RangeBubble.tsx
/**
* Coarse adjustment for a bounded number: resting the pointer on the control
* (or moving focus into it) raises a small bubble holding a slider across the
* field's whole range, so a large change is one drag instead of many presses
* or a retyped value. The control itself stays the precise entry.
*
* The bubble belongs to the anchor's subtree, so moving from the control onto
* the bubble never counts as leaving. It opens after a short rest and closes a
* moment after the pointer and focus have both gone, so crossing the control
* on the way elsewhere does not flash it. While a drag is in progress the
* bubble stays put even if the pointer strays off it.
*
* Dragging reports each value through `onInput`, so the field shows it live;
* releasing the thumb, or a key press on it, reports `onCommit` once. The
* bubble opens on the side of the control that has room inside the nearest
* scrolling ancestor, so a row near the top of a settings page does not hang
* its bubble under the page edge.
*/
/** Rest on the control before the bubble opens. */
const OPEN_DELAY_MS = 220;
/** Grace after pointer and focus have left before the bubble closes. */
const CLOSE_DELAY_MS = 200;
/** Room the bubble needs between the control and the scroller's edge. */
const BUBBLE_ROOM_PX = 64;
/** The nearest ancestor that scrolls vertically, or the viewport's root. */
function scroller(node) {
	for (let parent = node.parentElement; parent !== null; parent = parent.parentElement) {
		const overflow = getComputedStyle(parent).overflowY;
		if (overflow === "auto" || overflow === "scroll") return parent;
	}
	return node.ownerDocument.documentElement;
}
/**
* Render the control with its coarse-adjustment bubble.
* @param props - the range, the value and the two report callbacks.
* @returns the anchor holding the control and the bubble.
*/
function RangeBubble(props) {
	const { min, max, step, disabled = false } = props;
	const [open, setOpen] = (0, react.useState)(false);
	const [side, setSide] = (0, react.useState)("above");
	const [live, setLive] = (0, react.useState)(null);
	const anchorRef = (0, react.useRef)(null);
	const timer = (0, react.useRef)(void 0);
	const hovered = (0, react.useRef)(false);
	const focused = (0, react.useRef)(false);
	const dragging = (0, react.useRef)(false);
	(0, react.useEffect)(() => () => {
		clearTimeout(timer.current);
	}, []);
	(0, react.useEffect)(() => {
		if (disabled) {
			clearTimeout(timer.current);
			setOpen(false);
		}
	}, [disabled]);
	const show = () => {
		const anchor = anchorRef.current;
		if (anchor !== null) {
			const room = anchor.getBoundingClientRect().top - scroller(anchor).getBoundingClientRect().top;
			setSide(room >= BUBBLE_ROOM_PX ? "above" : "below");
		}
		setOpen(true);
	};
	const schedule = () => {
		clearTimeout(timer.current);
		if (disabled) return;
		if (hovered.current || focused.current || dragging.current) {
			if (!open) timer.current = setTimeout(show, focused.current ? 0 : OPEN_DELAY_MS);
			return;
		}
		timer.current = setTimeout(() => {
			setOpen(false);
		}, CLOSE_DELAY_MS);
	};
	const commit = (value) => {
		dragging.current = false;
		setLive(null);
		props.onCommit(value);
		schedule();
	};
	const onChange = (event) => {
		const value = Number(event.target.value);
		setLive(value);
		props.onInput(value);
	};
	const onKeyUp = (event) => {
		if (live !== null) commit(live);
		if (event.key === "Escape") {
			clearTimeout(timer.current);
			setOpen(false);
		}
	};
	const shown = live ?? Math.min(max, Math.max(min, props.value));
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		ref: anchorRef,
		className: settings_card_module_default.rangeAnchor,
		onPointerEnter: () => {
			hovered.current = true;
			schedule();
		},
		onPointerLeave: () => {
			hovered.current = false;
			schedule();
		},
		onFocus: () => {
			focused.current = true;
			schedule();
		},
		onBlur: (event) => {
			if (event.currentTarget.contains(event.relatedTarget)) return;
			focused.current = false;
			if (live !== null) commit(live);
			else schedule();
		},
		children: [props.children, /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: settings_card_module_default.rangeBubble,
			"data-open": open ? "" : void 0,
			"data-side": side,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				type: "range",
				className: settings_card_module_default.rangeSlider,
				min,
				max,
				step,
				value: shown,
				"aria-label": props.label,
				tabIndex: open ? 0 : -1,
				disabled,
				style: { "--range-fill": `${(shown - min) / (max - min) * 100}%` },
				onPointerDown: () => {
					dragging.current = true;
				},
				onPointerUp: (event) => {
					commit(Number(event.currentTarget.value));
				},
				onPointerCancel: (event) => {
					commit(Number(event.currentTarget.value));
				},
				onChange,
				onKeyUp
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: settings_card_module_default.rangeEnds,
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: min }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: max })]
			})]
		})]
	});
}
//#endregion
//#region src/client/SegmentGroup.tsx
/**
* The family's segmented control: a quiet track whose options share one
* highlight that slides to the pressed option, instead of each option fading
* its own background out and the next one in. The settings fields' small
* choices and the Web Extensions TAB strip both render through it, so the two
* read as one control.
*
* The caller builds the option buttons and marks the pressed one with
* `data-active`; the group measures that button after every render and writes
* its box as four custom properties, and the stylesheet draws the highlight
* there (`.segmentGroup[data-pill]::before`). Attribute and first placement
* land in the same task, so the highlight appears in place and only later
* changes slide. A ResizeObserver re-measures when the group or an option
* changes size: a longer locale, a font arriving, a container growing, a
* strip wrapping onto a second line.
*/
/** The attribute marking a group whose highlight has been placed. */
const PILL_ATTR = "data-pill";
/** The pressed option, relative to the group. */
const ACTIVE_SELECTOR = ":scope > [data-active]";
const PILL_PROPERTIES = [
	"--segment-pill-x",
	"--segment-pill-y",
	"--segment-pill-w",
	"--segment-pill-h"
];
/**
* Write the highlight's box from the pressed option's box, or take the
* highlight off when nothing is pressed or the group has no layout yet.
* The two boxes are read in viewport pixels and turned back into the group's
* own CSS pixels, so a dialog that opens through a scale transform still
* lands the highlight on its option.
*/
function placePill(group) {
	const item = group.querySelector(ACTIVE_SELECTOR);
	const box = group.getBoundingClientRect();
	if (item === null || group.offsetWidth === 0 || box.width === 0) {
		group.removeAttribute(PILL_ATTR);
		for (const property of PILL_PROPERTIES) group.style.removeProperty(property);
		return;
	}
	const scale = box.width / group.offsetWidth;
	const itemBox = item.getBoundingClientRect();
	[
		(itemBox.left - box.left) / scale - group.clientLeft,
		(itemBox.top - box.top) / scale - group.clientTop,
		itemBox.width / scale,
		itemBox.height / scale
	].forEach((value, index) => {
		group.style.setProperty(PILL_PROPERTIES[index], `${Math.round(value * 100) / 100}px`);
	});
	if (!group.hasAttribute(PILL_ATTR)) group.setAttribute(PILL_ATTR, "");
}
/**
* Render a segmented track around the caller's option buttons.
* @param props - the track's attributes (role, accessible name, key handler) and its options.
* @returns the track.
*/
function SegmentGroup(props) {
	const { children, className, ...rest } = props;
	const group = (0, react.useRef)(null);
	const count = react.Children.count(children);
	(0, react.useLayoutEffect)(() => {
		if (group.current !== null) placePill(group.current);
	});
	(0, react.useLayoutEffect)(() => {
		const element = group.current;
		if (element === null || typeof ResizeObserver === "undefined") return void 0;
		const observer = new ResizeObserver(() => {
			placePill(element);
		});
		observer.observe(element);
		for (const item of Array.from(element.children)) observer.observe(item);
		return () => {
			observer.disconnect();
		};
	}, [count]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		...rest,
		ref: group,
		className: className === void 0 ? settings_card_module_default.segmentGroup : `${settings_card_module_default.segmentGroup} ${className}`,
		children
	});
}
//#endregion
//#region src/client/PluginSettingsCard.tsx
/**
* Family-shared chrome for plugin settings cards: a disclosure header naming
* the plugin and what its settings govern, the controls inside, and the line
* that reports a refused write. A pick is written the moment it is made and a
* typed value after a pause, so the card has no save button and nothing waits
* on the reader. Renders nothing while the namespace is unavailable — a
* deployment that does not compose the owning plugin should show no trace of
* it. Inlined into each consumer's client bundle; mirrors the official
* ui-plugin-config PluginCard in a self-contained slice.
*
* Every field inside the body is one settings row: the label and its hint on
* the left, the control on the right, a hairline between two rows; a narrow
* card stacks the control under the text (settings-card.module.css).
*/
/**
* What a text field inside a card reaches without its plugin wiring it: write
* the pending draft now (Enter, leaving the field) or put it back (Escape).
* Picks need neither; they are written the moment they are made.
*/
const CardApply = (0, react.createContext)(null);
/** Length of the body's disclosure motion; it matches `--settings-card-motion` on the card root. */
const BODY_MOTION_MS = 180;
/**
* Render one plugin settings card.
* @param props - the plugin's copy keys, its form state, and its controls.
* @returns the card, or nothing while the namespace is still loading.
*/
function PluginSettingsCard(props) {
	const [open, setOpen] = (0, react.useState)(props.defaultOpen ?? true);
	const { state, alwaysOpen } = props;
	const expanded = alwaysOpen === true || open;
	const [bodyPhase, setBodyPhase] = (0, react.useState)(expanded ? "shown" : "hidden");
	const bodyRef = (0, react.useRef)(null);
	(0, react.useLayoutEffect)(() => {
		if (expanded) {
			if (bodyPhase === "hidden") setBodyPhase("collapsed");
			else if (bodyPhase === "collapsed") {
				const node = bodyRef.current;
				if (node !== null) node.offsetHeight;
				setBodyPhase("entering");
			} else if (bodyPhase === "closing") setBodyPhase("entering");
			return;
		}
		if (bodyPhase === "collapsed") setBodyPhase("hidden");
		else if (bodyPhase === "entering" || bodyPhase === "shown") setBodyPhase("closing");
	}, [expanded, bodyPhase]);
	(0, react.useEffect)(() => {
		if (bodyPhase !== "entering" && bodyPhase !== "closing") return;
		const timer = setTimeout(() => {
			setBodyPhase(bodyPhase === "entering" ? "shown" : "hidden");
		}, BODY_MOTION_MS);
		return () => {
			clearTimeout(timer);
		};
	}, [bodyPhase]);
	if (!state.available) return null;
	const title = props.t(props.titleKey);
	const description = props.t(props.descriptionKey);
	const descriptionTitle = props.descriptionTitleKey === void 0 ? description : props.t(props.descriptionTitleKey);
	const baseClass = expanded ? `${settings_card_module_default.cardOpen} ${settings_card_module_default.card}` : settings_card_module_default.card;
	const cardClass = props.density === "nested" ? `${baseClass} ${settings_card_module_default.cardNested}` : baseClass;
	/** The body region both legs share; a hidden phase renders nothing at all. */
	const bodyRegion = (content) => bodyPhase === "hidden" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: settings_card_module_default.disclosure,
		"data-state": bodyPhase,
		ref: bodyRef,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: settings_card_module_default.body,
			children: content
		})
	});
	const header = alwaysOpen === true ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: settings_card_module_default.headerStatic,
		children: [
			props.icon !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: settings_card_module_default.mark,
				"aria-hidden": "true",
				children: props.icon
			}) : null,
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: settings_card_module_default.headText,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: settings_card_module_default.name,
					id: props.titleId,
					title,
					children: title
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: settings_card_module_default.description,
					title: descriptionTitle,
					children: props.descriptionNode ?? description
				})]
			}),
			props.headerAction !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: settings_card_module_default.headerAction,
				children: props.headerAction
			}) : null
		]
	}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
		type: "button",
		className: settings_card_module_default.header,
		"aria-expanded": open,
		"aria-label": `${props.t(open ? "settings.collapse" : "settings.expand")}: ${title}`,
		onClick: () => {
			setOpen(!open);
		},
		children: [
			props.icon !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: settings_card_module_default.mark,
				"aria-hidden": "true",
				children: props.icon
			}) : null,
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: settings_card_module_default.headText,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: settings_card_module_default.name,
					id: props.titleId,
					title,
					children: title
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: settings_card_module_default.description,
					title: descriptionTitle,
					children: props.descriptionNode ?? description
				})]
			}),
			props.headerAction !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: settings_card_module_default.headerAction,
				children: props.headerAction
			}) : null,
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 14 14",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				className: open ? `${settings_card_module_default.chevron} ${settings_card_module_default.chevronOpen}` : settings_card_module_default.chevron,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z",
					fill: "currentColor"
				})
			})
		]
	});
	const notExposedNotice = state.exposed || props.hideNotExposedNotice === true ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
		className: settings_card_module_default.notExposed,
		role: "status",
		children: props.t("settings.notExposed")
	});
	if (!state.exposed && props.renderChildrenWhenNotExposed !== true) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
		className: cardClass,
		children: [header, bodyRegion(notExposedNotice)]
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
		className: cardClass,
		children: [header, props.headerOnly !== true ? bodyRegion(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			notExposedNotice,
			!state.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: settings_card_module_default.readOnly,
				role: "status",
				children: props.t("settings.readOnly")
			}) : null,
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CardApply.Provider, {
				value: {
					commit: props.onSave,
					revert: props.onDiscard
				},
				children: props.children
			}),
			props.hideFooter !== true && state.failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
				className: settings_card_module_default.failed,
				role: "status",
				children: [props.t("settings.saveFailed"), state.failedReason ? " - " + state.failedReason : ""]
			}) : null
		] })) : null]
	});
}
/**
* A typed value field. Its draft is written after a pause in typing, at once on
* Enter or when focus leaves, and Escape puts the stored value back. `numeric`
* only hints the keypad: which drafts a field accepts is decided by its spec.
* A field given a `range` also offers the coarse slider bubble: dragging fills
* the draft live and releasing writes it.
*/
function ValueField(props) {
	const apply = (0, react.useContext)(CardApply);
	const settledByKey = (0, react.useRef)(false);
	const onKeyDown = (event) => {
		if (apply === null || event.key !== "Enter" && event.key !== "Escape") return;
		event.preventDefault();
		settledByKey.current = true;
		if (event.key === "Enter") apply.commit();
		else apply.revert();
		event.currentTarget.blur();
	};
	const input = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
		id: props.id,
		className: props.invalid ? settings_card_module_default.inputInvalid : settings_card_module_default.input,
		type: "text",
		...props.numeric === true ? { inputMode: "numeric" } : {},
		...props.invalid ? { "aria-invalid": true } : {},
		value: props.text,
		placeholder: props.placeholder ?? "",
		disabled: props.disabled,
		onChange: (event) => {
			props.onEdit(event.target.value);
		},
		onKeyDown,
		onFocus: () => {
			settledByKey.current = false;
		},
		onBlur: () => {
			if (settledByKey.current) {
				settledByKey.current = false;
				return;
			}
			apply?.commit();
		}
	});
	const { range } = props;
	const typed = Number(props.text);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: settings_card_module_default.field,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_default.head,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
					className: settings_card_module_default.label,
					htmlFor: props.id,
					children: props.label
				}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: settings_card_module_default.badges,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: settings_card_module_default.badge,
						children: props.overriddenLabel
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: settings_card_module_default.reset,
						disabled: props.disabled,
						onClick: props.onReset,
						children: props.resetLabel
					})]
				}) : null]
			}),
			range === void 0 ? input : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RangeBubble, {
				min: range.min,
				max: range.max,
				step: range.step,
				value: props.text.trim() === "" || Number.isNaN(typed) ? range.min : typed,
				label: `${props.label} ${range.min}–${range.max}`,
				disabled: props.disabled,
				onInput: (value) => {
					props.onEdit(String(value));
				},
				onCommit: (value) => {
					props.onEdit(String(value));
					apply?.commit();
				},
				children: input
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: props.invalid ? settings_card_module_default.invalid : settings_card_module_default.hint,
				title: props.hintTitle,
				children: props.invalid ? props.invalidLabel : props.hint
			})
		]
	});
}
const NON_SKIN_BODY_MARKERS = /* @__PURE__ */ new Set(["dshSkinCenter", "dshSidebarCollapsed"]);
function isSkinActive() {
	return Object.keys(document.body.dataset).some((key) => key.startsWith("dsh") && !NON_SKIN_BODY_MARKERS.has(key));
}
const SELECT_CLOSE_MS = 100;
/**
* The shared dual-mode select control. While an appearance skin is active it
* renders the legacy native `<select>` untouched, so element-level skin
* selectors keep working; under the default appearance it renders a
* self-drawn `role="listbox"` popup whose open/close is transition-animated.
* Cards reach it through BooleanField/ChoiceField; editors outside a card
* (the side-card prefs) bind it directly through onEdit.
* 双模式下拉框：皮肤激活时用原生 select，默认外观用自绘动画弹层。
*/
function SelectField(props) {
	const { id, options, value } = props;
	const [open, setOpen] = (0, react.useState)(false);
	const [closing, setClosing] = (0, react.useState)(false);
	const [phase, setPhase] = (0, react.useState)("initial");
	const [activeIndex, setActiveIndex] = (0, react.useState)(0);
	const closeTimer = (0, react.useRef)(void 0);
	const wrapRef = (0, react.useRef)(null);
	const popupRef = (0, react.useRef)(null);
	const currentIndex = () => {
		const index = options.findIndex((option) => option.value === value);
		return index >= 0 ? index : 0;
	};
	const close = (0, react.useCallback)(() => {
		if (closeTimer.current !== void 0) clearTimeout(closeTimer.current);
		setClosing(true);
		closeTimer.current = setTimeout(() => {
			setClosing(false);
			setOpen(false);
		}, SELECT_CLOSE_MS);
	}, []);
	const openPopup = () => {
		if (closeTimer.current !== void 0) clearTimeout(closeTimer.current);
		setActiveIndex(currentIndex());
		setPhase("initial");
		setClosing(false);
		setOpen(true);
	};
	const commit = (index) => {
		const option = options[index];
		if (option) props.onEdit(option.value);
		close();
	};
	const onTriggerClick = () => {
		if (props.disabled) return;
		if (open && !closing) close();
		else openPopup();
	};
	const onKeyDown = (event) => {
		if (props.disabled) return;
		const count = options.length;
		switch (event.key) {
			case "ArrowDown":
			case "ArrowUp":
			case "Enter":
			case " ":
				event.preventDefault();
				if (!open) openPopup();
				else if (!closing) if (event.key === "ArrowDown") setActiveIndex((index) => (index + 1) % count);
				else if (event.key === "ArrowUp") setActiveIndex((index) => (index - 1 + count) % count);
				else commit(activeIndex);
				break;
			case "Escape":
				if (open) {
					event.preventDefault();
					event.stopPropagation();
					close();
				}
				break;
			case "Tab":
				if (open) close();
				break;
		}
	};
	(0, react.useEffect)(() => () => {
		if (closeTimer.current !== void 0) clearTimeout(closeTimer.current);
	}, []);
	(0, react.useLayoutEffect)(() => {
		if (open && !closing && phase === "initial") {
			popupRef.current?.offsetHeight;
			setPhase("open");
		}
	}, [
		open,
		closing,
		phase
	]);
	(0, react.useEffect)(() => {
		if (!open) return;
		const onPointerDown = (event) => {
			const target = event.target;
			if (target instanceof Node && !wrapRef.current?.contains(target)) close();
		};
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [open, close]);
	(0, react.useEffect)(() => {
		if (props.disabled && open) close();
	}, [
		props.disabled,
		open,
		close
	]);
	if (isSkinActive()) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
		id,
		className: settings_card_module_default.select,
		value,
		disabled: props.disabled,
		onChange: (event) => {
			props.onEdit(event.target.value);
		},
		children: options.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
			value: option.value,
			children: option.label
		}, option.value))
	});
	const label = options.find((option) => option.value === value)?.label ?? "";
	const popupClass = closing ? `${settings_card_module_default.selectPopup} ${settings_card_module_default.selectPopupClose}` : phase === "open" ? `${settings_card_module_default.selectPopup} ${settings_card_module_default.selectPopupOpen}` : settings_card_module_default.selectPopup;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: settings_card_module_default.selectWrap,
		ref: wrapRef,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
			type: "button",
			id,
			className: `${settings_card_module_default.select} ${settings_card_module_default.selectButton}`,
			disabled: props.disabled,
			"aria-haspopup": "listbox",
			"aria-expanded": open,
			"aria-activedescendant": open ? `${id}-o${activeIndex}` : void 0,
			"aria-invalid": props.invalid || void 0,
			onClick: onTriggerClick,
			onKeyDown,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: settings_card_module_default.selectLabel,
				children: label
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 14 14",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				className: open ? `${settings_card_module_default.selectChevron} ${settings_card_module_default.selectChevronOpen}` : settings_card_module_default.selectChevron,
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z",
					fill: "currentColor"
				})
			})]
		}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: popupClass,
			role: "listbox",
			ref: popupRef,
			children: options.map((option, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				id: `${id}-o${index}`,
				role: "option",
				"aria-selected": option.value === value,
				className: `${settings_card_module_default.selectOption}${option.value === value ? ` ${settings_card_module_default.selectOptionSelected}` : ""}${index === activeIndex && !closing ? ` ${settings_card_module_default.selectOptionActive}` : ""}`,
				onClick: () => {
					commit(index);
				},
				children: option.label
			}, option.value))
		}) : null]
	});
}
/**
* A visible segmented group for a small set of mutually exclusive values.
* Every option stays on screen, so inherit/on/off and short enum fields take
* one click without opening a popup. The pressed option carries the group's
* sliding highlight and `aria-pressed`; the group takes the field label as its
* accessible name.
*/
function SegmentField(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SegmentGroup, {
		id: props.id,
		role: "group",
		"aria-label": props.label,
		"aria-invalid": props.invalid || void 0,
		children: props.options.map((option, index) => {
			const active = option.value === props.value;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: settings_card_module_default.segment,
				"aria-pressed": active,
				disabled: props.disabled,
				"data-active": active ? "" : void 0,
				"data-segment-index": index,
				onClick: () => {
					if (!active) props.onEdit(option.value);
				},
				children: option.label
			}, option.value);
		})
	});
}
/** A boolean field: 继承 / 开 / 关. */
function BooleanField(props) {
	const segmented = props.presentation !== "select";
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: settings_card_module_default.field,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_default.head,
				children: [segmented ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: settings_card_module_default.label,
					children: props.label
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
					className: settings_card_module_default.label,
					htmlFor: props.id,
					children: props.label
				}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: settings_card_module_default.badges,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: settings_card_module_default.badge,
						children: props.overriddenLabel
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: settings_card_module_default.reset,
						disabled: props.disabled,
						onClick: props.onReset,
						children: props.resetLabel
					})]
				}) : null]
			}),
			segmented ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SegmentField, {
				id: props.id,
				label: props.label,
				options: [
					{
						value: "",
						label: props.inheritLabel
					},
					{
						value: "true",
						label: props.onLabel
					},
					{
						value: "false",
						label: props.offLabel
					}
				],
				value: props.text,
				disabled: props.disabled,
				invalid: props.invalid,
				onEdit: props.onEdit
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectField, {
				id: props.id,
				options: [
					{
						value: "",
						label: props.inheritLabel
					},
					{
						value: "true",
						label: props.onLabel
					},
					{
						value: "false",
						label: props.offLabel
					}
				],
				value: props.text,
				disabled: props.disabled,
				invalid: props.invalid,
				onEdit: props.onEdit
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: settings_card_module_default.hint,
				title: props.hintTitle,
				children: props.hint
			})
		]
	});
}
/** An enumerated field, selecting or segmenting its small choice set. */
function ChoiceField(props) {
	const segmented = props.presentation === "segment";
	const options = [{
		value: "",
		label: props.inheritLabel
	}, ...props.choices];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: settings_card_module_default.field,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_default.head,
				children: [segmented ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: settings_card_module_default.label,
					children: props.label
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
					className: settings_card_module_default.label,
					htmlFor: props.id,
					children: props.label
				}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: settings_card_module_default.badges,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: settings_card_module_default.badge,
						children: props.overriddenLabel
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: settings_card_module_default.reset,
						disabled: props.disabled,
						onClick: props.onReset,
						children: props.resetLabel
					})]
				}) : null]
			}),
			segmented ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SegmentField, {
				id: props.id,
				label: props.label,
				options,
				value: props.text,
				disabled: props.disabled,
				invalid: props.invalid,
				onEdit: props.onEdit
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectField, {
				id: props.id,
				options,
				value: props.text,
				disabled: props.disabled,
				invalid: props.invalid,
				onEdit: props.onEdit
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: props.invalid ? settings_card_module_default.invalid : settings_card_module_default.hint,
				title: props.hintTitle,
				children: props.invalid ? props.invalidLabel : props.hint
			})
		]
	});
}
/** A whole- or decimal-number field. An empty draft clears the field; any other draft that is not a finite number within the constraints stays unwritten. */
function numberField(field, constraints = {}) {
	const { integer = false, min, max } = constraints;
	return {
		field,
		entry: "type",
		format: (value) => typeof value === "number" ? String(value) : "",
		parse: (text) => {
			const trimmed = text.trim();
			if (trimmed === "") return { kind: "clear" };
			const parsed = Number(trimmed);
			if (!Number.isFinite(parsed)) return void 0;
			if (integer && !Number.isInteger(parsed)) return void 0;
			if (min !== void 0 && parsed < min) return void 0;
			if (max !== void 0 && parsed > max) return void 0;
			return {
				kind: "set",
				value: parsed
			};
		}
	};
}
/**
* A free-text field. An empty draft clears the field. `entry` is `pick` when
* the text arrives whole from a picker (a preset or a reasoning level).
*/
function textField(field, entry = "type") {
	return {
		field,
		entry,
		format: (value) => typeof value === "string" ? value : "",
		parse: (text) => {
			const trimmed = text.trim();
			return trimmed === "" ? { kind: "clear" } : {
				kind: "set",
				value: trimmed
			};
		}
	};
}
/** A boolean field, edited through true/false draft text. */
function booleanField(field) {
	return {
		field,
		entry: "pick",
		format: (value) => typeof value === "boolean" ? String(value) : "",
		parse: (text) => {
			const trimmed = text.trim();
			if (trimmed === "") return { kind: "clear" };
			if (trimmed === "true") return {
				kind: "set",
				value: true
			};
			if (trimmed === "false") return {
				kind: "set",
				value: false
			};
		}
	};
}
/** An enumerated string field; only the listed choices are accepted. An empty draft clears the field. */
function choiceField(field, choices) {
	return {
		field,
		entry: "pick",
		format: (value) => typeof value === "string" && choices.includes(value) ? value : "",
		parse: (text) => {
			if (text === "") return { kind: "clear" };
			return choices.includes(text) ? {
				kind: "set",
				value: text
			} : void 0;
		}
	};
}
/**
* Applies one card's edits to one settings namespace as the reader makes them.
*
* The Host is the only authority on whether a value was accepted — its
* validators own the constraints no schema can express — so the outcome is
* read back from the section rather than predicted here. A write that did not
* land puts each pick back to the stored value, the way a switch that could not
* flip springs back, and keeps typed text so the reader can correct it instead
* of retyping.
*/
var CardForm = class {
	scope;
	specs;
	staged = /* @__PURE__ */ new Map();
	listeners = /* @__PURE__ */ new Set();
	/** The form subscription installed in the constructor; released by dispose(). */
	disposeForm;
	disposed = false;
	/** The pending write of typed text, waiting for typing to pause. */
	typePause;
	saving = false;
	/** A save asked for while one was in flight; it runs once the first settles (#1754). */
	saveQueued = false;
	failed = false;
	failedReason;
	/** @param scope - the bound configuration form for this card's namespace. */
	constructor(scope, specs) {
		this.scope = scope;
		this.specs = new Map(specs.map((spec) => [spec.field, spec]));
		this.disposeForm = scope.subscribe(() => {
			this.publish();
		});
	}
	/**
	* Release the form subscription and every bound store listener. The card
	* must call this on teardown; later calls are no-ops.
	*/
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		clearTimeout(this.typePause);
		this.disposeForm();
		this.listeners.clear();
	}
	/** Publish a projection of this form, rebuilt whenever the form or a draft changes. */
	bind(project) {
		const store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(project());
		this.listeners.add(() => {
			store.set(project());
		});
		return store;
	}
	/** Read the card-level state: what the Host serves, and what is still waiting to be written. */
	shell() {
		const snapshot = this.scope.getSnapshot();
		const plan = this.plan();
		return {
			available: snapshot.status !== "loading",
			exposed: snapshot.status === "ready",
			writable: snapshot.writable,
			dirty: plan.length > 0,
			invalid: plan.some((item) => item.judge === void 0),
			saving: this.saving,
			failed: this.failed,
			...this.failedReason === void 0 ? {} : { failedReason: this.failedReason }
		};
	}
	/** Read one field's state from the effective section and its staged draft. */
	field(field) {
		const spec = this.specOf(field);
		const staged = this.staged.get(field);
		if (staged === void 0) return {
			text: spec.format(this.sectionValue(field)),
			overridden: this.stored(field),
			invalid: false
		};
		const write = staged.clear ? { kind: "clear" } : spec.parse(staged.text);
		return {
			text: staged.text,
			overridden: write?.kind === "set",
			invalid: write === void 0
		};
	}
	/** The actions the card's slot registration injects. */
	actions() {
		return {
			edit: (field, text) => {
				this.stage(field, {
					text,
					clear: false
				});
			},
			resetField: (field) => {
				this.stage(field, {
					text: this.specOf(field).format(this.baseValue(field)),
					clear: true
				});
			},
			save: () => {
				this.applyNow();
			},
			discard: () => {
				clearTimeout(this.typePause);
				if (this.staged.size === 0 && !this.failed) return;
				this.staged.clear();
				this.failed = false;
				this.failedReason = void 0;
				this.publish();
			}
		};
	}
	/**
	* Run one write, and re-run it once if another was asked for while this one
	* was still in flight.
	*
	* A write is a Host round trip that also drives the profile reconcile, and
	* the Host runs it inside one exclusive transaction. Answering an edit that
	* arrives mid-flight by returning immediately dropped it with no explanation
	* (#1754). Serializing instead means an edit made while another write is
	* still settling is written against the settled state.
	* @returns settlement after the mutation and the read-back.
	*/
	async requestSave() {
		if (this.saving) {
			this.saveQueued = true;
			return;
		}
		await this.save();
		if (!this.saveQueued) return;
		this.saveQueued = false;
		await this.requestSave();
	}
	/**
	* Write every valid draft in one atomic form mutation, then re-seed from
	* what the Host accepted. A draft the field does not accept stays on screen,
	* unwritten, without holding the others back.
	*
	* The batch rides one mutate, so cross-field validate hooks (baseURL+model)
	* judge it as a unit: the Host either applies every write or refuses the
	* batch. The form contract answers a refusal or a skipped write with `false`
	* (it recovers with a fresh Host view instead of throwing), so the outcome is
	* judged twice: the answer itself, and then the settled snapshot read back
	* one planned write at a time. One missed write fails the whole batch. A
	* transport that rejects instead (the dsh-web bridge controller on a dead
	* connection) reports through the same failure path with its rejection
	* message. A batch that did not land puts its picks and clears back to the
	* stored value and keeps its typed text, so the reader can correct it.
	* @returns settlement after the mutation and the read-back.
	*/
	async save() {
		const valid = this.plan().filter((item) => item.judge !== void 0);
		if (valid.length === 0 || this.saving) return;
		const pending = /* @__PURE__ */ new Map();
		for (const item of valid) pending.set(item.field, this.staged.get(item.field));
		this.saving = true;
		this.failed = false;
		this.failedReason = void 0;
		this.publish();
		const ops = valid.map((item) => item.op.op === "set" ? {
			op: "set",
			path: [item.field],
			value: item.op.value
		} : {
			op: "unset",
			path: [item.field]
		});
		let failedReason;
		let accepted = false;
		try {
			accepted = await this.scope.mutate(ops);
		} catch (error) {
			failedReason = error instanceof Error ? error.message : String(error);
		}
		const landed = accepted && failedReason === void 0 && valid.every((item) => item.judge());
		for (const [field, before] of pending) {
			if (this.staged.get(field) !== before) continue;
			if (landed || before === void 0 || before.clear || this.specOf(field).entry === "pick") this.staged.delete(field);
		}
		this.saving = false;
		this.failed = !landed;
		this.failedReason = failedReason;
		this.publish();
	}
	/**
	* Every staged edit a write would carry. An entry whose draft is not a value
	* its field accepts carries no write: the form is still dirty, and the draft
	* stays on screen rather than being dropped. A staged edit that matches the
	* effective section is not a write at all.
	* @returns the planned writes, in the order the fields were staged.
	*/
	plan() {
		const plan = [];
		for (const [field, staged] of this.staged) {
			const spec = this.specOf(field);
			if (staged.clear) {
				if (this.stored(field)) plan.push({
					field,
					op: {
						field,
						op: "unset"
					},
					judge: () => this.landedUnset(field)
				});
				continue;
			}
			if (staged.text === spec.format(this.sectionValue(field))) continue;
			const write = spec.parse(staged.text);
			if (write === void 0) plan.push({
				field,
				op: {
					field,
					op: "unset"
				},
				judge: void 0
			});
			else if (write.kind === "clear") plan.push({
				field,
				op: {
					field,
					op: "unset"
				},
				judge: () => this.landedUnset(field)
			});
			else plan.push({
				field,
				op: {
					field,
					op: "set",
					value: write.value
				},
				judge: () => this.landedSet(field, write.value)
			});
		}
		return plan;
	}
	/**
	* Read-back judgment for a planned set: the user layer must hold the
	* intended value once the mutation has settled.
	*/
	landedSet(field, value) {
		if (this.specOf(field).secret) return true;
		return jsonValuesEqual(this.userLayer()?.[field], value);
	}
	/**
	* Read-back judgment for a planned unset: the field must be gone from the
	* user layer once the mutation has settled.
	*/
	landedUnset(field) {
		return !this.stored(field);
	}
	/**
	* Take one edit and schedule its write: a pick or a clear is written now,
	* typed text once typing has rested for TYPE_PAUSE_MS.
	*/
	stage(field, edit) {
		this.staged.set(field, edit);
		this.failed = false;
		this.failedReason = void 0;
		this.publish();
		if (edit.clear || this.specOf(field).entry === "pick") {
			this.applyNow();
			return;
		}
		clearTimeout(this.typePause);
		this.typePause = setTimeout(() => {
			this.applyNow();
		}, 600);
	}
	/** Write every pending draft now, taking the place of a waiting pause. */
	applyNow() {
		clearTimeout(this.typePause);
		this.typePause = void 0;
		if (this.disposed) return;
		this.requestSave();
	}
	specOf(field) {
		const spec = this.specs.get(field);
		if (spec === void 0) throw new Error(`settings card has no field ${field}`);
		return spec;
	}
	snapshotOf() {
		return this.scope.getSnapshot();
	}
	sectionValue(field) {
		return this.snapshotOf().value?.[field];
	}
	baseValue(field) {
		return this.snapshotOf().base?.[field];
	}
	userLayer() {
		return this.snapshotOf().user;
	}
	stored(field) {
		const user = this.userLayer();
		return user !== void 0 && Object.hasOwn(user, field);
	}
	publish() {
		for (const listener of this.listeners) listener();
	}
};
/** Structural equality for JSON settings values (primitives, arrays, plain objects). */
function jsonValuesEqual(left, right) {
	if (Object.is(left, right)) return true;
	if (typeof left !== "object" || left === null || typeof right !== "object" || right === null) return false;
	if (Array.isArray(left) || Array.isArray(right)) {
		if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
		return left.every((item, index) => jsonValuesEqual(item, right[index]));
	}
	const a = left;
	const b = right;
	const keysA = Object.keys(a).filter((key) => a[key] !== void 0);
	const keysB = Object.keys(b).filter((key) => b[key] !== void 0);
	if (keysA.length !== keysB.length) return false;
	return keysA.every((key) => Object.hasOwn(b, key) && jsonValuesEqual(a[key], b[key]));
}
//#endregion
//#region src/client/LiangShenSettingsCard.tsx
/** A tool family entry: a prefix ending in exactly one trailing star. */
const FAMILY_ENTRY_RE = /^[^*]+\*$/;
/**
* The on-demand tool family list: comma separated entries, each a prefix with
* one trailing star. Blank clears the field; any malformed entry holds the
* draft unwritten.
*/
function pagedToolPatternsField(field) {
	return {
		...textField(field),
		parse: (text) => {
			const entries = text.split(",").map((entry) => entry.trim()).filter((entry) => entry !== "");
			if (entries.length === 0) return { kind: "clear" };
			if (!entries.every((entry) => FAMILY_ENTRY_RE.test(entry))) return void 0;
			return {
				kind: "set",
				value: entries.join(", ")
			};
		}
	};
}
/** Wire presentations the tool catalog accepts (mirrors the Host schema). */
const PRESENTATION_CHOICES = ["ptc", "native"];
/** Bridges the `liangshen` settings form onto the card's staged form. */
var LiangShenSettingsCardController = class {
	form;
	store;
	/** @param scope - the bound configuration form of the entry that owns this namespace. */
	constructor(scope) {
		this.form = new CardForm(scope, [
			booleanField("enabled"),
			booleanField("announceToAgent"),
			choiceField("presentation", PRESENTATION_CHOICES),
			booleanField("dispatcher"),
			pagedToolPatternsField("pagedToolPatterns"),
			numberField("idleReclaimSteps", {
				integer: true,
				min: 0
			})
		]);
		this.store = this.form.bind(() => this.projection());
	}
	projection() {
		return {
			...this.form.shell(),
			enabled: this.form.field("enabled"),
			announceToAgent: this.form.field("announceToAgent"),
			presentation: this.form.field("presentation"),
			dispatcher: this.form.field("dispatcher"),
			pagedToolPatterns: this.form.field("pagedToolPatterns"),
			idleReclaimSteps: this.form.field("idleReclaimSteps")
		};
	}
	/**
	* Build the face the card's slot registration injects.
	* @returns the card's snapshot and its form actions.
	*/
	inject() {
		return {
			hooks: { liangShenSettingsCard: this.store },
			...this.form.actions()
		};
	}
	/** Release the card's scope subscription and bound stores. */
	dispose() {
		this.form.dispose();
	}
};
/**
* Render the LiangShen card.
* @param props - locale copy, the card snapshot, and its form actions.
* @returns the card.
*/
function LiangShenSettingsCard(props) {
	const { t } = props;
	const state = props.useLiangShenSettingsCard((snapshot) => snapshot);
	const fieldProps = {
		overriddenLabel: t("settings.overridden"),
		resetLabel: t("settings.reset"),
		invalidLabel: t("settings.invalidValue"),
		disabled: !state.writable,
		inheritLabel: t("settings.inherit")
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(PluginSettingsCard, {
		t,
		titleKey: "settings.title",
		descriptionKey: "settings.description",
		icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(LiangShenMark, {}),
		defaultOpen: false,
		state,
		renderChildrenWhenNotExposed: true,
		hideNotExposedNotice: true,
		onSave: props.save,
		onDiscard: props.discard,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BooleanField, {
				id: "settings-liangheng-enabled",
				label: t("settings.enabled"),
				hint: t("settings.enabledHint"),
				onLabel: t("settings.on"),
				offLabel: t("settings.off"),
				...fieldProps,
				...state.enabled,
				onEdit: (text) => {
					props.edit("enabled", text);
				},
				onReset: () => {
					props.resetField("enabled");
				}
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BooleanField, {
				id: "settings-liangheng-announce",
				label: t("settings.announceToAgent"),
				hint: t("settings.announceToAgentHint"),
				onLabel: t("settings.on"),
				offLabel: t("settings.off"),
				...fieldProps,
				...state.announceToAgent,
				onEdit: (text) => {
					props.edit("announceToAgent", text);
				},
				onReset: () => {
					props.resetField("announceToAgent");
				}
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChoiceField, {
				id: "settings-liangheng-presentation",
				label: t("settings.presentation"),
				hint: t("settings.presentationHint"),
				choices: PRESENTATION_CHOICES.map((choice) => ({
					value: choice,
					label: t(`presentation.${choice}`)
				})),
				presentation: "segment",
				...fieldProps,
				...state.presentation,
				onEdit: (text) => {
					props.edit("presentation", text);
				},
				onReset: () => {
					props.resetField("presentation");
				}
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BooleanField, {
				id: "settings-liangheng-dispatcher",
				label: t("settings.dispatcher"),
				hint: t("settings.dispatcherHint"),
				onLabel: t("settings.on"),
				offLabel: t("settings.off"),
				...fieldProps,
				...state.dispatcher,
				onEdit: (text) => {
					props.edit("dispatcher", text);
				},
				onReset: () => {
					props.resetField("dispatcher");
				}
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
				id: "settings-liangheng-paged-tool-patterns",
				label: t("settings.pagedToolPatterns"),
				hint: t("settings.pagedToolPatternsHint"),
				placeholder: "browser_*, task_board_*",
				...fieldProps,
				invalidLabel: t("settings.pagedToolPatternsInvalid"),
				...state.pagedToolPatterns,
				onEdit: (text) => {
					props.edit("pagedToolPatterns", text);
				},
				onReset: () => {
					props.resetField("pagedToolPatterns");
				}
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
				id: "settings-liangheng-idle-reclaim-steps",
				label: t("settings.idleReclaimSteps"),
				hint: t("settings.idleReclaimStepsHint"),
				placeholder: "0",
				...fieldProps,
				invalidLabel: t("settings.idleReclaimStepsInvalid"),
				...state.idleReclaimSteps,
				onEdit: (text) => {
					props.edit("idleReclaimSteps", text);
				},
				onReset: () => {
					props.resetField("idleReclaimSteps");
				}
			})
		]
	});
}
//#endregion
//#region src/client/locales.ts
/**
* Lever copy: zh-first dictionary with an English counterpart. The zh side is
* the key-set source of truth; `packages/dsh-i18n` mirrors the keys into the
* centralized ru dictionary and `pnpm i18n:check` enforces the parity.
*/
/** Lever copy, key source of truth. */
const zh = {
	"lever.a11y": "梁衡模式拨杆",
	"lever.name": "梁衡模式",
	"lever.hint.pull": "拨下拨杆：开启「梁衡模式」",
	"lever.hint.push": "上拨拨杆：返回「{preset}」",
	"lever.hint.locked": "会话已开始，模式不可再更改",
	"lever.hint.missing": "未找到「梁衡模式」预设，请先启用该插件行",
	"lever.state.off": "普通模式",
	"lever.readout.on": "已开启",
	"lever.readout.off": "未开启",
	"lever.failed.locked": "会话已经开始，模式已锁定",
	"lever.failed.missing": "没有找到「梁衡模式」预设",
	"lever.failed.timeout": "切换超时，请重试",
	"lever.failed.failed": "切换失败：{reason}",
	"burst.line1": "洞察意图 · 最优架构 · 极速落地",
	"burst.line2": "证据驱动 · 严谨验证 · 诚实交付",
	"settings.title": "梁衡模式",
	"settings.description": "梁衡模式的开关、工具面与可选调度身份。",
	"settings.enabled": "总开关",
	"settings.enabledHint": "关掉后不再声明预设。",
	"settings.announceToAgent": "公告给 agent",
	"settings.announceToAgentHint": "每一轮系统提示都带上本插件公告。",
	"settings.presentation": "工具面",
	"settings.presentationHint": "native 保留原生清单（默认，编码准确率更高、延迟更低），ptc 把工具收进 run_code。",
	"settings.dispatcher": "调度身份",
	"settings.dispatcherHint": "默认关闭以保持主程直写极速编码；开启后按调度 Agent 工作（分诊、访谈、派发子代理）。",
	"settings.pagedToolPatterns": "按需工具族",
	"settings.pagedToolPatternsHint": "逗号分隔，每项以单个 * 结尾。命中这些前缀的工具默认不进上下文，需要时用 tool_activate 按需加载。留空继承出厂 7 项：mcp__*, browser_*, task_board_*, team_*, squad*, ui_*, ssh_*。",
	"settings.pagedToolPatternsInvalid": "每项须是非空前缀并以单个 * 结尾，逗号分隔，例如 task_board_*。",
	"settings.idleReclaimSteps": "空闲收回步数",
	"settings.idleReclaimStepsHint": "连续 N 步没有成功调用的已激活工具族会过期，但只在下次激活或压缩时收回——这些时机前缀缓存本就要重建，因此不新增缓存重建；收回前仍常驻可用，再次调用即续命。0 或留空 = 不收回（出厂行为）。",
	"settings.idleReclaimStepsInvalid": "填一个非负整数（步数），例如 30；0 或留空表示不收回。",
	"settings.on": "开",
	"settings.off": "关",
	"settings.inherit": "继承",
	"settings.overridden": "已修改",
	"settings.reset": "恢复默认",
	"settings.notExposed": "这个版本的 DSH 没有开放梁衡模式的设置。",
	"settings.readOnly": "设置只读。",
	"settings.expand": "展开设置",
	"settings.collapse": "收起设置",
	"settings.saveFailed": "没有保存成功。",
	"settings.invalidValue": "填一个可用的值。",
	"presentation.ptc": "ptc",
	"presentation.native": "native",
	"diagram.graph": "图表",
	"diagram.code": "源码",
	"diagram.copy": "复制",
	"diagram.copied": "已复制",
	"diagram.zoom": "放大预览",
	"diagram.close": "关闭预览"
};
/** English counterpart; the key set mirrors {@link zh} exactly. */
const en = {
	"lever.a11y": "LiangHeng mode lever",
	"lever.name": "LiangHeng mode",
	"lever.hint.pull": "Pull the lever down to turn on LiangHeng mode",
	"lever.hint.push": "Push the lever up to return to \"{preset}\"",
	"lever.hint.locked": "The session has started, so its mode can no longer change",
	"lever.hint.missing": "The LiangHeng preset is not installed; enable that plugin row first",
	"lever.state.off": "Standard",
	"lever.readout.on": "On",
	"lever.readout.off": "Off",
	"lever.failed.locked": "The session already started, so the mode is locked",
	"lever.failed.missing": "The LiangHeng preset was not found",
	"lever.failed.timeout": "The switch timed out; try again",
	"lever.failed.failed": "Switch failed: {reason}",
	"burst.line1": "Clear Intent · Optimal Design · Fast Delivery",
	"burst.line2": "Evidence-Driven · Rigorous · Honest",
	"settings.title": "LiangHeng mode",
	"settings.description": "The mode switch, the wire presentation and the optional dispatcher identity.",
	"settings.enabled": "Master switch",
	"settings.enabledHint": "When off, the preset is no longer declared.",
	"settings.announceToAgent": "Announce to agents",
	"settings.announceToAgentHint": "Every system prompt carries this plugin note.",
	"settings.presentation": "Wire",
	"settings.presentationHint": "native keeps the native roster (default, higher coding accuracy & lower latency); ptc folds tools into run_code.",
	"settings.dispatcher": "Dispatcher",
	"settings.dispatcherHint": "Off by default for fast direct coding; turn on to work as a coordinator (triage, interview, dispatch subagents).",
	"settings.pagedToolPatterns": "On-demand tool families",
	"settings.pagedToolPatternsHint": "Comma separated, each entry ending in a single *. Tools matching these prefixes stay out of context by default; load them with tool_activate when needed. Leave empty to inherit the 7 factory entries: mcp__*, browser_*, task_board_*, team_*, squad*, ui_*, ssh_*.",
	"settings.pagedToolPatternsInvalid": "Each entry must be a non-empty prefix ending in a single *, comma separated, for example task_board_*.",
	"settings.idleReclaimSteps": "Idle reclaim steps",
	"settings.idleReclaimStepsHint": "An activated tool family with no successful call for N steps expires, but is reclaimed only at the next activation or compaction — moments the prefix cache rebuilds anyway, so no extra rebuild is paid. It stays resident and callable until then; any call refreshes it. 0 or empty = no reclaim (factory behavior).",
	"settings.idleReclaimStepsInvalid": "Enter a non-negative integer number of steps, for example 30; 0 or empty means no reclaim.",
	"settings.on": "On",
	"settings.off": "Off",
	"settings.inherit": "Inherit",
	"settings.overridden": "Changed",
	"settings.reset": "Reset to default",
	"settings.notExposed": "This DSH version does not open the LiangHeng settings.",
	"settings.readOnly": "Settings are read-only.",
	"settings.expand": "Show settings",
	"settings.collapse": "Hide settings",
	"settings.saveFailed": "Not saved.",
	"settings.invalidValue": "Enter a value this field accepts.",
	"presentation.ptc": "ptc",
	"presentation.native": "native",
	"diagram.graph": "Diagram",
	"diagram.code": "Source",
	"diagram.copy": "Copy",
	"diagram.copied": "Copied",
	"diagram.zoom": "Zoom",
	"diagram.close": "Close preview"
};
//#endregion
//#region src/client/mermaid-lite.ts
const FONT_SIZE = 13;
const LINE_HEIGHT = 18;
function escapeXml(text) {
	return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function unquote(text) {
	const trimmed = text.trim();
	if (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'") || trimmed.startsWith("`") && trimmed.endsWith("`")) return trimmed.slice(1, -1);
	return trimmed;
}
function splitLines(label) {
	return label.replaceAll(/<br\s*\/?>/gi, "\n").replaceAll("\\n", "\n").split("\n").map((l) => l.trimEnd());
}
function textWidthPx(text, fontSize = FONT_SIZE) {
	let units = 0;
	for (const ch of text) {
		const cp = ch.codePointAt(0) ?? 0;
		units += cp >= 11904 && cp <= 40959 || cp >= 63744 && cp <= 64255 || cp >= 44032 && cp <= 55215 || cp >= 65280 && cp <= 65519 || cp > 126976 ? 1.04 : .6;
	}
	return Math.ceil(units * fontSize);
}
function measureLabel(label, fontSize = FONT_SIZE) {
	const lines = splitLines(label);
	return {
		width: Math.max(24, ...lines.map((l) => textWidthPx(l, fontSize))),
		height: Math.max(LINE_HEIGHT, lines.length * LINE_HEIGHT),
		lines
	};
}
function renderSvgText(x, centerY, label, cls, fontSize = FONT_SIZE) {
	const lines = splitLines(label);
	if (lines.length === 1) return `<text x="${x.toFixed(1)}" y="${(centerY + fontSize * .35).toFixed(1)}" text-anchor="middle" class="${cls}">${escapeXml(lines[0] ?? "")}</text>`;
	const topY = centerY - (lines.length - 1) * LINE_HEIGHT / 2 + fontSize * .35;
	const tspans = lines.map((line, i) => `<tspan x="${x.toFixed(1)}" dy="${i === 0 ? 0 : LINE_HEIGHT}">${escapeXml(line)}</tspan>`).join("");
	return `<text x="${x.toFixed(1)}" y="${topY.toFixed(1)}" text-anchor="middle" class="${cls}">${tspans}</text>`;
}
function preprocessLines(source) {
	let clean = source.replace(/\r\n?/g, "\n").trim();
	if (/^---\s*\n/.test(clean)) {
		const end = clean.indexOf("\n---", 3);
		if (end !== -1) clean = clean.slice(end + 4).trim();
	}
	const out = [];
	for (const rawLine of clean.split("\n")) {
		let line = "";
		let quote = null;
		for (let i = 0; i < rawLine.length; i++) {
			const ch = rawLine[i];
			if ((ch === "\"" || ch === "'") && rawLine[i - 1] !== "\\") quote = quote === ch ? null : quote ?? ch;
			if (quote === null && ch === "%" && rawLine[i + 1] === "%") break;
			line += ch;
		}
		const trimmed = line.trim();
		if (trimmed !== "") out.push(trimmed);
	}
	return out;
}
function parseNodeToken(token) {
	const trimmed = token.trim();
	for (const [re, shape] of [
		[/^([A-Za-z0-9_.-]+)\(\[([\s\S]+)\]\)$/, "stadium"],
		[/^([A-Za-z0-9_.-]+)\[\(([\s\S]+)\)\]$/, "cylinder"],
		[/^([A-Za-z0-9_.-]+)\(\(([\s\S]+)\)\)$/, "circle"],
		[/^([A-Za-z0-9_.-]+)\{\{([\s\S]+)\}\}$/, "hexagon"],
		[/^([A-Za-z0-9_.-]+)\[\[([\s\S]+)\]\]$/, "rect"],
		[/^([A-Za-z0-9_.-]+)\[([\s\S]+)\]$/, "rect"],
		[/^([A-Za-z0-9_.-]+)\(([\s\S]+)\)$/, "round"],
		[/^([A-Za-z0-9_.-]+)\{([\s\S]+)\}$/, "diamond"]
	]) {
		const m = re.exec(trimmed);
		if (m) return {
			id: m[1],
			label: unquote(m[2]),
			shape
		};
	}
	const bare = /^([A-Za-z0-9_.-]+)$/.exec(trimmed);
	if (bare) return { id: bare[1] };
	return { id: "" };
}
const FLOW_OP_RE = /(?:==>|===|-\.->|-\.-|-->|--->|---|--\s+[^-]+?\s+-->|--\s+[^-]+?\s+---|==\s+[^=]+?\s+==>|-\.\s+[^.]+?\s+\.->)/;
function matchEdgeAt(str, from) {
	const rest = str.slice(from);
	for (const [re, style, arrow, hasCapture] of [
		[
			/^-\.\s*([\s\S]+?)\s*\.->\|([^|]*)\|/,
			"dotted",
			true,
			true
		],
		[
			/^-\.\s*([\s\S]+?)\s*\.->/,
			"dotted",
			true,
			true
		],
		[
			/^==\s*([\s\S]+?)\s*==>/,
			"thick",
			true,
			true
		],
		[
			/^--\s*([^|>\n][\s\S]*?)\s*-->/,
			"solid",
			true,
			true
		],
		[
			/^--\s*([^|>\n-]+?)\s*---/,
			"solid",
			false,
			true
		],
		[
			/^-\.->\|([^|]*)\|/,
			"dotted",
			true,
			true
		],
		[
			/^==>\|([^|]*)\|/,
			"thick",
			true,
			true
		],
		[
			/^-->\|([^|]*)\|/,
			"solid",
			true,
			true
		],
		[
			/^---\|([^|]*)\|/,
			"solid",
			false,
			true
		],
		[
			/^-\.->/,
			"dotted",
			true,
			false
		],
		[
			/^-\.-/,
			"dotted",
			false,
			false
		],
		[
			/^==>/,
			"thick",
			true,
			false
		],
		[
			/^===/,
			"thick",
			false,
			false
		],
		[
			/^--+>/,
			"solid",
			true,
			false
		],
		[
			/^---/,
			"solid",
			false,
			false
		]
	]) {
		const m = re.exec(rest);
		if (m) return {
			end: from + m[0].length,
			label: hasCapture ? unquote(m[1] ?? "") : "",
			style,
			arrow
		};
	}
	return null;
}
function splitTopLevelEdgeChain(statement) {
	const nodes = [];
	const edges = [];
	let depthParen = 0;
	let depthBracket = 0;
	let depthBrace = 0;
	let quote = null;
	let segStart = 0;
	for (let i = 0; i < statement.length; i++) {
		const ch = statement[i];
		if ((ch === "\"" || ch === "'") && statement[i - 1] !== "\\") {
			quote = quote === ch ? null : quote ?? ch;
			continue;
		}
		if (quote !== null) continue;
		if (ch === "(") depthParen++;
		else if (ch === ")") depthParen = Math.max(0, depthParen - 1);
		else if (ch === "[") depthBracket++;
		else if (ch === "]") depthBracket = Math.max(0, depthBracket - 1);
		else if (ch === "{") depthBrace++;
		else if (ch === "}") depthBrace = Math.max(0, depthBrace - 1);
		if (depthParen === 0 && depthBracket === 0 && depthBrace === 0) {
			const hit = matchEdgeAt(statement, i);
			if (hit) {
				const left = statement.slice(segStart, i).trim();
				if (left === "") return null;
				nodes.push(left);
				edges.push({
					label: hit.label,
					style: hit.style,
					arrow: hit.arrow
				});
				segStart = hit.end;
				i = hit.end - 1;
			}
		}
	}
	if (edges.length === 0) return null;
	const tail = statement.slice(segStart).trim();
	if (tail === "") return null;
	nodes.push(tail);
	return {
		nodes,
		edges
	};
}
function layoutAndRenderGraph(kind, direction, nodeMap, edges, subgraphs) {
	if (nodeMap.size === 0) return null;
	const normalizedDir = direction === "TB" ? "TD" : direction;
	const horizontal = normalizedDir === "LR" || normalizedDir === "RL";
	for (const node of nodeMap.values()) {
		if (node.shape === "point") {
			node.width = 20;
			node.height = 20;
			continue;
		}
		const m = measureLabel(node.label);
		const padX = node.shape === "diamond" ? 46 : node.shape === "hexagon" ? 40 : 28;
		const padY = node.shape === "diamond" ? 28 : node.shape === "cylinder" ? 26 : 18;
		node.width = Math.max(56, m.width + padX);
		node.height = Math.max(36, m.height + padY);
		if (node.shape === "circle") {
			const side = Math.max(node.width, node.height, 42);
			node.width = side;
			node.height = side;
		}
	}
	const adj = /* @__PURE__ */ new Map();
	for (const id of nodeMap.keys()) adj.set(id, []);
	for (const e of edges) if (e.from !== e.to && adj.has(e.from) && nodeMap.has(e.to)) adj.get(e.from).push(e.to);
	const dagEdges = [];
	const state = /* @__PURE__ */ new Map();
	const dfsCycle = (u) => {
		state.set(u, 1);
		for (const v of adj.get(u) ?? []) {
			const s = state.get(v) ?? 0;
			if (s === 0) {
				dagEdges.push({
					from: u,
					to: v,
					label: "",
					style: "solid",
					arrow: true
				});
				dfsCycle(v);
			} else if (s === 2) dagEdges.push({
				from: u,
				to: v,
				label: "",
				style: "solid",
				arrow: true
			});
		}
		state.set(u, 2);
	};
	for (const id of nodeMap.keys()) if ((state.get(id) ?? 0) === 0) dfsCycle(id);
	for (let pass = 0; pass < nodeMap.size; pass++) {
		let changed = false;
		for (const e of dagEdges) {
			const u = nodeMap.get(e.from);
			const v = nodeMap.get(e.to);
			if (v.rank < u.rank + 1) {
				v.rank = u.rank + 1;
				changed = true;
			}
		}
		if (!changed) break;
	}
	const maxRank = Math.max(0, ...[...nodeMap.values()].map((n) => n.rank));
	const ranks = Array.from({ length: maxRank + 1 }, () => []);
	for (const node of nodeMap.values()) ranks[node.rank].push(node);
	for (let r = 0; r <= maxRank; r++) ranks[r].forEach((n, i) => {
		n.order = i;
	});
	const preds = /* @__PURE__ */ new Map();
	for (const id of nodeMap.keys()) preds.set(id, []);
	for (const e of edges) if (e.from !== e.to) preds.get(e.to)?.push(e.from);
	for (let sweep = 0; sweep < 2; sweep++) for (let r = 1; r <= maxRank; r++) {
		ranks[r].sort((a, b) => {
			const avg = (n) => {
				const ps = (preds.get(n.id) ?? []).map((id) => nodeMap.get(id)).filter((p) => p !== void 0 && p.rank < n.rank);
				return ps.length === 0 ? n.order : ps.reduce((s, p) => s + p.order, 0) / ps.length;
			};
			return avg(a) - avg(b);
		});
		ranks[r].forEach((n, i) => {
			n.order = i;
		});
	}
	const PAD = 32;
	const GAP_PRIMARY = edges.some((e) => e.label !== "") ? 72 : 56;
	const GAP_CROSS = 28;
	const SUBGRAPH_TOP_EXTRA = 26;
	const rankSizes = ranks.map((layer) => Math.max(36, ...layer.map((n) => horizontal ? n.width : n.height)));
	const rankCrossTotal = ranks.map((layer) => layer.reduce((s, n) => s + (horizontal ? n.height : n.width), 0) + Math.max(0, layer.length - 1) * GAP_CROSS);
	const maxCrossSpan = Math.max(120, ...rankCrossTotal);
	const rankStart = new Array(maxRank + 1).fill(0);
	let cursor = PAD + (subgraphs.length > 0 && !horizontal ? SUBGRAPH_TOP_EXTRA : 0);
	const orderedRanks = normalizedDir === "RL" || normalizedDir === "BT" ? [...ranks.keys()].reverse() : [...ranks.keys()];
	for (const r of orderedRanks) {
		rankStart[r] = cursor;
		cursor += rankSizes[r] + GAP_PRIMARY;
	}
	const totalPrimary = cursor - GAP_PRIMARY + PAD;
	for (let r = 0; r <= maxRank; r++) {
		const layer = ranks[r];
		const span = rankCrossTotal[r];
		let cross = PAD + (horizontal && subgraphs.length > 0 ? SUBGRAPH_TOP_EXTRA : 0) + (maxCrossSpan - span) / 2;
		for (const node of layer) if (horizontal) {
			node.x = rankStart[r] + rankSizes[r] / 2;
			node.y = cross + node.height / 2;
			cross += node.height + GAP_CROSS;
		} else {
			node.x = cross + node.width / 2;
			node.y = rankStart[r] + rankSizes[r] / 2;
			cross += node.width + GAP_CROSS;
		}
	}
	const sgSvg = [];
	let maxX = horizontal ? totalPrimary : maxCrossSpan + PAD * 2;
	let maxY = horizontal ? maxCrossSpan + PAD * 2 + (subgraphs.length > 0 ? SUBGRAPH_TOP_EXTRA : 0) : totalPrimary;
	for (const sg of subgraphs) {
		const members = sg.nodeIds.map((id) => nodeMap.get(id)).filter((n) => n !== void 0);
		if (members.length === 0) continue;
		const x1 = Math.min(...members.map((m) => m.x - m.width / 2)) - 14;
		const y1 = Math.min(...members.map((m) => m.y - m.height / 2)) - 28;
		const x2 = Math.max(...members.map((m) => m.x + m.width / 2)) + 14;
		const y2 = Math.max(...members.map((m) => m.y + m.height / 2)) + 14;
		maxX = Math.max(maxX, x2 + PAD / 2);
		maxY = Math.max(maxY, y2 + PAD / 2);
		sgSvg.push(`<g class="lh-subgraph"><rect x="${x1.toFixed(1)}" y="${y1.toFixed(1)}" width="${(x2 - x1).toFixed(1)}" height="${(y2 - y1).toFixed(1)}" rx="8" /><text x="${(x1 + 10).toFixed(1)}" y="${(y1 + 18).toFixed(1)}" class="lh-sg-title">${escapeXml(sg.title)}</text></g>`);
	}
	const edgeSvg = [];
	for (const e of edges) {
		const u = nodeMap.get(e.from);
		const v = nodeMap.get(e.to);
		if (!u || !v) continue;
		let pathD;
		let lx;
		let ly;
		if (u === v) {
			const sx = u.x + u.width / 2;
			const sy = u.y - 6;
			const ex = u.x + u.width / 2;
			const ey = u.y + 6;
			pathD = `M ${sx} ${sy} C ${sx + 38} ${sy - 26}, ${ex + 38} ${ey + 26}, ${ex} ${ey}`;
			lx = sx + 34;
			ly = u.y;
		} else if (horizontal) {
			const forward = u.x <= v.x;
			const sx = u.x + (forward ? u.width / 2 : -u.width / 2);
			const sy = u.y;
			const ex = v.x + (forward ? -v.width / 2 : v.width / 2);
			const ey = v.y;
			const mx = (sx + ex) / 2;
			if (Math.abs(u.rank - v.rank) === 0) {
				const bulge = sx + 40;
				pathD = `M ${sx} ${sy} C ${bulge} ${sy}, ${bulge} ${ey}, ${ex} ${ey}`;
				lx = bulge - 6;
				ly = (sy + ey) / 2;
			} else {
				pathD = `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ey}, ${ex} ${ey}`;
				lx = mx;
				ly = (sy + ey) / 2;
			}
		} else {
			const forward = u.y <= v.y;
			const sx = u.x;
			const sy = u.y + (forward ? u.height / 2 : -u.height / 2);
			const ex = v.x;
			const ey = v.y + (forward ? -v.height / 2 : v.height / 2);
			const my = (sy + ey) / 2;
			if (Math.abs(u.rank - v.rank) === 0) {
				const bulge = Math.max(u.x, v.x) + u.width / 2 + 26;
				pathD = `M ${sx} ${sy} C ${bulge} ${sy}, ${bulge} ${ey}, ${ex} ${ey}`;
				lx = bulge;
				ly = (sy + ey) / 2;
			} else {
				pathD = `M ${sx} ${sy} C ${sx} ${my}, ${ex} ${my}, ${ex} ${ey}`;
				lx = (sx + ex) / 2;
				ly = my;
			}
		}
		const dash = e.style === "dotted" ? " stroke-dasharray=\"5,4\"" : "";
		const sw = e.style === "thick" ? "2.4" : "1.5";
		const marker = e.arrow ? " marker-end=\"url(#lh-arrow)\"" : "";
		edgeSvg.push(`<path d="${pathD}" fill="none" stroke-width="${sw}"${dash}${marker} class="lh-edge" />`);
		if (e.label !== "") {
			const m = measureLabel(e.label, 11.5);
			const rw = m.width + 12;
			const rh = m.height + 6;
			edgeSvg.push(`<g class="lh-edge-label"><rect x="${(lx - rw / 2).toFixed(1)}" y="${(ly - rh / 2).toFixed(1)}" width="${rw.toFixed(1)}" height="${rh.toFixed(1)}" rx="4" />` + renderSvgText(lx, ly, e.label, "lh-edge-text", 11.5) + `</g>`);
		}
	}
	const nodeSvg = [];
	for (const n of nodeMap.values()) {
		const left = n.x - n.width / 2;
		const top = n.y - n.height / 2;
		let shapeEl;
		if (n.shape === "point") {
			nodeSvg.push(`<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="8" class="lh-state-point" />`);
			continue;
		} else if (n.shape === "diamond") shapeEl = `<polygon points="${`${n.x},${top} ${left + n.width},${n.y} ${n.x},${top + n.height} ${left},${n.y}`}" class="lh-node-shape lh-node-diamond" />`;
		else if (n.shape === "hexagon") {
			const dx = 12;
			shapeEl = `<polygon points="${`${left + dx},${top} ${left + n.width - dx},${top} ${left + n.width},${n.y} ${left + n.width - dx},${top + n.height} ${left + dx},${top + n.height} ${left},${n.y}`}" class="lh-node-shape" />`;
		} else if (n.shape === "circle") shapeEl = `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${(n.width / 2).toFixed(1)}" class="lh-node-shape" />`;
		else if (n.shape === "cylinder") {
			const ry = 6;
			shapeEl = `<path d="${`M ${left} ${top + ry} a ${n.width / 2} ${ry} 0 1 0 ${n.width} 0 a ${n.width / 2} ${ry} 0 1 0 ${-n.width} 0 v ${n.height - ry * 2} a ${n.width / 2} ${ry} 0 0 0 ${n.width} 0 v ${-(n.height - ry * 2)}`}" class="lh-node-shape" />`;
		} else {
			const rx = n.shape === "stadium" ? Math.round(n.height / 2) : n.shape === "round" ? 12 : 6;
			shapeEl = `<rect x="${left.toFixed(1)}" y="${top.toFixed(1)}" width="${n.width.toFixed(1)}" height="${n.height.toFixed(1)}" rx="${rx}" class="lh-node-shape" />`;
		}
		nodeSvg.push(`<g class="lh-node">${shapeEl}${renderSvgText(n.x, n.y, n.label, "lh-node-text")}</g>`);
	}
	const w = Math.ceil(maxX);
	const h = Math.ceil(maxY);
	return {
		kind,
		width: w,
		height: h,
		svgMarkup: buildSvgShell(w, h, [
			...sgSvg,
			...edgeSvg,
			...nodeSvg
		].join(""))
	};
}
function parseFlowchart(lines) {
	const header = /^(?:flowchart|graph)(?:\s+(TD|TB|LR|RL|BT))?\b/i.exec(lines[0] ?? "");
	if (!header) return null;
	const direction = header[1]?.toUpperCase() ?? "TD";
	const nodeMap = /* @__PURE__ */ new Map();
	const edges = [];
	const subgraphs = [];
	const sgStack = [];
	const ensureNode = (rawToken) => {
		const parsed = parseNodeToken(rawToken);
		if (parsed.id === "") return "";
		const existing = nodeMap.get(parsed.id);
		if (existing) {
			if (parsed.label !== void 0) existing.label = parsed.label;
			if (parsed.shape !== void 0) existing.shape = parsed.shape;
			if (sgStack.length > 0 && !existing.subgraphId) {
				const sg = sgStack[sgStack.length - 1];
				existing.subgraphId = sg.id;
				sg.nodeIds.push(existing.id);
			}
			return existing.id;
		}
		const sg = sgStack.length > 0 ? sgStack[sgStack.length - 1] : void 0;
		const node = {
			id: parsed.id,
			label: parsed.label ?? parsed.id,
			shape: parsed.shape ?? "rect",
			subgraphId: sg?.id,
			width: 80,
			height: 36,
			rank: 0,
			order: 0,
			x: 0,
			y: 0
		};
		nodeMap.set(parsed.id, node);
		sg?.nodeIds.push(parsed.id);
		return parsed.id;
	};
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].replace(/;\s*$/, "").trim();
		if (line === "") continue;
		if (/^(?:classDef|class|style|linkStyle|click|direction)\b/i.test(line)) continue;
		if (line === "end") {
			sgStack.pop();
			continue;
		}
		const sgMatch = /^subgraph\s+(.+)$/i.exec(line);
		if (sgMatch) {
			const rest = sgMatch[1].trim();
			const withBracket = /^([A-Za-z0-9_.-]+)\s*\[([\s\S]+)\]$/.exec(rest);
			const box = {
				id: withBracket ? withBracket[1] : `sg_${subgraphs.length}`,
				title: withBracket ? unquote(withBracket[2]) : unquote(rest),
				nodeIds: []
			};
			subgraphs.push(box);
			sgStack.push(box);
			continue;
		}
		const chain = splitTopLevelEdgeChain(line);
		if (chain) {
			for (let k = 0; k < chain.edges.length; k++) {
				const leftIds = chain.nodes[k].split("&").map(ensureNode).filter(Boolean);
				const rightIds = chain.nodes[k + 1].split("&").map(ensureNode).filter(Boolean);
				const edgeMeta = chain.edges[k];
				for (const from of leftIds) for (const to of rightIds) edges.push({
					from,
					to,
					...edgeMeta
				});
			}
			continue;
		}
		if (FLOW_OP_RE.test(line)) continue;
		ensureNode(line);
	}
	return layoutAndRenderGraph("flowchart", direction, nodeMap, edges, subgraphs);
}
function parseStateDiagram(lines) {
	if (!/^stateDiagram(?:-v2)?\b/i.test(lines[0] ?? "")) return null;
	let direction = "TD";
	const nodeMap = /* @__PURE__ */ new Map();
	const edges = [];
	let startCount = 0;
	const resolveStateId = (raw, isTarget) => {
		const t = raw.trim();
		if (t === "[*]") {
			const id = isTarget && startCount > 0 ? "__end__" : "__start__";
			if (!isTarget) startCount += 1;
			if (!nodeMap.has(id)) nodeMap.set(id, {
				id,
				label: "",
				shape: "point",
				width: 20,
				height: 20,
				rank: 0,
				order: 0,
				x: 0,
				y: 0
			});
			return id;
		}
		if (!nodeMap.has(t)) nodeMap.set(t, {
			id: t,
			label: t,
			shape: "round",
			width: 80,
			height: 36,
			rank: 0,
			order: 0,
			x: 0,
			y: 0
		});
		return t;
	};
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (line === "" || line === "{" || line === "}" || line === "note" || /^note\b/i.test(line)) continue;
		const dirMatch = /^direction\s+(TD|TB|LR|RL|BT)\b/i.exec(line);
		if (dirMatch) {
			direction = dirMatch[1].toUpperCase();
			continue;
		}
		const aliasMatch = /^state\s+"([^"]+)"\s+as\s+([A-Za-z0-9_.-]+)/i.exec(line);
		if (aliasMatch) {
			const id = resolveStateId(aliasMatch[2], false);
			nodeMap.get(id).label = aliasMatch[1];
			continue;
		}
		const edgeMatch = /^(\[\*\]|[A-Za-z0-9_.-]+)\s*-->\s*(\[\*\]|[A-Za-z0-9_.-]+)(?:\s*:\s*(.+))?$/.exec(line);
		if (edgeMatch) {
			const from = resolveStateId(edgeMatch[1], false);
			const to = resolveStateId(edgeMatch[2], true);
			edges.push({
				from,
				to,
				label: (edgeMatch[3] ?? "").trim(),
				style: "solid",
				arrow: true
			});
			continue;
		}
		const descMatch = /^([A-Za-z0-9_.-]+)\s*:\s*(.+)$/.exec(line);
		if (descMatch) {
			const id = resolveStateId(descMatch[1], false);
			nodeMap.get(id).label = descMatch[2].trim();
		}
	}
	return layoutAndRenderGraph("state", direction, nodeMap, edges, []);
}
function parseSequenceDiagram(lines) {
	if (!/^sequenceDiagram\b/i.test(lines[0] ?? "")) return null;
	const participants = /* @__PURE__ */ new Map();
	const order = [];
	const events = [];
	const ensureParticipant = (rawId, alias) => {
		const id = rawId.trim();
		const existing = participants.get(id);
		if (existing) {
			if (alias !== void 0) existing.label = unquote(alias);
			return id;
		}
		const label = alias !== void 0 ? unquote(alias) : id;
		const m = measureLabel(label);
		participants.set(id, {
			id,
			label,
			x: 0,
			width: Math.max(88, m.width + 24)
		});
		order.push(id);
		return id;
	};
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (line === "" || /^autonumber\b/i.test(line) || /^(?:activate|deactivate|destroy|box)\b/i.test(line)) continue;
		const partMatch = /^(?:participant|actor)\s+([A-Za-z0-9_.-]+)(?:\s+as\s+(.+))?$/i.exec(line);
		if (partMatch) {
			ensureParticipant(partMatch[1], partMatch[2]);
			continue;
		}
		const groupMatch = /^(alt|opt|loop|par|critical|break)\s*(.*)$/i.exec(line);
		if (groupMatch) {
			events.push({
				kind: "groupStart",
				keyword: groupMatch[1].toLowerCase(),
				label: groupMatch[2].trim()
			});
			continue;
		}
		const divMatch = /^(?:else|and|option)\s*(.*)$/i.exec(line);
		if (divMatch) {
			events.push({
				kind: "groupDivider",
				label: divMatch[1].trim()
			});
			continue;
		}
		if (line === "end") {
			events.push({ kind: "groupEnd" });
			continue;
		}
		const noteMatch = /^Note\s+(left of|right of|over)\s+([^:]+):\s*(.*)$/i.exec(line);
		if (noteMatch) {
			const placeRaw = noteMatch[1].toLowerCase();
			const placement = placeRaw.startsWith("left") ? "left" : placeRaw.startsWith("right") ? "right" : "over";
			const targets = noteMatch[2].split(",").map((s) => ensureParticipant(s));
			events.push({
				kind: "note",
				left: targets[0],
				right: targets[targets.length - 1],
				placement,
				text: noteMatch[3].trim()
			});
			continue;
		}
		const msgMatch = /^([A-Za-z0-9_.-]+)\s*(-->>|->>|-->|->|--x|-x|--\)|-\))[+-]?\s*([A-Za-z0-9_.-]+)\s*:\s*(.*)$/.exec(line);
		if (msgMatch) {
			const from = ensureParticipant(msgMatch[1]);
			const op = msgMatch[2];
			const to = ensureParticipant(msgMatch[3]);
			events.push({
				kind: "msg",
				from,
				to,
				label: msgMatch[4].trim(),
				dashed: op.startsWith("--")
			});
		}
	}
	if (order.length === 0) return null;
	const PAD = 28;
	const BOX_H = 34;
	const TOP_Y = 24;
	const gaps = new Array(Math.max(0, order.length - 1)).fill(48);
	for (const ev of events) {
		if (ev.kind !== "msg" || ev.from === ev.to) continue;
		const i1 = order.indexOf(ev.from);
		const i2 = order.indexOf(ev.to);
		if (Math.abs(i1 - i2) === 1) {
			const minIdx = Math.min(i1, i2);
			const lblW = measureLabel(ev.label, 12).width + 36;
			const baseGap = (participants.get(order[minIdx]).width + participants.get(order[minIdx + 1]).width) / 2;
			gaps[minIdx] = Math.max(gaps[minIdx], lblW - baseGap + 24);
		}
	}
	let curX = PAD;
	for (let i = 0; i < order.length; i++) {
		const p = participants.get(order[i]);
		p.x = curX + p.width / 2;
		curX += p.width + (gaps[i] ?? 0);
	}
	let y = 84;
	const svgBody = [];
	const groupStack = [];
	let maxX = curX + PAD;
	for (const ev of events) {
		if (ev.kind === "groupStart") {
			groupStack.push({
				keyword: ev.keyword,
				label: ev.label,
				topY: y - 10,
				minIdx: order.length - 1,
				maxIdx: 0
			});
			y += 28;
			continue;
		}
		if (ev.kind === "groupDivider") {
			if (groupStack[groupStack.length - 1]) {
				const lx = participants.get(order[0]).x - participants.get(order[0]).width / 2 - 8;
				const rx = participants.get(order[order.length - 1]).x + participants.get(order[order.length - 1]).width / 2 + 8;
				svgBody.push(`<line x1="${lx}" y1="${y}" x2="${rx}" y2="${y}" class="lh-seq-divider" />`);
				if (ev.label) svgBody.push(`<text x="${lx + 8}" y="${y + 16}" class="lh-edge-text">[${escapeXml(ev.label)}]</text>`);
				y += 28;
			}
			continue;
		}
		if (ev.kind === "groupEnd") {
			const g = groupStack.pop();
			if (g) {
				const lx = participants.get(order[0]).x - participants.get(order[0]).width / 2 - 8;
				const rx = participants.get(order[order.length - 1]).x + participants.get(order[order.length - 1]).width / 2 + 8;
				const gh = y - g.topY + 6;
				svgBody.unshift(`<g class="lh-subgraph"><rect x="${lx}" y="${g.topY}" width="${rx - lx}" height="${gh}" rx="6" /><text x="${lx + 10}" y="${g.topY + 17}" class="lh-sg-title">${escapeXml(g.keyword + (g.label ? ` ${g.label}` : ""))}</text></g>`);
				y += 18;
			}
			continue;
		}
		if (ev.kind === "note") {
			const m = measureLabel(ev.text, 12);
			const nw = Math.max(84, m.width + 20);
			const nh = Math.max(28, m.height + 12);
			const pL = participants.get(ev.left);
			const pR = participants.get(ev.right);
			let nx;
			if (ev.placement === "left") nx = pL.x - nw - 12;
			else if (ev.placement === "right") nx = pR.x + 12;
			else nx = (pL.x + pR.x) / 2 - nw / 2;
			nx = Math.max(8, nx);
			maxX = Math.max(maxX, nx + nw + PAD);
			svgBody.push(`<g class="lh-seq-note"><rect x="${nx.toFixed(1)}" y="${y}" width="${nw.toFixed(1)}" height="${nh.toFixed(1)}" rx="5" />` + renderSvgText(nx + nw / 2, y + nh / 2, ev.text, "lh-node-text", 12) + `</g>`);
			y += nh + 18;
			continue;
		}
		if (ev.kind === "msg") {
			const x1 = participants.get(ev.from).x;
			const x2 = participants.get(ev.to).x;
			const dash = ev.dashed ? " stroke-dasharray=\"5,4\"" : "";
			if (x1 === x2) {
				const loopW = 36;
				const loopH = 26;
				const lblM = measureLabel(ev.label, 12);
				maxX = Math.max(maxX, x1 + loopW + lblM.width + PAD);
				svgBody.push(`<path d="M ${x1} ${y + 10} H ${x1 + loopW} V ${y + 10 + loopH} H ${x1}" fill="none" stroke-width="1.5"${dash} marker-end="url(#lh-arrow)" class="lh-edge" /><text x="${x1 + loopW + 8}" y="${y + 27}" class="lh-seq-msg-left">${escapeXml(ev.label)}</text>`);
				y += 52;
			} else {
				const midX = (x1 + x2) / 2;
				svgBody.push(`<line x1="${x1}" y1="${y + 18}" x2="${x2}" y2="${y + 18}" stroke-width="1.5"${dash} marker-end="url(#lh-arrow)" class="lh-edge" /><text x="${midX}" y="${y + 11}" text-anchor="middle" class="lh-node-text">${escapeXml(ev.label)}</text>`);
				y += 42;
			}
		}
	}
	const bottomY = y + 8;
	const lifelines = [];
	const boxes = [];
	for (const id of order) {
		const p = participants.get(id);
		lifelines.push(`<line x1="${p.x}" y1="58" x2="${p.x}" y2="${bottomY}" class="lh-seq-life" />`);
		const bx = p.x - p.width / 2;
		boxes.push(`<g class="lh-node"><rect x="${bx.toFixed(1)}" y="${TOP_Y}" width="${p.width.toFixed(1)}" height="${BOX_H}" rx="6" class="lh-node-shape" />${renderSvgText(p.x, 41, p.label, "lh-node-text")}</g><g class="lh-node"><rect x="${bx.toFixed(1)}" y="${bottomY}" width="${p.width.toFixed(1)}" height="${BOX_H}" rx="6" class="lh-node-shape" />${renderSvgText(p.x, bottomY + BOX_H / 2, p.label, "lh-node-text")}</g>`);
	}
	const w = Math.ceil(maxX);
	const h = Math.ceil(bottomY + BOX_H + 24);
	return {
		kind: "sequence",
		width: w,
		height: h,
		svgMarkup: buildSvgShell(w, h, [
			...lifelines,
			...svgBody,
			...boxes
		].join(""))
	};
}
function buildSvgShell(width, height, inner) {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" class="lh-mermaid-svg" role="img"><defs><marker id="lh-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M 1 1.5 L 8.5 5 L 1 8.5 z" class="lh-arrow-head" /></marker></defs>` + inner + `</svg>`;
}
/**
* Parse and render a Mermaid block into responsive inline SVG markup.
* Returns `null` when the block is empty or uses an unsupported diagram type.
*/
function parseMermaidDiagram(source) {
	const lines = preprocessLines(source);
	if (lines.length === 0) return null;
	const first = lines[0];
	if (/^(?:flowchart|graph)\b/i.test(first)) return parseFlowchart(lines);
	if (/^sequenceDiagram\b/i.test(first)) return parseSequenceDiagram(lines);
	if (/^stateDiagram(?:-v2)?\b/i.test(first)) return parseStateDiagram(lines);
	return null;
}
//#endregion
//#region src/client/MermaidFence.module.css
var MermaidFence_module_default = {
	"actions": "yoq9BG_actions",
	"badge": "yoq9BG_badge",
	"btn": "yoq9BG_btn",
	"btnActive": "yoq9BG_btnActive",
	"canvasWrap": "yoq9BG_canvasWrap",
	"card": "yoq9BG_card",
	"codeWrap": "yoq9BG_codeWrap",
	"dialog": "yoq9BG_dialog",
	"modalHeader": "yoq9BG_modalHeader",
	"modalSvg": "yoq9BG_modalSvg",
	"overlay": "yoq9BG_overlay",
	"tabs": "yoq9BG_tabs",
	"toolbar": "yoq9BG_toolbar"
};
//#endregion
//#region src/client/MermaidFence.tsx
function labelFor(t, key, fallback) {
	if (typeof t === "function") {
		const out = t(key);
		if (typeof out === "string" && out !== "") return out;
	}
	return fallback;
}
/**
* Render Mermaid fences as interactive inline SVG diagrams inside DSH chat,
* falling back seamlessly to DSH's native code block while streaming or on
* unsupported diagram types.
*/
function MermaidFence({ code, streaming, children, t }) {
	const [view, setView] = (0, react.useState)("graph");
	const [zoomed, setZoomed] = (0, react.useState)(false);
	const [copied, setCopied] = (0, react.useState)(false);
	const diagram = (0, react.useMemo)(() => streaming ? null : parseMermaidDiagram(code), [code, streaming]);
	(0, react.useEffect)(() => {
		if (!zoomed) return;
		const onKeyDown = (event) => {
			if (event.key === "Escape") setZoomed(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [zoomed]);
	if (streaming || diagram === null) return children ?? null;
	const copyCode = () => {
		navigator.clipboard?.writeText?.(code).then(() => {
			setCopied(true);
			setTimeout(() => {
				setCopied(false);
			}, 1600);
		}).catch(() => {});
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: MermaidFence_module_default.card,
		"data-liangheng-mermaid": diagram.kind,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: MermaidFence_module_default.toolbar,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: MermaidFence_module_default.badge,
					children: `mermaid · ${diagram.kind}`
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: MermaidFence_module_default.actions,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: MermaidFence_module_default.tabs,
							role: "tablist",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": view === "graph",
								className: `${MermaidFence_module_default.btn} ${view === "graph" ? MermaidFence_module_default.btnActive : ""}`,
								onClick: () => {
									setView("graph");
								},
								children: labelFor(t, "diagram.graph", "图表")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": view === "code",
								className: `${MermaidFence_module_default.btn} ${view === "code" ? MermaidFence_module_default.btnActive : ""}`,
								onClick: () => {
									setView("code");
								},
								children: labelFor(t, "diagram.code", "源码")
							})]
						}),
						view === "graph" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: MermaidFence_module_default.btn,
							onClick: () => {
								setZoomed(true);
							},
							children: labelFor(t, "diagram.zoom", "放大预览")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: MermaidFence_module_default.btn,
							onClick: copyCode,
							children: copied ? labelFor(t, "diagram.copied", "已复制") : labelFor(t, "diagram.copy", "复制")
						})
					]
				})]
			}),
			view === "graph" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: MermaidFence_module_default.canvasWrap,
				role: "button",
				tabIndex: 0,
				"aria-label": labelFor(t, "diagram.zoom", "放大预览"),
				onClick: () => {
					setZoomed(true);
				},
				onKeyDown: (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						setZoomed(true);
					}
				},
				dangerouslySetInnerHTML: { __html: diagram.svgMarkup }
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: MermaidFence_module_default.codeWrap,
				children
			}),
			zoomed && typeof document !== "undefined" && (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: MermaidFence_module_default.overlay,
				role: "dialog",
				"aria-modal": "true",
				onClick: (event) => {
					if (event.target === event.currentTarget) setZoomed(false);
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: MermaidFence_module_default.dialog,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: MermaidFence_module_default.modalHeader,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: MermaidFence_module_default.badge,
							children: `mermaid · ${diagram.kind}`
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: MermaidFence_module_default.btn,
							onClick: () => {
								setZoomed(false);
							},
							children: labelFor(t, "diagram.close", "关闭预览")
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: MermaidFence_module_default.modalSvg,
						dangerouslySetInnerHTML: { __html: diagram.svgMarkup }
					})]
				})
			}), document.body)
		]
	});
}
//#endregion
//#region src/client/plugin-card-seat.ts
/**
* Family plugin-card seat.
*
* A family plugin contributes its settings card to whichever plugin-card seat
* the running host actually renders:
*
* - `web-ui.plugin.item` — the list seat declared by the dsh-web-settings
*   group section (this family's own first-level "Web UI plugins" section);
* - `plugins.bundle.config` — the official keyed seat of the harness's plugin
*   manager page, keyed by the bundle's package name and rendered on that
*   bundle's page. alpha.2 removed the `settings.plugin.item` keyed seat of the
*   `ui-settings-plugins` tab that this helper used before, so a card keyed by
*   its settings namespace has no seat to land in any more.
*
* SEAT SELECTION IS NOT A DECLARATION PROBE. The official plugin surface
* belongs to the harness bundle and declares its seats before any external
* plugin's `apply()` runs, so "is the official seat declared?" answers yes even
* in the deployment whose whole point is the family group. Choosing on that
* probe sends every family card to the official page and leaves the group's own
* section permanently empty — the family of reports where the section renders
* its heading and zero cards.
*
* The signal that actually distinguishes the two deployments is whether
* dsh-web-settings is loaded: it is the package that owns the group section and
* it publishes the `webUiSettings` service during `apply()`, which every
* family plugin already reads for its settings form. Group loaded -> the family
* seat; group absent -> the official seat.
*
* The decision is re-evaluated on every `slots/changed` because the group may
* apply after this plugin (the family aggregate orders it first, a profile that
* installs the group separately need not): the initial contribution goes to the
* official seat, then moves to the family seat the moment the group's section
* registers. The entry is disposed before the replacement is registered, so a
* card is never in two seats at once.
*
* The shared tree has no client-SDK dependency, so this module reads its
* context through the structural shape below; callers pass the plugin's own
* `ctx`.
*/
/** The family list seat key. */
const FAMILY_PLUGIN_CARD_SEAT = "web-ui.plugin.item";
/** The official keyed plugin-card seat key (the alpha.2 bundle-configuration seat). */
const OFFICIAL_PLUGIN_CARD_SEAT = "plugins.bundle.config";
/** The service dsh-web-settings publishes while it is loaded. */
const FAMILY_GROUP_SERVICE = "webUiSettings";
/**
* Whether the family group (dsh-web-settings) is loaded in this page. The
* service is the group package's own contract, so the probe cannot be fooled
* by a harness release that starts declaring the official seat differently.
*/
function familyGroupLoaded(ctx) {
	const get = ctx.get;
	if (typeof get !== "function") return false;
	try {
		return get.call(ctx, FAMILY_GROUP_SERVICE) !== void 0;
	} catch {
		return false;
	}
}
/** Report a refused registration instead of leaving the user with no card. */
function warnRefusedSeat(seat, error) {
	try {
		console.warn(`[dsh-web] plugin card registration into "${seat}" was refused; the card will not render`, error);
	} catch {}
}
/**
* Contribute one family plugin card to the seat this host renders, following
* the group if it loads later. The entry is disposed and re-registered on a
* seat change, never duplicated.
* @param ctx - client context (its slot registry decides the seat).
* @param seat - the card contribution.
*/
function installPluginCard(ctx, seat) {
	const slots = ctx.slots;
	const component = seat.component;
	const inject = seat.inject;
	let dispose;
	let current;
	/**
	* Re-entrancy latch. The registry emits a change event synchronously from
	* inside both `register` and the previous entry's disposer, so an unguarded
	* reconcile would re-enter itself mid-move and register the card twice into
	* the seat it is leaving ("already has an entry for key ...").
	*/
	let reconciling = false;
	/** Reconcile the contribution with the currently live seat (no-op when unchanged). */
	const reconcile = () => {
		if (reconciling) return;
		const target = familyGroupLoaded(ctx) ? FAMILY_PLUGIN_CARD_SEAT : OFFICIAL_PLUGIN_CARD_SEAT;
		if (current === target) return;
		if (typeof slots.spec === "function" && slots.spec(target) === void 0) return;
		reconciling = true;
		const previous = dispose;
		dispose = void 0;
		current = void 0;
		previous?.();
		try {
			dispose = slots.register(target === "web-ui.plugin.item" ? {
				name: FAMILY_PLUGIN_CARD_SEAT,
				id: seat.id,
				...seat.order === void 0 ? {} : { order: seat.order },
				...seat.label === void 0 ? {} : { label: seat.label },
				locale: seat.locale,
				...seat.children === void 0 ? {} : { children: seat.children },
				...seat.inject === void 0 ? {} : { inject }
			} : {
				name: OFFICIAL_PLUGIN_CARD_SEAT,
				key: seat.bundle,
				locale: seat.locale,
				...seat.children === void 0 ? {} : { children: seat.children },
				...seat.inject === void 0 ? {} : { inject }
			}, component);
			current = target;
		} catch (error) {
			warnRefusedSeat(target, error);
		} finally {
			reconciling = false;
		}
	};
	if (typeof ctx.on === "function") try {
		ctx.on("slots/changed", (() => {
			reconcile();
		}));
	} catch {}
	reconcile();
}
//#endregion
//#region src/client/settings-entry-form.ts
/** The snapshot a form reports before the Host has answered with this entry. */
function pendingSnapshot() {
	return {
		status: "loading",
		value: void 0,
		base: void 0,
		user: void 0,
		revision: void 0,
		writable: false
	};
}
/**
* Create a settings form bound to the profile entry id this Host serves, and
* rebound whenever the shared describe mirror names a different one of this
* package's rows.
* @param options - the shared forms service and this package's candidate row ids.
* @returns a form delegating to the currently resolved entry's own form.
*/
function createServedEntryForm(options) {
	const { forms, entryIds } = options;
	const fallbackId = entryIds[0];
	const namespaceId = entryIds[entryIds.length - 1];
	const listeners = /* @__PURE__ */ new Set();
	let boundId;
	let bound;
	let offBound;
	let snapshot = pendingSnapshot();
	/** Republish: the delegated snapshot when one is bound, the pending one otherwise. */
	const publish = () => {
		if (bound !== void 0) snapshot = bound.getSnapshot();
		for (const listener of [...listeners]) listener();
	};
	/**
	* The entry id the mirror currently justifies. An unanswered or empty mirror
	* is not evidence of absence, so it keeps the first candidate; a mirror that
	* answers without any of this package's rows leaves the namespace itself.
	* @returns the entry id to bind.
	*/
	const resolve = () => {
		let served;
		try {
			served = forms.describe().getSnapshot().view?.namespaces.map((row) => row.ns);
		} catch {
			served = void 0;
		}
		if (served === void 0 || served.length === 0) return fallbackId;
		return entryIds.find((id) => served.includes(id)) ?? namespaceId;
	};
	/** Bind (or rebind) the resolved entry's form; a no-op while it is unchanged. */
	const bind = () => {
		const target = resolve();
		if (target === boundId) return;
		offBound?.();
		offBound = void 0;
		let form;
		try {
			form = forms.get(target);
		} catch {
			boundId = void 0;
			return;
		}
		boundId = target;
		bound = form;
		offBound = form.subscribe(() => {
			publish();
		});
		publish();
	};
	try {
		forms.describe().subscribe(() => {
			bind();
		});
	} catch {}
	bind();
	return {
		getSnapshot: () => snapshot,
		subscribe: (listener) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		set: (field, value) => bound?.set(field, value) ?? Promise.resolve(false),
		unset: (field) => bound?.unset(field) ?? Promise.resolve(false),
		mutate: (ops, expectedRevision) => bound?.mutate(ops, expectedRevision) ?? Promise.resolve(false)
	};
}
//#endregion
//#region src/client/index.ts
/** Locale namespace this half owns. */
const NS = "liangheng";
/**
* Settings namespace the settings card edits: the family identity of this
* plugin's own settings form, and the row id a standalone bundle install
* carries.
*/
const SETTINGS_NAMESPACE = "liangheng";
/**
* Profile entry id the family aggregate's generated row carries.
*/
const AGGREGATE_ENTRY_ID = "web-ui-liangheng";
/** Profile entry ids this package's patch rows carry, most specific first. */
const LIANGHENG_ENTRY_IDS = [
	AGGREGATE_ENTRY_ID,
	"ui-liangheng",
	SETTINGS_NAMESPACE
];
/**
* The profile entry id this package's own row carries, for a page that serves
* no family binder.
*
* The shared describe mirror is the only local evidence of which row id this
* profile actually serves, but it answers asynchronously: at plugin activation
* it usually holds nothing yet. An unanswered or empty mirror is therefore NOT
* evidence of absence, and binding the bare namespace there is what made every
* save fail with `No configurable plugin entry "liangshen"` — the form is
* bound once per session, so a wrong guess never recovers. The aggregate row id
* is the answer that matches nearly every deployment; only a mirror that
* answers with OTHER plugins' rows keeps the namespace as the last resort (the
* pre-0.1.7 keying shape), because that answer is the one that actually proves
* this package's own row is not served.
* @param forms - the shared configuration forms service.
* @returns the entry id to bind.
*/
function servedEntryId(forms) {
	let served;
	try {
		served = forms.describe().getSnapshot().view?.namespaces.map((view) => view.ns);
	} catch {
		served = void 0;
	}
	if (served === void 0 || served.length === 0) return AGGREGATE_ENTRY_ID;
	return LIANGHENG_ENTRY_IDS.find((id) => served.includes(id)) ?? "liangheng";
}
/**
* Bind the settings form the card stages over.
*
* The family binder comes first: it is what resolves this package's family
* namespace onto the profile entry id the Host serves the form under, and it
* keeps the loopback bridge as its own fallback. A page without that group (or
* one where its client half has not applied yet) binds through the shared forms
* service, on the entry id the describe mirror justifies and rebound as soon as
* the mirror answers — see {@link createServedEntryForm} for why a one-shot
* guess cannot be right for both an aggregate and a standalone install.
* @param ctx - the browser plugin context.
* @returns the form the settings card reads and writes.
*/
function bindSettingsForm(ctx) {
	const binder = ctx.get("webUiSettings");
	if (binder !== void 0 && typeof binder.bind === "function") return binder.bind({ namespace: SETTINGS_NAMESPACE });
	return createServedEntryForm({
		forms: ctx.configForms,
		entryIds: LIANGHENG_ENTRY_IDS
	});
}
/**
* Required client services: the slot registry, locale, sessions, the shared
* configuration forms, and the roster Remote. Both `remote` and
* `remote.agentPresets` are declared: the context proxy refuses an uninjected
* service, and a nested service name does not imply its parent, so reading
* `ctx.remote.agentPresets` needs `remote` as well.
*/
const inject = [
	"slots",
	"locale",
	"sessions",
	"configForms",
	"remote",
	"remote.agentPresets"
];
/**
* Mount the lever: register the copy, follow the roster and the current
* session, and claim the composer tool row.
* @param ctx - the browser plugin context.
*/
function apply(ctx) {
	ctx.effect(() => {
		try {
			return ctx.locale.register(NS, {
				zh,
				en
			});
		} catch {
			return () => {};
		}
	}, "liangheng: lever dictionaries");
	const controller = new LeverController(ctx);
	ctx.effect(() => () => controller.dispose(), "liangheng: lever controller");
	try {
		controller.start();
	} catch {}
	try {
		const settingsCard = new LiangShenSettingsCardController(bindSettingsForm(ctx));
		installPluginCard(ctx, {
			bundle: "dsh-liangheng",
			id: "liangheng",
			order: 125,
			locale: NS,
			inject: () => settingsCard.inject(),
			component: LiangShenSettingsCard
		});
		ctx.effect(() => () => {
			settingsCard.dispose();
		}, "liangheng: settings card");
	} catch {}
	ctx.slots.inject("conversation.input.right", () => {
		try {
			const unregister = ctx.slots.register({
				name: "conversation.input.right",
				id: "liangheng-lever",
				order: 21,
				inject: () => controller.face()
			}, LiangShenLever);
			return () => {
				unregister();
			};
		} catch {
			return () => {};
		}
	});
	ctx.slots.inject("conversation.chat.markdown.fence", () => {
		try {
			const unregister = ctx.slots.register({
				name: "conversation.chat.markdown.fence",
				key: "mermaid",
				id: "dsh-liangheng/fence/mermaid",
				locale: NS
			}, MermaidFence);
			return () => {
				unregister();
			};
		} catch {
			return () => {};
		}
	});
	ctx.effect(() => {
		if (typeof document === "undefined") return () => {};
		const root = document.documentElement;
		const sessionList = (() => {
			try {
				return ctx.sessions?.list;
			} catch {
				return;
			}
		})();
		const syncChatAttribute = () => {
			try {
				const byId = sessionList?.getSnapshot?.()?.byId;
				const activeId = mainViewSessionId(byId);
				if ((activeId !== void 0 ? byId?.[activeId]?.projectionValues?.["agentPreset"] : void 0) === "liangheng") root.dataset.lianghengChat = "on";
				else delete root.dataset.lianghengChat;
			} catch {
				delete root.dataset.lianghengChat;
			}
		};
		syncChatAttribute();
		let unsubscribe;
		try {
			unsubscribe = sessionList?.subscribe?.(syncChatAttribute);
		} catch {
			unsubscribe = void 0;
		}
		return () => {
			unsubscribe?.();
			delete root.dataset.lianghengChat;
		};
	}, "liangheng: chat visual polish marker");
}
//#endregion
exports.LIANGHENG_PRESET_ID = LIANGHENG_PRESET_ID;
exports.LIANGSHEN_PRESET_ID = LIANGSHEN_PRESET_ID;
exports.LeverController = LeverController;
exports.LiangShenLever = LiangShenLever;
exports.NS = NS;
exports.SETTINGS_NAMESPACE = SETTINGS_NAMESPACE;
exports.apply = apply;
exports.bindSettingsForm = bindSettingsForm;
exports.inject = inject;
exports.leverState = leverState;
exports.restoreTarget = restoreTarget;
exports.servedEntryId = servedEntryId;


{
  const css = ".z1xI9W_lever {\n  align-items: center;\n  font-size: 12px;\n  line-height: 1;\n  display: inline-flex;\n  position: relative;\n}\n\n.z1xI9W_control {\n  color: var(--dsw-alias-label-secondary, inherit);\n  font: inherit;\n  cursor: pointer;\n  touch-action: none;\n  -webkit-user-select: none;\n  user-select: none;\n  background: none;\n  border: none;\n  border-radius: 999px;\n  align-items: center;\n  gap: 6px;\n  margin: 0;\n  padding: 2px 8px 2px 4px;\n  transition: background-color .16s, color .16s;\n  display: inline-flex;\n}\n\n.z1xI9W_control:hover:not(:disabled) {\n  background: var(--dsw-alias-interactive-bg-hover, #0000000f);\n}\n\n.z1xI9W_control:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary, currentColor);\n  outline-offset: 2px;\n}\n\n.z1xI9W_control:disabled {\n  cursor: default;\n  opacity: .55;\n}\n\n.z1xI9W_track {\n  background: linear-gradient(#2b2f36, #14161a);\n  border-radius: 8px;\n  justify-content: center;\n  align-items: flex-end;\n  width: 24px;\n  height: 28px;\n  display: inline-flex;\n  position: relative;\n  overflow: hidden;\n  box-shadow: inset 0 0 0 1px #ffffff24, inset 0 6px 10px #0000008c;\n}\n\n.z1xI9W_track:after {\n  content: \"\";\n  background: #ffffff38;\n  border-radius: 2px;\n  height: 3px;\n  position: absolute;\n  bottom: 2px;\n  left: 3px;\n  right: 3px;\n}\n\n.z1xI9W_arm {\n  transform-origin: 50% 24px;\n  width: 16px;\n  height: 26px;\n  margin-left: -8px;\n  transition: transform .34s cubic-bezier(.2, 1.7, .32, 1);\n  position: absolute;\n  bottom: 2px;\n  left: 50%;\n  transform: rotate(-24deg);\n}\n\n.z1xI9W_lever[data-state=\"on\"] .z1xI9W_arm {\n  transform: rotate(24deg);\n}\n\n.z1xI9W_rod {\n  fill: #c9ced6;\n  transition: fill .2s;\n}\n\n.z1xI9W_knob {\n  fill: #e04a33;\n  stroke: #00000059;\n  stroke-width: .6px;\n  transition: fill .2s;\n}\n\n.z1xI9W_lever[data-state=\"on\"] .z1xI9W_rod {\n  fill: #ffd76a;\n}\n\n.z1xI9W_lever[data-state=\"on\"] .z1xI9W_knob {\n  fill: #f7c637;\n}\n\n.z1xI9W_lever[data-state=\"on\"] .z1xI9W_track {\n  box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l3, #0000001f),\n    0 0 10px #f7c6378c;\n}\n\n.z1xI9W_lever[data-busy=\"true\"] .z1xI9W_arm {\n  animation: .42s ease-in-out infinite z1xI9W_lever-jitter;\n}\n\n.z1xI9W_readout {\n  white-space: nowrap;\n  letter-spacing: .02em;\n  min-width: 3em;\n}\n\n.z1xI9W_lever[data-state=\"on\"] .z1xI9W_readout {\n  color: var(--dsw-alias-label-primary, inherit);\n  font-weight: 600;\n}\n\n.z1xI9W_error {\n  background: var(--dsw-alias-bg-layer-3, #0000000f);\n  max-width: 22ch;\n  color: var(--dsw-alias-state-error-primary, #c0392b);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  border-radius: 6px;\n  margin-left: 4px;\n  padding: 2px 6px;\n  overflow: hidden;\n}\n\n.z1xI9W_burst {\n  z-index: 60;\n  pointer-events: none;\n  place-items: center;\n  display: grid;\n  position: fixed;\n  inset: 0;\n  overflow: hidden;\n}\n\n.z1xI9W_flash {\n  background: radial-gradient(circle at 50% 62%, #fff6c8eb, #ffd04a73 38%, #ffa00000 72%);\n  animation: .72s ease-out both z1xI9W_burst-flash;\n  position: absolute;\n  inset: 0;\n}\n\n.z1xI9W_ring {\n  border: 6px solid #ffd65ad9;\n  border-radius: 50%;\n  width: 220px;\n  height: 220px;\n  animation: 1.1s cubic-bezier(.16, .9, .3, 1) both z1xI9W_burst-ring;\n  position: absolute;\n}\n\n.z1xI9W_ring:nth-of-type(2) {\n  animation-delay: .12s;\n}\n\n.z1xI9W_ring:nth-of-type(3) {\n  animation-delay: .24s;\n}\n\n.z1xI9W_banner {\n  color: #ffe9a8;\n  text-align: center;\n  background: linear-gradient(160deg, #181004f0, #402604eb);\n  border-radius: 22px;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  padding: 22px 40px;\n  animation: .6s cubic-bezier(.16, 1.5, .3, 1) both z1xI9W_banner-slam, .5s ease-in-out .6s 2 z1xI9W_banner-shake;\n  display: flex;\n  position: relative;\n  box-shadow: 0 0 0 2px #ffd65abf, 0 24px 70px #00000073;\n}\n\n.z1xI9W_bannerName {\n  letter-spacing: .16em;\n  background: linear-gradient(#fff6d0, #ffc93c 55%, #b8730a);\n  color: #0000;\n  text-shadow: 0 0 24px #ffc93ca6;\n  -webkit-background-clip: text;\n  background-clip: text;\n  font-size: 44px;\n  font-weight: 800;\n}\n\n.z1xI9W_line {\n  letter-spacing: .08em;\n  font-size: 15px;\n}\n\n.z1xI9W_code {\n  font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);\n  letter-spacing: .06em;\n  opacity: .82;\n  font-size: 11px;\n  animation: .5s steps(2, end) 6 z1xI9W_code-blink;\n}\n\n.z1xI9W_sparks {\n  place-items: center;\n  display: grid;\n  position: absolute;\n  inset: 0;\n}\n\n.z1xI9W_spark {\n  transform-origin: 50%;\n  background: linear-gradient(#ffeca0f2, #ffaa1400);\n  border-radius: 3px;\n  grid-area: 1 / 1;\n  width: 3px;\n  height: 30px;\n  animation: .95s ease-out both z1xI9W_spark-fly;\n}\n\n@keyframes z1xI9W_lever-jitter {\n  0%, 100% {\n    transform: rotate(-22deg);\n  }\n\n  50% {\n    transform: rotate(-8deg);\n  }\n}\n\n@keyframes z1xI9W_burst-flash {\n  0% {\n    opacity: 0;\n    transform: scale(.6);\n  }\n\n  18% {\n    opacity: 1;\n  }\n\n  100% {\n    opacity: 0;\n    transform: scale(1.5);\n  }\n}\n\n@keyframes z1xI9W_burst-ring {\n  0% {\n    opacity: .9;\n    transform: scale(.2);\n  }\n\n  100% {\n    opacity: 0;\n    transform: scale(3.4);\n  }\n}\n\n@keyframes z1xI9W_banner-slam {\n  0% {\n    opacity: 0;\n    transform: scale(3.6) rotate(-9deg);\n  }\n\n  55% {\n    opacity: 1;\n    transform: scale(.94) rotate(1.5deg);\n  }\n\n  75% {\n    transform: scale(1.06) rotate(-1deg);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale(1) rotate(0);\n  }\n}\n\n@keyframes z1xI9W_banner-shake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n\n  25% {\n    transform: translateX(-9px) rotate(-.6deg);\n  }\n\n  75% {\n    transform: translateX(9px) rotate(.6deg);\n  }\n}\n\n@keyframes z1xI9W_spark-fly {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px) scaleY(.3);\n  }\n\n  18% {\n    opacity: 1;\n  }\n\n  100% {\n    opacity: 0;\n    transform: translateY(-300px) scaleY(1.15);\n  }\n}\n\n@keyframes z1xI9W_code-blink {\n  0%, 100% {\n    opacity: .35;\n  }\n\n  50% {\n    opacity: 1;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .z1xI9W_arm, .z1xI9W_control, .z1xI9W_rod, .z1xI9W_knob {\n    transition: none;\n  }\n\n  .z1xI9W_lever[data-busy=\"true\"] .z1xI9W_arm, .z1xI9W_flash, .z1xI9W_ring, .z1xI9W_banner, .z1xI9W_code, .z1xI9W_spark {\n    animation: none;\n  }\n\n  .z1xI9W_burst {\n    animation: .3s ease-out both z1xI9W_burst-flash;\n  }\n\n  .z1xI9W_spark {\n    display: none;\n  }\n}\n._3KtWIa_card {\n  --settings-card-radius: 12px;\n  --settings-card-header-pad: 16px;\n  --settings-card-header-gap: 13px;\n  --settings-card-title-size: 15px;\n  --settings-card-description-size: 13px;\n  --settings-card-body-inset: 16px;\n  --settings-card-motion: .18s;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-3);\n  border-radius: var(--settings-card-radius);\n  list-style: none;\n  transition: border-color .16s, background .16s;\n}\n\n._3KtWIa_card:hover {\n  border-color: var(--dsw-alias-label-dimmed);\n}\n\n._3KtWIa_cardOpen {\n  background: var(--dsw-alias-bg-layer-2);\n  border-color: var(--dsw-alias-label-dimmed);\n}\n\n._3KtWIa_cardNested {\n  --settings-card-radius: 10px;\n  --settings-card-header-pad: 10px 12px;\n  --settings-card-header-gap: 10px;\n  --settings-card-title-size: 13px;\n  --settings-card-description-size: 12px;\n  --settings-card-body-inset: 12px;\n}\n\n._3KtWIa_cardNested ._3KtWIa_description {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n\n._3KtWIa_header {\n  appearance: none;\n  box-sizing: border-box;\n  width: 100%;\n  font: inherit;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  border-radius: var(--settings-card-radius);\n  align-items: center;\n  gap: var(--settings-card-header-gap);\n  padding: var(--settings-card-header-pad);\n  background: none;\n  border: 0;\n  display: flex;\n}\n\n._3KtWIa_header:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: -2px;\n}\n\n._3KtWIa_headerStatic {\n  box-sizing: border-box;\n  border-radius: var(--settings-card-radius);\n  align-items: center;\n  gap: var(--settings-card-header-gap);\n  width: 100%;\n  padding: var(--settings-card-header-pad);\n  display: flex;\n}\n\n._3KtWIa_headText {\n  flex-direction: column;\n  flex: 1;\n  gap: 4px;\n  min-width: 0;\n  display: flex;\n}\n\n._3KtWIa_mark {\n  background: var(--dsw-alias-bg-module-platform);\n  width: 34px;\n  height: 34px;\n  color: var(--dsw-alias-label-secondary);\n  border-radius: 10px;\n  flex: none;\n  place-items: center;\n  transition: color .16s;\n  display: grid;\n}\n\n._3KtWIa_header:hover ._3KtWIa_mark, ._3KtWIa_cardOpen ._3KtWIa_mark {\n  color: var(--dsw-alias-label-primary);\n}\n\n._3KtWIa_name {\n  color: var(--dsw-alias-label-primary);\n  font-size: var(--settings-card-title-size);\n  font-weight: 600;\n  line-height: 1.4;\n}\n\n._3KtWIa_description {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._3KtWIa_headerAction {\n  flex: none;\n  align-items: center;\n  display: inline-flex;\n}\n\n._3KtWIa_chevron {\n  color: var(--dsw-alias-label-tertiary);\n  flex: none;\n  width: 16px;\n  height: 16px;\n  transition: transform .16s, color .16s;\n}\n\n._3KtWIa_header:hover ._3KtWIa_chevron {\n  color: var(--dsw-alias-label-secondary);\n}\n\n._3KtWIa_chevronOpen {\n  transform: rotate(180deg);\n}\n\n._3KtWIa_disclosure {\n  opacity: 0;\n  transition: grid-template-rows var(--settings-card-motion) ease, opacity var(--settings-card-motion) ease;\n  grid-template-rows: 0fr;\n  display: grid;\n}\n\n._3KtWIa_disclosure[data-state=\"collapsed\"], ._3KtWIa_disclosure[data-state=\"entering\"], ._3KtWIa_disclosure[data-state=\"closing\"] {\n  overflow: hidden;\n}\n\n._3KtWIa_disclosure[data-state=\"entering\"], ._3KtWIa_disclosure[data-state=\"shown\"] {\n  opacity: 1;\n  grid-template-rows: 1fr;\n}\n\n._3KtWIa_disclosure > ._3KtWIa_body {\n  min-height: 0;\n}\n\n._3KtWIa_body {\n  border-top: 1px solid var(--dsw-alias-border-l2);\n  margin: 0 var(--settings-card-body-inset);\n  padding-bottom: 8px;\n  container: _3KtWIa_settings-card / inline-size;\n}\n\n._3KtWIa_readOnly {\n  color: var(--dsw-alias-label-secondary);\n  margin: 12px 0 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n._3KtWIa_notExposed {\n  color: var(--dsw-alias-state-warn-primary);\n  margin: 12px 0 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n._3KtWIa_failed {\n  color: var(--dsw-alias-state-error-primary, #b42318);\n  overflow-wrap: anywhere;\n  margin: 8px 0 4px;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._3KtWIa_field {\n  grid-template-columns: minmax(0, 1fr) fit-content(50%);\n  grid-template-areas: \"_3KtWIa_head _3KtWIa_control\"\n                       \"_3KtWIa_hint _3KtWIa_control\";\n  align-items: center;\n  gap: 4px 24px;\n  padding: 16px 0;\n  display: grid;\n}\n\n._3KtWIa_field > ._3KtWIa_head {\n  grid-area: _3KtWIa_head;\n}\n\n._3KtWIa_field > :is(._3KtWIa_hint, ._3KtWIa_invalid) {\n  grid-area: _3KtWIa_hint;\n}\n\n._3KtWIa_field > :not(._3KtWIa_head, ._3KtWIa_hint, ._3KtWIa_invalid) {\n  grid-area: _3KtWIa_control;\n  justify-self: end;\n  max-width: 100%;\n}\n\n._3KtWIa_field + ._3KtWIa_field {\n  border-top: 1px solid var(--dsw-alias-border-l2);\n}\n\n._3KtWIa_head {\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n\n._3KtWIa_label {\n  min-width: 0;\n  color: var(--dsw-alias-label-primary);\n  flex: 1;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 22px;\n}\n\n._3KtWIa_badges {\n  align-items: center;\n  gap: 8px;\n  display: inline-flex;\n}\n\n._3KtWIa_badge {\n  white-space: nowrap;\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-label-secondary);\n  border-radius: 999px;\n  padding: 1px 8px;\n  font-size: 11px;\n  font-weight: 500;\n  line-height: 17px;\n}\n\n._3KtWIa_reset {\n  font: inherit;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  background: none;\n  border: none;\n  padding: 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n._3KtWIa_reset:hover:not(:disabled) {\n  color: var(--dsw-alias-label-primary);\n}\n\n._3KtWIa_reset:disabled {\n  cursor: default;\n}\n\n._3KtWIa_reset:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: 2px;\n}\n\n._3KtWIa_segmentGroup {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 7%, transparent);\n  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent);\n  border-radius: 8px;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 2px;\n  padding: 2px;\n  display: inline-flex;\n  position: relative;\n}\n\n._3KtWIa_segment {\n  appearance: none;\n  color: var(--dsw-alias-label-secondary);\n  font: inherit;\n  white-space: nowrap;\n  cursor: pointer;\n  background: none;\n  border: 0;\n  border-radius: 7px;\n  margin: 0;\n  padding: 3px 12px;\n  font-size: 13px;\n  font-weight: 500;\n  line-height: 18px;\n  transition: background-color .12s, color .12s;\n}\n\n._3KtWIa_segment:hover:not(:disabled):not([data-active]) {\n  color: var(--dsw-alias-label-primary);\n}\n\n._3KtWIa_segmentGroup:not([data-pill]) > ._3KtWIa_segment[data-active], ._3KtWIa_segmentGroup[data-pill]:before {\n  background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-3));\n  box-shadow: 0 1px 2px #14141314;\n}\n\nbody[data-ds-dark-theme] ._3KtWIa_segmentGroup:not([data-pill]) > ._3KtWIa_segment[data-active], body[data-ds-dark-theme] ._3KtWIa_segmentGroup[data-pill]:before {\n  box-shadow: none;\n  background: #ffffff24;\n}\n\n._3KtWIa_segment[data-active] {\n  color: var(--dsw-alias-label-primary);\n}\n\n._3KtWIa_segmentGroup[data-pill]:before {\n  content: \"\";\n  width: var(--segment-pill-w, 0px);\n  height: var(--segment-pill-h, 0px);\n  transform: translate(var(--segment-pill-x, 0px), var(--segment-pill-y, 0px));\n  pointer-events: none;\n  border-radius: 7px;\n  transition: transform .24s cubic-bezier(.22, .61, .36, 1), width .24s cubic-bezier(.22, .61, .36, 1), height .24s cubic-bezier(.22, .61, .36, 1);\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n._3KtWIa_segmentGroup > * {\n  z-index: 1;\n  position: relative;\n}\n\n._3KtWIa_segment:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: 1px;\n}\n\n._3KtWIa_segment:disabled {\n  cursor: not-allowed;\n  opacity: .45;\n}\n\n._3KtWIa_segmentGroup[data-pill]:has( > ._3KtWIa_segment:disabled):before {\n  opacity: .45;\n}\n\n._3KtWIa_input, ._3KtWIa_select {\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-3);\n  height: 34px;\n  font: inherit;\n  color: var(--dsw-alias-label-primary);\n  border-radius: 8px;\n  padding: 0 12px;\n  font-size: 13px;\n  line-height: 1.5;\n}\n\n._3KtWIa_input:focus-visible, ._3KtWIa_select:focus-visible {\n  border-color: var(--dsw-alias-brand-primary);\n  outline: none;\n}\n\n._3KtWIa_input:disabled, ._3KtWIa_select:disabled {\n  color: var(--dsw-alias-label-tertiary);\n  cursor: default;\n}\n\n._3KtWIa_inputInvalid {\n  border: 1px solid var(--dsw-alias-state-error-primary, #b42318);\n  background: var(--dsw-alias-bg-layer-3);\n  height: 34px;\n  font: inherit;\n  color: var(--dsw-alias-label-primary);\n  border-radius: 8px;\n  padding: 0 12px;\n  font-size: 13px;\n  line-height: 1.5;\n}\n\n._3KtWIa_inputInvalid:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-error-primary, #b42318);\n  outline-offset: 1px;\n  border-color: var(--dsw-alias-state-error-primary, #b42318);\n}\n\n._3KtWIa_field > :is(._3KtWIa_input, ._3KtWIa_inputInvalid, ._3KtWIa_select, ._3KtWIa_selectWrap, ._3KtWIa_rangeAnchor) {\n  box-sizing: border-box;\n  width: 220px;\n}\n\n._3KtWIa_rangeAnchor > :is(._3KtWIa_input, ._3KtWIa_inputInvalid) {\n  box-sizing: border-box;\n  width: 100%;\n}\n\n@container _3KtWIa_settings-card (width <= 440px) {\n  ._3KtWIa_field {\n    grid-template-columns: minmax(0, 1fr);\n    grid-template-areas: \"_3KtWIa_head\"\n                         \"_3KtWIa_hint\"\n                         \"_3KtWIa_control\";\n    row-gap: 8px;\n  }\n\n  ._3KtWIa_field > :not(._3KtWIa_head, ._3KtWIa_hint, ._3KtWIa_invalid) {\n    justify-self: start;\n  }\n\n  ._3KtWIa_field > :is(._3KtWIa_input, ._3KtWIa_inputInvalid, ._3KtWIa_select, ._3KtWIa_selectWrap, ._3KtWIa_rangeAnchor) {\n    justify-self: stretch;\n    width: auto;\n  }\n}\n\n._3KtWIa_selectWrap {\n  position: relative;\n}\n\n._3KtWIa_selectButton {\n  appearance: none;\n  text-align: left;\n  cursor: pointer;\n  justify-content: space-between;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  display: flex;\n}\n\n._3KtWIa_selectLabel {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  overflow: hidden;\n}\n\n._3KtWIa_selectChevron {\n  color: var(--dsw-alias-label-tertiary);\n  flex: none;\n  transition: transform .16s;\n}\n\n._3KtWIa_selectChevronOpen {\n  transform: rotate(180deg);\n}\n\n._3KtWIa_selectPopup {\n  z-index: 40;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-3);\n  max-height: 240px;\n  box-shadow: 0 8px 24px var(--dsw-alias-bg-mask-2);\n  opacity: 0;\n  border-radius: 8px;\n  flex-direction: column;\n  padding: 4px;\n  transition: opacity .1s, transform .1s;\n  display: flex;\n  position: absolute;\n  top: calc(100% + 4px);\n  left: 0;\n  right: 0;\n  overflow-y: auto;\n  transform: translateY(-4px);\n}\n\n._3KtWIa_selectPopupOpen {\n  opacity: 1;\n  transform: none;\n}\n\n._3KtWIa_selectPopupClose {\n  opacity: 0;\n  pointer-events: none;\n  transform: translateY(-4px);\n}\n\n._3KtWIa_rangeAnchor {\n  display: inline-flex;\n  position: relative;\n}\n\n._3KtWIa_rangeBubble {\n  z-index: 40;\n  box-sizing: border-box;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-3);\n  width: 220px;\n  box-shadow: 0 8px 24px var(--dsw-alias-bg-mask-2);\n  opacity: 0;\n  visibility: hidden;\n  border-radius: 10px;\n  padding: 10px 12px 6px;\n  transition: opacity .12s, transform .12s, visibility 0s linear .12s;\n  position: absolute;\n  right: 0;\n}\n\n._3KtWIa_rangeBubble[data-side=\"above\"] {\n  bottom: calc(100% + 6px);\n  transform: translateY(4px);\n}\n\n._3KtWIa_rangeBubble[data-side=\"below\"] {\n  top: calc(100% + 6px);\n  transform: translateY(-4px);\n}\n\n._3KtWIa_rangeBubble[data-open] {\n  opacity: 1;\n  visibility: visible;\n  transition: opacity .12s, transform .12s, visibility;\n  transform: none;\n}\n\n._3KtWIa_rangeSlider {\n  appearance: none;\n  cursor: pointer;\n  background: none;\n  width: 100%;\n  height: 18px;\n  margin: 0;\n  display: block;\n}\n\n._3KtWIa_rangeSlider::-webkit-slider-runnable-track {\n  background: linear-gradient(to right,\n    var(--dsw-alias-brand-primary) var(--range-fill, 0%),\n    color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent) var(--range-fill, 0%));\n  border-radius: 999px;\n  height: 4px;\n}\n\n._3KtWIa_rangeSlider::-moz-range-track {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);\n  border-radius: 999px;\n  height: 4px;\n}\n\n._3KtWIa_rangeSlider::-moz-range-progress {\n  background: var(--dsw-alias-brand-primary);\n  border-radius: 999px;\n  height: 4px;\n}\n\n._3KtWIa_rangeSlider::-webkit-slider-thumb {\n  appearance: none;\n  background: #fff;\n  border: 0;\n  border-radius: 50%;\n  width: 14px;\n  height: 14px;\n  margin-top: -5px;\n  transition: transform .12s;\n  box-shadow: 0 0 0 1px #0000001f, 0 1px 3px #00000040;\n}\n\n._3KtWIa_rangeSlider::-moz-range-thumb {\n  background: #fff;\n  border: 0;\n  border-radius: 50%;\n  width: 14px;\n  height: 14px;\n  box-shadow: 0 0 0 1px #0000001f, 0 1px 3px #00000040;\n}\n\n._3KtWIa_rangeSlider:active::-webkit-slider-thumb {\n  transform: scale(1.15);\n}\n\n._3KtWIa_rangeSlider:focus-visible {\n  outline: none;\n}\n\n._3KtWIa_rangeSlider:focus-visible::-webkit-slider-thumb {\n  box-shadow: 0 0 0 2px var(--dsw-alias-brand-primary);\n}\n\n._3KtWIa_rangeSlider:disabled {\n  cursor: not-allowed;\n}\n\n._3KtWIa_rangeEnds {\n  color: var(--dsw-alias-label-secondary);\n  font-variant-numeric: tabular-nums;\n  justify-content: space-between;\n  margin-top: 2px;\n  font-size: 11px;\n  line-height: 16px;\n  display: flex;\n}\n\n._3KtWIa_selectOption {\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  border-radius: 6px;\n  flex-shrink: 0;\n  padding: 6px 10px;\n  font-size: 13px;\n  line-height: 1.5;\n  overflow: hidden;\n}\n\n._3KtWIa_selectOption:hover, ._3KtWIa_selectOptionActive {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n._3KtWIa_selectOptionSelected {\n  color: var(--dsw-alias-brand-primary);\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent);\n  font-weight: 500;\n}\n\n._3KtWIa_invalid {\n  color: var(--dsw-alias-state-error-primary, #b42318);\n  margin: 0;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._3KtWIa_hint {\n  color: var(--dsw-alias-label-secondary);\n  margin: 0;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._3KtWIa_toggle {\n  appearance: none;\n  cursor: pointer;\n  font: inherit;\n  background: none;\n  border: 0;\n  border-radius: 999px;\n  align-items: center;\n  margin: 0;\n  padding: 0;\n  display: inline-flex;\n}\n\n._3KtWIa_toggleTrack {\n  background: var(--dsw-alias-label-dimmed);\n  border-radius: 999px;\n  flex: none;\n  width: 36px;\n  height: 20px;\n  transition: background-color .18s;\n  position: relative;\n}\n\n._3KtWIa_toggleThumb {\n  --toggle-travel: 16px;\n  --toggle-overshoot: 1px;\n  background: var(--dsw-alias-bg-layer-3);\n  border-radius: 50%;\n  width: 16px;\n  height: 16px;\n  transition: translate .18s;\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  translate: 0;\n  box-shadow: 0 1px 2px #1414132e;\n}\n\n._3KtWIa_toggle[aria-checked=\"true\"] ._3KtWIa_toggleTrack {\n  background: var(--dsw-alias-button-primary-fill, var(--dsw-alias-label-primary));\n}\n\n._3KtWIa_toggle[aria-checked=\"true\"] ._3KtWIa_toggleThumb {\n  translate: var(--toggle-travel) 0;\n  background: var(--dsw-alias-label-primary-foreground, var(--dsw-alias-bg-layer-3));\n}\n\n._3KtWIa_toggle[data-moved][aria-checked=\"true\"] ._3KtWIa_toggleThumb {\n  animation: .35s cubic-bezier(.34, 1.45, .64, 1) both _3KtWIa_toggle-on;\n}\n\n._3KtWIa_toggle[data-moved][aria-checked=\"false\"] ._3KtWIa_toggleThumb {\n  animation: .35s cubic-bezier(.34, 1.45, .64, 1) both _3KtWIa_toggle-off;\n}\n\n@keyframes _3KtWIa_toggle-on {\n  0% {\n    translate: 0;\n  }\n\n  55% {\n    translate: calc(var(--toggle-travel) + var(--toggle-overshoot)) 0;\n  }\n\n  80%, 100% {\n    translate: var(--toggle-travel) 0;\n  }\n}\n\n@keyframes _3KtWIa_toggle-off {\n  0% {\n    translate: var(--toggle-travel) 0;\n  }\n\n  55% {\n    translate: calc(0px - var(--toggle-overshoot)) 0;\n  }\n\n  80%, 100% {\n    translate: 0;\n  }\n}\n\n._3KtWIa_toggle:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: 2px;\n}\n\n._3KtWIa_toggle:disabled {\n  opacity: .45;\n  cursor: not-allowed;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  ._3KtWIa_card, ._3KtWIa_header, ._3KtWIa_mark, ._3KtWIa_chevron, ._3KtWIa_chevronOpen, ._3KtWIa_rangeBubble, ._3KtWIa_selectChevron, ._3KtWIa_selectChevronOpen, ._3KtWIa_selectPopup, ._3KtWIa_toggleTrack, ._3KtWIa_toggleThumb {\n    transition: none;\n  }\n\n  ._3KtWIa_toggle[data-moved] ._3KtWIa_toggleThumb {\n    animation: none;\n  }\n\n  ._3KtWIa_disclosure {\n    transition-property: opacity;\n  }\n}\n.yoq9BG_card {\n  border: .5px solid var(--dsw-alias-border-l2, #7f7f7f38);\n  border-radius: var(--dsw-radius-md, 10px);\n  background: var(--dsw-alias-surface-base, #7f7f7f0a);\n  margin: 16px 0;\n  overflow: hidden;\n}\n\n.yoq9BG_toolbar {\n  border-bottom: .5px solid var(--dsw-alias-border-l1, #7f7f7f24);\n  background: var(--dsw-alias-interactive-bg-secondary, #7f7f7f0d);\n  justify-content: space-between;\n  align-items: center;\n  gap: 8px;\n  padding: 6px 10px;\n  font-size: 12px;\n  display: flex;\n}\n\n.yoq9BG_badge {\n  font-family: var(--ds-font-family-code, ui-monospace, monospace);\n  letter-spacing: .04em;\n  text-transform: uppercase;\n  color: var(--dsw-alias-label-secondary, #666);\n  font-size: 11px;\n  font-weight: 600;\n}\n\n.yoq9BG_actions {\n  align-items: center;\n  gap: 4px;\n  display: flex;\n}\n\n.yoq9BG_tabs {\n  background: var(--dsw-alias-interactive-bg-hover, #7f7f7f14);\n  border-radius: 6px;\n  padding: 2px;\n  display: inline-flex;\n}\n\n.yoq9BG_btn {\n  appearance: none;\n  color: var(--dsw-alias-label-secondary, #666);\n  cursor: pointer;\n  background: none;\n  border: none;\n  border-radius: 5px;\n  padding: 0 8px;\n  font-size: 11px;\n  line-height: 20px;\n}\n\n.yoq9BG_btn:hover {\n  color: var(--dsw-alias-label-primary, inherit);\n  background: var(--dsw-alias-interactive-bg-hover, #7f7f7f1a);\n}\n\n.yoq9BG_btnActive {\n  color: var(--dsw-alias-label-primary, inherit);\n  background: var(--dsw-alias-surface-raised, #fff);\n  font-weight: 500;\n  box-shadow: 0 1px 2px #00000014;\n}\n\n.yoq9BG_canvasWrap {\n  cursor: zoom-in;\n  justify-content: center;\n  padding: 12px;\n  display: flex;\n  overflow-x: auto;\n}\n\n.yoq9BG_codeWrap > :first-child {\n  border: none !important;\n  border-radius: 0 !important;\n  margin: 0 !important;\n}\n\n.yoq9BG_canvasWrap .lh-mermaid-svg, .yoq9BG_modalSvg .lh-mermaid-svg {\n  max-width: 100%;\n  height: auto;\n  font-family: var(--ds-font-family-sans, -apple-system, BlinkMacSystemFont, sans-serif);\n  display: block;\n}\n\n.yoq9BG_canvasWrap .lh-node-shape, .yoq9BG_modalSvg .lh-node-shape {\n  fill: var(--dsw-alias-surface-raised, #fff);\n  stroke: var(--dsw-alias-border-l3, #64748b73);\n  stroke-width: 1.3px;\n}\n\n.yoq9BG_canvasWrap .lh-node-diamond, .yoq9BG_modalSvg .lh-node-diamond {\n  fill: var(--dsw-alias-state-business-bg, #4c6ef514);\n  stroke: var(--dsw-alias-state-business-primary, #4c6ef5);\n}\n\n.yoq9BG_canvasWrap .lh-state-point, .yoq9BG_modalSvg .lh-state-point {\n  fill: var(--dsw-alias-label-primary, #1f2937);\n}\n\n.yoq9BG_canvasWrap .lh-node-text, .yoq9BG_modalSvg .lh-node-text, .yoq9BG_canvasWrap .lh-seq-msg-left, .yoq9BG_modalSvg .lh-seq-msg-left {\n  fill: var(--dsw-alias-label-primary, #1f2937);\n  font-size: 13px;\n}\n\n.yoq9BG_canvasWrap .lh-edge, .yoq9BG_modalSvg .lh-edge {\n  stroke: var(--dsw-alias-label-secondary, #64748b);\n}\n\n.yoq9BG_canvasWrap .lh-arrow-head, .yoq9BG_modalSvg .lh-arrow-head {\n  fill: var(--dsw-alias-label-secondary, #64748b);\n}\n\n.yoq9BG_canvasWrap .lh-edge-label rect, .yoq9BG_modalSvg .lh-edge-label rect {\n  fill: var(--dsw-alias-surface-base, #f8fafc);\n  stroke: var(--dsw-alias-border-l1, #64748b40);\n  stroke-width: .8px;\n}\n\n.yoq9BG_canvasWrap .lh-edge-text, .yoq9BG_modalSvg .lh-edge-text {\n  fill: var(--dsw-alias-label-secondary, #475569);\n  font-size: 11.5px;\n}\n\n.yoq9BG_canvasWrap .lh-subgraph rect, .yoq9BG_modalSvg .lh-subgraph rect {\n  fill: var(--dsw-alias-interactive-bg-secondary, #7f7f7f0d);\n  stroke: var(--dsw-alias-border-l2, #7f7f7f47);\n  stroke-dasharray: 4 3;\n  stroke-width: 1px;\n}\n\n.yoq9BG_canvasWrap .lh-sg-title, .yoq9BG_modalSvg .lh-sg-title {\n  fill: var(--dsw-alias-label-secondary, #64748b);\n  font-size: 11.5px;\n  font-weight: 600;\n}\n\n.yoq9BG_canvasWrap .lh-seq-life, .yoq9BG_modalSvg .lh-seq-life {\n  stroke: var(--dsw-alias-border-l3, #7f7f7f59);\n  stroke-dasharray: 4 4;\n  stroke-width: 1.1px;\n}\n\n.yoq9BG_canvasWrap .lh-seq-divider, .yoq9BG_modalSvg .lh-seq-divider {\n  stroke: var(--dsw-alias-border-l2, #7f7f7f59);\n  stroke-dasharray: 4 3;\n}\n\n.yoq9BG_canvasWrap .lh-seq-note rect, .yoq9BG_modalSvg .lh-seq-note rect {\n  fill: var(--dsw-alias-state-warning-bg, #f59f001a);\n  stroke: var(--dsw-alias-border-l2, #f59f0059);\n}\n\n.yoq9BG_overlay {\n  z-index: 9999;\n  background: #0000009e;\n  justify-content: center;\n  align-items: center;\n  padding: 24px;\n  display: flex;\n  position: fixed;\n  inset: 0;\n}\n\n.yoq9BG_dialog {\n  background: var(--dsw-alias-surface-base, #fff);\n  border: 1px solid var(--dsw-alias-border-l2, #7f7f7f4d);\n  border-radius: 12px;\n  flex-direction: column;\n  max-width: min(94vw, 1200px);\n  max-height: 90vh;\n  display: flex;\n  overflow: hidden;\n  box-shadow: 0 20px 50px #00000047;\n}\n\n.yoq9BG_modalHeader {\n  border-bottom: .5px solid var(--dsw-alias-border-l1, #7f7f7f33);\n  justify-content: space-between;\n  align-items: center;\n  padding: 10px 14px;\n  display: flex;\n}\n\n.yoq9BG_modalSvg {\n  padding: 20px;\n  overflow: auto;\n}\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(h1, h2, h3) {\n  letter-spacing: -.01em;\n  margin: 28px 0 14px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] h2 {\n  border-bottom: .5px solid var(--dsw-alias-border-l1);\n  padding-bottom: 6px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(h4, h5, h6) {\n  margin: 20px 0 10px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] p {\n  margin: 12px 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(ul, ol) {\n  margin: 12px 0;\n  padding-left: 20px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] li:not(:first-child) {\n  margin-top: 8px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] li > p {\n  margin: 4px 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] li::marker {\n  color: var(--dsw-alias-label-tertiary);\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] blockquote {\n  border-left: 2px solid var(--dsw-alias-border-l3);\n  color: var(--dsw-alias-label-secondary);\n  margin: 14px 0;\n  padding: 2px 0 2px 14px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] blockquote > :first-child {\n  margin-top: 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] blockquote > :last-child {\n  margin-bottom: 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] .md-code-block {\n  border-radius: var(--dsl-code-block-border-radius, var(--dsw-radius-lg, 12px));\n  overflow: hidden;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] .md-code-block pre {\n  scrollbar-width: thin;\n  overscroll-behavior-x: contain;\n  tab-size: 2;\n  line-height: 1.7;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] .md-code-block pre code {\n  font-variant-ligatures: none;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] [data-code-block-banner] {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent);\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :not(pre) > code {\n  border-radius: var(--dsw-radius-xs, 4px);\n  -webkit-box-decoration-break: clone;\n  box-decoration-break: clone;\n  border: 0;\n  padding: 0 4px;\n  display: inline;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] table {\n  font-variant-numeric: tabular-nums;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] thead th {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);\n  border-top: .5px solid var(--dsw-alias-border-l3);\n  border-bottom: .5px solid var(--dsw-alias-border-l3);\n  white-space: nowrap;\n  color: var(--dsw-alias-label-secondary);\n  font-weight: 600;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] tbody tr:last-child td {\n  border-bottom: .5px solid var(--dsw-alias-border-l3);\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] tbody tr:hover {\n  background: var(--dsw-alias-interactive-bg-hover, #7f7f7f0a);\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(th, td) {\n  vertical-align: top;\n  max-width: min(34vw, 420px);\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] td {\n  border-bottom-color: var(--dsw-alias-border-l1);\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] td :not(pre) > code {\n  white-space: nowrap;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] img {\n  border-radius: var(--dsw-radius-md, 8px);\n  border: .5px solid var(--dsw-alias-border-l1, #7f7f7f33);\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] hr {\n  margin: 24px 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"] thead th {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"] [data-code-block-banner] {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"] img {\n  border-color: var(--dsw-alias-border-l2-darkmode-thin, var(--dsw-alias-border-l2));\n}\n"
  if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.setAttribute('data-dsh-liangheng', '')
    style.textContent = css
    document.head.appendChild(style)
  }
}
return module.exports}});
