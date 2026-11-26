import { describe, expect, it } from 'vitest'
import {
  dispatchDenialReason,
  hasRunningChildSubagent,
  installDispatchGuard,
  isDelegatedCaller,
  isPureSleepCommand,
} from './dispatch-guard.mjs'

describe('isDelegatedCaller', () => {
  it('allows a resumed subagent session that is now its own live root', () => {
    const resumedRoot = { session: { header: { id: 'child-1', origin: 'subagent' } } }
    const ctx = {
      get: (name) => {
        if (name === 'subagents') return { rootOf: agent => agent }
        return undefined
      },
    }
    expect(isDelegatedCaller(resumedRoot, ctx)).toBe(false)
  })

  it('denies an active child whose rootOf points to a different agent', () => {
    const root = { id: 'lead' }
    const child = { id: 'worker', session: { header: { id: 'worker', origin: 'subagent' } } }
    const ctx = {
      get: (name) => {
        if (name === 'subagents') return { rootOf: () => root }
        return undefined
      },
    }
    expect(isDelegatedCaller(child, ctx)).toBe(true)
  })

  it('falls back to header.origin when live tree services are absent', () => {
    const child = { session: { header: { origin: 'subagent' } } }
    expect(isDelegatedCaller(child, undefined)).toBe(true)
    expect(isDelegatedCaller({ session: { header: {} } }, undefined)).toBe(false)
  })
})

describe('isPureSleepCommand', () => {
  it('flags pure sleep commands including || true wrappers', () => {
    expect(isPureSleepCommand('sleep 5')).toBe(true)
    expect(isPureSleepCommand('sleep 5 || true')).toBe(true)
    expect(isPureSleepCommand('Start-Sleep -Seconds 3; echo waiting')).toBe(true)
  })

  it('allows commands that perform real work alongside sleep', () => {
    expect(isPureSleepCommand('sleep 1 && npm test')).toBe(false)
    expect(isPureSleepCommand('node server.mjs & sleep 1 && curl localhost:3000')).toBe(false)
  })
})

describe('installDispatchGuard & subagent/start-end tracking', () => {
  it('blocks sleep while external/one-shot subagent run is active and unblocks after subagent/end', () => {
    const listeners = new Map()
    let guardFn
    const ctx = {
      tools: { guard: (fn) => { guardFn = fn; return () => {} } },
      on: (ev, fn) => {
        const list = listeners.get(ev) ?? []
        list.push(fn)
        listeners.set(ev, list)
        return () => {}
      },
      get: () => undefined,
    }
    const dispose = installDispatchGuard(ctx)
    const root = { id: 'lead-1', session: { header: { id: 'lead-1' } } }

    for (const fn of listeners.get('subagent/start') ?? []) {
      fn({ parentSessionId: 'lead-1', runId: 'run-1' })
    }
    expect(guardFn({ agent: root, name: 'bash', arguments: { command: 'sleep 10' } })).toContain('ACTIVE_CHILD_SLEEP_FORBIDDEN')

    // Backgrounded sleep is exempt
    expect(guardFn({ agent: root, name: 'bash', arguments: { command: 'sleep 10', run_in_background: true } })).toBeUndefined()

    for (const fn of listeners.get('subagent/end') ?? []) {
      fn({ parentSessionId: 'lead-1', runId: 'run-1' })
    }
    expect(guardFn({ agent: root, name: 'bash', arguments: { command: 'sleep 10' } })).toBeUndefined()
    dispose()
  })

  it('detects running child via agents.list fallback', () => {
    const parent = { id: 'lead-1', session: { header: { id: 'lead-1' } } }
    const ctx = {
      get: name => name === 'agents'
        ? { list: () => [{ parent: 'lead-1', status: 'running' }] }
        : undefined,
    }
    expect(hasRunningChildSubagent(parent, ctx)).toBe(true)
    expect(dispatchDenialReason({ agent: parent, toolName: 'bash', args: { command: 'sleep 5' }, ctx })).toContain('ACTIVE_CHILD_SLEEP_FORBIDDEN')
  })
})
