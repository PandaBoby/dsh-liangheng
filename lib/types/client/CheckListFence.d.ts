import { type ReactNode } from 'react';
export interface CheckListFenceProps {
    readonly lang?: string;
    readonly code: string;
    readonly streaming?: boolean;
    readonly children?: ReactNode;
}
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
export declare function CheckListFence({ code, children }: CheckListFenceProps): ReactNode;
//# sourceMappingURL=CheckListFence.d.ts.map