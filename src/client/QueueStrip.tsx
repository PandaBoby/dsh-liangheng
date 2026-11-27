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

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
import type { DraftAttachmentId, IConversation } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { NS } from './locales.ts'
import {
  imageFileName, planPullBack, pullBackSupported, type PullBackPlan, type QueuedBlock, type QueuedImageRef,
} from './queue-pullback.ts'
import css from './QueueStrip.module.css'

const EMPTY_ROWS: readonly QueuedRow[] = []
const EMPTY_PENDING: readonly PendingRow[] = []

/** One still-queued message, read off the `inbox` projection. */
export interface QueuedRow {
  readonly id: string
  readonly content: readonly QueuedBlock[]
  /** Wire provenance; only `user` rows carry an RPC echo to de-duplicate against. */
  readonly source?: unknown
}

/** One locally sending submission that the Host queue has not echoed yet. */
export interface PendingRow {
  readonly requestId: string
  readonly placement: string
  readonly text: string
  readonly attachments: readonly (
    | { readonly type: 'image'; readonly value: { readonly previewUrl: string } }
    | { readonly type: 'file'; readonly value: { readonly attachmentId: string; readonly name: string } }
  )[]
}

/** What a staged row hands to the composer. */
export interface StagedRow {
  readonly text: string
  /** Draft attachment ids already registered with the conversation service. */
  readonly draftIds: readonly DraftAttachmentId[]
}

/**
 * Host-side half of the strip, bound per Session at registration: the queue
 * verbs, the image URL resolver, and the draft-attachment staging step.
 */
export interface QueueStripFace {
  /** Turn a queued row's durable images into draft attachments; never touches the queue. */
  stage(row: QueuedRow, uploadImages: boolean): Promise<StagedRow>
  remove(id: string): Promise<void>
  steer(id: string): Promise<void>
  /** Browser URL for one durable queued image. */
  imageUrl(ref: QueuedImageRef): Promise<string>
}

/** Full props: dock owner share + Session standard kit + the bound face + copy. */
export type QueueStripProps = PropsRuntime<'conversation.input.dock'> & QueueStripFace & PropsLocale<typeof NS>

/**
 * Focus the composer editor after a pull-back.
 *
 * `InputActions` has no focus verb, so this reaches for the editor the shell
 * marks with the same `data-*` attributes this package's stylesheet already
 * keys on. A shell that renames them only costs the focus, never the pull-back.
 */
function focusComposer(): void {
  try {
    document.querySelector<HTMLElement>('[data-composer-card] [contenteditable="true"]')?.focus({ preventScroll: true })
  } catch {
    // Focus is a nicety; a locked-down DOM just skips it.
  }
}

/** One queued image thumbnail, resolved through the Session's image cache. */
function QueueThumb({ image, imageUrl, label }: {
  readonly image: QueuedImageRef
  readonly imageUrl: QueueStripFace['imageUrl']
  readonly label: string
}): ReactNode {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    let live = true
    void imageUrl(image).then(
      (resolved) => { if (live) setUrl(resolved) },
      () => { if (live) setUrl(null) },
    )
    return () => { live = false }
  }, [image, imageUrl])
  if (url === null) return <span className={css.thumb} data-pending="" aria-hidden="true" />
  return <img className={css.thumb} src={url} alt={label} />
}

/** One durable file badge; files cannot round-trip, so this never opens them. */
function QueueFile({ name, label }: { readonly name: string; readonly label: string }): ReactNode {
  return (
    <span className={css.file} title={label}>
      <span className={css.fileName}>{name}</span>
    </span>
  )
}

interface StripGlyphProps {
  readonly kind: 'queue' | 'chevron-down' | 'chevron-up' | 'trash' | 'steer' | 'more'
}

