---
id: SOAR-SERVICE-BACKTEST-RUN-QUEUE
name: "Backtest run queue"
type: queue
status: verified_local
layer: backend
module: api-backtests
feature: backtests
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, queue, backend, verified_local]
---

# Backtest run queue

| Field | Value |
| --- | --- |
| Description | Backtest run queue wrapper for controlled job execution. |
| File path | apps/api/src/modules/backtests/backtestRunQueue.ts |
| Related files | apps/api/src/modules/backtests/backtestRunQueue.test.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BACKTEST-RUN-JOB]] |
| Used by | [[SOAR-SERVICE-BACKTESTS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-CREATE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Queue execution boundary. |

## Relations

- executes -> [[SOAR-SERVICE-BACKTEST-RUN-JOB]] (verified_local)
- uses <- [[SOAR-SERVICE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
