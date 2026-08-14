## ADDED Requirements

### Requirement: Start an auditable paper execution run
The application MUST create a run snapshot and move it to `running` before evaluating an order. The returned workflow result MUST expose the run ID and preserve strategy, data, cost, and seed provenance.

#### Scenario: Start evaluation
- **WHEN** a caller submits a paper order with provenance inputs
- **THEN** the workflow creates one run, transitions it to `running`, and evaluates under that run ID

### Requirement: Record signal and risk decisions
The workflow MUST append a `signal` event before risk evaluation and a `risk_decision` event after evaluation. Both events MUST reference the same run ID and include human-readable summaries.

#### Scenario: Risk approval
- **WHEN** the risk gate allows an order
- **THEN** signal and approved risk events exist in sequence for the run

#### Scenario: Risk rejection
- **WHEN** the risk gate rejects an order
- **THEN** signal and rejected risk events exist, the run becomes `error`, and no order event is written

### Requirement: Keep paper submission explicit
The workflow MUST NOT call a real broker. If a `PaperOrderSink` is provided and risk allows, it MAY submit a simulated order and append an `order` event; otherwise it returns the generated order ID without external side effects.

#### Scenario: Submit simulated order
- **WHEN** risk allows and a paper sink is configured
- **THEN** the sink receives the order and the audit chain contains an order event with the same run ID
