# SOAR-POSITION-CYCLE-008K: Binance Futures unfunded DCA to SL internal mock LIVE

This opt-in test runs one internal Binance FUTURES LIVE bot with one active
BTCUSDT group. The intent, order, fill, position, trade, capital, and telemetry
paths are real local code against a dedicated database. Only venue fills and
the confirmed exchange margin balance are synthetic. Private exchange methods
other than the guarded balance read, the public connector factory, and global
`fetch` are tripwires. No real credential, venue order, or production runtime
is involved.

The existing PAPER Futures unfunded test covers the same DCA/SL priority in
PAPER. 008C covers Binance Futures LIVE mock when DCA has funds and fills.
008K checks the missing LIVE boundary when an executable DCA lacks confirmed
free margin. The synthetic Binance Futures rules are `contractSize=1`,
`TICK_SIZE=0.01` BTC, `minAmount=0.01` BTC, and `minNotional=5` USDT. A Futures
order quantity is base BTC; `price * quantity * contractSize` is USDT notional,
and the modeled required margin is notional divided by leverage 100. Both
ENTRY and CLOSE synthetic fills charge 0.04% of notional in USDT. These rules,
fees, and the balance are fixtures, not a readback of real Binance filters or
account semantics.

The strategy has one basic DCA at -30.5% ROI with a 2x contribution multiplier
and basic SL at -20% ROI. ENTRY is 100 BTC at 1 USDT: 100 USDT notional and
1 USDT modeled margin at 100x. A final candle without a new entry signal
preserves the position despite legacy `noMatchAction=EXIT`. Tick `0.99694`
has -30.6% leveraged ROI, crossing the DCA level and the older SL level
`0.998`. The first DCA attempt simulates `LIVE_PRETRADE_PAUSED`; the pending
DCA keeps the same position open with no false SL, DCA intent, or submit.

On the second tick, the real quantity resolver receives the synthetic Futures
rules. A 2 USDT margin target is 200 USDT notional; at `0.99694`, the raw
quantity is about 200.613878 BTC. Flooring to the 0.01 BTC step gives
200.61 BTC, `199.9961334` USDT notional and `1.999961334` USDT required
margin. This passes the synthetic amount and notional minima. The mock
exchange confirms 2.5 USDT total and 0.5 USDT free, while the open position
uses 1 USDT modeled margin. The real LIVE capital resolver compares the
executable required margin to confirmed free margin and raises
`DCA_FUNDS_EXHAUSTED` before DCA dedupe, intent, order, or submit. One
`PRETRADE_BLOCKED` event records `dca_funds_exhausted`. The automation then
releases the crossed SL, closes the existing 100 BTC position once with
`SL` / `BOT_APP`, and records one `SIGNAL_DECISION` with
`dcaFundsExhausted=true`. Five invalid rule variants (absent or incompatible
contract size, unknown precision mode, excess amount minimum, excess notional
minimum) independently fail with `DCA_ORDER_RULES_INVALID` before capital or
transport.

The CLOSE fill is 100 BTC at `0.99694`, or 99.694 USDT notional. Fees are
`0.04` ENTRY plus `0.0398776` CLOSE, totaling `0.0798776` USDT. Independent
net PnL from persisted fills is `99.694 - 100 - 0.0798776 = -0.3858776`
USDT; the CLOSE trade and position agree. The leverage scales margin and
ROI thresholds, but does not divide the realized quote PnL or fill fee.
There are only two unique durable intents, `FILLED` orders, fills, and trades:
ENTRY and CLOSE. There is no DCA intent, trade, dedupe record, or venue submit.
The `resume` stage runs in another process and verifies the same IDs, PnL,
event count, terminal position, and no additional submit.

Run `open` and `resume` as separate Vitest processes on the same fresh, own
PostgreSQL `_test` database and Redis instance. Each stage reports one passed
and one skipped test. Unknown stages fail during collection. The test rejects
default service ports and nonlocal addresses and checks a different PID on
resume. Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008k-pg -e POSTGRES_USER=soar008k -e POSTGRES_PASSWORD=soar008k -e POSTGRES_DB=soar_position_cycle_008k_test -p 127.0.0.1:5563:5432 postgres:16-alpine
docker run -d --name soar-position008k-redis -p 127.0.0.1:6403:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008k:soar008k@127.0.0.1:5563/soar_position_cycle_008k_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6403'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008k:soar008k@127.0.0.1:5563/soar_position_cycle_008k'
$env:RUN_BINANCE_FUTURES_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE = '1'
$env:BINANCE_FUTURES_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeBinanceFuturesUnfundedDcaSlInternalLiveCycle.e2e.test.ts
$env:BINANCE_FUTURES_UNFUNDED_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeBinanceFuturesUnfundedDcaSlInternalLiveCycle.e2e.test.ts
```

Author-local readback after 82 migrations: `2|2|2|2|2` intents, orders,
fills, trades, and distinct client order IDs; one position is
`CLOSED|SL|BOT_APP|100|1|-0.3858776|100` (status, reason, initiator,
quantity, entry, net PnL, leverage). Trades are `OPEN|100|1|0.04` and
`CLOSE|100|0.99694|0.0398776`. Telemetry contains one
`dca_funds_exhausted` and one `stop_loss`. This author-local internal mock
awaits independent review. It does not prove actual Binance Futures rules,
balance, margin reservation, liquidation behavior, fee currency, or venue
transport; nor Gate.io, SPOT, signed-in browser 003A, or production safety.
The full `POSITION-CYCLE` remains OPEN and release remains NO-GO.
