# SOAR-POSITION-CYCLE-008D: Gate.io Futures DCA to SL internal mock LIVE

This opt-in test uses one synthetic BTCUSDT Gate.io Futures market, one active
group, and the internal bot LIVE intent/order/fill path. Only the venue fill is
synthetic. The private exchange boundary, public connector factory, and global
`fetch` throw if reached. No real venue key, order, or production runtime is
used.

The positive path deliberately supplies **synthetic executable unit-contract
rules**: `contractSize=1`, `minAmount=1`, `minNotional=5`, and explicit
`amountPrecisionMode=TICK_SIZE` with step `1`. Before DCA, seven invalid rule
variants (`contractSize=10` or null, `minAmount=300`, `minNotional=300` or
null, `amountPrecision=null`, or `amountPrecisionMode=null`) must return
`DCA_ORDER_RULES_INVALID` while DCA dedupe remains absent and intent,
order, and venue-submit counts remain at the one ENTRY. These rules do not
describe an actual Gate.io market.

The strategy uses 100x leverage, basic SL at 20% ROI, and two loss-side basic
DCA levels at -30.5% ROI with multiplier 2. The old SL price is
`1 * (1 - 0.20 / 100) = 0.998`; the first DCA trigger is
`1 * (1 - 0.305 / 100) = 0.99695`. Tick `0.99692` is below both. ENTRY fills
100 contracts at 1; the first DCA requests `200 / 0.99692` contracts and
floors to 200 on the Gate tick grid, contributing 1.99384 USDT margin.
Its confirmed average is `(100 + 200 * 0.99692) / 300 = 0.9979466667`.

Without a venue quantity step, the multiplier would yield a 2 USDT first add
and then a 6 USDT second add. The actual first fill is short of its 200 USDT
notional target by 0.616 USDT. The product contract multiplies the **current
confirmed contribution**, so the next target is `2 * (100 + 199.384) =
598.768` USDT notional (5.98768 USDT margin), 1.232 USDT notional below the
ideal 600. This follows the confirmed-fill rule in the
[position lifecycle contract](../architecture/reference/position-management-pnl-lifecycle-contract.md).

The next trigger is about `0.9979466667 * (1 - 0.305 / 100) = 0.9949029`;
tick `0.99488` is below it and below the SL level from the first confirmed
average. The next requested quantity uses the **confirmed book notional**:
`floor((299.384 * 2) / 0.99488) = 601` unit contracts, about 5.9792288 USDT
margin. Its fill notional is 597.92288 USDT, 0.84512 below the current
target; both DCA fills stay within one price-by-step unit below their targets.
The new confirmed average is about `0.9959010877`, giving an SL
price near `0.9959010877 * (1 - 0.20 / 100) = 0.9939093`. After process
restart and DCA replay, tick `0.99375` closes once by `SL` / `BOT_APP`.
The test independently calculates net PnL from all four persisted fill
notionals and fees, with a 0.04% fee on each fill.

Run `open` and `resume` as separate Vitest processes on one fresh dedicated
PostgreSQL `_test` database and Redis instance. Each stage reports one passed
and one skipped test. Unknown stage values fail during collection. The test
checks a different process ID on resume and rejects default service ports and
nonlocal addresses.

Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008d-pg -e POSTGRES_USER=soar008d -e POSTGRES_PASSWORD=soar008d -e POSTGRES_DB=soar_position_cycle_008d_test -p 127.0.0.1:5553:5432 postgres:16-alpine
docker run -d --name soar-position008d-redis -p 127.0.0.1:6393:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008d:soar008d@127.0.0.1:5553/soar_position_cycle_008d_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6393'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008d:soar008d@127.0.0.1:5553/soar_position_cycle_008d'
$env:RUN_GATEIO_FUTURES_DCA_SL_INTERNAL_MOCK_LIVE = '1'
$env:GATEIO_FUTURES_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeGateFuturesDcaSlInternalLiveCycle.e2e.test.ts
$env:GATEIO_FUTURES_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeGateFuturesDcaSlInternalLiveCycle.e2e.test.ts
```

SQL readback should show four distinct client order IDs, four intents, four
`FILLED` orders, four fills, four trades, and one closed position with
`SL` / `BOT_APP`. Check the fill values and fees before discarding the test
containers. This local proof does not establish actual Gate.io contract
metadata or order semantics, Spot parity, UI behavior, or production safety.
