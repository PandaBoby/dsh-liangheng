# 参与贡献

本仓库是 `dsh-liangheng`（梁衡模式，衍生自 [@linxin666/dsh-liangshen](https://www.npmjs.com/package/@linxin666/dsh-liangshen)）。
改动前请先读 [README](README.md) 的「工作原理」与「目录与分页」两节。

## 环境准备

```sh
node -v            # >= 24.9.0
npm install
npm run build && npm run typecheck && npm test
```

三条命令必须全绿再提交。只跑 `build` 不代表通过：`typecheck` 与 `test` 各自能抓到 `build` 抓不到的问题。

## 改动预设时的硬约束

1. **`pagedToolPatterns` 与 `idleReclaimSteps` 是三处同源的一个事实。** `tool-catalog`、`tool-activate`、`working-context`
   三行必须完全一致；改一处等于制造「目录扣留、激活工具却说已激活」的死角。
2. **`presentation` 与 `tool-executor-ptc` 行是同一件事。** 设置覆盖层把前者写进组合：`native` 时停用该行（当前出厂默认），
   `ptc` 时启用它。手动改配置时两者必须一起改。
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

## 提交前检查单

- [ ] `npm run build`、`npm run typecheck`、`npm test` 全绿，且 `lib/` 已随源码一并提交
- [ ] 若改了 `presets/liangheng/agent.cordis.yml`：三处 `pagedToolPatterns` / `idleReclaimSteps` 一致，`presentation` 与执行器行一致
- [ ] 若改了 persona 或规则文本：在真实会话里跑一次，确认行为符合预期
- [ ] 若改了 CSS 或客户端代码：装进 profile 后确认样式与控件正常
- [ ] `LICENSE` 与 `presets/liangheng/NOTICE` 的版权及修改声明保留

## 许可证

提交即表示同意以 [Apache-2.0](LICENSE) 授权。
