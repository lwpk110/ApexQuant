# run-records Specification

## Purpose
TBD - created by archiving change implement-remaining-control-room-pages. Update Purpose after archive.
## Requirements
### Requirement: Filterable run summary and task list
The run-record table MUST provide export feedback, row-level replay/diagnostic/error/result actions, structured failure fields (error code, explanation, impact), and source run IDs for audit events.

#### Scenario: Inspect failed run
- **WHEN** the user opens a failed run's error detail
- **THEN** the detail shows error code, explanation, impact scope, and the source run ID

### Requirement: Failure recovery and rerun provenance
Failure detail SHALL show an error code, human explanation, impact scope, and run ID. The page SHALL expose a copyable CLI retry command and rerun confirmation that creates a new run without changing the original record.

#### Scenario: Rerun a failed task
- **WHEN** the user confirms a failed task rerun
- **THEN** a new run ID is presented and the failed source run remains intact.

### Requirement: Cross-page audit replay
The page SHALL present signal, risk, order, fill, ledger, data exception, and manual-action events with timestamps and run IDs, and SHALL accept linked run provenance from other control-room pages.

#### Scenario: Replay a passed run ID
- **WHEN** a user navigates from another page with a run ID
- **THEN** the matching run context and audit chain entry point are visible.

