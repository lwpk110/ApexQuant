## ADDED Requirements

### Requirement: Health and overview API
The server MUST expose `GET /api/health` and `GET /api/overview` with JSON success envelopes and CORS headers. Health MUST include service status, timezone, and real-broker-disabled state.

#### Scenario: Check local health
- **WHEN** a client requests `/api/health`
- **THEN** the server returns HTTP 200 JSON with `status`, `timezone`, and `realBroker: false`

#### Scenario: Read overview
- **WHEN** a client requests `/api/overview`
- **THEN** the server returns a JSON object containing health checks, account summary, and active run information

### Requirement: Backtest submission API
The server MUST accept `POST /api/backtests` with strategy/data/cost versions, seed, ISO dates, and initial capital. A valid request MUST return HTTP 201 with a run ID and `running` or `completed` status; invalid JSON or fields MUST return HTTP 400 using the standard error envelope.

#### Scenario: Submit valid backtest
- **WHEN** the client submits a complete valid snapshot
- **THEN** the response contains a run ID, provenance fields, and a deterministic metrics snapshot

#### Scenario: Reject malformed request
- **WHEN** the client omits a required version or sends an invalid date
- **THEN** the server returns HTTP 400 with an actionable error code and message

### Requirement: Data version API
The server MUST expose `GET /api/data/versions?datasetId=...` and return current/history versions with quality status. Unknown datasets MUST return an empty history rather than an HTML error.

#### Scenario: Read data history
- **WHEN** a client requests a dataset's versions
- **THEN** the response contains `current` and `history` JSON fields

### Requirement: Frontend API fallback
The frontend MUST request health and backtest APIs through a single client module. Network or HTTP errors MUST preserve the fixture view and show a visible backend-offline status.

#### Scenario: Backend unavailable
- **WHEN** a page loads while the API is unreachable
- **THEN** the page remains rendered and exposes a non-color-only “后端未连接” status
