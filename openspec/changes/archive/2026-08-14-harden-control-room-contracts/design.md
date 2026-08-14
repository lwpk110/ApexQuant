## Context

The control-room pages use route-local fixtures and React state, with no server or broker side effects. The hardening pass adds fields and local controls that were present in the SRS but missing from the first implementation. Existing panel, table, queue, notice, and confirmation styles remain the visual contract.

## Goals / Non-Goals

**Goals:**

- Keep SRS fields visible and typed through focused page tests.
- Represent synchronization cancellation/logging and configuration safeguards as explicit local states.
- Preserve immutable data/config versions and simulation-only behavior.

**Non-Goals:**

- No backend, persistence, clipboard, external notification, or real-market integration.
- No redesign of the OD layout or global state store.

## Decisions

- Extend existing page-local read models and fixtures instead of adding a global store; this keeps the prototype deterministic and matches the existing architecture.
- Model cancel and log as local action feedback; cancellation must not create a new version, while completion creates a new current version and retains the prior one.
- Use native checkboxes for close/cancel safeguards and notification preferences so state is visible to keyboard and assistive technology.
- Add a focused red test before each behavior change, then run the page test and production build before updating task status.

## Risks / Trade-offs

- [Fixture values may be mistaken for live data] → Keep local-prototype labels and simulation-only copy on every affected page.
- [More fields increase narrow-screen density] → Keep tables horizontally scrollable and verify 1440px, 1180px, and 390px root overflow.
- [A canceled local sync could be mistaken for a persisted task state] → Explicitly label it canceled and state that no new version was created.
