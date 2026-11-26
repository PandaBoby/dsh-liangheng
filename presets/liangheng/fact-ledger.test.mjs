import { describe, expect, it } from 'vitest'
import { MAX_FACTS, MAX_FACT_CHARS, foldFactLedger, renderLedgerField } from './fact-ledger.mjs'

describe('foldFactLedger', () => {
  it('pins, deduplicates, truncates at MAX_FACT_CHARS, and caps at MAX_FACTS', () => {
    const events = []
    for (let i = 1; i <= MAX_FACTS + 2; i += 1) {
      events.push({
        type: 'tool/call',
        data: { callId: `c-${i}`, name: 'fact_register', arguments: JSON.stringify({ fact: `fact-${i}`, tag: `t-${i}` }) },
      })
    }
    // Duplicate of fact-14 should no-op
    events.push({
      type: 'tool/ptc-dispatch',
      data: { name: 'fact_register', arguments: { fact: 'fact-14', tag: 't-14' } },
    })
    const facts = foldFactLedger(events)
    expect(facts.length).toBe(MAX_FACTS)
    expect(facts[0].text).toBe('fact-3')
    expect(facts.at(-1).text).toBe('fact-14')

    const longFact = 'x'.repeat(MAX_FACT_CHARS + 20)
    const truncated = foldFactLedger([
      { type: 'tool/call', data: { callId: 'long', name: 'fact_register', arguments: { fact: longFact } } },
    ])
    expect(truncated[0].text.length).toBe(MAX_FACT_CHARS)
  })

  it('revokes facts by tag or exact text', () => {
    const events = [
      { type: 'tool/call', data: { callId: '1', name: 'fact_register', arguments: { fact: 'use vitest', tag: 'test' } } },
      { type: 'tool/call', data: { callId: '2', name: 'fact_register', arguments: { fact: 'untagged rule' } } },
      { type: 'tool/call', data: { callId: '3', name: 'fact_register', arguments: { revoke: 'test' } } },
    ]
    const remaining = foldFactLedger(events)
    expect(remaining).toEqual([{ text: 'untagged rule', tag: undefined }])
    expect(renderLedgerField(remaining)).toBe('key facts: untagged rule')
  })

  it('ignores both errored ptc-dispatch and errored native tool/call calls', () => {
    const events = [
      { type: 'tool/ptc-dispatch', data: { name: 'fact_register', isError: true, arguments: { fact: 'bad ptc' } } },
      { type: 'tool/call', data: { callId: 'bad-native', name: 'fact_register', arguments: JSON.stringify({ fact: 'bad native' }) } },
      { type: 'tool/result', data: { callId: 'bad-native', message: { isError: true, source: { callId: 'bad-native' } } } },
      { type: 'tool/call', data: { callId: 'good-native', name: 'fact_register', arguments: JSON.stringify({ fact: 'good native', tag: 'ok' }) } },
      { type: 'tool/result', data: { callId: 'good-native', message: { isError: false, source: { callId: 'good-native' } } } },
    ]
    expect(foldFactLedger(events)).toEqual([{ text: 'good native', tag: 'ok' }])
  })
})
