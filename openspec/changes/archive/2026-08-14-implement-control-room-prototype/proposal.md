## Why

ApexQuant 0.0.1 already has product, visual, and SRS baselines, but the first
four control-room views were started without a complete, executable
specification chain. That makes it hard to prove that field-level behaviour,
run/version traceability, and risk-gate states remain aligned as the prototype
becomes an application.

This change establishes the first formally specified vertical slice: overview,
strategy research, backtesting, and simulated execution. It turns the current
prototype implementation into an explicitly bounded, testable UI contract.

## What Changes

- Define a shared control-room shell with navigation, concrete operational
  status, and route-preserving execution-queue filtering.
- Define an overview dashboard with health, account, risk, strategy, execution,
  analytics, and audit information, including a typed local-read-model boundary.
- Define a strategy laboratory with configuration fields, research quality
  gates, lifecycle feedback, and an analysis workspace.
- Define a backtest center with reproducible run snapshots, result views, and
  data-version-safe experiment comparison.
- Define a simulated-execution console with auditable signal/order/event data,
  composable filters, and a resume gate that preserves close and cancel actions
  while new exposure is blocked.
- Record that supplied prototype screenshots or Open Design node context are
  absent; visual matching is therefore a tracked acceptance dependency, not a
  completed claim.

## Capabilities

### New Capabilities

- `control-room-shell`: Shared desktop-first application shell, global status,
  navigation, and execution-queue handoff.
- `portfolio-overview`: Operational overview dashboard for health, account,
  risk, strategy, execution, analytics, and audit data.
- `strategy-laboratory`: Strategy configuration, validation gates, lifecycle
  actions, and analysis views.
- `backtest-center`: Reproducible backtest configuration, run reporting,
  results, and experiment comparison.
- `simulation-execution`: Simulated-execution signals, orders, risk state,
  filters, and audit timeline.

### Modified Capabilities

- None. There are no baseline OpenSpec capability specifications yet.

## Impact

- Affected frontend routes: `overview`, `lab`, `backtest`, and `simulation`.
- Affected frontend shell, fixtures/read models, components, and component tests
  under `apps/web/src`.
- No broker, market-data, account, or persistence API is introduced. Typed
  fixtures remain an explicitly local prototype read model; they must not be
  represented as live trading data or results.
- SRS traceability covers `SRS-FR-SHELL-001..005`, `SRS-FR-OV-001..010`,
  `SRS-FR-LAB-001..008`, `SRS-FR-BT-001..007`, and `SRS-FR-SIM-001..008`.
