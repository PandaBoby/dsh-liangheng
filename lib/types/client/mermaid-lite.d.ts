/**
 * Zero-dependency lightweight Mermaid parser & SVG renderer for DSH chat fences.
 *
 * Supports the three highest-value engineering diagram types (`flowchart`/`graph`,
 * `sequenceDiagram`, `stateDiagram`/`stateDiagram-v2`) with theme-aware CSS
 * custom properties, CJK-aware text measurement, and strict XML escaping.
 * Returns `null` on unsupported or empty diagrams so the fence falls back to the
 * host's syntax-highlighted code block.
 */
export type DiagramKind = 'flowchart' | 'sequence' | 'state';
export interface RenderedDiagram {
    readonly kind: DiagramKind;
    readonly width: number;
    readonly height: number;
    readonly svgMarkup: string;
}
/**
 * Parse and render a Mermaid block into responsive inline SVG markup.
 * Returns `null` when the block is empty or uses an unsupported diagram type.
 */
export declare function parseMermaidDiagram(source: string): RenderedDiagram | null;
//# sourceMappingURL=mermaid-lite.d.ts.map