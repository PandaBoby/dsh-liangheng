/**
 * dsh-liangshen browser half: the LiangShen lever in the composer tool row.
 *
 * The slot is `conversation.input.right` — "compact controls before the
 * composer submit action", which renders immediately left of the model
 * selector (`conversation.input.model`) inside the same composer card, on the
 * homepage's new-session hero as well as in a session. The lever lives only
 * while the session is still blank, because that is the only window in which a
 * preset can change at all: `agentPresets.select` refuses an already-started
 * session, and the arm would have nothing to do in one.
 *
 * This half talks to the host over the agent-preset Remote namespace rather
 * than through the official preset package's browser module: cross-plugin
 * collaboration here goes through cordis services and Remote surfaces, not
 * value imports.
 *
 * Failure policy: a missing slot or a refused Remote call is handled, never
 * thrown — one external plugin must not take the GUI boot down.
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the ui-conversation SlotMap merge (the composer tool row).
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type { ConfigForm, ConfigForms } from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the settings-surface Context merge (ctx.configForms).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { LiangShenBurst } from './LiangShenBurst.tsx'
import { PresetWatcher } from './preset-watcher.ts'
import { LiangShenSettingsCard, LiangShenSettingsCardController, type LiangShenSettings } from './LiangShenSettingsCard.tsx'
import { en, NS, zh, type LiangShenKey } from './locales.ts'
import { mainViewSessionId } from './main-session.ts'
import { MermaidFence } from './MermaidFence.tsx'
import { CheckListFence } from './CheckListFence.tsx'
import { installPluginCard } from './plugin-card-seat.ts'
import { installQueueStrip } from './QueueStrip.tsx'
import { createServedEntryForm } from './settings-entry-form.ts'
import './ChatPolish.css'

export { NS }

/**
 * Settings namespace the settings card edits: the family identity of this
 * plugin's own settings form, and the row id a standalone bundle install
 * carries.
 */
export const SETTINGS_NAMESPACE = 'liangheng'

/**
 * Profile entry id the family aggregate's generated row carries.
 */
const AGGREGATE_ENTRY_ID = 'web-ui-liangheng'

/** Profile entry ids this package's patch rows carry, most specific first. */
const LIANGHENG_ENTRY_IDS: readonly string[] = [AGGREGATE_ENTRY_ID, 'ui-liangheng', SETTINGS_NAMESPACE]

/**
 * The profile entry id this package's own row carries, for a page that serves
 * no family binder.
 *
 * The shared describe mirror is the only local evidence of which row id this
 * profile actually serves, but it answers asynchronously: at plugin activation
 * it usually holds nothing yet. An unanswered or empty mirror is therefore NOT
 * evidence of absence, and binding the bare namespace there is what made every
 * save fail with `No configurable plugin entry "liangshen"` — the form is
 * bound once per session, so a wrong guess never recovers. The aggregate row id
 * is the answer that matches nearly every deployment; only a mirror that
 * answers with OTHER plugins' rows keeps the namespace as the last resort (the
 * pre-0.1.7 keying shape), because that answer is the one that actually proves
 * this package's own row is not served.
 * @param forms - the shared configuration forms service.
 * @returns the entry id to bind.
 */
export function servedEntryId(forms: ConfigForms): string {
  let served: readonly string[] | undefined
  try {
    served = forms.describe().getSnapshot().view?.namespaces.map(view => view.ns)
  } catch {
    // A mirror that refuses the read is unanswered too, not absent.
    served = undefined
  }
  if (served === undefined || served.length === 0) return AGGREGATE_ENTRY_ID
  return LIANGHENG_ENTRY_IDS.find(id => served.includes(id)) ?? SETTINGS_NAMESPACE
}

