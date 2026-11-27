/**
 * LiangHeng preset identity and the burst trigger rule — framework-free, no
 * DOM, compiled by both programs.
 *
 * The composer owns no mode control any more: the preset picker above it is the
 * only place a preset is chosen, and this plugin only answers the landing with
 * the burst. The rule is pure so it can be tested without the browser runtime.
 */
/** The preset id this plugin declares; also the preset directory name. */
export declare const LIANGHENG_PRESET_ID = "liangheng";
/** Backward-compatible alias for the preset id. */
export declare const LIANGSHEN_PRESET_ID = "liangheng";
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
export declare function presetLanded(previous: string | undefined, next: string | undefined, sameSession: boolean): boolean;
//# sourceMappingURL=lever.d.ts.map