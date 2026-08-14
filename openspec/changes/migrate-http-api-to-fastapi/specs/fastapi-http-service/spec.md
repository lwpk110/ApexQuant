## ADDED Requirements

### Requirement: FastAPI ASGI application
系统 SHALL 提供可导入的 FastAPI `app`，并通过 Uvicorn 启动 HTTP 服务。

#### Scenario: OpenAPI is available
- **WHEN** 客户端 GET `/docs` 或 `/openapi.json`
- **THEN** 服务返回 FastAPI 文档或 OpenAPI schema，且包含 `/api/health` 和 `/api/backtests`

#### Scenario: Health endpoint compatibility
- **WHEN** 客户端 GET `/api/health`
- **THEN** 返回现有 `{data:{status,timezone,realBroker}}` envelope

### Requirement: Typed request validation
回测接口 SHALL 使用类型模型校验必填字段、日期范围、资金和收益率，并统一返回结构化错误。

#### Scenario: Missing field
- **WHEN** POST `/api/backtests` 缺少必填字段
- **THEN** 返回 HTTP 422，错误 code 为 `VALIDATION_ERROR`

#### Scenario: Valid submission
- **WHEN** 请求通过模型校验且领域回测成功
- **THEN** 返回 HTTP 201 和现有 runId、provenance、metrics 字段

### Requirement: CORS and API errors
服务 SHALL 允许本地前端跨域访问，并将未知路径和校验错误返回 JSON envelope。

#### Scenario: Unknown path
- **WHEN** GET 未知 `/api/*` 路径
- **THEN** 返回 HTTP 404 和 `error.code=NOT_FOUND`
