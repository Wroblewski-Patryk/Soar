---
id: SOAR-TEST-STRATEGIES-API
name: "Strategies API tests"
type: test
status: verified_local
layer: testing
module: api-strategies
feature: strategies
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Strategies API tests

| Field | Value |
| --- | --- |
| Description | Strategies API e2e and validation tests for CRUD import export active-bot guards and linked-record protection. |
| File path | apps/api/src/modules/strategies/strategies.e2e.test.ts |
| Related files | apps/api/src/modules/strategies/strategyConfigValidation.test.ts, apps/api/src/modules/backtests/backtests.e2e.test.ts |
| Parent | [[SOAR-FEATURE-STRATEGIES]] |
| Children |  |
| Depends on | [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-DELETE]], [[SOAR-SERVICE-STRATEGIES]], [[SOAR-SERVICE-STRATEGY-CONFIG-VALIDATION]] |
| Used by | [[SOAR-FEATURE-STRATEGIES]] |
| UI related |  |
| API related | [[SOAR-API-STRATEGY-LIST]], [[SOAR-API-STRATEGY-CREATE]], [[SOAR-API-STRATEGY-UPDATE]], [[SOAR-API-STRATEGY-DELETE]] |
| Database related | [[SOAR-DB-STRATEGY]], [[SOAR-DB-BOT]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-STRATEGIES]] |
| Agent related |  |
| Notes | Primary API proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-STRATEGIES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
