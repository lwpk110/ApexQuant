# Overview SDD Specification

**Scope:** `overview` route, corresponding to `SRS-FR-OV-001` through `SRS-FR-OV-010` and `AQ-OV-*` in `REQUIREMENTS-0.0.1.md`.

## Acceptance slices

1. The dashboard provides a labelled system-health strip with six concrete checks, including actual timestamps/counts rather than vague status text.
2. Risk metrics render as current value plus limit, never as a colour-only state.
3. Execution queue status is an accessible control that navigates to simulation with its selected status filter.
4. Pausing all strategies requires the exact confirmation text `确认暂停`, and preserves close/cancel availability in the resulting status message.
5. The shell exposes all eight required destinations and identifies the current destination.

## Deliberate implementation boundary

The initial view is supplied by typed fixtures. Future API work replaces the fixture module only; component props retain the SRS field names. No live broker operation is exposed.

