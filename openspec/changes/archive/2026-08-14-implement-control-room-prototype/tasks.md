## 1. Contract and Test Baseline

- [x] 1.1 Define typed local read-model/DTO contracts for global status, navigation handoffs, run/version provenance, data-quality gates, and action feedback.
- [x] 1.2 Add focused red tests for shell navigation, concrete status, risk-alert handoff, and execution-queue status preservation.
- [x] 1.3 Add focused red tests for overview fields, current-versus-limit risk display, controlled pause confirmation, and read-only reconciliation/run-preview disclosure.
- [x] 1.4 Add focused red tests for laboratory configuration fields, leakage and minute-data gates, lifecycle feedback, duplicate isolation, and all analysis views.
- [x] 1.5 Add focused red tests for backtest reproducibility fields, immutable run snapshot, metric contribution detail, trade provenance, and mixed-version comparison.
- [x] 1.6 Add focused red tests for simulation header, signal snapshot provenance, all four composable filters, no-result recovery path, risk fields, resume gate, and ordered audit chain.

## 2. Shared Shell and Navigation

- [x] 2.1 Implement typed destination state for alert and execution-status handoffs and apply it to the target route controls.
- [x] 2.2 Complete the global search feedback and ensure every global status control reaches its diagnostic or filtered destination in one interaction.
- [x] 2.3 Verify the eight-destination shell is accessible at desktop and narrow viewports without overlapping controls.

## 3. Portfolio Overview

- [x] 3.1 Complete the account-summary and strategy-table fields required by the overview specification, including liabilities, maintenance ratio, target turnover, and an action context.
- [x] 3.2 Complete analytics options with industry exposure and guarantee a labelled 30-trading-day range for each view.
- [x] 3.3 Implement read-only reconciliation disclosure and a pre-run preview containing data time, strategies, expected orders, and risk checks.
- [x] 3.4 Implement and test all required audit-event categories while maintaining reverse chronological order and run provenance.

## 4. Strategy Laboratory

- [x] 4.1 Complete typed strategy/configuration read models and render the full parameter set, including parameters and lifecycle provenance.
- [x] 4.2 Implement distinct leakage-failure and out-of-sample gate states with reason, run ID, and simulated-lifecycle blocking.
- [x] 4.3 Implement minute-data gate semantics for delay over 90 seconds and missing buckets while preserving draft saving.
- [x] 4.4 Complete action feedback and analysis/error views, including the run-record navigation entry point and duplicate-draft isolation.

## 5. Backtest Center

- [x] 5.1 Complete configuration and run-summary models so every reproducibility and snapshot field is displayed and action feedback creates a new prototype run ID.
- [x] 5.2 Implement metric contribution-detail affordances and trade-detail version/run provenance.
- [x] 5.3 Enforce comparison selection cap, fixed comparison settings, and the no-mixed-series rule for different data versions.

## 6. Simulated Execution

- [x] 6.1 Complete the operational header, risk panel, signal snapshot details, and audit-chain provenance fields.
- [x] 6.2 Wire the strategy filter with symbol, status, and side into one composable order filter and consume shell-preserved queue status.
- [x] 6.3 Add no-result data-center navigation and ensure reset restores the complete read model.
- [x] 6.4 Implement resumable pause state with 90-second delay/missing-data re-check, repair guidance, and availability of close/cancel/risk actions.

## 7. Verification and Traceability

- [x] 7.1 Run targeted red-green component tests for every OpenSpec scenario and record the commands/results in the SDD traceability matrix.
- [x] 7.2 Run the full frontend test suite and production build; resolve TypeScript, accessibility, and test regressions.
- [x] 7.3 Perform browser verification at 1440px, 1180px, and a mobile viewport for each completed route; check navigation, filters, confirmations, gates, and horizontal overflow.
- [x] 7.4 Obtain Open Design/Figma node IDs and reference screenshots, then capture visual-difference evidence; keep prototype fidelity pending until that comparison passes.
- [x] 7.5 Update the SDD traceability and review-gate documents with OpenSpec artifact paths, scenario/test mapping, evidence links, and remaining acceptance dependencies.
