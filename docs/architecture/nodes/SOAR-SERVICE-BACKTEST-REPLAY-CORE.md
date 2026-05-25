---
id: SOAR-SERVICE-BACKTEST-REPLAY-CORE
name: "Backtest replay core"
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

# Backtest replay core

| Field | Value |
| --- | --- |
| Description | Backtest replay and portfolio simulation core with runtime-kernel parity checks. |
| File path | apps/api/src/modules/backtests/backtestReplayCore.ts |
| Related files | apps/api/src/modules/backtests/backtestPortfolioSimulation.service.ts, apps/api/src/modules/backtests/backtestRuntimeKernelParity.test.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-STRATEGIES]], [[SOAR-SERVICE-BACKTEST-FILL-MODEL]], [[SOAR-SERVICE-BACKTEST-DATA-GATEWAY]] |
| Used by | [[SOAR-SERVICE-BACKTEST-RUN-JOB]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-TIMELINE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]] |
| Tests related | [[SOAR-TEST-BACKTEST-REPLAY]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Replay core boundary. |

## Relations

- uses -> [[SOAR-SERVICE-BACKTEST-FILL-MODEL]] (verified_local)
- uses <- [[SOAR-SERVICE-BACKTEST-RUN-JOB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
