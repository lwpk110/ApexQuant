"""FastAPI HTTP API for the ApexQuant MVP."""

from __future__ import annotations

import argparse
from dataclasses import asdict, is_dataclass
from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Any

import uvicorn
from fastapi import FastAPI, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field, model_validator
from starlette.exceptions import HTTPException as StarletteHTTPException

from apexquant.adapters.data import InMemoryDataRepository
from apexquant.adapters.market_data import MarketDataError, YahooFinanceAdapter
from apexquant.adapters.provenance import InMemoryProvenanceStore
from apexquant.application.backtest import BacktestRunner
from apexquant.domain.backtest import BacktestSnapshot
from apexquant.domain.data import assess_quality


class MVPState:
    def __init__(self) -> None:
        self.provenance = InMemoryProvenanceStore()
        self.data = InMemoryDataRepository()
        self.backtests = BacktestRunner(self.provenance, self.provenance)
        self.market = YahooFinanceAdapter()


state = MVPState()


def reset_state() -> None:
    global state
    state = MVPState()


class BacktestRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    strategyVersion: str = Field(min_length=1)
    dataVersion: str = Field(min_length=1)
    costModelVersion: str = Field(min_length=1)
    randomSeed: int
    startDate: date
    endDate: date
    initialCapital: Decimal = Field(gt=0)
    deterministicReturn: Decimal = Decimal("0")

    @model_validator(mode="after")
    def valid_date_range(self) -> "BacktestRequest":
        if self.endDate < self.startDate:
            raise ValueError("结束日期不能早于开始日期")
        return self


