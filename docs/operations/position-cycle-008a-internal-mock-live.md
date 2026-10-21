# SOAR-POSITION-CYCLE-008A: Binance Futures internal mock LIVE proof

This opt-in test drives the internal bot order path through the durable LIVE
intent and fill lifecycle. It uses one BTCUSDT Binance Futures market, one
active market group per bot, and deterministic fake venue fills. All exchange
adapter transport functions fail if reached. The test requires its own local
PostgreSQL database named `soar_position_cycle_008a_test` and a separate local
Redis instance; it rejects default service ports and non-local addresses.

Run `open` and `resume` as separate Vitest processes against the same database
and Redis. `open` starts with an empty user dataset, opens a position using
about 1 USDT margin, checks that a final candle with no entry signal leaves it
open, and fills DCA legs of about 2 and 6 USDT. `resume` reconstructs runtime
state from PostgreSQL and Redis, replays the last DCA tick without another
venue submit, and closes the first position at TP. A new position with DCA
disabled exercises SL independently. Basic SL is deferred while loss-side
DCA levels remain pending, so the second strategy configuration is deliberate.
Each invocation reports one passed test and one skipped test. An unknown stage
fails during collection, and neither single invocation is the full cycle proof.

The assertions read back `LiveOrderIntent`, `FILLED` Order, `OrderFill`,
Position, and Trade for every leg, including stable client/venue identities,
quantities, weighted entry, exchange fees, net realized PnL, and close
attribution. The fake fee rate is 0.04% of each fill notional.

Example PowerShell setup in `apps/api` with dedicated disposable containers:

```powershell
docker run -d --name soar-position008a-pg -e POSTGRES_USER=soar008a -e POSTGRES_PASSWORD=soar008a -e POSTGRES_DB=soar_position_cycle_008a_test -p 127.0.0.1:5548:5432 postgres:16-alpine
docker run -d --name soar-position008a-redis -p 127.0.0.1:6388:6379 redis:7-alpine
$env:DATABASE_URL = 'postgresql://soar008a:soar008a@127.0.0.1:5548/soar_position_cycle_008a_test'
$env:TEST_DATABASE_URL = $env:DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6388'
pnpm exec prisma migrate deploy
$env:RUN_BINANCE_FUTURES_INTERNAL_MOCK_LIVE = '1'
$env:BINANCE_FUTURES_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeBinanceFuturesInternalLiveCycle.e2e.test.ts
$env:BINANCE_FUTURES_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeBinanceFuturesInternalLiveCycle.e2e.test.ts
```

The test is skipped in the regular suite unless explicitly enabled. This is
local internal mock evidence only. It does not prove real venue execution,
Gate.io or Spot parity, production runtime behavior, or UI acceptance.
