# portfolio-overview Specification

## Purpose
TBD - created by archiving change implement-control-room-prototype. Update Purpose after archive.
## Requirements
### Requirement: Operational health and account overview
The overview SHALL display six concrete health checks and an account summary
containing net asset value, available cash, position value, financing and short
liabilities, gross leverage, maintenance ratio, and daily profit or loss.

#### Scenario: Review operational state
- **WHEN** the user opens the overview
- **THEN** health details contain timestamps or counts and account values are visible in the same operational context.

### Requirement: Risk limits in current-versus-limit form
The overview SHALL show single-name concentration, industry concentration,
maximum drawdown, and daily loss as a current value and limit pair.

#### Scenario: Inspect a risk metric
- **WHEN** the user reviews a risk metric
- **THEN** the numeric current value and numeric limit are both visible without relying on colour alone.

### Requirement: Strategy and execution summaries
The overview SHALL show each strategy's name, strategy version, data version,
lifecycle state, cycle, signal count, target turnover, daily P&L, latest run ID,
and action context; it SHALL also show every execution queue state and count.

#### Scenario: Trace a strategy row
- **WHEN** the user reads a strategy summary
- **THEN** its version, data version, and latest run identifier are available for audit.

### Requirement: Analytics and audit trail
The overview SHALL offer 30-trading-day views for net value, benchmark,
drawdown, leverage, and industry exposure, and SHALL render reverse-chronological
audit events for signal, risk decision, order, fill, data issue, and manual action.

#### Scenario: Change analytics view
- **WHEN** the user selects an analytics view
- **THEN** the selected view is identified and the associated trend region updates its label.

### Requirement: Controlled overview actions
Viewing reconciliation differences SHALL remain read-only. Starting a paper run
SHALL first disclose data time, candidate strategies, expected order count, and
risk-check result. Pausing all strategies SHALL require exact input `确认暂停`.

#### Scenario: Confirm a global pause
- **WHEN** the user enters `确认暂停` and confirms the pause
- **THEN** the overview records a new run ID and states that close, cancel, and risk actions remain available.

#### Scenario: Reject an incomplete pause confirmation
- **WHEN** the pause confirmation input does not exactly equal `确认暂停`
- **THEN** the confirmation action is unavailable and no pause state is created.

