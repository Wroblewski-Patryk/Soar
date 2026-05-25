---
id: SOAR-PAGE-REPORTS
name: "Reports dashboard page"
type: page
status: verified_local
layer: frontend
module: web-reports
feature: reports
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Reports dashboard page

| Field | Value |
| --- | --- |
| Description | Authenticated reports dashboard route shell for performance reporting. |
| File path | apps/web/src/app/dashboard/reports/page.tsx |
| Related files | apps/web/src/features/reports/components/PerformanceReportsView.tsx |
| Parent | [[SOAR-FEATURE-REPORTS]] |
| Children |  |
| Depends on | [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]] |
| Used by | [[SOAR-FEATURE-REPORTS]] |
| UI related | [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]] |
| API related | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]], [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-REPORT]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-REPORTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-REPORTS]] |
| Agent related |  |
| Notes | Route shell renders the canonical reports view. |

## Relations

- renders -> [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-REPORTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
