# V1 Runtime Non-Binance Derivatives Adapter - 2026-05-13

## Task Contract

### Context

The backtest derivatives adapter slice moved non-Binance funding-rate and
open-interest history onto the Exchange public market-data boundary. Runtime
read-model and live signal supplemental fallbacks still had Binance-only
guards for funding, open interest, and order-book snapshots.

### Goal

Route non-Binance runtime derivative supplemental fallbacks through the
Exchange public market-data adapter without borrowing Binance market data.

### Constraints

- Keep Binance REST behavior unchanged for Binance-specific derivative paths.
- Use Exchange public adapter methods for non-Binance funding history,
  open-interest history, and current order-book snapshots where supported.
- Unsupported adapter methods must fail closed with empty/null data.
- Do not perform authenticated exchange reads or live trading operations.

### Definition Of Done

- Runtime symbol-stats fallback derivatives use Exchange public adapter methods
  for non-Binance exchanges.
- Runtime signal market-data gateway uses Exchange public adapter methods for
  non-Binance funding/open-interest history and order-book snapshots.
- Fallback caches are exchange-scoped for derivative history/snapshots.
- Focused runtime tests, API typecheck, and guardrails pass.

### Forbidden

- Calling Binance REST for Gate.io or any other non-Binance exchange.
- Treating unsupported adapter methods as successful derivative data.
- Introducing live/authenticated exchange operations.

## Result Report

Status: `implemented, verified locally`.

Validation:

- `pnpm --filter api run test -- src/modules/bots/runtimeMarketDataFallback.service.test.ts src/modules/engine/runtimeSignalMarketDataGateway.test.ts --run --sequence.concurrent=false` -> `12/12` passed.
- `pnpm --filter api run test -- src/modules/bots/runtimeMarketDataFallback.service.test.ts src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts src/modules/engine/runtimeSignalMarketDataGateway.test.ts src/modules/engine/runtimeSignalLoopDefaults.test.ts --run --sequence.concurrent=false` -> `26/26` passed.
- `pnpm --filter api run typecheck` -> passed.
- `pnpm run quality:guardrails` -> passed.

Residual risk:

- Production-safe runtime/backtest clickthrough remains required before
  claiming target-environment V1 proof.
- Non-Binance order-book history remains unavailable for backtests; runtime
  only uses current order-book snapshots.