/** Minimal inline glyphs: the stepper avoids pulling the host's icon package into this bundle. */
function StripGlyph({ kind }: StripGlyphProps): ReactNode {
  const path = {
    queue: 'M2 4h7M2 7h7M2 10h7',
    'chevron-down': 'M3.5 5.5 6 8l2.5-2.5',
    'chevron-up': 'M3.5 8.5 6 6l2.5 2.5',
    trash: 'M3 4h6M5 4V3h2v1M4.5 4l.4 5.5h2.2L7.5 4',
    // A bent arrow reads as "fold this into the reply in flight"; the paper
    // plane it replaced reads as "send this message", which is the other action.
    steer: 'M2.5 3v3.2a1.6 1.6 0 0 0 1.6 1.6H8M8 5l2.2 2.6L8 10.2',
    more: 'M3 6h.01M6 6h.01M9 6h.01',
  }[kind]
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d={path}
        stroke="currentColor"
        strokeWidth={kind === 'more' ? 1.9 : 1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface RowMenuProps {
  /** The `⋯` button the menu hangs off. */
  readonly anchor: HTMLElement
  readonly removeLabel: string
  readonly removeAria: string
  readonly hint: string
  readonly onDelete: () => void
  readonly onClose: () => void
}

/**
 * One row's action menu, portalled to the body.
 *
 * The strip lives inside a clipping panel (rounded corners, capped height), so
 * an absolutely positioned menu would be cut off by the list scrollport. A
 * portal keeps it above the composer; an outside press, Escape, scroll or
 * resize dismisses it.
 */
function RowMenu({ anchor, removeLabel, removeAria, hint, onDelete, onClose }: RowMenuProps): ReactNode {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const dismiss = (event: MouseEvent): void => {
      const target = event.target as Node | null
      if (target !== null && (ref.current?.contains(target) === true || anchor.contains(target))) return
      onClose()
    }
    const close = (): void => { onClose() }
    document.addEventListener('mousedown', dismiss)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('mousedown', dismiss)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [anchor, onClose])
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [])
  const rect = anchor.getBoundingClientRect()
  return createPortal(
    <div
      ref={ref}
      className={css.menu}
      role="menu"
      style={{ top: rect.bottom + 4, right: Math.max(8, window.innerWidth - rect.right) }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return
        event.stopPropagation()
        // Escape is a keyboard exit, so the caret belongs back on the trigger.
        anchor.focus()
        onClose()
      }}
    >
      <button type="button" role="menuitem" className={css.menuItem} aria-label={removeAria} onClick={onDelete}>
        <StripGlyph kind="trash" />
        <span className={css.menuLabel}>{removeLabel}</span>
        <span className={css.menuHint}>{hint}</span>
      </button>
    </div>,
    document.body,
  )
}

/**
 * Render the queued-message strip.
 * @param props - dock owner share, Session standard kit, bound face, and copy.
 * @returns the strip, or nothing while the queue is empty.
 */
