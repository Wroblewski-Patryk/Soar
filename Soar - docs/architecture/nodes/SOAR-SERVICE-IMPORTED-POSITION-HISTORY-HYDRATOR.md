---
id: SOAR-SERVICE-IMPORTED-POSITION-HISTORY-HYDRATOR
name: "Imported position history hydrator service"
type: service
status: verified_local
layer: backend
module: api-positions
feature: market-data-stream-adapters
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Imported position history hydrator service

| Field | Value |
| --- | --- |
| Description | Imported position history hydrator for recovered exchange positions and historical continuity. |
| File path | apps/api/src/modules/positions/importedPositionHistoryHydrator.service.ts |
| Related files | apps/api/src/modules/positions/importedPositionHistoryHydrator.service.test.ts |
| Parent | [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]], [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Used by | [[SOAR-SERVICE-POSITIONS]], [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] |
| UI related |  |
| API related | [[SOAR-API-POSITION-LIVE-STATUS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] |
| Docs related | [[SOAR-DOC-LIVE-POSITION-RESTART]], [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Imported position history continuity. |

## Relations

- supports -> [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] (verified_local)
- reads_writes -> [[SOAR-DB-POSITION]] (verified_local)
- verified_by -> [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
