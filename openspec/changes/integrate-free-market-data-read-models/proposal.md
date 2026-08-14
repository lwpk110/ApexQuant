## Why

当前控制室主体依赖本地 fixture，用户看到的行情、账户和数据质量并不来自可验证的数据源，无法用于真实研究迭代。需要先接入一个无需密钥、可公开访问的免费行情源，并让后端提供稳定的读模型，前端只消费 API。

## What Changes

- 新增 Yahoo Finance chart 公共接口适配器，获取指数/股票的最新报价和日线 OHLCV。
- 新增市场数据、数据集清单、总览和运行记录 API 读模型；上游不可用时返回明确的 stale/degraded 状态，而不是伪造行情。
- 前端总览、数据中心、运行记录改为加载后端数据，移除运行时 fixture 依赖。
- 增加缓存、超时、请求间隔和数据质量检查，保留真实券商关闭状态。
- 完善使用文档，说明数据源、许可、限流和离线行为。

## Capabilities

### New Capabilities
- `free-market-data`: 通过无密钥公共数据源读取行情、质量状态和缓存元数据。
- `backend-read-models`: 为控制室页面提供真实数据 API 读模型。

### Modified Capabilities
- `portfolio-overview`: 总览数据必须来自后端市场数据读模型，并标示新鲜度和降级状态。
- `data-quality-center`: 数据集清单和质量结果反映真实抓取结果。
- `run-records`: 运行记录由后端返回，包含真实 API 创建的运行。

## Impact

影响 `src/apexquant/adapters`、`src/apexquant/interfaces/http.py`、前端 API client 与三个页面、测试和 MVP 文档。运行时新增 Python 标准库网络访问，不引入必需的第三方服务或真实交易依赖。
