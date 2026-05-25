---
id: SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE
name: "GET /dashboard/reports/cross-mode-performance"
type: api_route
status: verified_local
layer: backend
module: api-reports
feature: reports
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/reports/cross-mode-performance

| Field | Value |
| --- | --- |
| Description | Authenticated cross-mode performance summary endpoint for BACKTEST PAPER and LIVE rows. |
| File path | apps/api/src/modules/reports/reports.routes.ts |
| Related files | apps/api/src/modules/reports/reports.controller.ts, apps/api/src/modules/reports/reports.service.ts |
| Parent | [[SOAR-FEATURE-REPORTS]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-REPORTS]], [[SOAR-SERVICE-REPORTS]] |
| Used by | [[SOAR-SERVICE-WEB-REPORTS]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-REPORTS]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-REPORTS-API]] |
| Docs related | [[SOAR-DOC-API-REPORTS]] |
| Agent related |  |
| Notes | Route is mounted under /dashboard/reports. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-REPORTS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-REPORTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
