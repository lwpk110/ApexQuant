## Why

The control-room prototype now exposes the core eight pages, but several table and run interactions required by the OD prototype were only partially represented. Capturing these behaviors as explicit SDD contracts prevents future iterations from silently dropping export, row context, snapshot provenance, or safety feedback.

## What Changes

- Add explicit table-tool contracts for data and run-record exports, column visibility, diagnostics, and row-level actions.
- Require run records to expose structured failure details and source run provenance.
- Require backtest runs to lock the selected strategy/data snapshot and provide local run-ID feedback.
- Require simulation pause actions to expose an accessible paused state.

## Capabilities

### New Capabilities
- `table-interactions`: Shared interaction expectations for control-room tables and local feedback.

### Modified Capabilities
- `data-quality-center`: Add dataset table tools, diagnostics, and cancelable sync feedback.
- `run-records`: Add export, row-level context actions, and structured failure provenance.
- `backtest-center`: Add locked strategy/data run snapshots and copy-ID feedback.
- `simulation-execution`: Add accessible paused-state feedback after pausing new entries.

## Impact

Affected React pages and tests under `apps/web/src/pages`, plus the corresponding OpenSpec capabilities. No backend, broker, market-data, clipboard, or notification side effects are introduced; all values remain local prototype snapshots.
