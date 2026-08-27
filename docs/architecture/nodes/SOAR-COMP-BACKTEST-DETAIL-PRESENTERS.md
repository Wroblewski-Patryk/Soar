---
id: SOAR-COMP-BACKTEST-DETAIL-PRESENTERS
name: "Backtest detail presenters"
type: component
status: verified_local
layer: frontend
module: web-backtest
feature: backtests
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# Backtest detail presenters

| Field | Value |
| --- | --- |
| Description | Backtest detail chart tab header and metric presenter helpers. |
| File path | apps/web/src/features/backtest/components/BacktestRunDetailsTabPanels.tsx |
| Related files | apps/web/src/features/backtest/components/backtestRunDetailsCharts.tsx, apps/web/src/features/backtest/components/BacktestRunHeaderSection.tsx, apps/web/src/features/backtest/utils/pairStatsMetricDisplay.ts, apps/web/src/features/backtest/utils/timelineIndicatorOverlays.ts, apps/web/src/features/backtest/utils/nonOverlappingTradeSegments.ts |
| Parent | [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BACKTEST-WEB-VIEWMODEL]] |
| Used by | [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| UI related | [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| API related | [[SOAR-API-BACKTEST-RUN-TIMELINE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related |  |
| Notes | Presenter utility group. |

## Relations

- uses -> [[SOAR-SERVICE-BACKTEST-WEB-VIEWMODEL]] (verified_local)
- verified_by -> [[SOAR-TEST-BACKTEST-WEB-UTILITIES]] (verified_local)
- composes <- [[SOAR-COMP-BACKTEST-RUN-DETAILS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
