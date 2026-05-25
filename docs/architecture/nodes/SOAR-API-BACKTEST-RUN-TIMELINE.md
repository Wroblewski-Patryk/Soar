---
id: SOAR-API-BACKTEST-RUN-TIMELINE
name: "GET /dashboard/backtests/runs/:id/timeline"
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

# GET /dashboard/backtests/runs/:id/timeline

| Field | Value |
| --- | --- |
| Description | Authenticated backtest timeline endpoint for replay context chunks indicators candles and events. |
| File path | apps/api/src/modules/backtests/backtests.routes.ts |
| Related files | apps/api/src/modules/backtests/backtests.controller.ts, apps/api/src/modules/backtests/backtests.service.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BACKTESTS]], [[SOAR-TYPES-BACKTESTS]], [[SOAR-SERVICE-BACKTESTS]], [[SOAR-SERVICE-BACKTEST-RANGE]], [[SOAR-SERVICE-BACKTEST-REPLAY-CORE]] |
| Used by | [[SOAR-SERVICE-WEB-BACKTESTS]], [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-GET]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]], [[SOAR-TEST-BACKTEST-REPLAY]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Timeline route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-BACKTESTS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
