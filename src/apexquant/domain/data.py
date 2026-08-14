"""Immutable data-quality and versioning contracts."""

from dataclasses import dataclass, replace
from datetime import datetime
from enum import StrEnum


class DataQualityStatus(StrEnum):
    HEALTHY = "healthy"
    DELAYED = "delayed"
    GAP = "gap"
    ERROR = "error"


class SyncStatus(StrEnum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    CANCELED = "canceled"
    ERROR = "error"


@dataclass(frozen=True, slots=True)
class QualityCheck:
    name: str
    passed: bool
    detail: str


@dataclass(frozen=True, slots=True)
class DataQualityReport:
    dataset_id: str
    measured_at: datetime
    delayed_seconds: int
    missing_buckets: int
    affected_work: str
    checks: tuple[QualityCheck, ...]
    status: DataQualityStatus

    def __post_init__(self) -> None:
        if self.delayed_seconds < 0 or self.missing_buckets < 0:
            raise ValueError("quality measurements cannot be negative")
        if self.measured_at.tzinfo is None:
            raise ValueError("quality measurement time must be timezone-aware")


@dataclass(frozen=True, slots=True)
class DataVersion:
    version_id: str
    dataset_id: str
    created_at: datetime
    summary: str
    quality: DataQualityReport


@dataclass(frozen=True, slots=True)
class SyncTask:
    task_id: str
    dataset_id: str
    stage: str
    progress: int
    started_at: datetime
    status: SyncStatus = SyncStatus.PENDING
    log: tuple[str, ...] = ()

    def transition(self, status: SyncStatus, *, stage: str | None = None, progress: int | None = None, message: str | None = None) -> "SyncTask":
        allowed = {
            SyncStatus.PENDING: {SyncStatus.RUNNING, SyncStatus.CANCELED, SyncStatus.ERROR},
            SyncStatus.RUNNING: {SyncStatus.COMPLETED, SyncStatus.CANCELED, SyncStatus.ERROR},
            SyncStatus.COMPLETED: set(),
            SyncStatus.CANCELED: set(),
            SyncStatus.ERROR: set(),
        }
        if status not in allowed[self.status]:
            raise ValueError(f"invalid sync transition: {self.status} -> {status}")
        if progress is not None and not 0 <= progress <= 100:
            raise ValueError("sync progress must be between 0 and 100")
        return replace(
            self,
            status=status,
            stage=stage or self.stage,
            progress=self.progress if progress is None else progress,
            log=self.log + ((message,) if message else ()),
        )


def assess_quality(
    *,
    dataset_id: str,
    measured_at: datetime,
    delayed_seconds: int,
    missing_buckets: int,
    affected_work: str,
    continuity_ok: bool,
    ohlc_ok: bool,
    price_limit_ok: bool,
    adjustment_factor_ok: bool,
) -> DataQualityReport:
    checks = (
        QualityCheck("continuity", continuity_ok, "时间连续性通过" if continuity_ok else "存在时间断档"),
        QualityCheck("ohlc", ohlc_ok, "OHLC 校验通过" if ohlc_ok else "OHLC 值无效"),
        QualityCheck("price_limit", price_limit_ok, "涨跌停校验通过" if price_limit_ok else "涨跌停约束异常"),
        QualityCheck("adjustment_factor", adjustment_factor_ok, "复权因子通过" if adjustment_factor_ok else "复权因子跳变"),
    )
    if not all(check.passed for check in checks):
        status = DataQualityStatus.ERROR
    elif missing_buckets > 0:
        status = DataQualityStatus.GAP
    elif delayed_seconds > 0:
        status = DataQualityStatus.DELAYED
    else:
        status = DataQualityStatus.HEALTHY
    return DataQualityReport(dataset_id, measured_at, delayed_seconds, missing_buckets, affected_work, checks, status)
