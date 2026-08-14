## MODIFIED Requirements

### Requirement: Cross-page audit replay
The page SHALL present signal, risk, order, fill, ledger, data exception, and manual-action events with timestamps and run IDs, and SHALL accept linked run provenance from other control-room pages. The application contract MUST expose the same ordered event chain by run ID so UI and future APIs consume one source of truth.

#### Scenario: Replay a passed run ID
- **WHEN** a user navigates from another page with a run ID
- **THEN** the matching run context and audit chain entry point are visible

#### Scenario: Read audit chain from application contract
- **WHEN** an application service requests events for a run ID
- **THEN** it receives only that run's events ordered by sequence with timestamps and event types
