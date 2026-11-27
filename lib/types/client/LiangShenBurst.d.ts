/**
 * The jackpot overlay: flash, shockwave rings, sparks, and the banner.
 *
 * It plays when the preset picker above the composer lands on LiangHeng mode —
 * there is no control here to operate. The slot entry paints nothing while idle
 * (the overlay is viewport-fixed and pointer-transparent), so the composer row
 * stays exactly as the host drew it.
 */
import { type ReactElement } from 'react';
import type { BurstFace } from './preset-watcher.ts';
/** Slot entry for `conversation.input.right`: the overlay, and nothing else. */
export declare function LiangShenBurst(face: BurstFace): ReactElement | null;
//# sourceMappingURL=LiangShenBurst.d.ts.map