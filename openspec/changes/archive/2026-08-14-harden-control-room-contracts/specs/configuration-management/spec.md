## ADDED Requirements

### Requirement: Complete simulation safeguards and defaults
The settings page SHALL expose minimum commission, Shanghai transfer fee, price rounding, initial capital, order timeout, market-delay threshold, and explicit close/cancel safeguards as local controls.

#### Scenario: Review complete defaults
- **WHEN** the user opens settings
- **THEN** every listed cost, default, and safeguard field has a concrete value and close/cancel controls are enabled in the local snapshot.
