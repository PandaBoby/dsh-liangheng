import { describe, expect, it } from 'vitest'
import {
  PLAN_POLICY_SECTION_NAME,
  TEAM_POLICY_SECTION_NAME,
  apply as applyMinimalPrompt,
  filePathFromExecution,
  filePathsFromExecution,
  resolveSessionCwd,
  withWorkspaceLine,
} from './minimal-prompt.mjs'
import { publishWirePresentation } from './wire-presentation.mjs'

describe('filePathsFromExecution', () => {
  it('extracts file_path, path, and apply_patch paths', () => {
    expect(filePathsFromExecution({ name: 'read', arguments: { file_path: 'src/a.ts' } })).toEqual(['src/a.ts'])
    expect(filePathsFromExecution({ name: 'str_replace_editor', arguments: { path: '/repo/b.ts' } })).toEqual(['/repo/b.ts'])
    expect(filePathsFromExecution({
      name: 'apply_patch',
      arguments: {
        input: [
          '*** Begin Patch',
          '*** Add File: packages/foo/new.ts',
          '+export const x = 1',
          '*** Update File: packages/bar/old.ts',
          '*** Move to: packages/baz/moved.ts',
          '*** Delete File: packages/qux/dead.ts',
          '*** End Patch',
        ].join('\n'),
      },
    })).toEqual([
      'packages/foo/new.ts',
      'packages/bar/old.ts',
      'packages/baz/moved.ts',
      'packages/qux/dead.ts',
    ])
    expect(filePathFromExecution({ name: 'apply_patch', arguments: { input: '*** Begin Patch\n*** Update File: a.ts\n*** End Patch' } })).toBe('a.ts')
  })
})

describe('resolveSessionCwd & minimal-prompt assembly', () => {
  it('prefers live workingDirectory service over stale header.cwd', () => {
    const session = { header: { cwd: '/repo' } }
    const agent = { session }
    const ctx = { get: name => (name === 'workingDirectory' ? { get: () => '/repo/packages/api' } : undefined) }
    expect(resolveSessionCwd(agent, ctx)).toBe('/repo/packages/api')
    expect(resolveSessionCwd(agent, undefined)).toBe('/repo')
  })

  it('defaults dispatcher to false, keeps plan/team policy, and omits PTC SDK sections in native mode', async () => {
    const listeners = new Map()
    const ctx = {
      get: name => (name === 'workingDirectory' ? { get: () => '/repo/app' } : undefined),
      on: (event, fn) => { listeners.set(event, fn); return () => {} },
    }
    applyMinimalPrompt(ctx, {})
    const agent = { session: { header: { cwd: '/repo' } } }
    publishWirePresentation(agent, 'native')

    const assembled = await listeners.get('system-prompt/assemble')(
      {},
      { agent },
      async () => ({
        sections: [
          { name: 'deployment:persona-prefix', text: 'Persona base.' },
          { name: PLAN_POLICY_SECTION_NAME, text: 'Plan rules.' },
          { name: TEAM_POLICY_SECTION_NAME, text: 'Team rules.' },
          { name: 'tools:sdk', text: 'SDK' },
          { name: 'tools:ptc-only', text: 'PTC' },
          { name: 'tool-guidance', text: 'Extra noise' },
        ],
      }),
    )

    expect(assembled.sections.map(s => s.name)).toEqual([
      'deployment:persona-prefix',
      PLAN_POLICY_SECTION_NAME,
      TEAM_POLICY_SECTION_NAME,
    ])
    expect(assembled.sections[0].text).toBe('Persona base.\n\nYour working directory is /repo/app.')
    expect(assembled.sections[0].text).not.toContain('Dispatcher rules')
  })

  it('appends dispatcher rules when dispatcher: true and keeps PTC SDK sections in ptc mode', async () => {
    const listeners = new Map()
    const ctx = {
      get: () => undefined,
      on: (event, fn) => { listeners.set(event, fn); return () => {} },
    }
    applyMinimalPrompt(ctx, { dispatcher: true })
    const agent = { session: { header: { cwd: '/repo' } } }
    publishWirePresentation(agent, 'ptc')

    const assembled = await listeners.get('system-prompt/assemble')(
      {},
      { agent },
      async () => ({
        sections: [
          { name: 'deployment:persona-prefix', text: 'Persona base.' },
          { name: 'tools:sdk', text: 'SDK' },
          { name: 'tools:ptc-only', text: 'PTC' },
        ],
      }),
    )
    expect(assembled.sections.map(s => s.name)).toEqual([
      'deployment:persona-prefix',
      'tools:sdk',
      'tools:ptc-only',
    ])
    expect(assembled.sections[0].text).toContain('Dispatcher rules')
  })

  it('withWorkspaceLine remains compatible with 3-arg calls', () => {
    const sections = withWorkspaceLine([{ name: 'persona', text: 'Hi' }], { session: { header: { cwd: '/work' } } }, false)
    expect(sections[0].text).toBe('Hi\n\nYour working directory is /work.')
  })
})
