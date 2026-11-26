# Changelog

本文件格式参照 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循
[语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Planned

- 处理 `lib/client.js` 对 `./style.css` 的静态 import（纯 Node ESM 无法加载），恢复与上游一致的内联形态。
- `presets/liangshen` 其余运行时模块（`tool-catalog`、`minimal-prompt`、`dispatch-guard`、
  `subagent-routes`、`fact-ledger`、`working-context`、`tool-activate`）的测试覆盖。
- 用实测数据决定 `presentation` 的出厂默认值。

## [0.1.0] - 2026-11-26

### Added

- 构建工具链：`tsconfig.json`、`tsconfig.build.json`、`tsdown.config.ts`、`vitest.config.ts`、`.gitignore`。
- `.github/workflows/ci.yml`：`npm ci` → `build` → `typecheck` → `test`，并校验 `lib/` 与一次全新构建一致。
- `presets/liangshen/paging.test.mjs`：30 个测试覆盖分页纯函数——pattern 校验、命名空间推导、
  wire 划分、`withheldToolNames`、以及事件重放（LRU 驱逐、失败调用不生效、`ptc` dispatch 形态、
  延迟空闲回收只在应用点触发）。
- `src/composition.test.ts`：新增断言，出厂 `agent.cordis.yml` 的三处 `pagedToolPatterns` 与
  `idleReclaimSteps` 必须一致。
- 文档：中英双语 README、`CONTRIBUTING.md`、`CHANGELOG.md`、`.editorconfig`。

### Changed

- 版本线从上游 `0.4.21` 重置为 `0.1.0`，与上游区分。
- `repository.url` 修正为本仓库（此前指向上游组织的另一个仓库）。
- `package.json`：`typecheck` 改用 `tsc --noEmit`；新增 `@tsdown/css@0.22.2`；`files` 增加 `lib/**/*.css`。
- `src/composition.test.ts`：断言改为结构事实，不再逐字匹配上游 persona 文案。

### Notes

- 基线：`@linxin666/dsh-liangshen` v0.4.21（Apache-2.0）。
- 与上游的唯一源码差异是 `presets/liangshen/agent.cordis.yml` 的 `persona.prefix`。
- YAML anchor 在本仓库不可用：`src/composition.ts` 自带手写解析器，不支持别名。三处一致性因此由
  测试守住，而不是由别名消除。
