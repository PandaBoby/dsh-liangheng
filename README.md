# dsh-liangheng · LiangHeng (梁衡模式)

<p align="center">
  <img alt="License: Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-blue.svg">
  <img alt="Node >= 24.9.0" src="https://img.shields.io/badge/node-%3E%3D24.9.0-4c6ef5.svg">
  <img alt="DSH >= 0.2.2-rc.3" src="https://img.shields.io/badge/DSH-%3E%3D0.2.2--rc.3-4c6ef5.svg">
  <img alt="Status: upstream baseline" src="https://img.shields.io/badge/status-upstream%20baseline-yellow.svg">
</p>

<p align="center">
  A <a href="https://www.npmjs.com/package/@deepseek-ai/dsh">DeepSeek Harness</a> agent preset
  <strong>derived from <a href="docs/upstream/README.en.md">LiangShen (梁神模式)</a></strong>.
</p>

<p align="center">
  <a href="README.zh.md">中文文档</a> ·
  <a href="docs/upstream/README.en.md">Upstream documentation</a>
</p>

---

## Status: upstream baseline

This repository was seeded with the **unmodified v0.4.21 source of
[`@linxin666/dsh-liangshen`](https://www.npmjs.com/package/@linxin666/dsh-liangshen)** plus the
tooling needed to build and test it. LiangHeng's own changes have not landed yet.

Three things are true today:

- `package.json` still declares `@linxin666/dsh-liangshen@0.4.21`. Renaming it to
  `@linxin666/dsh-liangheng` with preset id `liangheng` is a follow-up commit; until that lands,
  do not install this next to the upstream plugin — the two would collide.
- Exactly one file differs from the published upstream tarball:
  `presets/liangshen/agent.cordis.yml`. Its `persona.prefix` carries this machine's
  working-discipline prompt (a language rule, an act-vs-clarify decision gate, and the dispatcher
  rule block) where upstream ships a short English persona. Everything else is byte-identical.
- Build, typecheck and tests all pass — see [Development](#development).

## What it inherits from LiangShen

LiangShen's design is a small persona plus an aggressively economical tool surface. What makes it
work is runtime machinery, not prompt text:

| Mechanism | Behaviour |
| --- | --- |
| Single wire presentation | One `presentation` for the session's whole lifetime: `ptc` collapses the wire to `run_code` (every other tool travels through the generated SDK), `native` keeps the assembled roster. |
| Tool paging | High-fan-out families (`mcp__*`, `browser_*`, `task_board_*`, `team_*`, `squad*`, `ui_*`, `ssh_*`) stay off the wire and out of the SDK until `tool_activate` loads a namespace; at most three stay active, LRU evicted, state replayed from the durable event stream. |
| Tool catalog message | One durable user message listing exactly the tools the request carries, a signature summary each, plus one-line summaries for the paged-out namespaces. |
| Working context line | A single `[Working Context: ...]` projection (plan mode, active namespaces, in-progress todos, fact register), republished only when it changes. |
| Fact register | `fact_register` pins hard constraints, confirmed decisions and failed paths, folded back from the event stream every step. |
| Delegation guards | `subagent-routes` forces every policed delegation onto a Session-authorized route; `dispatch-guard` refuses coordinator-only tools and bare sleep loops from a child. |
| Composer lever | A slot-machine lever left of the model selector on the new-session screen toggles the mode; it disappears once a session has content. |

## Requirements

- **Node.js >= 24.9.0** (ESM only)
- **DeepSeek Harness >= 0.2.2-rc.3** on the host
- npm or pnpm to install and build

## Install into a DSH profile

This repository does not publish under its own package name yet, so link the working tree:

```sh
dsh plugin --profile web add link:/absolute/path/to/dsh-liangheng
```

Then **restart `dsh web` completely** and pick the preset in a new, empty session. `lib/` is
committed, so a link install needs no build step.

## Development

```sh
npm install
npm run build      # tsc -b tsconfig.build.json && tsdown -> lib/
npm run typecheck  # tsc --noEmit
npm test           # vitest run
```

Build output:

- `lib/index.js` — host half (declares the bundled preset to the agent-preset registry)
- `lib/client.js` — browser half (composer lever, settings card); it imports `lib/style.css`,
  emitted beside it and shipped through `files`
- `lib/types/**` — declarations produced by `tsc -b`

> Upstream's published bundle inlines the CSS into `client.js`; this build emits it as a separate
> file plus a JS import (`css.inject`). Verify styling in a real session after install.

## Repository layout

```
src/                 host half (index, composition, lever, dsh-home) + client half + tests
presets/liangshen/   the agent preset: agent.cordis.yml and its runtime plugins
lib/                 build output (committed so a link install needs no build)
locale/              en / zh settings strings
tools/               benchmark and session-analysis scripts
docs/upstream/       the original upstream READMEs, kept for reference
```

## Changes from the upstream baseline

Everything below exists only so the imported source builds and tests as-is:

1. **Added** `tsconfig.json`, `tsconfig.build.json`, `tsdown.config.ts`, `vitest.config.ts` and
   `.gitignore` — the published tarball ships the `build`/`test` scripts without their configs.
2. **`package.json`** — `scripts.typecheck` now runs `tsc --noEmit` (`tsgo` is not a declared
   dependency); `@tsdown/css@0.22.2` added, pinned to the exact peer `tsdown@0.22.2` demands;
   `lib/**/*.css` added to `files`.
3. **`src/composition.test.ts`** — two assertions matched the upstream persona wording verbatim.
   They now assert the structural fact the test is about (a multi-line literal scalar that stops
   at the next composition row), so rewording the persona no longer breaks the suite.
4. **Docs** — the upstream READMEs moved to `docs/upstream/`; `README.i18n.yaml` was removed
   because its verification script is not part of the published package.

## Attribution

This project is a derivative work and keeps every upstream notice:

- **LiangShen (梁神模式)** — `@linxin666/dsh-liangshen` v0.4.21, Apache-2.0, © zhu1090093659.
  Source of `src/`, `presets/`, `locale/` and `tools/`; see `LICENSE` and
  `presets/liangshen/NOTICE`.
- **DeepSeek Harness built-in presets** — `agent.cordis.yml` is adapted from the built-in
  `minimal`, `standard` and `ptc` presets (MIT); their notices are reproduced in
  `presets/liangshen/NOTICE`.
- **dsh-anchored-standard** — <https://github.com/xiaobright/dsh-anchored-standard> (MIT), the
  experiment whose findings shape the preset's injection design.

## License

[Apache-2.0](LICENSE).
