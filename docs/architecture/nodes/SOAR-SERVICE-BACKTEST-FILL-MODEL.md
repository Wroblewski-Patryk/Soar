---
id: SOAR-SERVICE-BACKTEST-FILL-MODEL
name: "Backtest fill model"
type: service
status: verified_local
layer: backend
module: api-backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Backtest fill model

| Field | Value |
| --- | --- |
| Description | Backtest order fill model for simulated execution. |
| File path | apps/api/src/modules/backtests/backtestFillModel.ts |
| Related files | apps/api/src/modules/backtests/backtestFillModel.test.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-BACKTESTS]] |
| Used by | [[SOAR-SERVICE-BACKTEST-REPLAY-CORE]], [[SOAR-SERVICE-BACKTEST-RUN-JOB]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-CREATE]] |
| Database related | [[SOAR-DB-BACKTEST-TRADE]] |
| Tests related | [[SOAR-TEST-BACKTEST-REPLAY]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Fill model boundary. |

## Relations

- uses <- [[SOAR-SERVICE-BACKTEST-REPLAY-CORE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
