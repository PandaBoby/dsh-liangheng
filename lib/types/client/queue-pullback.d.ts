/**
 * Pull-back planning for the queued-message strip.
 *
 * The host's own queue strip edits a queued row in place, and its inline
 * editor only speaks text: an image- or file-bearing row is refused outright
 * (`queue.edit.unsupported`). This package's strip instead moves the row back
 * into the composer, where the full editor can change the words and the
 * pictures together.
 *
 * Text and images survive that round trip. Durable file references do not: the
 * Host publishes no byte channel for a file attachment, and the composer's
 * attachment registry only accepts browser-owned `File`s. Such rows keep the
 * host's text-only behaviour rather than silently dropping their file, so this
 * module answers "can this row go back to the composer" as well as "what does
 * it carry".
 */
/**
 * Durable image reference, narrowed to the fields this package reads.
 *
 * The value stays the row's own wire object: the Host's image resolver takes it
 * verbatim, so nothing outside these three fields is copied away here.
 */
export interface QueuedImageRef {
    /** Opaque storage identifier the Host resolves to bytes. */
    readonly attachmentId: string;
    /** Verified media type; also picks the placeholder file extension. */
    readonly mediaType: string;
    /** Display name stripped of local paths, when the upload carried one. */
    readonly name?: string | undefined;
}
/** Durable file reference, narrowed to what the strip displays (again the row's own object). */
export interface QueuedFileRef {
    /** Opaque content-addressed storage identifier. */
    readonly attachmentId: string;
    /** Sanitized display filename. */
    readonly name: string;
}
/** One content block of a queued inbox row: inbox projections are wire data, so only the read shape is typed. */
export type QueuedBlock = {
    readonly type: 'text';
    readonly text: string;
} | {
    readonly type: string;
    readonly attachment?: unknown;
};
/** What one queued row carries into the composer. */
export interface PullBackPlan {
    /** Concatenated text blocks, in block order. */
    readonly text: string;
    readonly images: readonly QueuedImageRef[];
    readonly files: readonly QueuedFileRef[];
}
/**
 * Read one queued row's content into the pieces the composer can take back.
 * @param content - the row's wire content blocks.
 * @returns its text, plus the durable images and files it references.
 */
export declare function planPullBack(content: readonly QueuedBlock[]): PullBackPlan;
/**
 * Whether the composer can take this row back whole.
 * @param plan - the row's pull-back plan.
 * @returns false when the row carries a file the composer has no way to re-open.
 */
export declare function pullBackSupported(plan: PullBackPlan): boolean;
/**
 * Filename to give a re-staged image: its own name when it had one, otherwise
 * one derived from the media type so the composer rail shows a sane label.
 * @param image - one queued image reference.
 * @returns a display filename.
 */
export declare function imageFileName(image: QueuedImageRef): string;
//# sourceMappingURL=queue-pullback.d.ts.map