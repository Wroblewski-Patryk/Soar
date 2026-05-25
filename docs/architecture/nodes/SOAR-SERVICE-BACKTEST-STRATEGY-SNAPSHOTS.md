---
id: SOAR-SERVICE-BACKTEST-STRATEGY-SNAPSHOTS
name: "Backtest strategy snapshots"
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

# Backtest strategy snapshots

| Field | Value |
| --- | --- |
| Description | Backtest immutable strategy link and context snapshot resolver. |
| File path | apps/api/src/modules/backtests/backtestStrategyLinkSnapshots.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-STRATEGIES]], [[SOAR-FEATURE-MARKETS]] |
| Used by | [[SOAR-SERVICE-BACKTESTS]], [[SOAR-SERVICE-BACKTEST-RUN-JOB]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-TIMELINE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Snapshot boundary. |

## Relations

- uses <- [[SOAR-SERVICE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
