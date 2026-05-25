---
id: SOAR-TYPES-STRATEGIES
name: "Strategy DTO schemas"
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

# Strategy DTO schemas

| Field | Value |
| --- | --- |
| Description | Strategy DTO and config schema boundary for CRUD import/export payloads. |
| File path | apps/api/src/modules/strategies/strategies.types.ts |
| Related files | apps/api/src/modules/strategies/strategyConfigValidation.ts |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-STRATEGY-CONFIG-VALIDATION]] |
| Used by | [[SOAR-CONTROLLER-STRATEGIES]], [[SOAR-SERVICE-STRATEGIES]] |
| UI related |  |
| API related | [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-IMPORT]] |
| Database related | [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-STRATEGIES-API]], [[SOAR-TEST-STRATEGY-FORM-UTILS]] |
| Docs related | [[SOAR-DOC-API-STRATEGIES]] |
| Agent related |  |
| Notes | Payload schema boundary. |

## Relations

- validates_with <- [[SOAR-SERVICE-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
