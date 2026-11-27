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
import { type ReactNode } from 'react';
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { DraftAttachmentId } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
import { type QueuedBlock, type QueuedImageRef } from './queue-pullback.ts';
/** One still-queued message, read off the `inbox` projection. */
export interface QueuedRow {
    readonly id: string;
    readonly content: readonly QueuedBlock[];
    /** Wire provenance; only `user` rows carry an RPC echo to de-duplicate against. */
    readonly source?: unknown;
}
/** One locally sending submission that the Host queue has not echoed yet. */
export interface PendingRow {
    readonly requestId: string;
    readonly placement: string;
    readonly text: string;
    readonly attachments: readonly ({
        readonly type: 'image';
        readonly value: {
            readonly previewUrl: string;
        };
    } | {
        readonly type: 'file';
        readonly value: {
            readonly attachmentId: string;
            readonly name: string;
        };
    })[];
}
/** What a staged row hands to the composer. */
export interface StagedRow {
    readonly text: string;
    /** Draft attachment ids already registered with the conversation service. */
    readonly draftIds: readonly DraftAttachmentId[];
}
/**
 * Host-side half of the strip, bound per Session at registration: the queue
 * verbs, the image URL resolver, and the draft-attachment staging step.
 */
export interface QueueStripFace {
    /** Turn a queued row's durable images into draft attachments; never touches the queue. */
    stage(row: QueuedRow, uploadImages: boolean): Promise<StagedRow>;
    remove(id: string): Promise<void>;
    steer(id: string): Promise<void>;
    /** Browser URL for one durable queued image. */
    imageUrl(ref: QueuedImageRef): Promise<string>;
}
/** Full props: dock owner share + Session standard kit + the bound face + copy. */
export type QueueStripProps = PropsRuntime<'conversation.input.dock'> & QueueStripFace & PropsLocale<typeof NS>;
/**
 * Render the queued-message strip.
 * @param props - dock owner share, Session standard kit, bound face, and copy.
 * @returns the strip, or nothing while the queue is empty.
 */
export declare function QueueStrip(props: QueueStripProps): ReactNode;
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
export declare function installQueueStrip(ctx: ClientContext): void;
//# sourceMappingURL=QueueStrip.d.ts.map