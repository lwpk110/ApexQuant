"""Deterministic backtest orchestration boundary for the first delivery."""

from datetime import datetime, timezone
from decimal import Decimal

from apexquant.application.ports import AuditRepository, RunRepository
from apexquant.domain.backtest import BacktestMetrics, BacktestResult, BacktestSnapshot
from apexquant.domain.data import DataQualityReport, DataQualityStatus
from apexquant.domain.states import RunStatus


class BacktestRunner:
    def __init__(self, run_repository: RunRepository, audit_repository: AuditRepository) -> None:
        self.run_repository = run_repository
        self.audit_repository = audit_repository

    def run(
        self,
        snapshot: BacktestSnapshot,
        quality: DataQualityReport,
        *,
        deterministic_return: Decimal = Decimal("0"),
    ) -> BacktestResult:
        now = datetime.now(timezone.utc)
        run = self.run_repository.create(
            strategy_version=snapshot.strategy_version,
            data_version=snapshot.data_version,
            cost_model_version=snapshot.cost_model_version,
            random_seed=snapshot.random_seed,
            created_at=now,
        )
        run = self.run_repository.transition(run.run_id, RunStatus.RUNNING)
        self.audit_repository.append(run_id=run.run_id, event_type="backtest_requested", summary="已提交可复现回测", occurred_at=now)
        reason = self._validation_error(snapshot, quality)
        if reason:
            run = self.run_repository.transition(run.run_id, RunStatus.ERROR)
            self.audit_repository.append(run_id=run.run_id, event_type="backtest_rejected", summary=reason, occurred_at=now)
            raise ValueError(reason)
        ending_capital = (snapshot.initial_capital * (Decimal("1") + deterministic_return)).quantize(Decimal("0.01"))
        metrics = BacktestMetrics(run.run_id, deterministic_return, ending_capital)
        self.audit_repository.append(run_id=run.run_id, event_type="backtest_completed", summary="回测指标快照已生成", occurred_at=now)
        self.run_repository.transition(run.run_id, RunStatus.COMPLETED)
        return BacktestResult(run.run_id, snapshot, metrics)

    @staticmethod
    def _validation_error(snapshot: BacktestSnapshot, quality: DataQualityReport) -> str | None:
        if snapshot.end_date < snapshot.start_date:
            return "回测结束日期不能早于开始日期"
        if snapshot.initial_capital <= 0:
            return "回测初始资金必须为正数"
        if quality.status is DataQualityStatus.ERROR:
            return f"数据版本 {quality.dataset_id} 质量检查失败，无法运行回测"
        return None
