"""Immutable provenance records shared by research and paper-trading workflows."""

from dataclasses import dataclass, replace
from datetime import datetime
from enum import StrEnum
from typing import Mapping

from apexquant.domain.states import RunStatus


@dataclass(frozen=True, slots=True)
class RunRecord:
    run_id: str
    strategy_version: str
    data_version: str
    cost_model_version: str
    random_seed: int
    created_at: datetime
    status: RunStatus = RunStatus.PENDING

    def transition(self, status: RunStatus) -> "RunRecord":
        allowed = {
            RunStatus.PENDING: {RunStatus.RUNNING, RunStatus.CANCELED, RunStatus.ERROR},
            RunStatus.RUNNING: {RunStatus.COMPLETED, RunStatus.CANCELED, RunStatus.ERROR},
            RunStatus.COMPLETED: set(),
            RunStatus.CANCELED: set(),
            RunStatus.ERROR: set(),
        }
        if status not in allowed[self.status]:
            raise ValueError(f"invalid run transition: {self.status} -> {status}")
        return replace(self, status=status)


@dataclass(frozen=True, slots=True)
class AuditEvent:
    run_id: str
    sequence: int
    event_type: str
    summary: str
    occurred_at: datetime


@dataclass(frozen=True, slots=True)
class ConfigVersion:
    version_id: str
    scope: str
    values: tuple[tuple[str, str], ...]
    effective_at: datetime

    @classmethod
    def from_mapping(cls, version_id: str, scope: str, values: Mapping[str, object], effective_at: datetime) -> "ConfigVersion":
        normalized = tuple(sorted((key, str(value)) for key, value in values.items()))
        return cls(version_id=version_id, scope=scope, values=normalized, effective_at=effective_at)

