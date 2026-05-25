---
id: SOAR-API-BACKTEST-RUN-LIST
name: "GET /dashboard/backtests/runs"
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

# GET /dashboard/backtests/runs

| Field | Value |
| --- | --- |
| Description | Authenticated backtest run list endpoint. |
| File path | apps/api/src/modules/backtests/backtests.routes.ts |
| Related files | apps/api/src/modules/backtests/backtests.controller.ts, apps/api/src/modules/backtests/backtests.service.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BACKTESTS]], [[SOAR-SERVICE-BACKTESTS]] |
| Used by | [[SOAR-SERVICE-WEB-BACKTESTS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-GET]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Run list route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-BACKTESTS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BACKTESTS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
