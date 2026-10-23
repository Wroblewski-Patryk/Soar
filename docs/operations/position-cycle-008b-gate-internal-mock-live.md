# SOAR-POSITION-CYCLE-008B: Gate.io Futures internal mock LIVE proof

This opt-in test uses the internal bot LIVE order path with one synthetic
BTCUSDT Gate.io Futures market. The venue response is deterministic and local;
the private exchange boundary, public connector factory, and global `fetch`
fail if reached. No external-client grant or real venue API is used.

The positive cycle deliberately supplies **unit-contract** rules
(`contractSize=1`, `minAmount=1`, `minNotional=5`, `amountPrecision=1`). The code
receives `contractSize` from CCXT market metadata. Its runtime USDT DCA
quantity resolver rejects non-unit contracts because it cannot safely
translate the proposed base quantity into a different contract unit. Before
the positive DCA, the test proves that `contractSize=10`, a minimum amount of
300, a minimum notional of 300, or missing amount precision each returns `DCA_ORDER_RULES_INVALID`
without another intent or venue submit. The compatible rules are a synthetic
fixture; they do not establish that a particular Gate.io market offers them.

Run `open` and `resume` in separate Vitest processes against one dedicated
disposable PostgreSQL database and Redis. Each invocation must report one
passed and one skipped test; an unknown stage fails during collection.
`open` covers ENTRY with about 1 USDT margin, no-signal HOLD, and basic DCA
with about 2 and 6 USDT margin. `resume` verifies a different PID, rebuilds
the trusted state, replays the DCA tick without a second submit, closes TP,
then opens a new position with DCA disabled and closes SL. Readback checks
intent, filled order, fill, position, trade, stable Gate client order ID,
quantity, average, fee, net PnL, and close attribution.
For both TP and SL, the close trade and position net PnL are compared with
close-fill notional minus entry/DCA-fill notionals and every fill fee. This
also checks the persisted notional and fee of each fill.

Example PowerShell setup in `apps/api`:

```powershell
docker run -d --name soar-position008b-pg -e POSTGRES_USER=soar008b -e POSTGRES_PASSWORD=soar008b -e POSTGRES_DB=soar_position_cycle_008b_test -p 127.0.0.1:5549:5432 postgres:16-alpine
docker run -d --name soar-position008b-redis -p 127.0.0.1:6389:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008b:soar008b@127.0.0.1:5549/soar_position_cycle_008b_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6389'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008b:soar008b@127.0.0.1:5549/soar_position_cycle_008b'
$env:RUN_GATEIO_FUTURES_INTERNAL_MOCK_LIVE = '1'
$env:GATEIO_FUTURES_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeGateFuturesInternalLiveCycle.e2e.test.ts
$env:GATEIO_FUTURES_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeGateFuturesInternalLiveCycle.e2e.test.ts
```

This is local internal mock evidence. Actual Gate.io contract metadata,
order/fill semantics, real venue execution, production runtime, and UI
acceptance remain separate gates.
