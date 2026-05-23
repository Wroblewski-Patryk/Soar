# V1MARK-A Closure - LIVE Futures Mark-Price Parity

Date: 2026-04-29
Status: PASS
Owner: Codex Execution Agent

## Scope

Closed the `LIVE FUTURES` lifecycle-price truth gap so runtime protection and
position-lifetime automation now prefer mark price through the existing shared
resolver seam.

## Delivered

- Binance futures market-stream normalization now understands
  `markPriceUpdate` payloads.
- Futures websocket subscriptions now include per-symbol `@markPrice@1s`
  channels alongside ticker and kline streams.
- Runtime ticker state can carry persisted `markPrice` without discarding the
  latest `lastPrice`.
- Shared lifecycle-price resolution now prefers:
  1. futures `markPrice`
  2. ticker `lastPrice`
  3. latest positive candle close
- Spot semantics remain unchanged.

## Files

- `apps/api/src/modules/market-stream/binanceStream.types.ts`
- `apps/api/src/modules/market-stream/binanceStream.service.ts`
- `apps/api/src/modules/engine/runtimeTickerStore.ts`
- `apps/api/src/modules/engine/runtimeLifecycleMarkPrice.service.ts`
- focused tests in:
  - `apps/api/src/modules/market-stream/binanceStream.service.test.ts`
  - `apps/api/src/modules/engine/runtimeTickerStore.test.ts`
  - `apps/api/src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts`

## Validation

- `pnpm --filter api exec vitest run src/modules/market-stream/binanceStream.service.test.ts src/modules/engine/runtimeTickerStore.test.ts src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimePositionLifetime.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Result

The repository now has one explicit, architecture-backed futures lifecycle
price hierarchy instead of implicit ticker-only behavior. This does not
guarantee every remaining live-exchange behavior is perfect, but it removes one
confirmed mode-specific truth gap that could distort `DCA`, `TTP`, `TSL`, and
position-lifetime timing for `LIVE FUTURES`.
