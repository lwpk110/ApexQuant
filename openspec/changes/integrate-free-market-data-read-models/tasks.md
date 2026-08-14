## 1. Market Data Adapter

- [x] 1.1 Implement Yahoo Finance chart adapter with timeout, User-Agent, symbol validation and in-memory TTL cache
- [x] 1.2 Add quote/candle parsing and deterministic quality checks for ordering, OHLC relationships and gaps
- [x] 1.3 Add adapter unit tests covering fresh, stale-cache and no-cache failure paths

## 2. Backend Read Models

- [x] 2.1 Extend MVP state to retain market adapter and completed run records
- [x] 2.2 Add `/api/market/quote`, `/api/market/candles`, `/api/data/catalog` and `/api/runs` endpoints
- [x] 2.3 Rebuild `/api/overview` from live quote/read models with stale/degraded metadata
- [x] 2.4 Add HTTP tests for success, structured 503 errors and run list refresh

## 3. Frontend API Integration

- [x] 3.1 Extend API client types and functions for overview, catalog and runs
- [x] 3.2 Replace OverviewPage fixture imports with API loading, error and source freshness states
- [x] 3.3 Replace DataPage fixture rows with catalog API data and server quality metadata
- [x] 3.4 Replace RunsPage fixture tasks with runs API data and refresh after backtest submission
- [ ] 3.5 Update frontend tests to mock API module boundaries rather than runtime fixtures

## 4. Documentation and Verification

- [x] 4.1 Document Yahoo Finance source, usage limits, symbol configuration and degraded behavior
- [x] 4.2 Run backend/frontend test suites, build, and live API smoke checks against internet data
- [ ] 4.3 Verify no production page imports fixture modules and update data-boundary statements