/**
 * Bind the settings form the card stages over.
 *
 * The family binder comes first: it is what resolves this package's family
 * namespace onto the profile entry id the Host serves the form under, and it
 * keeps the loopback bridge as its own fallback. A page without that group (or
 * one where its client half has not applied yet) binds through the shared forms
 * service, on the entry id the describe mirror justifies and rebound as soon as
 * the mirror answers — see {@link createServedEntryForm} for why a one-shot
 * guess cannot be right for both an aggregate and a standalone install.
 * @param ctx - the browser plugin context.
 * @returns the form the settings card reads and writes.
 */
export function bindSettingsForm(ctx: ClientContext): ConfigForm<LiangShenSettings> {
  const binder = ctx.get('webUiSettings')
  if (binder !== undefined && typeof binder.bind === 'function') {
    return binder.bind<LiangShenSettings>({ namespace: SETTINGS_NAMESPACE })
  }
  return createServedEntryForm<LiangShenSettings>({
    forms: ctx.configForms,
    entryIds: LIANGHENG_ENTRY_IDS,
  })
}

/** Owner share of a plugin card (the section supplies nothing). */
export interface SettingsPluginItemOwnerProps {
  /** Marker field: card owner props are intentionally empty. */
  children?: never
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    /**
     * The child slot the Web UI plugin group declares; this card registers into
     * the group's list seat rather than the official bundle-configuration
     * seat. Declared here so this package needs no dependency on the sibling UI
     * package.
     */
    'web-ui.plugin.item': { kind: 'list'; scope: 'root'; owner: SettingsPluginItemOwnerProps }
    /** Language-keyed layers around one Markdown fence in the Chat flow. */
    'conversation.chat.markdown.fence': {
      kind: 'hoc'
      scope: 'session'
      owner: { lang: string; code: string; streaming: boolean; meta?: string | undefined }
    }
  }
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /**
     * Optional family settings binder provided by dsh-web-settings; absent when
     * that group plugin is not installed, so callers bind the shared forms
     * service (`ctx.configForms`) by profile entry id directly.
     */
    webUiSettings?: { bind<S>(spec: LiangShenFormSpec<S>): ConfigForm<S> }
  }
}

/**
 * One settings namespace a family card binds. The 0.1.7 client exports no spec
 * type (the form controller takes it privately), so the binder's input shape is
 * restated here.
 */
export interface LiangShenFormSpec<T> {
  /** Settings namespace registered by the owning host plugin. */
  namespace: string
  /** Narrow one wire section; undefined keeps the last accepted value. */
  decode?: (section: unknown) => T | undefined
}

/**
 * Required client services: the slot registry, locale, sessions, and the shared
 * configuration forms. No Remote namespace is injected any more: the preset
 * picker above the composer performs the switch, and this half only reads the
 * `agentPreset` projection the host publishes on the session catalog.
 */
export const inject = ['slots', 'locale', 'sessions', 'configForms']

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The LiangHeng copy. */
    'liangheng': LiangShenKey
  }
}

export { LiangShenBurst } from './LiangShenBurst.tsx'
export { PresetWatcher, type BurstFace, type BurstSnapshot } from './preset-watcher.ts'
export { LIANGHENG_PRESET_ID, LIANGSHEN_PRESET_ID, presetLanded } from '../core/lever.ts'

