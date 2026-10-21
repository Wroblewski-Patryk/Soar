# SOAR-POSITION-CYCLE-008G: Binance Spot DCA to SL internal mock LIVE

This opt-in test drives one internal Binance SPOT bot with one active BTCUSDT
group through durable LIVE intents, orders, fills, position, and trades. Only
the venue fill is synthetic. The private exchange boundary, public connector
factory, and global `fetch` are tripwires. It uses no real credential, order,
or production runtime.

The executable fixture specifies a base quantity step of `0.01` BTC,
`minAmount=0.01` BTC, `minNotional=0.5` USDT, `TICK_SIZE` precision,
`contractSize=null` (SPOT unit size one), and a synthetic 0.04% fee in USDT
on each fill. Five invalid variants (non-unit contract size, quantity step
`5`, too high amount or notional minimum, and unknown precision mode) return
`DCA_ORDER_RULES_INVALID` before any DCA intent or venue submission. Actual
Binance filters, fee currency, balances, and fill semantics are unverified.

The strategy uses leverage 1, basic DCA at a -30.5% SPOT ROI threshold, two
adds with a 2x contribution multiplier, and basic SL at -20%. SPOT ROI here
is `(mark - confirmed average) / confirmed average`; there is no futures
leverage multiplier. ENTRY fills 1 BTC at 1 USDT, spending 1 USDT. A final
candle with no new entry signal leaves the position open despite the
configured `noMatchAction=EXIT`.

The first DCA tick `0.6949` crosses both the DCA threshold `0.695` and the
old SL `0.8`; DCA takes precedence. The target add is 2 USDT, but the `0.01`
BTC step floors `2 / 0.6949` to 2.87 BTC. The fill spends `1.994363` USDT,
less than the target by `0.005637` USDT. The confirmed average becomes
`(1 + 1.994363) / (1 + 2.87) = 0.7737372093`; the rebased SL is
`0.6189897674`, below the first DCA tick.

The second target is **2x confirmed cumulative quote spent**:
`2 * (1 + 1.994363) = 5.988726` USDT. The ideal unrounded sequence would
target 6 USDT. The next DCA threshold is `0.5377473605`, and its old SL is
`0.6189897674`, so tick `0.5375` crosses both. DCA again takes precedence.
The step floors `5.988726 / 0.5375` to 11.14 BTC, spending `5.98775`
USDT, only `0.000976` short of the target. Confirmed total base is 15.01
BTC, total spent quote is `8.982113` USDT, and average is
`0.5984085943`. The new SL is `0.4787268754`, below the second DCA tick;
the position remains open through replay. Both DCA fill shortfalls are less
than one price-by-step unit and exceed the synthetic minimum notional.

After a different process restarts the automation, tick `0.47` is below the
new SL and yields one `SL` / `BOT_APP` close. Its SPOT ROI is about -21.46%
from the confirmed average. The close fills 15.01 BTC for `7.0547` USDT.
Independent calculation from the four persisted fills gives total fees
`(1 + 1.994363 + 5.98775 + 7.0547) * 0.0004 = 0.0064147252` USDT and
net PnL `7.0547 - 8.982113 - 0.0064147252 = -1.9338277252` USDT.
The close trade and position agree; replay after close submits nothing.

Run `open` and `resume` as separate Vitest processes on the same fresh,
dedicated PostgreSQL `_test` database and Redis instance. Each stage reports
one passed and one skipped test. Unknown stages fail during collection; the
test checks a different PID on resume and rejects default service ports and
nonlocal addresses. Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008g-proof-pg -e POSTGRES_USER=soar008g -e POSTGRES_PASSWORD=soar008g -e POSTGRES_DB=soar_position_cycle_008g_test -p 127.0.0.1:5557:5432 postgres:16-alpine
docker run -d --name soar-position008g-proof-redis -p 127.0.0.1:6397:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008g:soar008g@127.0.0.1:5557/soar_position_cycle_008g_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6397'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008g:soar008g@127.0.0.1:5557/soar_position_cycle_008g'
$env:RUN_BINANCE_SPOT_DCA_SL_INTERNAL_MOCK_LIVE = '1'
$env:BINANCE_SPOT_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeBinanceSpotDcaSlInternalLiveCycle.e2e.test.ts
$env:BINANCE_SPOT_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeBinanceSpotDcaSlInternalLiveCycle.e2e.test.ts
```

Author readback on a fresh isolated fixture after 82 migrations: `4|4|4|4|4`
intents, orders, fills, trades, and distinct client order IDs; all four orders
are `FILLED`. The position is `CLOSED|SL|BOT_APP|15.01|0.5984085942704863|
-1.9338277252|1` (status, reason, initiator, quantity, average, net PnL,
leverage). This is author-local internal mock evidence awaiting independent
review. It does not prove actual Binance SPOT, Gate.io, FUTURES,
PAPER/BACKTEST, signed-in browser 003A, or production safety. The full
`POSITION-CYCLE` remains OPEN and release remains NO-GO.
