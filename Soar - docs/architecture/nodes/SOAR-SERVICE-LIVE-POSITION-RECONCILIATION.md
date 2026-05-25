---
id: SOAR-SERVICE-LIVE-POSITION-RECONCILIATION
name: "Live position reconciliation service"
type: service
status: verified_local
layer: backend
module: api-positions
feature: positions
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Live position reconciliation service

| Field | Value |
| --- | --- |
| Description | LIVE exchange position reconciliation loop and service for imported recovered and missing exchange synced positions. |
| File path | apps/api/src/modules/positions/livePositionReconciliation.service.ts |
| Related files | apps/api/src/modules/positions/livePositionReconciliationLoop.ts, apps/api/src/modules/positions/livePositionReconciliationContext.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-POSITIONS]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-SERVICE-RUNTIME-AUTOMATION]], [[SOAR-DB-POSITION]] |
| Used by | [[SOAR-API-POSITION-LIVE-STATUS]], [[SOAR-API-POSITION-ORPHAN-REPAIR]] |
| UI related |  |
| API related | [[SOAR-API-POSITION-LIVE-STATUS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-POSITIONS-RECONCILIATION]] |
| Docs related | [[SOAR-DOC-LIVE-POSITION-RESTART]], [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | No LIVE mutation proof is implied by reconciliation graph records. |

## Relations

- uses -> [[SOAR-SERVICE-POSITIONS]] (verified_local)
- reads_writes -> [[SOAR-DB-POSITION]] (verified_local)
- uses -> [[SOAR-SERVICE-RUNTIME-AUTOMATION]] (verified_local)
- governed_by -> [[SOAR-DOC-LIVE-POSITION-RESTART]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-AUTH-READ]] (verified_local)
- uses <- [[SOAR-CONTROLLER-POSITIONS]] (verified_local)
- uses <- [[SOAR-SERVICE-RUNTIME-POSITIONS-READ]] (verified_local)
- feeds <- [[SOAR-SERVICE-BINANCE-USER-DATA-STREAM]] (verified_local)
- supports <- [[SOAR-SERVICE-IMPORTED-POSITION-HISTORY-HYDRATOR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
