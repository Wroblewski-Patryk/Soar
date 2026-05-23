# V1 Bot/Backtest Exchange Adapter Audit - 2026-05-13

## Task Contract

### Context

The user asked for a full audit of bot and backtest behavior because previous
work closed only one runtime adapter gap and the remaining V1 confidence still
felt incomplete. Architecture requires exact `(exchange, marketType)` context
through public market data, backtests, PAPER runtime, LIVE runtime, cache
ownership, and UI/API contracts.

### Goal

Prove or fix the highest-risk bot/backtest exchange-adapter drift before V1:
backtest candle loading, backtest timeline/report parity, bot runtime candle
fallbacks, database candle cache scoping, and Web backtest result typing must
not silently borrow Binance data for non-Binance contexts.

### Constraints

- Keep architecture as source of truth.
- Do not add temporary bypasses or mock-only production behavior.
- Keep Binance-only derivatives fallbacks explicit and fail-closed for
  non-Binance exchanges.
- Keep test-only deterministic candle generation inside tests only.
- Do not mutate production or exchange accounts.

### Definition Of Done

- Backtest candle fetches route through the exchange-owned public market-data
  boundary.
- Backtest run jobs and timelines carry the resolved exchange context.
- Bot runtime candle fallback routes through the same exchange-owned boundary.
- Database candle cache uniqueness includes the source/exchange dimension.
- Web backtest timeline typing reflects backend diagnostics and exchange
  fields.
- Focused bot/backtest tests and API/Web typechecks pass.
- Source-of-truth files are updated with evidence and residual risk.

### Forbidden

- Direct Binance candle REST inside backtest or generic runtime candle paths.
- Cross-exchange candle cache reuse.
- Treating local proof as production LIVE/Gate.io operation proof.
- Hiding unsupported derivatives data as successful non-Binance data.

## Stage

`verification` -> `implementation` -> `verification`.

## Audit Index

| Area | Expected architecture | Finding | Severity | Action | Evidence |
| --- | --- | --- | --- | --- | --- |
| Backtest candle gateway | Public candle reads go through Exchange module and exact exchange context. | Backtests still used direct Binance kline REST and an exchange-less in-memory/DB cache key. | P0 | Routed `fetchKlines` through `fetchExchangePublicRecentCandles(exchange, marketType, symbol, interval, since)` and added exchange to cache keys. | `backtestDataGateway.test.ts`; backtest e2e pack `56/56`. |
| Backtest job/timeline | Seed-resolved exchange must be preserved for worker and timeline replay. | Job/timeline fetched candles without an exchange argument. | P0 | Resolved `seed.exchange` with Binance legacy fallback and passed it through job/timeline data fetches; timeline response includes `exchange`. | `backtestRunJob.test.ts`; API typecheck. |
| Runtime candle fallback | Generic candle fallback must use exchange adapter boundary. | Runtime fallback still had a direct Binance candle REST path. | P0 | Routed runtime `fetchFallbackKlines` through `fetchExchangePublicRecentCandles` for all supported exchanges. | `runtimeMarketDataFallback.service.test.ts`. |
| Candle DB cache | Same symbol/timeframe/open time from different exchanges must not collide. | `MarketCandleCache.source` existed but uniqueness ignored it. | P0 | Added migration and schema change so uniqueness/indexes include `source`. | `20260513223000_scope_market_candle_cache_by_source`. |
| Derivatives supplemental data | Non-Binance derivative fallbacks must fail closed until generic adapter support exists. | Funding/open-interest/order-book fallbacks are Binance-specific. | P1 accepted boundary | Kept Binance-only paths guarded by `exchange === BINANCE`; non-Binance returns empty supplemental series instead of borrowing Binance. | Focused fallback and data gateway tests. |
| Web backtest typing | Web must represent backend backtest timeline/report diagnostics truth. | Web timeline types missed `exchange`, `orderBook`, `orderBookPoints`, and `strategy_exit_trace_only`. | P1 | Updated Web `BacktestTimeline` typing. | Web typecheck. |
| Backtest e2e determinism | Contract e2e should validate app behavior without live exchange latency. | Switching to CCXT adapter made the 3-symbol e2e depend on network timing. | P1 | Mocked the exchange public candle boundary in `backtests.e2e.test.ts` with deterministic candles and an invalid-symbol failure path. | Full backtest e2e pack `14/14`. |

## Result Report

Status: `implemented, verified locally`.

Validation:

- `pnpm --filter api run test -- src/modules/backtests/backtests.e2e.test.ts src/modules/backtests/backtestDataGateway.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestRuntimeKernelParity.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/bots/runtimeMarketDataFallback.service.test.ts --run --sequence.concurrent=false` -> `56/56` passed.
- `pnpm --filter api run typecheck` -> passed.
- `pnpm --filter web run typecheck` -> passed.

Residual risk:

- This is local adapter-boundary and contract proof, not production LIVE
  trading proof.
- Binance-only supplemental derivatives data remains intentionally scoped to
  Binance until Exchange owns generic funding/open-interest/order-book adapter
  support for other venues.
- Gate.io LIVE operation remains a separate production/resource proof lane.
