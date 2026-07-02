# LUC-6466 Backtest Strategy Reports Public Shell Journey Proof

Date: 2026-06-30; closure supplement: 2026-07-01
Owner: 09 QVE (QA & Verification Engineer)
Reality status: implemented and verified for the bounded local journey packet

## Scope

[LUC-6466](/LUC/issues/LUC-6466) executes the QVE slice from
[LUC-6463](/LUC/issues/LUC-6463) packet `LUC-6463-USER-JOURNEY-01`:
Backtest run lifecycle, Strategy management, Support utilities/reports/logs,
and Public shell/PWA route proof.

No product code, production mutation, push, deploy, restart, protected smoke,
secret/account readback, exchange/payment mutation, order, position,
subscription mutation, or live-trading action occurred.

2026-07-01 closure note: [LUC-6479](/LUC/issues/LUC-6479) completed the TAE
deterministic Backtest Web grouped-proof follow-up. It did not reproduce a
product UI defect, hardened `BacktestsList.test.tsx` cleanup, and verified the
Backtest grouped Web packet. QVE reran that bounded proof path on this issue
and it passed.

## Source Packet

- Parent packet:
  `history/artifacts/luc-6463-app-completion-proof-burndown-lanes-2026-06-30.json`.
- Source packet:
  `history/artifacts/luc-6098-unclassified-workflow-proof-packets-2026-06-29.json`.
- Packet row count: `55`.
- Journey counts:
  - Backtest run lifecycle: `21`.
  - Strategy management: `9`.
  - Support utilities, audit logs, and reports: `12`.
  - Account access and public user projection: `1`.
  - Public shell, legal, build-info, and PWA: `12`.

## Validation

| Check | Command | Result |
| --- | --- | --- |
| Suggested combined Web packet | `pnpm --filter web run test -- --run src/features/backtest src/features/strategies src/features/reports src/features/logs "src/app/(public)"` | `TIMEOUT` after `120s`; no reliable pass/fail summary returned. |
| Backtest Web split | `pnpm --filter web exec vitest run src/features/backtest src/app/dashboard/backtests --reporter=verbose --testTimeout=15000` | `FAIL`: `1` test failed in `BacktestsList.test.tsx` because `Net PnL` was not found while the selected run showed `Report is not ready yet`. |
| Backtest focused reproduction | `pnpm --filter web exec vitest run src/features/backtest/components/BacktestsList.test.tsx --reporter=verbose --testTimeout=15000` | `PASS`: `1` file / `2` tests. The grouped failure did not reproduce in isolation. |
| Backtest serialized group | `pnpm --filter web exec vitest run src/features/backtest src/app/dashboard/backtests --reporter=verbose --testTimeout=15000 --fileParallelism=false` | `TIMEOUT` after `180s`; no reliable summary returned. |
| Backtest grouped Web closure rerun | `pnpm --filter web exec vitest run src/features/backtest src/app/dashboard/backtests --reporter=verbose --testTimeout=15000` | `PASS`: `13` files / `33` tests in `54.55s` on 2026-07-01 after [LUC-6479](/LUC/issues/LUC-6479). |
| Strategy Web split | `pnpm --filter web exec vitest run src/features/strategies src/app/dashboard/strategies --reporter=verbose --testTimeout=15000` | `PASS`: `14` files / `48` tests. |
| Reports/logs Web split | `pnpm --filter web exec vitest run src/features/reports src/features/logs src/app/dashboard/reports src/app/dashboard/logs --reporter=verbose --testTimeout=15000` | `PASS`: `4` files / `8` tests. |
| Public shell/PWA split | `pnpm --filter web exec vitest run "src/app/(public)" src/app/offline/page.test.tsx src/app/appShellRoutes.test.tsx src/app/api/build-info/route.test.ts --reporter=verbose --testTimeout=15000` | `PASS`: `4` files / `9` tests. |
| Route-reachable i18n audit | `pnpm i18n:audit:route-reachable:web` | `PASS`: findings `0`, localCopy `0`, fallbackPl `0`, hardcoded `0`. |
| Backtest API focused pack | `pnpm --filter api exec vitest run src/modules/backtests/backtestRange.service.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtestFillModel.test.ts src/modules/backtests/backtestRunQueue.test.ts --reporter=verbose --testTimeout=15000` | `PASS`: `4` files / `41` tests. |
| Strategy/reports API focused pack | `pnpm --filter api exec vitest run src/modules/strategies/indicators/indicators.service.test.ts src/modules/strategies/strategyConfigValidation.test.ts src/modules/reports/reports.service.test.ts --reporter=verbose --testTimeout=15000` | `PASS`: `3` files / `8` tests. |
| Browser process cleanup check | `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` | `PASS`: no leftover `chrome-headless-shell` rows. |

## Finding

The original 2026-06-30 run left the backtest journey `partially verified`.
The grouped Backtest Web packet produced a failure in
`apps/web/src/features/backtest/components/BacktestsList.test.tsx`:

- expected: selected completed run renders report metrics including `Net PnL`;
- observed during grouped run: selected completed run rendered
  `Report is not ready yet`;
- focused rerun of the same file passed `2/2`;
- serialized group timed out before returning a reliable result.

The 2026-07-01 TAE follow-up and QVE closure rerun convert this from an open
deterministic-proof gap to a verified bounded proof. No product UI defect was
reproduced, and no Frontend repair child is justified from this packet. The
oversized combined Web packet remains a runner budget risk and should stay
split for evidence purposes unless a future issue explicitly budgets that
aggregate command.

## Result

`DONE / VERIFIED_LOCAL_USER_JOURNEY_PACKET / NO_FEW_ESCALATION`.

Verified:

- Strategy management Web journey.
- Reports/logs Web journey.
- Public shell/PWA/build-info/offline route shell.
- Route-reachable i18n for the touched routes.
- Focused DB-independent API contracts for backtest replay/range/fill/queue,
  strategy indicator/config validation, and report aggregation.

Closure proof:

- [LUC-6479](/LUC/issues/LUC-6479) verified the deterministic Backtest grouped
  Web packet and reported no reproduced product UI defect.
- QVE reran the bounded Backtest grouped Web packet on 2026-07-01:
  `13` files / `33` tests passed.
- The LUC-6466 packet now has passing evidence for Backtest Web, Strategy Web,
  Reports/logs Web, Public shell/PWA/build-info/offline, route i18n, Backtest
  API, and Strategy/Reports API.

Recommended disposition:

- Mark [LUC-6466](/LUC/issues/LUC-6466) `done`.
- No FEW or CBE repair follow-up is required from this issue.
- Keep future proof split into bounded packets; the oversized combined Web
  command can timeout without a product assertion summary.

## Paperclip Control-Plane Note

The original 2026-06-30 control-plane attempts timed out before the TAE child
and blocked disposition could be confirmed. That caveat is superseded:
[LUC-6479](/LUC/issues/LUC-6479) now exists, is complete, and provided the
deterministic Backtest grouped proof. The remaining Paperclip action for this
issue is to mark [LUC-6466](/LUC/issues/LUC-6466) `done` with this updated
evidence packet.
