---
id: SOAR-SERVICE-BACKTESTS
name: "Backtests service"
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

# Backtests service

| Field | Value |
| --- | --- |
| Description | Backtest run lifecycle read model timeline report and queue orchestration service. |
| File path | apps/api/src/modules/backtests/backtests.service.ts |
| Related files | apps/api/src/modules/backtests/backtests.repository.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BACKTEST-RANGE]], [[SOAR-SERVICE-BACKTEST-RUN-JOB]], [[SOAR-SERVICE-BACKTEST-RUN-QUEUE]], [[SOAR-SERVICE-BACKTEST-REPORT-LIFECYCLE]], [[SOAR-SERVICE-BACKTEST-STRATEGY-SNAPSHOTS]], [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Used by | [[SOAR-CONTROLLER-BACKTESTS]], [[SOAR-FEATURE-REPORTS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-GET]], [[SOAR-API-BACKTEST-RUN-TRADES]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-DELETE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]], [[SOAR-TEST-BACKTEST-REPLAY]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Service owns run lifecycle. |

## Relations

- uses -> [[SOAR-SERVICE-BACKTEST-RANGE]] (verified_local)
- uses -> [[SOAR-SERVICE-BACKTEST-RUN-QUEUE]] (verified_local)
- uses -> [[SOAR-SERVICE-BACKTEST-STRATEGY-SNAPSHOTS]] (verified_local)
- reads_writes -> [[SOAR-DB-BACKTEST-RUN]] (verified_local)
- calls <- [[SOAR-CONTROLLER-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
