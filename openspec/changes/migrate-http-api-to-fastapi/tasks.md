## 1. Dependencies and Application

- [x] 1.1 Add FastAPI and Uvicorn runtime dependencies
- [x] 1.2 Implement FastAPI app, shared MVP state, CORS and JSON serialization
- [x] 1.3 Add typed request/response models and global validation/not-found handlers

## 2. Route Migration

- [x] 2.1 Migrate health, overview, market, catalog, versions and runs routes
- [x] 2.2 Migrate backtest submission with domain error mapping and 201 response
- [x] 2.3 Switch CLI main entrypoint to Uvicorn while retaining host/port flags

## 3. Tests and Documentation

- [x] 3.1 Replace HTTPServer tests with FastAPI TestClient tests for all route contracts
- [x] 3.2 Add OpenAPI, validation, CORS and error envelope assertions
- [x] 3.3 Update MVP usage/development docs and run full backend/frontend verification
