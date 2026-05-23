# Task: Backtests And Reports Audit - 2026-05-19

## Context

The user requested reusable layer-by-layer discrepancy audits between the
application implementation and architecture/module descriptions. `AUD-16`
covers backtest lifecycle, replay/parity, immutable snapshots, reports,
timeline, route states, and production-safe fixture readback.

## Goal

Refresh `AUD-16` with current local evidence and record implementation vs
architecture/documentation discrepancies without changing runtime behavior.

## Scope

- `docs/analysis/reusable-audit-registry.md`
- `docs/modules/api-backtests.md`
- `docs/modules/web-backtest.md`
- `docs/modules/api-reports.md`
- `docs/modules/web-reports.md`
- `apps/api/src/modules/backtests/**`
- `apps/api/src/modules/reports/**`
- `apps/web/src/features/backtest/**`
- `apps/web/src/features/reports/**`
- `apps/web/src/app/dashboard/backtests/**`
- `apps/web/src/app/dashboard/reports/**`

## Constraints

- No production journey.
- No LIVE order/cancel/close.
- No exchange-side mutation.
- No existing production data mutation.
- Keep repository artifacts in English.

## Definition Of Done

- Focused Web backtests/reports proof is run and recorded.
- Focused API backtests/reports proof is run and recorded.
- Architecture-to-code parity is summarized.
- Open gaps are recorded with stable IDs.
- Local DB/Redis infra is stopped after DB-backed tests.
- A reusable Markdown and JSON audit artifact exists.

## Forbidden

- Do not change product behavior during the audit.
- Do not perform LIVE-money or exchange-side mutation.
- Do not overclaim production freshness from local tests.

## Result Report

Completed on 2026-05-19.

Validation:

- `corepack pnpm --filter web exec vitest run src/app/dashboard/backtests/list/page.test.tsx src/app/dashboard/backtests/create/page.test.tsx src/app/dashboard/backtests/[id]/page.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/components/BacktestsList.test.tsx src/features/backtest/components/BacktestsListView.test.tsx src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/backtest/hooks/useBacktestRunCoreData.test.tsx src/features/backtest/utils/timelineIndicatorOverlays.test.ts src/features/backtest/utils/pairStatsMetricDisplay.test.ts src/features/backtest/utils/nonOverlappingTradeSegments.test.ts src/features/backtest/utils/backtestRunDetailsViewModel.test.ts src/app/dashboard/reports/page.test.tsx src/features/reports/components/PerformanceReportsView.test.tsx`
  - PASS: `15` files, `37` tests.
- `corepack pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts src/modules/backtests/backtests.contract-remediation.test.ts src/modules/backtests/backtestRuntimeKernelParity.test.ts src/modules/backtests/backtestRunQueue.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtestRange.service.test.ts src/modules/backtests/backtestPatternParityFixtures.test.ts src/modules/backtests/backtestParity3Symbols.test.ts src/modules/backtests/backtestIndicatorTimelineSeries.test.ts src/modules/backtests/backtestFillModel.test.ts src/modules/backtests/backtestDataGateway.test.ts src/modules/reports/reports.service.test.ts`
  - PASS: `13` files, `114` tests.
- `corepack pnpm run go-live:infra:down`
  - PASS: local Postgres/Redis stopped after DB-backed tests.

Artifacts:

- `history/audits/backtests-reports-audit-2026-05-19.md`
- `history/artifacts/backtests-reports-audit-2026-05-19.json`

Residual risk:

- Fresh production-safe disposable backtest/report proof was not rerun.
- Non-Binance historical order-book parity remains future adapter scope.
- Richer report filters, snapshot persistence, and report i18n hardening remain
  future reporting scope.
