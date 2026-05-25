---
id: SOAR-PAGE-BACKTEST-DETAIL
name: "Backtest detail page"
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

# Backtest detail page

| Field | Value |
| --- | --- |
| Description | Backtest run detail route with summary trades raw timeline report and market views. |
| File path | apps/web/src/app/dashboard/backtests/[id]/page.tsx |
| Related files | apps/web/src/features/backtest/components/BacktestRunDetails.tsx |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-COMP-BACKTEST-RUN-DETAILS]], [[SOAR-SERVICE-WEB-BACKTESTS]] |
| Used by | [[SOAR-FEATURE-REPORTS]] |
| UI related | [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| API related | [[SOAR-API-BACKTEST-RUN-GET]], [[SOAR-API-BACKTEST-RUN-TRADES]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-BACKTEST-REPORT]] |
| Tests related | [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related |  |
| Notes | Details flow loads run trades report and timeline. |

## Relations

- renders -> [[SOAR-COMP-BACKTEST-RUN-DETAILS]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
