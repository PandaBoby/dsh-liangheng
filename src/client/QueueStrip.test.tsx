// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueueStrip, type QueueStripProps, type QueuedRow } from './QueueStrip.tsx'

afterEach(cleanup)

interface Harness {
  readonly props: QueueStripProps
  readonly calls: string[]
}

/**
 * Compose the strip's props the way the dock does, with a fake Session kit.
 * @param rows - queued inbox rows to project.
 * @param behaviour - per-test overrides of the face, input verbs, and Session state.
 * @returns props to render plus the ordered call log.
 */
function harness(rows: readonly QueuedRow[], behaviour: {
  running?: boolean
  textFallback?: boolean
  attachmentsAccepted?: boolean
  stageRejects?: boolean
  queueMutable?: boolean
} = {}): Harness {
  const calls: string[] = []
  const record = (name: string) => { calls.push(name) }
  const state = {
    running: behaviour.running !== false,
    subagent: behaviour.queueMutable === false ? { address: { mode: 'detached' } } : null,
    pendingSubmissions: [],
  }
  const props = {
    sessionId: 'session-1',
    session: {},
    input: {},
    useSession: (selector: (session: typeof state) => unknown) => selector(state),
    useProjection: () => ({ 'next-turn': rows }),
    useConversation: () => undefined,
    useInput: () => undefined,
    useWorkspaces: () => undefined,
    inputActions: {
      captureInsertion: () => { record('capture'); return { offset: 0, revision: 0 } },
      insertText: () => { record('insert'); return behaviour.textFallback !== true },
      setDraft: () => { record('setDraft') },
      addAttachments: () => { record('addAttachments'); return behaviour.attachmentsAccepted !== false },
      removeAttachment: () => { record('removeAttachment') },
      insertQuote: () => false,
      persistDraft: () => {},
      submit: () => {},
    },
    stage: async () => {
      record('stage')
      if (behaviour.stageRejects === true) throw new Error('bytes unavailable')
      return {
        text: '排队的内容',
        draftIds: rows.some(row => row.content.some(block => block.type === 'image')) ? ['draft-1'] : [],
      }
    },
    remove: async () => { record('remove') },
    steer: async () => { record('steer') },
    imageUrl: async () => 'blob:preview',
    t: (key: string) => key,
  } as unknown as QueueStripProps
  return { props, calls }
}

describe('QueueStrip', () => {
  it('pulls a queued message back into the composer, then retires the row', async () => {
    const { props, calls } = harness([{ id: 'm1', content: [{ type: 'text', text: '排队的内容' }] }])
    render(<QueueStrip {...props} />)

    fireEvent.click(screen.getByRole('button', { name: 'queue.edit' }))

    await waitFor(() => { expect(calls).toContain('remove') })
    // The row leaves the queue only after the composer took the content.
    expect(calls).toEqual(['stage', 'capture', 'insert', 'remove'])
  })

  it('treats a click anywhere on the row as the same pull-back', async () => {
    const { props, calls } = harness([{ id: 'm1b', content: [{ type: 'text', text: '排队的内容' }] }])
    render(<QueueStrip {...props} />)

    fireEvent.click(screen.getByText('排队的内容'))

    await waitFor(() => { expect(calls).toEqual(['stage', 'capture', 'insert', 'remove']) })
  })

  it('stages durable images as draft attachments before removing the row', async () => {
    const { props, calls } = harness([{
      id: 'm2',
      content: [
        { type: 'image', attachment: { attachmentId: 'sha-1', mediaType: 'image/png' } },
        { type: 'text', text: '看图' },
      ],
    }])
    render(<QueueStrip {...props} />)

    fireEvent.click(screen.getByRole('button', { name: 'queue.edit' }))

    await waitFor(() => { expect(calls).toContain('remove') })
    expect(calls).toEqual(['stage', 'capture', 'insert', 'addAttachments', 'remove'])
  })

  it('keeps a file-bearing row queued and says why out loud', async () => {
    const { props, calls } = harness([{
      id: 'm3',
      content: [{ type: 'file', attachment: { attachmentId: 'sha-2', name: 'report.pdf' } }],
    }])
    render(<QueueStrip {...props} />)

    fireEvent.click(screen.getByRole('button', { name: 'queue.edit' }))

    await waitFor(() => { expect(screen.getByText('queue.editUnsupported')).toBeTruthy() })
    expect(calls).toEqual([])
  })

  it('keeps the row queued when staging fails', async () => {
    const { props, calls } = harness(
      [{ id: 'm4', content: [{ type: 'text', text: '一条消息' }] }],
      { stageRejects: true },
    )
    render(<QueueStrip {...props} />)

    fireEvent.click(screen.getByRole('button', { name: 'queue.edit' }))

    await waitFor(() => { expect(screen.getByText('queue.pullBackFailed')).toBeTruthy() })
    expect(calls).toEqual(['stage'])
    expect(calls).not.toContain('remove')
  })

  it('drops the staged attachments again when the composer refuses them', async () => {
    const { props, calls } = harness(
      [{
        id: 'm5',
        content: [
          { type: 'image', attachment: { attachmentId: 'sha-3', mediaType: 'image/webp' } },
          { type: 'text', text: '再来一张' },
        ],
      }],
      { attachmentsAccepted: false },
    )
    render(<QueueStrip {...props} />)

    fireEvent.click(screen.getByRole('button', { name: 'queue.edit' }))

    await waitFor(() => { expect(screen.getByText('queue.pullBackLocked')).toBeTruthy() })
    expect(calls).toContain('removeAttachment')
    expect(calls).not.toContain('remove')
  })

  it('offers steer only while a reply is running', () => {
    const running = harness([{ id: 'm6', content: [{ type: 'text', text: '一' }] }])
    render(<QueueStrip {...running.props} />)
    expect(screen.getByRole('button', { name: 'queue.steer' })).toBeTruthy()
    cleanup()

    const idle = harness([{ id: 'm7', content: [{ type: 'text', text: '一' }] }], { running: false })
    render(<QueueStrip {...idle.props} />)
    expect(screen.queryByRole('button', { name: 'queue.steer' })).toBeNull()
  })

  it('deletes through the ⋯ menu instead of a bare trash button', async () => {
    const { props, calls } = harness([{ id: 'm8', content: [{ type: 'text', text: '一' }] }])
    render(<QueueStrip {...props} />)

    expect(screen.queryByRole('menuitem')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'queue.more' }))

    const item = screen.getByRole('menuitem')
    expect(item.getAttribute('aria-label')).toBe('queue.remove')
    fireEvent.click(item)

    await waitFor(() => { expect(calls).toEqual(['remove']) })
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('closes the menu on Escape', () => {
    const { props } = harness([{ id: 'm9', content: [{ type: 'text', text: '一' }] }])
    render(<QueueStrip {...props} />)

    fireEvent.click(screen.getByRole('button', { name: 'queue.more' }))
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('collapses several rows behind a count header', () => {
    const { props } = harness([
      { id: 'm10', content: [{ type: 'text', text: '一' }] },
      { id: 'm11', content: [{ type: 'text', text: '二' }] },
    ])
    render(<QueueStrip {...props} />)

    expect(screen.getByRole('button', { name: 'queue.expand' })).toBeTruthy()
    expect(screen.queryByText('一')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'queue.expand' }))
    expect(screen.getByText('一')).toBeTruthy()
    expect(screen.getByText('二')).toBeTruthy()
  })

  it('renders nothing while the queue is empty', () => {
    const { props } = harness([])
    const { container } = render(<QueueStrip {...props} />)
    expect(container.firstChild).toBeNull()
  })
})
