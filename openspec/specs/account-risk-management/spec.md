# account-risk-management Specification

## Purpose
TBD - created by archiving change implement-remaining-control-room-pages. Update Purpose after archive.
## Requirements
### Requirement: Auditable account and position summary
The account-risk page SHALL show cash, total positions, financing, securities lending, interest, net asset value, maintenance ratio, and a position table with total, available, T+1 frozen quantity, prices, unrealized profit/loss, strategy, industry, and marginal risk contribution.

#### Scenario: Review a position
- **WHEN** the user opens the account-risk destination
- **THEN** account totals and each required position field are visible with a local snapshot timestamp.

### Requirement: Closed market-value explanation
The page SHALL reconcile displayed position market value to the account total and SHALL label non-itemized value as Other positions with its amount.

#### Scenario: Inspect value closure
- **WHEN** the user opens the value explanation
- **THEN** named positions, Other positions, and the total are visible without changing account data.

### Requirement: Risk limits and events
The page SHALL display single-name, industry, gross leverage, daily loss, and drawdown-pause limits as current value, limit, and usage; events SHALL support warning, blocking, simulated liquidation, and resolved states with run provenance.

#### Scenario: Filter risk events
- **WHEN** the page receives an alert filter or the user selects an event state
- **THEN** the matching state is selected and event rows retain their run IDs.

### Requirement: Versioned risk actions
Editing a risk limit SHALL preview scope, expected behaviour, and effective time before creating a new configuration version. Simulated liquidation SHALL require exact input `确认模拟强平` and SHALL create only a new simulated run.

#### Scenario: Confirm simulated liquidation
- **WHEN** the user enters `确认模拟强平` and confirms
- **THEN** a new simulated run ID is shown and no real-order claim is made.

### Requirement: Total leverage limit visibility
The account-risk page SHALL show total leverage as a current value and limit within the risk-limit panel, in addition to the account summary.

#### Scenario: Review leverage limits
- **WHEN** the user opens the account-risk destination
- **THEN** the risk-limit panel contains a `总杠杆限额` row with current value and upper limit.

