# Module Registry

Updated: 2026-05-28

Purpose: connect code modules to deep-dive docs, pipeline usage, routes/data,
tests, and known gaps. This registry reuses the existing module deep dives
instead of replacing them.

## Registry Sources
- High-level module map: `docs/modules/system-modules.md`
- Coverage/status index: `docs/modules/module-doc-status-index.md`
- Deep-dive template: `docs/modules/module-deep-dive-template.md`
- Codebase map: `docs/architecture/codebase-map.md`
- Traceability matrix: `docs/architecture/traceability-matrix.md`
- Pipeline registry: `docs/pipelines/pipeline-registry.md`

## API Module Registry
| Module | Responsibility | Public Interface | Used By Pipelines | Data Models | Tests | Doc | Known Gaps |
|---|---|---|---|---|---|---|---|
| admin | Admin users and subscription plans. | `/admin/users*`, `/admin/subscriptions/plans*` | Admin management | `User`, `SubscriptionPlan`, `UserSubscription` | `admin/**/*.e2e.test.ts` | `api-admin.md` | None found. |
| auth | Register/login/session/logout. | `/auth/*` | Access/session | `User` | `auth.*.test.ts`, middleware tests | `api-auth.md` | None found. |
| profile | User profile, security, API keys, subscription profile. | `/dashboard/profile/*` | Account/API-key setup | `User`, `ApiKey`, subscription models | `profile/**/*.e2e.test.ts` | `api-profile.md` | None found. |
| users | Shared user representation helpers. | Internal/shared | Access/session, admin | `User` | Covered through auth/admin/profile | `api-users.md` | Public surface is helper-level, not route-level. |
| wallets | Wallet CRUD, preview, ledger/cashflow analytics. | `/dashboard/wallets*` | Wallet and bot configuration, reporting | `Wallet`, `WalletBalanceSnapshot`, `WalletCashflowEvent` | `wallets*.test.ts` | `api-wallets.md` | Continue ledger trace expansion as LIVE analytics grows. |
| markets | Market universe CRUD and catalog. | `/dashboard/markets/*` | Wallet and bot configuration | `MarketUniverse`, `SymbolGroup` | `markets.e2e.test.ts` | `api-markets.md` | None found. |
| strategies | Strategy CRUD/import/export and indicator metadata. | `/dashboard/strategies*` | Wallet/bot config, runtime signal, backtest | `Strategy`, strategy link models | `strategies.e2e.test.ts`, indicator tests | `api-strategies.md` | None found. |
| bots | Bot CRUD, market groups, runtime read models, assistant config. | `/dashboard/bots*` | Wallet/bot config, runtime signal, live reconciliation, assistant | `Bot`, `BotMarketGroup`, runtime models | `bots*.test.ts` | `api-bots.md` | Keep deep dive current when runtime read slices split further. |
| engine | Runtime decision/execution core. | Internal service boundary | Runtime signal, manual order, backtest parity | runtime/trading lifecycle models | engine focused tests | `api-engine.md` | Endpoint links are indirect through bots/orders/backtests. |
| exchange | Exchange adapters, metadata, public/auth reads, live order boundary. | Internal service boundary | Runtime, manual order, LIVE reconciliation, backtest | `ApiKey` plus exchange data | exchange focused tests | `api-exchange.md` | New exchange families must update adapter matrix. |
| market-data | OHLCV and indicator feed adapter. | Internal service boundary | Runtime/backtest data | `MarketCandleCache` | market-data tests | `api-market-data.md` | None found. |
| market-stream | Websocket ingest and SSE/fanout. | `/dashboard/market-stream/events` | Runtime signal, deployment readiness | runtime event/stat data, Redis | stream route/service tests | `api-market-stream.md` | Event delivery must be smoked, not only connection open. |
| orders | Order reads/commands and manual context. | `/dashboard/orders*` | Manual order, runtime execution | `Order`, `OrderFill`, `Position`, `Trade` | orders tests | `api-orders.md` | Keep exchange-event lifecycle links current. |
| positions | Position reads, reconciliation, takeover/orphan repair. | `/dashboard/positions*` | LIVE reconciliation, manual/runtime views | `Position`, `Trade`, `Order` | positions tests | `api-positions.md` | None found. |
| backtests | Backtest run/report/timeline/trade flows. | `/dashboard/backtests/runs*` | Backtest run, reports | `BacktestRun`, `BacktestTrade`, `BacktestReport` | backtest tests | `api-backtests.md` | None found. |
| reports | Cross-mode performance reporting. | `/dashboard/reports/cross-mode-performance` | Reporting | trading/backtest models | `reports.service.test.ts` | `api-reports.md` | Web test mapping needs periodic confirmation. |
| logs | Audit/event log reads. | `/dashboard/logs` | Reporting and audit read | `Log` | `logs.e2e.test.ts` | `api-logs.md` | None found. |
| icons | Coin icon lookup. | `/dashboard/icons/lookup` | Dashboard/runtime display | none primary | `icons.e2e.test.ts` | `api-icons.md` | None found. |
| subscriptions | Entitlements and payment checkout foundation. | Internal/admin/profile contracts | Admin, account/subscription | subscription/payment models | subscription tests | `api-subscriptions.md` | Payment-provider runtime path may need deeper trace when activated. |
| upload | Avatar upload. | `/upload/avatar` | Profile/account | user avatar fields | `upload.e2e.test.ts` | `api-upload.md` | None found. |
| pagination | Shared pagination parsing. | Internal/shared | Logs/orders/backtests/etc. | none primary | `pagination-query.test.ts` | `api-pagination.md` | None found. |
| isolation | Multi-tenant isolation tests. | Test/guard module | Security across APIs | all user-scoped models | `data-isolation.e2e.test.ts` | `api-isolation.md` | Keep coverage broad when new user-owned models appear. |

