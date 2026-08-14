## Why

当前 API 使用标准库 `http.server`，路由、解析、错误处理和 CORS 全部手写，走查后维护性和契约可发现性不足。迁移到 FastAPI 可以提供类型校验、OpenAPI 文档、统一异常处理和可测试的 ASGI 应用，同时保持现有前端 API 兼容。

## What Changes

- 用 FastAPI/Starlette 重建现有 `/api/*` 路由和 JSON envelope。
- 用 Pydantic 请求/响应模型替换手写 body 解析和字段校验。
- 增加 `/docs`、`/openapi.json`，统一 404/422/业务异常格式。
- 使用 Uvicorn 启动 ASGI 服务，保留 host/port CLI 参数。
- 保持真实行情、回测、运行记录和 `realBroker=false` 行为不变。

## Capabilities

### New Capabilities
- `fastapi-http-service`: FastAPI ASGI 服务、模型校验、OpenAPI 和统一错误响应。

### Modified Capabilities
- `backend-read-models`: 现有 API 路径和 envelope 在 FastAPI 实现下保持兼容。

## Impact

影响 `pyproject.toml`、`src/apexquant/interfaces/http.py`、HTTP 测试、启动文档和运行依赖；前端 API 路径无需修改。新增 `fastapi`、`uvicorn` 运行依赖。
