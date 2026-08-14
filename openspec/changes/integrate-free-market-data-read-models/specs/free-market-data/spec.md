## ADDED Requirements

### Requirement: Free market data adapter
系统 SHALL 通过无密钥公共行情源读取指定标的的最新报价和日线 OHLCV，并返回来源、抓取时间和质量状态。

#### Scenario: Quote is available
- **WHEN** 请求一个受支持的 Yahoo Finance symbol 且上游在超时内返回有效 JSON
- **THEN** 系统返回价格、涨跌、成交量、`source= yahoo-finance`、`stale=false` 和 `fetchedAt`

#### Scenario: Upstream failure with cache
- **WHEN** 上游请求失败但存在未过期或最近缓存
- **THEN** 系统返回缓存数据并将 `stale` 标记为 true，同时包含失败原因

#### Scenario: Upstream failure without cache
- **WHEN** 上游请求失败且不存在缓存
- **THEN** API 返回 HTTP 503 和结构化错误，不返回 fixture 或伪造行情

### Requirement: Data quality metadata
适配器 SHALL 校验时间序列的时间升序、OHLC 数值关系和缺失区间，并在读模型中报告质量结果。

#### Scenario: Valid candles
- **WHEN** 返回的 K 线通过连续性和 OHLC 校验
- **THEN** 质量状态为 `ready` 且缺失桶数为 0

#### Scenario: Invalid candles
- **WHEN** 返回数据存在逆序、负价格或 high/low 关系错误
- **THEN** 质量状态为 `blocked` 并说明原因
