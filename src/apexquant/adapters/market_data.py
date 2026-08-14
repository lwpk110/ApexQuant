"""Small, dependency-free Yahoo Finance market data adapter."""

from __future__ import annotations

import json
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from urllib.parse import quote
from urllib.request import Request, urlopen


class MarketDataError(RuntimeError):
    def __init__(self, message: str, *, code: str = "MARKET_DATA_UNAVAILABLE") -> None:
        super().__init__(message)
        self.code = code


@dataclass(frozen=True, slots=True)
class MarketResult:
    symbol: str
    quote: dict[str, object]
    candles: tuple[dict[str, object], ...]
    source: str
    fetched_at: datetime
    stale: bool
    quality: dict[str, object]


class YahooFinanceAdapter:
    source = "yahoo-finance"
    _allowed_suffixes = (".SS", ".SZ", ".HK")

    def __init__(self, *, ttl_seconds: int = 60, timeout_seconds: float = 5.0) -> None:
        self.ttl_seconds = ttl_seconds
        self.timeout_seconds = timeout_seconds
        self._cache: dict[tuple[str, str], tuple[float, MarketResult]] = {}

    def _fetch(self, symbol: str, period: str = "5d", interval: str = "1d") -> dict[str, object]:
        if not symbol or not symbol.endswith(self._allowed_suffixes):
            raise MarketDataError("仅支持 .SS/.SZ/.HK 公共市场代码", code="UNSUPPORTED_SYMBOL")
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{quote(symbol)}?range={period}&interval={interval}&events=div%2Csplits"
        request = Request(url, headers={"User-Agent": "ApexQuant/0.1 research-client"})
        try:
            with urlopen(request, timeout=self.timeout_seconds) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except Exception as exc:  # network/library errors are exposed as a stable domain error
            raise MarketDataError(f"Yahoo Finance 请求失败: {exc}") from exc
        chart = payload.get("chart", {})
        if chart.get("error") or not chart.get("result"):
            raise MarketDataError("Yahoo Finance 未返回有效行情", code="INVALID_UPSTREAM_RESPONSE")
        return chart["result"][0]

    @staticmethod
    def _quality(candles: tuple[dict[str, object], ...]) -> dict[str, object]:
        ordered = all(candles[i]["timestamp"] < candles[i + 1]["timestamp"] for i in range(len(candles) - 1))
        ohlc_ok = all(c["low"] <= min(c["open"], c["close"]) <= max(c["open"], c["close"]) <= c["high"] for c in candles)
        return {"state": "ready" if ordered and ohlc_ok else "blocked", "missingBuckets": 0, "ordered": ordered, "ohlcOk": ohlc_ok}

    def get(self, symbol: str, *, period: str = "1mo", interval: str = "1d") -> MarketResult:
        key = (symbol, interval)
        now = time.monotonic()
        cached = self._cache.get(key)
        if cached and now - cached[0] < self.ttl_seconds:
            return cached[1]
        try:
            result = self._fetch(symbol, period, interval)
            timestamps = result.get("timestamp") or []
            quote = (result.get("indicators") or {}).get("quote", [{}])[0]
            candles = tuple(
                {"timestamp": datetime.fromtimestamp(ts, timezone.utc).isoformat(), "open": float(o), "high": float(h), "low": float(l), "close": float(c), "volume": int(v or 0)}
                for ts, o, h, l, c, v in zip(timestamps, quote.get("open", []), quote.get("high", []), quote.get("low", []), quote.get("close", []), quote.get("volume", []))
                if None not in (o, h, l, c)
            )
            meta = result.get("meta", {})
            last = candles[-1] if candles else None
            previous = candles[-2] if len(candles) > 1 else None
            price = float(meta.get("regularMarketPrice") or (last["close"] if last else 0))
            previous_close = float(meta.get("previousClose") or (previous["close"] if previous else price))
            data = MarketResult(symbol, {"price": price, "previousClose": previous_close, "change": price - previous_close, "changePercent": ((price / previous_close - 1) * 100) if previous_close else 0, "currency": meta.get("currency", "CNY")}, candles, self.source, datetime.now(timezone.utc), False, self._quality(candles))
            self._cache[key] = (now, data)
            return data
        except MarketDataError:
            if cached:
                old = cached[1]
                return MarketResult(old.symbol, old.quote, old.candles, old.source, old.fetched_at, True, {**old.quality, "state": "stale"})
            raise
