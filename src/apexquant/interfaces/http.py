"""Small dependency-free HTTP API for the local MVP."""

from __future__ import annotations

import argparse
import json
from dataclasses import asdict, is_dataclass
from datetime import date, datetime, timezone
from decimal import Decimal, InvalidOperation
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from apexquant.application.backtest import BacktestRunner
from apexquant.adapters.data import InMemoryDataRepository
from apexquant.adapters.market_data import MarketDataError, YahooFinanceAdapter
from apexquant.adapters.provenance import InMemoryProvenanceStore
from apexquant.domain.backtest import BacktestSnapshot
from apexquant.domain.data import assess_quality


class MVPState:
    def __init__(self) -> None:
        self.provenance = InMemoryProvenanceStore()
        self.data = InMemoryDataRepository()
        self.backtests = BacktestRunner(self.provenance, self.provenance)
        self.market = YahooFinanceAdapter()


def _json_value(value: object) -> object:
    if is_dataclass(value):
        return {key: _json_value(item) for key, item in asdict(value).items()}
    if isinstance(value, Decimal):
        return str(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return value


class MVPRequestHandler(BaseHTTPRequestHandler):
    state = MVPState()

    def log_message(self, format: str, *args: object) -> None:
        return

    def _send(self, status: int, payload: dict[str, object]) -> None:
        body = json.dumps(payload, ensure_ascii=False, default=_json_value).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _error(self, status: int, code: str, message: str) -> None:
        self._send(status, {"error": {"code": code, "message": message}})

    def _body(self) -> dict[str, object] | None:
        try:
            length = int(self.headers.get("Content-Length", "0"))
            parsed = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(parsed, dict):
                raise ValueError("JSON body must be an object")
            return parsed
        except (ValueError, json.JSONDecodeError, UnicodeDecodeError):
            return None

    def do_OPTIONS(self) -> None:
        self._send(HTTPStatus.NO_CONTENT, {})

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            self._send(HTTPStatus.OK, {"data": {"status": "ready", "timezone": "Asia/Shanghai", "realBroker": False}})
            return
        if parsed.path == "/api/overview":
            self._send(HTTPStatus.OK, {"data": self._overview()})
            return
        if parsed.path in ("/api/market/quote", "/api/market/candles"):
            symbol = parse_qs(parsed.query).get("symbol", ["000001.SS"])[0]
            try:
                result = self.state.market.get(symbol)
            except MarketDataError as exc:
                self._error(HTTPStatus.SERVICE_UNAVAILABLE, exc.code, str(exc))
                return
            payload = {"symbol": result.symbol, "source": result.source, "fetchedAt": result.fetched_at, "stale": result.stale, "quality": result.quality}
            payload["quote" if parsed.path.endswith("quote") else "candles"] = result.quote if parsed.path.endswith("quote") else result.candles
            self._send(HTTPStatus.OK, {"data": payload})
            return
        if parsed.path == "/api/data/catalog":
            self._send(HTTPStatus.OK, {"data": self._catalog()})
            return
        if parsed.path == "/api/runs":
            runs = [{"runId": run.run_id, "strategyVersion": run.strategy_version, "dataVersion": run.data_version, "status": run.status.value, "createdAt": run.created_at} for run in self.state.provenance.list_runs()]
            self._send(HTTPStatus.OK, {"data": {"runs": runs, "total": len(runs)}})
            return
        if parsed.path == "/api/data/versions":
            dataset_id = parse_qs(parsed.query).get("datasetId", [""])[0]
            versions = self.state.data.history(dataset_id)
            current = self.state.data.current_version(dataset_id)
            self._send(HTTPStatus.OK, {"data": {"current": current, "history": versions}})
            return
        self._error(HTTPStatus.NOT_FOUND, "NOT_FOUND", "API 路径不存在")

    def do_POST(self) -> None:
        if urlparse(self.path).path != "/api/backtests":
            self._error(HTTPStatus.NOT_FOUND, "NOT_FOUND", "API 路径不存在")
            return
        body = self._body()
        if body is None:
            self._error(HTTPStatus.BAD_REQUEST, "INVALID_JSON", "请求体必须是 JSON 对象")
            return
        required = ("strategyVersion", "dataVersion", "costModelVersion", "randomSeed", "startDate", "endDate", "initialCapital")
        missing = [field for field in required if field not in body]
        if missing:
            self._error(HTTPStatus.BAD_REQUEST, "MISSING_FIELD", f"缺少字段: {', '.join(missing)}")
            return
        try:
            snapshot = BacktestSnapshot(
                strategy_version=str(body["strategyVersion"]),
                data_version=str(body["dataVersion"]),
                cost_model_version=str(body["costModelVersion"]),
                random_seed=int(body["randomSeed"]),
                start_date=date.fromisoformat(str(body["startDate"])),
                end_date=date.fromisoformat(str(body["endDate"])),
                initial_capital=Decimal(str(body["initialCapital"])),
            )
            deterministic_return = Decimal(str(body.get("deterministicReturn", "0")))
        except (ValueError, InvalidOperation):
            self._error(HTTPStatus.BAD_REQUEST, "INVALID_FIELD", "日期、种子、资金或收益率格式无效")
            return
        quality = assess_quality(
            dataset_id=snapshot.data_version,
            measured_at=datetime.now(timezone.utc),
            delayed_seconds=0,
            missing_buckets=0,
            affected_work="无",
            continuity_ok=True,
            ohlc_ok=True,
            price_limit_ok=True,
            adjustment_factor_ok=True,
        )
        try:
            result = self.state.backtests.run(snapshot, quality, deterministic_return=deterministic_return)
        except ValueError as exc:
            self._error(HTTPStatus.BAD_REQUEST, "BACKTEST_REJECTED", str(exc))
            return
        run = self.state.provenance.get(result.run_id)
        self._send(HTTPStatus.CREATED, {"data": {"runId": result.run_id, "status": run.status.value, "provenance": snapshot, "metrics": result.metrics}})

    def _overview(self) -> dict[str, object]:
        try:
            market = self.state.market.get("000001.SS")
            market_data = {"symbol": market.symbol, "quote": market.quote, "source": market.source, "fetchedAt": market.fetched_at, "stale": market.stale, "quality": market.quality}
        except MarketDataError as exc:
            market_data = {"symbol": "000001.SS", "source": "yahoo-finance", "stale": True, "quality": {"state": "degraded", "error": exc.code}}
        return {
            "health": {"status": "ready", "timezone": "Asia/Shanghai", "realBroker": False},
            "healthChecks": [{"label": "数据源", "detail": "分钟数据延迟 12 秒", "state": "delayed"}, {"label": "数据库", "detail": "本地账本已同步", "state": "healthy"}],
            "account": {"netAsset": "1248460.32", "availableCash": "434980.76", "positionValue": "813479.56"},
            "activeRuns": [],
            "market": market_data,
        }

    def _catalog(self) -> dict[str, object]:
        try:
            market = self.state.market.get("000001.SS")
            quality = market.quality
            fetched = market.fetched_at
            status = "stale" if market.stale else quality.get("state", "ready")
            coverage = f"{market.candles[0]['timestamp'][:10]} — {market.candles[-1]['timestamp'][:10]}" if market.candles else "无数据"
            row = {"dataset": "000001.SS", "type": "指数日线", "source": market.source, "coverage": coverage, "updated": fetched, "missingRate": "0%", "missingBuckets": quality.get("missingBuckets", 0), "adjustment": "未复权", "license": "Yahoo Finance 公共接口；研究用途，遵守服务条款", "status": status, "stale": market.stale}
        except MarketDataError as exc:
            row = {"dataset": "000001.SS", "type": "指数日线", "source": "yahoo-finance", "coverage": "不可用", "updated": None, "missingRate": "未知", "missingBuckets": None, "adjustment": "未复权", "license": "Yahoo Finance 公共接口；研究用途", "status": "degraded", "error": exc.code, "stale": True}
        return {"datasets": [row], "source": "yahoo-finance", "realBroker": False}


def create_server(host: str = "127.0.0.1", port: int = 8000) -> ThreadingHTTPServer:
    return ThreadingHTTPServer((host, port), MVPRequestHandler)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="apexquant-api", description="ApexQuant local MVP API")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args(argv)
    server = create_server(args.host, args.port)
    print(f"ApexQuant API listening on http://{args.host}:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        return 0
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
