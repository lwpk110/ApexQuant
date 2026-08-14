## ADDED Requirements

### Requirement: Remaining destination handoffs
The shell SHALL preserve alert-state, data-diagnostic, run-ID, and run-status context when navigating among the eight destinations.

#### Scenario: Follow a data diagnostic handoff
- **WHEN** the user invokes a data-quality repair entry point from an existing route
- **THEN** the data center opens with the diagnostic context visible.

#### Scenario: Follow a run provenance handoff
- **WHEN** the user invokes a run-record entry point from an existing or new route
- **THEN** run records opens with the referenced run ID visible.
