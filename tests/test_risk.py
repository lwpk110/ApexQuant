from datetime import datetime, timedelta, timezone
from decimal import Decimal
import unittest

from apexquant.domain.models import AccountSnapshot, MarketSnapshot, OrderRequest, OrderSide
from apexquant.domain.risk import RiskGate, normalize_quantity


class RiskGateTests(unittest.TestCase):
    def setUp(self) -> None:
        self.now = datetime.now(timezone.utc)
        self.account = AccountSnapshot(self.now, Decimal("100000"), Decimal("100000"))
        self.market = MarketSnapshot("600519.SH", Decimal("100"), self.now)
        self.gate = RiskGate()

    def request(self, **changes):
        values = dict(symbol="600519.SH", side=OrderSide.BUY, quantity=250, price=Decimal("100"), strategy_id="s1", run_id="r1")
        values.update(changes)
        return OrderRequest(**values)

    def test_buy_quantity_is_aligned_down(self):
        self.assertEqual(normalize_quantity(self.request(), lot_size=100), 200)

    def test_price_deviation_is_rejected(self):
        result = self.gate.evaluate(self.request(price=Decimal("103")), self.account, self.market, now=self.now)
        self.assertFalse(result.allowed)
        self.assertEqual(result.rule_id, "SRS-BR-RISK-005")

    def test_stale_market_blocks_new_order(self):
        stale = MarketSnapshot("600519.SH", Decimal("100"), self.now - timedelta(seconds=91))
        result = self.gate.evaluate(self.request(), self.account, stale, now=self.now)
        self.assertFalse(result.allowed)
        self.assertEqual(result.rule_id, "SRS-BR-RISK-006")

    def test_position_limit_rejects_buy(self):
        result = self.gate.evaluate(self.request(quantity=21000), self.account, self.market, now=self.now)
        self.assertFalse(result.allowed)
        self.assertEqual(result.rule_id, "SRS-BR-RISK-001")