export function QueueStrip(props: QueueStripProps): ReactNode {
  const { useProjection, useSession, inputActions, stage, remove, steer, imageUrl, t } = props
  const rows = (useProjection('inbox') as unknown as { 'next-turn'?: readonly QueuedRow[] } | undefined)?.['next-turn']
    ?? EMPTY_ROWS
  const pendingSubmissions = useSession(s => (s as unknown as { pendingSubmissions?: readonly PendingRow[] }).pendingSubmissions)
    ?? EMPTY_PENDING
  const running = useSession(s => s.running)
  const uploadImages = useSession(s => s.subagent === null)
  const queueMutable = useSession(s => s.subagent === null || s.subagent.address.mode === 'continuable')

  const queue = useMemo(() => {
    const inChat = new Set(pendingSubmissions
      .filter(item => item.placement === 'transcript')
      .map(item => item.requestId))
    if (inChat.size === 0) return rows
    return rows.filter(({ source }) => {
      const echo = (source as { kind?: string; rpcId?: string } | undefined)
      return echo?.kind !== 'user' || echo.rpcId === undefined || !inChat.has(echo.rpcId)
    })
  }, [pendingSubmissions, rows])
  const pendingQueue = useMemo(() => {
    const admitted = new Set(queue.flatMap(({ source }) => {
      const echo = (source as { kind?: string; rpcId?: string } | undefined)
      return echo?.kind === 'user' && echo.rpcId !== undefined ? [echo.rpcId] : []
    }))
    return pendingSubmissions.filter(item => item.placement === 'queued' && !admitted.has(item.requestId))
  }, [pendingSubmissions, queue])

  const rowCount = queue.length + pendingQueue.length
  const [busy, setBusy] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(true)
  const [error, setError] = useState<string | null>(null)
  /** The row whose ⋯ menu is open, with the button it hangs off. */
  const [menuFor, setMenuFor] = useState<{ readonly id: string; readonly anchor: HTMLElement } | null>(null)
  const listId = useId()

  useEffect(() => {
    if (rowCount === 0 && !collapsed) setCollapsed(true)
  }, [collapsed, rowCount])
  useEffect(() => {
    if (error !== null && rowCount === 0) setError(null)
  }, [error, rowCount])

  if (rowCount === 0) return null

  const expanded = !collapsed || busy !== null
  const listVisible = rowCount === 1 || expanded

  /** Move one queued message back into the composer, then retire its queue row. */
  const pullBack = async (row: QueuedRow): Promise<void> => {
    setError(null)
    // A file-bearing row cannot round-trip, and a disabled button could not say
    // why — so it stays clickable and the reason lands as visible copy.
    if (!pullBackSupported(planPullBack(row.content))) {
      setError(t('queue.editUnsupported'))
      return
    }
    setBusy(row.id)
    try {
      const staged = await stage(row, uploadImages)
      const text = staged.text
      if (text !== '') {
        // Insert at the caret so a draft already in progress survives; a shell
        // that moved the caret underneath us falls back to replacing the draft.
        if (!inputActions.insertText(text, inputActions.captureInsertion())) inputActions.setDraft(text)
      }
      if (staged.draftIds.length > 0 && !inputActions.addAttachments(staged.draftIds)) {
        for (const id of staged.draftIds) inputActions.removeAttachment(id)
        setError(t('queue.pullBackLocked'))
        return
      }
      await remove(row.id)
      focusComposer()
    } catch {
      setError(t('queue.pullBackFailed'))
    } finally {
      setBusy(current => current === row.id ? null : current)
    }
  }

  const act = async (id: string, action: 'remove' | 'steer'): Promise<void> => {
    setError(null)
    setBusy(id)
    try {
      if (action === 'remove') await remove(id)
      else await steer(id)
    } catch {
      setError(action === 'remove' ? t('queue.removeFailed') : t('queue.steerFailed'))
    } finally {
      setBusy(current => current === id ? null : current)
    }
  }

  return (
    <div className={css.dock} data-queue-dock="">
      <div className={css.panel}>
        {rowCount > 1 && (
          <button
            type="button"
            className={css.header}
            aria-controls={listId}
            aria-expanded={expanded}
            aria-label={expanded ? t('queue.collapse') : t('queue.expand')}
            disabled={busy !== null}
            onClick={() => { setCollapsed(value => !value) }}
          >
            <span className={css.lead} aria-hidden="true"><StripGlyph kind="queue" /></span>
            <span className={css.count}>{t('queue.count', { n: rowCount })}</span>
            {!listVisible && pendingQueue.length > 0 && (
              <span className={css.status} role="status">{t('queue.sending')}</span>
            )}
            <span className={css.chevron} aria-hidden="true">
              <StripGlyph kind={expanded ? 'chevron-down' : 'chevron-up'} />
            </span>
          </button>
        )}
        <ul id={listId} className={css.list} hidden={!listVisible}>
          {listVisible && queue.map((row) => {
            const plan: PullBackPlan = planPullBack(row.content)
            const supported = pullBackSupported(plan)
            const rowBusy = busy === row.id
            return (
              <li
                key={row.id}
                className={css.row}
                data-interactive={queueMutable && busy === null ? '' : undefined}
                onClick={queueMutable && busy === null ? () => { void pullBack(row) } : undefined}
              >
                {rowCount === 1 && <span className={css.lead} aria-hidden="true"><StripGlyph kind="queue" /></span>}
                {(plan.images.length > 0 || plan.files.length > 0) && (
                  <span className={css.attachments}>
                    {plan.images.map((image, index) => (
                      <QueueThumb
                        key={`${image.attachmentId}:${index}`}
                        image={image}
                        imageUrl={imageUrl}
                        label={t('queue.image')}
                      />
                    ))}
                    {plan.files.map((file, index) => (
                      <QueueFile
                        key={`${file.attachmentId}:${index}`}
                        name={file.name}
                        label={t('queue.file', { name: file.name })}
                      />
                    ))}
                  </span>
                )}
                <span className={css.preview}>{plan.text}</span>
                {queueMutable && (
                  <div className={css.actions} onClick={(event) => { event.stopPropagation() }}>
                    <button
                      type="button"
                      className={css.primary}
                      aria-label={t('queue.edit')}
                      title={supported ? t('queue.edit') : t('queue.editUnsupported')}
                      disabled={busy !== null}
                      onClick={() => { void pullBack(row) }}
                    >
                      {t('queue.edit')}
                    </button>
                    {running && (
                      <button
                        type="button"
                        className={css.action}
                        aria-label={t('queue.steer')}
                        title={t('queue.steer')}
                        disabled={busy !== null}
                        onClick={() => { void act(row.id, 'steer') }}
                      >
                        <StripGlyph kind="steer" />
                      </button>
                    )}
                    <button
                      type="button"
                      className={css.action}
                      aria-label={t('queue.more')}
                      title={t('queue.more')}
                      aria-haspopup="menu"
                      aria-expanded={menuFor?.id === row.id}
                      disabled={busy !== null}
                      onClick={(event) => {
                        const anchor = event.currentTarget
                        setMenuFor(current => (current?.id === row.id ? null : { id: row.id, anchor }))
                      }}
                    >
                      <StripGlyph kind="more" />
                    </button>
                    {rowBusy && <span className={css.status} role="status">{t('queue.pullingBack')}</span>}
                  </div>
                )}
              </li>
            )
          })}
          {listVisible && pendingQueue.map((submission) => (
            <li key={submission.requestId} className={`${css.row} ${css.pendingRow}`} data-submission-echo="">
              {rowCount === 1 && <span className={css.lead} aria-hidden="true"><StripGlyph kind="queue" /></span>}
              {submission.attachments.length > 0 && (
                <span className={css.attachments}>
                  {submission.attachments.map((attachment, index) => attachment.type === 'image'
                    ? <img key={`${attachment.value.previewUrl}:${index}`} className={css.thumb} src={attachment.value.previewUrl} alt={t('queue.image')} />
                    : (
                      <QueueFile
                        key={`${attachment.value.attachmentId}:${index}`}
                        name={attachment.value.name}
                        label={t('queue.file', { name: attachment.value.name })}
                      />
                    ))}
                </span>
              )}
              <span className={css.preview}>{submission.text}</span>
              <span className={css.status} role="status">{t('queue.sending')}</span>
            </li>
          ))}
        </ul>
        {menuFor !== null && (
          <RowMenu
            anchor={menuFor.anchor}
            removeLabel={t('queue.removeThis')}
            removeAria={t('queue.remove')}
            hint={t('queue.removeHint')}
            onDelete={() => {
              const id = menuFor.id
              setMenuFor(null)
              void act(id, 'remove')
            }}
            onClose={() => { setMenuFor(null) }}
          />
        )}
        {error !== null && <p className={css.error} role="status">{error}</p>}
      </div>
    </div>
  )
}

