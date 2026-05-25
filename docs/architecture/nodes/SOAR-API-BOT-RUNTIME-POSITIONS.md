---
id: SOAR-API-BOT-RUNTIME-POSITIONS
name: "GET bot runtime positions"
type: api_route
status: partially_verified
layer: backend
module: api-bots
feature: dashboard-runtime
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-23
verification_status: partially_verified
tags: [soar-map, api_route, backend, partially_verified]
---

# GET bot runtime positions

| Field | Value |
| --- | --- |
| Description | Runtime positions read endpoints consumed by dashboard and bot monitoring views. |
| File path | apps/api/src/modules/bots/bots.routes.ts |
| Related files | apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts, apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts |
| Parent | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]] |
| Used by | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Route-family node until route-level backfill enumerates exact endpoints. |

## Relations

- reads -> [[SOAR-DB-RUNTIME-SESSION]] (partially_verified)
- reads -> [[SOAR-DB-POSITION]] (partially_verified)
- delegates -> [[SOAR-CONTROLLER-BOTS]] (verified_local)
- calls <- [[SOAR-COMP-HOME-LIVE-WIDGETS]] (partially_verified)
- calls <- [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
