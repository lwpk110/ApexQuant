## Why

回测页面虽然展示运行 ID、指标和成本字段，但核心层尚未生成可复现的回测快照。研究结果必须绑定策略版本、数据版本、成本模型、日期范围和随机种子，才能与运行记录和收益追溯契约一致。

## What Changes

- 增加不可变回测请求快照和结果指标模型。
- 增加确定性回测服务，校验日期范围、数据质量和版本字段后生成运行结果。
- 将回测运行状态和 provenance 写入既有 run/audit 仓储。
- 增加成功、数据门禁失败和输入非法的契约测试。

## Capabilities

### New Capabilities

- `reproducible-backtest`: 可复现回测快照、运行门禁和结果指标。

### Modified Capabilities

- `backtest-center`: 回测结果必须携带完整版本快照和运行状态。

## Impact

- 新增 `domain/backtest.py` 和 application runner，不接入真实行情或券商。
- 使用现有内存 run/audit/data 仓储，未来持久化适配器无需改变结果契约。
