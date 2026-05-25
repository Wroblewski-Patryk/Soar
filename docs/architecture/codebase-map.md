# Codebase Map

Updated: 2026-05-24

Purpose: provide a repository-grounded map of Soar implementation surfaces.
This file links code structure to the canonical architecture and module docs.
It does not redefine runtime behavior; architecture contracts remain the
source of truth.

For graph-backed feature and dependency analysis, use
`docs/architecture/architecture-evidence-graph-system.md` plus the CSV
registries under `docs/architecture/registry/`,
`docs/architecture/relations/`, and `docs/architecture/chains/`.

## Runtime Shape
| Layer | Path | Responsibility |
|---|---|---|
| Web app | `apps/web/src/app`, `apps/web/src/features`, `apps/web/src/ui` | Next.js routes, dashboard screens, feature services/hooks, shared UI. |
| API app | `apps/api/src/router`, `apps/api/src/modules`, `apps/api/src/middleware` | Express routes, auth, dashboard/admin API, module services, authorization and rate limits. |
| Domain/runtime engine | `apps/api/src/modules/engine` | Runtime decisions, signal loop, lifecycle, paper/live parity, pre-trade/risk, orchestration. |
| Exchange boundary | `apps/api/src/modules/exchange` | Exchange adapter registry, Binance connectors, public/authenticated reads, live order adapter. |
| Data access | `apps/api/prisma/schema.prisma`, `apps/api/src/prisma` | Prisma schema, migrations, database client boundary. |
| Workers | `apps/api/src/workers` | Backtest, execution, market data, market stream workers. |
| Queue/config | `apps/api/src/queue`, `apps/api/src/config` | Queue tuning and runtime config parsing. |
| Ops scripts | `scripts/*` | Local dev, build, deploy, release, smoke, RC evidence, docs parity. |

## Backend Modules
| Module | Source Path | Primary Responsibility | Main Docs |
|---|---|---|---|
| admin | `apps/api/src/modules/admin` | Admin users and subscription plan management. | `docs/modules/api-admin.md` |
| auth | `apps/api/src/modules/auth` | Registration, login, JWT/session cookies, logout, current user. | `docs/modules/api-auth.md` |
| backtests | `apps/api/src/modules/backtests` | Backtest run creation, data gateway, reports, timeline/trade reads, queue integration. | `docs/modules/api-backtests.md` |
| bots | `apps/api/src/modules/bots` | Bot CRUD, runtime read models, market groups, strategy links, assistant config, monitoring. | `docs/modules/api-bots.md` |
| engine | `apps/api/src/modules/engine` | Signal evaluation, runtime loop, lifecycle, risk, automation, paper/live execution core. | `docs/modules/api-engine.md` |
| exchange | `apps/api/src/modules/exchange` | Exchange-owned public/authenticated reads, metadata, capabilities, live order adapters. | `docs/modules/api-exchange.md` |
| icons | `apps/api/src/modules/icons` | Coin icon lookup. | `docs/modules/api-icons.md` |
| isolation | `apps/api/src/modules/isolation` | Multi-tenant isolation guard coverage. | `docs/modules/api-isolation.md` |
| logs | `apps/api/src/modules/logs` | Audit log read API and filtering. | `docs/modules/api-logs.md` |
| market-data | `apps/api/src/modules/market-data` | OHLCV and indicator adapter layer. | `docs/modules/api-market-data.md` |
| market-stream | `apps/api/src/modules/market-stream` | Market websocket ingest and SSE/Redis fanout. | `docs/modules/api-market-stream.md` |
| markets | `apps/api/src/modules/markets` | Market universe CRUD and catalog resolution. | `docs/modules/api-markets.md` |
| orders | `apps/api/src/modules/orders` | Order reads/commands, manual order context, exchange event lifecycle. | `docs/modules/api-orders.md` |
| pagination | `apps/api/src/modules/pagination` | Shared pagination query normalization. | `docs/modules/api-pagination.md` |
| positions | `apps/api/src/modules/positions` | Position reads, live reconciliation, takeover/orphan repair, imported history hydration. | `docs/modules/api-positions.md` |
| profile | `apps/api/src/modules/profile` | Profile basics, security, API keys, subscription profile. | `docs/modules/api-profile.md` |
| reports | `apps/api/src/modules/reports` | Cross-mode performance reporting. | `docs/modules/api-reports.md` |
| strategies | `apps/api/src/modules/strategies` | Strategy CRUD, import/export, indicator metadata. | `docs/modules/api-strategies.md` |
| subscriptions | `apps/api/src/modules/subscriptions` | Subscription entitlements and payment checkout foundation. | `docs/modules/api-subscriptions.md` |
| upload | `apps/api/src/modules/upload` | Avatar upload endpoint. | `docs/modules/api-upload.md` |
| users | `apps/api/src/modules/users` | Shared user representation helpers. | `docs/modules/api-users.md` |
| wallets | `apps/api/src/modules/wallets` | Wallet CRUD, balance preview, ledger/cashflow analytics. | `docs/modules/api-wallets.md` |

