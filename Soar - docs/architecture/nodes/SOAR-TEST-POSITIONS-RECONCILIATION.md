---
id: SOAR-TEST-POSITIONS-RECONCILIATION
name: "Live position reconciliation tests"
type: test
status: verified_local
layer: testing
module: api-positions
feature: positions
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Live position reconciliation tests

| Field | Value |
| --- | --- |
| Description | LIVE position reconciliation service diagnostics status and continuity tests. |
| File path | apps/api/src/modules/positions/livePositionReconciliation.service.test.ts |
| Related files | apps/api/src/modules/positions/livePositionReconciliation.diagnostics.test.ts, apps/api/src/modules/positions/positions-live-status.e2e.test.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] |
| Used by | [[SOAR-FEATURE-POSITIONS]] |
| UI related |  |
| API related | [[SOAR-API-POSITION-LIVE-STATUS]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-LIVE-POSITION-RESTART]], [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Read-only reconciliation proof no live-money mutation. |

## Relations

- verified_by <- [[SOAR-FEATURE-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
