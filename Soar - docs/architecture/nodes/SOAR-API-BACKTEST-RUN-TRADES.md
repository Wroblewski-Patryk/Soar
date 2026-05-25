---
id: SOAR-API-BACKTEST-RUN-TRADES
name: "GET /dashboard/backtests/runs/:id/trades"
type: api_route
status: verified_local
layer: backend
module: api-backtests
feature: backtests
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/backtests/runs/:id/trades

| Field | Value |
| --- | --- |
| Description | Authenticated backtest run trades endpoint. |
| File path | apps/api/src/modules/backtests/backtests.routes.ts |
| Related files | apps/api/src/modules/backtests/backtests.controller.ts, apps/api/src/modules/backtests/backtests.service.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BACKTESTS]], [[SOAR-TYPES-BACKTESTS]], [[SOAR-SERVICE-BACKTESTS]] |
| Used by | [[SOAR-SERVICE-WEB-BACKTESTS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-REPORT]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Trades route. |

## Relations

- calls <- [[SOAR-SERVICE-WEB-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
