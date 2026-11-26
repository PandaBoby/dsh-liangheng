# 参与贡献

本仓库是 [梁神模式](https://www.npmjs.com/package/@linxin666/dsh-liangshen) 的衍生分支。
改动前请先读 [README](README.md) 的「工作原理」与「目录与分页」两节。

## 环境准备

```sh
node -v            # >= 24.9.0
npm install
npm run build && npm run typecheck && npm test
```

三条命令必须全绿再提交。只跑 `build` 不代表通过：`typecheck` 与 `test` 各自能抓到 `build` 抓不到的问题。

## 改动预设时的硬约束

1. **`pagedToolPatterns` 是三处同源的一个事实。** `tool-catalog`、`tool-activate`、`working-context`
   三行必须完全一致；改一处等于制造「目录扣留、激活工具却说已激活」的死角。
2. **`presentation` 与 `tool-executor-ptc` 行是同一件事。** 设置覆盖层把前者写进组合：`ptc` 时保留该行，
   `native` 时停用它。手动改配置时两者必须一起改。
3. **不要在 `delegation` 组里再加第二个 `modelDiscovery`。** 它按固定名 `list_subagent_models` 注册，
   同一 scope 重复注册会让整个 preset 挂载失败。
4. **改 persona 不必改测试。** `src/composition.test.ts` 断言的是字面量标量的结构，不是具体文案。

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

type: feat | fix | docs | chore | refactor | test | perf
scope: preset | host | client | build | docs
```

示例：`feat(preset): 让 idleReclaimSteps 默认为 3`。

## 与上游同步

```sh
mkdir -p /tmp/upstream && cd /tmp/upstream
npm pack @linxin666/dsh-liangshen@<version> && tar xzf linxin666-dsh-liangshen-*.tgz
diff -rq package /path/to/dsh-liangheng --exclude=node_modules --exclude=.git
```

预期差异是构建配置、`package.json` 的脚本与依赖、`composition.test.ts` 的断言、文档，以及
`agent.cordis.yml` 的 persona。**任何其他文件的差异都需要解释**——那说明有人在这里改过上游代码。

## 提交前检查单

- [ ] `npm run build`、`npm run typecheck`、`npm test` 全绿
- [ ] 若改了 `agent.cordis.yml`：三处 `pagedToolPatterns` 一致，`presentation` 与执行器行一致
- [ ] 若改了 persona 或规则文本：在真实会话里跑一次，确认行为符合预期
- [ ] 若改了 CSS 或客户端代码：装进 profile 后确认样式与控件正常
- [ ] `LICENSE` 与 `presets/liangshen/NOTICE` 的版权行原样保留

## 许可证

提交即表示同意以 [Apache-2.0](LICENSE) 授权。