## API Route Mounts
| Mount | Module/Router | Auth Boundary |
|---|---|---|
| `/auth/*` | `apps/api/src/modules/auth/auth.routes.ts` | Public with auth/login rate limits; session cookie/token issuance. |
| `/dashboard/*` | `apps/api/src/router/dashboard.routes.ts` | `requireAuth`, no-store headers. |
| `/admin/*` | `apps/api/src/router/admin.routes.ts` | `requireAuth` + `requireRole('ADMIN')`, no-store headers. |
| `/upload/avatar` | `apps/api/src/modules/upload/upload.routes.ts` | `requireAuth` and upload limiter. |

## Dashboard API Families
| API Family | Route File | Endpoint Surface |
|---|---|---|
| Profile | `profile/*/*.routes.ts` | `/dashboard/profile/basic`, `/dashboard/profile/security`, `/dashboard/profile/apiKeys`, `/dashboard/profile/subscription`. |
| Strategies | `strategies/strategies.routes.ts`, `strategies/indicators/indicators.routes.ts` | `/dashboard/strategies*`, `/dashboard/strategies/indicators`. |
| Markets | `markets/markets.routes.ts` | `/dashboard/markets/universes*`, `/dashboard/markets/catalog`. |
| Wallets | `wallets/wallets.routes.ts` | `/dashboard/wallets*`, performance summary, equity timeline, cashflow events, preview balance. |
| Bots | `bots/bots.routes.ts` | `/dashboard/bots*`, runtime sessions, positions, trades, symbol stats, market groups, assistant config. |
| Orders | `orders/orders.routes.ts` | `/dashboard/orders`, manual context, open/cancel/close. |
| Positions | `positions/positions.routes.ts` | `/dashboard/positions`, live status, exchange snapshot, takeover/rebind/orphan repair, management updates. |
| Backtests | `backtests/backtests.routes.ts` | `/dashboard/backtests/runs*`, trades, report, timeline. |
| Reports | `reports/reports.routes.ts` | `/dashboard/reports/cross-mode-performance`. |
| Logs | `logs/logs.routes.ts` | `/dashboard/logs`. |
| Market stream | `market-stream/marketStream.routes.ts` | `/dashboard/market-stream/events`. |
| Icons | `icons/icons.routes.ts` | `/dashboard/icons/lookup`. |

## Frontend Features
| Feature | Source Path | Primary Routes / Usage | Main Docs |
|---|---|---|---|
| auth | `apps/web/src/features/auth` | `/auth/login`, `/auth/register` | `docs/modules/web-auth.md` |
| dashboard-home | `apps/web/src/features/dashboard-home` | `/dashboard` | `docs/modules/web-dashboard-home.md` |
| profile | `apps/web/src/features/profile` | `/dashboard/profile` | `docs/modules/web-profile.md` |
| exchanges | `apps/web/src/features/exchanges` | Profile integrations context UI (`/dashboard/profile#api`) | `docs/modules/web-exchanges.md` |
| wallets | `apps/web/src/features/wallets` | `/dashboard/wallets*` | `docs/modules/web-wallets.md` |
| markets | `apps/web/src/features/markets` | `/dashboard/markets*` | `docs/modules/web-markets.md` |
| strategies | `apps/web/src/features/strategies` | `/dashboard/strategies*` | `docs/modules/web-strategies.md` |
| bots | `apps/web/src/features/bots` | `/dashboard/bots*` | `docs/modules/web-bots.md` |
| backtest | `apps/web/src/features/backtest` | `/dashboard/backtests*` | `docs/modules/web-backtest.md` |
| reports | `apps/web/src/features/reports` | `/dashboard/reports` | `docs/modules/web-reports.md` |
| logs | `apps/web/src/features/logs` | `/dashboard/logs` | `docs/modules/web-logs.md` |
| admin | `apps/web/src/features/admin` | `/admin*` | `docs/modules/web-admin.md` |
| icons | `apps/web/src/features/icons` | Shared icon lookup hooks/services | `docs/modules/web-icons.md` |
| shared | `apps/web/src/features/shared` | Shared feature-level helpers | `docs/modules/web-shared.md` |

