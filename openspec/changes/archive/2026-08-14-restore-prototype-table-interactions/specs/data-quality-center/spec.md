## MODIFIED Requirements

### Requirement: Complete inventory and sync controls
The data center MUST expose dataset type, missing-bucket count, status, column visibility, CSV export, and diagnostics. A sync MUST support cancellation and show a local log/status transition to `已取消` without external side effects.

#### Scenario: Cancel sync
- **WHEN** the user cancels an in-progress sync
- **THEN** the page shows a cancellation status and a sync log entry tied to the dataset ID
