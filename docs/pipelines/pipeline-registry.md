# Pipeline Registry

Updated: 2026-05-03

Purpose: map core system flows across UI, API, services, data, workers,
failure points, tests, and docs. Each pipeline is grounded in current code and
links back to architecture/module sources instead of redefining them.

## Registered Pipelines
| Pipeline | Trigger | Primary Frontend | Primary Backend | Data Read/Write | Tests | Doc |
|---|---|---|---|---|---|---|
| Access/session | User registers, logs in, checks session, or logs out. | `features/auth`, public auth routes | `api/auth`, auth middleware | `User`, session cookie/JWT | `auth.*.test.ts`, middleware tests | [Access/session](./access-session.md) |
| Wallet and bot configuration | User configures wallet, market universe, strategy, and bot. | `features/wallets`, `markets`, `strategies`, `bots` | `api/wallets`, `markets`, `strategies`, `bots`, `exchange` | `Wallet`, `MarketUniverse`, `SymbolGroup`, `Strategy`, `Bot`, links | wallet/market/strategy/bot e2e tests | [Wallet and bot configuration](./wallet-and-bot-configuration.md) |
| Runtime signal execution | Worker receives market data and evaluates strategy. | Dashboard/runtime monitoring reads | `engine`, `bots`, `market-stream`, `exchange`, workers | runtime session/event/stat, signal/order/position/trade/dedupe | runtime loop, final candle, gateway, parity tests | [Runtime signal execution](./runtime-signal-execution.md) |
| Manual order execution | User opens, closes, or cancels an order from dashboard. | Dashboard manual order/runtime surfaces | `orders`, `engine`, `exchange`, `positions`, `bots` | `Order`, `OrderFill`, `Position`, `Trade`, `Wallet`, `Bot` | orders service/e2e, positions e2e, dashboard tests | [Manual order execution](./manual-order-execution.md) |
| Live imported position reconciliation | System imports/rebinds exchange-side positions. | Positions/runtime/takeover surfaces | `positions`, `bots`, `exchange`, `engine` | `Position`, `Trade`, `Order`, wallet/API-key/bot records | takeover/orphan/reconciliation/ownership tests | [Live imported position reconciliation](./live-imported-position-reconciliation.md) |
| Backtest run | User creates a backtest run and reads report/timeline/trades. | `features/backtest` | `backtests`, backtest worker, `engine`, `exchange` public reads | `BacktestRun`, `BacktestTrade`, `BacktestReport`, candle cache | backtest e2e/job/parity/gateway tests | [Backtest run](./backtest-run.md) |
| Reporting and audit read | User reads reports or logs. | `features/reports`, `features/logs` | `reports`, `logs`, backtest/trading reads | `Log`, `Backtest*`, `Trade`, `Position`, `Wallet` | reports service, logs e2e | [Reporting and audit read](./reporting-and-audit-read.md) |
| Deployment and runtime readiness | Operator deploys and verifies health/readiness/smoke. | n/a | health/readiness routes, scripts, workers, Redis/Postgres | runtime dependencies and evidence artifacts | health/readiness, worker readiness, deploy smoke scripts | [Deployment readiness](./deployment-readiness.md) |

## Pipeline Document Contract
Every pipeline document must include:
- trigger,
- user/system action,
- involved frontend files,
- involved backend files,
- involved services,
- data read/write,
- failure points,
- tests,
- related docs,
- known gaps or `UNVERIFIED / NEEDS CONFIRMATION`.

## Maintenance Rule
When a new system flow is introduced, add a row here and create a pipeline
document before closing the implementation task.
