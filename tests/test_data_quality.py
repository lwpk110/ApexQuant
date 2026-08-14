from datetime import datetime, timezone
import unittest

from apexquant.adapters.data import InMemoryDataRepository
from apexquant.domain.data import DataQualityStatus, SyncStatus, assess_quality


class DataQualityVersioningTests(unittest.TestCase):
    def setUp(self) -> None:
        self.now = datetime.now(timezone.utc)
        self.repo = InMemoryDataRepository()

    def report(self, **changes):
        values = dict(
            dataset_id="CN-A-1m",
            measured_at=self.now,
            delayed_seconds=0,
            missing_buckets=0,
            affected_work="无",
            continuity_ok=True,
            ohlc_ok=True,
            price_limit_ok=True,
            adjustment_factor_ok=True,
        )
        values.update(changes)
        return assess_quality(**values)

    def test_quality_status_captures_delay_gap_and_check_errors(self):
        self.assertEqual(self.report().status, DataQualityStatus.HEALTHY)
        self.assertEqual(self.report(delayed_seconds=128).status, DataQualityStatus.DELAYED)
        self.assertEqual(self.report(missing_buckets=2, affected_work="分钟模拟").status, DataQualityStatus.GAP)
        self.assertEqual(self.report(ohlc_ok=False).status, DataQualityStatus.ERROR)

    def test_complete_sync_creates_new_version_and_keeps_history(self):
        first_task = self.repo.start_sync(dataset_id="CN-A-1m", started_at=self.now)
        first = self.repo.complete_sync(first_task.task_id, quality=self.report(), summary="初始版本", completed_at=self.now)
        second_task = self.repo.start_sync(dataset_id="CN-A-1m", started_at=self.now)
        second = self.repo.complete_sync(second_task.task_id, quality=self.report(delayed_seconds=3), summary="补数版本", completed_at=self.now)
        self.assertEqual(self.repo.current_version("CN-A-1m").version_id, second.version_id)
        self.assertEqual([version.version_id for version in self.repo.history("CN-A-1m")], [first.version_id, second.version_id])
        self.assertEqual(second.quality.status, DataQualityStatus.DELAYED)

    def test_cancel_does_not_create_version(self):
        task = self.repo.start_sync(dataset_id="CN-A-1m", started_at=self.now)
        canceled = self.repo.cancel_sync(task.task_id, reason="值班员停止补数")
        self.assertEqual(canceled.status, SyncStatus.CANCELED)
        self.assertIn("值班员停止补数", canceled.log[-1])
        with self.assertRaises(ValueError):
            self.repo.complete_sync(task.task_id, quality=self.report(), summary="不可完成", completed_at=self.now)
        self.assertEqual(self.repo.history("CN-A-1m"), ())

    def test_terminal_task_cannot_be_canceled_twice(self):
        task = self.repo.start_sync(dataset_id="CN-A-1m", started_at=self.now)
        self.repo.cancel_sync(task.task_id, reason="已修复")
        with self.assertRaises(ValueError):
            self.repo.cancel_sync(task.task_id, reason="重复操作")