/**
 * Mount the browser half: register the copy, follow the preset the session
 * catalog reports, and play the burst when it lands on LiangHeng mode.
 * @param ctx - the browser plugin context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    try {
      return ctx.locale.register(NS, { zh, en })
    } catch {
      return () => {}
    }
  }, 'liangheng: lever dictionaries')

  const watcher = new PresetWatcher(ctx)
  ctx.effect(() => () => watcher.dispose(), 'liangheng: preset watcher')
  try {
    watcher.start()
  } catch {
    // An unavailable session catalog leaves the overlay silent; the rest of the
    // browser half still mounts.
  }

  // Plugin configuration card: one staged form over the `liangheng` settings
  // namespace, contributed to the Web UI plugin group or official bundle seat.
  try {
    const settingsCard = new LiangShenSettingsCardController(bindSettingsForm(ctx))
    // Card seat: the family group's list seat, or the official
    // bundle-configuration seat when the group is not installed.
    installPluginCard(ctx, {
      bundle: 'dsh-liangheng',
      id: 'liangheng',
      order: 125,
      locale: NS,
      inject: () => settingsCard.inject(),
      component: LiangShenSettingsCard,
    })
    ctx.effect(() => () => { settingsCard.dispose() }, 'liangheng: settings card')
  } catch {
    // A missing settings surface leaves the rest working and the card absent;
    // one unavailable service must not take the browser half down.
  }

  ctx.slots.inject('conversation.input.right', () => {
    try {
      const unregister = ctx.slots.register({
        name: 'conversation.input.right',
        id: 'liangheng-burst',
        // The entry paints nothing while idle: it is a mount point for the
        // viewport-fixed overlay, so the composer row keeps the host's layout.
        inject: () => watcher.face(),
      }, LiangShenBurst)
      return () => { unregister() }
    } catch {
      return () => {}
    }
  })

  // Queued-message strip. The host edits a queued row in place and refuses any
  // row carrying an image; taking the cell over makes Edit return the message,
  // attachments included, to the composer.
  installQueueStrip(ctx)

  // Render Mermaid code fences inside chat responses using our lightweight theme-aware SVG renderer.
  ctx.slots.inject('conversation.chat.markdown.fence', () => {
    try {
      const unregister = ctx.slots.register({
        name: 'conversation.chat.markdown.fence',
        key: 'mermaid',
        id: 'dsh-liangheng/fence/mermaid',
        locale: NS,
      }, MermaidFence)
      return () => { unregister() }
    } catch {
      return () => {}
    }
  })

  // Verification ledgers: `check` (and its plural, because the language is
  // guessable) render as a compact tick/key/value shelf instead of raw CLI
  // output. Any other fence keeps the host's code block.
  for (const fenceKey of ['check', 'checks']) {
    ctx.slots.inject('conversation.chat.markdown.fence', () => {
      try {
        const unregister = ctx.slots.register({
          name: 'conversation.chat.markdown.fence',
          key: fenceKey,
          id: `dsh-liangheng/fence/${fenceKey}`,
          locale: NS,
        }, CheckListFence)
        return () => { unregister() }
      } catch {
        return () => {}
      }
    })
  }

  // Scope chat typography/table/image polish strictly to active LiangHeng sessions.
  ctx.effect(() => {
    if (typeof document === 'undefined') return () => {}
    const root = document.documentElement
    const sessionList = (() => {
      try {
        return (ctx as unknown as {
          sessions?: {
            list?: {
              getSnapshot?: () => { byId?: Record<string, { id: string; retainedBy?: Partial<Record<string, number>>; projectionValues?: Record<string, unknown> } | undefined> }
              subscribe?: (listener: () => void) => () => void
            }
          }
        }).sessions?.list
      } catch {
        return undefined
      }
    })()
    const syncChatAttribute = () => {
      try {
        const byId = sessionList?.getSnapshot?.()?.byId
        const activeId = mainViewSessionId(byId)
        const activePreset = activeId !== undefined ? byId?.[activeId]?.projectionValues?.['agentPreset'] : undefined
        if (activePreset === 'liangheng') root.dataset.lianghengChat = 'on'
        else delete root.dataset.lianghengChat
      } catch {
        delete root.dataset.lianghengChat
      }
    }
    syncChatAttribute()
    let unsubscribe: (() => void) | undefined
    try {
      unsubscribe = sessionList?.subscribe?.(syncChatAttribute)
    } catch {
      unsubscribe = undefined
    }
    return () => {
      unsubscribe?.()
      delete root.dataset.lianghengChat
    }
  }, 'liangheng: chat visual polish marker')
}
