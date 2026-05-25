---
id: SOAR-TYPES-BACKTESTS
name: "Backtest DTO schemas"
type: validation
status: verified_local
layer: backend
module: api-backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validation, backend, verified_local]
---

# Backtest DTO schemas

| Field | Value |
| --- | --- |
| Description | Backtest create list trades and timeline query schemas. |
| File path | apps/api/src/modules/backtests/backtests.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-BACKTESTS]] |
| Used by | [[SOAR-CONTROLLER-BACKTESTS]], [[SOAR-SERVICE-BACKTESTS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-TRADES]], [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-API-BACKTEST-RUN-CREATE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | DTO contract node. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
