# LUC-2139 Local Protected Route Action Proof Matrix

## Status

- Result: **PASS**
- Environment: local-only
- Evidence date: 2026-06-05
- Generated at (UTC): 2026-06-05T09:35:09.523Z
- Raw JSON: `history\artifacts\luc-2139-local-protected-route-action-proof-matrix-2026-06-05.json`

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-WALLETS-LIST | `/dashboard/wallets/list` | PASS | `/auth/login` | unauthenticated protected wallets list route fails closed to login |
| SOAR-ACTION-VISIT-PAGE-WALLETS-ROOT | `/dashboard/wallets` | PASS | `/dashboard/wallets/list` | redirect reached expected wallets route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-WALLETS-LIST | `/dashboard/wallets/list` | PASS | `/dashboard/wallets/list` | route reached expected wallets route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-WALLET-CREATE | `/dashboard/wallets/create` | PASS | `/dashboard/wallets/create` | route reached expected wallets route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-WALLET-CREATE | `wallets list-page add action` | PASS | `/dashboard/wallets/create` | clicked create/add action (Create), expected create route |
| SOAR-ACTION-VISIT-PAGE-STRATEGIES-LIST | `/dashboard/strategies/list` | PASS | `/dashboard/strategies/list` | route reached expected strategies route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-STRATEGY-CREATE | `/dashboard/strategies/create` | PASS | `/dashboard/strategies/create` | route reached expected strategies route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-STRATEGY-CREATE | `strategies list-page add action` | PASS | `/dashboard/strategies/create` | clicked create/add action (Create), expected create route |
| SOAR-ACTION-VISIT-PAGE-MARKETS-LIST | `/dashboard/markets/list` | PASS | `/dashboard/markets/list` | route reached expected markets route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-MARKET-CREATE | `/dashboard/markets/create` | PASS | `/dashboard/markets/create` | route reached expected markets route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-MARKET-CREATE | `markets list-page add action` | PASS | `/dashboard/markets/create` | clicked create/add action (Create), expected create route |
| SOAR-ACTION-VISIT-PAGE-BOTS-LIST | `/dashboard/bots` | PASS | `/dashboard/bots` | route reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-CREATE | `/dashboard/bots/create` | PASS | `/dashboard/bots/create` | route reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-NEW-ALIAS | `/dashboard/bots/new` | PASS | `/dashboard/bots/create` | redirect reached expected bots route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BOT-CREATE | `bots list-page add action` | PASS | `/dashboard/bots/create` | clicked create/add action (Create bot), expected create route |
| SOAR-ACTION-VISIT-PAGE-BACKTESTS-LIST | `/dashboard/backtests/list` | PASS | `/dashboard/backtests/list` | route reached expected backtests route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BACKTEST-CREATE | `/dashboard/backtests/create` | PASS | `/dashboard/backtests/create` | route reached expected backtests route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BACKTEST-DETAIL | `/dashboard/backtests/luc-2139-local-fixture-run` | PASS | `/dashboard/backtests/luc-2139-local-fixture-run` | route reached expected backtests route with local cookie gate |
| SOAR-ACTION-VISIT-PAGE-BACKTEST-CREATE | `backtests list-page add action` | PASS | `/dashboard/backtests/create` | clicked create/add action (Create), expected create route |

## Source And Test References

| Path | Status |
| --- | --- |
| `apps/web/src/app/dashboard/wallets/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/list/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/create/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/_components/WalletFormPageContent.tsx` | present |
| `apps/web/src/features/wallets/components/WalletsListTable.test.tsx` | present |
| `apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx` | present |
| `docs/modules/web-wallets.md` | present |
| `docs/modules/api-wallets.md` | present |
| `apps/web/src/app/dashboard/strategies/list/page.tsx` | present |
| `apps/web/src/app/dashboard/strategies/create/page.tsx` | present |
| `apps/web/src/features/strategies/components/StrategiesList.test.tsx` | present |
| `apps/web/src/features/strategies/components/StrategyForm.test.tsx` | present |
| `docs/modules/web-strategies.md` | present |
| `docs/modules/api-strategies.md` | present |
| `apps/web/src/app/dashboard/markets/list/page.tsx` | present |
| `apps/web/src/app/dashboard/markets/create/page.tsx` | present |
| `apps/web/src/features/markets/components/MarketUniversesTable.tsx` | present |
| `apps/web/src/features/markets/components/MarketUniverseForm.tsx` | present |
| `apps/web/src/features/markets/components/MarketUniverseForm.test.tsx` | present |
| `apps/web/src/app/dashboard/markets/list/page.test.tsx` | present |
| `docs/modules/web-markets.md` | present |
| `docs/modules/api-markets.md` | present |
| `apps/web/src/app/dashboard/bots/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/create/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/new/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/_components/BotFormPageContent.tsx` | present |
| `apps/web/src/features/bots/components/BotsListTable.tsx` | present |
| `apps/web/src/features/bots/components/BotCreateEditForm.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/create/page.test.tsx` | present |
| `docs/modules/web-bots.md` | present |
| `docs/modules/api-bots.md` | present |
| `apps/web/src/app/dashboard/backtests/list/page.tsx` | present |
| `apps/web/src/app/dashboard/backtests/create/page.tsx` | present |
| `apps/web/src/app/dashboard/backtests/[id]/page.tsx` | present |
| `apps/web/src/features/backtest/components/BacktestsListView.tsx` | present |
| `apps/web/src/features/backtest/components/BacktestCreateForm.tsx` | present |
| `apps/web/src/features/backtest/components/BacktestRunDetails.tsx` | present |
| `apps/web/src/app/dashboard/backtests/list/page.test.tsx` | present |
| `apps/web/src/app/dashboard/backtests/[id]/page.test.tsx` | present |
| `docs/modules/web-backtest.md` | present |
| `docs/modules/api-backtests.md` | present |

