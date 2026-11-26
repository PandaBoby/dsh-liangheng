# dsh-liangheng · 梁衡模式

<p align="center">
  <img alt="License: Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-blue.svg">
  <img alt="Node >= 24.9.0" src="https://img.shields.io/badge/node-%3E%3D24.9.0-4c6ef5.svg">
  <img alt="DSH >= 0.2.2-rc.3" src="https://img.shields.io/badge/DSH-%3E%3D0.2.2--rc.3-4c6ef5.svg">
  <img alt="Status: upstream baseline" src="https://img.shields.io/badge/status-upstream%20baseline-yellow.svg">
</p>

<p align="center">
  一个 <a href="https://www.npmjs.com/package/@deepseek-ai/dsh">DeepSeek Harness</a> agent preset，
  <strong>衍生自 <a href="docs/upstream/README.zh.md">梁神模式（LiangShen）</a></strong>。
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="docs/upstream/README.zh.md">上游文档</a>
</p>

---

## 状态：上游基线，尚无衍生成分

本仓库以 **[`@linxin666/dsh-liangshen`](https://www.npmjs.com/package/@linxin666/dsh-liangshen) v0.4.21
未经修改的源码** 作为起点，并补齐了构建与测试它所需的工具链。梁衡自己的改动尚未落地。

目前有三件事需要知道：

- `package.json` 仍声明 `@linxin666/dsh-liangshen@0.4.21`。把它改名为
  `@linxin666/dsh-liangheng`、preset id 改为 `liangheng` 是后续一次提交；在那之前不要与上游插件
  同时安装——两者会冲突。
- 与上游发布包相比只有一个文件不同：`presets/liangshen/agent.cordis.yml`。它的
  `persona.prefix` 是本机的工作纪律提示词（一条语言规则、一个 act-vs-clarify 决断门，以及
  dispatcher 规则块），上游给的是简短英文 persona。其余文件逐字节相同。
- 构建、类型检查与测试全部通过——见[开发](#开发)。

## 从梁神模式继承的机制

梁神的设计是「一行 persona + 极度克制的工具面」，真正起作用的是运行时机制而不是提示词文本：

| 机制 | 行为 |
| --- | --- |
| 单一 wire 呈现 | 整个会话只声明一次 `presentation`：`ptc` 把 wire 收拢为 `run_code`（其余工具经生成的 SDK 调用），`native` 保留组装出的原生清单。 |
| 工具分页 | 高扇出族（`mcp__*`、`browser_*`、`task_board_*`、`team_*`、`squad*`、`ui_*`、`ssh_*`）在 `tool_activate` 激活命名空间前既不在 wire 上、也不在生成的 SDK 中；最多三个同时活跃，LRU 驱逐，状态从持久事件流重建。 |
| 工具目录消息 | 一条持久 user 消息，逐项列出本次请求实际携带的工具及其签名摘要，并为被扣留的命名空间各附一行摘要。 |
| 工作上下文行 | 一行 `[Working Context: ...]` 投影（plan 模式、已激活命名空间、进行中的 todo、事实登记簿），仅在内容变化时重发。 |
| 事实登记簿 | `fact_register` 把硬性约束、已确认决策、失败过的路径钉住，每步从事件流折叠回来。 |
| 委派守卫 | `subagent-routes` 强制每条被管辖的委派落到会话授权路由；`dispatch-guard` 拒绝子代理调用协调者专用工具与空转 sleep。 |
| 输入框拨杆 | 新建会话页模型选择器左侧的老虎机拨杆用于切换本模式；会话一旦有内容，控件消失。 |

## 环境要求

- **Node.js >= 24.9.0**（纯 ESM）
- **DeepSeek Harness >= 0.2.2-rc.3**（宿主）
- npm 或 pnpm 用于安装与构建

## 安装到 DSH profile

本仓库尚未以自有包名发布，因此以本地链接安装：

```sh
dsh plugin --profile web add link:/绝对路径/dsh-liangheng
```

安装后**完整重启 `dsh web`**，在新建的空会话中选择该预设。`lib/` 已提交，链接安装无需构建。

## 开发

```sh
npm install
npm run build      # tsc -b tsconfig.build.json && tsdown -> lib/
npm run typecheck  # tsc --noEmit
npm test           # vitest run
```

构建产物：

- `lib/index.js`——宿主半区（把内置 preset 声明给 agent-preset 注册表）
- `lib/client.js`——浏览器半区（拨杆、设置卡片）；它 import `lib/style.css`，该文件同级生成并经
  `files` 发布
- `lib/types/**`——由 `tsc -b` 产出的类型声明

> 上游发布包把 CSS 内联进 `client.js`；本仓库的构建把它拆成独立文件 + 一条 JS import
> （`css.inject`）。安装后请在真实会话中确认样式生效。

## 仓库结构

```
src/                 宿主半区（index、composition、lever、dsh-home）+ 客户端半区 + 测试
presets/liangshen/   agent preset：agent.cordis.yml 及其运行时插件
lib/                 构建产物（已提交，链接安装无需构建）
locale/              en / zh 设置文案
tools/               基准测试与会话分析脚本
docs/upstream/       上游原始 README，留作参考
```

## 相对上游基线的改动

以下改动只为让导入的源码能原样构建与测试：

1. **新增** `tsconfig.json`、`tsconfig.build.json`、`tsdown.config.ts`、`vitest.config.ts`、
   `.gitignore`——发布包里 `build`/`test` 脚本在，但配置文件不带。
2. **`package.json`**——`scripts.typecheck` 改用 `tsc --noEmit`（`tsgo` 并未声明为依赖）；
   新增 `@tsdown/css@0.22.2`（精确对齐 `tsdown@0.22.2` 要求的 peer 版本）；`files` 增加
   `lib/**/*.css`。
3. **`src/composition.test.ts`**——两条断言原本逐字匹配上游 persona 文案，现改为断言该测试真正
   关心的事实（一个字面量多行标量，且在下一个组合行处结束），因此改写 persona 不再导致失败。
4. **文档**——上游 README 移入 `docs/upstream/`；删除 `README.i18n.yaml`，因为它的校验脚本不在
   发布包内。

## 归属与致谢

本项目是衍生作品，保留全部上游声明：

- **梁神模式（LiangShen）**——`@linxin666/dsh-liangshen` v0.4.21，Apache-2.0，© zhu1090093659。
  `src/`、`presets/`、`locale/` 与 `tools/` 的来源；见 `LICENSE` 与
  `presets/liangshen/NOTICE`。
- **DeepSeek Harness 内置预设**——`agent.cordis.yml` 改编自内置 `minimal`、`standard` 与 `ptc`
  预设（MIT），其声明复录于 `presets/liangshen/NOTICE`。
- **dsh-anchored-standard**——<https://github.com/xiaobright/dsh-anchored-standard>（MIT），本预设
  的注入设计沿用了该实验的结论。

## 许可

[Apache-2.0](LICENSE)。
