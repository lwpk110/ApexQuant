# simulation-execution Specification

## Purpose
TBD - created by archiving change implement-control-room-prototype. Update Purpose after archive.
## Requirements
### Requirement: Simulated execution operational header
The simulated-execution console SHALL show simulation clock, market timestamp,
current batch ID, data quality, pending-risk count, and partial-fill count.

#### Scenario: Inspect the execution header
- **WHEN** the user opens simulated execution
- **THEN** every operational header field contains a concrete value.

### Requirement: Auditable signal and order records
Each signal SHALL expose strategy, instrument, signal reason, target position,
generation time, and a data-snapshot link. The snapshot link SHALL associate a
strategy version, data version, and run ID. Each order SHALL show instrument,
strategy, side, ordered quantity, remaining quantity, price, status, and time.

#### Scenario: Trace a signal snapshot
- **WHEN** the user opens a signal data snapshot
- **THEN** its strategy version, data version, run ID, and full audit-chain entry point are available.

### Requirement: Composable execution filters
The console SHALL filter orders by strategy, instrument, status, and side in
combination. An empty result SHALL provide an adjustment action and a data-center
next step.

#### Scenario: No order matches filters
- **WHEN** a selected filter combination has no matching order
- **THEN** the console states that no order matches and provides filter reset and a data-center navigation path.

### Requirement: Risk visibility and resume gate
After the user confirms pausing new signals, simulation execution MUST retain close/cancel controls and show an accessible `模拟暂停` notice.

#### Scenario: Pause new entries
- **WHEN** the user completes the pause confirmation
- **THEN** the page renders the paused notice and does not remove controls for closing positions or cancelling orders

### Requirement: Fixed execution audit chain
The execution timeline SHALL order signal, risk decision, order, fill, and
ledger events under a run identifier.

#### Scenario: Review an execution chain
- **WHEN** the user views execution events
- **THEN** all five event categories appear in their operational order with timestamps.

