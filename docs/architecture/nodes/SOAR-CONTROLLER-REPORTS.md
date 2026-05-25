---
id: SOAR-CONTROLLER-REPORTS
name: "Reports controller"
type: controller
status: verified_local
layer: backend
module: api-reports
feature: reports
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Reports controller

| Field | Value |
| --- | --- |
| Description | Express controller for authenticated reports read requests. |
| File path | apps/api/src/modules/reports/reports.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-REPORTS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-REPORTS]] |
| Used by | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]] |
| UI related |  |
| API related | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-REPORTS-API]] |
| Docs related | [[SOAR-DOC-API-REPORTS]] |
| Agent related |  |
| Notes | Controller extracts user id and delegates to reports service. |

## Relations

- calls -> [[SOAR-SERVICE-REPORTS]] (verified_local)
- routes_to <- [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
