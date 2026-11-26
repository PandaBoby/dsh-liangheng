/**
 * dsh-liangshen — LiangShen (梁神) agent preset plugin.
 *
 * Host half only: at activation it DECLARES the bundled LiangShen agent preset
 * to the harness's agent-preset registry (`ctx.agentPresets`), reading the
 * composition rows of `presets/liangshen/agent.cordis.yml` and handing the
 * registry a definition whose relative module paths resolve inside the bundled
 * preset directory. Declare = enabled: the registry mounts the preset's rows
 * eagerly and hands back a disposer this plugin owns, so disabling the plugin
 * (or the row unloading) unmounts them, and nothing is written to the harness
 * home. The registration is released in `ctx.effect`; the plugin's own Config
 * is the settings page the Host generates for this profile entry, and a
 * settings write re-declares the preset with the new values instead of
 * remounting the row. The capability announcement is a system-prompt section
 * that ships OFF by default (`announceToAgent: false`) and can be enabled in
 * the web settings surface (plugin config) or the profile patch. No browser
 * routes, no agent tools — the preset itself provides the tools.
 *
 * The preset combines a minimal persona with a lifetime-declared tool
 * presentation: the system prompt keeps a minimal persona with standing
 * working discipline and workspace instructions, and the wire runs the SDK's
 * 'ptc' presentation by default — the wire collapses to the `run_code`
 * transport and every other tool is reached from inside the program through
 * the generated SDK ('native' keeps the assembled roster alone), declared once
 * per session instead of staged across a turn boundary. High-fan-out tool families
 * (default `mcp__*`, `browser_*`, `task_board_*`, `team_*`, `squad*`, `ui_*`, `ssh_*`) stay paged out of the executed surface through the
 * host's scoped tool restriction until the preset's own `tool_activate` tool
 * loads their namespace (LRU cap three), with the activation state replayed
 * from the durable session event stream. The tool catalog — listing exactly
 * the tools the request carries plus the paged-out namespace summaries — and a
 * one-line working-context projection travel as durable user messages,
 * republished only on change.
 */
import type { Context, Volatile } from '@deepseek-ai/cordis';
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings';
import z from '@deepseek-ai/schemastery';
/** Stable cordis plugin name. */
export declare const name = "liangheng";
/**
 * Settings namespace of the plugin. Under the 0.1.7+ settings contract a
 * plugin's own Config IS its settings page and the namespace IS the profile
 * entry id, so this is the row id the standalone bundle patch inserts.
 */
export declare const LIANGHENG_SETTINGS_NAMESPACE: SettingsNamespace;
/** Backward-compatible alias for the settings namespace. */
export declare const LIANGSHEN_SETTINGS_NAMESPACE: SettingsNamespace;
/** Prompt assembly must exist before the announcement section can register. */
export declare const inject: string[];
/** The wire presentations the preset's tool catalog accepts. */
export declare const PRESENTATION_OPTIONS: readonly ["ptc", "native"];
/** One wire presentation. */
export type Presentation = (typeof PRESENTATION_OPTIONS)[number];
/**
 * One activation field as the Host hands it over: a stable reference whose
 * `get()` reads the value committed for this instance (a settings write updates
 * it in place, without remounting the row), or the plain value a profile patch
 * or a hand-built test context passes.
 */
export type ConfigField<T> = Volatile<T> | T | undefined;
/**
 * Plugin config, validated by the same-named schemastery schema.
 *
 * Every field is `volatile()`: the Host serves exactly the volatile fields of a
 * Config as this entry's settings form and refuses writes anywhere else, and a
 * volatile write is committed into the references this activation holds instead
 * of remounting the row.
 */
