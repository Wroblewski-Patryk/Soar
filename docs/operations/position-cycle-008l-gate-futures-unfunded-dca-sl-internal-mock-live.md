# SOAR-POSITION-CYCLE-008L: Gate.io Futures unfunded DCA to SL internal mock LIVE

This opt-in proof runs one internal Gate.io FUTURES LIVE bot with one active
BTCUSDT group. The intent, order, fill, position, trade, capital, and telemetry
paths execute against a dedicated local database. Only venue fills and the
confirmed exchange margin balance are synthetic. Private exchange methods
other than the guarded balance read, the public connector factory, and global
`fetch` are tripwires. No real credential, venue order, or production runtime
is used.

The PAPER Futures unfunded test covers DCA/SL priority in PAPER. 008D covers
Gate.io Futures LIVE mock when loss-side DCA fills. 008K checks the unfunded
boundary for Binance Futures. 008L covers the missing Gate.io Futures LIVE
mock cell. Its **synthetic unit-contract** rules are `contractSize=1` BTC per
contract, `TICK_SIZE=1` contract, `minAmount=1` contract, and
`minNotional=5` USDT. Thus `price * quantity * contractSize` is USDT notional;
required margin is notional divided by leverage 100. The runtime DCA resolver
requires a known unit `contractSize=1`; null or another size fails closed.
Both ENTRY and CLOSE fixtures charge 0.04% of notional in USDT. These rules,
fees, and balance do not claim to describe a real Gate.io market or account.

The strategy has one basic DCA at -30.5% ROI with a 2x contribution multiplier
and basic SL at -20% ROI. ENTRY fills 100 unit contracts at 1 USDT: 100 USDT
notional and 1 USDT modeled margin at 100x. A final candle without a new
entry signal preserves the position despite legacy `noMatchAction=EXIT`.
Tick `0.99692` has -30.8% leveraged ROI, crossing both the DCA threshold
`0.99695` and the older SL threshold `0.998`. The first DCA attempt simulates
`LIVE_PRETRADE_PAUSED`, keeping the same position open without a false SL or
DCA intent. Six invalid rule variants (null or incompatible contract size,
unknown or absent precision, excessive amount minimum, excessive notional
minimum) return `DCA_ORDER_RULES_INVALID` before capital, dedupe, intent,
or venue transport.

On the next tick, the real DCA quantity resolver receives the synthetic Gate
rules. The 2 USDT margin target is 200 USDT notional. At `0.99692`, raw
quantity is about 200.617903 contracts; flooring to the step of one yields
200 contracts, `199.384` USDT notional and `1.99384` USDT required margin.
This satisfies the synthetic amount and notional minima. The mock exchange
confirms 2.5 USDT total and 0.5 USDT free, with 1 USDT modeled margin in
the open position. The real LIVE capital resolver compares executable
required margin to confirmed free margin and raises `DCA_FUNDS_EXHAUSTED`
before DCA dedupe, intent, order, or submit. One `PRETRADE_BLOCKED` event
records `dca_funds_exhausted`. The automation then releases the crossed SL,
closes the original 100-contract position once with `SL` / `BOT_APP`, and
records one `SIGNAL_DECISION` with `dcaFundsExhausted=true`.

The CLOSE fill is 100 unit contracts at `0.99692`, or 99.692 USDT notional.
Fees are `0.04` ENTRY plus `0.0398768` CLOSE, totaling `0.0798768` USDT.
Independent net PnL from persisted fills is
`99.692 - 100 - 0.0798768 = -0.3878768` USDT; the CLOSE trade and position
agree. Leverage scales modeled margin and ROI thresholds; it does not divide
realized quote PnL or fill fee. Only ENTRY and CLOSE have unique durable
intents, `FILLED` orders, fills, and trades. There is no DCA intent, trade,
dedupe record, or venue submit. The `resume` stage runs in another process
and verifies the same IDs, PnL, event count, terminal position, and zero
additional submit.

Run `open` and `resume` as separate Vitest processes on the same fresh,
dedicated PostgreSQL `_test` database and Redis instance. Each stage reports
one passed and one skipped test. Unknown stages fail during collection. The
test rejects default service ports and nonlocal addresses and checks a
different PID on resume. Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008l-pg -e POSTGRES_USER=soar008l -e POSTGRES_PASSWORD=soar008l -e POSTGRES_DB=soar_position_cycle_008l_test -p 127.0.0.1:5565:5432 postgres:16-alpine
docker run -d --name soar-position008l-redis -p 127.0.0.1:6405:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008l:soar008l@127.0.0.1:5565/soar_position_cycle_008l_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6405'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008l:soar008l@127.0.0.1:5565/soar_position_cycle_008l'
$env:RUN_GATEIO_FUTURES_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE = '1'
$env:GATEIO_FUTURES_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeGateFuturesUnfundedDcaSlInternalLiveCycle.e2e.test.ts
$env:GATEIO_FUTURES_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeGateFuturesUnfundedDcaSlInternalLiveCycle.e2e.test.ts
```

Author-local readback after 82 migrations: `2|2|2|2|2|0` intents, orders,
fills, trades, distinct client IDs, and DCA dedupe records. The position is
`CLOSED|SL|BOT_APP|100|1|-0.3878768|100` (status, reason, initiator,
quantity, entry, net PnL, leverage). Trades are `OPEN|100|1|0.04` and
`CLOSE|100|0.99692|0.0398768`. Telemetry contains one
`dca_funds_exhausted` and one `stop_loss`. This author-local mock awaits
independent review. It does not prove actual Gate.io Futures rules, balance,
margin reservation, liquidation behavior, fee currency, or venue transport;
nor other exchanges, signed-in browser 003A, or production safety. The full
`POSITION-CYCLE` remains OPEN and release remains NO-GO.
