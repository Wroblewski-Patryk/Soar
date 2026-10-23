# SOAR-POSITION-CYCLE-008I: Binance Spot unfunded DCA to SL internal mock LIVE

This opt-in test uses one internal Binance SPOT bot and one active BTCUSDT
group. The LIVE intent, order, fill, position, trade, capital, and telemetry
paths run against a dedicated local database. Venue fills and the confirmed
exchange quote balance are synthetic. All other private exchange methods,
the public connector factory, and global `fetch` are network tripwires. No
real credential, venue order, or production runtime is used.

Existing `runtimePaperUnfundedDcaSl.e2e.test.ts` covers PAPER FUTURES at
leverage 100; `runtimePositionAutomation.dcaTpParity.test.ts` uses mocked
LIVE FUTURES service dependencies. Neither exercises a persisted internal
LIVE Binance SPOT order cycle and a synthetic confirmed balance through the
real LIVE capital resolver. This test fills that local gap.

The strategy uses leverage 1, one basic DCA at -30.5% SPOT ROI with a 2x
contribution multiplier, and basic SL at -20%. SPOT ROI is
`(mark - confirmed average) / confirmed average`. ENTRY fills 1 BTC at
1 USDT. A final candle without a new entry signal leaves it open. Tick
`0.6949` crosses both the DCA threshold `0.695` and the old SL `0.8`.
The first DCA attempt simulates a `LIVE_PRETRADE_PAUSED` race: the DCA is
still pending, so the position must remain open without an SL or DCA intent.

The next tick at `0.6949` reaches the same DCA. Executable synthetic SPOT
rules specify `TICK_SIZE=0.01` BTC, `minAmount=0.01` BTC,
`minNotional=0.5` USDT, and `contractSize=null`. The 2 USDT target floors
to 2.87 BTC, requiring `2.87 * 0.6949 = 1.994363` USDT. The mock exchange
balance confirms 1.5 USDT total and 0.5 USDT free; the existing 1 USDT
position is reserved by the LIVE capital calculation. `1.994363 > 0.5`, so
`executeRuntimeDca` raises `DCA_FUNDS_EXHAUSTED` before DCA dedupe, intent,
order, or submit. One `PRETRADE_BLOCKED` event reports insufficient funds.
The automation then releases the already crossed SL for the existing 1 BTC
position and records one `SIGNAL_DECISION` with `dcaFundsExhausted=true`.

The SL close fills 1 BTC at 0.6949 USDT. A synthetic 0.04% fee in USDT per
fill gives entry fee `0.0004`, close fee `0.00027796`, total fee
`0.00067796`, and independently calculated net PnL
`0.6949 - 1 - 0.00067796 = -0.30577796` USDT. The close trade and position
agree. Only ENTRY and CLOSE have durable intents, `FILLED` orders, fills,
and trades. There is no DCA trade, intent, dedupe record, or venue submit.
A second process replays the crossed tick and observes the same IDs, PnL,
event count, and terminal `SL` / `BOT_APP` state without another submit.

Run `open` and `resume` as separate Vitest processes on the same fresh,
dedicated PostgreSQL `_test` database and Redis instance. Each stage reports
one passed and one skipped test. Unknown stages fail during collection; the
test checks a different PID on resume and rejects default service ports and
nonlocal addresses. Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008i-proof-pg -e POSTGRES_USER=soar008i -e POSTGRES_PASSWORD=soar008i -e POSTGRES_DB=soar_position_cycle_008i_test -p 127.0.0.1:5561:5432 postgres:16-alpine
docker run -d --name soar-position008i-proof-redis -p 127.0.0.1:6401:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008i:soar008i@127.0.0.1:5561/soar_position_cycle_008i_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6401'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008i:soar008i@127.0.0.1:5561/soar_position_cycle_008i'
$env:RUN_BINANCE_SPOT_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE = '1'
$env:BINANCE_SPOT_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeBinanceSpotUnfundedDcaSlInternalLiveCycle.e2e.test.ts
$env:BINANCE_SPOT_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeBinanceSpotUnfundedDcaSlInternalLiveCycle.e2e.test.ts
```

Author SQL readback after 82 migrations: `2|2|2|2|2` intents, orders,
fills, trades, and distinct client order IDs; both orders `FILLED`.
Position: `CLOSED|SL|BOT_APP|1|1|-0.30577796|1` (status, reason,
initiator, quantity, average, net PnL, leverage). One local balance
snapshot records total `1.5` and free `0.5` USDT. Telemetry records one
`dca_funds_exhausted` and one `stop_loss`. This author-local internal mock
awaits independent review. It does not prove actual Binance balances,
filters or fee currency, Gate.io, FUTURES, PAPER/BACKTEST, signed-in browser
003A, or production safety. The full `POSITION-CYCLE` remains OPEN and
release remains NO-GO.
