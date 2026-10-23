# SOAR-POSITION-CYCLE-008N: Binance Futures negative DCA before TSL internal mock LIVE

This opt-in test drives one internal Binance FUTURES LIVE bot and one active
BTCUSDT group through a durable ENTRY, advanced negative DCA, and TSL close.
The local intent, order, fill, position, trade, capital, telemetry, and Redis
runtime-state paths run against dedicated PostgreSQL and Redis instances.
Venue fills and the confirmed exchange margin balance are synthetic. All
other private exchange methods, the public connector factory, and global
`fetch` are tripwires. No real credential, venue order, or production runtime
is used.

The existing PAPER test proves armed TSL versus newly enabled negative DCA in
PAPER. Earlier Binance Futures LIVE mock cycles cover basic DCA with TP/SL;
008M covers advanced TTP with positive DCA. 008N covers the missing advanced
TSL/negative DCA priority in an internal LIVE mock. The strategy uses 100x
leverage, advanced TSL `{ percent: -20, arm: 10 }`, and one advanced DCA at
-30.5% ROI with multiplier 1 and `usdt_contribution_v1`. It starts with DCA
disabled, then enables DCA after TSL has armed, as in the PAPER scenario.
The synthetic Futures rules use `contractSize=1`, `TICK_SIZE=0.01` BTC,
`minAmount=0.01` BTC, and `minNotional=5` USDT. Fees are 0.04% of each fill
notional in USDT. These are fixtures, not readbacks of Binance market rules,
balance, or fees.

ENTRY fills 100 BTC at 1 USDT: 100 USDT notional and 1 USDT modeled margin.
A final candle without a new entry signal preserves the position despite
legacy `noMatchAction=EXIT`. Tick `0.9979` arms TSL at -21% leveraged ROI,
initially setting its loss limit to -31%. A recovery tick `0.9989` (-11%
ROI) ratchets the loss limit to -21%, or price `0.9979` before DCA.
After enabling DCA, tick `0.9969` is -31% ROI: below the -30.5% DCA trigger
and below the ratcheted TSL floor. A synthetic `LIVE_PRETRADE_PAUSED` DCA
attempt keeps the original position open without a false TSL. Invalid
`contractSize` and missing `minNotional` each return
`DCA_ORDER_RULES_INVALID` before capital, DCA dedupe, intent, or venue submit.

The next `0.9969` tick uses the real DCA quantity and capital resolvers.
The confirmed mock exchange balance is 10 USDT total and 9 USDT free. A
1 USDT margin target is 100 USDT notional; raw quantity at `0.9969` is
about 100.310964 BTC, floored to 100.31 BTC on the 0.01 step. The persisted
DCA fill is `100.31 * 0.9969 = 99.999039` USDT notional and `0.99999039`
USDT modeled margin. The position remains OPEN with 200.31 BTC and a
fill-weighted average of `0.9984476012181118`. Its armed TSL state remains
active, with a rebased floor representing approximately price `0.9979`.
There is one successful DCA dedupe record and no TSL close on this tick.

The `resume` stage runs in a different process. A `0.9989` tick confirms
the open position and the same ENTRY/DCA record IDs without a new venue
submit. A later `0.99685` tick closes the same 200.31 BTC once by
`TSL` / `BOT_APP`. The three fill notionals are 100, 99.999039, and
199.6790235 USDT. Fees are 0.04, 0.0399996156, and 0.0798716094 USDT,
totaling 0.159871225. Independent net PnL from the fills is
`199.6790235 - 100 - 99.999039 - 0.159871225 = -0.479886725` USDT;
the CLOSE trade and position agree. Replay of the close tick preserves
all intent, order, fill, and trade IDs and event count. Only the CLOSE is
submitted in the second process.

Run `open` and `resume` as separate Vitest processes against the same fresh,
own PostgreSQL `_test` database and Redis instance. Each stage reports one
passed and one skipped test. Unknown stages fail during collection; the test
checks a different PID on resume and rejects default ports or nonlocal
database and Redis addresses. Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008n-pg -e POSTGRES_USER=soar008n -e POSTGRES_PASSWORD=soar008n -e POSTGRES_DB=soar_position_cycle_008n_test -p 127.0.0.1:5568:5432 postgres:16-alpine
docker run -d --name soar-position008n-redis -p 127.0.0.1:6408:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008n:soar008n@127.0.0.1:5568/soar_position_cycle_008n_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6408'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008n:soar008n@127.0.0.1:5568/soar_position_cycle_008n'
$env:RUN_BINANCE_FUTURES_NEGATIVE_DCA_TSL_INTERNAL_MOCK_LIVE = '1'
$env:BINANCE_FUTURES_NEGATIVE_DCA_TSL_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeBinanceFuturesNegativeDcaTslInternalLiveCycle.e2e.test.ts
$env:BINANCE_FUTURES_NEGATIVE_DCA_TSL_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeBinanceFuturesNegativeDcaTslInternalLiveCycle.e2e.test.ts
```

Author-local SQL readback after 82 migrations: 3 intents, 3 `FILLED` orders,
3 fills, 3 trades, 3 distinct client IDs, and one successful DCA dedupe.
Position: `CLOSED|TSL|BOT_APP|200.31|0.9984476012181118|-0.479886725|100`
(status, reason, initiator, quantity, average, net PnL, leverage). Telemetry
has one `DCA_EXECUTED`, one TSL `SIGNAL_DECISION`, and one `POSITION_CLOSED`.
This author-local internal mock awaits independent review. It does not prove
real Binance rules, balances, fills, fees, liquidation behavior, other
exchanges or markets, signed-in browser 003A, or production safety. The full
`POSITION-CYCLE` remains OPEN and release remains NO-GO.
