---
id: SOAR-API-BACKTEST-RUN-CREATE
name: "POST /dashboard/backtests/runs"
type: api_route
status: verified_local
layer: backend
module: api-backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# POST /dashboard/backtests/runs

| Field | Value |
| --- | --- |
| Description | Authenticated backtest run create endpoint with strategy market-universe range and queue job setup. |
| File path | apps/api/src/modules/backtests/backtests.routes.ts |
| Related files | apps/api/src/modules/backtests/backtests.controller.ts, apps/api/src/modules/backtests/backtests.service.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BACKTESTS]], [[SOAR-TYPES-BACKTESTS]], [[SOAR-SERVICE-BACKTESTS]], [[SOAR-SERVICE-BACKTEST-RANGE]], [[SOAR-SERVICE-BACKTEST-RUN-QUEUE]] |
| Used by | [[SOAR-SERVICE-WEB-BACKTESTS]], [[SOAR-FEATURE-STRATEGIES]], [[SOAR-FEATURE-MARKETS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-GET]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]], [[SOAR-TEST-BACKTEST-REPLAY]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Create route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-BACKTESTS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
