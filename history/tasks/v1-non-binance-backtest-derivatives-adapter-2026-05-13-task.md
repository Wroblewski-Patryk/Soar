# V1 Non-Binance Backtest Derivatives Adapter - 2026-05-13

## Task Contract

### Context

The bot/backtest audit left one accepted local gap: Binance-only supplemental
derivatives data. Funding-rate and open-interest history are historical market
inputs and can be safely read through CCXT-backed Exchange public connectors
where the exchange supports them.

### Goal

Move non-Binance futures backtest supplemental funding/open-interest reads from
empty fail-closed behavior to the Exchange public market-data adapter, while
keeping historical data honest.

### Constraints

- Do not synthesize historical order-book data from a current snapshot.
- Keep Binance REST fallbacks only for Binance-specific derivative endpoints.
- Keep unsupported exchange methods fail-closed with empty supplemental series.
- Do not perform authenticated or live trading operations.

### Definition Of Done

- Exchange public market-data service exposes funding-rate history,
  open-interest history, and order-book snapshot connector boundaries.
- CCXT public connector normalizes funding-rate history, open-interest
  history, and order-book snapshots.
- Backtest supplemental series uses Exchange public funding/open-interest
  history for non-Binance futures.
- Backtest non-Binance order-book history remains empty until a historical
  adapter exists.
- Focused API tests and typecheck pass.

### Forbidden

- Using current order-book snapshots as historical backtest input.
- Borrowing Binance funding/open-interest data for Gate.io or any other
  non-Binance exchange.
- Treating unsupported CCXT methods as successful data.

## Result Report

Status: `implemented, verified locally`.

Validation:

- `pnpm --filter api run test -- src/modules/backtests/backtestDataGateway.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtests.e2e.test.ts src/modules/exchange/exchangePublicMarketData.service.test.ts --run --sequence.concurrent=false` -> `26/26` passed.
- `pnpm --filter api run typecheck` -> passed.
- `pnpm run quality:guardrails` -> passed after extracting CCXT public market
  data normalization and client shape types out of the production connector
  monolith budget.

Residual risk:

- Runtime live derivative supplemental fallbacks still use Binance-only
  snapshots for Binance and fail closed for non-Binance until a separate
  runtime adapter slice is implemented.
- Backtest order-book historical data remains unavailable for non-Binance until
  an exchange adapter with historical order-book/depth source is approved.
