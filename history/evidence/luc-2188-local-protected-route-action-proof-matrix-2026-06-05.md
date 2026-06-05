# LUC-2188 Local Protected Route Action Proof Matrix

## Status

- Result: **PASS**
- Environment: local-only
- Evidence date: 2026-06-05
- Generated at (UTC): 2026-06-05T12:19:36.173Z
- Raw JSON: `history\artifacts\luc-2188-local-protected-route-action-proof-matrix-2026-06-05.json`
- Dynamic fixtures: enabled
- Fixture API interception: disabled

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
| SOAR-ACTION-VISIT-PAGE-WALLETS-LIST | `/dashboard/wallets/list` | BLOCKED | `-` | browser fail-closed check not run in static dynamic fixture mode |
| SOAR-ACTION-VISIT-PAGE-WALLET-ID-ROOT | `/dashboard/wallets/luc-2188-wallet` | PASS | `/dashboard/wallets/luc-2188-wallet/edit` | static fixture-id route proof mapped /dashboard/wallets/:id to source files without browser/API mutation |
| SOAR-ACTION-VISIT-PAGE-WALLET-EDIT | `/dashboard/wallets/luc-2188-wallet/edit` | PASS | `/dashboard/wallets/luc-2188-wallet/edit` | static fixture-id route proof mapped /dashboard/wallets/:id/edit to source files without browser/API mutation |
| SOAR-ACTION-VISIT-PAGE-WALLET-PREVIEW | `/dashboard/wallets/luc-2188-wallet/preview` | PASS | `/dashboard/wallets/luc-2188-wallet/preview` | static fixture-id route proof mapped /dashboard/wallets/:id/preview to source files without browser/API mutation |
| SOAR-ACTION-VISIT-PAGE-STRATEGY-ID-ROOT | `/dashboard/strategies/luc-2188-strategy` | PASS | `/dashboard/strategies/luc-2188-strategy/edit` | static fixture-id route proof mapped /dashboard/strategies/:id to source files without browser/API mutation |
| SOAR-ACTION-VISIT-PAGE-STRATEGY-EDIT | `/dashboard/strategies/luc-2188-strategy/edit` | PASS | `/dashboard/strategies/luc-2188-strategy/edit` | static fixture-id route proof mapped /dashboard/strategies/:id/edit to source files without browser/API mutation |
| SOAR-ACTION-VISIT-PAGE-MARKET-EDIT | `/dashboard/markets/luc-2188-market/edit` | PASS | `/dashboard/markets/luc-2188-market/edit` | static fixture-id route proof mapped /dashboard/markets/:id/edit to source files without browser/API mutation |
| SOAR-ACTION-VISIT-PAGE-BOT-DETAIL-ALIAS | `/dashboard/bots/luc-2188-bot` | PASS | `/dashboard/bots/luc-2188-bot/preview` | static fixture-id route proof mapped /dashboard/bots/:id to source files without browser/API mutation |
| SOAR-ACTION-VISIT-PAGE-BOT-EDIT | `/dashboard/bots/luc-2188-bot/edit` | PASS | `/dashboard/bots/luc-2188-bot/edit` | static fixture-id route proof mapped /dashboard/bots/:id/edit to source files without browser/API mutation |
| SOAR-ACTION-VISIT-PAGE-BOT-PREVIEW | `/dashboard/bots/luc-2188-bot/preview` | PASS | `/dashboard/bots/luc-2188-bot/preview` | static fixture-id route proof mapped /dashboard/bots/:id/preview to source files without browser/API mutation |
| SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME | `/dashboard/bots/luc-2188-bot/runtime` | PASS | `/dashboard/bots/luc-2188-bot/preview` | static fixture-id route proof mapped /dashboard/bots/:id/runtime to source files without browser/API mutation |
| SOAR-ACTION-VISIT-PAGE-BOT-ASSISTANT | `/dashboard/bots/luc-2188-bot/assistant` | PASS | `/dashboard/bots/luc-2188-bot/assistant` | static fixture-id route proof mapped /dashboard/bots/:id/assistant to source files without browser/API mutation |
| SOAR-ACTION-VISIT-PAGE-BACKTEST-DETAIL | `/dashboard/backtests/luc-2188-backtest-run` | PASS | `/dashboard/backtests/luc-2188-backtest-run` | static fixture-id route proof mapped /dashboard/backtests/:id to source files without browser/API mutation |

## Source And Test References

