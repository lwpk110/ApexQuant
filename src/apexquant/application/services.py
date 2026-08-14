"""Use-case services for the initial paper-trading workflow."""

from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import uuid4

from apexquant.domain.models import AccountSnapshot, MarketSnapshot, OrderRequest, RiskDecision
from apexquant.domain.risk import RiskGate


@dataclass(frozen=True, slots=True)
class EvaluationResult:
    order_id: str
    decision: RiskDecision
    evaluated_at: datetime


class PaperExecutionService:
    def __init__(self, risk_gate: RiskGate) -> None:
        self.risk_gate = risk_gate

    def evaluate_order(self, request: OrderRequest, account: AccountSnapshot, market: MarketSnapshot) -> EvaluationResult:
        return EvaluationResult(
            order_id=f"ord_{uuid4().hex[:12]}",
            decision=self.risk_gate.evaluate(request, account, market),
            evaluated_at=datetime.now(timezone.utc),
        )