export interface Config {
    /** Master switch: when false, neither the preset declaration nor the announcement runs. */
    enabled?: ConfigField<boolean>;
    /** When true, a system-prompt section announces the plugin (default false — keep prompts clean unless the user opts in). */
    announceToAgent?: ConfigField<boolean>;
    /**
     * Wire presentation written into the declared preset's tool-catalog row.
     * `ptc` (default) collapses the wire to the single `run_code` transport and
     * reaches every other tool through the generated SDK; `native` keeps the
     * assembled roster alone. Legacy `'both'` (the pre-0.2.1 shipped default) is
     * accepted from older saved profiles and normalized to `'ptc'`.
     */
    presentation?: ConfigField<Presentation | 'both'>;
    /**
     * When true, the preset appends the dispatcher rule block to its persona:
     * the session becomes a dispatch agent whose deliverable is the plan, the
     * task book, the review verdict, and the hand-off, on top of the mode's own
     * working discipline. Orthogonal to `presentation` — the tool wire is the
     * same either way. Default true: the shipped preset runs as a dispatcher,
     * and the switch is what returns a session to the bare persona.
     */
    dispatcher?: ConfigField<boolean>;
    /**
     * On-demand tool families, comma separated (each entry a prefix ending in one
     * `*`), written to every row that pages from the list — the catalog, the
     * activation tool and the working context all replay the session log with it,
     * so the three must never disagree. Empty keeps the preset's shipped list; a
     * malformed text is ignored.
     */
    pagedToolPatterns?: ConfigField<string>;
    /**
     * Deferred idle-reclaim threshold in steps, written to every row that replays
     * the page (tool-catalog, tool-activate, working-context). 0 (the default)
     * keeps every activation resident until LRU eviction — the shipped behavior.
     * A positive N expires a namespace with no successful call for N steps, but
     * the replay applies the expiry only at the next activation or compaction,
     * so reclaim never adds a prefix-cache rebuild (issue #2066).
     */
    idleReclaimSteps?: ConfigField<number>;
}
export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    enabled: z<boolean, boolean, "volatile-defined">;
    announceToAgent: z<boolean, boolean, "volatile-defined">;
    presentation: z<string, "ptc" | "native", "volatile-defined">;
    dispatcher: z<boolean, boolean, "volatile-defined">;
    pagedToolPatterns: z<string, string, "volatile-defined">;
    idleReclaimSteps: z<number, number, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    enabled: z<boolean, boolean, "volatile-defined">;
    announceToAgent: z<boolean, boolean, "volatile-defined">;
    presentation: z<string, "ptc" | "native", "volatile-defined">;
    dispatcher: z<boolean, boolean, "volatile-defined">;
    pagedToolPatterns: z<string, string, "volatile-defined">;
    idleReclaimSteps: z<number, number, "volatile-defined">;
}>>, "plain">;
/** The settings the runtime acts on, every field read at its use site. */
export interface ResolvedConfig {
    /** Whether the preset is declared at all. */
    enabled: boolean;
    /** Whether the announcement section registers. */
    announceToAgent: boolean;
    /** Wire presentation the declared preset's tool-catalog row carries. */
    presentation: Presentation;
    /** Whether the declared preset's minimal-prompt row appends the dispatcher rule block. */
    dispatcher: boolean;
    /** On-demand tool family text; empty inherits the preset's shipped list. */
    pagedToolPatterns: string;
    /** Deferred idle-reclaim threshold in steps; 0 keeps the shipped resident behavior. */
    idleReclaimSteps: number;
}
/** Schema defaults, re-read for hand-built test contexts. */
export declare const DEFAULT_CONFIG: ResolvedConfig;
/**
 * Read the effective settings of this activation.
 * @param config - the config the Host passed to the activation.
 * @returns every field resolved against the schema defaults.
 */
