## Why

一期页面已经展示运行 ID 和审计时间线，但 Python 核心层没有可复用的运行快照、审计事件或配置版本契约。没有这条基础链路，回测、数据同步和模拟执行无法证明结果来自哪一组版本化输入，也无法安全地重跑失败任务。

## What Changes

- 增加不可变的运行快照模型，记录策略版本、数据版本、成本模型和随机种子。
- 增加带顺序和时间的审计事件模型，支持按运行 ID 读取完整链路。
- 增加配置版本模型，保存新配置时生成新版本而不修改历史运行快照。
- 提供内存端口实现，供本地原型、CLI 和后续持久化适配器共享。
- 为创建运行、追加事件、读取链路和版本化配置增加单元测试。

## Capabilities

### New Capabilities

- `run-provenance`: 运行快照和跨模块审计链的创建、读取与不可变性。
- `configuration-versioning`: 配置版本的创建、当前版本读取和历史版本保留。

### Modified Capabilities

- `run-records`: 运行记录必须携带完整 provenance，并允许按 run ID 返回有序审计事件。

## Impact

- 影响 `src/apexquant/domain`、`application/ports.py` 和 `adapters` 的公共 Python 契约。
- 不引入数据库或网络依赖；现阶段使用内存适配器，后续可实现相同协议的持久化适配器。
- Web 原型继续使用本地 fixture，不改变真实券商关闭的安全边界。
