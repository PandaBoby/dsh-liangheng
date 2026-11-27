/**
 * Parser for the `check` fence: a compact verification ledger.
 *
 * The wire format is one check per line, `✓ key: value`, where the leading mark
 * may be `✓`/`✗`/`·` and the separator may be ASCII `:` or full-width `：`.
 * A line without a separator is a value-only row (an empty key keeps the value
 * column aligned), and blank lines are ignored so the fence can be spaced out
 * for readability in the source.
 *
 * The fallback matters: a client without this plugin renders the fence as a
 * plain code block, so the line text must stay readable on its own — that is
 * why the mark and the key stay in the text instead of living in markup.
 */

/** One row's verdict. `info` is the neutral note row (no mark, or `·`). */
export type CheckStatus = 'pass' | 'fail' | 'info'

/** One parsed ledger row. */
export interface CheckItem {
  readonly status: CheckStatus
  readonly key: string
  readonly value: string
}

/** A parsed fence plus whether any row failed. */
export interface CheckList {
  readonly items: readonly CheckItem[]
  readonly failed: boolean
}

/** Leading marks per status. Trailing spaces are part of the mark so a line
 * starting with `x` or `-` is only a verdict when a space follows it. */
const MARKS: readonly (readonly [CheckStatus, readonly string[]])[] = [
  ['pass', ['✓', '✔', '✅']],
  ['fail', ['✗', '✘', '×', '❌', '[x] ', '[X] ', 'x ', 'X ']],
  ['info', ['· ', '- ', '* ', '• ']],
]

/** The longest key accepted before the separator; longer prefixes are prose. */
const MAX_KEY_LENGTH = 24

function takeMark(line: string): { status: CheckStatus; rest: string } {
  for (const [status, marks] of MARKS) {
    for (const mark of marks) {
      if (line.startsWith(mark)) return { status, rest: line.slice(mark.length).trim() }
    }
  }
  return { status: 'info', rest: line }
}

function splitKeyValue(text: string): { key: string; value: string } {
  const match = /^([^:：]{1,24})[:：]\s*([\s\S]*)$/.exec(text)
  if (match === null || match[1].trim().length > MAX_KEY_LENGTH) return { key: '', value: text }
  return { key: match[1].trim(), value: match[2].trim() }
}

/**
 * Parse one `check` fence body.
 * @param code - the fence's raw text.
 * @returns the parsed rows in source order, and whether any row is a failure.
 */
export function parseCheckLines(code: string): CheckList {
  const items: CheckItem[] = []
  for (const raw of code.split('\n')) {
    const line = raw.trim()
    if (line === '') continue
    const { status, rest } = takeMark(line)
    if (rest === '') continue
    items.push({ status, ...splitKeyValue(rest) })
  }
  return { items, failed: items.some(item => item.status === 'fail') }
}
