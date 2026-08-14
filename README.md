# ApexQuant
个人 A 股量化交易研究与模拟交易系统

## 文档入口

实现和验收请按以下顺序阅读：

1. `REQUIREMENTS-0.0.1.md`：字段级需求、用户故事、状态和验收基线。
2. `SRS-0.0.1.md`：开发、测试和评审使用的正式需求规格说明书。
3. `DESIGN.md`：设计 token、组件规范和可访问性底线。
4. `UI-DESIGN.md`：页面信息架构与 Open Design 原型输入。
5. `PRD-0.0.1.md`：产品背景、业务规则和数据结构；发生冲突时以前四项为准。

当前版本覆盖八个控制室目的地（总览、策略实验室、回测中心、模拟执行、账户与风险、数据中心、运行记录、设置）；所有数据仍为本地原型快照，不连接真实券商，不发送真实委托。

## 工程脚手架

当前仓库已初始化为 Python 单仓库，领域规则、应用服务、适配器和用户接口分层：

```text
src/apexquant/{domain,application,adapters,interfaces}
tests/
apps/web/
docs/
```

从 [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) 了解边界，从 [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) 运行检查和测试。当前最小能力包括 `RiskGate`、模拟订单评估服务和 `apexquant doctor` CLI；数据同步、回测引擎、模拟账户记账和 Web 页面按 SRS 逐步实现。

Web 原型复刻已完成第一轮八页实现：页面位于 `apps/web/src/pages`，规格、测试和实现按 SDD/TDD 顺序维护。运行方式见 [apps/web/README.md](./apps/web/README.md)，原型与规格证据见 `docs/sdd/` 与 `openspec/specs/`。
