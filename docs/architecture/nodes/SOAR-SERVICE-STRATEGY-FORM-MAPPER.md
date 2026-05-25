---
id: SOAR-SERVICE-STRATEGY-FORM-MAPPER
name: "Strategy form mapper"
type: utility
status: verified_local
layer: frontend
module: web-strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, utility, frontend, verified_local]
---

# Strategy form mapper

| Field | Value |
| --- | --- |
| Description | Frontend mapper that converts strategy form state into API payloads and normalizes edit values. |
| File path | apps/web/src/features/strategies/utils/StrategyForm.map.ts |
| Related files | apps/web/src/features/strategies/utils/strategyNumericInput.ts, apps/web/src/features/strategies/utils/strategyCloseValidation.ts |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-DOC-WEB-STRATEGIES]] |
| Used by | [[SOAR-SERVICE-WEB-STRATEGIES]], [[SOAR-COMP-STRATEGY-FORM]] |
| UI related | [[SOAR-COMP-STRATEGY-FORM]] |
| API related | [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGY-FORM-UTILS]] |
| Docs related | [[SOAR-DOC-WEB-STRATEGIES]] |
| Agent related |  |
| Notes | Mapper is the UI-to-API payload evidence point. |

## Relations

- uses <- [[SOAR-COMP-STRATEGY-FORM]] (verified_local)
- uses <- [[SOAR-COMP-SORTABLE-THRESHOLD-LIST-EDITOR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
