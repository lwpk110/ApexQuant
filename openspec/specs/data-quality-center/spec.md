# data-quality-center Specification

## Purpose
TBD - created by archiving change implement-remaining-control-room-pages. Update Purpose after archive.
## Requirements
### Requirement: Dataset and timezone visibility
The data center SHALL list dataset, type, source, coverage, last update, missing rate, missing buckets, adjustment state, license/restriction, and status. All timestamps SHALL label Asia/Shanghai or CST.

#### Scenario: Inspect data inventory
- **WHEN** the user opens the data center
- **THEN** every dataset field and its timezone context are visible.

### Requirement: Data quality diagnostics
The data center SHALL show time continuity, OHLC validity, price-limit validation, and adjustment-factor jump checks. Delayed or missing data SHALL state minutes, bucket count, affected work, and a diagnostic entry point.

#### Scenario: Open delayed data diagnostic
- **WHEN** the destination receives a data-quality diagnostic handoff
- **THEN** the relevant defect and repair path are visible.

### Requirement: Immutable synchronization versions
A synchronization task SHALL display stage, progress, elapsed time, cancel control, log entry point, and a new version ID. Completion SHALL create a current version while retaining the old version as readable and referenceable.

#### Scenario: Complete a repair sync
- **WHEN** the user starts and completes a local repair sync
- **THEN** a new data version is shown as current and the preceding version remains in history.

### Requirement: Version history provenance
The version history SHALL expose version ID, creation time, change summary, quality result, and current state.

#### Scenario: Inspect a historical version
- **WHEN** the user opens a prior version record
- **THEN** its immutable provenance is displayed separately from the current version.

### Requirement: Complete inventory and sync controls
The data center MUST expose dataset type, missing-bucket count, status, column visibility, CSV export, and diagnostics. A sync MUST support cancellation and show a local log/status transition to `已取消` without external side effects.

#### Scenario: Cancel sync
- **WHEN** the user cancels an in-progress sync
- **THEN** the page shows a cancellation status and a sync log entry tied to the dataset ID

### Requirement: Canceled synchronization provenance
Canceling a local synchronization SHALL show a canceled state and SHALL NOT create a new data version.

#### Scenario: Cancel before completion
- **WHEN** the user cancels a running synchronization
- **THEN** the task is labeled canceled, no new current version is created, and the action is explained locally.

