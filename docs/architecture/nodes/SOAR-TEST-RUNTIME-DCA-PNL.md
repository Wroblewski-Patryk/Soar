---
id: SOAR-TEST-RUNTIME-DCA-PNL
name: "Runtime DCA exchange PnL tests"
type: test
status: verified
layer: testing
module: bot-runtime
feature: runtime-dca-pnl
risk_level: critical
completion_percent: 100
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, test, testing, verified]
---

# Runtime DCA exchange PnL tests

| Field | Value |
| --- | --- |
| Description | Regression proving exchange PnL threshold truth for DCA automation. |
| File path | apps/api/src/modules/engine/runtimePositionAutomation.exchangePnl.test.ts |
| Related files | apps/api/src/modules/engine/positionManagement.service.test.ts |
| Parent | [[SOAR-FEATURE-RUNTIME-DCA-PNL]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-RUNTIME-DCA-PNL]] |
| Used by | [[SOAR-FEATURE-RUNTIME-DCA-PNL]] |
| UI related |  |
| API related | [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-POSITION-PNL-LIFECYCLE]] |
| Agent related |  |
| Notes | Production readback is separate. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
