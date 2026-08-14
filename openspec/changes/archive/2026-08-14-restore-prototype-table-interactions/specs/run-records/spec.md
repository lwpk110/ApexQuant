## MODIFIED Requirements

### Requirement: Filterable run summary and task list
The run-record table MUST provide export feedback, row-level replay/diagnostic/error/result actions, structured failure fields (error code, explanation, impact), and source run IDs for audit events.

#### Scenario: Inspect failed run
- **WHEN** the user opens a failed run's error detail
- **THEN** the detail shows error code, explanation, impact scope, and the source run ID
