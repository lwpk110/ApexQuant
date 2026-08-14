"""Small immutable domain models shared by API, CLI and adapters."""

from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from enum import StrEnum


class OrderSide(StrEnum):
    BUY = "BUY"
    SELL = "SELL"


@dataclass(frozen=True, slots=True)
class Position:
    symbol: str
    total_shares: int
    available_shares: int
    frozen_shares: int
    avg_cost: Decimal
    last_price: Decimal

    def __post_init__(self) -> None:
        if self.total_shares != self.available_shares + self.frozen_shares:
            raise ValueError("total_shares must equal available_shares + frozen_shares")
        if min(self.total_shares, self.available_shares, self.frozen_shares) < 0:
            raise ValueError("position quantities cannot be negative")

    @property
    def market_value(self) -> Decimal:
        return Decimal(self.total_shares) * self.last_price


@dataclass(frozen=True, slots=True)
class AccountSnapshot:
    captured_at: datetime
    net_asset: Decimal
    available_cash: Decimal
    positions: tuple[Position, ...] = ()
    margin_debt: Decimal = Decimal("0")
    short_debt: Decimal = Decimal("0")

    @property
    def position_value(self) -> Decimal:
        return sum((position.market_value for position in self.positions), Decimal("0"))

    @property
    def leverage(self) -> Decimal:
        if self.net_asset <= 0:
            return Decimal("0")
        return (self.position_value + self.margin_debt + self.short_debt) / self.net_asset

    def position_for(self, symbol: str) -> Position | None:
        return next((item for item in self.positions if item.symbol == symbol), None)


@dataclass(frozen=True, slots=True)
class MarketSnapshot:
    symbol: str
    latest_price: Decimal
    observed_at: datetime
    has_required_buckets: bool = True


@dataclass(frozen=True, slots=True)
class OrderRequest:
    symbol: str
    side: OrderSide
    quantity: int
    price: Decimal
    strategy_id: str
    run_id: str


@dataclass(frozen=True, slots=True)
class RiskDecision:
    allowed: bool
    rule_id: str | None = None
    message: str = ""
    normalized_quantity: int | None = None

