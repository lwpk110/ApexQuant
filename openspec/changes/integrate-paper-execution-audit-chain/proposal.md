## Why

运行 provenance 已有基础仓储，但模拟订单评估仍是无状态函数，无法把信号、风控判定和订单结果写入同一运行 ID。现在接通这条链路，后续 Web、回测和记账模块才能复用一致的执行审计契约。

## What Changes

- 增加带 provenance 的模拟执行工作流，创建并启动运行快照。
- 评估订单前记录信号事件，评估后记录通过或拒绝的风控事件。
- 通过风险门禁的订单记录模拟委托事件并返回运行上下文；拒绝时运行进入 error 且不提交订单。
- 保持现有无仓储 `evaluate_order` API 可用，依赖通过可选端口注入。

## Capabilities

### New Capabilities

- `paper-execution-workflow`: 带运行快照和审计事件的模拟订单评估流程。

### Modified Capabilities

- `simulation-execution`: 信号、风控和委托事件必须由应用工作流按同一 run ID 产生。

## Impact

- 修改 `PaperExecutionService` 和 application 端口使用方式，新增应用结果字段。
- 仅使用现有内存 provenance 适配器，不引入网络、数据库或真实柜台依赖。
- 为拒单路径增加明确状态和审计证据，Web fixture 不受影响。
