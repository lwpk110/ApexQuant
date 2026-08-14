from datetime import datetime, timezone
import unittest

from apexquant.adapters.provenance import InMemoryProvenanceStore
from apexquant.domain.states import RunStatus


class ProvenanceStoreTests(unittest.TestCase):
    def setUp(self) -> None:
        self.store = InMemoryProvenanceStore()
        self.now = datetime(2026, 8, 14, 9, 30, tzinfo=timezone.utc)

    def create_run(self):
        return self.store.create(
            strategy_version="strategy_momentum_v0.3.2",
            data_version="cn-day-v20260814.2",
            cost_model_version="cost-v1.2",
            random_seed=20260814,
            created_at=self.now,
        )

    def test_run_snapshot_and_lifecycle_are_immutable(self):
        run = self.create_run()
        self.assertEqual(run.status, RunStatus.PENDING)
        self.assertEqual(self.store.transition(run.run_id, RunStatus.RUNNING).status, RunStatus.RUNNING)
        completed = self.store.transition(run.run_id, RunStatus.COMPLETED)
        self.assertEqual(completed.strategy_version, run.strategy_version)
        with self.assertRaises(ValueError):
            self.store.transition(run.run_id, RunStatus.RUNNING)
        self.assertEqual(self.store.get(run.run_id).status, RunStatus.COMPLETED)

    def test_audit_events_are_ordered_and_isolated(self):
        first = self.create_run()
        second = self.create_run()
        self.store.append(run_id=first.run_id, event_type="signal", summary="signal", occurred_at=self.now)
        self.store.append(run_id=first.run_id, event_type="risk", summary="approved", occurred_at=self.now)
        self.store.append(run_id=second.run_id, event_type="signal", summary="other", occurred_at=self.now)
        events = self.store.list_for_run(first.run_id)
        self.assertEqual([event.sequence for event in events], [1, 2])
        self.assertEqual([event.event_type for event in events], ["signal", "risk"])

    def test_configuration_history_retains_old_values(self):
        first = self.store.save(scope="simulation", values={"initial_capital": "1000000"}, effective_at=self.now)
        second = self.store.save(scope="simulation", values={"initial_capital": "1200000"}, effective_at=self.now)
        self.assertEqual(self.store.current("simulation").version_id, second.version_id)
        self.assertEqual(self.store.get_version(first.version_id).values, (("initial_capital", "1000000"),))
        self.assertEqual(len(self.store.history("simulation")), 2)

    def test_unknown_run_is_rejected(self):
        with self.assertRaises(KeyError):
            self.store.list_for_run("run_missing")
