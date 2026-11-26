import { describe, expect, it } from 'vitest'
import { apply as applyActivate } from './tool-activate.mjs'
import { publishWirePresentation } from './wire-presentation.mjs'

function setupActivate(schemas, sessionEvents = []) {
  let tool
  const ctx = {
    tools: {
      register: (def) => { tool = def; return () => {} },
      schemas: () => schemas,
    },
    get: () => undefined,
  }
  applyActivate(ctx, {})
  return { tool, session: { events: sessionEvents } }
}

describe('tool_activate', () => {
  it('activates a valid paged namespace and tailors reachability wording by presentation', async () => {
    const schemas = [
      { name: 'mcp__codegraph__search' },
      { name: 'mcp__codegraph__refs' },
      { name: 'browser_open' },
    ]
    const { tool, session } = setupActivate(schemas)
    const nativeAgent = { session }
    publishWirePresentation(nativeAgent, 'native')
    const nativeRes = await tool.execute({ namespace: 'codegraph' }, { agent: nativeAgent, callId: 'call-1' })
    expect(nativeRes.text).toContain('Activated namespace "codegraph" (2 tools)')
    expect(nativeRes.text).toContain('call them directly by name')

    publishWirePresentation(nativeAgent, 'ptc')
    const ptcRes = await tool.execute({ namespace: 'browser' }, { agent: nativeAgent, callId: 'call-2' })
    expect(ptcRes.text).toContain('tools.<name>({ ... })')
  })

  it('rejects unknown or already-active namespaces and ignores its own in-flight event', async () => {
    const schemas = [{ name: 'mcp__codegraph__search' }]
    const events = [
      // Self event already appended before execute()
      { type: 'tool/call', data: { callId: 'self-1', name: 'tool_activate', arguments: { namespace: 'codegraph' } } },
    ]
    const { tool, session } = setupActivate(schemas, events)
    const agent = { session }

    // Because self-1 matches exec.callId, it is excluded and activation succeeds!
    const ok = await tool.execute({ namespace: 'codegraph' }, { agent, callId: 'self-1' })
    expect(ok.text).toContain('Activated namespace "codegraph"')

    // A second call with a different callId sees self-1 as active and rejects.
    await expect(tool.execute({ namespace: 'codegraph' }, { agent, callId: 'call-2' })).rejects.toThrow(/already active/)
    await expect(tool.execute({ namespace: 'nope' }, { agent, callId: 'call-3' })).rejects.toThrow(/unknown paged namespace/)
  })
})
