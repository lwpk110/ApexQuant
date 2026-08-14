## ADDED Requirements

### Requirement: Desktop-first navigation shell
The system SHALL provide eight destinations in a persistent desktop navigation
shell and SHALL expose the current destination through its selected state.

#### Scenario: Navigate to a destination
- **WHEN** the user selects a navigation destination
- **THEN** the destination content is shown and that navigation item identifies itself as current.

### Requirement: Concrete global operations status
The system SHALL display the trading date, market timestamp, data freshness,
paper account identifier, risk-alert count, and run state in the global shell.

#### Scenario: Inspect global status
- **WHEN** the user views the shell
- **THEN** every status item includes a concrete value rather than an unqualified healthy-state label.

### Requirement: Search and risk-alert handoff
The shell SHALL accept a global query for a strategy, instrument, or run ID and
SHALL send a risk-alert interaction to the risk destination with its alert-state filter.

#### Scenario: Open alerts
- **WHEN** the user activates the risk-alert control
- **THEN** the risk destination is selected with the warning filter preserved.

### Requirement: Execution-queue handoff
The system SHALL preserve a selected execution status when a user navigates
from a queue summary to simulated execution.

#### Scenario: Inspect queued orders
- **WHEN** the user selects an execution-queue status on the overview
- **THEN** simulated execution opens with that status available as its active filter.
