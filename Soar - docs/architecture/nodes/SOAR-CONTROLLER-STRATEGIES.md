---
id: SOAR-CONTROLLER-STRATEGIES
name: "Strategies controller"
type: controller
status: verified_local
layer: backend
module: api-strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Strategies controller

| Field | Value |
| --- | --- |
| Description | Express strategies controller for auth checks import/export and strategy domain error mapping. |
| File path | apps/api/src/modules/strategies/strategies.controller.ts |
| Related files | apps/api/src/modules/strategies/strategies.errors.ts |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-STRATEGIES]] |
| Used by | [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-GET]], [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-API-STRATEGY-IMPORT]], [[SOAR-API-STRATEGY-EXPORT]] |
| UI related |  |
| API related | [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-GET]], [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-API-STRATEGY-IMPORT]], [[SOAR-API-STRATEGY-EXPORT]] |
| Database related | [[SOAR-DB-STRATEGY]], [[SOAR-DB-BOT]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Tests related | [[SOAR-TEST-STRATEGIES-API]] |
| Docs related | [[SOAR-DOC-API-STRATEGIES]] |
| Agent related |  |
| Notes | Controller maps strategy domain conflicts to HTTP errors. |

## Relations

- calls -> [[SOAR-SERVICE-STRATEGIES]] (verified_local)
- routes_to <- [[SOAR-API-STRATEGY-LIST]] (verified_local)
- routes_to <- [[SOAR-API-STRATEGY-GET]] (verified_local)
- routes_to <- [[SOAR-API-STRATEGY-CREATE]] (verified_local)
- routes_to <- [[SOAR-API-STRATEGY-UPDATE]] (verified_local)
- routes_to <- [[SOAR-API-STRATEGY-DELETE]] (verified_local)
- routes_to <- [[SOAR-API-STRATEGY-IMPORT]] (verified_local)
- routes_to <- [[SOAR-API-STRATEGY-EXPORT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
