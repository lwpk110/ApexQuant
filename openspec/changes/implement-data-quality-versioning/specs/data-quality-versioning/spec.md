## ADDED Requirements

### Requirement: Deterministic data quality report
The system MUST produce an immutable quality report containing dataset ID, measured time, delayed seconds, missing bucket count, affected work, and the statuses of continuity, OHLC, price-limit, and adjustment-factor checks. The report MUST expose a concrete overall status.

#### Scenario: Healthy dataset
- **WHEN** delay and missing buckets are zero and all checks pass
- **THEN** the report status is `healthy` and every check is recorded as passed

#### Scenario: Delayed or incomplete dataset
- **WHEN** delay or missing buckets is non-zero
- **THEN** the report status identifies the defect and retains the exact seconds, bucket count, and affected work

### Requirement: Immutable synchronization versions
The system MUST create a new immutable data version only when a sync task completes. A new version MUST retain its quality report and the previous version MUST remain readable in history.

#### Scenario: Complete repair sync
- **WHEN** a running sync completes for a dataset
- **THEN** a new current version is created and the prior current version remains in history

### Requirement: Cancellation has no version side effect
The system MUST allow a running sync to be canceled and MUST record a cancellation message. Canceling MUST NOT create or replace a data version.

#### Scenario: Cancel running sync
- **WHEN** a caller cancels a running sync before completion
- **THEN** the task status is `canceled`, its log explains the cancellation, and current/history versions are unchanged

### Requirement: Sync lifecycle validation
The system MUST reject completion or cancellation of a terminal task and leave its state unchanged.

#### Scenario: Complete canceled task
- **WHEN** a caller attempts to complete a canceled task
- **THEN** the operation fails with a validation error and no version is created
