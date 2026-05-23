# Backtests And Reports Audit - 2026-05-19

## Metadata

| Field | Value |
| --- | --- |
| Audit ID | `AUD-16` |
| Registry family | Backtests And Reports |
| Stage | verification |
| Environment | local |
| Status | current local / current historical production-safe fixture proof |
| Production journey | not run |
| LIVE exchange mutation | not run |
| Exchange-side mutation | not run |
| Existing production data mutation | not run |

## Scope

This audit compares current backtest/report behavior with documented
architecture/module contracts for:

- backtest run create/list/get/delete lifecycle,
- explicit time-window/range validation and candle-bound contracts,
- immutable strategy and market-universe context snapshots,
- queue/job persistence and replay processing,
- data gateway, fill model, runtime-kernel parity, and parity diagnostics,
- trades/report/timeline read surfaces and pending report lifecycle,
- Web run list/create/details/timeline/report states,
- cross-mode reports aggregation and reports route states.

Canonical references:

- `docs/analysis/reusable-audit-registry.md`
- `docs/modules/api-backtests.md`
- `docs/modules/web-backtest.md`
- `docs/modules/api-reports.md`
- `docs/modules/web-reports.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`

## Evidence Run

| Proof | Result | Evidence |
| --- | --- | --- |
| Focused Web backtests/reports pack | PASS | `corepack pnpm --filter web exec vitest run src/app/dashboard/backtests/list/page.test.tsx src/app/dashboard/backtests/create/page.test.tsx src/app/dashboard/backtests/[id]/page.test.tsx src/features/backtest/components/BacktestCreateForm.test.tsx src/features/backtest/components/BacktestRunDetails.test.tsx src/features/backtest/components/BacktestsList.test.tsx src/features/backtest/components/BacktestsListView.test.tsx src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/backtest/hooks/useBacktestRunCoreData.test.tsx src/features/backtest/utils/timelineIndicatorOverlays.test.ts src/features/backtest/utils/pairStatsMetricDisplay.test.ts src/features/backtest/utils/nonOverlappingTradeSegments.test.ts src/features/backtest/utils/backtestRunDetailsViewModel.test.ts src/app/dashboard/reports/page.test.tsx src/features/reports/components/PerformanceReportsView.test.tsx`; `15` files, `37` tests. |
| Focused API backtests/reports pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts src/modules/backtests/backtests.contract-remediation.test.ts src/modules/backtests/backtestRuntimeKernelParity.test.ts src/modules/backtests/backtestRunQueue.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtestRange.service.test.ts src/modules/backtests/backtestPatternParityFixtures.test.ts src/modules/backtests/backtestParity3Symbols.test.ts src/modules/backtests/backtestIndicatorTimelineSeries.test.ts src/modules/backtests/backtestFillModel.test.ts src/modules/backtests/backtestDataGateway.test.ts src/modules/reports/reports.service.test.ts`; `13` files, `114` tests. |
| Local DB/Redis lifecycle | PASS | `corepack pnpm run go-live:infra:up` before DB-backed API tests and `corepack pnpm run go-live:infra:down` after proof. |

## Architecture-To-Code Parity

| Contract Area | Current Implementation Truth | Parity |
| --- | --- | --- |
| Run lifecycle and ownership | API e2e covers owned run create/list/get/delete, ownership isolation, empty-symbol fail-closed behavior, and production-safe fixture history remains accepted from 2026-05-14. | aligned |
| Explicit range contract | API and Web tests cover explicit `startAt/endAt`, candle bounds, range service behavior, and legacy readability. | aligned |
| Immutable snapshots | Module docs and existing 2026-05-14 proof verify creation-time strategy/market snapshots and historical delete guards. | aligned, historical proof retained |
| Queue/job/replay | Queue, job, replay core, fill model, data gateway, runtime-kernel parity, pattern parity, 3-symbol parity, and indicator timeline tests passed. | aligned |
| Report lifecycle | API backtest contract remediation and reports service tests cover pending/degraded report lifecycle and cross-mode aggregation. | aligned |
| Web details/timeline/report UI | Web route/component/hook/util tests cover list/create/details, run table actions, details view-model, timeline overlays, pair metrics, non-overlapping trade segments, reports route, empty state, and performance report cards/tables. | aligned |

## Findings

| ID | Severity | Status | Finding | Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| `AUD-BTR-004` | P1 | open freshness follow-up | Fresh production-safe disposable backtest/report fixture proof was not rerun. Historical production proof remains accepted for the 2026-05-14 deployment target. | `history/evidence/prod-fixture-action-proof-457bce05-2026-05-14.md`; this audit's local Web/API packs. | Refresh production-safe disposable backtest/report proof after future deployments. |
| `AUD-BTR-005` | P2 | explicit future scope | Non-Binance historical order-book parity remains outside current V1 support. | Module confidence ledger and previous exchange/backtest audit evidence. | Do not claim this support until adapter/data-gateway work and tests exist. |
| `AUD-BTR-006` | P3 | documented follow-up | Reports docs still list richer filters and possible snapshot persistence as future scope; Web reports docs list i18n hardening and query filters. | `docs/modules/api-reports.md`; `docs/modules/web-reports.md`. | Track under reporting product expansion, not current correctness. |

## Result

`AUD-16` is current locally for backtest run lifecycle, explicit range
validation, replay/queue/job behavior, immutable snapshot behavior, report
lifecycle, timeline/trades/report reads, cross-mode reporting aggregation, and
Web backtest/report states.

No code behavior was changed. No production journey, LIVE mutation,
exchange-side mutation, or existing production data mutation was performed.
