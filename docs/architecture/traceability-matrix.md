# Traceability Matrix

Updated: 2026-05-03

Purpose: map core Soar features across frontend entry, backend route/API,
services/modules, database models, pipelines, tests, and related docs. `GAP`
means the trace is incomplete or needs a stronger future evidence pass.

## Core Feature Matrix
| Feature | Frontend Entry | Backend Route/API | Service / Module | Database Models | Pipeline | Tests | Related Docs |
|---|---|---|---|---|---|---|---|
| Auth session | `/auth/login`, `/auth/register`, `features/auth` | `/auth/register`, `/auth/login`, `/auth/me`, `/auth/logout` | `api/auth`, auth middleware | `User` | Access/session | `auth.*.test.ts`, `requireAuth.test.ts`, cache header tests | `docs/modules/api-auth.md`, `docs/modules/web-auth.md`, `docs/security/security-and-risk.md` |
| Profile and API keys | `/dashboard/profile`, `features/profile` | `/dashboard/profile/basic`, `/dashboard/profile/security`, `/dashboard/profile/apiKeys`, `/upload/avatar` | `api/profile`, `api/upload`, `api/exchange` API-key probe | `User`, `ApiKey` | Account/API-key setup | `profile/*/*.e2e.test.ts`, `exchangeApiKeyProbe.service.test.ts`, `upload.e2e.test.ts` | `docs/modules/api-profile.md`, `docs/security/api-key-lifecycle-policy.md` |
| Wallet setup and ledger | `/dashboard/wallets*`, `features/wallets` | `/dashboard/wallets*`, preview balance, performance summary, equity timeline, cashflow events | `api/wallets`, `api/exchange`, wallet ledger/classifier | `Wallet`, `WalletBalanceSnapshot`, `WalletCashflowEvent`, `ApiKey` | Wallet and bot configuration | `wallets*.e2e.test.ts`, `walletCashflowClassifier.service.test.ts` | `docs/modules/api-wallets.md`, `docs/architecture/reference/wallet-source-of-truth-contract.md` |
| Market universe | `/dashboard/markets*`, `features/markets` | `/dashboard/markets/universes*`, `/dashboard/markets/catalog` | `api/markets`, catalog resolver | `MarketUniverse`, `SymbolGroup`, `BotMarketGroup` | Wallet and bot configuration | `markets.e2e.test.ts`, market universe bot tests | `docs/modules/api-markets.md`, `docs/modules/web-markets.md` |
| Strategy builder | `/dashboard/strategies*`, `features/strategies` | `/dashboard/strategies*`, `/dashboard/strategies/indicators` | `api/strategies`, `api/engine` indicator registry | `Strategy`, `BotStrategy`, `MarketGroupStrategyLink` | Runtime signal execution, backtest run | `strategies.e2e.test.ts`, `strategyIndicatorRegistryParity.test.ts`, indicator tests | `docs/modules/api-strategies.md`, `docs/architecture/reference/indicator-registry-parity-contract.md` |
| Bot configuration | `/dashboard/bots/create`, `/dashboard/bots/:id/edit`, `features/bots` | `/dashboard/bots*`, market groups, strategy links | `api/bots`, bot command/read services | `Bot`, `BotMarketGroup`, `MarketGroupStrategyLink`, `BotStrategy`, `Wallet`, `Strategy` | Wallet and bot configuration | `bots.e2e.test.ts`, `bots.wallet-contract.e2e.test.ts`, `bots.runtime-scope.e2e.test.ts` | `docs/modules/api-bots.md`, `docs/architecture/04_runtime-contexts.md` |
| Bot runtime monitoring | `/dashboard`, `/dashboard/bots*`, `features/dashboard-home`, `features/bots` | `/dashboard/bots/:id/runtime-*`, `/dashboard/market-stream/events` | `api/bots` runtime read models, `api/market-stream`, workers | `BotRuntimeSession`, `BotRuntimeEvent`, `BotRuntimeSymbolStat`, `Position`, `Trade`, `Signal` | Runtime signal execution | runtime read-model tests, market stream tests, dashboard/bots component tests | `docs/modules/api-bots.md`, `docs/architecture/reference/stream-transport-contract.md` |
| Runtime signal execution | Runtime workers and dashboard monitoring | Internal worker path plus `/dashboard/bots/:id/runtime-*` reads | `api/engine` runtime loop/final candle/pre-trade/orchestrator, `api/bots` read models | `BotRuntimeSession`, `BotRuntimeEvent`, `BotRuntimeSymbolStat`, `RuntimeExecutionDedupe`, `Signal`, `Order`, `Position`, `Trade` | Runtime signal execution | `runtimeSignalLoop.service.test.ts`, `runtimeFinalCandleDecision.service.test.ts`, `runtimeSignalMarketDataGateway.test.ts`, parity tests | `docs/architecture/reference/runtime-signal-merge-contract.md`, `docs/modules/api-engine.md` |
| Manual order execution | Dashboard manual-order panel, bot runtime surfaces | `/dashboard/orders/manual-context`, `/dashboard/orders/open`, `/dashboard/orders/:id/close`, `/dashboard/orders/:id/cancel` | `api/orders`, `api/engine`, `api/exchange`, `api/bots` context | `Order`, `OrderFill`, `Position`, `Trade`, `Wallet`, `Bot` | Manual order execution | `orders*.test.ts`, `orders-positions.e2e.test.ts`, dashboard manual-order tests | `docs/modules/api-orders.md`, `docs/architecture/06_execution-lifecycle.md` |
| Position ownership and takeover | Dashboard positions/runtime views | `/dashboard/positions*`, takeover/rebind/orphan repair | `api/positions`, `api/bots` ownership, `api/exchange`, `api/engine` automation | `Position`, `Trade`, `Order`, `Bot`, `Wallet`, `ApiKey` | Live imported position reconciliation | `positions*.e2e.test.ts`, `runtimeExternalPositionOwner.service.test.ts`, `livePositionReconciliation.service.test.ts` | `docs/modules/api-positions.md`, `docs/architecture/reference/position-close-attribution-contract.md` |
| Backtest run | `/dashboard/backtests*`, `features/backtest` | `/dashboard/backtests/runs*` | `api/backtests`, backtest worker, `api/engine` shared kernel, exchange public reads | `BacktestRun`, `BacktestTrade`, `BacktestReport`, `MarketCandleCache`, `Strategy` | Backtest run | `backtests.e2e.test.ts`, `backtestRunJob.test.ts`, parity/gateway tests | `docs/modules/api-backtests.md`, `docs/architecture/07_modes-parity-and-data.md` |
| Reports | `/dashboard/reports`, `features/reports` | `/dashboard/reports/cross-mode-performance`, backtest reads | `api/reports`, `api/backtests` | `BacktestRun`, `BacktestTrade`, `Trade`, `Position`, `Wallet` | Reporting | `reports.service.test.ts`, web reports tests if present | `docs/modules/api-reports.md`, `docs/modules/web-reports.md` |
| Logs/audit trail | `/dashboard/logs`, `features/logs` | `/dashboard/logs` | `api/logs` | `Log` | Audit log read | `logs.e2e.test.ts`, web logs tests | `docs/modules/api-logs.md`, `docs/modules/web-logs.md` |
| Admin subscriptions/users | `/admin*`, `features/admin` | `/admin/subscriptions/plans*`, `/admin/users*` | `api/admin`, role middleware | `User`, `SubscriptionPlan`, `UserSubscription` | Admin management | `admin/*/*.e2e.test.ts`, admin web tests if present | `docs/modules/api-admin.md`, `docs/modules/web-admin.md` |
| Assistant runtime config | `/dashboard/bots/*assistant*`, `features/bots` | `/dashboard/bots/:id/assistant-config*` | `api/bots` assistant services, `api/engine` assistant orchestrator | `BotAssistantConfig`, `BotSubagentConfig`, `Bot` | Assistant dry-run/config | `assistantOrchestrator*.test.ts`, bots assistant e2e coverage | `docs/architecture/reference/assistant-runtime-contract.md`, `docs/modules/api-bots.md` |

## Current Gaps
| Gap | Impact | Next Repair Slice |
|---|---|---|
| Endpoint-level generated API matrix is not yet machine-generated from route files. | Manual traceability can drift when routes change. | Add a docs parity check that compares route files with this matrix and `dashboard-route-map.md`. |
| Mobile app traceability is not covered beyond acknowledging `apps/mobile`. | Future mobile work could drift from V1 web/API contracts. | Create mobile module docs when mobile becomes active. |
| Some web feature test mappings are inferred from module coverage rather than enumerated per file. | New agents may need extra search for exact test files. | Extend module deep dives with a standard `Tests` table during future module edits. |
| Historical planning files contain unchecked boxes that are not active work. | New agents can misread old plans as current tasks. | Continue active queue sync tasks and keep historical files out of the canonical reading path. |

## Maintenance
Any new feature or route must update:
- this matrix,
- `docs/architecture/codebase-map.md` if structure changes,
- `docs/pipelines/index.md` or a pipeline doc if flow changes,
- `docs/modules/index.md` and relevant module deep dives if ownership changes,
- `docs/analysis/documentation-drift.md` if a new gap is discovered.
