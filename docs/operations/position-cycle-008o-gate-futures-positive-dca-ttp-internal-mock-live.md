# SOAR-POSITION-CYCLE-008O: Gate.io Futures positive DCA before TTP internal mock LIVE

This opt-in test drives one internal Gate.io FUTURES LIVE bot and one active
BTCUSDT group through a durable ENTRY, advanced positive DCA, and TTP close.
The local intent, order, fill, position, trade, capital, telemetry, and Redis
runtime-state paths run against dedicated PostgreSQL and Redis instances.
Venue fills and the confirmed exchange margin balance are synthetic. All
other private exchange methods, the public connector factory, and global
`fetch` are tripwires. No real credential, venue order, or production runtime
is used.

008M covers this priority for Binance Futures and 008B/008L cover different
Gate Futures paths. 008O separately proves the advanced TTP/positive DCA
priority for a synthetic Gate FUTURES market. The strategy uses 100x
leverage, advanced TTP `{ percent: 20, arm: 10 }`, and one advanced DCA at
+30.5% ROI with multiplier 1 and `usdt_contribution_v1`. It starts with DCA
disabled, then enables DCA after TTP has armed, as in the PAPER scenario.
The **synthetic unit-contract** rules are `contractSize=1` BTC per contract,
`TICK_SIZE=1` contract, `minAmount=1` contract, and `minNotional=5` USDT.
Thus `price * quantity * contractSize` is USDT notional; modeled margin is
notional divided by leverage 100. ENTRY, DCA, and CLOSE fixtures charge
0.04% of notional in USDT. These rules, fees, and balance do not claim to
describe a real Gate.io market or account.

ENTRY fills 100 unit contracts at 1 USDT: 100 USDT notional and 1 USDT
modeled margin. A final candle without a new entry signal preserves the
position despite legacy `noMatchAction=EXIT`. Tick `1.0051` arms TTP at
+51% leveraged ROI; high is 51%, trailing step 10%, and protected floor
+41%, or price `1.0041` before DCA. Tick `1.0046` tracks a retracement
above that floor. After enabling DCA, tick `1.0031` is +31% ROI: above the
+30.5% DCA trigger but below the armed TTP floor. A synthetic
`LIVE_PRETRADE_PAUSED` DCA attempt keeps the original position open without
a false TTP. Six invalid rule variants (null/incompatible `contractSize`,
unknown precision mode, excessive amount minimum, and absent/excessive
notional minimum) return `DCA_ORDER_RULES_INVALID` before capital, DCA
dedupe, intent, or venue submit.

The next `1.0031` tick uses the real DCA quantity and capital resolvers.
The confirmed mock exchange balance is 10 USDT total and 9 USDT free.
A 1 USDT margin target is 100 USDT notional; raw quantity at `1.0031` is
about 99.690958 contracts. Flooring to the one-contract step gives 99
contracts, `99 * 1.0031 * 1 = 99.3069` USDT notional and `0.993069`
USDT modeled margin. This is above both synthetic minima and less than
one price-by-step unit below the target. The position remains OPEN with
199 contracts and a fill-weighted average of `1.0015422110552765`.
Its armed TTP state remains active and its rebased floor still represents
approximately price `1.0041`. There is one successful DCA dedupe record
and no TTP close on this tick.

The `resume` stage runs in a different process. A `1.0046` tick confirms
the open position and the same ENTRY/DCA record IDs without a new venue
submit. A later `1.00305` tick closes the same 199 contracts once by
`TTP` / `BOT_APP`. The three fill notionals are 100, 99.3069, and
199.60695 USDT. Fees are 0.04, 0.03972276, and 0.07984278 USDT,
totaling 0.15956554. Independent net PnL from the fills is
`199.60695 - 100 - 99.3069 - 0.15956554 = +0.14048446` USDT;
the CLOSE trade and position agree. Replay of the close tick preserves
all intent, order, fill, and trade IDs and event count. Only the CLOSE is
submitted in the second process.

Run `open` and `resume` as separate Vitest processes against the same fresh,
own PostgreSQL `_test` database and Redis instance. Each stage reports one
passed and one skipped test. Unknown stages fail during collection; the test
checks a different PID on resume and rejects default ports or nonlocal
database and Redis addresses. Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008o-pg -e POSTGRES_USER=soar008o -e POSTGRES_PASSWORD=soar008o -e POSTGRES_DB=soar_position_cycle_008o_test -p 127.0.0.1:5569:5432 postgres:16-alpine
docker run -d --name soar-position008o-redis -p 127.0.0.1:6409:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008o:soar008o@127.0.0.1:5569/soar_position_cycle_008o_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6409'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008o:soar008o@127.0.0.1:5569/soar_position_cycle_008o'
$env:RUN_GATEIO_FUTURES_POSITIVE_DCA_TTP_INTERNAL_MOCK_LIVE = '1'
$env:GATEIO_FUTURES_POSITIVE_DCA_TTP_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeGateFuturesPositiveDcaTtpInternalLiveCycle.e2e.test.ts
$env:GATEIO_FUTURES_POSITIVE_DCA_TTP_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeGateFuturesPositiveDcaTtpInternalLiveCycle.e2e.test.ts
```

Historical author-local SQL readback, without using its reported migration
count as acceptance evidence: 3 intents, 3 `FILLED` orders,
3 fills, 3 trades, 3 distinct client IDs, and one successful DCA dedupe.
Position: `CLOSED|TTP|BOT_APP|199|1.001542211055277|0.14048446|100`
(status, reason, initiator, quantity, average, net PnL, leverage). Telemetry
has one `DCA_EXECUTED`, one TTP `SIGNAL_DECISION`, and one `POSITION_CLOSED`.

Independent static review of code on exact SHA `1e256d5a1067ec7760e78b0f4ad953debbb1854a`
passed on substance; its `REVIEW` concerned only the stale migration count in
the documentation. Independent QA on that exact code SHA used a fresh own
PostgreSQL `_test` database and Redis: `prisma migrate deploy` found 83
migrations and `_prisma_migrations` contained 83 finished migrations. Separate
`open` and `resume` processes each reported 1 PASS / 1 SKIP. The run showed
no-signal HOLD; funded DCA before armed TTP on the shared tick without CLOSE;
six invalid-rule refusals before DCA dedupe, intent, or venue submit; and one
later TTP after restart. SQL after replay had 3 unique intents, 3 `FILLED`
orders, 3 fills, 3 trades, and 1 successful DCA dedupe, with no duplicate
IDs or submits. ENTRY margin was 1 USDT and DCA margin 0.993069 USDT; the
position held 199 contracts at fill-weighted average 1.0015422110552765.
Fees totaled 0.15956554 USDT and net PnL was +0.14048446 USDT, matching
the three fills.

This independent PASS is limited to the local synthetic Gate FUTURES mock.
It does not prove actual Gate.io rules, balances, fills, fees, liquidation
behavior, other exchanges or markets, signed-in browser 003A, or production
safety. The full `POSITION-CYCLE` remains OPEN and release remains NO-GO.
