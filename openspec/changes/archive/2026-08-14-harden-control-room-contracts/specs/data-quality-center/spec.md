## ADDED Requirements

### Requirement: Complete inventory and sync controls
The data center SHALL show dataset type, missing-bucket count, and explicit status, and a running local synchronization SHALL expose cancel and log actions.

#### Scenario: Inspect inventory and cancel sync
- **WHEN** the user starts a local synchronization
- **THEN** the inventory fields are visible and the task exposes `取消同步` and `查看同步日志` controls.

### Requirement: Canceled synchronization provenance
Canceling a local synchronization SHALL show a canceled state and SHALL NOT create a new data version.

#### Scenario: Cancel before completion
- **WHEN** the user cancels a running synchronization
- **THEN** the task is labeled canceled, no new current version is created, and the action is explained locally.
