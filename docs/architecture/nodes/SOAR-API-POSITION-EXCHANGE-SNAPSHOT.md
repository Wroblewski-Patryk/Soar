---
id: SOAR-API-POSITION-EXCHANGE-SNAPSHOT
name: "GET /dashboard/positions/exchange-snapshot"
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

# GET /dashboard/positions/exchange-snapshot

| Field | Value |
| --- | --- |
| Description | Authenticated exchange positions snapshot route behind operation capability checks. |
| File path | apps/api/src/modules/positions/positions.routes.ts |
| Related files | apps/api/src/modules/positions/positions.controller.ts |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-POSITIONS]], [[SOAR-SERVICE-POSITIONS]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-POSITIONS-SNAPSHOT]] |
| Docs related | [[SOAR-DOC-API-POSITIONS]] |
| Agent related |  |
| Notes | Uses decrypted key only in process and fails closed on unsupported operation. |

## Relations

- delegates -> [[SOAR-CONTROLLER-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
