## Context

现有系统只有风控和执行服务；回测页面的数值来自本地 fixture，无法被 Python 用例消费。数据中心已有质量报告，provenance 仓储已有运行状态，因此回测 runner 可以先实现可验证的 orchestration 边界。

## Goals / Non-Goals

**Goals:**

- 固定策略/数据/成本/种子、起止日期和初始资金到不可变快照。
- 数据质量为 error 或日期非法时阻断运行，并留下可解释的 error 审计事件。
- 对合法输入生成确定性指标快照，不依赖网络或随机全局状态。

**Non-Goals:**

- 本期不实现真实行情撮合、因子计算或完整净值曲线。
- 不支持融资融券和多实验对比执行。

## Decisions

- **输入快照值对象**：使用 `date` 和 `Decimal`，避免浮点金额与时区歧义。
- **门禁先于结果**：创建 run 后先写 `backtest_requested`，任何失败转 error 并写 `backtest_rejected`，不生成指标。
- **确定性指标函数**：结果由快照字段和一个显式 `return_rate` 输入计算，后续真实引擎替换该函数但保留结果契约。

## Risks / Trade-offs

- [结果不是完整策略仿真] -> 明确标记为一期 runner contract，真实撮合单列 change。
- [错误运行也会创建 run] -> 这是审计要求；失败 run 保留输入快照和错误原因，便于重跑。
