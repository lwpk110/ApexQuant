## Context

控制室目前由 Python 标准库 HTTP 服务和 React/Vite 前端组成，页面主体使用 fixture。运行环境不能假定 API key、数据库或商业行情 SDK。目标是提供可审计的免费行情读模型，同时保证上游故障不会变成虚假实时数据。

## Goals / Non-Goals

**Goals:**
- 通过 Yahoo Finance chart JSON 获取少量 A 股/指数报价与日线数据。
- 使用标准库实现超时、内存缓存、限流和质量状态。
- 让总览、数据中心、运行记录只通过后端 API 获取运行时数据。

**Non-Goals:**
- 不接入真实券商、下单、账户余额或商业级实时行情。
- 不承诺 Yahoo 数据的交易级 SLA，不绕过其服务限制。
- 不在本变更中建设持久化数据库。

## Decisions

- **数据源**：Yahoo Finance chart endpoint；无需 token，覆盖 `000001.SS`、`600519.SS` 等示例标的。相比引入 AkShare/BaoStock，标准库部署更轻且不增加依赖许可风险。
- **访问层**：新增 `YahooFinanceAdapter`，用 `urllib.request` 设置 User-Agent、5 秒超时，并按 `(symbol, interval)` 缓存 60 秒；失败返回带错误码的 degraded 结果。
- **读模型**：HTTP 层暴露 `/api/market/quote`、`/api/market/candles`、`/api/overview`、`/api/data/catalog`、`/api/runs`。响应统一 `{data: ...}`，包含 `source`, `fetchedAt`, `stale`, `quality`。
- **前端边界**：新增 `getOverview/getCatalog/getRuns` API client；页面加载/刷新期间显示 loading/error，成功后只渲染 API 数据。fixture 仅保留测试导入，不被页面运行时导入。
- **回退策略**：上游失败时返回最近缓存（标记 `stale: true`）；无缓存返回 503 和可操作错误，绝不填充随机或演示行情。

## Risks / Trade-offs

- [上游限流或字段变化] -> 严格超时、缓存、响应 schema 校验和 degraded 状态；文档说明仅适合研究。
- [无持久化导致重启丢缓存/运行记录] -> 保留现有内存语义，在后续变更引入 SQLite。
- [页面依赖旧 fixture 字段] -> 读模型保持现有展示字段的最小兼容映射，并为 API 响应补充来源和新鲜度。

## Migration Plan

先部署后端适配器和只读 API，再逐页切换前端；旧 fixture 文件暂不删除，作为单元测试数据。若上游异常可通过环境变量禁用远程抓取并显示 degraded 状态，回滚只需恢复前端旧版本。

## Open Questions

- 后续是否需要将 Yahoo 标的映射扩展到完整 A 股列表。
- 是否在下一期引入 SQLite 保存抓取快照和运行记录。
