import { describe, expect, it } from 'vitest'

import {
  DEFAULT_MAX_ACTIVE_NAMESPACES,
  DEFAULT_PAGED_TOOL_PATTERNS,
  integerAtLeast,
  namespaceOf,
  partitionWireTools,
  patternNamespace,
  replayActivations,
  validatePagedToolPatterns,
  withheldToolNames,
} from './paging.mjs'

const PLUGIN = 'liangshen'

describe('page families', () => {
  it('ships the seven families the preset documents', () => {
    expect(DEFAULT_PAGED_TOOL_PATTERNS).toEqual([
      'mcp__*', 'browser_*', 'task_board_*', 'team_*', 'squad*', 'ui_*', 'ssh_*',
    ])
    expect(DEFAULT_MAX_ACTIVE_NAMESPACES).toBe(3)
  })
})

describe('validatePagedToolPatterns', () => {
  it('falls back when the row declares nothing', () => {
    expect(validatePagedToolPatterns(PLUGIN, undefined)).toEqual(DEFAULT_PAGED_TOOL_PATTERNS)
  })

  it('keeps a well-formed list as given', () => {
    const patterns = ['mcp__*', 'ssh_*']
    expect(validatePagedToolPatterns(PLUGIN, patterns)).toEqual(patterns)
  })

  it('refuses a non-array value', () => {
    expect(() => validatePagedToolPatterns(PLUGIN, 'mcp__*')).toThrow(TypeError)
  })

  it('refuses an entry that is blank or not a string', () => {
    expect(() => validatePagedToolPatterns(PLUGIN, ['  '])).toThrow(TypeError)
    expect(() => validatePagedToolPatterns(PLUGIN, [42])).toThrow(TypeError)
  })

  it('refuses a bare wildcard, which would name no family', () => {
    expect(() => validatePagedToolPatterns(PLUGIN, ['*'])).toThrow(TypeError)
  })

  it('refuses a head without a trailing star and a second star', () => {
    expect(() => validatePagedToolPatterns(PLUGIN, ['mcp__'])).toThrow(TypeError)
    expect(() => validatePagedToolPatterns(PLUGIN, ['a*b*'])).toThrow(TypeError)
  })
})

describe('patternNamespace', () => {
  it('reads the MCP bridge segment from the tool name', () => {
    expect(patternNamespace('mcp__codegraph__codegraph_explore', 'mcp__*')).toBe('codegraph')
    expect(patternNamespace('mcp__rea__click', 'mcp__*')).toBe('rea')
  })

  it('names a literal family with one trailing underscore dropped', () => {
    expect(patternNamespace('task_board_list', 'task_board_*')).toBe('task_board')
    expect(patternNamespace('ssh_exec', 'ssh_*')).toBe('ssh')
  })

  it('keeps a star-terminated head that has no trailing underscore', () => {
    expect(patternNamespace('squads_list', 'squad*')).toBe('squad')
    expect(patternNamespace('squad_member_add', 'squad*')).toBe('squad')
  })

  it('answers undefined when the pattern does not match', () => {
    expect(patternNamespace('bash', 'mcp__*')).toBeUndefined()
  })

  it('answers undefined for a name that is nothing but the head', () => {
    expect(patternNamespace('mcp__', 'mcp__*')).toBeUndefined()
    expect(patternNamespace('ssh_', 'ssh_*')).toBeUndefined()
  })
}
)

describe('namespaceOf', () => {
  it('uses the first pattern that matches', () => {
    expect(namespaceOf('mcp__rea__click', ['mcp__*', 'ssh_*'])).toBe('rea')
  })

  it('answers undefined without a pattern list', () => {
    expect(namespaceOf('mcp__rea__click', undefined)).toBeUndefined()
  })
})

describe('partitionWireTools', () => {
  const tools = [
    { name: 'bash' },
    { name: 'mcp__rea__click' },
    { name: 'mcp__open_design__start_run' },
  ]

  it('keeps unpatterned tools resident and groups paged ones by namespace', () => {
    const { resident, inactive } = partitionWireTools(tools, DEFAULT_PAGED_TOOL_PATTERNS, [])
    expect(resident.map(tool => tool.name)).toEqual(['bash'])
    expect([...inactive.keys()]).toEqual(['open_design', 'rea'])
  })

  it('treats an active namespace as resident', () => {
    const { resident, inactive } = partitionWireTools(tools, DEFAULT_PAGED_TOOL_PATTERNS, ['rea'])
    expect(resident.map(tool => tool.name)).toEqual(['bash', 'mcp__rea__click'])
    expect([...inactive.keys()]).toEqual(['open_design'])
  })

  it('sorts the inactive namespaces so one surface renders the same text twice', () => {
    const generated = partitionWireTools(tools, DEFAULT_PAGED_TOOL_PATTERNS, []).inactive
    expect([...generated.keys()]).toEqual(['open_design', 'rea'])
  })
})