/**
 * Session identity type the scope and image services address.
 *
 * These are read structurally rather than off the merged `Context`: the host
 * half of `dsh-session` also merges a `sessions` member (the Host-side store),
 * and whichever declaration a checkout sees last is not something a plugin can
 * rely on. Runtime shape is identical either way.
 */
type DockSessionId = string

/** Session-scope lookup this package needs (the Client object layer's `scope`). */
interface SessionScopeFace {
  get(service: string): unknown
}

/** The conversation service verbs the strip needs: the public face plus draft staging. */
interface ConversationFace extends IConversation {
  /** Browser-owned draft attachment factory; a class method, not part of the frozen face. */
  createDrafts(
    sessionId: DockSessionId,
    files: readonly File[],
    uploadImages: boolean,
  ): readonly { readonly id: DraftAttachmentId }[]
}

/** Durable-image URL resolver supplied by the conversation assembly service. */
interface ImageUrlFace {
  imageUrl(sessionId: DockSessionId, attachment: QueuedImageRef): Promise<string>
}

/** Face for a Session whose services are missing: every verb reports the reason. */
function unavailableFace(reason: string): QueueStripFace {
  const fail = (): Promise<never> => Promise.reject(new Error(reason))
  return { stage: fail, remove: fail, steer: fail, imageUrl: fail }
}

