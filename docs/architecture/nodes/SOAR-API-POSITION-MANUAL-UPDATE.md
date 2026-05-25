---
id: SOAR-API-POSITION-MANUAL-UPDATE
name: "PATCH /dashboard/positions/:id/manual-update"
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

# PATCH /dashboard/positions/:id/manual-update

| Field | Value |
| --- | --- |
| Description | Authenticated manual TP SL notes and lock-rule update route for open positions. |
| File path | apps/api/src/modules/positions/positions.routes.ts |
| Related files | apps/api/src/modules/positions/positions.controller.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-POSITIONS]], [[SOAR-TYPES-POSITIONS]], [[SOAR-SERVICE-POSITIONS]] |
| Used by | [[SOAR-WEB-POSITIONS-SERVICE]], [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| UI related | [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| API related | [[SOAR-CONTROLLER-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-POSITIONS-SERVICE]], [[SOAR-TEST-WEB-POSITIONS]] |
| Docs related | [[SOAR-DOC-API-POSITIONS]], [[SOAR-DOC-WEB-POSITIONS]] |
| Agent related |  |
| Notes | Rejects closed positions and invalid side-aware TP SL ranges. |

## Relations

- delegates -> [[SOAR-CONTROLLER-POSITIONS]] (verified_local)
- calls <- [[SOAR-WEB-POSITIONS-SERVICE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
