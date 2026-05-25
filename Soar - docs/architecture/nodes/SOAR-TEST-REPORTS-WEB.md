---
id: SOAR-TEST-REPORTS-WEB
name: "Reports Web tests"
type: test
status: verified_local
layer: testing
module: web-reports
feature: reports
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Reports Web tests

| Field | Value |
| --- | --- |
| Description | Reports page and PerformanceReportsView tests for route shell states metrics rows partial per-run failure and localized copy. |
| File path | apps/web/src/features/reports/components/PerformanceReportsView.test.tsx |
| Related files | apps/web/src/app/dashboard/reports/page.test.tsx |
| Parent | [[SOAR-FEATURE-REPORTS]] |
| Children |  |
| Depends on | [[SOAR-PAGE-REPORTS]], [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]], [[SOAR-SERVICE-WEB-REPORTS]] |
| Used by | [[SOAR-FEATURE-REPORTS]] |
| UI related | [[SOAR-PAGE-REPORTS]], [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]] |
| API related | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]], [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-REPORT]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-REPORTS]] |
| Agent related |  |
| Notes | Primary frontend reports proof. |

## Relations

- verifies -> [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]] (verified_local)
- verified_by <- [[SOAR-FEATURE-REPORTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
