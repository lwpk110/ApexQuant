from datetime import date, datetime, timezone
from decimal import Decimal
import unittest

from apexquant.adapters.provenance import InMemoryProvenanceStore
from apexquant.application.backtest import BacktestRunner
from apexquant.domain.backtest import BacktestSnapshot
from apexquant.domain.data import assess_quality
from apexquant.domain.states import RunStatus


class BacktestRunnerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.store = InMemoryProvenanceStore()
        self.runner = BacktestRunner(self.store, self.store)
        self.quality = assess_quality(
            dataset_id="data_v1",
            measured_at=datetime.now(timezone.utc),
            delayed_seconds=0,
            missing_buckets=0,
            affected_work="无",
            continuity_ok=True,
            ohlc_ok=True,
            price_limit_ok=True,
            adjustment_factor_ok=True,
        )
        self.snapshot = BacktestSnapshot("strategy_v1", "data_v1", "cost_v1", 7, date(2025, 1, 1), date(2025, 12, 31), Decimal("100000"))

    def test_result_preserves_snapshot_and_is_deterministic(self):
        first = self.runner.run(self.snapshot, self.quality, deterministic_return=Decimal("0.125"))
        second = self.runner.run(self.snapshot, self.quality, deterministic_return=Decimal("0.125"))
        self.assertEqual(first.metrics.total_return, second.metrics.total_return)
        self.assertEqual(first.metrics.ending_capital, Decimal("112500.00"))
        self.assertNotEqual(first.run_id, second.run_id)
        self.assertEqual(self.store.get(first.run_id).status, RunStatus.COMPLETED)

    def test_invalid_inputs_create_error_run_without_metrics(self):
        invalid = BacktestSnapshot("strategy_v1", "data_v1", "cost_v1", 7, date(2025, 12, 31), date(2025, 1, 1), Decimal("100000"))
        with self.assertRaisesRegex(ValueError, "结束日期"):
            self.runner.run(invalid, self.quality)
        rejected = [run for run in self.store._runs.values() if run.strategy_version == "strategy_v1"][-1]
        self.assertEqual(rejected.status, RunStatus.ERROR)
        self.assertEqual(self.store.list_for_run(rejected.run_id)[-1].event_type, "backtest_rejected")

    def test_quality_error_blocks_run(self):
        bad_quality = assess_quality(
            dataset_id="data_v1", measured_at=datetime.now(timezone.utc), delayed_seconds=0, missing_buckets=0,
            affected_work="回测", continuity_ok=False, ohlc_ok=True, price_limit_ok=True, adjustment_factor_ok=True,
        )
        with self.assertRaisesRegex(ValueError, "质量检查失败"):
            self.runner.run(self.snapshot, bad_quality)
