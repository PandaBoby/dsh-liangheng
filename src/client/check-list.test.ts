import { describe, expect, it } from 'vitest'
import { parseCheckLines } from './check-list.ts'

describe('parseCheckLines', () => {
  it('parses the three marks, short keys, and both separator spellings', () => {
    const list = parseCheckLines([
      '✓ tests: 142 passed · 14 files',
      '✗ lint：3 errors',
      '· note: 手工验收后上线',
    ].join('\n'))
    expect(list.items).toEqual([
      { status: 'pass', key: 'tests', value: '142 passed · 14 files' },
      { status: 'fail', key: 'lint', value: '3 errors' },
      { status: 'info', key: 'note', value: '手工验收后上线' },
    ])
    expect(list.failed).toBe(true)
  })

  it('keeps a value-only line, accepts a CJK key, and refuses a prose prefix', () => {
    const list = parseCheckLines([
      'callback verified against staging',
      '产物: grep 4/4 命中',
      'this sentence is much too long to be a key: value',
    ].join('\n'))
    expect(list.items[0]).toEqual({ status: 'info', key: '', value: 'callback verified against staging' })
    expect(list.items[1]).toEqual({ status: 'info', key: '产物', value: 'grep 4/4 命中' })
    // The 24-character key cap keeps a prose sentence in the value column.
    expect(list.items[2]?.key).toBe('')
    expect(list.items[2]?.value).toContain('this sentence is much too long')
  })

  it('drops blank lines and bare marks, and only reads x / - as a verdict before a space', () => {
    const list = parseCheckLines([
      '',
      '✓ ',
      '✓',
      'x covered by e2e',
      'x-axis: 120',
      '- manual check',
    ].join('\n'))
    expect(list.items).toEqual([
      { status: 'fail', key: '', value: 'covered by e2e' },
      { status: 'info', key: 'x-axis', value: '120' },
      { status: 'info', key: '', value: 'manual check' },
    ])
  })

  it('returns an empty list for an empty body so the host code block stays in charge', () => {
    expect(parseCheckLines('').items).toEqual([])
    expect(parseCheckLines('\n  \n').items).toEqual([])
    expect(parseCheckLines('').failed).toBe(false)
  })
})
