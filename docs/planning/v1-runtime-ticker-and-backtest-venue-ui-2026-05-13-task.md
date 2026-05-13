# V1 Runtime Ticker And Backtest Venue UI - 2026-05-13

## Task Contract

### Context

After the bot/backtest candle adapter audit, a follow-up scan found one more
generic market-data fallback that still treated Binance differently: runtime
ticker prices used direct Binance REST while non-Binance used the Exchange
adapter. Backtest details also stored exchange context but did not show it in
the header.

### Goal

Keep runtime mark-price fallback and backtest details UI aligned with target
architecture: generic ticker reads must use the Exchange public market-data
boundary, and operators must see the resolved backtest venue context.

### Constraints

- Do not change Binance-only derivatives supplemental fallback behavior in
  this slice.
- Do not add production mutations or exchange writes.
- Keep UI labels short and route-local.

### Definition Of Done

- Runtime fallback ticker prices use `fetchExchangePublicTickerSnapshot` for
  Binance and non-Binance exchanges.
- Runtime positions readback asks for fallback ticker prices for the actual
  bot exchange, not Binance only.
- Backtest details header displays resolved `exchange / marketType /
  baseCurrency` from run seed config.
- Focused runtime fallback/PnL and Web Backtest details tests pass.
- API and Web typechecks pass.

### Forbidden

- Direct Binance ticker REST inside generic runtime fallback ticker paths.
- Hiding the backtest venue context only in raw JSON.
- Claiming non-Binance derivatives parity before generic derivative adapters
  exist.

## Result Report

Status: `implemented, verified locally`.

Validation:

- `pnpm --filter api run test -- src/modules/bots/runtimeSessionPositionsRead.service.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/bots/runtimeMarketDataFallback.service.test.ts src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts --run --sequence.concurrent=false` -> `36/36` passed.
- `pnpm --filter web run test -- src/features/backtest/components/BacktestRunDetails.test.tsx --run` -> `4/4` passed.
- `pnpm --filter api run typecheck` -> passed.
- `pnpm --filter web run typecheck` -> passed.
- Generic market-data scan now finds no direct Binance candle/ticker REST in
  bot/backtest/engine runtime paths; remaining direct Binance REST calls are
  derivative supplemental fallbacks guarded as Binance-only.

Residual risk:

- Production LIVE/Gate.io runtime proof remains separate.
- Generic non-Binance funding/open-interest/order-book support remains future
  Exchange adapter work.
