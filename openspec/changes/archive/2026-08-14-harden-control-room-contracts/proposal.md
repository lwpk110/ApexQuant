## Why

The first prototype pass exposed contract gaps between the SRS tables and the local pages: data inventory fields, cancellable synchronization, total-leverage limits, and explicit operating safeguards were not all represented. The current local implementation needs a small SDD-tracked hardening pass so the prototype remains a faithful, testable requirements baseline.

## What Changes

- Add dataset type, missing-bucket count, and explicit status fields to the data inventory.
- Add local synchronization cancel, log, and canceled-state feedback while preserving immutable versions.
- Add total-leverage limit readout to the risk-limit panel.
- Add minimum commission, Shanghai transfer fee, price rounding, order timeout, market-delay threshold, and explicit close/cancel safeguards to settings.
- Keep all behavior local and simulation-only; no external side effects.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `account-risk-management`: risk-limit read model includes total leverage.
- `data-quality-center`: inventory and synchronization contracts expose missing buckets and cancel/log state.
- `configuration-management`: settings expose complete cost/default/safeguard fields and controls.

## Impact

Affected files are the existing React pages/tests under `apps/web/src/pages`, SDD traceability docs, and the three main OpenSpec capability specs. No API, database, broker, or dependency changes are introduced.
