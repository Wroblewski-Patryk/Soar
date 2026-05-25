---
id: SOAR-API-POSITION-ORPHAN-REPAIR
name: "POST /dashboard/positions/orphan-repair"
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

# POST /dashboard/positions/orphan-repair

| Field | Value |
| --- | --- |
| Description | Authenticated local orphan repair plus exchange reconciliation and takeover rebind route. |
| File path | apps/api/src/modules/positions/positions.routes.ts |
| Related files | apps/api/src/modules/positions/positions.controller.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-POSITIONS]], [[SOAR-SERVICE-POSITIONS]], [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] |
| Used by | [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-POSITIONS-TAKEOVER-ORPHAN]] |
| Docs related | [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Repair flow avoids guessing ambiguous strategy provenance. |

## Relations

- delegates -> [[SOAR-CONTROLLER-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
