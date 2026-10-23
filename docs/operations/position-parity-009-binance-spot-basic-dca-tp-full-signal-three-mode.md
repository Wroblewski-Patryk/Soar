# SOAR-POSITION-PARITY-009: Binance SPOT basic DCA/TP full-signal three-mode proof

This opt-in local test uses one saved strategy and one close-price tape for
BACKTEST, PAPER, and an internal Binance SPOT LIVE mock. PAPER and LIVE
load the strategy through active bot topology and use the ordinary
`RuntimeSignalLoop`. BACKTEST uses a snapshot of the same saved strategy
and the same indexed candles. No direct ENTRY or forced no-signal
evaluation is supplied. A second process resumes the two runtime
positions and evaluates the final candles with the ordinary
`RuntimeSignalDecisionEngine`.

The tape is `0.2 → 1 → 1 → 0.99 → 0.625 → 0.60 → 0.48 → 0.65 → 0.65`, then
flat at 0.65 for the 100-candle BACKTEST. A period-1 momentum rule
`MOMENTUM > 0.5` gives one LONG entry at candle 2. Later price
movements do not satisfy it. The saved legacy `noMatchAction=EXIT`
does not close the open position when the entry signal disappears.

The strategy has leverage 1, a basic DCA rule of **-30.5% and multiplier
2 repeated twice**, and basic TP/SL of 20%. The first DCA at 0.625 is
reached from ENTRY 1; after that fill the average is `3 / 4.2` and the
next price 0.60 is below the original ENTRY threshold 0.695 but above
the new-average threshold of about 0.4964, so it must not add. The
second DCA at 0.48 is reached from that new average. Both DCA
fills precede any close. The later price 0.65 exceeds 20% above the
confirmed average `9 / 16.7` and closes once by TP after process
restart. Replaying that tick and retrying the BACKTEST do not add a
second close, trade, report, or contribution.

The synthetic SPOT rules use base-asset quantity step `0.01`, minimum
base quantity `0.01`, minimum quote notional `0.5` USDT, price step
`0.001`, and **no futures `contractSize`**. With initial balance
10 USDT and wallet risk 10%, ENTRY buys 1 base at 1 for 1 USDT.
The first basic DCA targets twice the current 1 USDT quote
contribution: 3.2 base at 0.625 spends 2 USDT. The second basic DCA
targets twice the new 3 USDT book: 12.5 base at 0.48 spends 6 USDT.
Thus the book contributions are exactly `1 → 3 → 9` USDT, with
increments `1 / 2 / 6`. All four LIVE fills obey the base step and
quote minimum. Synthetic confirmed SPOT balance is 10 USDT total and
9 USDT free.

The close sells 16.7 base at 0.65 for 10.855 USDT. At fee rate 0.0004,
PAPER and LIVE fees from the four fills are
`0.0004 + 0.0008 + 0.0024 + 0.004342 = 0.007942` USDT. Their net PnL
is `10.855 - (1 + 2 + 6) - 0.007942 = +1.847058` USDT.
BACKTEST persists fee `0.00794` and net PnL `+1.84706` because its
settlement values are rounded to five decimals. The test checks that
rounding explicitly and compares the three modes within that
precision. It also checks three contribution rows, one BACKTEST
`COMPLETED` run/trade/report, four distinct LIVE
intent/order/fill/trade records, two successful DCA dedupe records,
and record identity after replay/retry.

The venue fill, balance, and symbol-rule seams are synthetic. Every
other private exchange method, public connector creation, public
market-data fetch, and global `fetch` are tripwires. The test uses
its supplied candles, without a real Binance order or feed.

Run from `apps/api` with an own fresh PostgreSQL `_test` database
and Redis. The outer `open` stage launches and verifies the separate
`resume` process. Set a local test-only JWT secret for registration:

```powershell
docker run -d --name soar-positionparity009-pg -e POSTGRES_USER=soar009 -e POSTGRES_PASSWORD=soar009 -e POSTGRES_DB=soar_position_parity_009_test -p 127.0.0.1:5575:5432 postgres:16-alpine
docker run -d --name soar-positionparity009-redis -p 127.0.0.1:6415:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar009:soar009@127.0.0.1:5575/soar_position_parity_009_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar009:soar009@127.0.0.1:5575/postgres'
$env:REDIS_URL = 'redis://127.0.0.1:6415'
$env:JWT_SECRET = 'local-test-only-position-parity-009-secret-64-characters-000000000000'
$env:RUN_BINANCE_SPOT_BASIC_DCA_TP_THREE_MODE_PROOF = '1'
$env:BINANCE_SPOT_BASIC_DCA_TP_THREE_MODE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeBinanceSpotThreeModeBasicDcaTpParity.e2e.test.ts
```

The test requires its exact local database name, nondefault local
PostgreSQL and Redis ports, and an empty user dataset. It cleans its
own user records and Redis state after success. Author-local run:
83 applied migrations; outer stage 1 PASS / 1 SKIP and child resume
1 PASS; final SQL User/BacktestRun/Trade `0/0/0` and Redis `DBSIZE=0`.

This is a local parity proof using synthetic market metadata, balance,
fills, and fees. It does not establish the actual Binance SPOT minimum,
execution, feed delivery, an authenticated production journey, or
release safety. Parent `POSITION-CYCLE` remains OPEN; release NO-GO.
