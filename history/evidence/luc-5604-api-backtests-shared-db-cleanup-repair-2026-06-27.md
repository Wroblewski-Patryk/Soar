# LUC-5604 API Backtests Shared-DB Cleanup Repair Evidence

- Issue: [LUC-5604](/LUC/issues/LUC-5604)
- Date: 2026-06-27
- Scope: local API e2e test-harness cleanup for backtests shared DB residuals.
- Runtime boundary: no deploy, push, production smoke, protected account proof,
  secret readback, production DB/Redis mutation, exchange action, payment,
  subscription, order, position, or live-trading action.

## Diagnosis

- The API smoke failure was in `apps/api/src/modules/backtests/backtests.e2e.test.ts`.
- The cleanup order did not cover all current Prisma relations used by the
  backtests critical flow:
  - `OrderFill` can retain `userId`, `orderId`, `tradeId`, and `positionId`.
  - `WalletCashflowEvent` can retain `userId`, `walletId`, `orderId`,
    `tradeId`, and `positionId`.
  - `WalletBalanceSnapshot`, `Wallet`, `PaymentIntent`, and
    `UserSubscription` can retain user-owned rows after live/venue/subscription
    tests.
- The existing retry only covered `BacktestRun` cleanup, but the inline
  backtest queue can still complete around the reset window and produce
  user/run/report/trade rows.

## Repair

- Added `resetBacktestsE2eDatabase()` in
  `apps/api/src/modules/backtests/backtests.e2e.test.ts`.
- Expanded cleanup to delete dependent models in FK-safe order:
  `BacktestReport`, `BacktestTrade`, `BacktestRun`, `OrderFill`,
  `WalletCashflowEvent`, `Trade`, `Order`, `Position`, runtime/bot/link rows,
  `WalletBalanceSnapshot`, `Wallet`, `SymbolGroup`, `MarketUniverse`,
  `ApiKey`, `PaymentIntent`, `UserSubscription`, `Strategy`, and `User`.
- Retried the whole destructive reset up to 5 times with a short backoff to
  absorb asynchronous inline backtest completion races.

## Validation

| Command | Result |
| --- | --- |
| `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts --run` | PASS: 1 file / 15 tests |
| `pnpm run test:go-live:api:with-infra` | PASS: 4 files / 45 tests |
| `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests` | PASS: API smoke pack and focused backtests e2e |

## Artifacts

- Repeatable artifact:
  `history/artifacts/qa-repeatable-smoke-e2e-2026-06-27.json`
- Repeatable evidence:
  `history/evidence/qa-repeatable-smoke-e2e-2026-06-27.md`

## Residual Risk

- The repeatable runner still labels the generated artifact internally as
  `LUC-43`; this issue-specific evidence file records that the artifact was
  produced during [LUC-5604](/LUC/issues/LUC-5604) validation.
- The repository was already mixed dirty and `main...origin/main` was
  `ahead 14, behind 1`; this heartbeat did not commit or push.
