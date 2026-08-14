## ADDED Requirements

### Requirement: Immutable run snapshot
The system MUST create a run record containing a unique run ID, strategy version, data version, cost model version, random seed, creation time, and status. The snapshot fields MUST remain unchanged after creation.

#### Scenario: Create reproducible run
- **WHEN** a caller creates a run with all version inputs
- **THEN** the repository returns a `pending` run with a unique ID and the exact supplied provenance fields

#### Scenario: Preserve historical snapshot
- **WHEN** a configuration or later execution state changes
- **THEN** the run's strategy, data, cost, and seed fields remain equal to their creation values

### Requirement: Ordered audit chain
The system MUST append timestamped audit events to a run and assign a strictly increasing sequence per run. Reading a run's events MUST return them in sequence order without exposing events from another run.

#### Scenario: Append execution events
- **WHEN** signal, risk, order, fill, and ledger events are appended to one run
- **THEN** each event has a unique sequence and reading the run returns the five events in append order

#### Scenario: Isolate run history
- **WHEN** events exist for two run IDs
- **THEN** querying either run returns only that run's events

### Requirement: Valid run lifecycle
The system MUST allow only forward transitions from pending to running and then to completed, canceled, or error. Invalid transitions MUST be rejected and leave the record unchanged.

#### Scenario: Complete a running run
- **WHEN** a pending run is started and then marked completed
- **THEN** the final status is `completed` and its creation provenance is retained

#### Scenario: Reject lifecycle rollback
- **WHEN** a completed run is changed back to running
- **THEN** the operation fails with a validation error and status remains `completed`
