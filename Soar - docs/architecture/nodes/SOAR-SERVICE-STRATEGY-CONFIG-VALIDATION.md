---
id: SOAR-SERVICE-STRATEGY-CONFIG-VALIDATION
name: "Strategy config validation service"
type: validation
status: verified_local
layer: backend
module: api-strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validation, backend, verified_local]
---

# Strategy config validation service

| Field | Value |
| --- | --- |
| Description | Backend strategy configuration validation including trailing close configuration constraints. |
| File path | apps/api/src/modules/strategies/strategyConfigValidation.ts |
| Related files | apps/api/src/modules/strategies/strategyConfigValidation.test.ts |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-STRATEGIES]] |
| Used by | [[SOAR-SERVICE-STRATEGIES]], [[SOAR-TYPES-STRATEGIES]] |
| UI related |  |
| API related | [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-IMPORT]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-API]] |
| Docs related | [[SOAR-DOC-API-STRATEGIES]] |
| Agent related |  |
| Notes | Config validation protects runtime strategy interpretation. |

## Relations

- uses <- [[SOAR-SERVICE-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