export declare function resolveConfig(config?: Config): ResolvedConfig;
/** Model-facing announcement: plugin presence, principle, and limits. */
export declare const LIANGHENG_GUIDANCE = "\u672C\u673A\u5DF2\u5B89\u88C5 dsh-liangheng \u63D2\u4EF6\uFF08\u6881\u8861\u6A21\u5F0F agent preset\uFF09\uFF1A\u65B0\u5EFA\u4F1A\u8BDD\u7684\u9884\u8BBE\u9009\u62E9\u5668\u4E2D\u53EF\u9009\u300C\u6881\u8861\u6A21\u5F0F\u300D\u3002\u539F\u7406\uFF1A\u7CFB\u7EDF\u63D0\u793A\u8BCD\u4FDD\u6301\u6781\u7B80\u9AD8\u4FE1\u566A\u6BD4 persona\uFF08minimal-prompt \u653E\u884C\u8BE5\u6BB5\u3001plan:policy \u4E0E team:policy\uFF0C\u5E76\u5728 ptc \u65F6\u4FDD\u7559\u5B98\u65B9 tools:sdk / tools:ptc-only\uFF09\uFF0Cpersona \u5185\u7F6E\u4E13\u9879\u7F16\u7801\u7EAA\u5F8B\uFF08\u610F\u56FE\u5BF9\u9F50\u4E0E\u9AD8\u5F71\u54CD\u5206\u53C9\u51B3\u7B56\u95E8\u3001\u7B2C\u4E00\u6027\u539F\u7406\u6839\u56E0\u67B6\u6784\u4E0E\u4E25\u683C YAGNI\u3001\u53CD\u601D\u7194\u65AD\u2014\u2014\u540C\u4E00\u5047\u8BBE\u63A8\u6F14\u4E0D\u8D85\u8FC7\u4E24\u8F6E\u5373\u4EE5\u539F\u751F\u5DE5\u5177\u5B9E\u8BC1\u3001\u5355\u8F6E\u5E76\u53D1\u63A2\u7D22\u3001\u4E3B\u7A0B\u76F4\u5199\u4F18\u5148\u4E0E\u6309\u9700\u5E76\u884C\u5B50\u4EE3\u7406\u3001\u4EE5\u53CA\u4E8B\u5B9E\u4E0E\u672A\u9A8C\u8BC1\u8FB9\u754C\u7684\u5DE5\u7A0B\u8BDA\u5B9E\uFF09\uFF0C\u5E76\u5728\u7EC4\u88C5\u65F6\u8FFD\u52A0\u5F53\u524D\u5DE5\u4F5C\u533A\u76EE\u5F55\u884C Your working directory is <cwd>.\u3002AGENTS.md \u5DE5\u4F5C\u533A\u6307\u4EE4\u9ED8\u8BA4\u4EA4\u8FD8\u5BBF\u4E3B\u81EA\u8EAB\u7684 agent-instructions \u884C\uFF08user \u89D2\u8272\u6CE8\u5165\uFF09\uFF0C\u53EF\u9009 instructionSource: system-prompt \u63D0\u5347\u81F3\u7CFB\u7EDF\u63D0\u793A\u8BCD\uFF0865536 \u5B57\u8282\u9884\u7B97\uFF09\u3002wire \u5448\u73B0\u6309\u4F1A\u8BDD\u58F0\u660E\uFF0C\u9ED8\u8BA4 'native'\uFF08\u4FDD\u7559\u5B8C\u6574\u539F\u751F\u5DE5\u5177\u6E05\u5355\u3001\u652F\u6301 apply_patch \u4E0E web_fetch\uFF0C\u5B9E\u6D4B\u7F16\u7801\u51C6\u786E\u7387\u66F4\u9AD8\u3001\u5EF6\u8FDF\u66F4\u4F4E\uFF09\uFF0C\u53EF\u9009\u5207\u6362\u4E3A 'ptc'\uFF08\u6536\u62E2\u4E3A run_code\uFF09\u3002\u9AD8\u6247\u51FA\u5DE5\u5177\u65CF\uFF08\u9ED8\u8BA4 ['mcp__*', 'browser_*', 'task_board_*', 'team_*', 'squad*', 'ui_*', 'ssh_*']\uFF09\u7ECF\u4F5C\u7528\u57DF\u5DE5\u5177\u9650\u5236\u6309\u9700\u5206\u9875\uFF0C\u7531 tool_activate \u6309\u9700\u52A0\u8F7D\uFF08LRU \u4E0A\u9650 3 \u4E2A\uFF0C\u72B6\u6001\u4ECE\u6301\u4E45\u4E8B\u4EF6\u6D41\u91CD\u653E\uFF09\uFF1B\u91CD\u578B\u8C03\u5EA6\u89C4\u5219\uFF08dispatcher\uFF09\u9ED8\u8BA4\u5173\u95ED\uFF0C\u53EF\u5728\u8BBE\u7F6E\u9875\u6309\u9700\u5F00\u542F\u3002\u5173\u952E\u4E8B\u5B9E\u767B\u8BB0\u7C3F\uFF08fact_register\uFF09\u4E0E\u5355\u884C [Working Context: ...] \u6295\u5C04\u4F7F\u786C\u7EA6\u675F\u4E0E\u72B6\u6001\u8DE8\u957F\u4F1A\u8BDD\u4E0D\u6F02\u79FB\u3002\u5386\u53F2\u5DE5\u5177\u7ED3\u679C\u4FEE\u526A\u9608\u503C\u4E3A 8192 \u5B57\u7B26\uFF08head 4096 / tail 1024\uFF09\uFF0C\u5B50\u4EE3\u7406\u9ED8\u8BA4\u7981\u7528 interrupt_agent \u5E76\u5F3A\u5236\u4F1A\u8BDD\u8DEF\u7531\u4E0E\u6267\u884C\u5B88\u536B\u3002\u5F53\u7528\u6237\u63D0\u5230\u300C\u6881\u8861\u6A21\u5F0F / liangheng\u300D\u65F6\u5373\u6307\u672C\u9884\u8BBE\uFF0C\u8BF7\u636E\u6B64\u534F\u4F5C\u3002";
/** Backward-compatible alias for guidance text. */
export declare const LIANGSHEN_GUIDANCE = "\u672C\u673A\u5DF2\u5B89\u88C5 dsh-liangheng \u63D2\u4EF6\uFF08\u6881\u8861\u6A21\u5F0F agent preset\uFF09\uFF1A\u65B0\u5EFA\u4F1A\u8BDD\u7684\u9884\u8BBE\u9009\u62E9\u5668\u4E2D\u53EF\u9009\u300C\u6881\u8861\u6A21\u5F0F\u300D\u3002\u539F\u7406\uFF1A\u7CFB\u7EDF\u63D0\u793A\u8BCD\u4FDD\u6301\u6781\u7B80\u9AD8\u4FE1\u566A\u6BD4 persona\uFF08minimal-prompt \u653E\u884C\u8BE5\u6BB5\u3001plan:policy \u4E0E team:policy\uFF0C\u5E76\u5728 ptc \u65F6\u4FDD\u7559\u5B98\u65B9 tools:sdk / tools:ptc-only\uFF09\uFF0Cpersona \u5185\u7F6E\u4E13\u9879\u7F16\u7801\u7EAA\u5F8B\uFF08\u610F\u56FE\u5BF9\u9F50\u4E0E\u9AD8\u5F71\u54CD\u5206\u53C9\u51B3\u7B56\u95E8\u3001\u7B2C\u4E00\u6027\u539F\u7406\u6839\u56E0\u67B6\u6784\u4E0E\u4E25\u683C YAGNI\u3001\u53CD\u601D\u7194\u65AD\u2014\u2014\u540C\u4E00\u5047\u8BBE\u63A8\u6F14\u4E0D\u8D85\u8FC7\u4E24\u8F6E\u5373\u4EE5\u539F\u751F\u5DE5\u5177\u5B9E\u8BC1\u3001\u5355\u8F6E\u5E76\u53D1\u63A2\u7D22\u3001\u4E3B\u7A0B\u76F4\u5199\u4F18\u5148\u4E0E\u6309\u9700\u5E76\u884C\u5B50\u4EE3\u7406\u3001\u4EE5\u53CA\u4E8B\u5B9E\u4E0E\u672A\u9A8C\u8BC1\u8FB9\u754C\u7684\u5DE5\u7A0B\u8BDA\u5B9E\uFF09\uFF0C\u5E76\u5728\u7EC4\u88C5\u65F6\u8FFD\u52A0\u5F53\u524D\u5DE5\u4F5C\u533A\u76EE\u5F55\u884C Your working directory is <cwd>.\u3002AGENTS.md \u5DE5\u4F5C\u533A\u6307\u4EE4\u9ED8\u8BA4\u4EA4\u8FD8\u5BBF\u4E3B\u81EA\u8EAB\u7684 agent-instructions \u884C\uFF08user \u89D2\u8272\u6CE8\u5165\uFF09\uFF0C\u53EF\u9009 instructionSource: system-prompt \u63D0\u5347\u81F3\u7CFB\u7EDF\u63D0\u793A\u8BCD\uFF0865536 \u5B57\u8282\u9884\u7B97\uFF09\u3002wire \u5448\u73B0\u6309\u4F1A\u8BDD\u58F0\u660E\uFF0C\u9ED8\u8BA4 'native'\uFF08\u4FDD\u7559\u5B8C\u6574\u539F\u751F\u5DE5\u5177\u6E05\u5355\u3001\u652F\u6301 apply_patch \u4E0E web_fetch\uFF0C\u5B9E\u6D4B\u7F16\u7801\u51C6\u786E\u7387\u66F4\u9AD8\u3001\u5EF6\u8FDF\u66F4\u4F4E\uFF09\uFF0C\u53EF\u9009\u5207\u6362\u4E3A 'ptc'\uFF08\u6536\u62E2\u4E3A run_code\uFF09\u3002\u9AD8\u6247\u51FA\u5DE5\u5177\u65CF\uFF08\u9ED8\u8BA4 ['mcp__*', 'browser_*', 'task_board_*', 'team_*', 'squad*', 'ui_*', 'ssh_*']\uFF09\u7ECF\u4F5C\u7528\u57DF\u5DE5\u5177\u9650\u5236\u6309\u9700\u5206\u9875\uFF0C\u7531 tool_activate \u6309\u9700\u52A0\u8F7D\uFF08LRU \u4E0A\u9650 3 \u4E2A\uFF0C\u72B6\u6001\u4ECE\u6301\u4E45\u4E8B\u4EF6\u6D41\u91CD\u653E\uFF09\uFF1B\u91CD\u578B\u8C03\u5EA6\u89C4\u5219\uFF08dispatcher\uFF09\u9ED8\u8BA4\u5173\u95ED\uFF0C\u53EF\u5728\u8BBE\u7F6E\u9875\u6309\u9700\u5F00\u542F\u3002\u5173\u952E\u4E8B\u5B9E\u767B\u8BB0\u7C3F\uFF08fact_register\uFF09\u4E0E\u5355\u884C [Working Context: ...] \u6295\u5C04\u4F7F\u786C\u7EA6\u675F\u4E0E\u72B6\u6001\u8DE8\u957F\u4F1A\u8BDD\u4E0D\u6F02\u79FB\u3002\u5386\u53F2\u5DE5\u5177\u7ED3\u679C\u4FEE\u526A\u9608\u503C\u4E3A 8192 \u5B57\u7B26\uFF08head 4096 / tail 1024\uFF09\uFF0C\u5B50\u4EE3\u7406\u9ED8\u8BA4\u7981\u7528 interrupt_agent \u5E76\u5F3A\u5236\u4F1A\u8BDD\u8DEF\u7531\u4E0E\u6267\u884C\u5B88\u536B\u3002\u5F53\u7528\u6237\u63D0\u5230\u300C\u6881\u8861\u6A21\u5F0F / liangheng\u300D\u65F6\u5373\u6307\u672C\u9884\u8BBE\uFF0C\u8BF7\u636E\u6B64\u534F\u4F5C\u3002";
/**
 * Absolute path of the bundled LiangHeng preset directory: the composition,
 * the display map, and the preset-local `.mjs` plugins this plugin declares.
 * @returns the preset directory as a filesystem path.
 */
export declare function bundledPresetDir(): string;
/**
 * Mount the plugin: declare the bundled preset, register the announcement
 * section when announceToAgent is on (off by default), and re-declare on every
 * committed settings write.
 * @param ctx - host plugin context carrying systemPrompt.
 * @param config - resolved plugin config (schema defaults applied by the loader).
 */
export declare const apply: typeof applyImpl;
declare function applyImpl(ctx: Context, config?: Config): void;
declare module '@deepseek-ai/cordis' {
    interface Events {
        /**
         * Volatile config values were committed into the running fiber without a
         * remount; dispatched to the owning fiber only. Spelled here because the
         * Loader package is not a dependency of this plugin, with the Loader's own
         * shape so the two declarations merge when a Host program carries both.
         * @param paths - changed config paths as key arrays; every value is committed before dispatch.
         * @mode emit
         */
        'loader/volatile-update'(paths: readonly (readonly string[])[]): void;
    }
}
export {};
//# sourceMappingURL=index.d.ts.map