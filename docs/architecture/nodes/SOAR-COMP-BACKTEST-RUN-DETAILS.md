---
id: SOAR-COMP-BACKTEST-RUN-DETAILS
name: "BacktestRunDetails"
type: component
status: verified_local
layer: frontend
module: web-backtest
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# BacktestRunDetails

| Field | Value |
| --- | --- |
| Description | Backtest run details container for core run data timeline trades report and diagnostics. |
| File path | apps/web/src/features/backtest/components/BacktestRunDetails.tsx |
| Related files | apps/web/src/features/backtest/components/BacktestRunDetailsTabPanels.tsx, apps/web/src/features/backtest/hooks/useBacktestRunCoreData.ts, apps/web/src/features/backtest/hooks/useBacktestTimelineOrchestration.ts, apps/web/src/features/backtest/hooks/useBacktestTradesAnalytics.ts |
| Parent | [[SOAR-PAGE-BACKTEST-DETAIL]] |
| Children | [[SOAR-COMP-BACKTEST-DETAIL-PRESENTERS]] |
| Depends on | [[SOAR-SERVICE-WEB-BACKTESTS]], [[SOAR-SERVICE-BACKTEST-WEB-VIEWMODEL]] |
| Used by | [[SOAR-PAGE-BACKTEST-DETAIL]] |
| UI related | [[SOAR-PAGE-BACKTEST-DETAIL]] |
| API related | [[SOAR-API-BACKTEST-RUN-GET]], [[SOAR-API-BACKTEST-RUN-TRADES]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-BACKTEST-REPORT]] |
| Tests related | [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related |  |
| Notes | Details container owns staged data loading. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-BACKTESTS]] (verified_local)
- uses -> [[SOAR-SERVICE-BACKTEST-WEB-VIEWMODEL]] (verified_local)
- composes -> [[SOAR-COMP-BACKTEST-DETAIL-PRESENTERS]] (verified_local)
- uses -> [[SOAR-UTIL-BACKTEST-RUN-DETAILS-COPY]] (verified_local)
- renders <- [[SOAR-PAGE-BACKTEST-DETAIL]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
