## MODIFIED Requirements

### Requirement: Reproducible backtest run configuration
The backtest center SHALL require strategy version, data version, period, initial capital, costs, slippage, execution assumption, benchmark, and random seed; the runner contract MUST preserve these fields in the run snapshot and expose run status and provenance.

#### Scenario: Start a versioned backtest
- **WHEN** the user submits complete backtest configuration
- **THEN** the run summary shows the run ID, strategy/data/cost versions, date range, seed, and status
