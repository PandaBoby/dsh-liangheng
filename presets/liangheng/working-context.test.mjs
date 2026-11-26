import { describe, expect, it } from 'vitest'
import { renderWorkingContext } from './working-context.mjs'

describe('renderWorkingContext', () => {
  it('returns undefined when no objective field is present', () => {
    expect(renderWorkingContext([])).toBeUndefined()
  })

  it('projects plan mode, sorted active namespaces, in-progress todos, and key facts', () => {
    const events = [
      { type: 'plan/mode', data: { active: true } },
      { type: 'tool/call', data: { callId: 'a1', name: 'tool_activate', arguments: { namespace: 'codegraph' } } },
      { type: 'tool/call', data: { callId: 'a2', name: 'tool_activate', arguments: { namespace: 'browser' } } },
      { type: 'todo/write', data: { todos: [{ content: 'Fix bug', status: 'in_progress' }, { content: 'Done', status: 'completed' }] } },
      { type: 'tool/call', data: { callId: 'f1', name: 'fact_register', arguments: { fact: 'Keep native default', tag: 'arch' } } },
    ]
    expect(renderWorkingContext(events)).toBe(
      '[Working Context: plan mode: on | active namespaces: browser, codegraph | in progress: Fix bug | key facts: Keep native default [arch]]',
    )
  })

  it('clears in-progress todos on turn/start and ignores failed native fact_register calls', () => {
    const events = [
      { type: 'todo/write', data: { todos: [{ content: 'Old step', status: 'in_progress' }] } },
      { type: 'turn/start', data: { turn: 2 } },
      { type: 'tool/call', data: { callId: 'f-err', name: 'fact_register', arguments: { fact: 'ghost fact' } } },
      { type: 'tool/result', data: { callId: 'f-err', message: { isError: true, source: { callId: 'f-err' } } } },
    ]
    expect(renderWorkingContext(events)).toBeUndefined()
  })
})
