/**
 * Preset watcher: turns "the preset picker above the composer landed on
 * LiangHeng mode" into one burst.
 *
 * The plugin owns no control in the composer any more. It reads the same
 * `agentPreset` projection the host writes when a preset is chosen, and the
 * change rule lives in {@link presetLanded}, so the first reading of a page and
 * a move between sessions never fire the overlay.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { LiangShenKey } from './locales.ts';
/** What the burst view renders. */
export interface BurstSnapshot {
    /** Increments each time LiangHeng mode lands, so the overlay replays once. */
    burst: number;
}
/** The injected face the burst view consumes. */
export interface BurstFace {
    /** The snapshot store the view subscribes to. */
    store: SnapshotStore<BurstSnapshot>;
    /** Translate one of this plugin's keys. */
    t: (key: LiangShenKey, vars?: Record<string, string | number>) => string;
}
/** The watcher: one session reading at a time, one burst per landing. */
export declare class PresetWatcher {
    private readonly ctx;
    private readonly store;
    /**
     * The catalog this watcher follows, resolved defensively: the context proxy
     * throws on any service the fiber did not inject, and a deployment without it
     * must leave the overlay silent rather than take the plugin down.
     */
    private readonly sessions;
    private readonly disposers;
    /** The one face this watcher hands out; the view reads it on every render. */
    private cachedFace;
    /**
     * The translator bound to this plugin's locale namespace, resolved on first
     * use. A lookup that resolved nothing is never cached, so a locale service
     * registered after activation still reaches the same face.
     */
    private cachedTranslate;
    /** Session the last reading belonged to. */
    private lastSessionId;
    /** Preset the last reading reported. */
    private lastPreset;
    /** False until the first reading seeds the baseline instead of comparing. */
    private seeded;
    constructor(ctx: ClientContext);
    /** The snapshot store the view subscribes to. */
    snapshot(): SnapshotStore<BurstSnapshot>;
    /** Follow the session catalog; the first reading only seeds the baseline. */
    start(): void;
    /** Release every subscription. Idempotent. */
    dispose(): void;
    /** The inject face handed to the slot entry; the same instance on every read. */
    face(): BurstFace;
    /**
     * The translator bound to this plugin's locale namespace, or undefined while
     * none answers. The binding is resolved once and only on success: a locale
     * service that arrives later than this watcher still gets its chance.
     */
    private translate;
    /** Compare one reading with the last, and celebrate a landing. */
    private refresh;
}
//# sourceMappingURL=preset-watcher.d.ts.map