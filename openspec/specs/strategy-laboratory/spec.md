# strategy-laboratory Specification

## Purpose
TBD - created by archiving change implement-control-room-prototype. Update Purpose after archive.
## Requirements
### Requirement: Three-column research workspace
The strategy laboratory SHALL present strategy/experiment selection, parameter
and data configuration, and signal/net-value/factor/error analysis as distinct
working regions.

#### Scenario: Open the laboratory
- **WHEN** the user opens the strategy laboratory
- **THEN** all three working regions are visible without a multi-step wizard.

### Requirement: Traceable strategy configuration
The configuration SHALL include stock universe, cadence, date range,
adjustment mode, factors/features, model version, parameters, single-name
position limit, and transaction-cost model.

#### Scenario: Inspect configuration provenance
- **WHEN** the user views a selected strategy configuration
- **THEN** each required configuration field has a displayed value and the strategy version is identifiable.

### Requirement: Research quality gates
The laboratory SHALL block strategy validation when leakage validation fails and
show its reason and run ID. It SHALL permit the simulated lifecycle state only
after out-of-sample evaluation passes. A minute-data delay above 90 seconds or
a missing bucket SHALL block minute simulation but SHALL continue to permit
draft saving.

#### Scenario: Data quality blocks minute validation
- **WHEN** minute data is delayed above 90 seconds or has a missing bucket
- **THEN** the laboratory identifies the concrete data defect, blocks validation and simulation, and retains the save-draft action.

#### Scenario: Leakage validation fails
- **WHEN** a leakage check fails
- **THEN** the user sees the failure reason and validation run ID and cannot advance to simulated execution.

### Requirement: Lifecycle and analysis actions
The system SHALL provide save draft, validate, duplicate, and create experiment
actions with in-context feedback. A duplicate SHALL create a new draft without
inheriting the source strategy's run history. Analysis SHALL provide signal,
net-value, factor, and error views with a run-record entry point.

#### Scenario: Create an experiment
- **WHEN** data quality and validation gates pass and the user creates an experiment
- **THEN** the system gives the new experiment ID in the current workspace.

