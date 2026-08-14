## Context

当前数据中心只在 React fixture 中展示质量和版本，Python 层没有数据版本对象。研究运行必须能引用一个不会被补数覆盖的版本，因此需要将同步任务和版本记录分开建模。

## Goals / Non-Goals

**Goals:**

- 质量报告同时表达延迟、缺失桶、受影响工作和时间连续性/OHLC/涨跌停/复权因子检查。
- 同步任务只能按 pending -> running -> completed/canceled/error 前进。
- 完成生成新的不可变版本；取消保留当前版本和可查询的取消日志。

**Non-Goals:**

- 本期不下载行情、不解析供应商格式、不做数据库持久化。
- 不在质量层决定策略是否可运行；该门禁由后续应用服务消费报告。

## Decisions

- **报告使用值对象**：`QualityCheck` 和 `DataQualityReport` 为 frozen dataclass，避免 UI 或适配器修改历史结果。
- **同步与版本分离**：`SyncTask` 记录操作状态，`DataVersion` 只在 complete 时创建；cancel 永远不改变 current。
- **仓储按 dataset 隔离**：current/history/task 查询均带 dataset ID，防止跨数据集污染版本链。

## Risks / Trade-offs

- [内存重启丢失任务] -> 当前是本地原型边界；后续持久化适配器复用相同协议。
- [质量规则输入由调用方提供] -> 契约测试固定四项检查名称和状态，真实采集器后续接入。
