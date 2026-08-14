"""Immutable backtest input and result contracts."""

from dataclasses import dataclass
from datetime import date
from decimal import Decimal


@dataclass(frozen=True, slots=True)
class BacktestSnapshot:
    strategy_version: str
    data_version: str
    cost_model_version: str
    random_seed: int
    start_date: date
    end_date: date
    initial_capital: Decimal


@dataclass(frozen=True, slots=True)
class BacktestMetrics:
    run_id: str
    total_return: Decimal
    ending_capital: Decimal


@dataclass(frozen=True, slots=True)
class BacktestResult:
    run_id: str
    snapshot: BacktestSnapshot
    metrics: BacktestMetrics
