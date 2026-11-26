# dsh-liangheng · LiangHeng (梁衡模式)

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
![Node 24.9+](https://img.shields.io/badge/node-24.9%2B-4c6ef5.svg)
![DSH 0.2.2-rc.3+](https://img.shields.io/badge/DSH-0.2.2--rc.3%2B-4c6ef5.svg)
![Status: upstream baseline](https://img.shields.io/badge/status-upstream%20baseline-yellow.svg)

A [DeepSeek Harness](https://www.npmjs.com/package/@deepseek-ai/dsh) agent preset **derived from
[LiangShen (梁神模式)](docs/upstream/README.en.md)** — a one-line persona, a single wire
presentation for the whole session, and tool families that page in on demand instead of riding
along in every request.

[中文文档](README.zh.md) · [Upstream documentation](docs/upstream/README.en.md)

> **Status: upstream baseline.** The tree is the unmodified v0.4.21 source of
> [`@linxin666/dsh-liangshen`](https://www.npmjs.com/package/@linxin666/dsh-liangshen) (Apache-2.0),
> plus the build tooling that tarball withholds. `package.json` still declares the upstream name,
> so **do not install this next to the upstream plugin** — they collide. Exactly one source file
> differs from the tarball: `presets/liangshen/agent.cordis.yml`, whose `persona.prefix` carries a
> local working-discipline prompt in place of upstream's short English persona.

## Why this fork

A standard preset keeps every tool's JSON schema on the wire for the whole session. That is
predictable, and it is also unbounded: one MCP-heavy environment was measured carrying **289 tools**
across three namespaces, with the PTC interface block alone worth ~73k characters of the assembled
prompt. LiangShen attacks that bill with three moves, and this repository starts from its result so
the follow-up work can change the trade-off rather than rediscover it:

1. **One presentation, declared once.** `ptc` collapses the wire to `run_code`; `native` keeps the
   assembled roster. The catalog does not move when plan mode toggles, so the prefix stays warm.
2. **Paging instead of flat listing.** High-fan-out families stay off the wire *and* out of the
   generated SDK until `tool_activate` loads a namespace.
3. **Discoverability moved into a message.** One durable user message lists exactly what the
   request carries, so the tool surface shrinks without the model going blind.

## Quick start

```sh
npm install
npm run build          # tsc -b + tsdown -> lib/
dsh plugin --profile web add link:$PWD
```

Restart `dsh web` completely, open a **new, empty** session, and pick the preset. A session cannot
switch presets once it has content — the host refuses to recompose it.

## What a session looks like

```
turn 1     wire: run_code                      prompt: persona + plan policy
           + durable user messages: tool catalog, working context
activate   tool_activate({ namespace: 'rea' }) -> namespace joins the SDK from the next request
step N     [Working Context: plan=off active=[rea] todos=2 facts=3]
compact    catalog + context are rebuilt from the session event stream, not from process memory
```

Paged families are invisible in both places that matter: they are absent from the assembled tool
list **and** from `agent.ctx.tools.restrict`, so a `run_code` program cannot reach them either.
Three namespaces stay active at most; a fourth evicts the least recently used.

## Configuration

Everything lives in `presets/liangshen/agent.cordis.yml`. These are the keys worth knowing:

| Key | Row | Default | Effect |
| --- | --- | --- | --- |
| `presentation` | `tool-catalog` | `ptc` | Wire form for the whole session. `ptc` = `run_code` only; `native` = assembled roster. |
| `pagedToolPatterns` | `tool-catalog`, `tool-activate`, `working-context` | `mcp__*`, `browser_*`, `task_board_*`, `team_*`, `squad*`, `ui_*`, `ssh_*` | Namespaces withheld until activated. **Must be identical in all three rows.** |
| `maxResidentTokens` | `tool-catalog` | `8000` | Warns once when the resident surface grows past the estimate. Never truncates. |
| `idleReclaimSteps` | same three rows | `0` | `0` keeps activations until LRU eviction; `N` expires idle namespaces at the next activation or compaction boundary. |
| `descriptionMaxLength` | `tool-catalog` | `200` | One-line summary budget per tool; curated entries keep their full hand-written line. |
| `instructionSource` | `minimal-prompt` | `host` | How `AGENTS.md` reaches the model: `host` (user-role messages), `system-prompt`, or `hint`. |
| `keepPlanPolicy` | `minimal-prompt` | `true` | Keeps the plan-mode section in the otherwise one-line prompt. |
| `keepSections` | `minimal-prompt` | `[]` | Extra prompt sections to admit by name. |
| `dispatcher` | `minimal-prompt` | `true` | Appends the dispatcher rule block to the persona; off returns the bare persona. |

Sub-processor defaults that differ from the built-in presets: `web.fetch` **off** (search only),
tool-result pruner at **4096/2048/1024** chars (built-ins: 8192/4096/1024), `str_replace_editor`
capped at **16000** chars, `ralph` limited to **64** rounds.

## Development

```sh
npm install
npm run build      # tsc -b tsconfig.build.json && tsdown -> lib/
npm run typecheck  # tsc --noEmit
npm test           # vitest run (55 tests)
```

Output: `lib/index.js` (host half), `lib/client.js` (browser half) with `lib/style.css` imported
beside it, and `lib/types/**` declarations from `tsc -b`. `lib/` is committed so a `link:` install
needs no build step.

## Verify a session

```sh
node tools/analyze-session.mjs <exported-session.jsonl>
```

Or inspect the exported JSONL directly: the first `request/header` carries only `run_code`, the
tool-catalog message lists the tools that request actually has, and every later header keeps the
same single transport.

## Known limitations

- **`ptc` is the shipped default, and the vendor's own comparison puts native ahead** — 72.6% vs
  67.6% on DeepSWE v1.1, 90.6% vs 85.8% on Terminal-Bench 2.1. Switching to `native` is one line.
- **One indirection layer.** A paged tool must be activated before it exists; the catalog carries
  summaries, not full schemas.
- **Three copies of one fact.** `pagedToolPatterns` is declared on three rows; a mismatch leaves a
  namespace the catalog withholds while the activation tool still calls it active.
- **Paged state is derived, not stored.** It replays from the session event stream, so a truncated
  or hand-edited log changes what the session believes is active.
- **CSS ships as a file here.** Upstream inlines it into `client.js`; this build emits
  `style.css` plus a JS import. Confirm styling in a real session after install.

## Changes from the upstream baseline

1. **Added** `tsconfig.json`, `tsconfig.build.json`, `tsdown.config.ts`, `vitest.config.ts`,
   `.gitignore` — the tarball ships `build`/`test` scripts without their configs.
2. **`package.json`** — `typecheck` runs `tsc --noEmit` (`tsgo` is not a declared dependency);
   `@tsdown/css@0.22.2` added, pinned to the exact peer `tsdown@0.22.2` demands; `lib/**/*.css`
   added to `files`.
3. **`src/composition.test.ts`** — two assertions matched the upstream persona wording verbatim;
   they now assert the structural fact under test (a multi-line literal scalar ending at the next
   composition row), so rewording the persona no longer breaks the suite.
4. **Docs** — upstream READMEs moved to `docs/upstream/`; `README.i18n.yaml` removed (its
   verification script is not published).

## Attribution

- **LiangShen (梁神模式)** — `@linxin666/dsh-liangshen` v0.4.21, Apache-2.0, © zhu1090093659.
  Origin of `src/`, `presets/`, `locale/` and `tools/`; notices in `LICENSE` and
  `presets/liangshen/NOTICE`.
- **DeepSeek Harness built-in presets** — `agent.cordis.yml` adapted from the built-in `minimal`,
  `standard` and `ptc` presets (MIT).
- **dsh-anchored-standard** — https://github.com/xiaobright/dsh-anchored-standard (MIT), whose
  findings shape the injection design.

## License

[Apache-2.0](LICENSE).