/**
 * Bind the strip's face for one Session.
 * @param ctx - the browser plugin context.
 * @param sessionId - Session the dock entry is rendering for.
 * @returns the queue verbs, or undefined when this shell cannot supply them.
 */
function bindFace(ctx: ClientContext, sessionId: DockSessionId): QueueStripFace | undefined {
  const sessions = (ctx as unknown as { sessions?: { scope?(id: DockSessionId): SessionScopeFace | undefined } }).sessions
  const conversation = sessions?.scope?.(sessionId)?.get('conversation') as ConversationFace | undefined
  const uiConversation = (ctx.get as (service: string) => unknown)('uiConversation') as ImageUrlFace | undefined
  if (conversation === undefined || uiConversation === undefined) return undefined
  // Without the staging method there is no route from durable bytes to a draft
  // attachment, so leave the host strip in place rather than half-replacing it.
  if (typeof conversation.createDrafts !== 'function') return undefined
  const updateQueue = conversation.updateQueue.bind(conversation)
  return {
    async stage(row, uploadImages) {
      const plan = planPullBack(row.content)
      const draftIds: DraftAttachmentId[] = []
      for (const image of plan.images) {
        const response = await fetch(await uiConversation.imageUrl(sessionId, image))
        // An opaque status-0 response is a readable blob; only real failures throw.
        if (!response.ok && response.status !== 0) {
          throw new Error(`queue pull-back: image ${image.attachmentId} read ${response.status}`)
        }
        const file = new File([await response.blob()], imageFileName(image), { type: image.mediaType })
        // shortcut: createDrafts is the host's class method, not part of IConversation,
        // and the only route from durable bytes into the composer's attachment
        // registry. Re-check it on dsh upgrades (guarded above).
        draftIds.push(...conversation.createDrafts(sessionId, [file], uploadImages).map(draft => draft.id))
      }
      return { text: plan.text, draftIds }
    },
    remove: (id) => updateQueue(id as Parameters<IConversation['updateQueue']>[0], { kind: 'remove' }),
    steer: (id) => updateQueue(id as Parameters<IConversation['updateQueue']>[0], { kind: 'steer' }),
    imageUrl: ref => uiConversation.imageUrl(sessionId, ref),
  }
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
export function installQueueStrip(ctx: ClientContext): void {
  ctx.slots.inject('conversation.input.dock', () => {
    try {
      const unregister = ctx.slots.register({
        name: 'conversation.input.dock',
        id: 'queue',
        order: 20,
        // Lower than the host's default 0, which is what makes this entry the
        // cell's winner instead of a second priority-0 registration (that throws).
        priority: -1,
        locale: NS,
        inject: sessionId => bindFace(ctx, sessionId)
          ?? unavailableFace('liangheng queue strip: the conversation service is unavailable'),
      }, QueueStrip)
      return () => { unregister() }
    } catch {
      return () => {}
    }
  })
}
