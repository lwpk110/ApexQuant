## 1. Contracts and Red Tests

- [x] 1.1 Define typed local read models and navigation handoffs for risk events, data diagnostics, run filters, retries, and configuration versions.
- [x] 1.2 Add focused failing tests for account-risk fields, value closure, filters, version preview, and simulated liquidation confirmation.
- [x] 1.3 Add focused failing tests for data inventory, timezone, quality diagnostic, synchronisation/version retention, and version history.
- [x] 1.4 Add focused failing tests for run summaries, filters, failure recovery, rerun provenance, and audit replay.
- [x] 1.5 Add focused failing tests for settings fields, safeguards, notification state, versioned save, and rollback.

## 2. Shared Navigation

- [x] 2.1 Extend the app and shell to preserve alert, diagnostic, run ID, and status context across all eight destinations.

## 3. Account and Risk

- [x] 3.1 Implement account totals, T+1 positions, and read-only market-value closure.
- [x] 3.2 Implement current-versus-limit usage and provenance-filtered risk events.
- [x] 3.3 Implement versioned risk-limit impact preview and exact-input simulated liquidation.

## 4. Data Center

- [x] 4.1 Implement dataset inventory, timezone-labelled timestamps, quality checks, and diagnostic handoff.
- [x] 4.2 Implement local synchronization lifecycle with cancel/log state and immutable data-version history.

## 5. Run Records

- [x] 5.1 Implement summary, task table, status/run filtering, and cross-page run context.
- [x] 5.2 Implement failure explanation, retry-command feedback, new-run creation, and audit event replay.

## 6. Settings

- [x] 6.1 Implement rules, costs, simulation defaults, and notification read models in the OD-aligned panel layout.
- [x] 6.2 Implement versioned save impact preview and rollback while preserving historical snapshot semantics.

## 7. Verification and Traceability

- [x] 7.1 Run targeted red-green tests for all new capability scenarios and record SDD mapping.
- [x] 7.2 Run the full frontend suite and production build; resolve type and accessibility regressions.
- [x] 7.3 Verify all eight destinations and their handoffs at 1440px, 1180px, and 390px with no root horizontal overflow or console errors.
- [x] 7.4 Capture OD source-to-app visual-difference evidence for the four completed routes and update the review gate.