## Cluster References

| Cluster | Actions | API routes | Docs |
| --- | ---: | --- | --- |
| wallets | 3 | `GET /dashboard/wallets`<br>`POST /dashboard/wallets`<br>`GET /dashboard/wallets/metadata`<br>`GET /dashboard/wallets/:id`<br>`PUT /dashboard/wallets/:id`<br>`DELETE /dashboard/wallets/:id`<br>`POST /dashboard/wallets/:id/reset-paper` | `docs/modules/web-wallets.md`<br>`docs/modules/api-wallets.md` |
| strategies | 2 | `GET /dashboard/strategies`<br>`POST /dashboard/strategies`<br>`GET /dashboard/strategies/:id`<br>`PUT /dashboard/strategies/:id`<br>`DELETE /dashboard/strategies/:id`<br>`GET /dashboard/strategies/indicators`<br>`POST /dashboard/strategies/import`<br>`GET /dashboard/strategies/:id/export` | `docs/modules/web-strategies.md`<br>`docs/modules/api-strategies.md` |
| markets | 2 | `GET /dashboard/markets`<br>`POST /dashboard/markets`<br>`GET /dashboard/markets/:id`<br>`PUT /dashboard/markets/:id`<br>`DELETE /dashboard/markets/:id`<br>`GET /dashboard/markets/catalog` | `docs/modules/web-markets.md`<br>`docs/modules/api-markets.md` |
| bots | 3 | `GET /dashboard/bots`<br>`POST /dashboard/bots`<br>`GET /dashboard/bots/:id`<br>`PUT /dashboard/bots/:id`<br>`DELETE /dashboard/bots/:id`<br>`GET /dashboard/bots/:id/market-groups` | `docs/modules/web-bots.md`<br>`docs/modules/api-bots.md` |
| backtests | 3 | `GET /dashboard/backtests`<br>`POST /dashboard/backtests`<br>`GET /dashboard/backtests/:id`<br>`DELETE /dashboard/backtests/:id`<br>`GET /dashboard/backtests/:id/trades`<br>`GET /dashboard/backtests/:id/report`<br>`GET /dashboard/backtests/:id/timeline` | `docs/modules/web-backtest.md`<br>`docs/modules/api-backtests.md` |

## Existing Focused Tests

- wallets: `WalletsListTable.test.tsx`, `WalletCreateEditForm.test.tsx`, `wallet route page tests`, `apps/api/src/modules/wallets/wallets.e2e.test.ts`, `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`
- strategies: `app/dashboard/strategies/list/page.test.tsx`, `app/dashboard/strategies/create/page.test.tsx`, `StrategiesList.test.tsx`, `StrategyForm.test.tsx`, `apps/api/src/modules/strategies/strategies.e2e.test.ts`, `apps/api/src/modules/strategies/indicators/indicators.service.test.ts`
- markets: `app/dashboard/markets/list/page.test.tsx`, `MarketUniverseForm.test.tsx`, `MarketUniversesTable.test.tsx`, `apps/api/src/modules/markets/markets.e2e.test.ts`, `apps/api/src/modules/exchanges/marketCatalog.service.test.ts`
- bots: `app/dashboard/bots/create/page.test.tsx`, `app/dashboard/bots/new/page.test.tsx`, `BotCreateEditForm.test.tsx`, `BotsManagement.test.tsx`, `apps/api/src/modules/bots/bots.e2e.test.ts`
- backtests: `app/dashboard/backtests/list/page.test.tsx`, `app/dashboard/backtests/[id]/page.test.tsx`, `BacktestCreateForm.test.tsx`, `BacktestsListView.test.tsx`, `apps/api/src/modules/backtests/backtests.e2e.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, or backtests, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
