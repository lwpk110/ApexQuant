## MODIFIED Requirements

### Requirement: Data center
数据中心 SHALL 展示后端真实数据目录、质量结果和版本信息，并标记公共数据源的使用限制。

#### Scenario: Catalog loads
- **WHEN** 页面请求 `/api/data/catalog`
- **THEN** 表格使用 API 数据渲染，显示 source、coverage、quality 和 license

#### Scenario: Catalog unavailable
- **WHEN** API 返回错误
- **THEN** 页面显示错误状态且不渲染 fixture 行
