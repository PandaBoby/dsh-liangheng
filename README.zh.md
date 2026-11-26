# dsh-liangheng · 梁衡模式

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
![Node 24.9+](https://img.shields.io/badge/node-24.9%2B-4c6ef5.svg)
![DSH 0.2.2-rc.3+](https://img.shields.io/badge/DSH-0.2.2--rc.3%2B-4c6ef5.svg)
![Status: upstream baseline](https://img.shields.io/badge/status-upstream%20baseline-yellow.svg)

一个 [DeepSeek Harness](https://www.npmjs.com/package/@deepseek-ai/dsh) agent preset，**衍生自
[梁神模式（LiangShen）](docs/upstream/README.zh.md)**——一行 persona、整个会话只声明一次的 wire
呈现，以及按需分页进场而不是每轮随行的工具族。

[English](README.md) · [上游文档](docs/upstream/README.zh.md)

> **状态：上游基线。** 本树是 [`@linxin666/dsh-liangshen`](https://www.npmjs.com/package/@linxin666/dsh-liangshen)
> v0.4.21 未经修改的源码（Apache-2.0），外加发布包未包含的构建工具链。`package.json` 仍声明上游包名，
> 因此**不要与上游插件同时安装**——两者会冲突。与发布包相比只有一个源文件不同：
> `presets/liangshen/agent.cordis.yml` 的 `persona.prefix` 换成了本机的工作纪律提示词，取代上游那段
> 简短英文 persona。

## 为什么要做这一支

标准模式会把每个工具的 JSON schema 全程挂在 wire 上。这很可预测，但没有上限：在一个装满 MCP 的
环境里实测到 **289 个工具**、分布在三个命名空间，其中仅 PTC 的 `interface ToolArgsMap` 一段就占组装
后提示词约 7.3 万字符。梁神模式用三招削这笔账，本仓库直接站在它的结果上，好让后续工作去改这个取舍，
而不是重新发现一遍：

1. **一次声明，全程同一呈现。** `ptc` 把 wire 收拢为 `run_code`，`native` 保留组装出的原生清单。
   plan mode 切换时工具目录不变，前缀缓存得以保持。
2. **分页代替平铺。** 高扇出工具族既不在 wire 上、也不在生成的 SDK 里，直到 `tool_activate` 激活其
   命名空间。
3. **把可发现性挪进消息。** 一条持久 user 消息逐项列出本次请求实际携带的工具，工具面缩小了，但模型
   不会变成瞎子。

## 快速开始

```sh
npm install
npm run build          # tsc -b + tsdown -> lib/
dsh plugin --profile web add link:$PWD
```

随后**完整重启 `dsh web`**，打开一个**全新的空会话**并选择该预设。会话一旦有内容就无法再切换预设——
宿主拒绝重新组合。

## 一个会话长什么样

```
第 1 轮    wire: run_code                      提示词: persona + plan 策略
           + 持久 user 消息: 工具目录、工作上下文
激活       tool_activate({ namespace: 'rea' }) -> 下一个请求起该命名空间进入 SDK
第 N 步    [Working Context: plan=off active=[rea] todos=2 facts=3]
压缩       目录与上下文从会话事件流重建，不依赖进程内存
```

被分页的工具族在两个关键面上都不可见：组装出的工具清单里没有它，`agent.ctx.tools.restrict` 也挡住了
它，因此 `run_code` 程序同样够不到。同时最多三个命名空间活跃，激活第四个时驱逐最久未用的那个。

## 配置

所有开关都在 `presets/liangshen/agent.cordis.yml`。值得知道的键：

| 键 | 所在行 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `presentation` | `tool-catalog` | `ptc` | 整个会话的 wire 形态。`ptc` 只有 `run_code`；`native` 为原生清单。 |
| `pagedToolPatterns` | `tool-catalog`、`tool-activate`、`working-context` | `mcp__*`、`browser_*`、`task_board_*`、`team_*`、`squad*`、`ui_*`、`ssh_*` | 激活前被扣留的命名空间。**三行必须完全一致。** |
| `maxResidentTokens` | `tool-catalog` | `8000` | 常驻面超出估算时告警一次，从不截断。 |
| `idleReclaimSteps` | 同上三行 | `0` | `0` 表示激活后常驻直到 LRU 驱逐；`N` 让空闲命名空间在下一次激活或压缩边界过期。 |
| `descriptionMaxLength` | `tool-catalog` | `200` | 单个工具一行摘要的长度上限；被策展条目保留完整手写描述。 |
| `instructionSource` | `minimal-prompt` | `host` | `AGENTS.md` 的送达方式：`host`（user 消息）、`system-prompt` 或 `hint`。 |
| `keepPlanPolicy` | `minimal-prompt` | `true` | 在只有一行的提示词里保留 plan mode 段。 |
| `keepSections` | `minimal-prompt` | `[]` | 按名字额外放行的提示词段。 |
| `dispatcher` | `minimal-prompt` | `true` | 在 persona 末尾追加 dispatcher 规则块；关掉即回到裸 persona。 |

与内置预设不同的子处理器默认值：`web.fetch` **关闭**（只能搜索），工具结果裁剪 **4096/2048/1024**
字符（内置为 8192/4096/1024），`str_replace_editor` 上限 **16000** 字符，`ralph` 最多 **64** 轮。

## 开发

```sh
npm install
npm run build      # tsc -b tsconfig.build.json && tsdown -> lib/
npm run typecheck  # tsc --noEmit
npm test           # vitest run（55 个测试）
```

产物：`lib/index.js`（宿主半区）、`lib/client.js`（浏览器半区，同级 import `lib/style.css`）、
`lib/types/**`（`tsc -b` 生成的声明）。`lib/` 已提交，因此 `link:` 安装无需构建。

## 验证会话

```sh
node tools/analyze-session.mjs <导出的-session.jsonl>
```

也可以直接看导出的 JSONL：首份 `request/header` 只携带 `run_code`；工具目录消息列出的正是该请求实际
拥有的工具；此后每一份 header 都保持同一个传输工具。

## 已知限制

- **出厂默认是 `ptc`，而厂商自己的横评把原生面排在前面**——DeepSWE v1.1 为 72.6% 对 67.6%，
  Terminal-Bench 2.1 为 90.6% 对 85.8%。切到 `native` 只需一行。
- **多了一层间接。** 被分页的工具必须先激活才存在；目录给的是摘要而不是完整 schema。
- **同一事实写三处。** `pagedToolPatterns` 声明在三个行上；不一致就会出现「目录扣留、激活工具却说
  已激活」的死角。
- **分页状态是推导出来的。** 它从会话事件流重放，日志被截断或手改过，会话认定的活跃集合就会变。
- **CSS 在这里是独立文件。** 上游内联进 `client.js`，本仓库构建为 `style.css` 加一条 JS import；
  安装后请在真实会话中确认样式生效。

## 相对上游基线的改动

1. **新增** `tsconfig.json`、`tsconfig.build.json`、`tsdown.config.ts`、`vitest.config.ts`、
   `.gitignore`——发布包有 `build`/`test` 脚本却没有配置文件。
2. **`package.json`**——`typecheck` 改用 `tsc --noEmit`（`tsgo` 并未声明为依赖）；新增
   `@tsdown/css@0.22.2`（精确对齐 `tsdown@0.22.2` 要求的 peer）；`files` 增加 `lib/**/*.css`。
3. **`src/composition.test.ts`**——两条断言原本逐字匹配上游 persona 文案，现改为断言该测试真正
   关心的事实（一个字面量多行标量，在下一个组合行处结束），改写 persona 不再导致失败。
4. **文档**——上游 README 移入 `docs/upstream/`；删除 `README.i18n.yaml`（其校验脚本未随包发布）。

## 归属与致谢

- **梁神模式（LiangShen）**——`@linxin666/dsh-liangshen` v0.4.21，Apache-2.0，© zhu1090093659。
  `src/`、`presets/`、`locale/`、`tools/` 的来源；声明见 `LICENSE` 与 `presets/liangshen/NOTICE`。
- **DeepSeek Harness 内置预设**——`agent.cordis.yml` 改编自内置 `minimal`、`standard` 与 `ptc`
  预设（MIT）。
- **dsh-anchored-standard**——https://github.com/xiaobright/dsh-anchored-standard（MIT），注入设计
  沿用了它的实验结论。

## 许可

[Apache-2.0](LICENSE)。
