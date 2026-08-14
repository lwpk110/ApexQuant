"""Runtime configuration and 0.0.1 defaults."""

from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True, slots=True)
class Settings:
    timezone: str = "Asia/Shanghai"
    market_data_stale_seconds: int = 90
    price_deviation_limit: Decimal = Decimal("0.02")
    single_position_limit: Decimal = Decimal("0.20")
    leverage_limit: Decimal = Decimal("2.00")
    daily_loss_limit: Decimal = Decimal("0.03")
    drawdown_pause_limit: Decimal = Decimal("0.08")
    order_timeout_seconds: int = 60
    lot_size: int = 100
    margin_enabled: bool = False


DEFAULT_SETTINGS = Settings()

