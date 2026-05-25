---
id: SOAR-API-POSITION-LIVE-STATUS
name: "GET /dashboard/positions/live-status"
type: api_route
status: verified_local
layer: backend
module: api-positions
feature: positions
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/positions/live-status

| Field | Value |
| --- | --- |
| Description | Authenticated live reconciliation status route with user scoped diagnostics. |
| File path | apps/api/src/modules/positions/positions.routes.ts |
| Related files | apps/api/src/modules/positions/positions.controller.ts, apps/api/src/modules/positions/livePositionReconciliationLoop.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-POSITIONS]], [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] |
| Used by | [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-POSITIONS-RECONCILIATION]] |
| Docs related | [[SOAR-DOC-API-POSITIONS]], [[SOAR-DOC-LIVE-POSITION-RESTART]] |
| Agent related |  |
| Notes | Read-only status route for live reconciliation health. |

## Relations

- delegates -> [[SOAR-CONTROLLER-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
