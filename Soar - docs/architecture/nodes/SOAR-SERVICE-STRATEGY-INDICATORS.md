---
id: SOAR-SERVICE-STRATEGY-INDICATORS
name: "Strategy indicators service"
type: service
status: verified_local
layer: backend
module: api-strategies
feature: strategies
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Strategy indicators service

| Field | Value |
| --- | --- |
| Description | Strategy indicator catalog service exposed through the strategies indicators submodule. |
| File path | apps/api/src/modules/strategies/indicators/indicators.service.ts |
| Related files | apps/api/src/modules/strategies/indicators/indicators.controller.ts, apps/api/src/modules/strategies/indicators/indicators.routes.ts |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-STRATEGIES]] |
| Used by | [[SOAR-API-STRATEGY-INDICATORS]], [[SOAR-COMP-STRATEGY-FORM-SECTIONS]] |
| UI related |  |
| API related | [[SOAR-API-STRATEGY-INDICATORS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-STRATEGY-INDICATORS]] |
| Docs related | [[SOAR-DOC-API-STRATEGIES]] |
| Agent related |  |
| Notes | Indicator metadata feeds authoring UI. |

## Relations

- routes_to <- [[SOAR-API-STRATEGY-INDICATORS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
