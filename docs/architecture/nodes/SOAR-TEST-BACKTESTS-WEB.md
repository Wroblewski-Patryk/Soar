---
id: SOAR-TEST-BACKTESTS-WEB
name: "Backtests Web tests"
type: test
status: verified_local
layer: testing
module: web-backtest
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Backtests Web tests

| Field | Value |
| --- | --- |
| Description | Backtests page component hook and view-model tests for list create details timeline trades and report presentation. |
| File path | apps/web/src/features/backtest/components/BacktestRunDetails.test.tsx |
| Related files | apps/web/src/features/backtest/components/BacktestCreateForm.test.tsx, apps/web/src/features/backtest/components/BacktestsList.test.tsx, apps/web/src/features/backtest/components/BacktestsListView.test.tsx, apps/web/src/features/backtest/components/BacktestsRunsTable.test.tsx, apps/web/src/app/dashboard/backtests/list/page.test.tsx, apps/web/src/app/dashboard/backtests/create/page.test.tsx, apps/web/src/app/dashboard/backtests/[id]/page.test.tsx, apps/web/src/features/backtest/hooks/useBacktestRunCoreData.test.tsx, apps/web/src/features/backtest/utils/backtestRunDetailsViewModel.test.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-PAGE-BACKTESTS-LIST]], [[SOAR-PAGE-BACKTEST-CREATE]], [[SOAR-PAGE-BACKTEST-DETAIL]], [[SOAR-COMP-BACKTESTS-LIST-VIEW]], [[SOAR-COMP-BACKTEST-CREATE-FORM]], [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| Used by | [[SOAR-FEATURE-BACKTESTS]] |
| UI related | [[SOAR-PAGE-BACKTESTS-LIST]], [[SOAR-PAGE-BACKTEST-CREATE]], [[SOAR-PAGE-BACKTEST-DETAIL]] |
| API related | [[SOAR-SERVICE-WEB-BACKTESTS]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related |  |
| Notes | Primary Web proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
