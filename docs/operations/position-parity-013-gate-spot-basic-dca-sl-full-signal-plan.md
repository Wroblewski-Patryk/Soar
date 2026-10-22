# SOAR-POSITION-PARITY-013: Gate.io SPOT basic negative DCA to SL, full signal

## Frozen local acceptance plan (before implementation)

Use one saved strategy (`MOMENTUM(2) > 0.5`, LONG, legacy
`noMatchAction=EXIT`, leverage 1, wallet risk 10% of 10 USDT,
basic DCA -30.5% with multiplier 2 repeated twice, basic TP/SL 20%)
and one final-candle tape in BACKTEST, PAPER, and Gate.io SPOT internal
mock LIVE. The closes are `0.2, 1, 1, 0.99, 0.6949, 0.5375, 0.47,
0.47`, then 0.47 through 100 BACKTEST candles. Each candle is flat
OHLC; no intrabar high/low ordering is inferred. The ordinary
`RuntimeSignalLoop` must create exactly one LONG for PAPER and mock
LIVE on candle 2. Entry signal loss on later candles means HOLD,
without an EXIT signal. BACKTEST must evaluate the same saved strategy
snapshot and the same indexed closes.

At candle 4, 0.6949 crosses both the first DCA threshold (0.695)
and the old SL (0.8). A confirmed DCA fill has priority; both runtime
positions remain OPEN. At candle 5, 0.5375 crosses the DCA threshold
recalculated from the confirmed first fill and the then-current SL;
the second confirmed DCA fill again precedes a close. Exactly two
adds must be durable, with no third add. Candle 6 at 0.47 is below
the protection recalculated from the second fill; after a separate
process starts with the same database and Redis, one SL must close
both PAPER and mock LIVE positions. Evaluate no-signal on the final
candles through the ordinary decision engine, not a forced decision.

The synthetic Gate SPOT rules are `quantityStep=0.1` base,
`minQuantity=0.1` base, `minNotional=0.5` USDT,
`priceStep=0.0001`, and `contractSize=null`. Confirmed synthetic
fee rate is 0.0004. ENTRY is 1 base at 1, spending 1 USDT. DCA1
targets 2 USDT at 0.6949, floors to 2.8 base and spends 1.94572.
The second target is twice the **confirmed cumulative contribution**
of 2.94572, hence 5.89144 USDT; at 0.5375 this floors to 10.9
base and spends 5.85875. The durable runtime book is 14.7 base,
8.80447 USDT contribution, average `8.80447/14.7` =
0.598943537414966, and renewed SL 0.479154829931973. Closing
14.7 base at 0.47 returns 6.909 USDT. Four fill fees sum to
0.006285388 USDT; net realized PnL is -1.901755388 USDT.
Assert these from durable PAPER trades and mock LIVE fills, orders,
intents and position state. Reject invalid synthetic SPOT precision,
minimums, and futures contract size before any DCA intent or submit.

BACKTEST does not execute Gate lot-size rounding. Its DCA quote
contributions should be 1, 2, 6 USDT (subject to its documented
settlement precision), so its quantity, average, fee, and net PnL
must be checked against its own persisted contribution rows and
trade/report, **not** asserted equal to rounded PAPER/LIVE values.
Expected ideal close quantity is `1 + 2/0.6949 + 6/0.5375` and
ideal net PnL is approximately -1.937203441 USDT before BACKTEST
settlement rounding. Require one COMPLETED run, one trade, one
ready report, and lifecycle counts ENTRY=1, DCA=2, SL=1, EXIT=0.

Replay the SL tick and retry the completed BACKTEST job. Verify
the exact stored positions, trades, orders, intents, fills,
contributions, run, and report remain unchanged, and the mock venue
sees no second submit. This local test proves process resumption of
PAPER/mock LIVE from persistent state; it does not prove automatic
worker recovery or queue claim for BACKTEST. Those are separately
tracked gates and cannot be inferred from a worker heartbeat or
this direct claimed-job call.

Run only as an opt-in test against a new, empty local `_test`
PostgreSQL database and isolated Redis, both on nondefault loopback
ports. The internal venue fill, balance, and rules are synthetic;
all real exchange and public network seams must be tripwires.
No real Gate.io, production, or LIVE order is authorized. This
test can close only local parity 013; the parent POSITION-CYCLE and
release remain OPEN/NO-GO pending independent review and other gates.

## Author-local result on plan SHA `e40942fc8bd2ae33b14b6c561d5c2813fefd2cfd`

`runtimeGateSpotThreeModeBasicDcaSlParity.e2e.test.ts` passed its
opt-in `open` stage (1 PASS / 1 intentionally skipped). The outer
stage required a separate `resume` PID to pass its filtered test;
failure of that child exits the outer stage nonzero. The test
asserted one natural LONG per runtime bot, no strategy EXIT after
signal loss, two DCA fills before any close, a single SL after
resumption, and unchanged records on repeated ticks and BACKTEST
retry. The mock venue saw four unique submits and no lookup. The
same saved strategy produced one BACKTEST `COMPLETED` run, one trade,
one ready report, and ENTRY/DCA/DCA contribution rows at candle
indices 2/4/5. BACKTEST settlement recorded net PnL `-1.93721`
USDT; PAPER and internal mock LIVE recorded fee `0.006285388` and
net PnL `-1.901755388` USDT, reflecting Gate fixture lot rounding.

Environment: a fresh, dedicated `soar_position_parity_013_test`
PostgreSQL database on loopback port 5579 with 88 migrations and
Redis on loopback port 6419. Final dedicated SQL counts
`User/BacktestRun/Trade/LiveOrderIntent = 0/0/0/0` and Redis
`DBSIZE = 0`. Adjacent DCA policy, USDT contribution and position
protection/TP tests passed `56/56`; API typecheck and docs parity
passed. The first author attempts stopped on floating-point
assertion precision, then on BACKTEST five-decimal settlement
precision; the production paths had already reached those assertions.
The final passing test uses explicit numeric tolerances and pins
the stored BACKTEST value.

Run from `apps/api` with only the named disposable local resources:

```powershell
$env:TEST_DATABASE_URL='postgresql://soar013:soar013@127.0.0.1:5579/soar_position_parity_013_test'
$env:DATABASE_URL='postgresql://soar013:soar013@127.0.0.1:5579/postgres'
$env:REDIS_URL='redis://127.0.0.1:6419'
$env:JWT_SECRET='local-test-only-position-parity-013-secret-64-characters-000000000000'
$env:RUN_GATEIO_SPOT_BASIC_DCA_SL_THREE_MODE_PROOF='1'
$env:GATEIO_SPOT_BASIC_DCA_SL_THREE_MODE_STAGE='open'
pnpm exec vitest run src/modules/engine/runtimeGateSpotThreeModeBasicDcaSlParity.e2e.test.ts --reporter=dot
```

These results are author-local. A second PID here demonstrates
durable resumption and no duplicate for this fixture; it does not
demonstrate a killed worker, automatic supervisor restart, natural
BACKTEST queue recovery, or actual Gate.io execution. Independent
runtime review on the exact code SHA is still required.