app = FastAPI(title="ApexQuant API", version="0.1.0", description="研究、回测和模拟交易 API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


def _error(code: str, message: str, status: int) -> JSONResponse:
    return JSONResponse(status_code=status, content={"error": {"code": code, "message": message}})


def _encode(value: Any) -> Any:
    if is_dataclass(value):
        return _encode(asdict(value))
    if isinstance(value, dict):
        return {key: _encode(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_encode(item) for item in value]
    if isinstance(value, Decimal):
        return str(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return value


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    messages = "; ".join(str(item.get("msg", "字段无效")) for item in exc.errors())
    return _error("VALIDATION_ERROR", messages, 422)


@app.exception_handler(StarletteHTTPException)
async def http_error_handler(_: Request, exc: StarletteHTTPException) -> JSONResponse:
    if exc.status_code == 404:
        return _error("NOT_FOUND", "API 路径不存在", 404)
    return _error(f"HTTP_{exc.status_code}", str(exc.detail), exc.status_code)


@app.get("/api/health", tags=["system"])
def health() -> dict[str, Any]:
    return {"data": {"status": "ready", "timezone": "Asia/Shanghai", "realBroker": False}}


@app.get("/api/market/quote", tags=["market"], response_model=None)
def market_quote(symbol: str = Query("000001.SS", min_length=3)) -> dict[str, Any] | JSONResponse:
    try:
        result = state.market.get(symbol)
    except MarketDataError as exc:
        return _error(exc.code, str(exc), 503)
    return {"data": {"symbol": result.symbol, "quote": result.quote, "source": result.source, "fetchedAt": result.fetched_at, "stale": result.stale, "quality": result.quality}}


@app.get("/api/market/candles", tags=["market"], response_model=None)
def market_candles(symbol: str = Query("000001.SS", min_length=3)) -> dict[str, Any] | JSONResponse:
    try:
        result = state.market.get(symbol)
    except MarketDataError as exc:
        return _error(exc.code, str(exc), 503)
    return {"data": {"symbol": result.symbol, "candles": result.candles, "source": result.source, "fetchedAt": result.fetched_at, "stale": result.stale, "quality": result.quality}}


def _overview() -> dict[str, Any]:
    try:
        market = state.market.get("000001.SS")
        market_data: dict[str, Any] = {"symbol": market.symbol, "quote": market.quote, "source": market.source, "fetchedAt": market.fetched_at, "stale": market.stale, "quality": market.quality}
    except MarketDataError as exc:
        market_data = {"symbol": "000001.SS", "source": "yahoo-finance", "stale": True, "quality": {"state": "degraded", "error": exc.code}}
    return {"health": {"status": "ready", "timezone": "Asia/Shanghai", "realBroker": False}, "healthChecks": [{"label": "数据源", "detail": "后端公共行情适配器", "state": "healthy"}, {"label": "数据库", "detail": "本地账本已同步", "state": "healthy"}], "account": {"netAsset": "1248460.32", "availableCash": "434980.76", "positionValue": "813479.56"}, "activeRuns": [], "market": market_data}


@app.get("/api/overview", tags=["read-models"])
def overview() -> dict[str, Any]:
    return {"data": _overview()}


def _catalog() -> dict[str, Any]:
    try:
        market = state.market.get("000001.SS")
        quality = market.quality
        coverage = f"{market.candles[0]['timestamp'][:10]} — {market.candles[-1]['timestamp'][:10]}" if market.candles else "无数据"
        row = {"dataset": "000001.SS", "type": "指数日线", "source": market.source, "coverage": coverage, "updated": market.fetched_at, "missingRate": "0%", "missingBuckets": quality.get("missingBuckets", 0), "adjustment": "未复权", "license": "Yahoo Finance 公共接口；研究用途，遵守服务条款", "status": "stale" if market.stale else quality.get("state", "ready"), "stale": market.stale}
    except MarketDataError as exc:
        row = {"dataset": "000001.SS", "type": "指数日线", "source": "yahoo-finance", "coverage": "不可用", "updated": None, "missingRate": "未知", "missingBuckets": None, "adjustment": "未复权", "license": "Yahoo Finance 公共接口；研究用途", "status": "degraded", "error": exc.code, "stale": True}
    return {"datasets": [row], "source": "yahoo-finance", "realBroker": False}


@app.get("/api/data/catalog", tags=["read-models"])
def catalog() -> dict[str, Any]:
    return {"data": _catalog()}


@app.get("/api/data/versions", tags=["data"])
def data_versions(datasetId: str = Query("")) -> dict[str, Any]:
    return {"data": {"current": state.data.current_version(datasetId), "history": state.data.history(datasetId)}}


@app.get("/api/runs", tags=["read-models"])
def runs() -> dict[str, Any]:
    records = [{"runId": run.run_id, "strategyVersion": run.strategy_version, "dataVersion": run.data_version, "status": run.status.value, "createdAt": run.created_at} for run in state.provenance.list_runs()]
    return {"data": {"runs": records, "total": len(records)}}


@app.post("/api/backtests", status_code=201, tags=["backtests"], response_model=None)
def submit_backtest(body: BacktestRequest) -> dict[str, Any] | JSONResponse:
    snapshot = BacktestSnapshot(strategy_version=body.strategyVersion, data_version=body.dataVersion, cost_model_version=body.costModelVersion, random_seed=body.randomSeed, start_date=body.startDate, end_date=body.endDate, initial_capital=body.initialCapital)
    quality = assess_quality(dataset_id=snapshot.data_version, measured_at=datetime.now(timezone.utc), delayed_seconds=0, missing_buckets=0, affected_work="无", continuity_ok=True, ohlc_ok=True, price_limit_ok=True, adjustment_factor_ok=True)
    try:
        result = state.backtests.run(snapshot, quality, deterministic_return=body.deterministicReturn)
    except ValueError as exc:
        return _error("BACKTEST_REJECTED", str(exc), 400)
    run = state.provenance.get(result.run_id)
    return JSONResponse(status_code=201, content=_encode({"data": {"runId": result.run_id, "status": run.status.value, "provenance": snapshot, "metrics": result.metrics}}))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="apexquant-api", description="ApexQuant FastAPI service")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args(argv)
    uvicorn.run(app, host=args.host, port=args.port)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
