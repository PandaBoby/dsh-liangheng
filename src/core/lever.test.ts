import { describe, expect, it } from 'vitest'
import { LIANGHENG_PRESET_ID, isActionable, leverState, restoreTarget } from './lever.ts'

describe('leverState', () => {
  it('returns missing when liangheng is absent from available presets', () => {
    expect(leverState({ blank: true, agentPreset: 'standard', available: ['standard', 'ptc'] })).toBe('missing')
  })

  it('returns locked once the session has started', () => {
    expect(leverState({ blank: false, agentPreset: LIANGHENG_PRESET_ID, available: ['standard', LIANGHENG_PRESET_ID] })).toBe('locked')
  })

  it('returns on or off for blank sessions', () => {
    expect(leverState({ blank: true, agentPreset: LIANGHENG_PRESET_ID, available: ['standard', LIANGHENG_PRESET_ID] })).toBe('on')
    expect(leverState({ blank: true, agentPreset: 'standard', available: ['standard', LIANGHENG_PRESET_ID] })).toBe('off')
  })
})

describe('restoreTarget', () => {
  it('prefers remembered previous preset over deployment fallback', () => {
    expect(restoreTarget({
      blank: true,
      available: ['standard', 'ptc', LIANGHENG_PRESET_ID],
      previous: 'ptc',
      fallback: 'standard',
    })).toBe('ptc')
  })

  it('skips liangheng itself and falls back to first usable non-liangheng row', () => {
    expect(restoreTarget({
      blank: true,
      available: [LIANGHENG_PRESET_ID, 'minimal', 'standard'],
      previous: LIANGHENG_PRESET_ID,
      fallback: LIANGHENG_PRESET_ID,
    })).toBe('minimal')
  })

  it('returns undefined when no non-liangheng preset exists', () => {
    expect(restoreTarget({
      blank: true,
      available: [LIANGHENG_PRESET_ID],
      fallback: LIANGHENG_PRESET_ID,
    })).toBeUndefined()
  })
})

describe('isActionable', () => {
  it('is true only for on and off states', () => {
    expect(isActionable('on')).toBe(true)
    expect(isActionable('off')).toBe(true)
    expect(isActionable('locked')).toBe(false)
    expect(isActionable('missing')).toBe(false)
  })
})
