import { useMemo, type ReactNode } from 'react'
import { parseCheckLines } from './check-list.ts'
import css from './CheckListFence.module.css'

export interface CheckListFenceProps {
  readonly lang?: string
  readonly code: string
  readonly streaming?: boolean
  readonly children?: ReactNode
}

const GLYPH = { pass: '✓', fail: '✗', info: '·' } as const

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
export function CheckListFence({ code, children }: CheckListFenceProps): ReactNode {
  const list = useMemo(() => (typeof code === 'string' ? parseCheckLines(code) : null), [code])
  if (list === null || list.items.length === 0) return children ?? null
  return (
    <div className={css.card} data-failed={list.failed || undefined} role="list">
      {list.items.map((item, index) => (
        <div className={css.row} key={`${index}:${item.key}`} role="listitem">
          <span className={css.tick} data-status={item.status} aria-hidden="true">{GLYPH[item.status]}</span>
          <span className={css.key}>{item.key}</span>
          <span className={css.value}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}
