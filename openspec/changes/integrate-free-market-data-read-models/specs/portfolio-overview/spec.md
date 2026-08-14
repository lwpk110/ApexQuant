## MODIFIED Requirements

### Requirement: Portfolio overview
总览 SHALL 展示来自后端 API 的健康、行情新鲜度、模拟账户摘要和运行信息，并明确数据源与 stale/degraded 状态。

#### Scenario: Fresh overview
- **WHEN** 后端成功读取行情
- **THEN** 总览渲染 API 返回的数值并显示来源和抓取时间

#### Scenario: Degraded overview
- **WHEN** 行情源不可用
- **THEN** 总览显示 degraded/stale 警示，不使用本地 fixture 替代
