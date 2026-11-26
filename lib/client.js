import './style.css';
import { Children, createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { createSnapshotStore } from "@deepseek-ai/dsh-client-store";
//#region src/client/LiangShenLever.module.css
var LiangShenLever_module_default = {
	"arm": "d6qpdq_arm",
	"banner": "d6qpdq_banner",
	"banner-shake": "d6qpdq_banner-shake",
	"banner-slam": "d6qpdq_banner-slam",
	"bannerName": "d6qpdq_bannerName",
	"burst": "d6qpdq_burst",
	"burst-flash": "d6qpdq_burst-flash",
	"burst-ring": "d6qpdq_burst-ring",
	"code": "d6qpdq_code",
	"code-blink": "d6qpdq_code-blink",
	"control": "d6qpdq_control",
	"error": "d6qpdq_error",
	"flash": "d6qpdq_flash",
	"knob": "d6qpdq_knob",
	"lever": "d6qpdq_lever",
	"lever-jitter": "d6qpdq_lever-jitter",
	"line": "d6qpdq_line",
	"readout": "d6qpdq_readout",
	"ring": "d6qpdq_ring",
	"rod": "d6qpdq_rod",
	"spark": "d6qpdq_spark",
	"spark-fly": "d6qpdq_spark-fly",
	"sparks": "d6qpdq_sparks",
	"track": "d6qpdq_track"
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
const BINARY = "01001100 01001001 01000001 01001110 01000111";
const MORSE = "-.. . . .--. ... . . -.- / .... .- .-. -. . ... ...";
/** One spark per spoke of the burst. */
const SPARKS = Array.from({ length: 14 }, (_, index) => index);
/** Sync the hero preset chip above the composer so both controls always agree. */
function syncHeroChip(label) {
	try {
		if (typeof document === "undefined") return;
		const chip = document.querySelector("button[aria-haspopup=\"menu\"] span[class*=\"seatLabel\"]") ?? Array.from(document.querySelectorAll("button[aria-haspopup=\"menu\"] span")).find((s) => s.className.includes("seatLabel"));
		if (chip && chip.textContent !== label) chip.textContent = label;
	} catch {}
}
/** Slot entry for `conversation.input.right` (left of the model selector). */
function LiangShenLever(face) {
	const { state, restoreLabel, busy, error, burst } = useSyncExternalStore(face.store.subscribe, face.store.getSnapshot);
	const [burstKey, setBurstKey] = useState(0);
	const seen = useRef(burst);
	const drag = useRef(void 0);
	const actionable = !busy && (state === "on" || state === "off");
	const on = state === "on";
	const errorText = error === void 0 ? void 0 : error.kind === "locked" ? face.t("lever.failed.locked") : error.kind === "missing" ? face.t("lever.failed.missing") : error.kind === "timeout" ? face.t("lever.failed.timeout") : face.t("lever.failed.failed", { reason: error.reason });
	useEffect(() => {
		if (burst > seen.current) setBurstKey(burst);
		seen.current = burst;
	}, [burst]);
	useEffect(() => {
		if (burstKey === 0) return;
		const timer = setTimeout(() => {
			setBurstKey(0);
		}, BURST_MS);
		return () => {
			clearTimeout(timer);
		};
	}, [burstKey]);
	const prevState = useRef(state);
	useEffect(() => {
		if (state === "on") syncHeroChip(face.t("lever.name"));
		else if (prevState.current === "on" && state === "off" && restoreLabel !== "") syncHeroChip(restoreLabel);
		prevState.current = state;
	}, [
		state,
		restoreLabel,
		face
	]);
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
	return /* @__PURE__ */ jsxs("span", {
		className: LiangShenLever_module_default.lever,
		"data-dsh-plugin": "liangshen",
		"data-dsh-part": "lever",
		"data-state": state,
		"data-busy": busy ? "true" : void 0,
		children: [
			/* @__PURE__ */ jsxs("button", {
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
				children: [/* @__PURE__ */ jsx("span", {
					className: LiangShenLever_module_default.track,
					"data-dsh-part": "lever-track",
					"aria-hidden": "true",
					children: /* @__PURE__ */ jsxs("svg", {
						className: LiangShenLever_module_default.arm,
						"data-dsh-part": "lever-arm",
						viewBox: "0 0 16 26",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ jsx("rect", {
							className: LiangShenLever_module_default.rod,
							x: "6.5",
							y: "3.5",
							width: "3",
							height: "21",
							rx: "1.5"
						}), /* @__PURE__ */ jsx("circle", {
							className: LiangShenLever_module_default.knob,
							cx: "8",
							cy: "4",
							r: "3.4"
						})]
					})
				}), /* @__PURE__ */ jsx("span", {
					className: LiangShenLever_module_default.readout,
					children: busy ? face.t("lever.busy") : on ? face.t("lever.state.on") : face.t("lever.state.off")
				})]
			}),
			errorText !== void 0 && /* @__PURE__ */ jsx("span", {
				className: LiangShenLever_module_default.error,
				role: "status",
				title: errorText,
				children: errorText
			}),
			burstKey !== 0 && /* @__PURE__ */ jsx(Burst, { face }, burstKey)
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
	return /* @__PURE__ */ jsxs("span", {
		className: LiangShenLever_module_default.burst,
		"data-dsh-part": "lever-burst",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("span", { className: LiangShenLever_module_default.flash }),
			/* @__PURE__ */ jsx("span", { className: LiangShenLever_module_default.ring }),
			/* @__PURE__ */ jsx("span", { className: LiangShenLever_module_default.ring }),
			/* @__PURE__ */ jsx("span", { className: LiangShenLever_module_default.ring }),
			/* @__PURE__ */ jsxs("span", {
				className: LiangShenLever_module_default.banner,
				"data-dsh-part": "lever-banner",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: LiangShenLever_module_default.bannerName,
						children: face.t("lever.name")
					}),
					/* @__PURE__ */ jsx("span", {
						className: LiangShenLever_module_default.line,
						children: face.t("burst.line1")
					}),
					/* @__PURE__ */ jsx("span", {
						className: LiangShenLever_module_default.line,
						children: face.t("burst.line2")
					}),
					/* @__PURE__ */ jsx("span", {
						className: LiangShenLever_module_default.code,
						children: BINARY
					}),
					/* @__PURE__ */ jsx("span", {
						className: LiangShenLever_module_default.code,
						children: MORSE
					})
				]
			}),
			/* @__PURE__ */ jsx("span", {
				className: LiangShenLever_module_default.sparks,
				children: SPARKS.map((spoke) => /* @__PURE__ */ jsx("i", {
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
const LIANGSHEN_PRESET_ID = "liangshen";
/** Resolve what the lever shows for one set of facts. */
function leverState(facts) {
	if (!facts.available.includes("liangshen")) return "missing";
	if (!facts.blank) return "locked";
	return facts.agentPreset === "liangshen" ? "on" : "off";
}
/**
* The preset a push-up restores: the preset the user was on before pulling the
* lever, else the deployment default, else the first usable roster row that is
* not the LiangShen preset. A candidate is skipped when it is the LiangShen
* preset itself (restoring it would be a no-op) or when the roster no longer
* supplies it. That last resort is what keeps the push direction alive when the
* deployment default IS LiangShen mode: `fallback` is skipped then, and after a
* reload `previous` is gone, so without it the gesture would have no target.
*/
function restoreTarget(facts) {
	for (const candidate of [facts.previous, facts.fallback]) {
		if (candidate === void 0 || candidate === "liangshen") continue;
		if (facts.available.includes(candidate)) return candidate;
	}
	return facts.available.find((candidate) => candidate !== LIANGSHEN_PRESET_ID);
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
	"web-ui-liangshen",
	"liangshen"
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
		this.store = createSnapshotStore({
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
		const bound = readService(() => this.ctx.locale.bind("liangshen"));
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
		const target = direction === "down" ? LIANGSHEN_PRESET_ID : restoreTarget(facts);
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
			if (prev !== void 0 && prev !== "liangshen") this.rememberPrevious(prev);
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
					const matched = this.rows.find((row) => (row.name === text || row.id === text) && row.id !== "liangshen");
					if (matched) return matched.id;
				}
			}
		} catch {}
		try {
			if (typeof sessionStorage !== "undefined") {
				const stored = sessionStorage.getItem("dsh-liangshen:previous-preset");
				if (stored && stored !== "liangshen" && this.rows.some((r) => r.id === stored)) return stored;
			}
		} catch {}
	}
	rememberPrevious(presetId) {
		if (presetId === void 0 || presetId === "liangshen") return;
		this.previous = presetId;
		try {
			if (typeof sessionStorage !== "undefined") sessionStorage.setItem("dsh-liangshen:previous-preset", presetId);
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
		if (currentPreset !== void 0 && currentPreset !== "liangshen") this.rememberPrevious(currentPreset);
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
	return /* @__PURE__ */ jsxs("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 18 18",
		fill: "none",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ jsx("rect", {
			x: "3.6",
			y: "13.2",
			width: "8.8",
			height: "2.8",
			rx: "1.4",
			fill: "currentColor"
		}), /* @__PURE__ */ jsxs("g", {
			transform: "rotate(20 8 14.4)",
			children: [/* @__PURE__ */ jsx("rect", {
				x: "6.5",
				y: "4.6",
				width: "3",
				height: "9.8",
				rx: "1.5",
				fill: "currentColor"
			}), /* @__PURE__ */ jsx("circle", {
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
	"badge": "_4RM4Uq_badge",
	"badges": "_4RM4Uq_badges",
	"body": "_4RM4Uq_body",
	"card": "_4RM4Uq_card",
	"cardNested": "_4RM4Uq_cardNested",
	"cardOpen": "_4RM4Uq_cardOpen",
	"chevron": "_4RM4Uq_chevron",
	"chevronOpen": "_4RM4Uq_chevronOpen",
	"control": "_4RM4Uq_control",
	"description": "_4RM4Uq_description",
	"disclosure": "_4RM4Uq_disclosure",
	"failed": "_4RM4Uq_failed",
	"field": "_4RM4Uq_field",
	"head": "_4RM4Uq_head",
	"header": "_4RM4Uq_header",
	"headerAction": "_4RM4Uq_headerAction",
	"headerStatic": "_4RM4Uq_headerStatic",
	"headText": "_4RM4Uq_headText",
	"hint": "_4RM4Uq_hint",
	"input": "_4RM4Uq_input",
	"inputInvalid": "_4RM4Uq_inputInvalid",
	"invalid": "_4RM4Uq_invalid",
	"label": "_4RM4Uq_label",
	"mark": "_4RM4Uq_mark",
	"name": "_4RM4Uq_name",
	"notExposed": "_4RM4Uq_notExposed",
	"rangeAnchor": "_4RM4Uq_rangeAnchor",
	"rangeBubble": "_4RM4Uq_rangeBubble",
	"rangeEnds": "_4RM4Uq_rangeEnds",
	"rangeSlider": "_4RM4Uq_rangeSlider",
	"readOnly": "_4RM4Uq_readOnly",
	"reset": "_4RM4Uq_reset",
	"segment": "_4RM4Uq_segment",
	"segmentGroup": "_4RM4Uq_segmentGroup",
	"select": "_4RM4Uq_select",
	"selectButton": "_4RM4Uq_selectButton",
	"selectChevron": "_4RM4Uq_selectChevron",
	"selectChevronOpen": "_4RM4Uq_selectChevronOpen",
	"selectLabel": "_4RM4Uq_selectLabel",
	"selectOption": "_4RM4Uq_selectOption",
	"selectOptionActive": "_4RM4Uq_selectOptionActive",
	"selectOptionSelected": "_4RM4Uq_selectOptionSelected",
	"selectPopup": "_4RM4Uq_selectPopup",
	"selectPopupClose": "_4RM4Uq_selectPopupClose",
	"selectPopupOpen": "_4RM4Uq_selectPopupOpen",
	"selectWrap": "_4RM4Uq_selectWrap",
	"settings-card": "_4RM4Uq_settings-card",
	"toggle": "_4RM4Uq_toggle",
	"toggle-off": "_4RM4Uq_toggle-off",
	"toggle-on": "_4RM4Uq_toggle-on",
	"toggleThumb": "_4RM4Uq_toggleThumb",
	"toggleTrack": "_4RM4Uq_toggleTrack"
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
	const [open, setOpen] = useState(false);
	const [side, setSide] = useState("above");
	const [live, setLive] = useState(null);
	const anchorRef = useRef(null);
	const timer = useRef(void 0);
	const hovered = useRef(false);
	const focused = useRef(false);
	const dragging = useRef(false);
	useEffect(() => () => {
		clearTimeout(timer.current);
	}, []);
	useEffect(() => {
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
	return /* @__PURE__ */ jsxs("div", {
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
		children: [props.children, /* @__PURE__ */ jsxs("div", {
			className: settings_card_module_default.rangeBubble,
			"data-open": open ? "" : void 0,
			"data-side": side,
			children: [/* @__PURE__ */ jsx("input", {
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
			}), /* @__PURE__ */ jsxs("span", {
				className: settings_card_module_default.rangeEnds,
				"aria-hidden": "true",
				children: [/* @__PURE__ */ jsx("span", { children: min }), /* @__PURE__ */ jsx("span", { children: max })]
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
	const group = useRef(null);
	const count = Children.count(children);
	useLayoutEffect(() => {
		if (group.current !== null) placePill(group.current);
	});
	useLayoutEffect(() => {
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
	return /* @__PURE__ */ jsx("div", {
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
const CardApply = createContext(null);
/** Length of the body's disclosure motion; it matches `--settings-card-motion` on the card root. */
const BODY_MOTION_MS = 180;
/**
* Render one plugin settings card.
* @param props - the plugin's copy keys, its form state, and its controls.
* @returns the card, or nothing while the namespace is still loading.
*/
function PluginSettingsCard(props) {
	const [open, setOpen] = useState(props.defaultOpen ?? true);
	const { state, alwaysOpen } = props;
	const expanded = alwaysOpen === true || open;
	const [bodyPhase, setBodyPhase] = useState(expanded ? "shown" : "hidden");
	const bodyRef = useRef(null);
	useLayoutEffect(() => {
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
	useEffect(() => {
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
	const bodyRegion = (content) => bodyPhase === "hidden" ? null : /* @__PURE__ */ jsx("div", {
		className: settings_card_module_default.disclosure,
		"data-state": bodyPhase,
		ref: bodyRef,
		children: /* @__PURE__ */ jsx("div", {
			className: settings_card_module_default.body,
			children: content
		})
	});
	const header = alwaysOpen === true ? /* @__PURE__ */ jsxs("div", {
		className: settings_card_module_default.headerStatic,
		children: [
			props.icon !== void 0 ? /* @__PURE__ */ jsx("span", {
				className: settings_card_module_default.mark,
				"aria-hidden": "true",
				children: props.icon
			}) : null,
			/* @__PURE__ */ jsxs("span", {
				className: settings_card_module_default.headText,
				children: [/* @__PURE__ */ jsx("span", {
					className: settings_card_module_default.name,
					id: props.titleId,
					title,
					children: title
				}), /* @__PURE__ */ jsx("span", {
					className: settings_card_module_default.description,
					title: descriptionTitle,
					children: props.descriptionNode ?? description
				})]
			}),
			props.headerAction !== void 0 ? /* @__PURE__ */ jsx("span", {
				className: settings_card_module_default.headerAction,
				children: props.headerAction
			}) : null
		]
	}) : /* @__PURE__ */ jsxs("button", {
		type: "button",
		className: settings_card_module_default.header,
		"aria-expanded": open,
		"aria-label": `${props.t(open ? "settings.collapse" : "settings.expand")}: ${title}`,
		onClick: () => {
			setOpen(!open);
		},
		children: [
			props.icon !== void 0 ? /* @__PURE__ */ jsx("span", {
				className: settings_card_module_default.mark,
				"aria-hidden": "true",
				children: props.icon
			}) : null,
			/* @__PURE__ */ jsxs("span", {
				className: settings_card_module_default.headText,
				children: [/* @__PURE__ */ jsx("span", {
					className: settings_card_module_default.name,
					id: props.titleId,
					title,
					children: title
				}), /* @__PURE__ */ jsx("span", {
					className: settings_card_module_default.description,
					title: descriptionTitle,
					children: props.descriptionNode ?? description
				})]
			}),
			props.headerAction !== void 0 ? /* @__PURE__ */ jsx("span", {
				className: settings_card_module_default.headerAction,
				children: props.headerAction
			}) : null,
			/* @__PURE__ */ jsx("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 14 14",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				className: open ? `${settings_card_module_default.chevron} ${settings_card_module_default.chevronOpen}` : settings_card_module_default.chevron,
				children: /* @__PURE__ */ jsx("path", {
					d: "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z",
					fill: "currentColor"
				})
			})
		]
	});
	const notExposedNotice = state.exposed || props.hideNotExposedNotice === true ? null : /* @__PURE__ */ jsx("p", {
		className: settings_card_module_default.notExposed,
		role: "status",
		children: props.t("settings.notExposed")
	});
	if (!state.exposed && props.renderChildrenWhenNotExposed !== true) return /* @__PURE__ */ jsxs("li", {
		className: cardClass,
		children: [header, bodyRegion(notExposedNotice)]
	});
	return /* @__PURE__ */ jsxs("li", {
		className: cardClass,
		children: [header, props.headerOnly !== true ? bodyRegion(/* @__PURE__ */ jsxs(Fragment, { children: [
			notExposedNotice,
			!state.writable ? /* @__PURE__ */ jsx("p", {
				className: settings_card_module_default.readOnly,
				role: "status",
				children: props.t("settings.readOnly")
			}) : null,
			/* @__PURE__ */ jsx(CardApply.Provider, {
				value: {
					commit: props.onSave,
					revert: props.onDiscard
				},
				children: props.children
			}),
			props.hideFooter !== true && state.failed ? /* @__PURE__ */ jsxs("p", {
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
	const apply = useContext(CardApply);
	const settledByKey = useRef(false);
	const onKeyDown = (event) => {
		if (apply === null || event.key !== "Enter" && event.key !== "Escape") return;
		event.preventDefault();
		settledByKey.current = true;
		if (event.key === "Enter") apply.commit();
		else apply.revert();
		event.currentTarget.blur();
	};
	const input = /* @__PURE__ */ jsx("input", {
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
	return /* @__PURE__ */ jsxs("div", {
		className: settings_card_module_default.field,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: settings_card_module_default.head,
				children: [/* @__PURE__ */ jsx("label", {
					className: settings_card_module_default.label,
					htmlFor: props.id,
					children: props.label
				}), props.overridden ? /* @__PURE__ */ jsxs("span", {
					className: settings_card_module_default.badges,
					children: [/* @__PURE__ */ jsx("span", {
						className: settings_card_module_default.badge,
						children: props.overriddenLabel
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: settings_card_module_default.reset,
						disabled: props.disabled,
						onClick: props.onReset,
						children: props.resetLabel
					})]
				}) : null]
			}),
			range === void 0 ? input : /* @__PURE__ */ jsx(RangeBubble, {
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
			/* @__PURE__ */ jsx("p", {
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
	const [open, setOpen] = useState(false);
	const [closing, setClosing] = useState(false);
	const [phase, setPhase] = useState("initial");
	const [activeIndex, setActiveIndex] = useState(0);
	const closeTimer = useRef(void 0);
	const wrapRef = useRef(null);
	const popupRef = useRef(null);
	const currentIndex = () => {
		const index = options.findIndex((option) => option.value === value);
		return index >= 0 ? index : 0;
	};
	const close = useCallback(() => {
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
	useEffect(() => () => {
		if (closeTimer.current !== void 0) clearTimeout(closeTimer.current);
	}, []);
	useLayoutEffect(() => {
		if (open && !closing && phase === "initial") {
			popupRef.current?.offsetHeight;
			setPhase("open");
		}
	}, [
		open,
		closing,
		phase
	]);
	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event) => {
			const target = event.target;
			if (target instanceof Node && !wrapRef.current?.contains(target)) close();
		};
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [open, close]);
	useEffect(() => {
		if (props.disabled && open) close();
	}, [
		props.disabled,
		open,
		close
	]);
	if (isSkinActive()) return /* @__PURE__ */ jsx("select", {
		id,
		className: settings_card_module_default.select,
		value,
		disabled: props.disabled,
		onChange: (event) => {
			props.onEdit(event.target.value);
		},
		children: options.map((option) => /* @__PURE__ */ jsx("option", {
			value: option.value,
			children: option.label
		}, option.value))
	});
	const label = options.find((option) => option.value === value)?.label ?? "";
	const popupClass = closing ? `${settings_card_module_default.selectPopup} ${settings_card_module_default.selectPopupClose}` : phase === "open" ? `${settings_card_module_default.selectPopup} ${settings_card_module_default.selectPopupOpen}` : settings_card_module_default.selectPopup;
	return /* @__PURE__ */ jsxs("div", {
		className: settings_card_module_default.selectWrap,
		ref: wrapRef,
		children: [/* @__PURE__ */ jsxs("button", {
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
			children: [/* @__PURE__ */ jsx("span", {
				className: settings_card_module_default.selectLabel,
				children: label
			}), /* @__PURE__ */ jsx("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 14 14",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				className: open ? `${settings_card_module_default.selectChevron} ${settings_card_module_default.selectChevronOpen}` : settings_card_module_default.selectChevron,
				"aria-hidden": "true",
				children: /* @__PURE__ */ jsx("path", {
					d: "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z",
					fill: "currentColor"
				})
			})]
		}), open ? /* @__PURE__ */ jsx("div", {
			className: popupClass,
			role: "listbox",
			ref: popupRef,
			children: options.map((option, index) => /* @__PURE__ */ jsx("div", {
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
	return /* @__PURE__ */ jsx(SegmentGroup, {
		id: props.id,
		role: "group",
		"aria-label": props.label,
		"aria-invalid": props.invalid || void 0,
		children: props.options.map((option, index) => {
			const active = option.value === props.value;
			return /* @__PURE__ */ jsx("button", {
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
	return /* @__PURE__ */ jsxs("div", {
		className: settings_card_module_default.field,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: settings_card_module_default.head,
				children: [segmented ? /* @__PURE__ */ jsx("span", {
					className: settings_card_module_default.label,
					children: props.label
				}) : /* @__PURE__ */ jsx("label", {
					className: settings_card_module_default.label,
					htmlFor: props.id,
					children: props.label
				}), props.overridden ? /* @__PURE__ */ jsxs("span", {
					className: settings_card_module_default.badges,
					children: [/* @__PURE__ */ jsx("span", {
						className: settings_card_module_default.badge,
						children: props.overriddenLabel
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: settings_card_module_default.reset,
						disabled: props.disabled,
						onClick: props.onReset,
						children: props.resetLabel
					})]
				}) : null]
			}),
			segmented ? /* @__PURE__ */ jsx(SegmentField, {
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
			}) : /* @__PURE__ */ jsx(SelectField, {
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
			/* @__PURE__ */ jsx("p", {
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
	return /* @__PURE__ */ jsxs("div", {
		className: settings_card_module_default.field,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: settings_card_module_default.head,
				children: [segmented ? /* @__PURE__ */ jsx("span", {
					className: settings_card_module_default.label,
					children: props.label
				}) : /* @__PURE__ */ jsx("label", {
					className: settings_card_module_default.label,
					htmlFor: props.id,
					children: props.label
				}), props.overridden ? /* @__PURE__ */ jsxs("span", {
					className: settings_card_module_default.badges,
					children: [/* @__PURE__ */ jsx("span", {
						className: settings_card_module_default.badge,
						children: props.overriddenLabel
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: settings_card_module_default.reset,
						disabled: props.disabled,
						onClick: props.onReset,
						children: props.resetLabel
					})]
				}) : null]
			}),
			segmented ? /* @__PURE__ */ jsx(SegmentField, {
				id: props.id,
				label: props.label,
				options,
				value: props.text,
				disabled: props.disabled,
				invalid: props.invalid,
				onEdit: props.onEdit
			}) : /* @__PURE__ */ jsx(SelectField, {
				id: props.id,
				options,
				value: props.text,
				disabled: props.disabled,
				invalid: props.invalid,
				onEdit: props.onEdit
			}),
			/* @__PURE__ */ jsx("p", {
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
		const store = createSnapshotStore(project());
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
	return /* @__PURE__ */ jsxs(PluginSettingsCard, {
		t,
		titleKey: "settings.title",
		descriptionKey: "settings.description",
		icon: /* @__PURE__ */ jsx(LiangShenMark, {}),
		defaultOpen: false,
		state,
		renderChildrenWhenNotExposed: true,
		hideNotExposedNotice: true,
		onSave: props.save,
		onDiscard: props.discard,
		children: [
			/* @__PURE__ */ jsx(BooleanField, {
				id: "settings-liangshen-enabled",
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
			/* @__PURE__ */ jsx(BooleanField, {
				id: "settings-liangshen-announce",
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
			/* @__PURE__ */ jsx(ChoiceField, {
				id: "settings-liangshen-presentation",
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
			/* @__PURE__ */ jsx(BooleanField, {
				id: "settings-liangshen-dispatcher",
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
			/* @__PURE__ */ jsx(ValueField, {
				id: "settings-liangshen-paged-tool-patterns",
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
			/* @__PURE__ */ jsx(ValueField, {
				id: "settings-liangshen-idle-reclaim-steps",
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
	"lever.a11y": "梁神模式拨杆",
	"lever.name": "梁神模式",
	"lever.hint.pull": "拨下拨杆：开启「梁神模式」",
	"lever.hint.push": "上拨拨杆：返回「{preset}」",
	"lever.hint.locked": "会话已开始，模式不可再更改",
	"lever.hint.missing": "未找到「梁神模式」预设，请先启用该插件行",
	"lever.state.on": "梁神模式",
	"lever.state.off": "普通模式",
	"lever.busy": "正在切换…",
	"lever.failed.locked": "会话已经开始，模式已锁定",
	"lever.failed.missing": "没有找到「梁神模式」预设",
	"lever.failed.timeout": "切换超时，请重试",
	"lever.failed.failed": "切换失败：{reason}",
	"burst.line1": "三秒，三辈子的代码",
	"burst.line2": "文言文 · 二进制 · 摩斯电码",
	"settings.title": "梁神模式",
	"settings.description": "梁神模式的开关、工具面与调度身份。",
	"settings.enabled": "总开关",
	"settings.enabledHint": "关掉后不再声明预设。",
	"settings.announceToAgent": "公告给 agent",
	"settings.announceToAgentHint": "每一轮系统提示都带上本插件公告。",
	"settings.presentation": "工具面",
	"settings.presentationHint": "ptc 把工具收进 run_code，native 保留原生清单。",
	"settings.dispatcher": "调度身份",
	"settings.dispatcherHint": "按调度 Agent 工作：分诊、访谈、派发子代理。",
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
	"settings.notExposed": "这个版本的 DSH 没有开放梁神模式的设置。",
	"settings.readOnly": "设置只读。",
	"settings.expand": "展开设置",
	"settings.collapse": "收起设置",
	"settings.saveFailed": "没有保存成功。",
	"settings.invalidValue": "填一个可用的值。",
	"presentation.ptc": "ptc",
	"presentation.native": "native"
};
/** English counterpart; the key set mirrors {@link zh} exactly. */
const en = {
	"lever.a11y": "LiangShen mode lever",
	"lever.name": "LiangShen mode",
	"lever.hint.pull": "Pull the lever down to turn on LiangShen mode",
	"lever.hint.push": "Push the lever up to return to \"{preset}\"",
	"lever.hint.locked": "The session has started, so its mode can no longer change",
	"lever.hint.missing": "The LiangShen preset is not installed; enable that plugin row first",
	"lever.state.on": "LiangShen",
	"lever.state.off": "Standard",
	"lever.busy": "Switching…",
	"lever.failed.locked": "The session already started, so the mode is locked",
	"lever.failed.missing": "The LiangShen preset was not found",
	"lever.failed.timeout": "The switch timed out; try again",
	"lever.failed.failed": "Switch failed: {reason}",
	"burst.line1": "Three seconds, three lifetimes of code",
	"burst.line2": "Classical Chinese · Binary · Morse code",
	"settings.title": "LiangShen mode",
	"settings.description": "The mode switch, the wire presentation and the dispatcher identity.",
	"settings.enabled": "Master switch",
	"settings.enabledHint": "When off, the preset is no longer declared.",
	"settings.announceToAgent": "Announce to agents",
	"settings.announceToAgentHint": "Every system prompt carries this plugin note.",
	"settings.presentation": "Wire",
	"settings.presentationHint": "ptc folds tools into run_code; native keeps the native roster.",
	"settings.dispatcher": "Dispatcher",
	"settings.dispatcherHint": "Works as a dispatcher: triage, interview, then dispatch subagents.",
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
	"settings.notExposed": "This DSH version does not open the LiangShen settings.",
	"settings.readOnly": "Settings are read-only.",
	"settings.expand": "Show settings",
	"settings.collapse": "Hide settings",
	"settings.saveFailed": "Not saved.",
	"settings.invalidValue": "Enter a value this field accepts.",
	"presentation.ptc": "ptc",
	"presentation.native": "native"
};
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
const NS = "liangshen";
/**
* Settings namespace the settings card edits: the family identity of this
* plugin's own settings form, and the row id a standalone bundle install
* carries. The aggregate install mounts the generated `web-ui-liangshen` row
* instead, and the family binder resolves between the two.
*/
const SETTINGS_NAMESPACE = "liangshen";
/**
* Profile entry id the family aggregate's generated row carries — the shape
* nearly every user runs, and the id the shared-forms fallback binds when the
* family binder cannot resolve the namespace.
*/
const AGGREGATE_ENTRY_ID = "web-ui-liangshen";
/** Profile entry ids this package's patch rows carry, most specific first. */
const LIANGSHEN_ENTRY_IDS = [
	AGGREGATE_ENTRY_ID,
	"ui-liangshen",
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
	return LIANGSHEN_ENTRY_IDS.find((id) => served.includes(id)) ?? "liangshen";
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
		entryIds: LIANGSHEN_ENTRY_IDS
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
	}, "liangshen: lever dictionaries");
	const controller = new LeverController(ctx);
	ctx.effect(() => () => controller.dispose(), "liangshen: lever controller");
	try {
		controller.start();
	} catch {}
	try {
		const settingsCard = new LiangShenSettingsCardController(bindSettingsForm(ctx));
		installPluginCard(ctx, {
			bundle: "@linxin666/dsh-liangshen",
			id: "liangshen",
			order: 120,
			locale: NS,
			inject: () => settingsCard.inject(),
			component: LiangShenSettingsCard
		});
		ctx.effect(() => () => {
			settingsCard.dispose();
		}, "liangshen: settings card");
	} catch {}
	ctx.slots.inject("conversation.input.right", () => {
		try {
			const unregister = ctx.slots.register({
				name: "conversation.input.right",
				id: "liangshen-lever",
				order: 20,
				inject: () => controller.face()
			}, LiangShenLever);
			return () => {
				unregister();
			};
		} catch {
			return () => {};
		}
	});
}
//#endregion
export { LIANGSHEN_PRESET_ID, LeverController, LiangShenLever, NS, SETTINGS_NAMESPACE, apply, bindSettingsForm, inject, leverState, restoreTarget, servedEntryId };

//# sourceMappingURL=client.js.map