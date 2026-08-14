## ADDED Requirements

### Requirement: Table tools provide local, deterministic feedback
The system MUST provide an accessible control for each requested table tool (export, column visibility, diagnostics, or row action) and MUST show deterministic local feedback containing the affected dataset or run identifier.

#### Scenario: Export a table
- **WHEN** the user activates an export control
- **THEN** the page shows a status feedback and preserves the table's stable identifiers without invoking a network or clipboard side effect

### Requirement: Row actions retain record context
Every row-level action MUST be labeled for its row and MUST retain the row's stable ID in the resulting feedback or detail view.

#### Scenario: Open a row action
- **WHEN** the user activates replay, diagnostics, error, or result for a row
- **THEN** the resulting status or detail includes that row's run ID
