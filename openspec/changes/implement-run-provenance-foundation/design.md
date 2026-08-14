## Context

当前应用服务只返回一次性风控结果，运行记录和审计事件仍停留在 Web fixture。回测、数据同步、模拟执行会共享同一组版本字段，因此需要一个不依赖数据库的稳定端口，先让领域和应用测试可以锁定行为。

## Goals / Non-Goals

**Goals:**

- 用不可变 dataclass 表达运行快照、审计事件和配置版本。
- 用内存仓储实现创建、读取、追加和版本切换，保证测试可重复。
- 让应用层只依赖 Protocol，后续 SQLite/API 适配器可替换实现。

**Non-Goals:**

- 本期不引入数据库迁移、HTTP API、认证或真实券商连接。
- 不修改现有 Web fixture 的视觉和交互行为。

## Decisions

- **版本化快照而非可变引用**：`RunRecord` 在创建时复制策略、数据、成本和随机种子；历史运行只读，避免配置更新改变过去结果。
- **事件序号由仓储分配**：`AuditEvent.sequence` 从 1 开始按 run ID 单调递增，调用方不可信输入序号，读取时按序号排序。
- **协议位于 application**：`RunRepository`、`AuditRepository`、`ConfigurationRepository` 定义最小操作，内存实现放在 adapters，避免领域层依赖存储。
- **显式状态转换**：运行只能按 `pending -> running -> completed|canceled|error` 推进；非法回退抛出 `ValueError`，防止审计链与状态脱节。

## Risks / Trade-offs

- [内存数据进程重启丢失] → 这是本期明确边界；后续持久化适配器必须遵守相同协议和不可变约束。
- [并发追加事件] → 内存实现使用单实例锁保护序号分配；持久化实现需使用事务或数据库序列。
- [跨模块字段命名不一致] → 规格固定 snake_case 字段和版本 ID 格式，契约测试覆盖。

## Migration Plan

先合并领域模型、端口和内存适配器，再由后续 change 接入 PaperExecutionService 和 Web API。回滚只需移除新适配器，不影响现有风险门禁。

## Open Questions

- 持久化落地时选择 SQLite 还是 PostgreSQL，由接入部署环境的后续 change 决定。
