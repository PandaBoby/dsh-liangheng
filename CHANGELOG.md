# Changelog

本文件格式参照 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循
[语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [0.2.6] - 2026-11-27

> 0.2.5 曾在一次未完成的 2FA 认证中留下一条 staged 记录（公开版本列表里不可见），
> 该版本号因此跳过，本次发布直接使用 0.2.6。

### Changed

- **DSH 版本范围挪到规范声明的落点**：`engines.dsh` 此前写成 `dsh.engines.dsh`，而
  [@deepseek-ai/dsh-package-manifest](https://www.npmjs.com/package/@deepseek-ai/dsh-package-manifest)
  定义的是顶层 `engines` 下、与 `engines.node` 并列的 `dsh` 键。宿主与 Marketplace 索引生成器
  都不读私有位置的那一份，条目因此退化成「任意 DSH 版本兼容」。现在范围落在规范位置，
  `dsh` 段只剩 `bundle` 与 `client`。读取方目前不强制检查该字段，所以这是声明性修正，
  不改变现有安装行为。

### Added

- **排队消息「取回编辑」**：接管 `conversation.input.dock` 的 `queue` cell（同 id、`priority: -1`
  的遮蔽注册），把排队条的「编辑」从宿主的内联文本框改成**把整条消息取回输入框**——文本回到
  光标处，图片重新落成草稿附件，可以继续改图文再发送。宿主对含图片的排队消息直接禁用编辑
  （`queue.edit.unsupported`），这是它唯一做不到的事。顺序上先取回内容、再移除队列条目，
  失败时条目留在队列里（重复可恢复，丢失不可恢复）。**已知边界**：队列里带文件（非图片）的
  消息仍走宿主行为（编辑按钮禁用并提示），因为宿主没有暴露文件附件的字节通道，宿主附件注册表
  只收浏览器 `File`。**操作区改版**：主操作改为常驻文字「取回编辑」（整行也可点），插话只在有
  回复运行时出现，删除收进 `⋯` 菜单（附「不进草稿」说明），命中区 28→32px，插话图标由纸飞机
  改为折返箭头——纸飞机在聊天语境里读作「发送这条」，与「插给正在跑的回复」相反。依赖宿主
  `ConversationController.createDrafts`（非 `IConversation` 契约），
  代码里有存在性守卫与 `shortcut:` 标注，宿主升级需复查。
- **npm 关键词**：补上 `dsh`、`dsh-plugin`、`deepseek-harness` 等 9 个关键词。此前
  package.json 没有任何 keywords——npm 搜索 `keywords:dsh-plugin` 的 1.8 万条结果里没有本包，
  直接搜包名 `dsh-liangheng` 也会被 32991 条结果淹没；`dsh-pet`、`dshmarket`、`dsh-agent-compare`
  等同类插件都声明了同一组三元组。

## [0.2.4] - 2026-11-27

### Fixed

- **验证账本的长键不再被省略号吃掉**：[CheckListFence.module.css](src/client/CheckListFence.module.css)
  的键列原本固定 84px，解析器允许的 24 字符键（例如 `git log origin/dev..HEAD`）被压成
  `GIT LOG ORI…`，键本身成了不可读信息。现在卡片改用 subgrid 承载列轨道：键列以 84px 为
  下限、按这张卡里最宽的键撑开，同一张卡内所有行的分隔竖线仍停在同一个 x 上；只有短键的卡
  维持原来的 84px 基线。不支持 subgrid 的引擎回落到固定列 + 省略号。核验样张：
  `.probe/check-long-key.png`（900px 与 420px 两种宽度）。

- **验证账本的勾号不再贴着键**：状态符号列原本 18px，`✓` 两侧各只剩 5px，
  `✓ GIT PUSH` 读起来像 `✓GIT PUSH`。列宽改为 26px（12px 字形 + 两侧各 7px），
  符号和它标注的键之间终于有了一段空隙；同一张样张可对照。

## [0.2.3] - 2026-11-27

### Added

- **模式标识接管三处宿主图标位**：宿主把「Agent 预设」的图标写死成通用的
  `IconAgentPresetOutlineRegular`（roster 协议里根本没有 icon 字段），「深度求索中，用时 …」
  那一行也自带一套鲸鱼尾巴遮罩动画（APNG + `currentColor`）。三处现在都由
  [ChatPolish.css](src/client/ChatPolish.css) 从外面接管：新会话的预设选择器
  （`conversation.hero.agentPreset`）与会话头徽标（`conversation.session.header.actions`）
  换成模式自带的鲸鱼，运行状态行整只换成同一只鲸鱼的 15 帧动画。锚点只用
  `data-slot` / `data-chat-running` 这类公开契约，不碰 CSS-module 哈希；暗色主题下各自
  提亮。动画与静帧以 data URI 内嵌，不新增文件、不依赖打包器解析资源路径。

### Changed

- **交互式命令自驱（Persona 第 3 节）**：登录、2FA、浏览器授权这类步骤不再让用户把一次性验证码
  贴回对话。会话自己开持久 TTY（`terminal_open`），让 CLI 走它自己的 web 认证——`npm publish`、
  `gh auth login`、各家云 CLI 都会在那里打印授权链接，并在浏览器同意后自行继续；环境里若有
  computer-use 或浏览器自动化（`act_on_build_computer`、`agent-browser`、Playwright），由会话
  自己点那句授权。只有真正必须人工接手的那一步才留一句指针给用户，前后的活仍是会话自己的。
  `src/composition.test.ts` 增加对应断言（150 tests）。

## [0.2.2] - 2026-11-27

### Added

- **图片存续纪律（Persona 第 5 节）**：`![](<path>)` 每次渲染都会重新读盘，路径失效即退化成
  `图片无法预览` + alt 文案。`presets/liangheng/agent.cordis.yml` 因此新增一条规则：探针截图
  与生成图落在工作区（gitignored `.probe/`），不落 `/tmp`、`$TMPDIR` 或任何后续清理会命中的
  路径；`rm` 临时文件独立成一步，且不删正文仍在引用的路径；只对本轮有意义的证据改用
  `read_image` 工具结果或 `present` 承载。`src/composition.test.ts` 增加对应断言（141 tests）。

- **验证账本渲染（`check` fence）**：`conversation.chat.markdown.fence` 新增 `check` / `checks`
  两个键位，把 ```check 围栏渲染成紧凑核验账本卡片：`✓` / `✗` / `·` 三态、键值两列对齐、
  流式中逐行渲染（最后一行不完整只意味着少一行，不像图表那样必须整段解析）、无有效行或非
  字符串正文时回落到宿主的普通代码块。解析器在 [check-list.ts](src/client/check-list.ts)
  （支持 ASCII `:` 与全角 `：` 分隔、空行为排版留白），渲染在
  [CheckListFence.tsx](src/client/CheckListFence.tsx)，样式在
  [CheckListFence.module.css](src/client/CheckListFence.module.css)。行文本保留 `✓ 键: 值`
  原样，因此没装本插件的客户端仍把围栏当作可读代码块；Persona 第 5 节同步新增
  「Verification ledger」规则，`src/client/check-list.test.ts` 覆盖解析边界。

### Changed

- **导语卡标签按位置分家（Persona 第 5 节）**：`> **结论**：...` 只留给最终答复，且每条回复
  仅一次；工具调用之间的过程说明改用 `> **分析**：...`。此前一条回复里可出现两个同款
  「结论」导语卡，过程侧那块在视觉上与真正的结论竞争头条。`presets/liangheng/agent.cordis.yml`
  改写该条规则，`src/composition.test.ts` 增加对应断言（149 tests）。

- **聊天排版整体重写**：[ChatPolish.css](src/client/ChatPolish.css) 以「安静权威、单层 chrome」
  为设计语言重写 —— 轮次间距、标题阶梯、引用导语卡、代码块卡骨、表格、行内码、图片与
  KaTeX 一律改由比例、节奏、字阶对比与发丝线撑起层级，不再用边框 + 阴影 + 重填充重复做同一件
  事；所有选择器仍严格作用在 `html[data-liangheng-chat="on"]` 之下，并继续对齐宿主字号档位、
  宽度拖拽轴、深浅色与 reduced-motion。
  [MermaidFence.module.css](src/client/MermaidFence.module.css) 同步改用真实主题别名（此前引用的
  `--dsw-alias-surface-*` 等别名并不存在，暗色下会失配）。新增
  [chat-polish.test.ts](src/client/chat-polish.test.ts) 守住这些结构不变量（作用域、`overflow`
  取舍、表格与引用卡的间距节奏）。`.gitignore` 增加 `.probe/`，本地探针截图不再入库。
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
