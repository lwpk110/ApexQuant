## ADDED Requirements

### Requirement: Backend read models
HTTP API SHALL 为总览、数据目录和运行记录提供真实后端读模型，响应使用统一 data/error envelope。

#### Scenario: Overview read model
- **WHEN** 客户端 GET `/api/overview`
- **THEN** 返回市场报价、数据源、新鲜度、账户为模拟状态的摘要和运行摘要

#### Scenario: Catalog read model
- **WHEN** 客户端 GET `/api/data/catalog`
- **THEN** 返回至少一个真实行情数据集、覆盖范围、最后抓取时间、质量状态和许可证说明

#### Scenario: Runs read model
- **WHEN** 客户端 GET `/api/runs`
- **THEN** 返回当前进程创建的回测运行列表，字段包含 runId、状态、策略版本、数据版本和时间

### Requirement: Frontend API-only runtime data
前端页面 SHALL 从上述 API 加载运行时数据，不得在生产组件中导入 fixture 作为默认数据源。

#### Scenario: Loading and error states
- **WHEN** API 请求尚未完成或返回错误
- **THEN** 页面显示 loading 或可理解的错误状态，不显示伪造的市场数值
