import { describe, expect, it } from 'vitest'
import {
  POLICY_EVENT,
  delegationDenialReason,
  inheritedRouteOf,
  installSubagentRoutes,
  routeParameterProbe,
} from './subagent-routes.mjs'

describe('routeParameterProbe', () => {
  it('detects provider/model inside compiled JSON Schema properties (DSH defineTool format)', () => {
    const tools = {
      definitions: () => [
        {
          name: 'subagent',
          parameters: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              prompt: { type: 'string' },
              provider: { type: 'string' },
              model: { type: 'string' },
            },
          },
        },
        {
          name: 'subagent_fork',
          parameters: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              prompt: { type: 'string' },
            },
          },
        },
      ],
    }
    expect(routeParameterProbe(tools, {}, 'subagent')).toBe(true)
    expect(routeParameterProbe(tools, {}, 'subagent_fork')).toBe(false)
  })

  it('keeps supporting flat test-stub parameter maps', () => {
    const tools = {
      definitions: () => [{ name: 'subagent', parameters: { provider: { type: 'string' }, model: { type: 'string' } } }],
    }
    expect(routeParameterProbe(tools, {}, 'subagent')).toBe(true)
  })
})

describe('inheritedRouteOf', () => {
  it('prefers live agent.model.current() over stale requestHeader and options', () => {
    const agent = {
      model: { current: () => ({ provider: 'deepseek-official', model: 'deepseek-reasoner', reasoningEffort: 'high' }) },
      session: { requestHeader: () => ({ config: { provider: 'deepseek-official', model: 'deepseek-flash' } }) },
      options: { provider: 'legacy', model: 'old' },
    }
    expect(inheritedRouteOf(agent)).toEqual({
      provider: 'deepseek-official',
      model: 'deepseek-reasoner',
      reasoningEffort: 'high',
    })
  })
})

describe('delegationDenialReason with JSON Schema probe and live agents fallback', () => {
  const policyEvent = {
    type: POLICY_EVENT,
    data: { allowedModels: [{ provider: 'deepseek-official', model: 'deepseek-chat' }] },
  }

  it('denies bare subagent call under Listed state even when parent route IS on the allowlist', () => {
    const agent = {
      session: { events: [policyEvent] },
      model: { current: () => ({ provider: 'deepseek-official', model: 'deepseek-chat' }) },
    }
    const tools = {
      definitions: () => [{
        name: 'subagent',
        parameters: { type: 'object', properties: { provider: { type: 'string' }, model: { type: 'string' } } },
      }],
    }
    const reason = delegationDenialReason({
      agent,
      toolName: 'subagent',
      args: { description: 'check', prompt: 'do work' },
      probe: (a, n) => routeParameterProbe(tools, a, n),
    })
    expect(reason).toContain('names no provider or model')
  })

  it('allows subagent_fork when inherited route is authorized and denies when not', () => {
    const allowedAgent = {
      session: { events: [policyEvent] },
      model: { current: () => ({ provider: 'deepseek-official', model: 'deepseek-chat' }) },
    }
    expect(delegationDenialReason({ agent: allowedAgent, toolName: 'subagent_fork', args: {} })).toBeUndefined()

    const disallowedAgent = {
      session: { events: [policyEvent] },
      model: { current: () => ({ provider: 'deepseek-official', model: 'deepseek-reasoner' }) },
    }
    expect(delegationDenialReason({ agent: disallowedAgent, toolName: 'subagent_fork', args: {} })).toContain('does not authorize')
  })

  it('resolves parent session policy via agents registry when ctx.sessions is absent', () => {
    const parentSession = { header: { id: 'root-1' }, events: [policyEvent] }
    const childAgent = {
      session: { header: { id: 'child-1', origin: 'subagent', parentSession: 'root-1' }, events: [] },
      options: { provider: 'deepseek-official', model: 'deepseek-chat' },
    }
    let guardFn
    const ctx = {
      tools: {
        definitions: () => [{ name: 'subagent', parameters: { type: 'object', properties: { provider: {}, model: {} } } }],
        guard: (fn) => { guardFn = fn; return () => {} },
      },
      get: (name) => (name === 'agents' ? { get: id => (id === 'root-1' ? { session: parentSession } : undefined) } : undefined),
    }
    installSubagentRoutes(ctx)
    const denial = guardFn({
      agent: childAgent,
      name: 'subagent',
      arguments: { provider: 'deepseek-official', model: 'deepseek-reasoner' },
    })
    expect(denial).toContain('not on the Session allowlist')
  })
})
