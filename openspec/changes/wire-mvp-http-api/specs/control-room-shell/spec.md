## MODIFIED Requirements

### Requirement: Global operations status
The control-room shell SHALL persistently show trading date, market timestamp, data freshness, paper account ID, risk alert count, and simulation run state. When the API is unavailable, the shell MUST retain the local snapshot and show an explicit backend-offline state.

#### Scenario: Show local health fallback
- **WHEN** the health request fails
- **THEN** the top bar continues to show the local snapshot and a visible `后端未连接` status
