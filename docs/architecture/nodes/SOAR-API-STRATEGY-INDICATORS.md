---
id: SOAR-API-STRATEGY-INDICATORS
name: "GET /dashboard/strategies/indicators"
type: api_route
status: verified_local
layer: backend
module: api-strategies
feature: strategies
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/strategies/indicators

| Field | Value |
| --- | --- |
| Description | Authenticated strategy indicator catalog endpoint. |
| File path | apps/api/src/modules/strategies/indicators/indicators.routes.ts |
| Related files | apps/api/src/modules/strategies/indicators/indicators.controller.ts, apps/api/src/modules/strategies/indicators/indicators.service.ts |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-STRATEGY-INDICATORS]] |
| Used by | [[SOAR-SERVICE-WEB-STRATEGIES]], [[SOAR-COMP-STRATEGY-FORM-SECTIONS]] |
| UI related | [[SOAR-COMP-STRATEGY-FORM-SECTIONS]] |
| API related | [[SOAR-SERVICE-STRATEGY-INDICATORS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-STRATEGY-INDICATORS]], [[SOAR-TEST-STRATEGIES-WEB]] |
| Docs related | [[SOAR-DOC-API-STRATEGIES]] |
| Agent related |  |
| Notes | Indicator catalog route feeds form metadata. |

## Relations

- routes_to -> [[SOAR-SERVICE-STRATEGY-INDICATORS]] (verified_local)
- reads <- [[SOAR-COMP-STRATEGY-FORM-SECTIONS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
