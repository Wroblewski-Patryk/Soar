---
id: SOAR-SERVICE-BACKTEST-WEB-VIEWMODEL
name: "Backtest Web view-model utilities"
type: utility
status: verified_local
layer: frontend
module: web-backtest
feature: backtests
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, utility, frontend, verified_local]
---

# Backtest Web view-model utilities

| Field | Value |
| --- | --- |
| Description | Backtest details view-model and timeline/trade presentation utilities. |
| File path | apps/web/src/features/backtest/utils/backtestRunDetailsViewModel.ts |
| Related files | apps/web/src/features/backtest/utils/backtestSymbolStats.ts, apps/web/src/features/backtest/utils/timelineIndicatorOverlays.ts, apps/web/src/features/backtest/utils/nonOverlappingTradeSegments.ts, apps/web/src/features/backtest/utils/pairStatsMetricDisplay.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-DOC-WEB-BACKTESTS]] |
| Used by | [[SOAR-COMP-BACKTEST-RUN-DETAILS]], [[SOAR-COMP-BACKTEST-DETAIL-PRESENTERS]] |
| UI related | [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| API related | [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-API-BACKTEST-RUN-REPORT]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related |  |
| Notes | View-model proof point. |

## Relations

- verified_by -> [[SOAR-TEST-BACKTEST-WEB-UTILITIES]] (verified_local)
- uses <- [[SOAR-COMP-BACKTEST-RUN-DETAILS]] (verified_local)
- uses <- [[SOAR-COMP-BACKTEST-DETAIL-PRESENTERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
