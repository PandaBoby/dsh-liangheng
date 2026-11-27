import { describe, expect, it } from 'vitest'
import {
  CURATED_TOOL_SUMMARIES,
  DEFAULT_PRESENTATION,
  apply as applyCatalog,
  catalogEntries,
  renderCatalogText,
} from './tool-catalog.mjs'

describe('tool-catalog defaults and curated summaries', () => {
  it('defaults presentation to native and curates DSH 0.2.2 coding tools', () => {
    expect(DEFAULT_PRESENTATION).toBe('native')
    for (const toolName of ['apply_patch', 'working_directory', 'web_fetch', 'web_search', 'subagent', 'present']) {
      expect(CURATED_TOOL_SUMMARIES.has(toolName), toolName).toBe(true)
    }
    const entries = catalogEntries([
      { name: 'apply_patch', description: 'raw', parameters: { type: 'object', properties: { input: { type: 'string' } }, required: ['input'] } },
      { name: 'mcp__codegraph__find', description: 'Find symbol', parameters: { type: 'object', properties: {} } },
    ], 200, { patterns: ['mcp__*'] })
    const text = renderCatalogText(entries, 'native', [])
    expect(text).toContain('`apply_patch({ input: string })`')
    expect(text).toContain('namespace `codegraph` (activated)')
  })
})

describe('tool-catalog paging sync timing', () => {
  it('does NOT lift restriction in tools/post-execute when tool_activate errored', async () => {
    const handlers = new Map()
    const restrictions = []
    const session = {
      events: [],
    }
    const schemas = [
      { name: 'read', description: 'read', parameters: {} },
      { name: 'mcp__codegraph__find', description: 'find', parameters: {} },
    ]
    const denied = new Set()
    const agent = {
      session,
      ctx: {
        tools: {
          schemas: () => schemas.filter(s => !denied.has(s.name)),
          restrict: ({ deny }) => {
            restrictions.push([...deny])
            for (const n of deny) denied.add(n)
            return () => { for (const n of deny) denied.delete(n) }
          },
        },
      },
    }
    const ctx = {
      logger: { warn: () => {} },
      get: () => undefined,
      on: (event, fn) => {
        handlers.set(event, fn)
        return () => {}
      },
    }
    applyCatalog(ctx, {})
    handlers.get('agent/created')({ agent })
    expect(restrictions.length).toBe(1)
    expect(denied.has('mcp__codegraph__find')).toBe(true)

    // Runtime appends tool/call before execute; execute errors so tools/post-execute sees result.isError=true before tool/result is pushed
    session.events.push({ type: 'tool/call', data: { callId: 'c-err', name: 'tool_activate', arguments: { namespace: 'codegraph' } } })
    await handlers.get('tools/post-execute')(
      { agent, name: 'tool_activate' },
      { isError: true },
      async () => ({ kind: 'accept' }),
    )
    // Restriction was NOT recomputed for the failed tool_activate call!
    expect(restrictions.length).toBe(1)
    expect(denied.has('mcp__codegraph__find')).toBe(true)
  })

  it('re-syncs paging on compaction/end when idleReclaimSteps > 0', () => {
    const handlers = new Map()
    const session = {
      events: [
        { type: 'step/start' },
        { type: 'tool/call', data: { callId: 'a1', name: 'tool_activate', arguments: { namespace: 'codegraph' } } },
        { type: 'step/start' },
        { type: 'step/start' },
      ],
    }
    const schemas = [
      { name: 'read', description: 'read', parameters: {} },
      { name: 'mcp__codegraph__find', description: 'find', parameters: {} },
    ]
    const denied = new Set()
    const agent = {
      session,
      ctx: {
        tools: {
          schemas: () => schemas.filter(s => !denied.has(s.name)),
          restrict: ({ deny }) => {
            for (const n of deny) denied.add(n)
            return () => { for (const n of deny) denied.delete(n) }
          },
        },
      },
    }
    const ctx = {
      logger: { warn: () => {} },
      get: () => undefined,
      on: (event, fn) => {
        handlers.set(event, fn)
        return () => {}
      },
    }
    applyCatalog(ctx, { idleReclaimSteps: 2 })
    handlers.get('agent/created')({ agent })
    // Still active until compaction/end or next activation
    expect(denied.has('mcp__codegraph__find')).toBe(false)

    // Session.append records the event into session.events before emitting session/event
    const compactionEnd = { type: 'compaction/end' }
    session.events.push(compactionEnd)
    handlers.get('session/event')(session, compactionEnd)
    expect(denied.has('mcp__codegraph__find')).toBe(true)
  })
})
