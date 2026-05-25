---
id: SOAR-SERVICE-STRATEGIES
name: "Strategies service"
type: service
status: verified_local
layer: backend
module: api-strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Strategies service

| Field | Value |
| --- | --- |
| Description | Strategy CRUD import export and delete/update protection service. |
| File path | apps/api/src/modules/strategies/strategies.service.ts |
| Related files | apps/api/src/modules/strategies/strategies.errors.ts |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-DB-STRATEGY]], [[SOAR-DB-BOT]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]], [[SOAR-SERVICE-STRATEGY-CONFIG-VALIDATION]] |
| Used by | [[SOAR-CONTROLLER-STRATEGIES]], [[SOAR-FEATURE-BOT-SETUP]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-GET]], [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-API-STRATEGY-IMPORT]], [[SOAR-API-STRATEGY-EXPORT]] |
| Database related | [[SOAR-DB-STRATEGY]], [[SOAR-DB-BOT]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Tests related | [[SOAR-TEST-STRATEGIES-API]] |
| Docs related | [[SOAR-DOC-API-STRATEGIES]] |
| Agent related |  |
| Notes | Service owns strategy persistence and conflict checks. |

## Relations

- validates_with -> [[SOAR-TYPES-STRATEGIES]] (verified_local)
- uses -> [[SOAR-SERVICE-STRATEGY-CONFIG-VALIDATION]] (verified_local)
- reads_writes -> [[SOAR-DB-STRATEGY]] (verified_local)
- guards_against -> [[SOAR-DB-BOT]] (verified_local)
- guards_against -> [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] (verified_local)
- calls <- [[SOAR-CONTROLLER-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
