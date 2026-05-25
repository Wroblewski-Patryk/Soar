---
id: SOAR-COMP-BACKTESTS-LIST-VIEW
name: "BacktestsListView"
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

# BacktestsListView

| Field | Value |
| --- | --- |
| Description | Backtest runs list view and table composition. |
| File path | apps/web/src/features/backtest/components/BacktestsListView.tsx |
| Related files | apps/web/src/features/backtest/components/BacktestsRunsTable.tsx, apps/web/src/features/backtest/components/BacktestsList.tsx |
| Parent | [[SOAR-PAGE-BACKTESTS-LIST]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BACKTESTS]] |
| Used by | [[SOAR-PAGE-BACKTESTS-LIST]] |
| UI related | [[SOAR-PAGE-BACKTESTS-LIST]] |
| API related | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-DELETE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]] |
| Tests related | [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related |  |
| Notes | List/table composition. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-BACKTESTS]] (verified_local)
- renders <- [[SOAR-PAGE-BACKTESTS-LIST]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
