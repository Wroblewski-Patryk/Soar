# SOAR-POSITION-PARITY-011: Binance FUTURES advanced positive DCA/TTP three-mode proof

This opt-in local test loads one saved strategy through active PAPER and internal
mock LIVE bot topology and runs the ordinary final-candle signal loop. BACKTEST
uses a snapshot of the same strategy and the same close-price tape. No direct
ENTRY or forced no-signal result is supplied. A second process resumes both
runtime positions and checks the final no-signal candles through the ordinary
`RuntimeSignalDecisionEngine`.

The tape is `0.2 → 1 → 1 → 0.99 → 1.24 → 1.25 → 1.25 → 1.13 → 1.13`,
then flat at 1.13 for the 100-candle BACKTEST. Period-1 `MOMENTUM > 0.5`
produces one LONG at candle 2; loss of that entry signal leaves the open
position on HOLD despite stored legacy `noMatchAction=EXIT`. The saved strategy
has one explicit advanced profit-side DCA level at +25% with multiplier 1,
and advanced TTP with a 20% arm and 10% trailing step. At 1.24, TTP is armed
while the +25% DCA is still pending. At 1.25, that DCA fills first and both
runtime positions stay OPEN without a CLOSE. The confirmed fill rebases the
armed protection. At 1.25 on the next candle, it ratchets; after process
restart the price 1.13 crosses protection and closes once by TTP.

The synthetic Binance FUTURES fixture uses `contractSize=1`, base quantity
step and minimum `0.01`, minimum notional `5` USDT, and price step `0.01`.
These are test assumptions, not current exchange metadata. Synthetic balance
is 1000 USDT total and 900 free; wallet risk is 10%, leverage 1. ENTRY is
100 base at 1 for 100 USDT notional and margin. Advanced DCA targets the
current confirmed 100 USDT book once: 80 base at 1.25 for another 100 USDT.
The resulting position is 180 base with average `200 / 180` USDT. A TTP
close at 1.13 returns 203.4 USDT notional. At fee rate 0.0004, three fills
cost `0.04 + 0.04 + 0.08136 = 0.16136` USDT, so net PnL is
`203.4 - 200 - 0.16136 = +3.23864` USDT. The test checks persisted
BACKTEST contribution level 0 and multiplier 1, fee/PnL, PAPER trades, and
three unique LIVE intents, FILLED orders, fills, trades, and one DCA dedupe.
Replay and BACKTEST retry preserve record identity.

Four impossible synthetic futures-rule variants are rejected before capital
lookup, DCA dedupe, order intent, or venue submit: missing `contractSize`,
missing minimum notional, a base step larger than the proposed quantity, and
an impossible base minimum. The live mock verifies the executable base and
price steps plus the notional minimum for every submitted order. Public and
private exchange transport, market-data fetch, and global `fetch` are
tripwires; the test never submits a real order.

The test also contains a **separate adversarial policy probe** at the DCA
price 1.25. It seeds a 40% TTP high and a 10% step into a copy of the armed
state: without DCA that state closes by TTP, while with the pending +25%
advanced DCA it adds first and does not close. This seeded high is not
produced by the stable close-price tape. Therefore the natural three-mode
cycle proves armed TTP, confirmed DCA, protection rebase and a later TTP;
the same-tick crossed-TTP priority is proved only by this synthetic policy
probe, not by an organic three-mode exchange event.

Run from `apps/api` on an own fresh PostgreSQL `_test` database and Redis.
The outer `open` stage launches and verifies a distinct `resume` process:

```powershell
docker run -d --name soar-positionparity011-pg -e POSTGRES_USER=soar011 -e POSTGRES_PASSWORD=soar011 -e POSTGRES_DB=soar_position_parity_011_test -p 127.0.0.1:5577:5432 postgres:16-alpine
docker run -d --name soar-positionparity011-redis -p 127.0.0.1:6417:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar011:soar011@127.0.0.1:5577/soar_position_parity_011_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar011:soar011@127.0.0.1:5577/postgres'
$env:REDIS_URL = 'redis://127.0.0.1:6417'
$env:JWT_SECRET = 'local-test-only-position-parity-011-secret-64-characters-000000000000'
$env:RUN_BINANCE_FUTURES_POSITIVE_DCA_TTP_THREE_MODE_PROOF = '1'
$env:BINANCE_FUTURES_POSITIVE_DCA_TTP_THREE_MODE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeBinanceFuturesThreeModePositiveDcaTtpParity.e2e.test.ts
```

Author-local run: 83 applied migrations; outer stage 1 PASS / 1 SKIP and
the separate resume process 1 PASS. After cleanup, SQL
`User/BacktestRun/Trade=0/0/0`, Redis `DBSIZE=0`. This is local proof using
synthetic venue metadata, balance, fills and fees. It does not establish
actual Binance FUTURES execution, authenticated production behavior or
release safety. Parent `POSITION-CYCLE` remains OPEN; release NO-GO.
