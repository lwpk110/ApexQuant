# control-room-shell Specification

## Purpose
TBD - created by archiving change implement-control-room-prototype. Update Purpose after archive.
## Requirements
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

### Requirement: Remaining destination handoffs
The shell SHALL preserve alert-state, data-diagnostic, run-ID, and run-status context when navigating among the eight destinations.

#### Scenario: Follow a data diagnostic handoff
- **WHEN** the user invokes a data-quality repair entry point from an existing route
- **THEN** the data center opens with the diagnostic context visible.

#### Scenario: Follow a run provenance handoff
- **WHEN** the user invokes a run-record entry point from an existing or new route
- **THEN** run records opens with the referenced run ID visible.

