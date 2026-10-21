# SOAR-POSITION-CYCLE-008P: Gate.io Futures negative DCA before TSL internal mock LIVE

This opt-in test drives one internal Gate.io FUTURES LIVE bot and one active
BTCUSDT group through a durable ENTRY, advanced negative DCA, and TSL close.
The local intent, order, fill, position, trade, capital, telemetry, and Redis
runtime-state paths run against dedicated PostgreSQL and Redis instances.
Venue fills and the confirmed exchange margin balance are synthetic. All
other private exchange methods, the public connector factory, and global
`fetch` are tripwires. No real credential, venue order, or production runtime
is used.

008N covers this priority for Binance Futures, while 008B/008L/008O cover
different Gate Futures paths. 008P separately proves the advanced TSL/negative
DCA priority for a synthetic Gate FUTURES market. The strategy uses 100x
leverage, advanced TSL `{ percent: -20, arm: 10 }`, and one advanced DCA at
-30.5% ROI with multiplier 1 and `usdt_contribution_v1`. It starts with DCA
disabled, then enables DCA after TSL has armed, as in the PAPER scenario.
The **synthetic unit-contract** rules are `contractSize=1` BTC per contract,
`TICK_SIZE=1` contract, `minAmount=1` contract, and `minNotional=5` USDT.
Thus `price * quantity * contractSize` is USDT notional; modeled margin is
notional divided by leverage 100. ENTRY, DCA, and CLOSE fixtures charge
0.04% of notional in USDT. These rules, fees, and balance do not claim to
describe a real Gate.io market or account.

ENTRY fills 100 unit contracts at 1 USDT: 100 USDT notional and 1 USDT
modeled margin. A final candle without a new entry signal preserves the
position despite legacy `noMatchAction=EXIT`. Tick `0.9979` arms TSL at
-21% leveraged ROI; its initial protected limit is -31%. The recovery tick
`0.9989` ratchets that limit to -21%, or price `0.9979` before DCA.
After enabling DCA, tick `0.9969` is -31% ROI: below both the -30.5%
DCA trigger and the armed TSL limit. A synthetic `LIVE_PRETRADE_PAUSED`
DCA attempt keeps the original position open without a false TSL. Six
invalid rule variants (null/incompatible `contractSize`, unknown precision
mode, excessive amount minimum, and absent/excessive notional minimum)
return `DCA_ORDER_RULES_INVALID` before capital, DCA dedupe, intent, or
venue submit.

The next `0.9969` tick uses the real DCA quantity and capital resolvers.
The confirmed mock exchange balance is 10 USDT total and 9 USDT free.
A 1 USDT margin target is 100 USDT notional; raw quantity at `0.9969`
is about 100.310964 contracts. Flooring to the one-contract step gives
100 contracts, `100 * 0.9969 * 1 = 99.69` USDT notional and `0.9969`
USDT modeled margin. This is above both synthetic minima and less than
one price-by-step unit below the target. The position remains OPEN with
200 contracts and a fill-weighted average of `0.99845`. Its armed TSL
state remains active and its rebased protection still represents
approximately price `0.9979`. There is one successful DCA dedupe record
and no TSL close on this tick.

The `resume` stage runs in a different process. A `0.9989` tick confirms
the open position and the same ENTRY/DCA record IDs without a new venue
submit. A later `0.99685` tick closes the same 200 contracts once by
`TSL` / `BOT_APP`. The three fill notionals are 100, 99.69, and 199.37
USDT. Fees are 0.04, 0.039876, and 0.079748 USDT, totaling 0.159624.
Independent net PnL from the fills is
`199.37 - 100 - 99.69 - 0.159624 = -0.479624` USDT; the CLOSE trade
and position agree. Replay of the close tick preserves all intent, order,
fill, and trade IDs and event count. Only the CLOSE is submitted in the
second process.

Run `open` and `resume` as separate Vitest processes against the same
fresh, own PostgreSQL `_test` database and Redis instance. Each stage
reports one passed and one skipped test. Unknown stages fail during
collection; the test checks a different PID on resume and rejects default
ports or nonlocal database and Redis addresses. Example PowerShell setup
from `apps/api`:

```powershell
docker run -d --name soar-position008p-pg -e POSTGRES_USER=soar008p -e POSTGRES_PASSWORD=soar008p -e POSTGRES_DB=soar_position_cycle_008p_test -p 127.0.0.1:5571:5432 postgres:16-alpine
docker run -d --name soar-position008p-redis -p 127.0.0.1:6411:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008p:soar008p@127.0.0.1:5571/soar_position_cycle_008p_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6411'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008p:soar008p@127.0.0.1:5571/soar_position_cycle_008p'
$env:RUN_GATEIO_FUTURES_NEGATIVE_DCA_TSL_INTERNAL_MOCK_LIVE = '1'
$env:GATEIO_FUTURES_NEGATIVE_DCA_TSL_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeGateFuturesNegativeDcaTslInternalLiveCycle.e2e.test.ts
$env:GATEIO_FUTURES_NEGATIVE_DCA_TSL_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeGateFuturesNegativeDcaTslInternalLiveCycle.e2e.test.ts
```

Author-local SQL readback after 83 applied migrations: 3 intents, 3
`FILLED` orders, 3 fills, 3 trades, 3 distinct client IDs, and one
successful DCA dedupe. Position:
`CLOSED|TSL|BOT_APP|200|0.99845|-0.479624|100`
(status, reason, initiator, quantity, average, net PnL, leverage).
Telemetry has one `DCA_EXECUTED`, one TSL `SIGNAL_DECISION`, and one
`POSITION_CLOSED`. These are the historical author-local results.

Independent static review on exact code SHA
`69da8080dfddadf77bdd36275fdbe9d9e9347f06` passed the HOLD, funded
DCA-before-TSL, later single TSL, six Gate rule refusals, and fill-based
calculation. API typecheck, docs parity, diff, and graph 921/921 passed.
Independent QA on that exact SHA used a fresh own PostgreSQL `_test`
database after 83 migrations and Redis. Separate `open` and `resume`
processes each reported 1 PASS / 1 SKIP. No-signal held the position; on
the shared `0.9969` tick DCA filled 100 contracts before armed TSL and
there was no CLOSE. Six invalid-rule variants refused before DCA dedupe,
intent, or venue submit. After restart a single TSL / `BOT_APP` closed the
position. SQL after replay held 3 unique intents, 3 `FILLED` orders, 3
fills, 3 trades, and 1 successful DCA dedupe without duplicate IDs or
submits. ENTRY margin 1 USDT plus DCA margin 0.9969 USDT totaled 1.9969
USDT; quantity was 200 contracts and fill-weighted average 0.99845.
Fees totaled 0.159624 USDT and net PnL was -0.479624 USDT, matching the
three fills.

This independent PASS is limited to the local synthetic Gate FUTURES mock.
It does not prove actual Gate.io rules, balances, fills, fees, liquidation
behavior, other exchanges or markets, signed-in browser 003A, or production
safety. The full `POSITION-CYCLE` remains OPEN and release remains NO-GO.
