---
id: SOAR-COMP-BACKTEST-CREATE-FORM
name: "BacktestCreateForm"
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

# BacktestCreateForm

| Field | Value |
| --- | --- |
| Description | Backtest creation form for strategy market universe balance range and candle-window input. |
| File path | apps/web/src/features/backtest/components/BacktestCreateForm.tsx |
| Related files |  |
| Parent | [[SOAR-PAGE-BACKTEST-CREATE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BACKTESTS]], [[SOAR-FEATURE-STRATEGIES]], [[SOAR-FEATURE-MARKETS]] |
| Used by | [[SOAR-PAGE-BACKTEST-CREATE]] |
| UI related | [[SOAR-PAGE-BACKTEST-CREATE]] |
| API related | [[SOAR-API-BACKTEST-RUN-CREATE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related |  |
| Notes | Create form depends on Strategy and Market universe selections. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-BACKTESTS]] (verified_local)
- renders <- [[SOAR-PAGE-BACKTEST-CREATE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