describe('withheldToolNames', () => {
  const tools = [{ name: 'run_code' }, { name: 'bash' }, { name: 'mcp__rea__click' }]

  it('names exactly the tools a registry restriction must withhold', () => {
    expect(withheldToolNames(tools, DEFAULT_PAGED_TOOL_PATTERNS, [])).toEqual(['mcp__rea__click'])
  })

  it('never withholds a reserved name', () => {
    const withReserved = [{ name: 'run_code' }]
    expect(withheldToolNames(withReserved, ['run_code*'], [])).toEqual([])
  })
})

describe('integerAtLeast', () => {
  it('keeps a valid integer and falls back when absent', () => {
    expect(integerAtLeast(PLUGIN, 5, 'capacity', 1, 3)).toBe(5)
    expect(integerAtLeast(PLUGIN, undefined, 'capacity', 1, 3)).toBe(3)
  })

  it('accepts the minimum itself', () => {
    expect(integerAtLeast(PLUGIN, 0, 'idleReclaimSteps', 0, 9)).toBe(0)
  })

  it('refuses a value below the minimum or not an integer', () => {
    expect(() => integerAtLeast(PLUGIN, 0, 'capacity', 1, 3)).toThrow(TypeError)
    expect(() => integerAtLeast(PLUGIN, 1.5, 'capacity', 1, 3)).toThrow(TypeError)
  })
})

describe('replayActivations', () => {
  const activation = (callId, namespace) => ({
    type: 'tool/call',
    data: { callId, name: 'tool_activate', arguments: JSON.stringify({ namespace }) },
  })
  const failed = callId => ({ type: 'tool/result', data: { callId, message: { isError: true } } })
  const call = (callId, name) => ({ type: 'tool/call', data: { callId, name, arguments: '{}' } })
  const dispatch = (name, args) => ({
    type: 'tool/ptc-dispatch',
    data: { name, arguments: JSON.stringify(args ?? {}), isError: false },
  })

  it('replays nothing from an empty log', () => {
    expect(replayActivations([]).active).toEqual([])
  })

  it('activates the namespace one call names', () => {
    expect(replayActivations([activation('c1', 'rea')]).active).toEqual(['rea'])
  })

  it('evicts the least recently used namespace past the capacity', () => {
    const events = [activation('c1', 'rea'), activation('c2', 'browser'), activation('c3', 'ssh'), activation('c4', 'team')]
    const { active, evicted } = replayActivations(events, 3)
    expect(active).toEqual(['browser', 'ssh', 'team'])
    expect(evicted).toEqual(['rea'])
  })

  it('does not activate a namespace whose call is recorded as failed', () => {
    const { active } = replayActivations([activation('c1', 'rea'), failed('c1')])
    expect(active).toEqual([])
  })

  it('activates from the ptc dispatch shape as well', () => {
    expect(replayActivations([dispatch('tool_activate', { namespace: 'rea' })]).active).toEqual(['rea'])
  })

  it('refreshes recency when an active family is used, not only when activated', () => {
    const events = [
      activation('c1', 'rea'),
      activation('c2', 'browser'),
      activation('c3', 'ssh'),
      call('c4', 'mcp__rea__click'),
      activation('c5', 'team'),
    ]
    const { active, evicted } = replayActivations(events, 3)
    expect(active).toEqual(['ssh', 'rea', 'team'])
    expect(evicted).toEqual(['browser'])
  })

  it('reclaims an idle namespace only at an application point', () => {
    const events = [
      activation('c1', 'rea'),
      { type: 'step/start' },
      { type: 'step/start' },
    ]
    expect(replayActivations(events, 3, DEFAULT_PAGED_TOOL_PATTERNS, undefined, 2).active).toEqual(['rea'])
    const reclaimed = replayActivations([...events, { type: 'compaction/end' }], 3, DEFAULT_PAGED_TOOL_PATTERNS, undefined, 2)
    expect(reclaimed.active).toEqual([])
  })

  it('keeps a namespace that was used inside the idle window', () => {
    const events = [
      activation('c1', 'rea'),
      { type: 'step/start' },
      call('c2', 'mcp__rea__click'),
      { type: 'step/start' },
      { type: 'compaction/end' },
    ]
    expect(replayActivations(events, 3, DEFAULT_PAGED_TOOL_PATTERNS, undefined, 2).active).toEqual(['rea'])
  })
})
