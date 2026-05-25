---
id: SOAR-COMP-PERFORMANCE-REPORTS-VIEW
name: "PerformanceReportsView"
type: component
status: verified_local
layer: frontend
module: web-reports
feature: reports
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# PerformanceReportsView

| Field | Value |
| --- | --- |
| Description | Reports view loading cross-mode metrics and recent completed backtest run reports with partial-success handling. |
| File path | apps/web/src/features/reports/components/PerformanceReportsView.tsx |
| Related files | apps/web/src/features/reports/components/PerformanceReportsView.test.tsx |
| Parent | [[SOAR-PAGE-REPORTS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-REPORTS]], [[SOAR-SERVICE-WEB-BACKTESTS]] |
| Used by | [[SOAR-PAGE-REPORTS]] |
| UI related | [[SOAR-PAGE-REPORTS]] |
| API related | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]], [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-REPORT]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-REPORTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-REPORTS]] |
| Agent related |  |
| Notes | Component evidence includes loading empty error success and partial per-run failure states. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-REPORTS]] (verified_local)
- calls -> [[SOAR-SERVICE-WEB-BACKTESTS]] (verified_local)
- renders <- [[SOAR-PAGE-REPORTS]] (verified_local)
- verifies <- [[SOAR-TEST-REPORTS-WEB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
