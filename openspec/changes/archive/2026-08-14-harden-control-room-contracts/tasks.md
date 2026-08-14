## 1. Contract Tests

- [x] 1.1 Extend data-center tests for dataset type, missing buckets, explicit status, and synchronization cancel/log controls.
- [x] 1.2 Extend risk tests for total-leverage limit visibility.
- [x] 1.3 Extend settings tests for complete cost/default fields and close/cancel safeguards.

## 2. Implementation

- [x] 2.1 Add data inventory fields and local synchronization cancel/log/canceled feedback while retaining immutable version history.
- [x] 2.2 Add total-leverage limit row to the risk panel.
- [x] 2.3 Add complete settings defaults and explicit safeguard/notification controls.

## 3. Verification

- [x] 3.1 Run page-focused red-green tests and the full frontend suite.
- [x] 3.2 Run production build and verify all eight routes at 1440px, 1180px, and 390px with no root overflow or console errors.
