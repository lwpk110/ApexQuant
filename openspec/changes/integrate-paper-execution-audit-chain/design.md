## Context

`PaperExecutionService` 当前只调用 `RiskGate` 并生成订单 ID；运行 ID 是请求字段，但没有对应的 `RunRecord` 或审计写入。上一 change 提供了 `RunRepository` 和 `AuditRepository`，本 change 负责把它们接入用例边界。

## Goals / Non-Goals

**Goals:**

- 提供一个显式 `evaluate_order_with_provenance` 用例，返回 run ID、order ID、风控结果和事件。
- 让事件顺序稳定为 signal -> risk_decision -> order（仅允许订单）。
- 任何审计或仓储失败都不发送真实委托；系统仍是 paper-only。

**Non-Goals:**

- 本期不实现成交、记账或部分成交状态机。
- 不改变已有 `evaluate_order` 的返回结构和调用者。

## Decisions

- **可选依赖而非破坏构造器**：`RunRepository`、`AuditRepository` 通过新方法参数注入，保留旧构造方式，便于逐步迁移。
- **工作流拥有状态转换**：工作流创建 pending run 后立即转 running；允许结果转 completed，拒绝转 error。
- **拒单不创建订单事件**：风控拒绝只写 risk_decision 事件，避免审计误报“已提交”。
- **共享时钟**：一次调用使用同一 UTC 时间戳写入评估结果和事件，避免时间线倒序。

## Risks / Trade-offs

- [仓储写入失败导致运行状态不完整] -> 先写 signal/risk 事件，再执行任何订单提交；异常向上抛出且不调用 PaperOrderSink。
- [调用者传入的 request.run_id 与新运行 ID 不一致] -> 新工作流以创建的 run ID 覆盖上下文，旧 API 仍按请求保留兼容行为。

## Migration Plan

先合并兼容工作流和测试，再由 Web/API 入口改用新方法；旧 `evaluate_order` 可在迁移完成前继续使用。
