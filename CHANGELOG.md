# Changelog

本文件格式参照 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循
[语义化版本](https://semver.org/lang/zh-CN/)。

## [0.2.1] - 2026-11-27

### Added

- **输出排版、图文交付与 Mermaid 渲染增强**：
  - `presets/liangheng/agent.cordis.yml`：挂载 `@deepseek-ai/dsh-tool-present`，并在 Persona 新增第 5 节输出排版与链接图表规范（首屏 `> **结论**` 导语卡、≥4 列防折行宽表、最小消歧路径链接、`「…」`/`→` 标点、Mermaid 流程图/时序图与本地图片展示规范）；
  - `presets/liangheng/minimal-prompt.mjs`：默认放行宿主 `context:file-reference` 与 `ui:deliverable-file-references`（可通过 `keepFileReferenceSections` 开关），恢复 `@file`、本地图片内联及悬停缩略图引导；
  - `presets/liangheng/tool-catalog.mjs`：为 `present` 补充策展摘要；
  - `src/client/`：新增轻量零依赖 SVG Mermaid 渲染器（[mermaid-lite.ts](src/client/mermaid-lite.ts)、[MermaidFence.tsx](src/client/MermaidFence.tsx)，注册于 `conversation.chat.markdown.fence` 槽位，支持 `图表/源码` 切换、复制与放大预览）及 `liangheng` 会话作用域隔离的聊天视觉样式微调（[ChatPolish.module.css](src/client/ChatPolish.module.css)）。
- `src/client/mermaid-lite.test.ts`：Mermaid 渲染器测试，测试总数 122 → 126。

## [0.2.0] - 2026-11-26

首次发布到 npm：`dsh-liangheng@0.2.0`。新包首发经过 npm staged 审核，审核期间的占位版本
`0.0.0-stage` 已由正式版本取代，`latest` 指向 `0.2.0`。

### Added

- 独立的 **梁衡模式 (`liangheng`)** 品牌与命名空间（包名 `dsh-liangheng`、preset ID `liangheng`、`order: 5`、独立的设置与语言命名空间、客户端 `liangheng-lever` 槽位与遥测文案），可与 `@linxin666/dsh-liangshen` 并存而不冲突。
- `presets/liangheng/minimal-prompt.mjs`：新增 `resolveSessionCwd()`（优先读取实况 `workingDirectory` 服务）、`filePathsFromExecution()`（支持 `apply_patch` 多文件/移动路径提取）以及 `TEAM_POLICY_SECTION_NAME` 放行。
- `presets/liangheng/tool-catalog.mjs`：新增 `apply_patch`、`working_directory`、`web_fetch` 策展摘要，新增 `session/event` 监听器处理 `compaction/end` 空闲收回与 `tool/ptc-dispatch` / `tool/result` 同步。
- 全面补齐测试覆盖：新增 `src/core/lever.test.ts` 与 `presets/liangheng/` 下 `subagent-routes`、`dispatch-guard`、`fact-ledger`、`working-context`、`tool-activate`、`tool-catalog`、`minimal-prompt` 7 个模块测试。

### Changed

- **专项编码 Persona 升级**（`presets/liangheng/agent.cordis.yml`）：强化意图对齐与 `ask_user_question` 单轮澄清门禁、第一性原理根因架构、严格 YAGNI、假设两轮熔断、主程直写优先 + 按需并行 `subagent` / `subagent_fork`，以及「已验证事实 / 合理推断 / 未验证边界」诚实铁律。
- **出厂默认值与工具面全面对齐 DSH `0.2.2-rc.5`**：
  - `presentation` 默认改为 `'native'`，出厂停用 `tool-executor-ptc`（设置页可切换回 `ptc`）；
  - `dispatcher` 默认改为 `false`（关闭 24.6KB 重型调度规则块，设置页可按需开启）；
  - 移除冗余 `str_replace_editor`，开启 `tool-fs` `applyPatch: true` 与 `tool-web` `fetch: true`；
  - `tool-result-pruner` 阈值调回 `8192 / 4096 / 1024`；
  - `tool-subagent-control` 默认设置 `interrupt: false`，移除已废弃的 `backgroundMode` / `enableRunInBackground` 遗留键，`plan-mode` 文案同步 `0.2.2-rc.5`。

### Fixed

- `subagent-routes.mjs`：修复 `routeParameterProbe` 未读取 `defineTool` 编译后的 `parameters.properties` 导致裸 `subagent` 调用绕过路由检查的问题；`inheritedRouteOf` 优先读取实况 `agent.model.current()`；通过 `agents` 注册表回溯父会话策略。
- `dispatch-guard.mjs`：优先检查 `subagents.rootOf()` 与 `agents.roots()`，允许直接恢复的独立子会话作为根发起提问；监听 `subagent/start` 与 `subagent/end` 补全运行中子代理追踪（替代已移除的 `subagents.list`）；`isPureSleepCommand` 新增 `||` 分隔。
- `tool-catalog.mjs`：修复 `tools/post-execute` 在 `native` `tool_activate` 报错时提前解除分页限制的时序竞态。
- `fact-ledger.mjs` & `working-context.mjs`：过滤报错的原生 `tool/call` `fact_register` 调用，避免失败登记污染 `[Working Context: ...]`。

## [0.1.0] - 2026-11-26

### Added

- 构建工具链：`tsconfig.json`、`tsconfig.build.json`、`tsdown.config.ts`、`vitest.config.ts`、`.gitignore`。
- `.github/workflows/ci.yml`：`npm ci` → `build` → `typecheck` → `test`，并校验 `lib/` 与一次全新构建一致。
- `presets/liangshen/paging.test.mjs`：30 个测试覆盖分页纯函数。
- `src/composition.test.ts`：校验三处 `pagedToolPatterns` 与 `idleReclaimSteps` 一致性。
- 文档：中英双语 README、`CONTRIBUTING.md`、`CHANGELOG.md`、`.editorconfig`。

### Changed

- 版本线从上游 `0.4.21` 重置为 `0.1.0`，新增 `scripts/inline-css.mjs` 将客户端 CSS 内联进 `lib/client.js`。
