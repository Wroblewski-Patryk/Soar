# SOAR-POSITION-CYCLE-008H: Gate.io Spot DCA to SL internal mock LIVE

This opt-in test drives one internal Gate.io SPOT bot with one active BTCUSDT
group through durable LIVE intents, orders, fills, position, and trades. Only
the venue fill is synthetic. The private exchange boundary, public connector
factory, and global `fetch` are tripwires. No real Gate credential, order, or
production runtime is used.

The adapter registry routes Gate.io SPOT to `CcxtSpotConnector`, which uses
CCXT `marketType=spot`. Its market rules supply `limits.amount.min`,
`limits.cost.min`, `precision.amount`, and precision mode; a venue fill
supplies fee currency. This test replaces the connector response with an
explicit executable synthetic fixture: base quantity step `0.1` BTC,
`minAmount=0.1` BTC, `minNotional=0.5` USDT, `TICK_SIZE` precision,
`contractSize=null` (SPOT unit size one), and 0.04% fee in USDT per fill.
Five invalid variants (non-unit contract size, quantity step `5`, too high
amount or notional minimum, and unknown precision mode) return
`DCA_ORDER_RULES_INVALID` before a DCA intent or venue submit. Actual Gate
filters, fee currency, balances, and fill semantics remain unverified.

The strategy uses leverage 1, basic DCA at a -30.5% SPOT ROI threshold, two
adds with a 2x contribution multiplier, and basic SL at -20%. SPOT ROI is
`(mark - confirmed average) / confirmed average`; there is no futures
leverage multiplier. ENTRY fills 1 BTC at 1 USDT, spending 1 USDT. A final
candle with no new entry signal leaves the position open despite configured
`noMatchAction=EXIT`.

Tick `0.6949` crosses both the first DCA threshold `0.695` and the old SL
`0.8`; DCA takes precedence. The first target is 2 USDT quote. The `0.1`
BTC step floors `2 / 0.6949` to 2.8 BTC, spending `1.94572` USDT, or
`0.05428` below target. The confirmed average becomes
`(1 + 1.94572) / (1 + 2.8) = 0.7751894737`; its rebased SL is
`0.6201515789`, below the first DCA tick.

The second target is **2x confirmed cumulative quote spent**:
`2 * (1 + 1.94572) = 5.89144` USDT. The ideal unrounded sequence would
target 6 USDT. The next DCA threshold is `0.5387566842` and the prior SL
is `0.6201515789`, so tick `0.5375` crosses both. DCA again takes
precedence. The step floors `5.89144 / 0.5375` to 10.9 BTC, spending
`5.85875` USDT, or `0.03269` below its confirmed target. Confirmed total
base is 14.7 BTC, spent quote is `8.80447` USDT, and average is
`0.5989435374`. The new SL is `0.4791548299`, below the second DCA tick;
the position remains open through replay. Both DCA fill shortfalls are less
than one price-by-step unit and exceed the synthetic minimum notional.

After a different process restarts the automation, tick `0.47` falls below
the new SL and produces one `SL` / `BOT_APP` close. Its SPOT ROI is about
-21.53% from the confirmed average. The close fills 14.7 BTC for `6.909`
USDT. Independent calculation from the four persisted fills gives total
fees `(1 + 1.94572 + 5.85875 + 6.909) * 0.0004 = 0.006285388` USDT
and net PnL `6.909 - 8.80447 - 0.006285388 = -1.901755388` USDT.
The close trade and position agree; replay after close submits nothing.

Run `open` and `resume` as separate Vitest processes on the same fresh,
dedicated PostgreSQL `_test` database and Redis instance. Each stage reports
one passed and one skipped test. Unknown stages fail during collection; the
test checks a different PID on resume and rejects default service ports and
nonlocal addresses. Example PowerShell setup from `apps/api`:

```powershell
docker run -d --name soar-position008h-proof-pg -e POSTGRES_USER=soar008h -e POSTGRES_PASSWORD=soar008h -e POSTGRES_DB=soar_position_cycle_008h_test -p 127.0.0.1:5559:5432 postgres:16-alpine
docker run -d --name soar-position008h-proof-redis -p 127.0.0.1:6399:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008h:soar008h@127.0.0.1:5559/soar_position_cycle_008h_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
$env:REDIS_URL = 'redis://127.0.0.1:6399'
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008h:soar008h@127.0.0.1:5559/soar_position_cycle_008h'
$env:RUN_GATEIO_SPOT_DCA_SL_INTERNAL_MOCK_LIVE = '1'
$env:GATEIO_SPOT_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeGateSpotDcaSlInternalLiveCycle.e2e.test.ts
$env:GATEIO_SPOT_DCA_SL_INTERNAL_MOCK_LIVE_STAGE = 'resume'
pnpm exec vitest run src/modules/engine/runtimeGateSpotDcaSlInternalLiveCycle.e2e.test.ts
```

Author readback on a fresh isolated fixture after 82 migrations: `4|4|4|4|4`
intents, orders, fills, trades, and distinct client order IDs; all four orders
are `FILLED`. Gate client order IDs use a 22-character digest after `soar_`
as required by the venue-specific intent normalizer. The position is
`CLOSED|SL|BOT_APP|14.7|0.5989435374149659|-1.901755388|1`
(status, reason, initiator, quantity, average, net PnL, leverage).
This is author-local internal mock evidence awaiting independent review.
It does not prove actual Gate.io SPOT, Binance, FUTURES, PAPER/BACKTEST,
signed-in browser 003A, or production safety. The full `POSITION-CYCLE`
remains OPEN and release remains NO-GO.
