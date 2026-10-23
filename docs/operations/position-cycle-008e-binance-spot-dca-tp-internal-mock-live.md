# SOAR-POSITION-CYCLE-008E: Binance Spot DCA to TP internal mock LIVE

This opt-in test drives one internal Binance SPOT bot through the durable LIVE
intent, order, fill, position, and trade path. The bot has one active BTCUSDT
group. Only the venue fill is synthetic. The private exchange boundary,
public connector factory, and global `fetch` throw if reached. It uses no
real venue credential, order, or production runtime.

SPOT contribution is **USDT quote spent**, without leverage or a futures
contract-size multiplier. The synthetic executable rules use base-asset
quantity step `TICK_SIZE=0.01`, `minAmount=0.01`, `minNotional=0.5` USDT, and
`contractSize=null` (unit size one for SPOT). The fixture records a synthetic
USDT quote fee of 0.04% per fill; a real Binance fill could use a different
fee asset. Before DCA, `minNotional=100`, `minAmount=100`, and unknown
precision mode each return `DCA_ORDER_RULES_INVALID` without a second intent,
order, or venue submit.

The strategy uses leverage 1, two basic loss-side DCA levels at -30.5%, a 2x
contribution multiplier, and basic TP at +20%. ENTRY fills 1 BTC at 1 USDT,
spending 1 USDT. A final candle with no new entry signal leaves the position
open. Tick `0.6949` crosses the first DCA threshold `1 * (1 - 0.305) =
0.695`. The first nominal add target is 2 USDT; the 0.01 base-asset step
floors `2 / 0.6949` to 2.87 BTC. The confirmed fill spends 1.994363 USDT,
0.005637 below its target, and sets the weighted average near 0.7737372093.

The next target multiplies the **confirmed** book quote:
`2 * (1 + 1.994363) = 5.988726` USDT. Without the first step loss, the
nominal second target would be 6 USDT. The next DCA trigger is about
`0.7737372093 * (1 - 0.305) = 0.53774736`; tick `0.5375` crosses it.
The venue step floors `5.988726 / 0.5375` to 11.14 BTC, spending 5.98775
USDT (0.000976 below the confirmed target). The combined quantity is 15.01
BTC and confirmed average about 0.5984085943. After process restart, replay
of the DCA tick adds no submit. Tick `0.73` exceeds TP from the confirmed
average (`0.5984085943 * 1.20 = 0.7180903132`) and closes once with
`TP` / `BOT_APP`. Replaying the close tick adds no order.

The test calculates net PnL independently from all four persisted fill
notionals and all four fees, then compares the close trade and position
values. The local readback on the author's fresh fixture was
`1.9672112348` USDT net PnL.

Run `open` and `resume` as separate Vitest processes on the same fresh,
dedicated PostgreSQL `_test` database and Redis instance. Each stage reports
one passed and one skipped test. An unknown stage fails during collection;
the test checks a different PID on resume and rejects default service ports
or nonlocal addresses.

Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008e-pg -e POSTGRES_USER=soar008e -e POSTGRES_PASSWORD=soar008e -e POSTGRES_DB=soar_position_cycle_008e_test -p 127.0.0.1:5554:5432 postgres:16-alpine
docker run -d --name soar-position008e-redis -p 127.0.0.1:6394:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008e:soar008e@127.0.0.1:5554/soar_position_cycle_008e_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6394'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008e:soar008e@127.0.0.1:5554/soar_position_cycle_008e'
$env:RUN_BINANCE_SPOT_DCA_TP_INTERNAL_MOCK_LIVE = '1'
$env:BINANCE_SPOT_DCA_TP_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeBinanceSpotDcaTpInternalLiveCycle.e2e.test.ts
$env:BINANCE_SPOT_DCA_TP_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeBinanceSpotDcaTpInternalLiveCycle.e2e.test.ts
```

SQL readback should show four distinct client order IDs, four intents,
four `FILLED` orders, four fills, four trades, and one closed position with
`TP` / `BOT_APP`. Inspect fill quantity, quote notional, and fee before
discarding the dedicated containers. This local mock does not prove actual
Binance SPOT market metadata, fee currency or order semantics, Gate.io,
Futures, PAPER/BACKTEST, UI, or production safety.
