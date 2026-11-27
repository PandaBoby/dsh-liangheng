/**
 * Contract tests for DSH chat visual polish (`ChatPolish.css`) and theme-aware
 * Mermaid card styles (`MermaidFence.module.css`).
 *
 * These tests guard the structural invariants that keep the plugin safe across
 * DSH host upgrades and non-LiangHeng presets:
 * 1. Every selector in `ChatPolish.css` is strictly scoped under
 *    `html[data-liangheng-chat="on"]` so other presets stay untouched.
 * 2. No private CSS-module hashes appear in `ChatPolish.css`.
 * 3. `.md-code-block` uses `overflow: clip` (never `overflow: hidden`) so the
 *    host's sticky code banner continues sticking on long fences.
 * 4. Composer styling excludes only the inert workspace-picker trigger inside
 *    `[data-input-scroll]`, never live composer cards that carry menu buttons.
 * 5. `MermaidFence.module.css` uses real DSH design tokens (not non-existent
 *    `--dsw-alias-surface-*` aliases that break dark mode).
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const here = dirname(fileURLToPath(import.meta.url))
const chatPolishCss = readFileSync(join(here, 'ChatPolish.css'), 'utf8')
const mermaidCss = readFileSync(join(here, 'MermaidFence.module.css'), 'utf8')

/** Strip CSS comments and return every rule's selector list (unwrapping @media). */
function extractRuleSelectors(css: string): string[] {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const selectors: string[] = []
  let i = 0
  const n = noComments.length

  function parseBlock(): void {
    let prelude = ''
    while (i < n) {
      const ch = noComments[i]
      if (ch === '}') {
        i += 1
        return
      }
      if (ch === '{') {
        const trimmed = prelude.trim()
        prelude = ''
        i += 1
        if (trimmed.startsWith('@media') || trimmed.startsWith('@supports')) {
          parseBlock()
        } else {
          if (trimmed !== '' && !trimmed.startsWith('@')) {
            for (const part of splitTopLevelCommas(trimmed)) {
              selectors.push(part.trim())
            }
          }
          skipDeclarationBlock()
        }
        continue
      }
      prelude += ch
      i += 1
    }
  }

  function skipDeclarationBlock(): void {
    let depth = 1
    while (i < n && depth > 0) {
      if (noComments[i] === '{') depth += 1
      else if (noComments[i] === '}') depth -= 1
      i += 1
    }
  }

  parseBlock()
  return selectors
}

function splitTopLevelCommas(selectorList: string): string[] {
  const parts: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < selectorList.length; i += 1) {
    const ch = selectorList[i]
    if (ch === '(' || ch === '[') depth += 1
    else if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1)
    else if (ch === ',' && depth === 0) {
      parts.push(selectorList.slice(start, i))
      start = i + 1
    }
  }
  parts.push(selectorList.slice(start))
  return parts
}

