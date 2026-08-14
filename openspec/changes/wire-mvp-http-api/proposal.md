## Why

当前 Web 控制室只能展示 fixture，无法读取 Python 的运行、数据质量和回测能力；用户无法真正验证“前后端对接”。MVP 需要一个可启动、可测试、无额外服务依赖的 HTTP 边界。

## What Changes

- 增加标准库 HTTP API 服务，提供健康状态、总览摘要、数据版本和回测运行接口。
- 统一 JSON 错误格式、CORS 和 UTC 时间序列化。
- 前端通过 API 读取全局健康状态，并把回测提交按钮接到后端；API 不可用时显示明确降级提示而非白屏。
- 增加 API 单元测试和前端联调 mock 测试。

## Capabilities

### New Capabilities

- `mvp-http-api`: 本地 MVP HTTP API 和前端数据边界。

### Modified Capabilities

- `control-room-shell`: 顶部健康状态从 API 读取并支持离线降级。
- `backtest-center`: 回测提交动作调用 API 并展示真实运行 ID/状态。

## Impact

- 新增 `interfaces/http.py` 和前端 `api.ts`，不引入 FastAPI 或数据库依赖。
- 现有 fixture 继续作为 API 不可用时的展示后备，保持页面可操作。
