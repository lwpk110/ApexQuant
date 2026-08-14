## Context

The eight control-room pages are local React prototype surfaces. The OD prototype emphasizes dense tables with predictable tools and explicit safety feedback, while this iteration must remain side-effect free.

## Decisions

- Keep interactions page-local and synchronous; use accessible status text for feedback instead of external services.
- Preserve stable identifiers (dataset ID, run ID, source run ID) in every export, row action, snapshot, and failure detail.
- Treat selected strategy and data versions as immutable once a backtest run starts; render a `locked` snapshot marker.
- Keep dangerous simulation controls behind the existing confirmation phrase and expose a visible, accessible paused notice.

## Verification

- Component tests assert each new interaction and its feedback text.
- Full Vitest suite and production build must pass.
- Browser verification covers all eight routes at desktop and mobile widths, including no horizontal overflow and no console errors.
