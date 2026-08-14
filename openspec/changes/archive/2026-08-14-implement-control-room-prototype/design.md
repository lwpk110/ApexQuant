## Context

The repository contains a Vite/React/TypeScript frontend and a Python domain
layer. Four frontend screens are already prototyped using typed fixtures, while
the SRS defines a substantially richer field and workflow contract. No broker,
market-data, account, or persistence service is connected. The expected Open
Design/Figma node context and screenshots are unavailable, so an exact visual
comparison cannot yet be asserted.

## Goals / Non-Goals

**Goals:**

- Make the four prototype screens traceable to the SRS through OpenSpec
  requirements, scenarios, implementation tasks, tests, and visual evidence.
- Keep operational facts, run IDs, strategy versions, and data versions visible
  at the point of use.
- Model fixtures as replaceable, typed read models without suggesting that they
  are real trading or market-data results.
- Enforce data-quality gates as interaction state, not only warning styling.

**Non-Goals:**

- Broker connectivity, live orders, persisted accounts, authentication, or
  production market-data ingestion.
- Completion claims for a 1:1 visual recreation before source prototype nodes
  and screenshots are supplied.
- Implementation of the other four SRS destinations in this change.

## Decisions

### Route-local, typed read models

Each route consumes a typed fixture/read-model module that mirrors its displayed
SRS fields. This keeps the current prototype deterministic and makes a future
API adapter replacement local to the fixture boundary. Passing opaque ad-hoc
objects through components was rejected because it loses field-level contract
checking.

### Local interaction state for prototype workflows

Filters, analysis tabs, quality gates, and confirmation state remain local React
state. The application shell owns destination and navigation state so queue and
alert handoffs can preserve a filter. Introducing a global state framework was
rejected because no cross-session server state exists yet.

### Explicit domain identifiers in UI contracts

Run IDs, strategy versions, data versions, snapshot IDs, batch IDs, timestamps,
and concrete error/rejection information are required UI fields. This makes
auditability testable now and maps directly to future API DTOs.

### Gate precedence

Minute-data delay above 90 seconds and missing buckets block validation,
simulation resume, and new opening exposure. Save-draft, close, cancel, and
risk-handling actions stay available. The gate is displayed with the observed
reason and a repair path. A single generic disabled state was rejected because
it hides both the cause and allowed recovery work.

### Verification layers

For each scenario, add a focused component test before implementation change,
then run the test suite, production build, and browser checks at 1440px, 1180px,
and a mobile viewport. Prototype fidelity remains an open acceptance dependency
until node context or screenshots are available.

## Risks / Trade-offs

- [Fixture values drift from eventual APIs] → Keep fixtures explicitly labelled
  as local read models and introduce DTO contract tests before API integration.
- [Current UI omits SRS fields] → Treat every omitted field as a pending task;
  do not mark the capability complete solely because the page renders.
- [Visual differences cannot be judged without source] → Maintain the prototype
  input gap in traceability and attach comparative screenshots once supplied.
- [Route state is not URL-persistent] → Add URL-state tests and routing when
  the server/API boundary is introduced; preserve state in the shell meanwhile.

## Migration Plan

1. Add the formal specs and use them as the source of acceptance tests.
2. Close implementation gaps one capability at a time using red-green TDD.
3. Replace each fixture boundary with an API DTO adapter only after its contract
   tests exist; preserve displayed identifiers and gate semantics.
4. Capture source prototype inputs and run visual comparison before declaring
   prototype fidelity verified.

Rollback is a frontend-only deployment rollback. No migrations or external
state changes occur in this change.

## Open Questions

- Which Open Design project, node IDs, and reference screenshots define the
  visual baseline for the four screens?
- Which API transport and persistence model will own the future read models and
  run/action commands?
- Should queue and alert filters be encoded in the URL before API integration?
