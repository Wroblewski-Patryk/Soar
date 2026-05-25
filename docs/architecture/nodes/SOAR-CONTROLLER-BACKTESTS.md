---
id: SOAR-CONTROLLER-BACKTESTS
name: "Backtests controller"
type: controller
status: verified_local
layer: backend
module: api-backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Backtests controller

| Field | Value |
| --- | --- |
| Description | Express backtests controller for auth checks DTO parsing run lifecycle trades report and timeline responses. |
| File path | apps/api/src/modules/backtests/backtests.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-TYPES-BACKTESTS]], [[SOAR-SERVICE-BACKTESTS]] |
| Used by | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-GET]], [[SOAR-API-BACKTEST-RUN-TRADES]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-DELETE]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-GET]], [[SOAR-API-BACKTEST-RUN-TRADES]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-DELETE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-BACKTEST-REPORT]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Controller maps backtest requests. |

## Relations

- validates_with -> [[SOAR-TYPES-BACKTESTS]] (verified_local)
- calls -> [[SOAR-SERVICE-BACKTESTS]] (verified_local)
- routes_to <- [[SOAR-API-BACKTEST-RUN-LIST]] (verified_local)
- routes_to <- [[SOAR-API-BACKTEST-RUN-CREATE]] (verified_local)
- routes_to <- [[SOAR-API-BACKTEST-RUN-TIMELINE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
