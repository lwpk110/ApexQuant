from datetime import datetime, timezone
from decimal import Decimal
import unittest

from apexquant.adapters.provenance import InMemoryProvenanceStore
from apexquant.application.services import PaperExecutionService
from apexquant.domain.models import AccountSnapshot, MarketSnapshot, OrderRequest, OrderSide
from apexquant.domain.risk import RiskGate
from apexquant.domain.states import RunStatus


class RecordingPaperSink:
    def __init__(self) -> None:
        self.calls = []

    def submit(self, order, *, normalized_quantity: int) -> str:
        self.calls.append((order, normalized_quantity))
        return "ord_paper_001"


class FailingPaperSink:
    def __init__(self) -> None:
        self.run_id = None

    def submit(self, order, *, normalized_quantity: int) -> str:
        self.run_id = order.run_id
        raise RuntimeError("paper adapter unavailable")


class PaperExecutionWorkflowTests(unittest.TestCase):
    def setUp(self) -> None:
        self.now = datetime.now(timezone.utc)
        self.account = AccountSnapshot(self.now, Decimal("100000"), Decimal("100000"))
        self.market = MarketSnapshot("600519.SH", Decimal("100"), self.now)
        self.request = OrderRequest("600519.SH", OrderSide.BUY, 100, Decimal("100"), "s1", "legacy-run")
        self.store = InMemoryProvenanceStore()
        self.service = PaperExecutionService(RiskGate())

    def evaluate(self, *, request=None, sink=None):
        return self.service.evaluate_order_with_provenance(
            request or self.request,
            self.account,
            self.market,
            strategy_version="strategy_v1",
            data_version="data_v1",
            cost_model_version="cost_v1",
            random_seed=7,
            run_repository=self.store,
            audit_repository=self.store,
            paper_order_sink=sink,
        )

    def test_approved_order_has_run_prefix_and_paper_submission(self):
        sink = RecordingPaperSink()
        result = self.evaluate(sink=sink)
        self.assertTrue(result.decision.allowed)
        self.assertEqual(result.run.status, RunStatus.COMPLETED)
        self.assertEqual([event.event_type for event in result.events], ["signal", "risk_decision", "order"])
        self.assertEqual(sink.calls[0][0].run_id, result.run_id)
        self.assertEqual(sink.calls[0][1], 100)

    def test_rejected_order_is_audited_without_order_submission(self):
        request = OrderRequest("600519.SH", OrderSide.BUY, 21000, Decimal("100"), "s1", "legacy-run")
        result = self.evaluate(request=request)
        self.assertFalse(result.decision.allowed)
        self.assertEqual(result.run.status, RunStatus.ERROR)
        self.assertEqual([event.event_type for event in result.events], ["signal", "risk_decision"])

    def test_sink_failure_marks_run_error_and_is_audited(self):
        sink = FailingPaperSink()
        with self.assertRaisesRegex(RuntimeError, "paper adapter unavailable"):
            self.evaluate(sink=sink)
        self.assertIsNotNone(sink.run_id)
        self.assertEqual(self.store.get(sink.run_id).status, RunStatus.ERROR)
        self.assertEqual([event.event_type for event in self.store.list_for_run(sink.run_id)], ["signal", "risk_decision", "execution_error"])
