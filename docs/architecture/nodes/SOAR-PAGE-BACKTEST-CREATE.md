---
id: SOAR-PAGE-BACKTEST-CREATE
name: "Backtest create page"
type: page
status: verified_local
layer: frontend
module: web-backtest
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Backtest create page

| Field | Value |
| --- | --- |
| Description | Backtest create route with strategy market universe range and candle-window configuration. |
| File path | apps/web/src/app/dashboard/backtests/create/page.tsx |
| Related files | apps/web/src/features/backtest/components/BacktestCreateForm.tsx |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-COMP-BACKTEST-CREATE-FORM]], [[SOAR-SERVICE-WEB-BACKTESTS]] |
| Used by | [[SOAR-FEATURE-BACKTESTS]] |
| UI related | [[SOAR-COMP-BACKTEST-CREATE-FORM]] |
| API related | [[SOAR-API-BACKTEST-RUN-CREATE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related |  |
| Notes | Create flow snapshots strategy and market context. |

## Relations

- renders -> [[SOAR-COMP-BACKTEST-CREATE-FORM]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
