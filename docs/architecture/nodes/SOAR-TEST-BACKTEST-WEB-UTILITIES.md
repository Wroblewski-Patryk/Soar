---
id: SOAR-TEST-BACKTEST-WEB-UTILITIES
name: "Backtest Web utility tests"
type: test
status: verified_local
layer: testing
module: web-backtest
feature: backtests
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Backtest Web utility tests

| Field | Value |
| --- | --- |
| Description | Backtest Web presenter utility tests for trade segment overlap pair-stat display and timeline indicator overlays. |
| File path | apps/web/src/features/backtest/utils/nonOverlappingTradeSegments.test.ts |
| Related files | apps/web/src/features/backtest/utils/pairStatsMetricDisplay.test.ts, apps/web/src/features/backtest/utils/timelineIndicatorOverlays.test.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BACKTEST-WEB-VIEWMODEL]], [[SOAR-COMP-BACKTEST-DETAIL-PRESENTERS]] |
| Used by | [[SOAR-FEATURE-BACKTESTS]] |
| UI related | [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| API related | [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-API-BACKTEST-RUN-REPORT]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related |  |
| Notes | Focused Backtest presenter utility proof. |

## Relations

- verified_by <- [[SOAR-SERVICE-BACKTEST-WEB-VIEWMODEL]] (verified_local)
- verified_by <- [[SOAR-COMP-BACKTEST-DETAIL-PRESENTERS]] (verified_local)
- verified_by <- [[SOAR-FEATURE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