## Web Module Registry
| Module | Responsibility | Public Interface | Used By Pipelines | Related API | Tests | Doc | Known Gaps |
|---|---|---|---|---|---|---|---|
| auth | Login/register screens. | `/auth/login`, `/auth/register` | Access/session | `/auth/*` | auth feature tests if present | `web-auth.md` | None found. |
| dashboard-home | Control center and runtime widgets. | `/dashboard` | Runtime signal, manual order, LIVE reconciliation | bots, market-stream, icons, orders | dashboard-home tests | `web-dashboard-home.md` | Keep runtime truth derivation links current. |
| profile | Profile/security/API-key/subscription UI. | `/dashboard/profile` | Account/API-key setup | profile, upload | profile tests | `web-profile.md` | None found. |
| exchanges | Exchange connection context UI for profile integrations. | `/dashboard/profile#api` | Account/API-key setup | profile API keys | exchange feature tests if present | `web-exchanges.md` | Standalone route is intentionally not current canonical path. |
| wallets | Wallet list/create/edit/preview. | `/dashboard/wallets*` | Wallet/bot config, reporting | wallets | wallet tests | `web-wallets.md` | Continue ledger/equity UI trace as feature expands. |
| markets | Market universe list/create/edit. | `/dashboard/markets*` | Wallet/bot config | markets | markets tests | `web-markets.md` | None found. |
| strategies | Strategy list/create/edit. | `/dashboard/strategies*` | Wallet/bot config, runtime/backtest inputs | strategies | strategy tests | `web-strategies.md` | None found. |
| bots | Bot list/create/detail/runtime/assistant. | `/dashboard/bots*` | Wallet/bot config, runtime, assistant | bots, orders, positions | bots tests | `web-bots.md` | None found. |
| backtest | Backtest list/create/details. | `/dashboard/backtests*` | Backtest run, reports | backtests | backtest tests | `web-backtest.md` | None found. |
| reports | Performance reports. | `/dashboard/reports` | Reporting | reports/backtests | `UNVERIFIED / NEEDS CONFIRMATION` | `web-reports.md` | Exact test file mapping needs future confirmation. |
| logs | Audit trail. | `/dashboard/logs` | Reporting/audit | logs | logs tests | `web-logs.md` | None found. |
| admin | Admin users/subscriptions. | `/admin*` | Admin management | admin | admin tests if present | `web-admin.md` | None found. |
| icons | Icon lookup hook/service. | Shared | Dashboard/runtime display | icons | icons tests if present | `web-icons.md` | None found. |
| shared | Shared feature helpers. | Internal/shared | Multiple pipelines | multiple | helper tests where present | `web-shared.md` | Keep ownership explicit to avoid cross-feature duplication. |

## Mobile Module Registry
| Module | Responsibility | Public Interface | Used By Pipelines | Related API | Tests | Doc | Known Gaps |
|---|---|---|---|---|---|---|---|
| bootstrap | Native/mobile scope boundary and scaffold baseline. | None (no production mobile routes/screens). | Mobile activation governance only (no runtime pipeline usage yet). | None yet (web/API contracts are reused conceptually only). | Placeholder script echoes in `apps/mobile/package.json` (`dev/build/test`). | `mobile-bootstrap.md` | No Expo Router app shell, no implemented screens, no native build/test pipeline, and no mobile-specific API contracts yet. |

## Maintenance
- Add a new row here when a new module appears under `apps/api/src/modules` or
  `apps/web/src/features`.
- Update the relevant deep-dive doc in the same task.
- Update `docs/architecture/traceability-matrix.md` and pipeline docs when a
  module becomes part of a feature flow.
