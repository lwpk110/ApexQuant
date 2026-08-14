"""Pre-trade risk rules for paper execution.

The gate is deliberately deterministic and side-effect free. Persistence, audit events and
broker integrations belong to application/adapters layers.
"""

from datetime import datetime, timezone
from decimal import Decimal, ROUND_DOWN

from apexquant.config import DEFAULT_SETTINGS, Settings
from .models import AccountSnapshot, MarketSnapshot, OrderRequest, OrderSide, RiskDecision


def normalize_quantity(request: OrderRequest, *, lot_size: int = DEFAULT_SETTINGS.lot_size, available_shares: int = 0) -> int:
    """Align buys to lots; allow a fractional sell only when closing the full position."""
    if request.quantity <= 0:
        return 0
    if request.side is OrderSide.SELL and request.quantity == available_shares and available_shares % lot_size:
        return available_shares
    return (request.quantity // lot_size) * lot_size


class RiskGate:
    def __init__(self, settings: Settings = DEFAULT_SETTINGS) -> None:
        self.settings = settings

    def evaluate(self, request: OrderRequest, account: AccountSnapshot, market: MarketSnapshot, *, now: datetime | None = None) -> RiskDecision:
        if request.quantity <= 0:
            return RiskDecision(False, "SRS-BR-RISK-002", "委托数量必须为正数")
        if market.latest_price <= 0 or request.price <= 0:
            return RiskDecision(False, "SRS-BR-RISK-005", "委托价和最新价必须为正数")

        position = account.position_for(request.symbol)
        available = position.available_shares if position else 0
        normalized = normalize_quantity(request, lot_size=self.settings.lot_size, available_shares=available)
        if normalized == 0:
            return RiskDecision(False, "SRS-BR-RISK-002", "数量未达到最小交易单位或无法形成有效平仓", 0)
        if request.side is OrderSide.SELL and normalized > available:
            return RiskDecision(False, "SRS-BR-RISK-002", "卖出数量超过可用持仓", normalized)

        age_seconds = ((now or datetime.now(timezone.utc)) - market.observed_at).total_seconds()
        if age_seconds > self.settings.market_data_stale_seconds or not market.has_required_buckets:
            return RiskDecision(False, "SRS-BR-RISK-006", "行情延迟或关键分钟桶缺失，暂停新开仓", normalized)

        deviation = abs(request.price - market.latest_price) / market.latest_price
        if deviation > self.settings.price_deviation_limit:
            return RiskDecision(False, "SRS-BR-RISK-005", "委托价偏离最新价超过 2.00%", normalized)

        if request.side is OrderSide.BUY and account.net_asset > 0:
            existing_value = position.market_value if position else Decimal("0")
            proposed_value = existing_value + Decimal(normalized) * request.price
            ratio = proposed_value / account.net_asset
            if ratio > self.settings.single_position_limit:
                return RiskDecision(False, "SRS-BR-RISK-001", "买入后单票仓位超过 20.00%", normalized)

        return RiskDecision(True, normalized_quantity=normalized, message="风控检查通过")

