/**
 * Preset watcher: turns "the preset picker above the composer landed on
 * LiangHeng mode" into one burst.
 *
 * The plugin owns no control in the composer any more. It reads the same
 * `agentPreset` projection the host writes when a preset is chosen, and the
 * change rule lives in {@link presetLanded}, so the first reading of a page and
 * a move between sessions never fire the overlay.
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { ISessions } from '@deepseek-ai/dsh-api-session-controller/client'
import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-store'
import { presetLanded } from '../core/lever.ts'
import { mainViewSessionId } from './main-session.ts'
import type { LiangShenKey } from './locales.ts'

/** What the burst view renders. */
export interface BurstSnapshot {
  /** Increments each time LiangHeng mode lands, so the overlay replays once. */
  burst: number
}

/** The injected face the burst view consumes. */
export interface BurstFace {
  /** The snapshot store the view subscribes to. */
  store: SnapshotStore<BurstSnapshot>
  /** Translate one of this plugin's keys. */
  t: (key: LiangShenKey, vars?: Record<string, string | number>) => string
}

/** A translation function bound to this plugin's locale namespace. */
type Translator = (key: LiangShenKey, vars?: Record<string, string | number>) => string

/** Read the preset a session summary reports, when it reports one. */
function presetOf(session: { projectionValues?: Record<string, unknown> } | undefined): string | undefined {
  const value = session?.projectionValues?.['agentPreset']
  return typeof value === 'string' ? value : undefined
}

/** The watcher: one session reading at a time, one burst per landing. */
export class PresetWatcher {
  private readonly store: SnapshotStore<BurstSnapshot>

  /**
   * The catalog this watcher follows, resolved defensively: the context proxy
   * throws on any service the fiber did not inject, and a deployment without it
   * must leave the overlay silent rather than take the plugin down.
   */
  private readonly sessions: ISessions | undefined

  private readonly disposers: (() => void)[] = []

  /** The one face this watcher hands out; the view reads it on every render. */
  private cachedFace: BurstFace | undefined

  /**
   * The translator bound to this plugin's locale namespace, resolved on first
   * use. A lookup that resolved nothing is never cached, so a locale service
   * registered after activation still reaches the same face.
   */
  private cachedTranslate: Translator | undefined

  /** Session the last reading belonged to. */
  private lastSessionId: string | undefined

  /** Preset the last reading reported. */
  private lastPreset: string | undefined

  /** False until the first reading seeds the baseline instead of comparing. */
  private seeded = false

  constructor(private readonly ctx: ClientContext) {
    this.sessions = readService<ISessions>(() => (ctx as unknown as { sessions: ISessions }).sessions)
    this.store = createSnapshotStore<BurstSnapshot>({ burst: 0 })
  }

  /** The snapshot store the view subscribes to. */
  snapshot(): SnapshotStore<BurstSnapshot> {
    return this.store
  }

  /** Follow the session catalog; the first reading only seeds the baseline. */
  start(): void {
    const list = this.sessions?.list
    if (list !== undefined) {
      this.disposers.push(list.subscribe(() => { this.refresh() }))
    }
    this.refresh()
  }

  /** Release every subscription. Idempotent. */
  dispose(): void {
    for (const dispose of this.disposers.splice(0)) dispose()
  }

  /** The inject face handed to the slot entry; the same instance on every read. */
  face(): BurstFace {
    const cached = this.cachedFace
    if (cached !== undefined) return cached
    const face: BurstFace = {
      store: this.store,
      t: (key, vars) => {
        const translate = this.translate()
        return translate === undefined ? key : translate(key, vars)
      },
    }
    this.cachedFace = face
    return face
  }

  /**
   * The translator bound to this plugin's locale namespace, or undefined while
   * none answers. The binding is resolved once and only on success: a locale
   * service that arrives later than this watcher still gets its chance.
   */
  private translate(): Translator | undefined {
    const cached = this.cachedTranslate
    if (cached !== undefined) return cached
    const bound = readService<Translator>(() => this.ctx.locale.bind('liangheng'))
    if (typeof bound !== 'function') return undefined
    this.cachedTranslate = bound
    return bound
  }

  /** Compare one reading with the last, and celebrate a landing. */
  private refresh(): void {
    const state = this.sessions?.list.getSnapshot()
    const sessionId = mainViewSessionId(state?.byId)
    const row = sessionId === undefined
      ? undefined
      : state?.byId[sessionId] as unknown as { projectionValues?: Record<string, unknown> } | undefined
    const preset = presetOf(row)

    if (!this.seeded) {
      this.seeded = true
      this.lastSessionId = sessionId
      this.lastPreset = preset
      return
    }

    const sameSession = sessionId !== undefined && sessionId === this.lastSessionId
    const landed = presetLanded(this.lastPreset, preset, sameSession)
    this.lastSessionId = sessionId
    this.lastPreset = preset
    if (!landed) return
    this.store.set({ burst: this.store.getSnapshot().burst + 1 })
  }
}

/**
 * Read one context service, treating the proxy's "without inject" refusal (and
 * any other resolution fault) as the service being absent.
 */
function readService<T>(read: () => T): T | undefined {
  try {
    return read()
  } catch {
    return undefined
  }
}
