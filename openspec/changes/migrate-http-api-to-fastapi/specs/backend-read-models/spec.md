## MODIFIED Requirements

### Requirement: Backend read models
HTTP API SHALL 为总览、数据目录和运行记录提供真实后端读模型，响应使用统一 data/error envelope。

#### Scenario: FastAPI read model compatibility
- **WHEN** 客户端通过 FastAPI app 请求现有读模型路径
- **THEN** 返回字段和 envelope 与迁移前兼容
