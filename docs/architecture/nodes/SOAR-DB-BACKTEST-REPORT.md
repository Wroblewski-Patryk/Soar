---
id: SOAR-DB-BACKTEST-REPORT
name: "BacktestReport model"
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

# BacktestReport model

| Field | Value |
| --- | --- |
| Description | BacktestReport model for report metrics and lifecycle output. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-DB-BACKTEST-RUN]] |
| Used by | [[SOAR-FEATURE-BACKTESTS]], [[SOAR-FEATURE-REPORTS]] |
| UI related | [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| API related | [[SOAR-API-BACKTEST-RUN-REPORT]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Report persistence. |

## Relations

- reads_writes <- [[SOAR-SERVICE-BACKTEST-REPORT-LIFECYCLE]] (verified_local)
- reads <- [[SOAR-SERVICE-REPORTS]] (verified_local)
- aggregates <- [[SOAR-SERVICE-REPORT-MODE-AGGREGATOR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
