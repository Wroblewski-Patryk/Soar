# SOAR-POSITION-CYCLE-008M: Binance Futures positive DCA before TTP internal mock LIVE

This opt-in test drives one internal Binance FUTURES LIVE bot and one active
BTCUSDT group through a durable ENTRY, advanced positive DCA, and TTP close.
The local intent, order, fill, position, trade, capital, telemetry, and Redis
runtime-state paths run against dedicated PostgreSQL and Redis instances.
Venue fills and the confirmed exchange margin balance are synthetic. All
other private exchange methods, the public connector factory, and global
`fetch` are tripwires. No real credential, venue order, or production runtime
is used.

The existing PAPER test proves armed TTP versus newly enabled positive DCA in
PAPER. Earlier Binance Futures LIVE mock cycles cover basic DCA with TP/SL
and an unfunded negative DCA. 008M covers the missing advanced TTP/positive
DCA priority in an internal LIVE mock. The strategy uses 100x leverage,
advanced TTP `{ percent: 20, arm: 10 }`, and one advanced DCA at +30.5%
ROI with multiplier 1 and `usdt_contribution_v1`. It starts with DCA disabled,
then enables DCA after TTP has armed, as in the PAPER scenario. The synthetic
Futures rules use `contractSize=1`, `TICK_SIZE=0.01` BTC, `minAmount=0.01`
BTC, and `minNotional=5` USDT. Fees are 0.04% of each fill notional in USDT.
These are fixtures, not readbacks of Binance market rules, balance, or fees.

ENTRY fills 100 BTC at 1 USDT: 100 USDT notional and 1 USDT modeled margin.
A final candle without a new entry signal preserves the position despite
legacy `noMatchAction=EXIT`. Tick `1.0051` arms TTP at +51% leveraged ROI;
the high is 51%, trailing step 10%, and protected floor +41%, or price
`1.0041` before DCA. Tick `1.0046` tracks a retracement above that floor.
After enabling DCA, tick `1.0031` is +31% ROI: above the +30.5% DCA trigger
but below the armed TTP floor. A synthetic `LIVE_PRETRADE_PAUSED` DCA attempt
keeps the original position open without a false TTP. Invalid `contractSize`
and missing `minNotional` each return `DCA_ORDER_RULES_INVALID` before
capital, DCA dedupe, intent, or venue submit.

The next `1.0031` tick uses the real DCA quantity and capital resolvers.
The confirmed mock exchange balance is 10 USDT total and 9 USDT free. A
1 USDT margin target is 100 USDT notional; raw quantity at `1.0031` is
about 99.69096 BTC, floored to 99.69 BTC on the 0.01 step. The persisted
DCA fill is `99.69 * 1.0031 = 99.999039` USDT notional and `0.99999039`
USDT modeled margin. The position remains OPEN with 199.69 BTC and a
fill-weighted average of `1.0015475937703442`. Its armed TTP state remains
active and its rebased floor still represents approximately price `1.0041`.
There is one successful DCA dedupe record and no TTP close on this tick.

The `resume` stage runs in a different process. A `1.0046` tick confirms
the open position and the same ENTRY/DCA record IDs without a new venue
submit. A later `1.00305` tick closes the same 199.69 BTC once by
`TTP` / `BOT_APP`. The three fill notionals are 100, 99.999039, and
200.2990545 USDT. Fees are 0.04, 0.0399996156, and 0.0801196218 USDT,
totaling 0.1601192374. Independent net PnL from the fills is
`200.2990545 - 100 - 99.999039 - 0.1601192374 = +0.1398962626` USDT;
the CLOSE trade and position agree. Replay of the close tick preserves
all intent, order, fill, and trade IDs and event count. Only the CLOSE is
submitted in the second process.

Run `open` and `resume` as separate Vitest processes against the same fresh,
own PostgreSQL `_test` database and Redis instance. Each stage reports one
passed and one skipped test. Unknown stages fail during collection; the test
checks a different PID on resume and rejects default ports or nonlocal
database and Redis addresses. Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008m-pg -e POSTGRES_USER=soar008m -e POSTGRES_PASSWORD=soar008m -e POSTGRES_DB=soar_position_cycle_008m_test -p 127.0.0.1:5567:5432 postgres:16-alpine
docker run -d --name soar-position008m-redis -p 127.0.0.1:6407:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008m:soar008m@127.0.0.1:5567/soar_position_cycle_008m_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6407'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008m:soar008m@127.0.0.1:5567/soar_position_cycle_008m'
$env:RUN_BINANCE_FUTURES_POSITIVE_DCA_TTP_INTERNAL_MOCK_LIVE = '1'
$env:BINANCE_FUTURES_POSITIVE_DCA_TTP_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeBinanceFuturesPositiveDcaTtpInternalLiveCycle.e2e.test.ts
$env:BINANCE_FUTURES_POSITIVE_DCA_TTP_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeBinanceFuturesPositiveDcaTtpInternalLiveCycle.e2e.test.ts
```

Author-local SQL readback after 82 migrations: 3 intents, 3 `FILLED` orders,
3 fills, 3 trades, 3 distinct client IDs, and one successful DCA dedupe.
Position: `CLOSED|TTP|BOT_APP|199.69|1.001547593770344|0.1398962626|100`
(status, reason, initiator, quantity, average, net PnL, leverage). Telemetry
has one `DCA_EXECUTED`, one TTP `SIGNAL_DECISION`, and one `POSITION_CLOSED`.
This author-local internal mock awaits independent review. It does not prove
real Binance rules, balances, fills, fees, liquidation behavior, other
exchanges or markets, signed-in browser 003A, or production safety. The full
`POSITION-CYCLE` remains OPEN and release remains NO-GO.
