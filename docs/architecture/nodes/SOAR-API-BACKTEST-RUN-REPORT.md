---
id: SOAR-API-BACKTEST-RUN-REPORT
name: "GET /dashboard/backtests/runs/:id/report"
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

# GET /dashboard/backtests/runs/:id/report

| Field | Value |
| --- | --- |
| Description | Authenticated backtest run report endpoint with lifecycle payload semantics. |
| File path | apps/api/src/modules/backtests/backtests.routes.ts |
| Related files | apps/api/src/modules/backtests/backtests.controller.ts, apps/api/src/modules/backtests/backtests.service.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-BACKTESTS]], [[SOAR-SERVICE-BACKTESTS]], [[SOAR-SERVICE-BACKTEST-REPORT-LIFECYCLE]] |
| Used by | [[SOAR-SERVICE-WEB-BACKTESTS]], [[SOAR-FEATURE-REPORTS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-GET]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-REPORT]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Report route. |

## Relations

- calls <- [[SOAR-SERVICE-WEB-BACKTESTS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