## Frontend Route Inventory
Current route files under `apps/web/src/app` include:
- Public: `/`, `/auth/login`, `/auth/register`, `/offline`.
- Dashboard: `/dashboard`, `/dashboard/profile`,
  `/dashboard/logs`, `/dashboard/reports`.
- Wallets: `/dashboard/wallets`, `/dashboard/wallets/list`,
  `/dashboard/wallets/create`, `/dashboard/wallets/:id`,
  `/dashboard/wallets/:id/edit`, `/dashboard/wallets/:id/preview`.
- Markets: `/dashboard/markets/list`, `/dashboard/markets/create`,
  `/dashboard/markets/:id/edit`.
- Strategies: `/dashboard/strategies/list`, `/dashboard/strategies/create`,
  `/dashboard/strategies/:id`, `/dashboard/strategies/:id/edit`.
- Bots: `/dashboard/bots`, `/dashboard/bots/new`, `/dashboard/bots/create`,
  `/dashboard/bots/runtime`, `/dashboard/bots/assistant`,
  `/dashboard/bots/:id`, `/dashboard/bots/:id/edit`,
  `/dashboard/bots/:id/preview`, `/dashboard/bots/:id/runtime`,
  `/dashboard/bots/:id/assistant`.
- Backtests: `/dashboard/backtests/list`, `/dashboard/backtests/create`,
  `/dashboard/backtests/:id`.
- Admin: `/admin`, `/admin/users`, `/admin/subscriptions`.

The canonical route-to-feature-to-API contract remains
`docs/architecture/reference/dashboard-route-map.md`.

## Data Models
Core Prisma model groups in `apps/api/prisma/schema.prisma`:
- Identity/auth: `User`, `ApiKey`.
- Subscription/billing foundation: `SubscriptionPlan`, `UserSubscription`,
  `PaymentIntent`.
- Strategy and markets: `Strategy`, `MarketUniverse`, `SymbolGroup`,
  `MarketCandleCache`.
- Bot configuration/runtime: `Bot`, `BotStrategy`, `BotMarketGroup`,
  `MarketGroupStrategyLink`, `BotAssistantConfig`, `BotSubagentConfig`,
  `BotRuntimeSession`, `BotRuntimeEvent`, `BotRuntimeSymbolStat`,
  `RuntimeExecutionDedupe`.
- Wallet/accounting: `Wallet`, `WalletBalanceSnapshot`,
  `WalletCashflowEvent`.
- Trading lifecycle: `Position`, `Order`, `Trade`, `OrderFill`, `Signal`.
- Backtests: `BacktestRun`, `BacktestTrade`, `BacktestReport`.
- Audit: `Log`.

## Workers And Queues
| Worker/Queue Surface | Path | Responsibility |
|---|---|---|
| Backtest worker | `apps/api/src/workers/backtest.worker.ts` | Runs queued backtest jobs. |
| Execution worker | `apps/api/src/workers/execution.worker.ts` | Runtime execution worker entrypoint. |
| Market data worker | `apps/api/src/workers/marketData.worker.ts` | Market-data background tasks. |
| Market stream worker | `apps/api/src/workers/marketStream.worker.ts` | Exchange websocket subscription and fanout. |
| Worker bootstrap/ownership | `apps/api/src/workers/workerBootstrap.ts`, `workerOwnership.ts` | Worker startup and ownership checks. |
| Queue tuning | `apps/api/src/queue/queueTuning.ts` | Queue tuning defaults and tests. |

## Integrations
| Integration | Owning Area | Notes |
|---|---|---|
| Binance public market data | `apps/api/src/modules/exchange`, `market-stream`, `market-data` | Direct exchange access must stay behind exchange-owned contracts. |
| Binance authenticated reads/orders | `apps/api/src/modules/exchange`, `orders`, `positions`, `wallets` | API keys live under profile/wallet context; live execution uses approved exchange boundary. |
| PostgreSQL | Prisma schema/migrations | Persistent source for users, config, runtime/lifecycle data, logs, reports. |
| Redis | Market stream fanout, runtime/dependency readiness | Production readiness must fail closed when required Redis is unreachable. |
| Coolify/VPS | `docs/operations/*`, `scripts/*` | Default deployment target. |

## Known Map Limits
- This file is a static map and does not replace module deep dives.
- Endpoint-level method tables live in route files and should be refreshed when
  route definitions change.
- Mobile app exists as `apps/mobile`, but active V1 traceability for mobile is
  `UNVERIFIED / NEEDS CONFIRMATION`.
