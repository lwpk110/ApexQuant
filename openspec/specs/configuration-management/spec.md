# configuration-management Specification

## Purpose
TBD - created by archiving change implement-remaining-control-room-pages. Update Purpose after archive.
## Requirements
### Requirement: Complete configuration domains
The settings page SHALL present trading rules, fees, simulation defaults, and notifications. Trading rules SHALL include market, minimum unit, price deviation, daily loss, single-name, leverage, T+1, and price-limit controls; fees and defaults SHALL include all SRS fields.

#### Scenario: Review settings
- **WHEN** the user opens settings
- **THEN** each required configuration field has a concrete local snapshot value.

### Requirement: Safe data-exception and notification configuration
The page SHALL show whether data exceptions pause new signals while close and cancel remain available, and SHALL show controls for risk, strategy failure, data delay/gap, and task-summary notifications.

#### Scenario: Inspect operating safeguards
- **WHEN** the user reviews simulation defaults and notifications
- **THEN** the data exception and notification states are explicit.

### Requirement: Versioned save and rollback
Saving SHALL preview configuration version, scope, old value, new value, and effective time. Undo SHALL restore the preceding configuration version without modifying historical run snapshots.

#### Scenario: Save a configuration version
- **WHEN** the user confirms a settings save
- **THEN** a new configuration version and its effective scope are visible.

### Requirement: Complete simulation safeguards and defaults
The settings page SHALL expose minimum commission, Shanghai transfer fee, price rounding, initial capital, order timeout, market-delay threshold, and explicit close/cancel safeguards as local controls.

#### Scenario: Review complete defaults
- **WHEN** the user opens settings
- **THEN** every listed cost, default, and safeguard field has a concrete value and close/cancel controls are enabled in the local snapshot.

