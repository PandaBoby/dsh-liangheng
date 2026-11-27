import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { parseMermaidDiagram } from './mermaid-lite.ts'
import type { LiangShenKey } from './locales.ts'
import css from './MermaidFence.module.css'

export interface MermaidFenceProps {
  readonly lang: string
  readonly code: string
  readonly streaming: boolean
  readonly meta?: string | undefined
  readonly children?: ReactNode
  readonly t?: (key: LiangShenKey) => string
}

function labelFor(t: MermaidFenceProps['t'], key: LiangShenKey, fallback: string): string {
  if (typeof t === 'function') {
    const out = t(key)
    if (typeof out === 'string' && out !== '') return out
  }
  return fallback
}

/**
 * Render Mermaid fences as interactive inline SVG diagrams inside DSH chat,
 * falling back seamlessly to DSH's native code block while streaming or on
 * unsupported diagram types.
 */
export function MermaidFence({ code, streaming, children, t }: MermaidFenceProps): ReactNode {
  const [view, setView] = useState<'graph' | 'code'>('graph')
  const [zoomed, setZoomed] = useState(false)
  const [copied, setCopied] = useState(false)

  const diagram = useMemo(
    () => (streaming ? null : parseMermaidDiagram(code)),
    [code, streaming],
  )

  useEffect(() => {
    if (!zoomed) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomed(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown) }
  }, [zoomed])

  if (streaming || diagram === null) {
    return children ?? null
  }

  const copyCode = () => {
    void navigator.clipboard?.writeText?.(code).then(() => {
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 1600)
    }).catch(() => {})
  }

  return (
    <div className={css.card} data-liangheng-mermaid={diagram.kind}>
      <div className={css.toolbar}>
        <span className={css.badge}>{`mermaid · ${diagram.kind}`}</span>
        <div className={css.actions}>
          <div className={css.tabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'graph'}
              className={`${css.btn} ${view === 'graph' ? css.btnActive : ''}`}
              onClick={() => { setView('graph') }}
            >
              {labelFor(t, 'diagram.graph', '图表')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'code'}
              className={`${css.btn} ${view === 'code' ? css.btnActive : ''}`}
              onClick={() => { setView('code') }}
            >
              {labelFor(t, 'diagram.code', '源码')}
            </button>
          </div>
          {view === 'graph' && (
            <button
              type="button"
              className={css.btn}
              onClick={() => { setZoomed(true) }}
            >
              {labelFor(t, 'diagram.zoom', '放大预览')}
            </button>
          )}
          <button type="button" className={css.btn} onClick={copyCode}>
            {copied ? labelFor(t, 'diagram.copied', '已复制') : labelFor(t, 'diagram.copy', '复制')}
          </button>
        </div>
      </div>

      {view === 'graph' ? (
        <div
          className={css.canvasWrap}
          role="button"
          tabIndex={0}
          aria-label={labelFor(t, 'diagram.zoom', '放大预览')}
          onClick={() => { setZoomed(true) }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setZoomed(true)
            }
          }}
          dangerouslySetInnerHTML={{ __html: diagram.svgMarkup }}
        />
      ) : (
        <div className={css.codeWrap}>{children}</div>
      )}

      {zoomed && typeof document !== 'undefined' && createPortal(
        <div
          className={css.overlay}
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) setZoomed(false)
          }}
        >
          <div className={css.dialog}>
            <div className={css.modalHeader}>
              <span className={css.badge}>{`mermaid · ${diagram.kind}`}</span>
              <button type="button" className={css.btn} onClick={() => { setZoomed(false) }}>
                {labelFor(t, 'diagram.close', '关闭预览')}
              </button>
            </div>
            <div
              className={css.modalSvg}
              dangerouslySetInnerHTML={{ __html: diagram.svgMarkup }}
            />
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
