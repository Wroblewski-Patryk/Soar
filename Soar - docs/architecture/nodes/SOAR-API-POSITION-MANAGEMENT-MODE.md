---
id: SOAR-API-POSITION-MANAGEMENT-MODE
name: "PATCH /dashboard/positions/:id/management-mode"
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

# PATCH /dashboard/positions/:id/management-mode

| Field | Value |
| --- | --- |
| Description | Authenticated management mode update route for BOT_MANAGED versus MANUAL_MANAGED state. |
| File path | apps/api/src/modules/positions/positions.routes.ts |
| Related files | apps/api/src/modules/positions/positions.controller.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-POSITIONS]], [[SOAR-TYPES-POSITIONS]], [[SOAR-SERVICE-POSITIONS]] |
| Used by | [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-POSITIONS-SERVICE]] |
| Docs related | [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Owner scoped management state transition. |

## Relations

- delegates -> [[SOAR-CONTROLLER-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
