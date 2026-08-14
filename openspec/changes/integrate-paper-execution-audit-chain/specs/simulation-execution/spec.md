## MODIFIED Requirements

### Requirement: Fixed execution audit chain
The execution timeline SHALL order signal, risk decision, order, fill, and
ledger events under a run identifier. The application workflow MUST produce the signal, risk decision, and optional paper order prefix in that order before later fill and ledger stages are added.

#### Scenario: Review an execution chain
- **WHEN** the user views execution events
- **THEN** all five event categories appear in their operational order with timestamps

#### Scenario: Review application-generated prefix
- **WHEN** a paper order is evaluated through the application workflow
- **THEN** its events begin with signal, risk decision, and optional order under one run ID
