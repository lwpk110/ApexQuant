## MODIFIED Requirements

### Requirement: Immutable run snapshot and summary
Starting a backtest MUST capture the selected strategy version and data version in a local snapshot and mark that snapshot `locked`. Copying a run ID MUST show local feedback.

#### Scenario: Start and copy a run
- **WHEN** the user starts a backtest and then copies its run ID
- **THEN** the snapshot displays the selected versions with a locked marker and the page shows copy feedback without clipboard side effects
