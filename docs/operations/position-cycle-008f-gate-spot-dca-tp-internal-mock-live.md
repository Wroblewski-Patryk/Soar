# SOAR-POSITION-CYCLE-008F: Gate.io Spot DCA to TP internal mock LIVE

This opt-in test drives one internal Gate.io SPOT bot through the durable LIVE
intent, order, fill, position, and trade path. The bot has one active BTCUSDT
group. Only the venue fill is synthetic. The private exchange boundary,
public connector factory, and global `fetch` throw if reached. No real Gate
credential, order, or production runtime is used.

The adapter registry routes Gate.io SPOT to `CcxtSpotConnector`, which sets
CCXT `marketType=spot`. The shared connector reads `limits.amount.min`,
`limits.cost.min`, `precision.amount`, and the CCXT precision mode; it reads
fee currency from the trade. The runtime DCA resolver floors SPOT base
quantity to that step, checks minimum amount and quote notional, and accepts
`contractSize=null` as SPOT unit size one. This test replaces the connector
with a deterministic venue fill, so it verifies the internal path against
synthetic rules rather than actual Gate.io metadata or fee behavior.

The positive fixture uses explicit `TICK_SIZE=0.1` BTC,
`minAmount=0.1` BTC, `minNotional=0.5` USDT, and `contractSize=null`.
It records a **synthetic USDT quote fee** of 0.04% on each fill; real Gate.io
fees may be denominated or reported differently. Before DCA, five invalid
rule variants (`contractSize=10`, step `5`, `minNotional=100`,
`minAmount=100`, and unknown precision mode) must return
`DCA_ORDER_RULES_INVALID` while intent, order, and venue-submit counts stay
at the one ENTRY.

The strategy uses leverage 1, two basic loss-side DCA levels at -30.5%, a 2x
contribution multiplier, and basic TP at +20%. ENTRY fills 1 BTC at 1 USDT,
spending 1 USDT. A final candle without a new entry signal leaves it open.
Tick `0.6949` crosses the first DCA threshold `1 * (1 - 0.305) = 0.695`.
The first add targets 2 USDT quote. The 0.1 base step floors
`2 / 0.6949` to 2.8 BTC, spending 1.94572 USDT (0.05428 below target).
The confirmed weighted average is `(1 + 1.94572) / (1 + 2.8) =
0.7751894737`.

The second target multiplies **confirmed** quote spent:
`2 * (1 + 1.94572) = 5.89144` USDT; the ideal unrounded sequence would
target 6 USDT. The next DCA trigger is about
`0.7751894737 * (1 - 0.305) = 0.5387566842`; tick `0.5375` crosses it.
The step floors `5.89144 / 0.5375` to 10.9 BTC, spending 5.85875 USDT
(0.03269 below the confirmed target). Both fills are within one price-by-step
unit of their targets. The combined quantity is 14.7 BTC and confirmed
average about 0.5989435374. After process restart, replay of the DCA tick
adds no submit. Tick `0.73` exceeds TP from that average
(`0.5989435374 * 1.20 = 0.7187322449`) and closes once with
`TP` / `BOT_APP`; replaying the close tick adds no order.

The test calculates net PnL independently from all four persisted fill
notionals and all four fees, then compares the close trade and position
values. The author's local readback yielded total fees `0.007814188` USDT
and net PnL `+1.918715812` USDT.

Run `open` and `resume` as separate Vitest processes on the same fresh,
dedicated PostgreSQL `_test` database and Redis instance. Each stage reports
one passed and one skipped test. Unknown stage values fail during collection;
the test checks a different PID on resume and rejects default service ports
or nonlocal addresses.

Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008f-pg -e POSTGRES_USER=soar008f -e POSTGRES_PASSWORD=soar008f -e POSTGRES_DB=soar_position_cycle_008f_test -p 127.0.0.1:5555:5432 postgres:16-alpine
docker run -d --name soar-position008f-redis -p 127.0.0.1:6395:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008f:soar008f@127.0.0.1:5555/soar_position_cycle_008f_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6395'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008f:soar008f@127.0.0.1:5555/soar_position_cycle_008f'
$env:RUN_GATEIO_SPOT_DCA_TP_INTERNAL_MOCK_LIVE = '1'
$env:GATEIO_SPOT_DCA_TP_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeGateSpotDcaTpInternalLiveCycle.e2e.test.ts
$env:GATEIO_SPOT_DCA_TP_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeGateSpotDcaTpInternalLiveCycle.e2e.test.ts
```

SQL readback should show four distinct client order IDs, four intents,
four `FILLED` orders, four fills, four trades, and one closed position with
`TP` / `BOT_APP`. Inspect fill quantity, quote notional, and fee before
discarding the dedicated containers. This local mock does not prove actual
Gate.io SPOT market metadata, fee currency or order semantics, Binance,
Futures, PAPER/BACKTEST, UI, or production safety.
