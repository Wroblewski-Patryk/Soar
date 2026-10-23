# SOAR-POSITION-CYCLE-008J: Gate.io Spot unfunded DCA to SL internal mock LIVE

This opt-in test uses one internal Gate.io SPOT bot and one active BTCUSDT
group. The LIVE intent, order, fill, position, trade, capital, and telemetry
paths run against a dedicated local database. Venue fills and the confirmed
exchange quote balance are synthetic. All other private exchange methods,
the public connector factory, and global `fetch` are network tripwires. No
real credential, venue order, or production runtime is used.

The adapter registry maps Gate.io SPOT to `CcxtSpotConnector` with CCXT
`marketType=spot`. The shared connector reads amount and cost minima,
amount precision and its mode, and fee currency from a trade. The runtime
DCA resolver floors SPOT base quantity to the amount step, checks both
minima, and accepts `contractSize=null` as unit size one. This test supplies
its own **synthetic** Gate-specific executable rules: `TICK_SIZE=0.1` BTC,
`minAmount=0.1` BTC, `minNotional=0.5` USDT, `contractSize=null`, and a
0.04% fee in USDT on each fill. It checks that the rules are requested for
`GATEIO` / `SPOT` / `BTCUSDT` and that the normalized quantity and quote
pass those rules. Actual Gate market filters, fee currency, balances, and
fill semantics remain unverified.

The strategy uses leverage 1, one basic DCA at -30.5% SPOT ROI with a 2x
contribution multiplier, and basic SL at -20%. SPOT ROI is
`(mark - confirmed average) / confirmed average`. ENTRY fills 1 BTC at
1 USDT. A final candle without a new entry signal leaves it open. Tick
`0.6949` crosses both the DCA threshold `0.695` and the old SL `0.8`.
The first DCA attempt simulates a `LIVE_PRETRADE_PAUSED` race. DCA remains
pending, so the position must remain open without an SL or DCA intent.

The next tick at `0.6949` reaches the same DCA. The 2 USDT target floors
to 2.8 BTC on the `0.1` step, requiring `2.8 * 0.6949 = 1.94572` USDT.
That is `0.05428` below the target and above the synthetic amount and
notional minima. The mock exchange balance confirms 1.4 USDT total and
0.4 USDT free; the existing 1 USDT position is reserved by the LIVE
capital calculation. `1.94572 > 0.4`, so `executeRuntimeDca` raises
`DCA_FUNDS_EXHAUSTED` before DCA dedupe, intent, order, or submit. One
`PRETRADE_BLOCKED` event reports insufficient funds. The automation then
releases the crossed SL for the existing 1 BTC position and records one
`SIGNAL_DECISION` with `dcaFundsExhausted=true`.

The SL close fills 1 BTC at 0.6949 USDT. The synthetic USDT fees are
`0.0004` on ENTRY and `0.00027796` on CLOSE, totaling `0.00067796`.
Independent net PnL from the two persisted fills is
`0.6949 - 1 - 0.00067796 = -0.30577796` USDT; the close trade and
position agree. Only ENTRY and CLOSE have durable intents, `FILLED`
orders, fills, and trades. There is no DCA trade, intent, dedupe record,
or venue submit. A second process replays the crossed tick and observes
the same IDs, PnL, event count, and terminal `SL` / `BOT_APP` state
without another submit.

Run `open` and `resume` as separate Vitest processes on the same fresh,
dedicated PostgreSQL `_test` database and Redis instance. Each stage reports
one passed and one skipped test. Unknown stages fail during collection; the
test checks a different PID on resume and rejects default service ports and
nonlocal addresses. Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008j-proof-pg -e POSTGRES_USER=soar008j -e POSTGRES_PASSWORD=soar008j -e POSTGRES_DB=soar_position_cycle_008j_test -p 127.0.0.1:5562:5432 postgres:16-alpine
docker run -d --name soar-position008j-proof-redis -p 127.0.0.1:6402:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008j:soar008j@127.0.0.1:5562/soar_position_cycle_008j_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6402'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008j:soar008j@127.0.0.1:5562/soar_position_cycle_008j'
$env:RUN_GATEIO_SPOT_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE = '1'
$env:GATEIO_SPOT_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeGateSpotUnfundedDcaSlInternalLiveCycle.e2e.test.ts
$env:GATEIO_SPOT_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeGateSpotUnfundedDcaSlInternalLiveCycle.e2e.test.ts
```

Author SQL readback after 82 migrations: `2|2|2|2|2` intents, orders,
fills, trades, and distinct client order IDs; both orders `FILLED`.
Gate client order IDs use a 22-character digest after `soar_`.
Position: `CLOSED|SL|BOT_APP|1|1|-0.30577796|1` (status, reason,
initiator, quantity, average, net PnL, leverage). One local balance
snapshot records total `1.4` and free `0.4` USDT. Telemetry records one
`dca_funds_exhausted` and one `stop_loss`. This author-local internal mock
awaits independent review. It does not prove actual Gate.io balances,
filters or fee currency, Binance, FUTURES, PAPER/BACKTEST, signed-in
browser 003A, or production safety. The full `POSITION-CYCLE` remains
OPEN and release remains NO-GO.
