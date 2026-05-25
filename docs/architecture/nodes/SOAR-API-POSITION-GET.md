---
id: SOAR-API-POSITION-GET
name: "GET /dashboard/positions/:id"
type: api_route
status: verified_local
layer: backend
module: api-positions
feature: positions
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/positions/:id

| Field | Value |
| --- | --- |
| Description | Authenticated single position read route. |
| File path | apps/api/src/modules/positions/positions.routes.ts |
| Related files | apps/api/src/modules/positions/positions.controller.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-POSITIONS]] |
| Used by | [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-POSITIONS-SERVICE]] |
| Docs related | [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Owner scoped getPosition service query. |

## Relations

- delegates -> [[SOAR-CONTROLLER-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
