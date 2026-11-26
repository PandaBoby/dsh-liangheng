# Changelog

本文件格式参照 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循
[语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added

- 构建工具链：`tsconfig.json`、`tsconfig.build.json`、`tsdown.config.ts`、`vitest.config.ts`、`.gitignore`。
- 文档：中英双语 README、CONTRIBUTING、CHANGELOG、`.editorconfig`。

### Changed

- `package.json`：`typecheck` 改用 `tsc --noEmit`；新增 `@tsdown/css@0.22.2`；`files` 增加 `lib/**/*.css`。
- `src/composition.test.ts`：断言改为结构事实，不再逐字匹配上游 persona 文案。

### Notes

- 基线：`@linxin666/dsh-liangshen` v0.4.21（Apache-2.0）。
- 与上游的唯一源码差异是 `presets/liangshen/agent.cordis.yml` 的 `persona.prefix`。
