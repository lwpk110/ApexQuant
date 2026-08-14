## ADDED Requirements

### Requirement: Immutable backtest snapshot
The system MUST capture strategy version, data version, cost model version, random seed, date range, and initial capital in an immutable backtest snapshot.

#### Scenario: Create snapshot
- **WHEN** a caller submits a valid backtest request
- **THEN** the resulting run retains every supplied snapshot field unchanged

### Requirement: Input and data-quality gates
The runner MUST reject an end date before the start date, non-positive initial capital, or a data quality report with status `error`. Rejection MUST produce an error run and an audit event with a human-readable reason.

#### Scenario: Reject invalid date range
- **WHEN** the end date precedes the start date
- **THEN** no metrics are produced and the run status is `error`

#### Scenario: Reject invalid data quality
- **WHEN** the selected data version has a quality error
- **THEN** the run is rejected with the affected dataset and quality reason in the audit chain

### Requirement: Deterministic result snapshot
For an accepted snapshot, the runner MUST produce metrics containing total return, ending capital, and run ID, and repeated execution with the same inputs MUST produce equal metrics.

#### Scenario: Run reproducible backtest
- **WHEN** the same valid snapshot and deterministic return input are executed twice
- **THEN** both result snapshots have equal metrics and distinct auditable run IDs
