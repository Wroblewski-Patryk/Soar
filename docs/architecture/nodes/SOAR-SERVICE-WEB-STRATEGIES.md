---
id: SOAR-SERVICE-WEB-STRATEGIES
name: "Web strategies API service"
type: service
status: verified_local
layer: frontend
module: web-strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web strategies API service

| Field | Value |
| --- | --- |
| Description | Typed frontend API client for strategy list get create update delete import export and indicator catalog calls. |
| File path | apps/web/src/features/strategies/api/strategies.api.ts |
| Related files | apps/web/src/features/strategies/types/StrategyForm.type.tsx |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-STRATEGY-FORM-MAPPER]], [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-GET]], [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-API-STRATEGY-INDICATORS]] |
| Used by | [[SOAR-COMP-STRATEGIES-LIST]], [[SOAR-COMP-STRATEGY-FORM]] |
| UI related | [[SOAR-COMP-STRATEGIES-LIST]], [[SOAR-COMP-STRATEGY-FORM]] |
| API related | [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-GET]], [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-API-STRATEGY-INDICATORS]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-WEB]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Frontend-to-backend strategy contract node. |

## Relations

- calls -> [[SOAR-API-STRATEGY-LIST]] (verified_local)
- calls -> [[SOAR-API-STRATEGY-GET]] (verified_local)
- calls -> [[SOAR-API-STRATEGY-CREATE]] (verified_local)
- calls -> [[SOAR-API-STRATEGY-UPDATE]] (verified_local)
- calls -> [[SOAR-API-STRATEGY-DELETE]] (verified_local)
- calls -> [[SOAR-API-STRATEGY-INDICATORS]] (verified_local)
- calls <- [[SOAR-COMP-STRATEGIES-LIST]] (verified_local)
- calls <- [[SOAR-COMP-STRATEGY-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
