---
id: SOAR-TEST-BACKTEST-REPLAY
name: "Backtest replay tests"
type: test
status: verified_local
layer: testing
module: api-backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Backtest replay tests

| Field | Value |
| --- | --- |
| Description | Backtest replay data gateway fill model indicator timeline and runtime-kernel parity tests. |
| File path | apps/api/src/modules/backtests/backtestReplayCore.test.ts |
| Related files | apps/api/src/modules/backtests/backtestRuntimeKernelParity.test.ts, apps/api/src/modules/backtests/backtestDataGateway.test.ts, apps/api/src/modules/backtests/backtestFillModel.test.ts, apps/api/src/modules/backtests/backtestIndicatorTimelineSeries.test.ts, apps/api/src/modules/backtests/backtestPatternParityFixtures.test.ts, apps/api/src/modules/backtests/backtestParity3Symbols.test.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BACKTEST-REPLAY-CORE]], [[SOAR-SERVICE-BACKTEST-DATA-GATEWAY]], [[SOAR-SERVICE-BACKTEST-FILL-MODEL]] |
| Used by | [[SOAR-FEATURE-BACKTESTS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-TIMELINE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Replay proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
