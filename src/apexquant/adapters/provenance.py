"""Dependency-free in-memory provenance adapter for local workflows and tests."""

from datetime import datetime
from uuid import uuid4

from apexquant.domain.provenance import AuditEvent, ConfigVersion, RunRecord
from apexquant.domain.states import RunStatus


class InMemoryProvenanceStore:
    def __init__(self) -> None:
        self._runs: dict[str, RunRecord] = {}
        self._events: dict[str, list[AuditEvent]] = {}
        self._configs: dict[str, ConfigVersion] = {}
        self._config_history: dict[str, list[ConfigVersion]] = {}

    def create(self, *, strategy_version: str, data_version: str, cost_model_version: str, random_seed: int, created_at: datetime) -> RunRecord:
        run = RunRecord(f"run_{uuid4().hex[:12]}", strategy_version, data_version, cost_model_version, random_seed, created_at)
        self._runs[run.run_id] = run
        return run

    def get(self, run_id: str) -> RunRecord:
        try:
            return self._runs[run_id]
        except KeyError as exc:
            raise KeyError(f"unknown run: {run_id}") from exc

    def transition(self, run_id: str, status: RunStatus | str) -> RunRecord:
        current = self.get(run_id)
        next_status = status if isinstance(status, RunStatus) else RunStatus(status)
        updated = current.transition(next_status)
        self._runs[run_id] = updated
        return updated

    def append(self, *, run_id: str, event_type: str, summary: str, occurred_at: datetime) -> AuditEvent:
        self.get(run_id)
        events = self._events.setdefault(run_id, [])
        event = AuditEvent(run_id, len(events) + 1, event_type, summary, occurred_at)
        events.append(event)
        return event

    def list_for_run(self, run_id: str) -> tuple[AuditEvent, ...]:
        self.get(run_id)
        return tuple(self._events.get(run_id, ()))

    def save(self, *, scope: str, values: dict[str, object], effective_at: datetime) -> ConfigVersion:
        version = ConfigVersion.from_mapping(f"cfg_{uuid4().hex[:12]}", scope, values, effective_at)
        self._configs[scope] = version
        self._config_history.setdefault(scope, []).append(version)
        return version

    def current(self, scope: str) -> ConfigVersion | None:
        return self._configs.get(scope)

    def get_version(self, version_id: str) -> ConfigVersion:
        for version in self._configs.values():
            if version.version_id == version_id:
                return version
        for versions in self._config_history.values():
            for version in versions:
                if version.version_id == version_id:
                    return version
        raise KeyError(f"unknown config version: {version_id}")

    def history(self, scope: str) -> tuple[ConfigVersion, ...]:
        return tuple(self._config_history.get(scope, ()))
