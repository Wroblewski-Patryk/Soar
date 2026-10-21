# SOAR-POSITION-CYCLE-008C: Binance Futures DCA to SL internal mock LIVE

This opt-in test drives the internal LIVE intent, order, fill, position, and
trade path for one Binance Futures bot and one active BTCUSDT market group.
Only the venue fill is synthetic. The private exchange boundary, public
connector factory, and global `fetch` fail if reached. No exchange credentials,
real order, or production runtime are involved.

Run `open` and `resume` as separate Vitest processes against the same fresh,
dedicated PostgreSQL `_test` database and Redis instance. Each stage reports
one passed and one skipped test. An unknown stage fails during collection.
The test checks a different process ID on resume and rejects the default
service ports and nonlocal database or Redis addresses.

The strategy uses 100x leverage, basic SL at 20% ROI, and basic DCA at
-30.5% ROI with a 2x multiplier. ENTRY, first DCA, and second DCA each
contribute about 1, 2, and 6 USDT margin. At prices 0.99694 and 0.9949,
the pending loss-side DCA protects SL while both fills settle. The confirmed
weighted average is about 0.99591722. After restart, the replayed DCA tick
adds no order. Price 0.9938 crosses the SL rebased from that average and
produces one `SL` / `BOT_APP` close. Replaying the close tick adds no order.
The test calculates net PnL independently from all four persisted fill
notionals and fees (0.04% of each fill), and checks both the close trade and
position result.

Example PowerShell setup from `apps/api` with dedicated disposable containers:

```powershell
docker run -d --name soar-position008c-pg -e POSTGRES_USER=soar008c -e POSTGRES_PASSWORD=soar008c -e POSTGRES_DB=soar_position_cycle_008c_test -p 127.0.0.1:5552:5432 postgres:16-alpine
docker run -d --name soar-position008c-redis -p 127.0.0.1:6392:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008c:soar008c@127.0.0.1:5552/soar_position_cycle_008c_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6392'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008c:soar008c@127.0.0.1:5552/soar_position_cycle_008c'
$env:RUN_BINANCE_FUTURES_DCA_SL_INTERNAL_MOCK_LIVE = '1'
$env:BINANCE_FUTURES_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeBinanceFuturesDcaSlInternalLiveCycle.e2e.test.ts
$env:BINANCE_FUTURES_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeBinanceFuturesDcaSlInternalLiveCycle.e2e.test.ts
```

After both stages, SQL readback should find four distinct client order IDs,
four intents, four `FILLED` orders, four fills, four trades, and one closed
position with `SL` / `BOT_APP`. Inspect the fill values and fees before
discarding the dedicated containers. This local proof does not establish
Gate.io, Spot, real Binance order semantics, UI behavior, or production safety.
