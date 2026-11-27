import { type ReactNode } from 'react';
import type { LiangShenKey } from './locales.ts';
export interface MermaidFenceProps {
    readonly lang: string;
    readonly code: string;
    readonly streaming: boolean;
    readonly meta?: string | undefined;
    readonly children?: ReactNode;
    readonly t?: (key: LiangShenKey) => string;
}
/**
 * Render Mermaid fences as interactive inline SVG diagrams inside DSH chat,
 * falling back seamlessly to DSH's native code block while streaming or on
 * unsupported diagram types.
 */
export declare function MermaidFence({ code, streaming, children, t }: MermaidFenceProps): ReactNode;
//# sourceMappingURL=MermaidFence.d.ts.map