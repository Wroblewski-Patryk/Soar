---
id: SOAR-DB-BACKTEST-TRADE
name: "BacktestTrade model"
type: database_model
status: verified_local
layer: data
module: backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, database_model, data, verified_local]
---

# BacktestTrade model

| Field | Value |
| --- | --- |
| Description | BacktestTrade model for simulated trade events. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-DB-BACKTEST-RUN]] |
| Used by | [[SOAR-FEATURE-BACKTESTS]], [[SOAR-FEATURE-REPORTS]] |
| UI related | [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| API related | [[SOAR-API-BACKTEST-RUN-TRADES]], [[SOAR-API-BACKTEST-RUN-TIMELINE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]], [[SOAR-TEST-BACKTEST-REPLAY]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Simulated trade persistence. |

## Relations

- writes <- [[SOAR-SERVICE-BACKTEST-RUN-JOB]] (verified_local)
- reads <- [[SOAR-FEATURE-REPORTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
