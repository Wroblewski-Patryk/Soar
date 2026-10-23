# SOAR-POSITION-PARITY-008: Gate Futures full-signal three-mode local proof

This opt-in test runs one saved strategy and one indexed close-price tape
through the ordinary signal evaluator in BACKTEST, PAPER, and an internal
Gate.io FUTURES LIVE mock. PAPER and LIVE use active bot topology and
`RuntimeSignalLoop`; the BACKTEST run uses the same saved strategy snapshot
and close prices. No direct ENTRY or forced no-signal decision is supplied.
After process restart, `RuntimeSignalDecisionEngine` and
`processRuntimeFinalCandleDecision` evaluate the last two candles for
both runtime bots.

The tape is `99 → 100 → 100 → 49 → 57 → 25 → 24.99 → 20`, then flat
at 20 for a 100-candle BACKTEST. A period-1 momentum rule gives one LONG
entry at candle 2 and no new entry at later declining prices. The stored
strategy still contains legacy `noMatchAction=EXIT`, but a lost entry
signal leaves the position OPEN. With leverage 1, the advanced DCA trigger
is -70% and the two TSL levels are (-50%, 25%) and (-25%, 12%). TSL arms
and ratchets before the candle at 25 reaches DCA. A funded DCA executes
first on that competing candle; TSL closes once at 24.99 in a second
process. Replay of that tick and a later no-signal candle does not add an
order, signal, trade, or BACKTEST result.

The fixture uses **synthetic Gate unit contracts**: `contractSize=1` BTC
per contract, `TICK_SIZE=1` contract, `minAmount=1` contract, and
`minNotional=5` USDT. The shared starting balance is 1000 USDT with
`walletRisk=10%`, giving 100 USDT for ENTRY and DCA. ENTRY at 100 is
exactly 1 contract; DCA at 25 is exactly 4 contracts. The CLOSE is 5
contracts at 24.99. The fixture validates integer quantities and the
5 USDT minimum at every LIVE submit. The DCA path also validates its
one-contract step, contract size, and minimum before a durable intent.
The mocked exchange balance is 1000 USDT total and 900 USDT free.
Unusable contract sizes or minima have separate refusal coverage in
008P. These synthetic rules do not establish executable rules for a
specific real Gate.io contract.

The three fill notionals are 100, 100, and 124.95 USDT. Fee rate
`0.0004` gives fees `0.04 + 0.04 + 0.04998 = 0.12998` USDT. Average
entry is `(100 + 100) / (1 + 4) = 40` USDT per contract. Net PnL is
`124.95 - 100 - 100 - 0.12998 = -75.17998` USDT. The test checks
PAPER trades, LIVE intents/orders/fills/trades, BACKTEST contribution
rows/trade/report, and their fee/PnL agreement. LIVE has three distinct
identified FILLED orders and one successful DCA dedupe. BACKTEST has
one COMPLETED run, one TSL trade, one ready report, and two contribution
rows. A retry leaves all record IDs and values unchanged.

The venue fill, balance, and symbol rules are synthetic. Other private
exchange methods, public connector creation, all public market-data
fetches, and global `fetch` are tripwires. The test uses its supplied
candles rather than fetching from Gate.io. There is no real credential,
venue order, production runtime, or deployment.

Run from `apps/api` with an own fresh PostgreSQL `_test` database and
Redis. The outer stage launches and verifies the separate resume process.
Set a local test-only JWT secret for the registration endpoint:

```powershell
docker run -d --name soar-positionparity008-pg -e POSTGRES_USER=soar008 -e POSTGRES_PASSWORD=soar008 -e POSTGRES_DB=soar_position_parity_008_test -p 127.0.0.1:5573:5432 postgres:16-alpine
docker run -d --name soar-positionparity008-redis -p 127.0.0.1:6413:6379 redis:7-alpine
$env:TEST_DATABASE_URL = 'postgresql://soar008:soar008@127.0.0.1:5573/soar_position_parity_008_test'
$env:DATABASE_URL = $env:TEST_DATABASE_URL
pnpm exec prisma migrate deploy
$env:DATABASE_URL = 'postgresql://soar008:soar008@127.0.0.1:5573/postgres'
$env:REDIS_URL = 'redis://127.0.0.1:6413'
$env:JWT_SECRET = 'local-test-only-position-parity-008-secret-64-characters-000000000000'
$env:RUN_GATE_FUTURES_FULL_SIGNAL_THREE_MODE_PROOF = '1'
$env:GATE_FUTURES_FULL_SIGNAL_THREE_MODE_STAGE = 'open'
pnpm exec vitest run src/modules/engine/runtimeGateFuturesThreeModeNegativeDcaTslParity.e2e.test.ts
```

The test requires its exact local database name, a nondefault local
PostgreSQL port, a nondefault local Redis port, and an empty user dataset.
It cleans its own user records and Redis state after success. The
author-local run used 83 applied migrations and finished with
`User/BacktestRun/Trade = 0/0/0` and Redis `DBSIZE=0`.

This is a local parity proof for synthetic data and an internal LIVE mock.
It does not prove real Gate.io contract metadata, external feed delivery,
real balance/fill/fees, liquidation behavior, an authenticated production
journey, or release safety. The parent `POSITION-CYCLE` remains OPEN and
release remains NO-GO.
