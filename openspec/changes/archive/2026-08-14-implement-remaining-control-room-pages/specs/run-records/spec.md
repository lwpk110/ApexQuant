## ADDED Requirements

### Requirement: Filterable run summary and task list
The run-records page SHALL display today, running, complete, warning, failed, and longest-queue summaries, plus task rows containing run ID, task, strategy, state, start time, elapsed time, and action.

#### Scenario: Filter failed runs
- **WHEN** the user selects the failed filter or arrives with a run/status handoff
- **THEN** the filter state is visible and matching task rows remain traceable by run ID.

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
