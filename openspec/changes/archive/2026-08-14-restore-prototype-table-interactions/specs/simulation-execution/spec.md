## MODIFIED Requirements

### Requirement: Risk visibility and resume gate
After the user confirms pausing new signals, simulation execution MUST retain close/cancel controls and show an accessible `模拟暂停` notice.

#### Scenario: Pause new entries
- **WHEN** the user completes the pause confirmation
- **THEN** the page renders the paused notice and does not remove controls for closing positions or cancelling orders