describe('ChatPolish.css', () => {
  it('scopes every selector strictly under html[data-liangheng-chat="on"]', () => {
    const selectors = extractRuleSelectors(chatPolishCss)
    expect(selectors.length).toBeGreaterThan(30)
    const unscoped = selectors.filter(sel => !sel.startsWith('html[data-liangheng-chat="on"]'))
    expect(unscoped).toEqual([])
  })

  it('uses only stable DOM hooks and never depends on host CSS-module hashes', () => {
    expect(chatPolishCss).not.toMatch(/\._[a-zA-Z0-9]+_[a-z0-9]{4,}_\d+/)
  })

  it('covers thinking, input (composer + user bubble), and output typography', () => {
    expect(chatPolishCss).toContain('[data-variant="think"]')
    expect(chatPolishCss).toContain('[data-step-process]')
    expect(chatPolishCss).toContain('button[data-turn-process]')
    expect(chatPolishCss).toContain('[data-composer-card]')
    expect(chatPolishCss).toContain('[data-message-bubble]')
    expect(chatPolishCss).toContain('[data-chat-group-part="response"]')
    expect(chatPolishCss).toContain('body[data-ds-dark-theme]')
    expect(chatPolishCss).toContain('prefers-reduced-motion: reduce')
  })

  it('preserves sticky code banners via overflow: clip instead of overflow: hidden', () => {
    const matches = [...chatPolishCss.matchAll(/\.md-code-block\s*\{[^}]*\}/g)]
    expect(matches.length).toBeGreaterThanOrEqual(2)
    for (const match of matches) {
      expect(match[0]).toContain('overflow: clip')
      expect(match[0]).not.toContain('overflow: hidden')
    }
  })

  it('draws a quiet fence card: no brand rule, a 5% banner hairline, a tracked label', () => {
    const card = /\[data-chat-group-part="response"\]\s+\.md-code-block\s*\{[^}]*\}/.exec(chatPolishCss)?.[0] ?? ''
    expect(card).toContain('background: var(--dsw-alias-bg-layer-1)')
    // Five fences in a column each painted an accent rule read as decoration.
    expect(card).not.toContain('border-top')
    expect(card).toMatch(/0 10px 24px -14px/)

    const banner = /\[data-code-block-banner\]\s*\{[^}]*\}/.exec(chatPolishCss)?.[0] ?? ''
    expect(banner).toContain('background: var(--dsw-alias-bg-layer-1)')
    expect(banner).toContain('color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent)')

    const label = /\[data-code-block-banner\] > \[data-text-interaction-exclude\]\s*\{[^}]*\}/.exec(chatPolishCss)?.[0] ?? ''
    expect(label).toContain('letter-spacing: 0.11em')
    expect(label).toContain('text-transform: uppercase')
    // A filled pill beside the copy button read as a second control.
    expect(label).toContain('background: none')
  })

  it('targets only the scrollport workspace trigger when excluding inert composers', () => {
    expect(chatPolishCss).toContain('[data-composer-card]:not(:has([data-input-scroll] [aria-haspopup="menu"]))')
    expect(chatPolishCss).not.toContain('[data-composer-card]:not(:has([aria-haspopup="menu"]))')
  })

  it('restores horizontal edge padding on first and last table cells over the host reset', () => {
    expect(chatPolishCss).toContain(':is(th, td):first-child')
    expect(chatPolishCss).toContain(':is(th, td):last-child')
  })

  it('keeps the process scrollport vertical-only, never a second horizontal bar', () => {
    const scrollport = [...chatPolishCss.matchAll(/\[data-step-process-body\]\s*\{[^}]*\}/g)].map(m => m[0])
    expect(scrollport.length).toBeGreaterThan(0)
    for (const rule of scrollport) expect(rule).not.toMatch(/overflow-x:\s*(auto|scroll)/)
    expect(chatPolishCss).toMatch(/\[data-step-process-body\]\s*\{[^}]*overflow-x:\s*clip/)
  })

  it('recolors Shiki through its css-variables theme on both light and dark themes', () => {
    const light = [/--shiki-token-comment: #7f8aa3/, /--shiki-token-keyword: #c2255c/, /--shiki-token-function: #7048e8/]
    const dark = [/--shiki-token-comment: #8b94ab/, /--shiki-token-keyword: #f06595/]
    for (const pattern of light) expect(chatPolishCss).toMatch(pattern)
    const darkRules = [...chatPolishCss.matchAll(/body\[data-ds-dark-theme\][^{]*\{[^}]*\}/g)].map(m => m[0])
    expect(darkRules.join('')).toMatch(dark[0])
    expect(darkRules.join('')).toMatch(dark[1])
    // Comments lean only via the inline style hook Shiki emits — never a host hash.
    expect(chatPolishCss).toContain('[style*="shiki-token-comment"]')
  })

  it('stretches media and tables to the transcript column', () => {
    expect(chatPolishCss).toMatch(/:is\(p, figure\) > :is\(img:only-child, a:only-child > img\)\s*\{[^}]*width: 100%/)
    expect(chatPolishCss).toMatch(/\[data-chat-group-part="response"\] table\s*\{[^}]*width: 100%/)
  })

  it('marks a settled process group as a status line, fenced off its body', () => {
    expect(chatPolishCss).toMatch(
      /\[data-step-process\]:not\(\[data-group-expanded-mode\]\) button\[data-process-activity\]\s*\{[^}]*color: var\(--dsw-alias-label-secondary\)/,
    )
    expect(chatPolishCss).toMatch(/\[data-step-process-icon\]\s*\{[^}]*--dsw-alias-state-done-primary/)
    expect(chatPolishCss).toMatch(
      /\[data-step-process-body\]:not\(\[hidden\]\)\s*\{[^}]*border-top: 0\.5px solid/,
    )
  })

  it('keeps the gap above a section rule symmetric with block spacing', () => {
    // Any block before a rule sits 13px from it — the same 13px a paragraph
    // keeps from the heading above it, so both sides of the block match.
    expect(chatPolishCss).toMatch(/\* \+ hr\s*\{[^}]*margin-top: 13px/)
  })

  it('keeps one vertical rhythm across every reply block kind', () => {
    // Paragraphs, quotes, tables, fences and rules all breathe by the same 13px;
    // mixed values (4 / 14 / 16 / 18 / 24) made a five-block answer look uneven.
    for (const kind of ['\\.md-code-block', 'table', 'blockquote', 'hr']) {
      const rule = new RegExp(`\\[data-chat-group-part="response"\\] ${kind}\\s*\\{[^}]*\\}`).exec(chatPolishCss)?.[0] ?? ''
      expect(rule, kind).toContain('13px')
    }
  })

  it('draws a frameless table: rules above, below and under the header only', () => {
    const table = /\[data-chat-group-part="response"\] table\s*\{[^}]*\}/.exec(chatPolishCss)?.[0] ?? ''
    expect(table).toContain('border-top: 1px solid')
    expect(table).toContain('border-bottom: 1px solid')
    const head = /\[data-chat-group-part="response"\] thead th\s*\{[^}]*\}/.exec(chatPolishCss)?.[0] ?? ''
    expect(head).toContain('background: none')
    expect(head).toContain('border-bottom: 1px solid')
    // No header wash survives in either theme.
    expect(chatPolishCss).not.toMatch(/thead th\s*\{[^}]*background: color-mix/)
  })

  it('keeps table type on the body size, not the host secondary step', () => {
    // The host sizes cells from `--dsh-content-font-size-secondary` (14 → 13),
    // which reads a full step tighter than the prose. Cell type must stay on
    // the body size and body leading, or tables change voice mid-reply.
    const cell = /\[data-chat-group-part="response"\] :is\(th, td\)\s*\{[^}]*\}/.exec(chatPolishCss)?.[0] ?? ''
    expect(cell).toContain('font-size: calc(14px + var(--dsh-content-font-delta, 0px))')
    expect(cell).toContain('line-height: 1.72')
  })

  it('keeps the takeaway card out of the execution trace', () => {
    // Two gates, both required: the blue card is gated on a non-trace row, and
    // the trace version of the same shape drops to neutral ink so the two never
    // read as sibling headlines.
    expect(chatPolishCss).toMatch(/:not\(\[data-turn-process-member\]\)[^{]*> blockquote:first-child/)
    const trace = [...chatPolishCss.matchAll(/:is\(\[data-turn-process-member\], \[data-turn-process-inline\], \[data-step-process\]\)[^{]*\{[^}]*\}/g)].map(m => m[0])
    expect(trace.length).toBeGreaterThanOrEqual(2)
    for (const rule of trace) {
      // Neutral wash instead of the blue one — and never the business accent.
      expect(rule).not.toContain('--dsw-alias-state-business-primary')
      expect(rule).toMatch(/background: color-mix/)
    }
  })

  it('keeps inline code and links from shouting inside a dense paragraph', () => {
    const inlineCode = /\[data-chat-group-part="response"\] :not\(pre\) > code\s*\{[^}]*\}/.exec(chatPolishCss)?.[0] ?? ''
    expect(inlineCode).toContain('font-size: 0.93em')
    expect(inlineCode).not.toContain('6%')
    expect(chatPolishCss).toMatch(/\] a\s*\{[^}]*text-decoration-color: color-mix/)
  })
})

describe('MermaidFence.module.css', () => {
  it('uses real DSH theme tokens rather than undefined legacy surface aliases', () => {
    const brokenAliases = [
      '--dsw-alias-surface-base',
      '--dsw-alias-surface-raised',
      '--dsw-alias-interactive-bg-secondary',
      '--dsw-alias-state-business-bg',
      '--dsw-alias-state-warning-bg',
      '--ds-font-family-sans',
    ]
    for (const alias of brokenAliases) {
      expect(mermaidCss).not.toContain(alias)
    }
    expect(mermaidCss).toContain('--dsw-alias-markdown-code-block')
    expect(mermaidCss).toContain('--dsw-alias-bg-base')
    expect(mermaidCss).toContain('--dsw-font-family')
    expect(mermaidCss).toContain('body[data-ds-dark-theme]')
  })
})
