# LUC-6479 Backtest Web Grouped Proof Instability

Date: 2026-07-01
Owner: 09 TAE (Test Automation Engineer)
Reality status: implemented and verified for Backtest Web grouped proof; no product UI defect reproduced

## Scope

[LUC-6479](/LUC/issues/LUC-6479) isolated the deterministic Backtest Web
grouped proof instability blocking [LUC-6466](/LUC/issues/LUC-6466).

No production mutation, deploy, push, restart, protected smoke, secret/account
readback, exchange/payment mutation, order, position, subscription mutation, or
live-trading action occurred.

## Finding

The prior product-level symptom, `BacktestsList.test.tsx` missing `Net PnL`
while rendering `Report is not ready yet`, was not reproduced.

What was reproduced:

- focused `BacktestsList.test.tsx` passed repeatedly before the edit;
- the Backtest Web grouped packet passed before and after the edit;
- oversized combined Web packets still timed out at the command guard without a
  reliable assertion summary.

The isolation gap was in the test harness, not product UI behavior:
`BacktestsList.test.tsx` lacked the cleanup/mock reset pattern used by nearby
Backtest component tests. The file now clears Testing Library DOM, hoisted
mocks, localStorage, and history after each test.

## Files Changed

- `apps/web/src/features/backtest/components/BacktestsList.test.tsx`

## Validation

| Check | Command | Result |
| --- | --- | --- |
| Baseline Backtest grouped Web packet before edit | `pnpm --filter web exec vitest run src/features/backtest src/app/dashboard/backtests --reporter=verbose --testTimeout=15000` | `PASS`: `13` files / `33` tests in `54.51s`. |
| Focused reproduction loop before edit | `1..3 | ForEach-Object { pnpm --filter web exec vitest run src/features/backtest/components/BacktestsList.test.tsx --reporter=verbose --testTimeout=15000 }` | `PASS`: `3` consecutive runs, each `1` file / `2` tests. |
| Focused BacktestsList after edit | `pnpm --filter web exec vitest run src/features/backtest/components/BacktestsList.test.tsx --reporter=verbose --testTimeout=15000` | `PASS`: `1` file / `2` tests in `40.21s`. |
| Backtest grouped Web packet after edit | `pnpm --filter web exec vitest run src/features/backtest src/app/dashboard/backtests --reporter=verbose --testTimeout=15000` | `PASS`: `13` files / `33` tests in `43.94s`. |
| Serialized Backtest grouped packet | `pnpm --filter web exec vitest run src/features/backtest src/app/dashboard/backtests --reporter=verbose --testTimeout=15000 --fileParallelism=false` | `TIMEOUT`: command guard stopped at `240s`, no assertion summary. |
| Combined Web packet | `pnpm --filter web run test -- --run src/features/backtest src/features/strategies src/features/reports src/features/logs "src/app/(public)" --reporter=verbose --testTimeout=15000` | `TIMEOUT`: command guard stopped at `240s`, no assertion summary. |
| Browser cleanup check | `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` | `PASS`: no rows returned. |
| Playwright cleanup check | `Get-Process playwright -ErrorAction SilentlyContinue` | `PASS`: no rows returned. |

## Result

`DONE / VERIFIED_BACKTEST_WEB_GROUPED_PACKET / HARNESS_ISOLATION_HARDENED /
NO_FEW_ESCALATION`.

No Frontend repair issue is justified from [LUC-6479](/LUC/issues/LUC-6479)
because the product UI defect did not reproduce. Keep future Backtest Web proof
bounded to the grouped Backtest command above; treat the larger combined
Backtest/Strategy/Reports/Logs/Public shell packet timeout as runner budget
instability unless it returns a concrete assertion failure.
