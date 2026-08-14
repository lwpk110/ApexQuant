## MODIFIED Requirements

### Requirement: Immutable synchronization versions
A synchronization task SHALL display stage, progress, elapsed time, cancel control, log entry point, and a new version ID. Completion SHALL create a current version while retaining the old version as readable and referenceable. The application contract MUST expose these fields through immutable task and version records.

#### Scenario: Complete a repair sync
- **WHEN** the user starts and completes a local repair sync
- **THEN** a new data version is shown as current and the preceding version remains in history

### Requirement: Canceled synchronization provenance
Canceling a local synchronization SHALL show a canceled state and SHALL NOT create a new data version. The cancellation log MUST include the dataset ID and a human-readable reason.

#### Scenario: Cancel before completion
- **WHEN** the user cancels a running synchronization
- **THEN** the task is labeled canceled, no new current version is created, and the action is explained locally