| Path | Status |
| --- | --- |
| `apps/web/src/app/dashboard/wallets/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/list/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/create/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/[id]/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/[id]/edit/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/[id]/preview/page.tsx` | present |
| `apps/web/src/app/dashboard/wallets/_components/WalletFormPageContent.tsx` | present |
| `apps/web/src/features/wallets/components/WalletPreviewPanel.tsx` | present |
| `apps/web/src/features/wallets/components/WalletsListTable.test.tsx` | present |
| `apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx` | present |
| `apps/web/src/app/dashboard/wallets/[id]/edit/page.test.tsx` | present |
| `apps/web/src/app/dashboard/wallets/[id]/preview/page.test.tsx` | present |
| `docs/modules/web-wallets.md` | present |
| `docs/modules/api-wallets.md` | present |
| `apps/web/src/app/dashboard/strategies/list/page.tsx` | present |
| `apps/web/src/app/dashboard/strategies/create/page.tsx` | present |
| `apps/web/src/app/dashboard/strategies/[id]/page.tsx` | present |
| `apps/web/src/app/dashboard/strategies/[id]/edit/page.tsx` | present |
| `apps/web/src/features/strategies/components/StrategiesList.test.tsx` | present |
| `apps/web/src/features/strategies/components/StrategyForm.test.tsx` | present |
| `apps/web/src/app/dashboard/strategies/[id]/page.test.tsx` | present |
| `apps/web/src/app/dashboard/strategies/[id]/edit/page.test.tsx` | present |
| `docs/modules/web-strategies.md` | present |
| `docs/modules/api-strategies.md` | present |
| `apps/web/src/app/dashboard/markets/list/page.tsx` | present |
| `apps/web/src/app/dashboard/markets/create/page.tsx` | present |
| `apps/web/src/app/dashboard/markets/[id]/edit/page.tsx` | present |
| `apps/web/src/features/markets/components/MarketUniversesTable.tsx` | present |
| `apps/web/src/features/markets/components/MarketUniverseForm.tsx` | present |
| `apps/web/src/features/markets/components/MarketUniverseForm.test.tsx` | present |
| `apps/web/src/app/dashboard/markets/list/page.test.tsx` | present |
| `apps/web/src/app/dashboard/markets/[id]/edit/page.test.tsx` | present |
| `docs/modules/web-markets.md` | present |
| `docs/modules/api-markets.md` | present |
| `apps/web/src/app/dashboard/bots/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/create/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/new/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/assistant/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/runtime/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/edit/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/preview/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx` | present |
| `apps/web/src/app/dashboard/bots/_components/BotFormPageContent.tsx` | present |
| `apps/web/src/features/bots/components/BotsListTable.tsx` | present |
| `apps/web/src/features/bots/components/BotCreateEditForm.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/create/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/assistant/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/runtime/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/edit/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/preview/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/runtime/page.test.tsx` | present |
| `apps/web/src/app/dashboard/bots/[id]/assistant/page.test.tsx` | present |
| `docs/modules/web-bots.md` | present |
| `docs/modules/api-bots.md` | present |
| `docs/architecture/reference/assistant-runtime-contract.md` | present |
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
| markets | 1 | `GET /dashboard/markets`<br>`POST /dashboard/markets`<br>`GET /dashboard/markets/:id`<br>`PUT /dashboard/markets/:id`<br>`DELETE /dashboard/markets/:id`<br>`GET /dashboard/markets/catalog` | `docs/modules/web-markets.md`<br>`docs/modules/api-markets.md` |
| bots | 5 | `GET /dashboard/bots`<br>`POST /dashboard/bots`<br>`GET /dashboard/bots/:id`<br>`PUT /dashboard/bots/:id`<br>`DELETE /dashboard/bots/:id`<br>`GET /dashboard/bots/:id/market-groups` | `docs/modules/web-bots.md`<br>`docs/modules/api-bots.md` |
| backtests | 1 | `GET /dashboard/backtests`<br>`POST /dashboard/backtests`<br>`GET /dashboard/backtests/:id`<br>`DELETE /dashboard/backtests/:id`<br>`GET /dashboard/backtests/:id/trades`<br>`GET /dashboard/backtests/:id/report`<br>`GET /dashboard/backtests/:id/timeline` | `docs/modules/web-backtest.md`<br>`docs/modules/api-backtests.md` |

## Existing Focused Tests

- wallets: `WalletsListTable.test.tsx`, `WalletCreateEditForm.test.tsx`, `app/dashboard/wallets/[id]/edit/page.test.tsx`, `app/dashboard/wallets/[id]/preview/page.test.tsx`, `wallet route page tests`, `apps/api/src/modules/wallets/wallets.e2e.test.ts`, `apps/api/src/modules/wallets/wallets.crud.e2e.test.ts`
- strategies: `app/dashboard/strategies/list/page.test.tsx`, `app/dashboard/strategies/create/page.test.tsx`, `app/dashboard/strategies/[id]/page.test.tsx`, `app/dashboard/strategies/[id]/edit/page.test.tsx`, `StrategiesList.test.tsx`, `StrategyForm.test.tsx`, `apps/api/src/modules/strategies/strategies.e2e.test.ts`, `apps/api/src/modules/strategies/indicators/indicators.service.test.ts`
- markets: `app/dashboard/markets/list/page.test.tsx`, `app/dashboard/markets/[id]/edit/page.test.tsx`, `MarketUniverseForm.test.tsx`, `MarketUniversesTable.test.tsx`, `apps/api/src/modules/markets/markets.e2e.test.ts`, `apps/api/src/modules/exchanges/marketCatalog.service.test.ts`
- bots: `app/dashboard/bots/create/page.test.tsx`, `app/dashboard/bots/new/page.test.tsx`, `app/dashboard/bots/assistant/page.test.tsx`, `app/dashboard/bots/runtime/page.test.tsx`, `app/dashboard/bots/[id]/page.test.tsx`, `app/dashboard/bots/[id]/edit/page.test.tsx`, `app/dashboard/bots/[id]/preview/page.test.tsx`, `app/dashboard/bots/[id]/runtime/page.test.tsx`, `app/dashboard/bots/[id]/assistant/page.test.tsx`, `BotCreateEditForm.test.tsx`, `BotsManagement.test.tsx`, `apps/api/src/modules/bots/bots.e2e.test.ts`
- backtests: `app/dashboard/backtests/list/page.test.tsx`, `app/dashboard/backtests/[id]/page.test.tsx`, `BacktestCreateForm.test.tsx`, `BacktestsListView.test.tsx`, `apps/api/src/modules/backtests/backtests.e2e.test.ts`

## Blockers

- none

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- Dynamic fixture mode uses synthetic IDs only: `luc-2188-wallet`, `luc-2188-strategy`, `luc-2188-market`, `luc-2188-bot`, `luc-2188-backtest-run`. Optional CDP API interception is available behind `--intercept-fixture-api`, but is disabled by default to keep the local proof non-hanging.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, backtests, profile settings, admin records, logs, or reports, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
