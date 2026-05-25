---
id: SOAR-SERVICE-BACKTEST-RUN-JOB
name: "Backtest run job"
type: worker
status: verified_local
layer: backend
module: api-backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, worker, backend, verified_local]
---

# Backtest run job

| Field | Value |
| --- | --- |
| Description | Backtest run job processor that executes replay and persists report/trades. |
| File path | apps/api/src/modules/backtests/backtestRunJob.ts |
| Related files | apps/api/src/modules/backtests/backtestRunJob.test.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BACKTEST-DATA-GATEWAY]], [[SOAR-SERVICE-BACKTEST-REPLAY-CORE]], [[SOAR-SERVICE-BACKTEST-REPORT-LIFECYCLE]], [[SOAR-SERVICE-BACKTEST-FILL-MODEL]] |
| Used by | [[SOAR-SERVICE-BACKTEST-RUN-QUEUE]], [[SOAR-SERVICE-BACKTESTS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-CREATE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-BACKTEST-REPORT]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]], [[SOAR-TEST-BACKTEST-REPLAY]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Job execution boundary. |

## Relations

- uses -> [[SOAR-SERVICE-BACKTEST-DATA-GATEWAY]] (verified_local)
- uses -> [[SOAR-SERVICE-BACKTEST-REPLAY-CORE]] (verified_local)
- uses -> [[SOAR-SERVICE-BACKTEST-REPORT-LIFECYCLE]] (verified_local)
- writes -> [[SOAR-DB-BACKTEST-TRADE]] (verified_local)
- executes <- [[SOAR-SERVICE-BACKTEST-RUN-QUEUE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
