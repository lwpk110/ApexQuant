## Context

现有服务由 `MVPRequestHandler` 处理所有请求，状态对象可继续复用。迁移必须保持 `/api/health`、`/api/overview`、市场数据、目录、版本、运行记录和回测提交的响应结构。

## Goals / Non-Goals

**Goals:**
- 建立可导入、可测试的 `FastAPI` app。
- 通过 Pydantic 校验回测请求，输出稳定的错误 envelope。
- 保持 CORS、内存状态和真实券商关闭语义。

**Non-Goals:**
- 本变更不引入数据库、认证或真实交易。
- 不改变领域服务、行情适配器或前端业务模型。

## Decisions

- 使用 `FastAPI()` 和 `CORSMiddleware`；路由函数调用现有 `MVPState` 服务。
- 请求模型使用日期、Decimal 和字段约束；业务拒绝仍映射为 400，Pydantic 422 转为 `{error:{code,message}}`。
- `main()` 调用 `uvicorn.run(app, host, port)`；开发和生产文档统一该命令。
- 移除 `MVPRequestHandler`/`create_server`，HTTP 测试直接使用 FastAPI TestClient。

## Risks / Trade-offs

- [新增依赖安装失败] -> 锁定最低版本并在安装/CI 文档中明确依赖。
- [422 响应格式变化] -> 注册全局 RequestValidationError handler 保持 envelope。
- [旧测试依赖 HTTPServer] -> 用 FastAPI TestClient API 测试替换旧测试。
