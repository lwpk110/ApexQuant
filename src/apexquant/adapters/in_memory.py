"""In-memory fixtures used by local development and tests."""

from datetime import datetime, timezone
from decimal import Decimal

from apexquant.domain.models import AccountSnapshot, MarketSnapshot


def demo_account() -> AccountSnapshot:
    return AccountSnapshot(captured_at=datetime.now(timezone.utc), net_asset=Decimal("1000000"), available_cash=Decimal("1000000"))


def demo_market(symbol: str = "600519.SH") -> MarketSnapshot:
    return MarketSnapshot(symbol=symbol, latest_price=Decimal("1700"), observed_at=datetime.now(timezone.utc))

