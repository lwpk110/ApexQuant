## Context

Python 包目前只有 CLI；前端 Vite 独立运行，所有页面在组件内使用 fixture。MVP 需要一个开发环境可直接启动的后端，不应因为尚未选定 Web 框架而阻塞联调。

## Goals / Non-Goals

**Goals:**

- 用 `ThreadingHTTPServer` 提供稳定的 `/api/*` JSON 契约。
- 复用现有 `InMemoryProvenanceStore`、`InMemoryDataRepository` 和 `BacktestRunner`。
- 前端 API 客户端处理 loading、成功和网络失败三种状态。

**Non-Goals:**

- 不做认证、生产部署、持久化、真实行情或真实委托。
- 不在本 change 重写八个页面的 fixture。

## Decisions

- **标准库 HTTP**：避免新增依赖，确保 `python -m apexquant.interfaces.http` 在当前环境直接运行。
- **资源导向端点**：`GET /api/health`、`GET /api/overview`、`GET /api/data/versions`、`POST /api/backtests`，后续模块可按同一风格扩展。
- **API 响应包络**：成功返回 `{data: ...}`，错误返回 `{error: {code, message}}`，前端不解析 HTML 错误页。
- **前端降级**：API 失败保留 fixture 页面并显示“后端未连接”，避免 MVP 因后端短暂重启白屏。

## Risks / Trade-offs

- [内存状态随进程丢失] -> API 明确标记 local MVP，运行快照后续接持久化适配器。
- [标准库路由能力有限] -> 端点数量保持小且显式，生产 API 框架另列 change。
