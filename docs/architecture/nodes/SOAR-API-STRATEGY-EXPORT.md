---
id: SOAR-API-STRATEGY-EXPORT
name: "GET /dashboard/strategies/:id/export"
type: api_route
status: verified_local
layer: backend
module: api-strategies
feature: strategies
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/strategies/:id/export

| Field | Value |
| --- | --- |
| Description | Authenticated strategy export endpoint for portable strategy payloads. |
| File path | apps/api/src/modules/strategies/strategies.routes.ts |
| Related files | apps/api/src/modules/strategies/strategies.controller.ts, apps/api/src/modules/strategies/strategies.service.ts |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-STRATEGIES]], [[SOAR-SERVICE-STRATEGIES]] |
| Used by | [[SOAR-SERVICE-WEB-STRATEGIES]] |
| UI related |  |
| API related | [[SOAR-API-STRATEGY-GET]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-API]] |
| Docs related | [[SOAR-DOC-API-STRATEGIES]] |
| Agent related |  |
| Notes | Export keeps strategy portability explicit. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
