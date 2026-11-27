import { describe, expect, it } from 'vitest'
import { LIANGHENG_PRESET_ID, presetLanded } from './lever.ts'

const OTHER = 'standard'

describe('presetLanded', () => {
  it('fires when the preset changes into liangheng inside one session', () => {
    expect(presetLanded(OTHER, LIANGHENG_PRESET_ID, true)).toBe(true)
  })

  it('stays quiet when liangheng was already the preset', () => {
    expect(presetLanded(LIANGHENG_PRESET_ID, LIANGHENG_PRESET_ID, true)).toBe(false)
  })

  it('stays quiet on the first reading of a page', () => {
    expect(presetLanded(undefined, LIANGHENG_PRESET_ID, false)).toBe(false)
  })

  it('stays quiet when the main view moves to another session that already runs it', () => {
    expect(presetLanded(OTHER, LIANGHENG_PRESET_ID, false)).toBe(false)
  })

  it('stays quiet when the preset moves away or is missing', () => {
    expect(presetLanded(LIANGHENG_PRESET_ID, OTHER, true)).toBe(false)
    expect(presetLanded(OTHER, undefined, true)).toBe(false)
  })
})
