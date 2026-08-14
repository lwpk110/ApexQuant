"""Stable state vocabulary shared by persistence and UI contracts."""

from enum import StrEnum


class StrategyStatus(StrEnum):
    DRAFT = "draft"
    PENDING_VALIDATION = "pending_validation"
    BACKTESTABLE = "backtestable"
    SIMULATABLE = "simulatable"
    PAUSED = "paused"
    ERROR = "error"


class RunStatus(StrEnum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    CANCELED = "canceled"
    ERROR = "error"


class OrderStatus(StrEnum):
    PENDING_RISK = "pending_risk"
    SUBMITTED = "submitted"
    PARTIALLY_FILLED = "partially_filled"
    COMPLETED = "completed"
    REJECTED = "rejected"
    CANCELED = "canceled"


class RiskEventStatus(StrEnum):
    WARNING = "warning"
    BLOCKED = "blocked"
    PAPER_LIQUIDATION = "paper_liquidation"
    RESOLVED = "resolved"

