# backtest-center Specification

## Purpose
TBD - created by archiving change implement-control-room-prototype. Update Purpose after archive.
## Requirements
### Requirement: Reproducible single-page backtest configuration
The backtest center SHALL provide one configuration page containing strategy
version, data version, cadence, date range, initial capital, credit parameters,
fees, slippage, execution assumption, benchmark, and random seed.

#### Scenario: Review a run configuration
- **WHEN** the user views the backtest configuration
- **THEN** every required reproducibility field is present without advancing through a wizard.

### Requirement: Immutable run snapshot and summary
Starting a backtest MUST capture the selected strategy version and data version in a local snapshot and mark that snapshot `locked`. Copying a run ID MUST show local feedback.

#### Scenario: Start and copy a run
- **WHEN** the user starts a backtest and then copies its run ID
- **THEN** the snapshot displays the selected versions with a locked marker and the page shows copy feedback without clipboard side effects

### Requirement: Result views and contribution detail
The result area SHALL expose annualized return, volatility, Sharpe ratio,
maximum drawdown, win rate, turnover, cost share, financing interest, short fee,
and liquidation count. Metrics SHALL offer contribution detail; trade detail
SHALL contain time, instrument, side, quantity, price, net contribution, run ID,
and version provenance.

#### Scenario: Inspect trade detail
- **WHEN** the user selects the trade-detail view
- **THEN** each trade displays its required transactional fields and the run remains traceable.

### Requirement: Version-safe experiment comparison
The user SHALL select at most four experiments for comparison. Comparison SHALL
fix the date range and cost model. Results backed by different data versions
MUST show a warning and MUST NOT be drawn in a shared series.

#### Scenario: Select mixed-version experiments
- **WHEN** the comparison selection contains more than one data version
- **THEN** a data-version warning is displayed and mixed results are not co-plotted.

