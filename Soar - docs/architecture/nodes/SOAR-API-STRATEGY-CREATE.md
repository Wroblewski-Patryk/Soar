---
id: SOAR-API-STRATEGY-CREATE
name: "POST /dashboard/strategies"
type: api_route
status: verified_local
layer: backend
module: api-strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# POST /dashboard/strategies

| Field | Value |
| --- | --- |
| Description | Authenticated strategy create endpoint with config validation. |
| File path | apps/api/src/modules/strategies/strategies.routes.ts |
| Related files | apps/api/src/modules/strategies/strategies.controller.ts, apps/api/src/modules/strategies/strategies.service.ts |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-STRATEGIES]], [[SOAR-TYPES-STRATEGIES]], [[SOAR-SERVICE-STRATEGIES]], [[SOAR-SERVICE-STRATEGY-CONFIG-VALIDATION]] |
| Used by | [[SOAR-SERVICE-WEB-STRATEGIES]], [[SOAR-FEATURE-BOT-SETUP]] |
| UI related |  |
| API related | [[SOAR-API-STRATEGY-LIST]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-API]] |
| Docs related | [[SOAR-DOC-API-STRATEGIES]] |
| Agent related |  |
| Notes | Create path is consumed by bot setup later. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-STRATEGIES]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
