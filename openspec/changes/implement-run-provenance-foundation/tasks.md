## 1. Domain Contracts

- [x] 1.1 Add immutable `RunRecord`, `AuditEvent`, and `ConfigVersion` models with validation and lifecycle states.
- [x] 1.2 Add repository protocols for runs, audit events, and configuration versions.

## 2. In-Memory Adapters

- [x] 2.1 Implement an in-memory provenance repository with run creation, lifecycle transitions, and immutable reads.
- [x] 2.2 Implement ordered per-run audit append/read and versioned configuration save/current/history operations.

## 3. Verification and Integration

- [x] 3.1 Add contract tests covering provenance isolation, lifecycle rejection, and configuration immutability.
- [x] 3.2 Run Python tests, compile checks, and OpenSpec status validation; record the result for PR review.
