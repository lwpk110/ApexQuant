## MODIFIED Requirements

### Requirement: Reproducible backtest run configuration
The backtest center SHALL require strategy version, data version, period, initial capital, costs, slippage, execution assumption, benchmark, and random seed; the runner contract MUST preserve these fields in the run snapshot and expose run status and provenance. The primary run action MUST submit this snapshot through the MVP API when available.

#### Scenario: Start a versioned backtest
- **WHEN** the user submits complete backtest configuration
- **THEN** the run summary shows the run ID, strategy/data/cost versions, date range, seed, and status

#### Scenario: API unavailable during run
- **WHEN** the run API cannot be reached
- **THEN** the page keeps the local result view and shows a backend-offline feedback message
