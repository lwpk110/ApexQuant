"""Use-case services for the initial paper-trading workflow."""

from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import uuid4

from apexquant.domain.models import AccountSnapshot, MarketSnapshot, OrderRequest, RiskDecision
from apexquant.domain.risk import RiskGate
from apexquant.domain.provenance import AuditEvent, RunRecord
from apexquant.domain.states import RunStatus
from apexquant.application.ports import AuditRepository, PaperOrderSink, RunRepository


@dataclass(frozen=True, slots=True)
class EvaluationResult:
    order_id: str
    decision: RiskDecision
    evaluated_at: datetime


@dataclass(frozen=True, slots=True)
class ProvenanceEvaluationResult(EvaluationResult):
    run_id: str
    run: RunRecord
    events: tuple[AuditEvent, ...]


class PaperExecutionService:
    def __init__(self, risk_gate: RiskGate) -> None:
        self.risk_gate = risk_gate

    def evaluate_order(self, request: OrderRequest, account: AccountSnapshot, market: MarketSnapshot) -> EvaluationResult:
        return EvaluationResult(
            order_id=f"ord_{uuid4().hex[:12]}",
            decision=self.risk_gate.evaluate(request, account, market),
            evaluated_at=datetime.now(timezone.utc),
        )

    def evaluate_order_with_provenance(
        self,
        request: OrderRequest,
        account: AccountSnapshot,
        market: MarketSnapshot,
        *,
        strategy_version: str,
        data_version: str,
        cost_model_version: str,
        random_seed: int,
        run_repository: RunRepository,
        audit_repository: AuditRepository,
        paper_order_sink: PaperOrderSink | None = None,
    ) -> ProvenanceEvaluationResult:
        """Evaluate one paper order while recording its auditable execution prefix."""
        evaluated_at = datetime.now(timezone.utc)
        run = run_repository.create(
            strategy_version=strategy_version,
            data_version=data_version,
            cost_model_version=cost_model_version,
            random_seed=random_seed,
            created_at=evaluated_at,
        )
        run = run_repository.transition(run.run_id, RunStatus.RUNNING)
        audit_repository.append(
            run_id=run.run_id,
            event_type="signal",
            summary=f"{request.strategy_id} 生成 {request.symbol} {request.side} 信号",
            occurred_at=evaluated_at,
        )
        request_for_run = OrderRequest(
            symbol=request.symbol,
            side=request.side,
            quantity=request.quantity,
            price=request.price,
            strategy_id=request.strategy_id,
            run_id=run.run_id,
        )
        decision = self.risk_gate.evaluate(request_for_run, account, market, now=evaluated_at)
        decision_summary = "通过" if decision.allowed else f"拒绝（{decision.rule_id}: {decision.message}）"
        audit_repository.append(
            run_id=run.run_id,
            event_type="risk_decision",
            summary=f"风控{decision_summary}",
            occurred_at=evaluated_at,
        )
        if not decision.allowed:
            run = run_repository.transition(run.run_id, RunStatus.ERROR)
            return ProvenanceEvaluationResult(
                order_id=f"ord_{uuid4().hex[:12]}",
                decision=decision,
                evaluated_at=evaluated_at,
                run_id=run.run_id,
                run=run,
                events=audit_repository.list_for_run(run.run_id),
            )

        order_id = f"ord_{uuid4().hex[:12]}"
        if paper_order_sink is not None:
            try:
                order_id = paper_order_sink.submit(request_for_run, normalized_quantity=decision.normalized_quantity or 0)
            except Exception as exc:
                run = run_repository.transition(run.run_id, RunStatus.ERROR)
                audit_repository.append(
                    run_id=run.run_id,
                    event_type="execution_error",
                    summary=f"模拟委托提交失败: {exc}",
                    occurred_at=evaluated_at,
                )
                raise
            audit_repository.append(
                run_id=run.run_id,
                event_type="order",
                summary=f"模拟委托已提交 {order_id}",
                occurred_at=evaluated_at,
            )
        run = run_repository.transition(run.run_id, RunStatus.COMPLETED)
        return ProvenanceEvaluationResult(
            order_id=order_id,
            decision=decision,
            evaluated_at=evaluated_at,
            run_id=run.run_id,
            run=run,
            events=audit_repository.list_for_run(run.run_id),
        )
