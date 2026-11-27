window.__ModuleLoader__.load({id:`dsh-liangheng`,factory:require=>{var module={exports:{}};var exports=module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let react = require("react");
let react_jsx_runtime = require("react/jsx-runtime");
let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
let react_dom = require("react-dom");
//#region src/client/LiangShenBurst.module.css
var LiangShenBurst_module_default = {
	"banner": "Cbogyq_banner",
	"banner-shake": "Cbogyq_banner-shake",
	"banner-slam": "Cbogyq_banner-slam",
	"bannerName": "Cbogyq_bannerName",
	"burst": "Cbogyq_burst",
	"burst-flash": "Cbogyq_burst-flash",
	"burst-ring": "Cbogyq_burst-ring",
	"code": "Cbogyq_code",
	"code-blink": "Cbogyq_code-blink",
	"flash": "Cbogyq_flash",
	"line": "Cbogyq_line",
	"ring": "Cbogyq_ring",
	"spark": "Cbogyq_spark",
	"spark-fly": "Cbogyq_spark-fly",
	"sparks": "Cbogyq_sparks"
};
//#endregion
//#region src/client/LiangShenBurst.tsx
/**
* The jackpot overlay: flash, shockwave rings, sparks, and the banner.
*
* It plays when the preset picker above the composer lands on LiangHeng mode —
* there is no control here to operate. The slot entry paints nothing while idle
* (the overlay is viewport-fixed and pointer-transparent), so the composer row
* stays exactly as the host drew it.
*/
/** How long the burst overlay stays mounted, matching its CSS duration. */
const BURST_MS = 2200;
/** Jackpot lines that read the same in every language. */
const PIPELINE = "INTENT · INVARIANTS · VERIFIED DIFF";
const STANDARD = "FIRST-PRINCIPLES · HONEST · FAST";
/** One spark per spoke of the burst. */
const SPARKS = Array.from({ length: 14 }, (_, index) => index);
/** Slot entry for `conversation.input.right`: the overlay, and nothing else. */
function LiangShenBurst(face) {
	const { burst } = (0, react.useSyncExternalStore)(face.store.subscribe, face.store.getSnapshot);
	const [burstKey, setBurstKey] = (0, react.useState)(0);
	const seen = (0, react.useRef)(burst);
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
	if (burstKey === 0) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Burst, { face }, burstKey);
}
/** The overlay itself: flash, three rings, the banner, and fourteen sparks. */
function Burst({ face }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
		className: LiangShenBurst_module_default.burst,
		"data-dsh-part": "lever-burst",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: LiangShenBurst_module_default.flash }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: LiangShenBurst_module_default.ring }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: LiangShenBurst_module_default.ring }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: LiangShenBurst_module_default.ring }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: LiangShenBurst_module_default.banner,
				"data-dsh-part": "lever-banner",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: LiangShenBurst_module_default.bannerName,
						children: face.t("lever.name")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: LiangShenBurst_module_default.line,
						children: face.t("burst.line1")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: LiangShenBurst_module_default.line,
						children: face.t("burst.line2")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: LiangShenBurst_module_default.code,
						children: PIPELINE
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: LiangShenBurst_module_default.code,
						children: STANDARD
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: LiangShenBurst_module_default.sparks,
				children: SPARKS.map((spoke) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
					className: LiangShenBurst_module_default.spark,
					style: { rotate: `${spoke * (360 / SPARKS.length)}deg` }
				}, spoke))
			})
		]
	});
}
//#endregion
//#region src/core/lever.ts
/**
* LiangHeng preset identity and the burst trigger rule — framework-free, no
* DOM, compiled by both programs.
*
* The composer owns no mode control any more: the preset picker above it is the
* only place a preset is chosen, and this plugin only answers the landing with
* the burst. The rule is pure so it can be tested without the browser runtime.
*/
/** The preset id this plugin declares; also the preset directory name. */
const LIANGHENG_PRESET_ID = "liangheng";
/** Backward-compatible alias for the preset id. */
const LIANGSHEN_PRESET_ID = LIANGHENG_PRESET_ID;
/**
* Whether a preset reading means "LiangHeng mode just landed" and should fire
* the burst.
*
* Only a change INTO this preset counts, and only inside one session: the first
* reading of a page, a move between two sessions that already run it, and a
* session whose preset can no longer change all read as nothing happening. The
* session guard is what keeps the burst from greeting every page load.
* @param previous - the preset read before this update; undefined on a new session.
* @param next - the preset read now.
* @param sameSession - whether both readings belong to one main-view session.
* @returns true when the burst should play.
*/
function presetLanded(previous, next, sameSession) {
	return sameSession && next === "liangheng" && previous !== "liangheng";
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
//#region src/client/preset-watcher.ts
/** Read the preset a session summary reports, when it reports one. */
function presetOf(session) {
	const value = session?.projectionValues?.["agentPreset"];
	return typeof value === "string" ? value : void 0;
}
/** The watcher: one session reading at a time, one burst per landing. */
var PresetWatcher = class {
	ctx;
	store;
	/**
	* The catalog this watcher follows, resolved defensively: the context proxy
	* throws on any service the fiber did not inject, and a deployment without it
	* must leave the overlay silent rather than take the plugin down.
	*/
	sessions;
	disposers = [];
	/** The one face this watcher hands out; the view reads it on every render. */
	cachedFace;
	/**
	* The translator bound to this plugin's locale namespace, resolved on first
	* use. A lookup that resolved nothing is never cached, so a locale service
	* registered after activation still reaches the same face.
	*/
	cachedTranslate;
	/** Session the last reading belonged to. */
	lastSessionId;
	/** Preset the last reading reported. */
	lastPreset;
	/** False until the first reading seeds the baseline instead of comparing. */
	seeded = false;
	constructor(ctx) {
		this.ctx = ctx;
		this.sessions = readService(() => ctx.sessions);
		this.store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)({ burst: 0 });
	}
	/** The snapshot store the view subscribes to. */
	snapshot() {
		return this.store;
	}
	/** Follow the session catalog; the first reading only seeds the baseline. */
	start() {
		const list = this.sessions?.list;
		if (list !== void 0) this.disposers.push(list.subscribe(() => {
			this.refresh();
		}));
		this.refresh();
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
	* service that arrives later than this watcher still gets its chance.
	*/
	translate() {
		const cached = this.cachedTranslate;
		if (cached !== void 0) return cached;
		const bound = readService(() => this.ctx.locale.bind("liangheng"));
		if (typeof bound !== "function") return void 0;
		this.cachedTranslate = bound;
		return bound;
	}
	/** Compare one reading with the last, and celebrate a landing. */
	refresh() {
		const state = this.sessions?.list.getSnapshot();
		const sessionId = mainViewSessionId(state?.byId);
		const preset = presetOf(sessionId === void 0 ? void 0 : state?.byId[sessionId]);
		if (!this.seeded) {
			this.seeded = true;
			this.lastSessionId = sessionId;
			this.lastPreset = preset;
			return;
		}
		const sameSession = sessionId !== void 0 && sessionId === this.lastSessionId;
		const landed = presetLanded(this.lastPreset, preset, sameSession);
		this.lastSessionId = sessionId;
		this.lastPreset = preset;
		if (!landed) return;
		this.store.set({ burst: this.store.getSnapshot().burst + 1 });
	}
};
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
* Browser-half copy: zh-first dictionary with an English counterpart. The zh
* side is the key-set source of truth; `packages/dsh-i18n` mirrors the keys
* into the centralized ru dictionary and `pnpm i18n:check` enforces parity.
*/
/** Locale namespace this half owns. */
const NS = "liangheng";
/** Browser-half copy, key source of truth. */
const zh = {
	"lever.name": "梁衡模式",
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
	"diagram.close": "关闭预览",
	"queue.count": "{n} 条排队消息",
	"queue.expand": "展开排队消息",
	"queue.collapse": "收起排队消息",
	"queue.edit": "取回编辑",
	"queue.editUnsupported": "含文件的排队消息暂不能取回编辑，请先删除再重发。",
	"queue.remove": "删除排队消息",
	"queue.removeThis": "删除这条",
	"queue.removeHint": "不进草稿",
	"queue.more": "更多操作",
	"queue.steer": "插话发送",
	"queue.steerUnavailable": "当前没有进行中的回复。",
	"queue.sending": "发送中",
	"queue.pullingBack": "取回中",
	"queue.image": "排队消息图片",
	"queue.file": "排队文件 {name}",
	"queue.pullBackFailed": "取回编辑失败，消息仍在队列里。",
	"queue.pullBackLocked": "输入框正在发送，稍后重试。",
	"queue.removeFailed": "删除排队消息失败。",
	"queue.steerFailed": "插话发送失败。"
};
/** English counterpart; the key set mirrors {@link zh} exactly. */
const en = {
	"lever.name": "LiangHeng mode",
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
	"diagram.close": "Close preview",
	"queue.count": "{n} queued message(s)",
	"queue.expand": "Show queued messages",
	"queue.collapse": "Hide queued messages",
	"queue.edit": "Edit in composer",
	"queue.editUnsupported": "A queued file cannot go back to the composer yet — remove it and send again.",
	"queue.remove": "Remove queued message",
	"queue.removeThis": "Delete this message",
	"queue.removeHint": "not kept",
	"queue.more": "More actions",
	"queue.steer": "Steer now",
	"queue.steerUnavailable": "No reply is running.",
	"queue.sending": "Sending",
	"queue.pullingBack": "Pulling back",
	"queue.image": "Queued image",
	"queue.file": "Queued file {name}",
	"queue.pullBackFailed": "Could not pull that message back; it is still queued.",
	"queue.pullBackLocked": "The composer is sending — try again in a moment.",
	"queue.removeFailed": "Could not remove the queued message.",
	"queue.steerFailed": "Could not send that message now."
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
	"actions": "lmij7G_actions",
	"badge": "lmij7G_badge",
	"btn": "lmij7G_btn",
	"btnActive": "lmij7G_btnActive",
	"canvasWrap": "lmij7G_canvasWrap",
	"card": "lmij7G_card",
	"codeWrap": "lmij7G_codeWrap",
	"dialog": "lmij7G_dialog",
	"modalHeader": "lmij7G_modalHeader",
	"modalSvg": "lmij7G_modalSvg",
	"overlay": "lmij7G_overlay",
	"tabs": "lmij7G_tabs",
	"toolbar": "lmij7G_toolbar"
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
//#region src/client/check-list.ts
/** Leading marks per status. Trailing spaces are part of the mark so a line
* starting with `x` or `-` is only a verdict when a space follows it. */
const MARKS = [
	["pass", [
		"✓",
		"✔",
		"✅"
	]],
	["fail", [
		"✗",
		"✘",
		"×",
		"❌",
		"[x] ",
		"[X] ",
		"x ",
		"X "
	]],
	["info", [
		"· ",
		"- ",
		"* ",
		"• "
	]]
];
/** The longest key accepted before the separator; longer prefixes are prose. */
const MAX_KEY_LENGTH = 24;
function takeMark(line) {
	for (const [status, marks] of MARKS) for (const mark of marks) if (line.startsWith(mark)) return {
		status,
		rest: line.slice(mark.length).trim()
	};
	return {
		status: "info",
		rest: line
	};
}
function splitKeyValue(text) {
	const match = /^([^:：]{1,24})[:：]\s*([\s\S]*)$/.exec(text);
	if (match === null || match[1].trim().length > MAX_KEY_LENGTH) return {
		key: "",
		value: text
	};
	return {
		key: match[1].trim(),
		value: match[2].trim()
	};
}
/**
* Parse one `check` fence body.
* @param code - the fence's raw text.
* @returns the parsed rows in source order, and whether any row is a failure.
*/
function parseCheckLines(code) {
	const items = [];
	for (const raw of code.split("\n")) {
		const line = raw.trim();
		if (line === "") continue;
		const { status, rest } = takeMark(line);
		if (rest === "") continue;
		items.push({
			status,
			...splitKeyValue(rest)
		});
	}
	return {
		items,
		failed: items.some((item) => item.status === "fail")
	};
}
//#endregion
//#region src/client/CheckListFence.module.css
var CheckListFence_module_default = {
	"card": "atGGjW_card",
	"key": "atGGjW_key",
	"row": "atGGjW_row",
	"tick": "atGGjW_tick",
	"value": "atGGjW_value"
};
//#endregion
//#region src/client/CheckListFence.tsx
const GLYPH = {
	pass: "✓",
	fail: "✗",
	info: "·"
};
/**
* Render a ```check fence as a compact verification ledger.
*
* Unlike the Mermaid fence this keeps rendering while the fence streams: every
* row is independent, so an incomplete last line only means one short row
* instead of a diagram that would need a full parse to draw anything. A fence
* with no parsable row (or a non-string body) falls through to the host's own
* code block, so `check` never swallows content it cannot render.
* @param props.code - the fence body, one `✓ key: value` per line.
* @param props.children - the host's code block, used as the fallback.
* @returns the ledger card, or the host's block when nothing parses.
*/
function CheckListFence({ code, children }) {
	const list = (0, react.useMemo)(() => typeof code === "string" ? parseCheckLines(code) : null, [code]);
	if (list === null || list.items.length === 0) return children ?? null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: CheckListFence_module_default.card,
		"data-failed": list.failed || void 0,
		role: "list",
		children: list.items.map((item, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: CheckListFence_module_default.row,
			role: "listitem",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: CheckListFence_module_default.tick,
					"data-status": item.status,
					"aria-hidden": "true",
					children: GLYPH[item.status]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: CheckListFence_module_default.key,
					children: item.key
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: CheckListFence_module_default.value,
					children: item.value
				})
			]
		}, `${index}:${item.key}`))
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
//#region src/client/queue-pullback.ts
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
/** The durable reference a non-text block carries, already validated as addressable. */
function attachmentOf(block) {
	const candidate = block.attachment;
	if (!isRecord(candidate)) return void 0;
	const { attachmentId } = candidate;
	return typeof attachmentId === "string" && attachmentId !== "" ? candidate : void 0;
}
/**
* Read one queued row's content into the pieces the composer can take back.
* @param content - the row's wire content blocks.
* @returns its text, plus the durable images and files it references.
*/
function planPullBack(content) {
	const texts = [];
	const images = [];
	const files = [];
	for (const block of content) {
		if (block.type === "text") {
			const { text } = block;
			if (typeof text === "string") texts.push(text);
			continue;
		}
		const attachment = attachmentOf(block);
		if (attachment === void 0) continue;
		const { mediaType, name } = attachment;
		if (block.type === "image" && typeof mediaType === "string" && mediaType !== "") {
			images.push(attachment);
			continue;
		}
		if (block.type === "file" && typeof name === "string" && name !== "") files.push(attachment);
	}
	return {
		text: texts.join(""),
		images,
		files
	};
}
/**
* Whether the composer can take this row back whole.
* @param plan - the row's pull-back plan.
* @returns false when the row carries a file the composer has no way to re-open.
*/
function pullBackSupported(plan) {
	return plan.files.length === 0;
}
/**
* Filename to give a re-staged image: its own name when it had one, otherwise
* one derived from the media type so the composer rail shows a sane label.
* @param image - one queued image reference.
* @returns a display filename.
*/
function imageFileName(image) {
	if (image.name !== void 0 && image.name !== "") return image.name;
	const subtype = image.mediaType.split("/")[1];
	return `image.${subtype === void 0 || subtype === "" ? "png" : subtype}`;
}
//#endregion
//#region src/client/QueueStrip.module.css
var QueueStrip_module_default = {
	"action": "_4ssDtq_action",
	"actions": "_4ssDtq_actions",
	"attachments": "_4ssDtq_attachments",
	"chevron": "_4ssDtq_chevron",
	"count": "_4ssDtq_count",
	"dock": "_4ssDtq_dock",
	"error": "_4ssDtq_error",
	"file": "_4ssDtq_file",
	"fileName": "_4ssDtq_fileName",
	"header": "_4ssDtq_header",
	"lead": "_4ssDtq_lead",
	"list": "_4ssDtq_list",
	"menu": "_4ssDtq_menu",
	"menuHint": "_4ssDtq_menuHint",
	"menuItem": "_4ssDtq_menuItem",
	"menuLabel": "_4ssDtq_menuLabel",
	"panel": "_4ssDtq_panel",
	"pendingRow": "_4ssDtq_pendingRow",
	"preview": "_4ssDtq_preview",
	"primary": "_4ssDtq_primary",
	"row": "_4ssDtq_row",
	"status": "_4ssDtq_status",
	"thumb": "_4ssDtq_thumb"
};
//#endregion
//#region src/client/QueueStrip.tsx
/**
* Queued-message strip.
*
* This takes over the host's `conversation.input.dock` list cell `queue` by
* registering the same id at a lower priority, because the one behaviour worth
* changing lives inside that component: its Edit action is text-only, and an
* image- or file-bearing row is refused (`queue.edit.unsupported`). Here Edit
* pulls the row back into the composer, images and all, so the next edit
* happens in the real editor and the message is re-sent from there.
*
* Round trip: stage the durable images into draft attachments first (the only
* step that can fail on bytes), write text and attachments into the composer,
* and only then remove the queue row. Failures leave the row queued — a
* duplicated message is recoverable, a lost one is not.
*
* Order and copy follow the host strip: a single row renders inline, several
* collapse behind a count header, locally sending submissions stay visible but
* inert.
*/
const EMPTY_ROWS = [];
const EMPTY_PENDING = [];
/**
* Focus the composer editor after a pull-back.
*
* `InputActions` has no focus verb, so this reaches for the editor the shell
* marks with the same `data-*` attributes this package's stylesheet already
* keys on. A shell that renames them only costs the focus, never the pull-back.
*/
function focusComposer() {
	try {
		document.querySelector("[data-composer-card] [contenteditable=\"true\"]")?.focus({ preventScroll: true });
	} catch {}
}
/** One queued image thumbnail, resolved through the Session's image cache. */
function QueueThumb({ image, imageUrl, label }) {
	const [url, setUrl] = (0, react.useState)(null);
	(0, react.useEffect)(() => {
		let live = true;
		imageUrl(image).then((resolved) => {
			if (live) setUrl(resolved);
		}, () => {
			if (live) setUrl(null);
		});
		return () => {
			live = false;
		};
	}, [image, imageUrl]);
	if (url === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
		className: QueueStrip_module_default.thumb,
		"data-pending": "",
		"aria-hidden": "true"
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
		className: QueueStrip_module_default.thumb,
		src: url,
		alt: label
	});
}
/** One durable file badge; files cannot round-trip, so this never opens them. */
function QueueFile({ name, label }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
		className: QueueStrip_module_default.file,
		title: label,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: QueueStrip_module_default.fileName,
			children: name
		})
	});
}
/** Minimal inline glyphs: the stepper avoids pulling the host's icon package into this bundle. */
function StripGlyph({ kind }) {
	const path = {
		queue: "M2 4h7M2 7h7M2 10h7",
		"chevron-down": "M3.5 5.5 6 8l2.5-2.5",
		"chevron-up": "M3.5 8.5 6 6l2.5 2.5",
		trash: "M3 4h6M5 4V3h2v1M4.5 4l.4 5.5h2.2L7.5 4",
		steer: "M2.5 3v3.2a1.6 1.6 0 0 0 1.6 1.6H8M8 5l2.2 2.6L8 10.2",
		more: "M3 6h.01M6 6h.01M9 6h.01"
	}[kind];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		width: "12",
		height: "12",
		viewBox: "0 0 12 12",
		fill: "none",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			d: path,
			stroke: "currentColor",
			strokeWidth: kind === "more" ? 1.9 : 1.2,
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
/**
* One row's action menu, portalled to the body.
*
* The strip lives inside a clipping panel (rounded corners, capped height), so
* an absolutely positioned menu would be cut off by the list scrollport. A
* portal keeps it above the composer; an outside press, Escape, scroll or
* resize dismisses it.
*/
function RowMenu({ anchor, removeLabel, removeAria, hint, onDelete, onClose }) {
	const ref = (0, react.useRef)(null);
	(0, react.useEffect)(() => {
		const dismiss = (event) => {
			const target = event.target;
			if (target !== null && (ref.current?.contains(target) === true || anchor.contains(target))) return;
			onClose();
		};
		const close = () => {
			onClose();
		};
		document.addEventListener("mousedown", dismiss);
		window.addEventListener("resize", close);
		window.addEventListener("scroll", close, true);
		return () => {
			document.removeEventListener("mousedown", dismiss);
			window.removeEventListener("resize", close);
			window.removeEventListener("scroll", close, true);
		};
	}, [anchor, onClose]);
	(0, react.useEffect)(() => {
		ref.current?.querySelector("[role=\"menuitem\"]")?.focus();
	}, []);
	const rect = anchor.getBoundingClientRect();
	return (0, react_dom.createPortal)(/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		ref,
		className: QueueStrip_module_default.menu,
		role: "menu",
		style: {
			top: rect.bottom + 4,
			right: Math.max(8, window.innerWidth - rect.right)
		},
		onKeyDown: (event) => {
			if (event.key !== "Escape") return;
			event.stopPropagation();
			anchor.focus();
			onClose();
		},
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
			type: "button",
			role: "menuitem",
			className: QueueStrip_module_default.menuItem,
			"aria-label": removeAria,
			onClick: onDelete,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(StripGlyph, { kind: "trash" }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: QueueStrip_module_default.menuLabel,
					children: removeLabel
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: QueueStrip_module_default.menuHint,
					children: hint
				})
			]
		})
	}), document.body);
}
/**
* Render the queued-message strip.
* @param props - dock owner share, Session standard kit, bound face, and copy.
* @returns the strip, or nothing while the queue is empty.
*/
function QueueStrip(props) {
	const { useProjection, useSession, inputActions, stage, remove, steer, imageUrl, t } = props;
	const rows = useProjection("inbox")?.["next-turn"] ?? EMPTY_ROWS;
	const pendingSubmissions = useSession((s) => s.pendingSubmissions) ?? EMPTY_PENDING;
	const running = useSession((s) => s.running);
	const uploadImages = useSession((s) => s.subagent === null);
	const queueMutable = useSession((s) => s.subagent === null || s.subagent.address.mode === "continuable");
	const queue = (0, react.useMemo)(() => {
		const inChat = new Set(pendingSubmissions.filter((item) => item.placement === "transcript").map((item) => item.requestId));
		if (inChat.size === 0) return rows;
		return rows.filter(({ source }) => {
			const echo = source;
			return echo?.kind !== "user" || echo.rpcId === void 0 || !inChat.has(echo.rpcId);
		});
	}, [pendingSubmissions, rows]);
	const pendingQueue = (0, react.useMemo)(() => {
		const admitted = new Set(queue.flatMap(({ source }) => {
			const echo = source;
			return echo?.kind === "user" && echo.rpcId !== void 0 ? [echo.rpcId] : [];
		}));
		return pendingSubmissions.filter((item) => item.placement === "queued" && !admitted.has(item.requestId));
	}, [pendingSubmissions, queue]);
	const rowCount = queue.length + pendingQueue.length;
	const [busy, setBusy] = (0, react.useState)(null);
	const [collapsed, setCollapsed] = (0, react.useState)(true);
	const [error, setError] = (0, react.useState)(null);
	/** The row whose ⋯ menu is open, with the button it hangs off. */
	const [menuFor, setMenuFor] = (0, react.useState)(null);
	const listId = (0, react.useId)();
	(0, react.useEffect)(() => {
		if (rowCount === 0 && !collapsed) setCollapsed(true);
	}, [collapsed, rowCount]);
	(0, react.useEffect)(() => {
		if (error !== null && rowCount === 0) setError(null);
	}, [error, rowCount]);
	if (rowCount === 0) return null;
	const expanded = !collapsed || busy !== null;
	const listVisible = rowCount === 1 || expanded;
	/** Move one queued message back into the composer, then retire its queue row. */
	const pullBack = async (row) => {
		setError(null);
		if (!pullBackSupported(planPullBack(row.content))) {
			setError(t("queue.editUnsupported"));
			return;
		}
		setBusy(row.id);
		try {
			const staged = await stage(row, uploadImages);
			const text = staged.text;
			if (text !== "") {
				if (!inputActions.insertText(text, inputActions.captureInsertion())) inputActions.setDraft(text);
			}
			if (staged.draftIds.length > 0 && !inputActions.addAttachments(staged.draftIds)) {
				for (const id of staged.draftIds) inputActions.removeAttachment(id);
				setError(t("queue.pullBackLocked"));
				return;
			}
			await remove(row.id);
			focusComposer();
		} catch {
			setError(t("queue.pullBackFailed"));
		} finally {
			setBusy((current) => current === row.id ? null : current);
		}
	};
	const act = async (id, action) => {
		setError(null);
		setBusy(id);
		try {
			if (action === "remove") await remove(id);
			else await steer(id);
		} catch {
			setError(action === "remove" ? t("queue.removeFailed") : t("queue.steerFailed"));
		} finally {
			setBusy((current) => current === id ? null : current);
		}
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: QueueStrip_module_default.dock,
		"data-queue-dock": "",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: QueueStrip_module_default.panel,
			children: [
				rowCount > 1 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: QueueStrip_module_default.header,
					"aria-controls": listId,
					"aria-expanded": expanded,
					"aria-label": expanded ? t("queue.collapse") : t("queue.expand"),
					disabled: busy !== null,
					onClick: () => {
						setCollapsed((value) => !value);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: QueueStrip_module_default.lead,
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StripGlyph, { kind: "queue" })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: QueueStrip_module_default.count,
							children: t("queue.count", { n: rowCount })
						}),
						!listVisible && pendingQueue.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: QueueStrip_module_default.status,
							role: "status",
							children: t("queue.sending")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: QueueStrip_module_default.chevron,
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StripGlyph, { kind: expanded ? "chevron-down" : "chevron-up" })
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("ul", {
					id: listId,
					className: QueueStrip_module_default.list,
					hidden: !listVisible,
					children: [listVisible && queue.map((row) => {
						const plan = planPullBack(row.content);
						const supported = pullBackSupported(plan);
						const rowBusy = busy === row.id;
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
							className: QueueStrip_module_default.row,
							"data-interactive": queueMutable && busy === null ? "" : void 0,
							onClick: queueMutable && busy === null ? () => {
								pullBack(row);
							} : void 0,
							children: [
								rowCount === 1 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: QueueStrip_module_default.lead,
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StripGlyph, { kind: "queue" })
								}),
								(plan.images.length > 0 || plan.files.length > 0) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: QueueStrip_module_default.attachments,
									children: [plan.images.map((image, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QueueThumb, {
										image,
										imageUrl,
										label: t("queue.image")
									}, `${image.attachmentId}:${index}`)), plan.files.map((file, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QueueFile, {
										name: file.name,
										label: t("queue.file", { name: file.name })
									}, `${file.attachmentId}:${index}`))]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: QueueStrip_module_default.preview,
									children: plan.text
								}),
								queueMutable && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: QueueStrip_module_default.actions,
									onClick: (event) => {
										event.stopPropagation();
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: QueueStrip_module_default.primary,
											"aria-label": t("queue.edit"),
											title: supported ? t("queue.edit") : t("queue.editUnsupported"),
											disabled: busy !== null,
											onClick: () => {
												pullBack(row);
											},
											children: t("queue.edit")
										}),
										running && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: QueueStrip_module_default.action,
											"aria-label": t("queue.steer"),
											title: t("queue.steer"),
											disabled: busy !== null,
											onClick: () => {
												act(row.id, "steer");
											},
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StripGlyph, { kind: "steer" })
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: QueueStrip_module_default.action,
											"aria-label": t("queue.more"),
											title: t("queue.more"),
											"aria-haspopup": "menu",
											"aria-expanded": menuFor?.id === row.id,
											disabled: busy !== null,
											onClick: (event) => {
												const anchor = event.currentTarget;
												setMenuFor((current) => current?.id === row.id ? null : {
													id: row.id,
													anchor
												});
											},
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StripGlyph, { kind: "more" })
										}),
										rowBusy && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: QueueStrip_module_default.status,
											role: "status",
											children: t("queue.pullingBack")
										})
									]
								})
							]
						}, row.id);
					}), listVisible && pendingQueue.map((submission) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
						className: `${QueueStrip_module_default.row} ${QueueStrip_module_default.pendingRow}`,
						"data-submission-echo": "",
						children: [
							rowCount === 1 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: QueueStrip_module_default.lead,
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StripGlyph, { kind: "queue" })
							}),
							submission.attachments.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: QueueStrip_module_default.attachments,
								children: submission.attachments.map((attachment, index) => attachment.type === "image" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
									className: QueueStrip_module_default.thumb,
									src: attachment.value.previewUrl,
									alt: t("queue.image")
								}, `${attachment.value.previewUrl}:${index}`) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QueueFile, {
									name: attachment.value.name,
									label: t("queue.file", { name: attachment.value.name })
								}, `${attachment.value.attachmentId}:${index}`))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: QueueStrip_module_default.preview,
								children: submission.text
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: QueueStrip_module_default.status,
								role: "status",
								children: t("queue.sending")
							})
						]
					}, submission.requestId))]
				}),
				menuFor !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RowMenu, {
					anchor: menuFor.anchor,
					removeLabel: t("queue.removeThis"),
					removeAria: t("queue.remove"),
					hint: t("queue.removeHint"),
					onDelete: () => {
						const id = menuFor.id;
						setMenuFor(null);
						act(id, "remove");
					},
					onClose: () => {
						setMenuFor(null);
					}
				}),
				error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: QueueStrip_module_default.error,
					role: "status",
					children: error
				})
			]
		})
	});
}
/** Face for a Session whose services are missing: every verb reports the reason. */
function unavailableFace(reason) {
	const fail = () => Promise.reject(new Error(reason));
	return {
		stage: fail,
		remove: fail,
		steer: fail,
		imageUrl: fail
	};
}
/**
* Bind the strip's face for one Session.
* @param ctx - the browser plugin context.
* @param sessionId - Session the dock entry is rendering for.
* @returns the queue verbs, or undefined when this shell cannot supply them.
*/
function bindFace(ctx, sessionId) {
	const conversation = ctx.sessions?.scope?.(sessionId)?.get("conversation");
	const uiConversation = ctx.get("uiConversation");
	if (conversation === void 0 || uiConversation === void 0) return void 0;
	if (typeof conversation.createDrafts !== "function") return void 0;
	const updateQueue = conversation.updateQueue.bind(conversation);
	return {
		async stage(row, uploadImages) {
			const plan = planPullBack(row.content);
			const draftIds = [];
			for (const image of plan.images) {
				const response = await fetch(await uiConversation.imageUrl(sessionId, image));
				if (!response.ok && response.status !== 0) throw new Error(`queue pull-back: image ${image.attachmentId} read ${response.status}`);
				const file = new File([await response.blob()], imageFileName(image), { type: image.mediaType });
				draftIds.push(...conversation.createDrafts(sessionId, [file], uploadImages).map((draft) => draft.id));
			}
			return {
				text: plan.text,
				draftIds
			};
		},
		remove: (id) => updateQueue(id, { kind: "remove" }),
		steer: (id) => updateQueue(id, { kind: "steer" }),
		imageUrl: (ref) => uiConversation.imageUrl(sessionId, ref)
	};
}
/**
* Take over the host's queue strip.
*
* The registration reuses the host cell id `queue` at priority -1: same-cell
* registrations coexist at distinct priorities and the lowest renders, which is
* the framework's documented replacement point (`slots.zh.md`, "复用已有 cell
* 表示有意替换其展示"). A Session whose services are missing gets a face that
* reports the gap instead of a crash, so the dock keeps rendering.
* @param ctx - the browser plugin context.
*/
function installQueueStrip(ctx) {
	ctx.slots.inject("conversation.input.dock", () => {
		try {
			const unregister = ctx.slots.register({
				name: "conversation.input.dock",
				id: "queue",
				order: 20,
				priority: -1,
				locale: NS,
				inject: (sessionId) => bindFace(ctx, sessionId) ?? unavailableFace("liangheng queue strip: the conversation service is unavailable")
			}, QueueStrip);
			return () => {
				unregister();
			};
		} catch {
			return () => {};
		}
	});
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
* Required client services: the slot registry, locale, sessions, and the shared
* configuration forms. No Remote namespace is injected any more: the preset
* picker above the composer performs the switch, and this half only reads the
* `agentPreset` projection the host publishes on the session catalog.
*/
const inject = [
	"slots",
	"locale",
	"sessions",
	"configForms"
];
/**
* Mount the browser half: register the copy, follow the preset the session
* catalog reports, and play the burst when it lands on LiangHeng mode.
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
	const watcher = new PresetWatcher(ctx);
	ctx.effect(() => () => watcher.dispose(), "liangheng: preset watcher");
	try {
		watcher.start();
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
				id: "liangheng-burst",
				inject: () => watcher.face()
			}, LiangShenBurst);
			return () => {
				unregister();
			};
		} catch {
			return () => {};
		}
	});
	installQueueStrip(ctx);
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
	for (const fenceKey of ["check", "checks"]) ctx.slots.inject("conversation.chat.markdown.fence", () => {
		try {
			const unregister = ctx.slots.register({
				name: "conversation.chat.markdown.fence",
				key: fenceKey,
				id: `dsh-liangheng/fence/${fenceKey}`,
				locale: NS
			}, CheckListFence);
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
exports.LiangShenBurst = LiangShenBurst;
exports.NS = NS;
exports.PresetWatcher = PresetWatcher;
exports.SETTINGS_NAMESPACE = SETTINGS_NAMESPACE;
exports.apply = apply;
exports.bindSettingsForm = bindSettingsForm;
exports.inject = inject;
exports.presetLanded = presetLanded;
exports.servedEntryId = servedEntryId;


{
  const css = ".Cbogyq_burst {\n  z-index: 60;\n  pointer-events: none;\n  place-items: center;\n  font-size: 14px;\n  line-height: 1.5;\n  display: grid;\n  position: fixed;\n  inset: 0;\n  overflow: hidden;\n}\n\n.Cbogyq_flash {\n  background: radial-gradient(circle at 50% 62%, #fff6c8eb, #ffd04a73 38%, #ffa00000 72%);\n  animation: .72s ease-out both Cbogyq_burst-flash;\n  position: absolute;\n  inset: 0;\n}\n\n.Cbogyq_ring {\n  border: 6px solid #ffd65ad9;\n  border-radius: 50%;\n  width: 220px;\n  height: 220px;\n  animation: 1.1s cubic-bezier(.16, .9, .3, 1) both Cbogyq_burst-ring;\n  position: absolute;\n}\n\n.Cbogyq_ring:nth-of-type(2) {\n  animation-delay: .12s;\n}\n\n.Cbogyq_ring:nth-of-type(3) {\n  animation-delay: .24s;\n}\n\n.Cbogyq_banner {\n  color: #ffe9a8;\n  text-align: center;\n  background: linear-gradient(160deg, #181004f0, #402604eb);\n  border-radius: 22px;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  padding: 22px 40px;\n  animation: .6s cubic-bezier(.16, 1.5, .3, 1) both Cbogyq_banner-slam, .5s ease-in-out .6s 2 Cbogyq_banner-shake;\n  display: flex;\n  position: relative;\n  box-shadow: 0 0 0 2px #ffd65abf, 0 24px 70px #00000073;\n}\n\n.Cbogyq_bannerName {\n  letter-spacing: .16em;\n  background: linear-gradient(#fff6d0, #ffc93c 55%, #b8730a);\n  color: #0000;\n  text-shadow: 0 0 24px #ffc93ca6;\n  -webkit-background-clip: text;\n  background-clip: text;\n  font-size: 44px;\n  font-weight: 800;\n  line-height: 1.35;\n  display: block;\n}\n\n.Cbogyq_line {\n  letter-spacing: .08em;\n  font-size: 15px;\n}\n\n.Cbogyq_code {\n  font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);\n  letter-spacing: .06em;\n  opacity: .82;\n  font-size: 11px;\n  animation: .5s steps(2, end) 6 Cbogyq_code-blink;\n}\n\n.Cbogyq_sparks {\n  place-items: center;\n  display: grid;\n  position: absolute;\n  inset: 0;\n}\n\n.Cbogyq_spark {\n  transform-origin: 50%;\n  background: linear-gradient(#ffeca0f2, #ffaa1400);\n  border-radius: 3px;\n  grid-area: 1 / 1;\n  width: 3px;\n  height: 30px;\n  animation: .95s ease-out both Cbogyq_spark-fly;\n}\n\n@keyframes Cbogyq_burst-flash {\n  0% {\n    opacity: 0;\n    transform: scale(.6);\n  }\n\n  18% {\n    opacity: 1;\n  }\n\n  100% {\n    opacity: 0;\n    transform: scale(1.5);\n  }\n}\n\n@keyframes Cbogyq_burst-ring {\n  0% {\n    opacity: .9;\n    transform: scale(.2);\n  }\n\n  100% {\n    opacity: 0;\n    transform: scale(3.4);\n  }\n}\n\n@keyframes Cbogyq_banner-slam {\n  0% {\n    opacity: 0;\n    transform: scale(3.6) rotate(-9deg);\n  }\n\n  55% {\n    opacity: 1;\n    transform: scale(.94) rotate(1.5deg);\n  }\n\n  75% {\n    transform: scale(1.06) rotate(-1deg);\n  }\n\n  100% {\n    opacity: 1;\n    transform: scale(1) rotate(0);\n  }\n}\n\n@keyframes Cbogyq_banner-shake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n\n  25% {\n    transform: translateX(-9px) rotate(-.6deg);\n  }\n\n  75% {\n    transform: translateX(9px) rotate(.6deg);\n  }\n}\n\n@keyframes Cbogyq_spark-fly {\n  0% {\n    opacity: 0;\n    transform: translateY(-40px) scaleY(.3);\n  }\n\n  18% {\n    opacity: 1;\n  }\n\n  100% {\n    opacity: 0;\n    transform: translateY(-300px) scaleY(1.15);\n  }\n}\n\n@keyframes Cbogyq_code-blink {\n  0%, 100% {\n    opacity: .35;\n  }\n\n  50% {\n    opacity: 1;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .Cbogyq_flash, .Cbogyq_ring, .Cbogyq_banner, .Cbogyq_code, .Cbogyq_spark {\n    animation: none;\n  }\n\n  .Cbogyq_burst {\n    animation: .3s ease-out both Cbogyq_burst-flash;\n  }\n\n  .Cbogyq_spark {\n    display: none;\n  }\n}\n._3KtWIa_card {\n  --settings-card-radius: 12px;\n  --settings-card-header-pad: 16px;\n  --settings-card-header-gap: 13px;\n  --settings-card-title-size: 15px;\n  --settings-card-description-size: 13px;\n  --settings-card-body-inset: 16px;\n  --settings-card-motion: .18s;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-3);\n  border-radius: var(--settings-card-radius);\n  list-style: none;\n  transition: border-color .16s, background .16s;\n}\n\n._3KtWIa_card:hover {\n  border-color: var(--dsw-alias-label-dimmed);\n}\n\n._3KtWIa_cardOpen {\n  background: var(--dsw-alias-bg-layer-2);\n  border-color: var(--dsw-alias-label-dimmed);\n}\n\n._3KtWIa_cardNested {\n  --settings-card-radius: 10px;\n  --settings-card-header-pad: 10px 12px;\n  --settings-card-header-gap: 10px;\n  --settings-card-title-size: 13px;\n  --settings-card-description-size: 12px;\n  --settings-card-body-inset: 12px;\n}\n\n._3KtWIa_cardNested ._3KtWIa_description {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n\n._3KtWIa_header {\n  appearance: none;\n  box-sizing: border-box;\n  width: 100%;\n  font: inherit;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n  border-radius: var(--settings-card-radius);\n  align-items: center;\n  gap: var(--settings-card-header-gap);\n  padding: var(--settings-card-header-pad);\n  background: none;\n  border: 0;\n  display: flex;\n}\n\n._3KtWIa_header:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: -2px;\n}\n\n._3KtWIa_headerStatic {\n  box-sizing: border-box;\n  border-radius: var(--settings-card-radius);\n  align-items: center;\n  gap: var(--settings-card-header-gap);\n  width: 100%;\n  padding: var(--settings-card-header-pad);\n  display: flex;\n}\n\n._3KtWIa_headText {\n  flex-direction: column;\n  flex: 1;\n  gap: 4px;\n  min-width: 0;\n  display: flex;\n}\n\n._3KtWIa_mark {\n  background: var(--dsw-alias-bg-module-platform);\n  width: 34px;\n  height: 34px;\n  color: var(--dsw-alias-label-secondary);\n  border-radius: 10px;\n  flex: none;\n  place-items: center;\n  transition: color .16s;\n  display: grid;\n}\n\n._3KtWIa_header:hover ._3KtWIa_mark, ._3KtWIa_cardOpen ._3KtWIa_mark {\n  color: var(--dsw-alias-label-primary);\n}\n\n._3KtWIa_name {\n  color: var(--dsw-alias-label-primary);\n  font-size: var(--settings-card-title-size);\n  font-weight: 600;\n  line-height: 1.4;\n}\n\n._3KtWIa_description {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._3KtWIa_headerAction {\n  flex: none;\n  align-items: center;\n  display: inline-flex;\n}\n\n._3KtWIa_chevron {\n  color: var(--dsw-alias-label-tertiary);\n  flex: none;\n  width: 16px;\n  height: 16px;\n  transition: transform .16s, color .16s;\n}\n\n._3KtWIa_header:hover ._3KtWIa_chevron {\n  color: var(--dsw-alias-label-secondary);\n}\n\n._3KtWIa_chevronOpen {\n  transform: rotate(180deg);\n}\n\n._3KtWIa_disclosure {\n  opacity: 0;\n  transition: grid-template-rows var(--settings-card-motion) ease, opacity var(--settings-card-motion) ease;\n  grid-template-rows: 0fr;\n  display: grid;\n}\n\n._3KtWIa_disclosure[data-state=\"collapsed\"], ._3KtWIa_disclosure[data-state=\"entering\"], ._3KtWIa_disclosure[data-state=\"closing\"] {\n  overflow: hidden;\n}\n\n._3KtWIa_disclosure[data-state=\"entering\"], ._3KtWIa_disclosure[data-state=\"shown\"] {\n  opacity: 1;\n  grid-template-rows: 1fr;\n}\n\n._3KtWIa_disclosure > ._3KtWIa_body {\n  min-height: 0;\n}\n\n._3KtWIa_body {\n  border-top: 1px solid var(--dsw-alias-border-l2);\n  margin: 0 var(--settings-card-body-inset);\n  padding-bottom: 8px;\n  container: _3KtWIa_settings-card / inline-size;\n}\n\n._3KtWIa_readOnly {\n  color: var(--dsw-alias-label-secondary);\n  margin: 12px 0 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n._3KtWIa_notExposed {\n  color: var(--dsw-alias-state-warn-primary);\n  margin: 12px 0 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n._3KtWIa_failed {\n  color: var(--dsw-alias-state-error-primary, #b42318);\n  overflow-wrap: anywhere;\n  margin: 8px 0 4px;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._3KtWIa_field {\n  grid-template-columns: minmax(0, 1fr) fit-content(50%);\n  grid-template-areas: \"_3KtWIa_head _3KtWIa_control\"\n                       \"_3KtWIa_hint _3KtWIa_control\";\n  align-items: center;\n  gap: 4px 24px;\n  padding: 16px 0;\n  display: grid;\n}\n\n._3KtWIa_field > ._3KtWIa_head {\n  grid-area: _3KtWIa_head;\n}\n\n._3KtWIa_field > :is(._3KtWIa_hint, ._3KtWIa_invalid) {\n  grid-area: _3KtWIa_hint;\n}\n\n._3KtWIa_field > :not(._3KtWIa_head, ._3KtWIa_hint, ._3KtWIa_invalid) {\n  grid-area: _3KtWIa_control;\n  justify-self: end;\n  max-width: 100%;\n}\n\n._3KtWIa_field + ._3KtWIa_field {\n  border-top: 1px solid var(--dsw-alias-border-l2);\n}\n\n._3KtWIa_head {\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n\n._3KtWIa_label {\n  min-width: 0;\n  color: var(--dsw-alias-label-primary);\n  flex: 1;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 22px;\n}\n\n._3KtWIa_badges {\n  align-items: center;\n  gap: 8px;\n  display: inline-flex;\n}\n\n._3KtWIa_badge {\n  white-space: nowrap;\n  background: var(--dsw-alias-bg-module-platform);\n  color: var(--dsw-alias-label-secondary);\n  border-radius: 999px;\n  padding: 1px 8px;\n  font-size: 11px;\n  font-weight: 500;\n  line-height: 17px;\n}\n\n._3KtWIa_reset {\n  font: inherit;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  background: none;\n  border: none;\n  padding: 0;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n._3KtWIa_reset:hover:not(:disabled) {\n  color: var(--dsw-alias-label-primary);\n}\n\n._3KtWIa_reset:disabled {\n  cursor: default;\n}\n\n._3KtWIa_reset:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: 2px;\n}\n\n._3KtWIa_segmentGroup {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 7%, transparent);\n  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent);\n  border-radius: 8px;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 2px;\n  padding: 2px;\n  display: inline-flex;\n  position: relative;\n}\n\n._3KtWIa_segment {\n  appearance: none;\n  color: var(--dsw-alias-label-secondary);\n  font: inherit;\n  white-space: nowrap;\n  cursor: pointer;\n  background: none;\n  border: 0;\n  border-radius: 7px;\n  margin: 0;\n  padding: 3px 12px;\n  font-size: 13px;\n  font-weight: 500;\n  line-height: 18px;\n  transition: background-color .12s, color .12s;\n}\n\n._3KtWIa_segment:hover:not(:disabled):not([data-active]) {\n  color: var(--dsw-alias-label-primary);\n}\n\n._3KtWIa_segmentGroup:not([data-pill]) > ._3KtWIa_segment[data-active], ._3KtWIa_segmentGroup[data-pill]:before {\n  background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-3));\n  box-shadow: 0 1px 2px #14141314;\n}\n\nbody[data-ds-dark-theme] ._3KtWIa_segmentGroup:not([data-pill]) > ._3KtWIa_segment[data-active], body[data-ds-dark-theme] ._3KtWIa_segmentGroup[data-pill]:before {\n  box-shadow: none;\n  background: #ffffff24;\n}\n\n._3KtWIa_segment[data-active] {\n  color: var(--dsw-alias-label-primary);\n}\n\n._3KtWIa_segmentGroup[data-pill]:before {\n  content: \"\";\n  width: var(--segment-pill-w, 0px);\n  height: var(--segment-pill-h, 0px);\n  transform: translate(var(--segment-pill-x, 0px), var(--segment-pill-y, 0px));\n  pointer-events: none;\n  border-radius: 7px;\n  transition: transform .24s cubic-bezier(.22, .61, .36, 1), width .24s cubic-bezier(.22, .61, .36, 1), height .24s cubic-bezier(.22, .61, .36, 1);\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n._3KtWIa_segmentGroup > * {\n  z-index: 1;\n  position: relative;\n}\n\n._3KtWIa_segment:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: 1px;\n}\n\n._3KtWIa_segment:disabled {\n  cursor: not-allowed;\n  opacity: .45;\n}\n\n._3KtWIa_segmentGroup[data-pill]:has( > ._3KtWIa_segment:disabled):before {\n  opacity: .45;\n}\n\n._3KtWIa_input, ._3KtWIa_select {\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-3);\n  height: 34px;\n  font: inherit;\n  color: var(--dsw-alias-label-primary);\n  border-radius: 8px;\n  padding: 0 12px;\n  font-size: 13px;\n  line-height: 1.5;\n}\n\n._3KtWIa_input:focus-visible, ._3KtWIa_select:focus-visible {\n  border-color: var(--dsw-alias-brand-primary);\n  outline: none;\n}\n\n._3KtWIa_input:disabled, ._3KtWIa_select:disabled {\n  color: var(--dsw-alias-label-tertiary);\n  cursor: default;\n}\n\n._3KtWIa_inputInvalid {\n  border: 1px solid var(--dsw-alias-state-error-primary, #b42318);\n  background: var(--dsw-alias-bg-layer-3);\n  height: 34px;\n  font: inherit;\n  color: var(--dsw-alias-label-primary);\n  border-radius: 8px;\n  padding: 0 12px;\n  font-size: 13px;\n  line-height: 1.5;\n}\n\n._3KtWIa_inputInvalid:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-error-primary, #b42318);\n  outline-offset: 1px;\n  border-color: var(--dsw-alias-state-error-primary, #b42318);\n}\n\n._3KtWIa_field > :is(._3KtWIa_input, ._3KtWIa_inputInvalid, ._3KtWIa_select, ._3KtWIa_selectWrap, ._3KtWIa_rangeAnchor) {\n  box-sizing: border-box;\n  width: 220px;\n}\n\n._3KtWIa_rangeAnchor > :is(._3KtWIa_input, ._3KtWIa_inputInvalid) {\n  box-sizing: border-box;\n  width: 100%;\n}\n\n@container _3KtWIa_settings-card (width <= 440px) {\n  ._3KtWIa_field {\n    grid-template-columns: minmax(0, 1fr);\n    grid-template-areas: \"_3KtWIa_head\"\n                         \"_3KtWIa_hint\"\n                         \"_3KtWIa_control\";\n    row-gap: 8px;\n  }\n\n  ._3KtWIa_field > :not(._3KtWIa_head, ._3KtWIa_hint, ._3KtWIa_invalid) {\n    justify-self: start;\n  }\n\n  ._3KtWIa_field > :is(._3KtWIa_input, ._3KtWIa_inputInvalid, ._3KtWIa_select, ._3KtWIa_selectWrap, ._3KtWIa_rangeAnchor) {\n    justify-self: stretch;\n    width: auto;\n  }\n}\n\n._3KtWIa_selectWrap {\n  position: relative;\n}\n\n._3KtWIa_selectButton {\n  appearance: none;\n  text-align: left;\n  cursor: pointer;\n  justify-content: space-between;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  display: flex;\n}\n\n._3KtWIa_selectLabel {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  overflow: hidden;\n}\n\n._3KtWIa_selectChevron {\n  color: var(--dsw-alias-label-tertiary);\n  flex: none;\n  transition: transform .16s;\n}\n\n._3KtWIa_selectChevronOpen {\n  transform: rotate(180deg);\n}\n\n._3KtWIa_selectPopup {\n  z-index: 40;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-3);\n  max-height: 240px;\n  box-shadow: 0 8px 24px var(--dsw-alias-bg-mask-2);\n  opacity: 0;\n  border-radius: 8px;\n  flex-direction: column;\n  padding: 4px;\n  transition: opacity .1s, transform .1s;\n  display: flex;\n  position: absolute;\n  top: calc(100% + 4px);\n  left: 0;\n  right: 0;\n  overflow-y: auto;\n  transform: translateY(-4px);\n}\n\n._3KtWIa_selectPopupOpen {\n  opacity: 1;\n  transform: none;\n}\n\n._3KtWIa_selectPopupClose {\n  opacity: 0;\n  pointer-events: none;\n  transform: translateY(-4px);\n}\n\n._3KtWIa_rangeAnchor {\n  display: inline-flex;\n  position: relative;\n}\n\n._3KtWIa_rangeBubble {\n  z-index: 40;\n  box-sizing: border-box;\n  border: 1px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-3);\n  width: 220px;\n  box-shadow: 0 8px 24px var(--dsw-alias-bg-mask-2);\n  opacity: 0;\n  visibility: hidden;\n  border-radius: 10px;\n  padding: 10px 12px 6px;\n  transition: opacity .12s, transform .12s, visibility 0s linear .12s;\n  position: absolute;\n  right: 0;\n}\n\n._3KtWIa_rangeBubble[data-side=\"above\"] {\n  bottom: calc(100% + 6px);\n  transform: translateY(4px);\n}\n\n._3KtWIa_rangeBubble[data-side=\"below\"] {\n  top: calc(100% + 6px);\n  transform: translateY(-4px);\n}\n\n._3KtWIa_rangeBubble[data-open] {\n  opacity: 1;\n  visibility: visible;\n  transition: opacity .12s, transform .12s, visibility;\n  transform: none;\n}\n\n._3KtWIa_rangeSlider {\n  appearance: none;\n  cursor: pointer;\n  background: none;\n  width: 100%;\n  height: 18px;\n  margin: 0;\n  display: block;\n}\n\n._3KtWIa_rangeSlider::-webkit-slider-runnable-track {\n  background: linear-gradient(to right,\n    var(--dsw-alias-brand-primary) var(--range-fill, 0%),\n    color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent) var(--range-fill, 0%));\n  border-radius: 999px;\n  height: 4px;\n}\n\n._3KtWIa_rangeSlider::-moz-range-track {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);\n  border-radius: 999px;\n  height: 4px;\n}\n\n._3KtWIa_rangeSlider::-moz-range-progress {\n  background: var(--dsw-alias-brand-primary);\n  border-radius: 999px;\n  height: 4px;\n}\n\n._3KtWIa_rangeSlider::-webkit-slider-thumb {\n  appearance: none;\n  background: #fff;\n  border: 0;\n  border-radius: 50%;\n  width: 14px;\n  height: 14px;\n  margin-top: -5px;\n  transition: transform .12s;\n  box-shadow: 0 0 0 1px #0000001f, 0 1px 3px #00000040;\n}\n\n._3KtWIa_rangeSlider::-moz-range-thumb {\n  background: #fff;\n  border: 0;\n  border-radius: 50%;\n  width: 14px;\n  height: 14px;\n  box-shadow: 0 0 0 1px #0000001f, 0 1px 3px #00000040;\n}\n\n._3KtWIa_rangeSlider:active::-webkit-slider-thumb {\n  transform: scale(1.15);\n}\n\n._3KtWIa_rangeSlider:focus-visible {\n  outline: none;\n}\n\n._3KtWIa_rangeSlider:focus-visible::-webkit-slider-thumb {\n  box-shadow: 0 0 0 2px var(--dsw-alias-brand-primary);\n}\n\n._3KtWIa_rangeSlider:disabled {\n  cursor: not-allowed;\n}\n\n._3KtWIa_rangeEnds {\n  color: var(--dsw-alias-label-secondary);\n  font-variant-numeric: tabular-nums;\n  justify-content: space-between;\n  margin-top: 2px;\n  font-size: 11px;\n  line-height: 16px;\n  display: flex;\n}\n\n._3KtWIa_selectOption {\n  color: var(--dsw-alias-label-primary);\n  cursor: pointer;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  border-radius: 6px;\n  flex-shrink: 0;\n  padding: 6px 10px;\n  font-size: 13px;\n  line-height: 1.5;\n  overflow: hidden;\n}\n\n._3KtWIa_selectOption:hover, ._3KtWIa_selectOptionActive {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n._3KtWIa_selectOptionSelected {\n  color: var(--dsw-alias-brand-primary);\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent);\n  font-weight: 500;\n}\n\n._3KtWIa_invalid {\n  color: var(--dsw-alias-state-error-primary, #b42318);\n  margin: 0;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._3KtWIa_hint {\n  color: var(--dsw-alias-label-secondary);\n  margin: 0;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n._3KtWIa_toggle {\n  appearance: none;\n  cursor: pointer;\n  font: inherit;\n  background: none;\n  border: 0;\n  border-radius: 999px;\n  align-items: center;\n  margin: 0;\n  padding: 0;\n  display: inline-flex;\n}\n\n._3KtWIa_toggleTrack {\n  background: var(--dsw-alias-label-dimmed);\n  border-radius: 999px;\n  flex: none;\n  width: 36px;\n  height: 20px;\n  transition: background-color .18s;\n  position: relative;\n}\n\n._3KtWIa_toggleThumb {\n  --toggle-travel: 16px;\n  --toggle-overshoot: 1px;\n  background: var(--dsw-alias-bg-layer-3);\n  border-radius: 50%;\n  width: 16px;\n  height: 16px;\n  transition: translate .18s;\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  translate: 0;\n  box-shadow: 0 1px 2px #1414132e;\n}\n\n._3KtWIa_toggle[aria-checked=\"true\"] ._3KtWIa_toggleTrack {\n  background: var(--dsw-alias-button-primary-fill, var(--dsw-alias-label-primary));\n}\n\n._3KtWIa_toggle[aria-checked=\"true\"] ._3KtWIa_toggleThumb {\n  translate: var(--toggle-travel) 0;\n  background: var(--dsw-alias-label-primary-foreground, var(--dsw-alias-bg-layer-3));\n}\n\n._3KtWIa_toggle[data-moved][aria-checked=\"true\"] ._3KtWIa_toggleThumb {\n  animation: .35s cubic-bezier(.34, 1.45, .64, 1) both _3KtWIa_toggle-on;\n}\n\n._3KtWIa_toggle[data-moved][aria-checked=\"false\"] ._3KtWIa_toggleThumb {\n  animation: .35s cubic-bezier(.34, 1.45, .64, 1) both _3KtWIa_toggle-off;\n}\n\n@keyframes _3KtWIa_toggle-on {\n  0% {\n    translate: 0;\n  }\n\n  55% {\n    translate: calc(var(--toggle-travel) + var(--toggle-overshoot)) 0;\n  }\n\n  80%, 100% {\n    translate: var(--toggle-travel) 0;\n  }\n}\n\n@keyframes _3KtWIa_toggle-off {\n  0% {\n    translate: var(--toggle-travel) 0;\n  }\n\n  55% {\n    translate: calc(0px - var(--toggle-overshoot)) 0;\n  }\n\n  80%, 100% {\n    translate: 0;\n  }\n}\n\n._3KtWIa_toggle:focus-visible {\n  outline: 2px solid var(--dsw-alias-brand-primary);\n  outline-offset: 2px;\n}\n\n._3KtWIa_toggle:disabled {\n  opacity: .45;\n  cursor: not-allowed;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  ._3KtWIa_card, ._3KtWIa_header, ._3KtWIa_mark, ._3KtWIa_chevron, ._3KtWIa_chevronOpen, ._3KtWIa_rangeBubble, ._3KtWIa_selectChevron, ._3KtWIa_selectChevronOpen, ._3KtWIa_selectPopup, ._3KtWIa_toggleTrack, ._3KtWIa_toggleThumb {\n    transition: none;\n  }\n\n  ._3KtWIa_toggle[data-moved] ._3KtWIa_toggleThumb {\n    animation: none;\n  }\n\n  ._3KtWIa_disclosure {\n    transition-property: opacity;\n  }\n}\n.lmij7G_card {\n  background: var(--dsw-alias-markdown-code-block);\n  box-shadow: inset 0 0 0 .5px var(--dsw-alias-border-l2);\n  border-radius: 12px;\n  margin: 16px 0;\n  overflow: hidden;\n}\n\n.lmij7G_toolbar {\n  border-bottom: .5px solid var(--dsw-alias-border-l1);\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 4.5%, var(--dsw-alias-markdown-code-block));\n  justify-content: space-between;\n  align-items: center;\n  gap: 8px;\n  padding: 7px 14px;\n  font-size: 12px;\n  display: flex;\n}\n\nbody[data-ds-dark-theme] .lmij7G_toolbar {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 6%, var(--dsw-alias-markdown-code-block));\n}\n\n.lmij7G_badge {\n  font-family: var(--ds-font-family-code, ui-monospace, monospace);\n  letter-spacing: .04em;\n  text-transform: uppercase;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 11px;\n  font-weight: 600;\n}\n\n.lmij7G_actions {\n  align-items: center;\n  gap: 6px;\n  display: flex;\n}\n\n.lmij7G_tabs {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent);\n  border-radius: 7px;\n  padding: 2px;\n  display: inline-flex;\n}\n\nbody[data-ds-dark-theme] .lmij7G_tabs {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 9%, transparent);\n}\n\n.lmij7G_btn {\n  appearance: none;\n  color: var(--dsw-alias-label-secondary);\n  font-family: var(--dsw-font-family);\n  cursor: pointer;\n  background: none;\n  border: none;\n  border-radius: 5px;\n  padding: 0 8px;\n  font-size: 11px;\n  line-height: 20px;\n  transition: background-color .12s, color .12s;\n}\n\n@media (hover: hover) {\n  .lmij7G_btn:hover {\n    color: var(--dsw-alias-label-primary);\n    background: var(--dsw-alias-interactive-bg-hover);\n  }\n}\n\n.lmij7G_btnActive {\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-base);\n  font-weight: 500;\n  box-shadow: 0 1px 2px #00000014;\n}\n\nbody[data-ds-dark-theme] .lmij7G_btnActive {\n  background: var(--dsw-alias-bg-layer-3);\n  box-shadow: none;\n}\n\n.lmij7G_canvasWrap {\n  cursor: zoom-in;\n  scrollbar-width: thin;\n  justify-content: center;\n  padding: 18px 16px;\n  display: flex;\n  overflow-x: auto;\n}\n\n.lmij7G_codeWrap > :first-child {\n  box-shadow: none !important;\n  border: none !important;\n  border-radius: 0 !important;\n  margin: 0 !important;\n}\n\n.lmij7G_canvasWrap .lh-mermaid-svg, .lmij7G_modalSvg .lh-mermaid-svg {\n  max-width: 100%;\n  height: auto;\n  font-family: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, sans-serif);\n  display: block;\n}\n\n.lmij7G_canvasWrap .lh-node-shape, .lmij7G_modalSvg .lh-node-shape {\n  fill: var(--dsw-alias-bg-layer-1, var(--dsw-alias-bg-base));\n  stroke: var(--dsw-alias-border-l3);\n  stroke-width: 1.2px;\n}\n\n.lmij7G_canvasWrap .lh-node-diamond, .lmij7G_modalSvg .lh-node-diamond {\n  fill: color-mix(in srgb, var(--dsw-alias-state-business-primary) 9%, var(--dsw-alias-bg-base));\n  stroke: var(--dsw-alias-state-business-primary);\n}\n\n.lmij7G_canvasWrap .lh-state-point, .lmij7G_modalSvg .lh-state-point {\n  fill: var(--dsw-alias-label-primary);\n}\n\n.lmij7G_canvasWrap .lh-node-text, .lmij7G_modalSvg .lh-node-text, .lmij7G_canvasWrap .lh-seq-msg-left, .lmij7G_modalSvg .lh-seq-msg-left {\n  fill: var(--dsw-alias-label-primary);\n  font-size: 13px;\n}\n\n.lmij7G_canvasWrap .lh-edge, .lmij7G_modalSvg .lh-edge {\n  stroke: var(--dsw-alias-label-tertiary);\n}\n\n.lmij7G_canvasWrap .lh-arrow-head, .lmij7G_modalSvg .lh-arrow-head {\n  fill: var(--dsw-alias-label-tertiary);\n}\n\n.lmij7G_canvasWrap .lh-edge-label rect, .lmij7G_modalSvg .lh-edge-label rect {\n  fill: var(--dsw-alias-markdown-code-block);\n  stroke: var(--dsw-alias-border-l2);\n  stroke-width: .75px;\n}\n\n.lmij7G_canvasWrap .lh-edge-text, .lmij7G_modalSvg .lh-edge-text {\n  fill: var(--dsw-alias-label-secondary);\n  font-size: 11.5px;\n}\n\n.lmij7G_canvasWrap .lh-subgraph rect, .lmij7G_modalSvg .lh-subgraph rect {\n  fill: color-mix(in srgb, var(--dsw-alias-label-primary) 3.5%, transparent);\n  stroke: var(--dsw-alias-border-l2);\n  stroke-dasharray: 4 3;\n  stroke-width: 1px;\n}\n\n.lmij7G_canvasWrap .lh-sg-title, .lmij7G_modalSvg .lh-sg-title {\n  fill: var(--dsw-alias-label-secondary);\n  font-size: 11.5px;\n  font-weight: 600;\n}\n\n.lmij7G_canvasWrap .lh-seq-life, .lmij7G_modalSvg .lh-seq-life {\n  stroke: var(--dsw-alias-border-l3);\n  stroke-dasharray: 4 4;\n  stroke-width: 1.1px;\n}\n\n.lmij7G_canvasWrap .lh-seq-divider, .lmij7G_modalSvg .lh-seq-divider {\n  stroke: var(--dsw-alias-border-l2);\n  stroke-dasharray: 4 3;\n}\n\n.lmij7G_canvasWrap .lh-seq-note rect, .lmij7G_modalSvg .lh-seq-note rect {\n  fill: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 12%, var(--dsw-alias-bg-base));\n  stroke: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 42%, var(--dsw-alias-border-l2));\n}\n\n.lmij7G_overlay {\n  z-index: 9999;\n  background: var(--dsw-alias-bg-mask-3, #00000085);\n  -webkit-backdrop-filter: blur(4px);\n  justify-content: center;\n  align-items: center;\n  padding: 24px;\n  display: flex;\n  position: fixed;\n  inset: 0;\n}\n\n.lmij7G_dialog {\n  background: var(--dsw-alias-bg-layer-1, var(--dsw-alias-bg-base));\n  border: .5px solid var(--dsw-alias-border-l3);\n  border-radius: 14px;\n  flex-direction: column;\n  max-width: min(94vw, 1200px);\n  max-height: 90vh;\n  display: flex;\n  overflow: hidden;\n  box-shadow: 0 24px 64px #00000047;\n}\n\n.lmij7G_modalHeader {\n  border-bottom: .5px solid var(--dsw-alias-border-l1);\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 3.5%, transparent);\n  justify-content: space-between;\n  align-items: center;\n  padding: 10px 16px;\n  display: flex;\n}\n\n.lmij7G_modalSvg {\n  padding: 24px;\n  overflow: auto;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .lmij7G_btn {\n    transition: none;\n  }\n}\n.atGGjW_card {\n  background: var(--dsw-alias-bg-layer-1);\n  box-shadow: 0 0 0 1px var(--dsw-alias-border-l2),\n    0 1px 2px #0f172a0a,\n    0 10px 24px -14px #0f172a42;\n  border-top: 2px solid #0e9f6e8c;\n  border-radius: 12px;\n  margin: 13px 0;\n  overflow: clip;\n}\n\n.atGGjW_card[data-failed] {\n  border-top-color: #e5484d9e;\n}\n\nbody[data-ds-dark-theme] .atGGjW_card {\n  box-shadow: 0 0 0 1px var(--dsw-alias-border-l2),\n    0 12px 28px -16px #0009;\n  border-top-color: #3ddc978c;\n}\n\nbody[data-ds-dark-theme] .atGGjW_card[data-failed] {\n  border-top-color: #ff6b6b9e;\n}\n\n.atGGjW_row {\n  grid-template-columns: 26px 84px minmax(0, 1fr);\n  align-items: center;\n  min-height: 30px;\n  padding: 0 12px 0 10px;\n  display: grid;\n}\n\n.atGGjW_row + .atGGjW_row {\n  border-top: 1px solid color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent);\n}\n\n.atGGjW_tick {\n  text-align: center;\n  user-select: none;\n  justify-content: center;\n  align-items: center;\n  font-size: 12px;\n  font-weight: 700;\n  line-height: 1;\n  display: flex;\n}\n\n.atGGjW_tick[data-status=\"pass\"] {\n  color: #0e9f6e;\n}\n\n.atGGjW_tick[data-status=\"fail\"] {\n  color: #e5484d;\n}\n\n.atGGjW_tick[data-status=\"info\"] {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 0;\n}\n\n.atGGjW_tick[data-status=\"info\"]:before {\n  content: \"\";\n  background: currentColor;\n  border-radius: 50%;\n  width: 5px;\n  height: 5px;\n}\n\nbody[data-ds-dark-theme] .atGGjW_tick[data-status=\"pass\"] {\n  color: #3ddc97;\n}\n\nbody[data-ds-dark-theme] .atGGjW_tick[data-status=\"fail\"] {\n  color: #ff6b6b;\n}\n\n.atGGjW_key {\n  font-family: var(--ds-font-family-code, ui-monospace, monospace);\n  letter-spacing: .08em;\n  text-transform: uppercase;\n  color: var(--dsw-alias-label-secondary);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  padding-right: 8px;\n  font-size: 10px;\n  font-weight: 650;\n  line-height: 1.5;\n  overflow: hidden;\n}\n\n.atGGjW_value {\n  color: var(--dsw-alias-label-primary);\n  border-left: 1px solid color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);\n  overflow-wrap: anywhere;\n  padding-left: 28px;\n  font-family: Menlo, SF Mono, PingFang SC, ui-monospace, monospace;\n  font-size: 12px;\n  line-height: 1.5;\n}\n\n@supports (grid-template-columns: subgrid) {\n  .atGGjW_card {\n    grid-template-columns: 26px minmax(84px, max-content) minmax(0, 1fr);\n    display: grid;\n  }\n\n  .atGGjW_row {\n    grid-column: 1 / -1;\n    grid-template-columns: subgrid;\n  }\n\n  .atGGjW_key {\n    text-overflow: clip;\n    overflow: visible;\n  }\n}\n._4ssDtq_dock {\n  box-sizing: border-box;\n  width: calc(100% -\n    var(--dsh-composer-side-clearance) -\n    var(--dsh-composer-side-clearance) -\n    var(--dsh-composer-dock-inset) -\n    var(--dsh-composer-dock-inset));\n  max-width: calc(var(--dsh-composer-card-max-width) -\n    var(--dsh-composer-dock-inset) -\n    var(--dsh-composer-dock-inset));\n  margin: 0 auto calc(0px - var(--dsh-composer-stack-gap) - 3px);\n  padding: 0 var(--dsh-composer-dock-inset);\n  flex: none;\n}\n\n._4ssDtq_panel {\n  isolation: isolate;\n  border-radius: var(--dsw-radius-lg) var(--dsw-radius-lg) 0 0;\n  width: 100%;\n  padding: 2px 0;\n  position: relative;\n  overflow: hidden;\n}\n\n._4ssDtq_panel:before {\n  z-index: -1;\n  border-radius: inherit;\n  background: var(--dsw-specific-menu);\n  backdrop-filter: var(--dsw-menu-backdrop-filter);\n  content: \"\";\n  pointer-events: none;\n  position: absolute;\n  inset: 0;\n}\n\n._4ssDtq_panel:after {\n  border: .5px solid var(--dsw-alias-border-l1);\n  border-radius: inherit;\n  content: \"\";\n  pointer-events: none;\n  border-bottom: none;\n  position: absolute;\n  inset: 0;\n}\n\n._4ssDtq_header {\n  box-sizing: border-box;\n  border-radius: var(--dsw-radius-md);\n  width: 100%;\n  height: 36px;\n  color: var(--dsw-alias-label-primary);\n  text-align: left;\n  cursor: pointer;\n  background: none;\n  border: none;\n  align-items: center;\n  gap: 10px;\n  padding: 4px 12px;\n  display: flex;\n}\n\n._4ssDtq_header:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n._4ssDtq_header:disabled {\n  cursor: default;\n}\n\n._4ssDtq_lead {\n  color: var(--dsw-alias-label-tertiary);\n  flex: none;\n  place-items: center;\n  display: grid;\n}\n\n._4ssDtq_count {\n  min-width: 0;\n  font-family: Inter, var(--dsw-font-family);\n  flex: auto;\n  font-size: 13px;\n  font-weight: 500;\n  line-height: 24px;\n}\n\n._4ssDtq_chevron {\n  width: 14px;\n  height: 14px;\n  color: var(--dsw-alias-label-tertiary);\n  flex: none;\n  place-items: center;\n  display: grid;\n}\n\n._4ssDtq_list {\n  max-height: 180px;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  overflow-y: auto;\n}\n\n._4ssDtq_row {\n  box-sizing: border-box;\n  border-radius: var(--dsw-radius-md);\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  min-height: 36px;\n  padding: 4px 5px 4px 12px;\n  display: flex;\n}\n\n._4ssDtq_row + ._4ssDtq_row {\n  box-shadow: inset 0 1px 0 var(--dsw-alias-border-l1);\n}\n\n._4ssDtq_row[data-interactive] {\n  cursor: pointer;\n}\n\n@media (hover: hover) {\n  ._4ssDtq_row[data-interactive]:hover {\n    background: var(--dsw-alias-interactive-bg-hover);\n  }\n}\n\n._4ssDtq_attachments {\n  flex: none;\n  gap: 4px;\n  min-width: 0;\n  max-width: 55%;\n  display: flex;\n  overflow: hidden;\n}\n\n._4ssDtq_pendingRow ._4ssDtq_attachments {\n  flex-shrink: 1;\n}\n\n._4ssDtq_file {\n  border: .5px solid var(--dsw-alias-border-l1);\n  border-radius: var(--dsw-radius-sm);\n  background: var(--dsw-alias-bg-base);\n  box-sizing: border-box;\n  flex: 0 180px;\n  align-items: center;\n  gap: 4px;\n  min-width: 74px;\n  height: 24px;\n  padding: 0 6px;\n  display: inline-flex;\n  overflow: hidden;\n}\n\n._4ssDtq_fileName {\n  min-width: 0;\n  color: var(--dsw-alias-label-primary-dimmed);\n  font: var(--dsw-font-xs-13);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n._4ssDtq_thumb {\n  border: .5px solid var(--dsw-alias-border-l1);\n  border-radius: var(--dsw-radius-xs);\n  background: var(--dsw-alias-bg-base);\n  object-fit: cover;\n  width: 24px;\n  height: 24px;\n}\n\n._4ssDtq_thumb[data-pending] {\n  display: inline-block;\n}\n\n._4ssDtq_preview {\n  min-width: 0;\n  font: var(--dsw-font-xs-13);\n  font-family: Inter, var(--dsw-font-family);\n  color: var(--dsw-alias-label-primary-dimmed);\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: auto;\n  overflow: hidden;\n}\n\n._4ssDtq_actions {\n  flex: none;\n  align-items: center;\n  gap: 8px;\n  display: flex;\n}\n\n._4ssDtq_status {\n  color: var(--dsw-alias-label-tertiary);\n  font: var(--dsw-font-xs-13);\n  white-space: nowrap;\n  flex: none;\n}\n\n._4ssDtq_action {\n  width: 28px;\n  height: 28px;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n  background: none;\n  border: none;\n  border-radius: 999px;\n  flex: none;\n  place-items: center;\n  padding: 0;\n  display: grid;\n}\n\n@media (hover: hover) {\n  ._4ssDtq_action:hover:not(:disabled) {\n    background: var(--dsw-alias-interactive-bg-hover);\n  }\n}\n\n._4ssDtq_action:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n._4ssDtq_action:disabled {\n  cursor: default;\n  opacity: .45;\n}\n\n._4ssDtq_primary {\n  height: 26px;\n  color: var(--dsw-alias-label-secondary, var(--dsw-alias-label-primary-dimmed));\n  font-family: Inter, var(--dsw-font-family);\n  white-space: nowrap;\n  cursor: pointer;\n  background: none;\n  border: none;\n  border-radius: 8px;\n  flex: none;\n  align-items: center;\n  padding: 0 9px;\n  font-size: 12.5px;\n  font-weight: 500;\n  display: inline-flex;\n}\n\n@media (hover: hover) {\n  ._4ssDtq_primary:hover:not(:disabled) {\n    background: var(--dsw-alias-interactive-bg-hover);\n    color: var(--dsw-alias-label-primary);\n  }\n}\n\n._4ssDtq_primary:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n._4ssDtq_primary:disabled {\n  cursor: default;\n  opacity: .45;\n}\n\n._4ssDtq_menu {\n  z-index: 60;\n  border: .5px solid var(--dsw-alias-border-l2);\n  background: var(--dsw-specific-menu, var(--dsw-alias-bg-layer-1));\n  min-width: 184px;\n  backdrop-filter: var(--dsw-menu-backdrop-filter);\n  border-radius: 10px;\n  padding: 5px;\n  position: fixed;\n  box-shadow: 0 12px 30px -16px #0f172a6b;\n}\n\n._4ssDtq_menuItem {\n  width: 100%;\n  color: var(--dsw-alias-state-error-primary, #e5484d);\n  font-family: Inter, var(--dsw-font-family);\n  text-align: left;\n  cursor: pointer;\n  background: none;\n  border: none;\n  border-radius: 7px;\n  align-items: center;\n  gap: 7px;\n  padding: 6px 8px;\n  font-size: 12.5px;\n  display: flex;\n}\n\n._4ssDtq_menuItem:hover {\n  background: #e5484d17;\n}\n\n._4ssDtq_menuItem:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-error-primary, #e5484d));\n  outline-offset: -2px;\n}\n\n._4ssDtq_menuLabel {\n  flex: auto;\n}\n\n._4ssDtq_menuHint {\n  color: var(--dsw-alias-label-tertiary);\n  flex: none;\n  font-size: 11px;\n}\n\n._4ssDtq_error {\n  color: var(--dsw-alias-state-error-primary, #e5484d);\n  font: var(--dsw-font-xs-13);\n  margin: 0;\n  padding: 2px 12px 6px;\n}\nhtml[data-liangheng-chat=\"on\"] [data-slot=\"conversation.chat.flow\"] {\n  text-rendering: optimizelegibility;\n  -webkit-font-smoothing: antialiased;\n  font-kerning: normal;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-flow-kind=\"user\"], html[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] + [data-chat-flow-kind=\"user\"], html[data-liangheng-chat=\"on\"] [data-chat-flow-kind=\"turn-tail\"] + [data-chat-flow-kind=\"user\"] {\n  --dsh-chat-flow-gap: 28px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] {\n  --dsh-chat-flow-gap: 16px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-step-process], html[data-liangheng-chat=\"on\"] [data-chat-flow-kind=\"turn-tail\"] {\n  --dsh-chat-flow-gap: 8px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"] [data-disclosure-row] {\n  border-radius: 7px;\n  margin-inline: -6px;\n  padding-inline: 6px;\n  transition: background-color .12s, color .12s;\n}\n\n@media (hover: hover) {\n  html[data-liangheng-chat=\"on\"] [data-variant=\"think\"] [data-disclosure-row][data-expandable]:hover {\n    background: var(--dsw-alias-interactive-bg-hover);\n    color: var(--dsw-alias-label-secondary);\n  }\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > [data-disclosure-header] {\n  border-bottom: .5px solid color-mix(in srgb, var(--dsw-alias-border-l2) 70%, transparent);\n  padding-block: 3px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) {\n  border-left: 1.5px solid var(--dsw-alias-border-l2);\n  color: color-mix(in srgb, var(--dsw-alias-label-secondary) 86%, var(--dsw-alias-label-tertiary));\n  margin: 4px 0 6px 7px;\n  padding: 6px 2px 8px 16px;\n  line-height: 1.72;\n  transition: border-color .22s;\n  position: relative;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-state=\"running\"][data-expanded] [data-open] > :not([data-disclosure-header]) {\n  border-left-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 48%, var(--dsw-alias-border-l2));\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) p {\n  margin: 7px 0;\n  line-height: 1.72;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) :is(h1, h2, h3, h4, h5, h6) {\n  color: var(--dsw-alias-label-secondary);\n  letter-spacing: -.005em;\n  margin: 12px 0 4px;\n  font-weight: 600;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) :is(ul, ol) {\n  margin: 6px 0;\n  padding-left: 18px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) li:not(:first-child) {\n  margin-top: 4px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) li > p {\n  margin: 3px 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) strong {\n  color: var(--dsw-alias-label-secondary);\n  font-weight: 600;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) blockquote {\n  border-left: 1.5px solid var(--dsw-alias-border-l3);\n  color: var(--dsw-alias-label-tertiary);\n  margin: 8px 0;\n  padding: 2px 0 2px 12px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) :not(pre) > code {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 5.5%, transparent);\n  font-variant-ligatures: none;\n  border: 0;\n  border-radius: 4px;\n  padding: .08em .35em;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) .md-code-block {\n  box-shadow: inset 0 0 0 .5px var(--dsw-alias-border-l1);\n  border-radius: 8px;\n  margin: 8px 0;\n  overflow: clip;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) hr {\n  background: var(--dsw-alias-border-l1);\n  margin: 10px 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-step-process] button[data-process-activity] {\n  font-size: var(--dsh-content-font-size-secondary, 13px);\n  border-radius: 7px;\n  margin-inline: -8px;\n  padding: 1px 8px;\n  font-weight: 500;\n  transition: background-color .12s, color .12s;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-step-process]:not([data-group-expanded-mode]) button[data-process-activity] {\n  color: var(--dsw-alias-label-secondary);\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-step-process]:not([data-group-expanded-mode]) button[data-process-activity] [data-step-process-icon] {\n  color: var(--dsw-alias-state-done-primary, var(--dsw-alias-state-business-primary));\n}\n\n@media (hover: hover) {\n  html[data-liangheng-chat=\"on\"] [data-step-process] button[data-process-activity]:hover {\n    background: var(--dsw-alias-interactive-bg-hover);\n  }\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-step-process]:not([data-group-expanded-mode]) [data-step-process-body]:not([hidden]) {\n  border-top: .5px solid var(--dsw-alias-border-l1);\n  border-left: 1px solid var(--dsw-alias-border-l2);\n  margin-top: 6px;\n  margin-left: 7px;\n  padding-top: 6px;\n  padding-left: 14px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-step-process-body] {\n  overflow-x: clip;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"] :where(p, li, blockquote, td, th) {\n  overflow-wrap: anywhere;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-variant=\"think\"] :not(pre) > code {\n  overflow-wrap: anywhere;\n  white-space: normal;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-flow-kind=\"tool-call\"] [data-disclosure-row] {\n  border-radius: 7px;\n  margin-inline: -6px;\n  padding-inline: 6px;\n  transition: background-color .12s, color .12s;\n}\n\n@media (hover: hover) {\n  html[data-liangheng-chat=\"on\"] [data-chat-flow-kind=\"tool-call\"] [data-disclosure-row][data-expandable]:hover {\n    background: var(--dsw-alias-interactive-bg-hover);\n  }\n}\n\nhtml[data-liangheng-chat=\"on\"] button[data-turn-process] {\n  border-bottom-color: var(--dsw-alias-border-l1);\n  font-size: var(--dsh-content-font-size-secondary, 13px);\n  font-variant-numeric: tabular-nums;\n  letter-spacing: .005em;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-running] {\n  letter-spacing: .01em;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-composer-card]:not(:has([data-input-scroll] [aria-haspopup=\"menu\"])) {\n  --dsw-elevation-stroke-color: var(--dsw-alias-border-l2);\n  box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l2),\n    0 2px 10px #0f172a0a,\n    0 1px 2px #0f172a08;\n  border-radius: 20px;\n  gap: 10px;\n  padding: 10px 4px 4px;\n  transition: box-shadow .18s cubic-bezier(.2, .8, .2, 1), background-color .18s;\n}\n\n@media (hover: hover) {\n  html[data-liangheng-chat=\"on\"] [data-composer-card]:not(:has([data-input-scroll] [aria-haspopup=\"menu\"])):hover {\n    box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l3),\n      0 4px 16px #0f172a0e,\n      0 1px 3px #0f172a09;\n  }\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-composer-card]:not(:has([data-input-scroll] [aria-haspopup=\"menu\"])):focus-within {\n  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-state-business-primary) 52%, var(--dsw-alias-border-l3)),\n    0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 10%, transparent),\n    0 6px 24px #0f172a0f;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-phase=\"hero\"] [data-composer-card]:not(:has([data-input-scroll] [aria-haspopup=\"menu\"])) {\n  box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l2),\n    0 8px 28px #0f172a0d,\n    0 2px 6px #0f172a08;\n  border-radius: 22px;\n  padding: 12px 6px 6px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-phase=\"hero\"] [data-composer-card]:not(:has([data-input-scroll] [aria-haspopup=\"menu\"])):focus-within {\n  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-state-business-primary) 52%, var(--dsw-alias-border-l3)),\n    0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 10%, transparent),\n    0 12px 34px #0f172a12;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-composer-card] [data-input-scroll] [contenteditable], html[data-liangheng-chat=\"on\"] [data-composer-card] [data-composer-placeholder] {\n  line-height: calc(25px + var(--dsh-content-font-delta, 0px));\n  letter-spacing: .005em;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-composer-card] [data-composer-placeholder] {\n  opacity: .85;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-composer-dock] {\n  opacity: .82;\n  padding-top: 6px;\n  transition: opacity .15s;\n}\n\n@media (hover: hover) {\n  html[data-liangheng-chat=\"on\"] [data-composer-dock]:hover {\n    opacity: 1;\n  }\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-message-bubble] {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 4.5%, var(--dsw-alias-bg-base));\n  border: .5px solid var(--dsw-alias-border-l2);\n  line-height: calc(24px + var(--dsh-content-font-delta, 0px));\n  letter-spacing: .004em;\n  color: var(--dsw-alias-label-primary);\n  border-radius: 16px;\n  padding: 11px 16px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-pending-steering] [data-message-bubble] {\n  border-style: dashed;\n  border-color: var(--dsw-alias-border-l3);\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 3%, var(--dsw-alias-bg-base));\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] {\n  line-height: calc(25px + var(--dsh-content-font-delta, 0px));\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] p {\n  line-height: calc(25px + var(--dsh-content-font-delta, 0px));\n  margin: 13px 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] strong {\n  color: var(--dsw-alias-label-primary);\n  font-weight: 600;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(del, s) {\n  color: var(--dsw-alias-label-tertiary);\n  text-decoration-thickness: 1px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] mark {\n  background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 18%, transparent);\n  color: inherit;\n  border-radius: 3px;\n  padding: .05em .28em;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] kbd {\n  font-family: var(--ds-font-family-code);\n  border: .5px solid var(--dsw-alias-border-l3);\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 4%, var(--dsw-alias-bg-base));\n  box-shadow: inset 0 -1px 0 var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-primary);\n  vertical-align: .05em;\n  border-radius: 5px;\n  padding: 1px 5px;\n  font-size: .82em;\n  line-height: 1.35;\n  display: inline-block;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] h1 {\n  font-size: calc(22px + var(--dsh-content-font-delta, 0px));\n  letter-spacing: -.02em;\n  border-bottom: 1px solid var(--dsw-alias-border-l2);\n  margin: 28px 0 14px;\n  padding-bottom: 8px;\n  font-weight: 650;\n  line-height: 1.36;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] h2 {\n  font-size: calc(18px + var(--dsh-content-font-delta, 0px));\n  letter-spacing: -.015em;\n  border-bottom: .5px solid var(--dsw-alias-border-l2);\n  margin: 26px 0 12px;\n  padding-bottom: 6px;\n  font-weight: 650;\n  line-height: 1.4;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] h3 {\n  font-size: calc(15.5px + var(--dsh-content-font-delta, 0px));\n  letter-spacing: -.01em;\n  margin: 20px 0 8px;\n  font-weight: 600;\n  line-height: 1.45;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] h4 {\n  font-size: calc(14px + var(--dsh-content-font-delta, 0px));\n  margin: 16px 0 6px;\n  font-weight: 600;\n  line-height: 1.5;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(h5, h6) {\n  font-size: calc(13px + var(--dsh-content-font-delta, 0px));\n  letter-spacing: .01em;\n  color: var(--dsw-alias-label-secondary);\n  margin: 14px 0 6px;\n  font-weight: 600;\n  line-height: 1.5;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(h1 + h2, h2 + h3, h3 + h4) {\n  margin-top: 10px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(h1, h2, h3, h4, h5, h6) :not(pre) > code {\n  padding: .06em .34em;\n  font-weight: 550;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(ul, ol) {\n  margin: 10px 0;\n  padding-left: 22px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] li:not(:first-child) {\n  margin-top: 6px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] li > :is(ul, ol) {\n  margin: 5px 0 2px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] li > p {\n  margin: 4px 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] li > p:first-child {\n  margin-top: 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] li > p:last-child {\n  margin-bottom: 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] li::marker {\n  color: var(--dsw-alias-label-tertiary);\n  font-variant-numeric: tabular-nums;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] input[type=\"checkbox\"] {\n  accent-color: var(--dsw-alias-state-business-primary);\n  vertical-align: -.1em;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] blockquote {\n  border-left: 2.5px solid var(--dsw-alias-border-l3);\n  color: var(--dsw-alias-label-secondary);\n  margin: 13px 0;\n  padding: 3px 0 3px 15px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"]:not([data-turn-process-member]) :not(li):not(blockquote):not(td) > blockquote:first-child {\n  border-left: 2.5px solid var(--dsw-alias-state-business-primary);\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 5%, transparent);\n  color: var(--dsw-alias-label-primary);\n  border-radius: 0 10px 10px 0;\n  margin: 0 0 13px;\n  padding: 10px 16px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is([data-turn-process-member], [data-turn-process-inline], [data-step-process]) :not(li):not(blockquote):not(td) > blockquote:first-child {\n  border-left: 2.5px solid var(--dsw-alias-border-l3);\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 3.5%, transparent);\n  color: var(--dsw-alias-label-secondary);\n  border-radius: 0 8px 8px 0;\n  margin: 0 0 13px;\n  padding: 8px 14px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] blockquote > :first-child {\n  margin-top: 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] blockquote > :last-child {\n  margin-bottom: 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] .md-code-block {\n  --dsl-code-block-border-radius: 12px;\n  border-radius: var(--dsl-code-block-border-radius);\n  background: var(--dsw-alias-bg-layer-1);\n  box-shadow: 0 0 0 1px var(--dsw-alias-border-l2),\n    0 1px 2px #0f172a0a,\n    0 10px 24px -14px #0f172a42;\n  margin: 13px 0;\n  overflow: clip;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] [data-code-block-banner] {\n  background: var(--dsw-alias-bg-layer-1);\n  border-bottom: 1px solid color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent);\n  color: var(--dsw-alias-label-secondary);\n  padding: 7px 10px 7px 13px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] [data-code-block-banner] > [data-text-interaction-exclude] {\n  font-family: var(--ds-font-family-code);\n  letter-spacing: .11em;\n  text-transform: uppercase;\n  color: var(--dsw-alias-label-secondary);\n  background: none;\n  border-radius: 0;\n  padding: 0;\n  font-size: 9.5px;\n  font-weight: 650;\n  line-height: 1.6;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] [data-code-block-banner] button {\n  color: var(--dsw-alias-label-secondary);\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 4%, transparent);\n  border-radius: 6px;\n  transition: color .12s, background-color .12s;\n}\n\n@media (hover: hover) {\n  html[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] [data-code-block-banner] button:hover {\n    color: var(--dsw-alias-label-primary);\n    background: color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);\n  }\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] .md-code-block pre {\n  --shiki-foreground: var(--dsw-alias-label-primary);\n  --shiki-token-comment: #7f8aa3;\n  --shiki-token-keyword: #c2255c;\n  --shiki-token-string: #0b7285;\n  --shiki-token-string-expression: #0b7285;\n  --shiki-token-constant: #1971c2;\n  --shiki-token-function: #7048e8;\n  --shiki-token-parameter: #e8590c;\n  --shiki-token-punctuation: #5c6472;\n  --shiki-token-link: #1f6feb;\n  font-family: Menlo, SF Mono, ui-monospace, monospace;\n  font-size: max(13.5px, calc(var(--dsh-code-font-size, 11px) + 2.5px));\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 1.5%, var(--dsw-alias-bg-layer-1));\n  scrollbar-width: thin;\n  overscroll-behavior-x: contain;\n  tab-size: 2;\n  margin: 0;\n  padding: 11px 14px 13px;\n  line-height: 1.55;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] .md-code-block [style*=\"shiki-token-comment\"] {\n  font-style: italic;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] .md-code-block pre code {\n  font-variant-ligatures: none;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :not(pre) > code {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 4.5%, transparent);\n  font-variant-ligatures: none;\n  -webkit-box-decoration-break: clone;\n  box-decoration-break: clone;\n  border: 0;\n  border-radius: 5px;\n  padding: .08em .3em;\n  font-size: .93em;\n  display: inline;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] a code {\n  color: inherit;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] table {\n  font-variant-numeric: tabular-nums;\n  border-collapse: collapse;\n  border-top: 1px solid var(--dsw-alias-border-l3);\n  border-bottom: 1px solid var(--dsw-alias-border-l3);\n  width: 100%;\n  margin: 13px 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(th, td) {\n  vertical-align: top;\n  font-size: calc(14px + var(--dsh-content-font-delta, 0px));\n  max-width: min(36vw, 440px);\n  padding: 9px 12px;\n  line-height: 1.72;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(th, td):first-child {\n  padding-left: 12px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(th, td):last-child {\n  padding-right: 12px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] thead th {\n  border-top: 0;\n  border-bottom: 1px solid var(--dsw-alias-border-l3);\n  white-space: nowrap;\n  color: var(--dsw-alias-label-secondary);\n  font-size: calc(14px + var(--dsh-content-font-delta, 0px) - 1.5px);\n  letter-spacing: 0;\n  background: none;\n  font-weight: 500;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] td {\n  border-bottom: .5px solid var(--dsw-alias-border-l1);\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] tbody tr {\n  transition: background-color .1s;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] tbody tr:last-child td {\n  border-bottom: 0;\n}\n\n@media (hover: hover) {\n  html[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] tbody tr:hover {\n    background: color-mix(in srgb, var(--dsw-alias-label-primary) 3%, transparent);\n  }\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] td :not(pre) > code {\n  white-space: nowrap;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] a {\n  text-decoration-line: underline;\n  text-decoration-color: color-mix(in srgb, currentColor 32%, transparent);\n  text-underline-offset: 3px;\n  text-decoration-thickness: 1px;\n  transition: text-decoration-color .12s;\n}\n\n@media (hover: hover) {\n  html[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] a:hover {\n    text-decoration-color: currentColor;\n  }\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] .katex-display {\n  scrollbar-width: thin;\n  margin: 16px 0;\n  padding: 6px 4px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] img {\n  border: .5px solid var(--dsw-alias-border-l2);\n  border-radius: 10px;\n  margin: 10px 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] :is(p, figure) > :is(img:only-child, a:only-child > img) {\n  width: 100%;\n  max-width: 100%;\n  height: auto;\n  display: block;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] * + hr {\n  margin-top: 13px;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] hr {\n  background: var(--dsw-alias-border-l2);\n  height: .5px;\n  margin: 13px 0;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] hr + ul:last-child {\n  font-size: var(--dsh-content-font-size-secondary, 13px);\n  color: var(--dsw-alias-label-secondary);\n  margin-top: 12px;\n  line-height: 1.65;\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-composer-card]:not(:has([data-input-scroll] [aria-haspopup=\"menu\"])) {\n  box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l2),\n    inset 0 1px 0 #ffffff0d,\n    0 4px 20px #00000047;\n}\n\n@media (hover: hover) {\n  html[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-composer-card]:not(:has([data-input-scroll] [aria-haspopup=\"menu\"])):hover {\n    box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l3),\n      inset 0 1px 0 #ffffff12,\n      0 6px 24px #00000057;\n  }\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-composer-card]:not(:has([data-input-scroll] [aria-haspopup=\"menu\"])):focus-within {\n  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-state-business-primary) 58%, var(--dsw-alias-border-l3)),\n    0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 16%, transparent),\n    0 8px 30px #00000061;\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-message-bubble] {\n  background: var(--dsw-alias-bg-layer-2);\n  border-color: var(--dsw-alias-border-l2);\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-pending-steering] [data-message-bubble] {\n  background: var(--dsw-alias-bg-layer-1);\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"]:not([data-turn-process-member]) :not(li):not(blockquote):not(td) > blockquote:first-child {\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 10%, transparent);\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"] :is([data-turn-process-member], [data-turn-process-inline], [data-step-process]) :not(li):not(blockquote):not(td) > blockquote:first-child {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 6%, transparent);\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"] .md-code-block {\n  box-shadow: 0 0 0 1px var(--dsw-alias-border-l2),\n    0 12px 28px -16px #0009;\n  overflow: clip;\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"] [data-code-block-banner] {\n  background: var(--dsw-alias-bg-layer-1);\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"] .md-code-block pre {\n  --shiki-token-comment: #8b94ab;\n  --shiki-token-keyword: #f06595;\n  --shiki-token-string: #38d9a9;\n  --shiki-token-string-expression: #38d9a9;\n  --shiki-token-constant: #4dabf7;\n  --shiki-token-function: #b197fc;\n  --shiki-token-parameter: #ffa94d;\n  --shiki-token-punctuation: #adb5bd;\n  --shiki-token-link: #74c0fc;\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"] :not(pre) > code {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 10%, transparent);\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]) :not(pre) > code {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 9%, transparent);\n}\n\n@media (hover: hover) {\n  html[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"] tbody tr:hover {\n    background: color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent);\n  }\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"] img {\n  border-color: var(--dsw-alias-border-l2-darkmode-thin, var(--dsw-alias-border-l2));\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-chat-group-part=\"response\"] kbd {\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  html[data-liangheng-chat=\"on\"] [data-variant=\"think\"] [data-disclosure-row], html[data-liangheng-chat=\"on\"] [data-variant=\"think\"][data-expanded] [data-open] > :not([data-disclosure-header]), html[data-liangheng-chat=\"on\"] [data-step-process] button[data-process-activity], html[data-liangheng-chat=\"on\"] [data-chat-flow-kind=\"tool-call\"] [data-disclosure-row], html[data-liangheng-chat=\"on\"] [data-composer-card], html[data-liangheng-chat=\"on\"] [data-composer-dock], html[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] [data-code-block-banner] button, html[data-liangheng-chat=\"on\"] [data-chat-group-part=\"response\"] tbody tr {\n    transition: none;\n  }\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-slot=\"conversation.hero.agentPreset\"] button > svg:first-of-type, html[data-liangheng-chat=\"on\"] [data-slot=\"conversation.session.header.actions\"] > span > svg:first-of-type {\n  display: none;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-slot=\"conversation.hero.agentPreset\"] button:before, html[data-liangheng-chat=\"on\"] [data-slot=\"conversation.session.header.actions\"] > span:before {\n  content: \"\";\n  background: url(\"data:image/webp;base64,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\") center / contain no-repeat;\n  flex: none;\n  width: 23px;\n  height: 16px;\n}\n\nhtml[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-slot=\"conversation.hero.agentPreset\"] button:before, html[data-liangheng-chat=\"on\"] body[data-ds-dark-theme] [data-slot=\"conversation.session.header.actions\"] > span:before {\n  filter: brightness(1.15) saturate(1.05);\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-running] > span:last-child > span:first-child > span, html[data-liangheng-chat=\"on\"] [data-chat-running] > span:last-child > span:first-child > svg {\n  display: none;\n}\n\nhtml[data-liangheng-chat=\"on\"] [data-chat-running] > span:last-child > span:first-child {\n  background: url(\"data:image/webp;base64,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\") center / contain no-repeat;\n  width: 20px;\n  height: 16px;\n}\n"
  if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.setAttribute('data-dsh-liangheng', '')
    style.textContent = css
    document.head.appendChild(style)
  }
}
return module.exports}});
