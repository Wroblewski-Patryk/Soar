---
id: SOAR-PAGE-BACKTESTS-LIST
name: "Backtests list page"
type: page
status: verified_local
layer: frontend
module: web-backtest
feature: backtests
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Backtests list page

| Field | Value |
| --- | --- |
| Description | Canonical backtest runs list route. |
| File path | apps/web/src/app/dashboard/backtests/list/page.tsx |
| Related files | apps/web/src/features/backtest/components/BacktestsListView.tsx |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-COMP-BACKTESTS-LIST-VIEW]], [[SOAR-SERVICE-WEB-BACKTESTS]] |
| Used by | [[SOAR-FEATURE-BACKTESTS]] |
| UI related | [[SOAR-COMP-BACKTESTS-LIST-VIEW]] |
| API related | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-DELETE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]] |
| Tests related | [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related |  |
| Notes | Backtest list surface. |

## Relations

- renders -> [[SOAR-COMP-BACKTESTS-LIST-VIEW]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
