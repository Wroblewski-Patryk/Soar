# SOAR-POSITION-PARITY-011: Binance FUTURES advanced positive DCA/TTP three-mode proof

This opt-in local test loads one saved strategy through active PAPER and internal
mock LIVE bot topology and runs the ordinary final-candle signal loop. BACKTEST
uses a snapshot of the same strategy, the same final-candle closes and an
explicitly ordered two-tick path on the competing candle. No direct
ENTRY or forced no-signal result is supplied. A second process resumes both
runtime positions and checks the final no-signal candles through the ordinary
`RuntimeSignalDecisionEngine`.

The close tape is `0.2 → 1 → 1 → 0.99 → 1.24 → 1.13 → 1.13`,
then flat at 1.13 for the 100-candle BACKTEST. Candle 5 opens/highs at
1.25 and closes/lows at 1.13; its explicit price events are 1.25 at +20 s
and 1.13 at its close. Period-1 `MOMENTUM > 0.5`
produces one LONG at candle 2; loss of that entry signal leaves the open
position on HOLD despite stored legacy `noMatchAction=EXIT`. The saved strategy
has one explicit advanced profit-side DCA level at +25% with multiplier 1,
and advanced TTP with a 20% arm and 10% trailing step. At 1.24, TTP is armed
while the +25% DCA is still pending. The first tick at 1.25 fills DCA and
leaves both runtime positions OPEN. The confirmed fill rebases protection to
1.14. After process restart, the later 1.13 tick of the same candle crosses
that protection and closes each position once by TTP.

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

## Owner decision and intrabar evidence boundary

The owner decided on 2026-10-21 that, after a **confirmed** positive DCA fill,
a later tick in the same candle may trigger TTP against protection recalculated
from the fill. The replay now uses a verified chronological `intrabarTicks`
path when one is provided. On candle 5 it persists DCA and TTP in that order,
with the TTP close at the later 1.13 event. The runtime fixture submits the
same two ticker prices in that order to PAPER and internal mock LIVE, with a
process restart between them. No trailing state is seeded.

An OHLC kline alone does not establish whether its high or low happened
first. The production BACKTEST data gateway currently supplies only OHLC;
it does not supply historical tick or lower-interval ordering. The replay
therefore retains the DCA-first same-candle block when `intrabarTicks` is
absent. A second persisted BACKTEST run with the identical OHLC and strategy
but without tick order records DCA on candle 5 and TTP on candle 6. If a tick
path is supplied, it must have strictly increasing times inside the candle,
matching open/close and exact extrema; invalid paths fail closed. The ordered
path in this local proof is a declared synthetic fixture, not historical
Binance market data. Independent static review and process QA passed on exact
code SHA `cd803c38faed825c13e4c7887b415cf13f13475c` for this ordered
synthetic path. Ticket 011 stays `REVIEW`: the historical gateway remains
OHLC-only, and a source-backed production intrabar ordering policy is `P0 OPEN`.
Parent `POSITION-CYCLE` is `OPEN`; release remains `NO-GO`.

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

Author-local chronology run: 83 applied migrations; outer stage 1 PASS / 1 SKIP and
the separate resume process 1 PASS. After cleanup, SQL
`User/BacktestRun/Trade=0/0/0`, Redis `DBSIZE=0`. Independent static review
on code SHA `cd803c38faed825c13e4c7887b415cf13f13475c` passed for
confirmed DCA before the later same-candle TTP, protection rebase, and
OHLC-only deferral. Independent runtime QA on that SHA used its own fresh
`_test` database after 83 migrations and Redis; distinct `open` and `resume`
processes each passed 1/1. The ordered synthetic BACKTEST, PAPER, and internal
mock LIVE runs agreed on fee `0.16136` and net PnL `+3.23864` USDT from
persisted fills, with no retry duplicates. The identical OHLC without tick
order deferred TTP to candle 6. This is local proof using synthetic venue
metadata, balance, fills and fees. It does not establish actual Binance
FUTURES execution, authenticated production behavior or release safety.
Parent `POSITION-CYCLE` remains `OPEN`; release `NO-GO`.

## Celowany publiczny świadek źródła w trzech trybach

[Plan i wynik 011](position-parity-011-real-source-three-mode-plan.md) zapisano
przed próbą w SHA `fe008242e2adce4d2508081b769f175a5ae6be3e`. Na
kodowym SHA `5b49dbfe4f60b5985ba4add453487d81b49a843d` niezależny
statyczny review i runtime QA dały dwa ograniczone `PASS` dla tej samej
zapisanej strategii i zweryfikowanego publicznego ZIP + `.CHECKSUM` ALICEUSDT
02:41–04:21 UTC. W BACKTEST, PAPER i Binance FUTURES internal mock LIVE DCA
na źródłowym `a=167049972` poprzedził uzbrojenie TTP na `a=167049975` i
zamknięcie na późniejszym `a=167049977` tej samej świecy. Niezależny QA na
własnej bazie `_test` i Redisie uzyskał `open` 1/1 i odrębny PID `resume` 1/1;
trwałe fille/intenty, raport BACKTEST, timeline i DCA dedupe pozostały bez
duplikatów. Różnica net PnL pierwszego cyklu BACKTEST wobec PAPER/mock LIVE
wyniosła `0,00000595041389956` USDT z jawnych zaokrągleń ilości i opłaty.

Evaluator dawał LONG na świecach 2–4, więc ta taśma **nie odebrała HOLD po
zaniku sygnału wejścia**. `resume` uruchomił nowy PID bez zabicia pierwszego;
nie dowodzi odzyskania PAPER/mock LIVE po awarii. Run BACKTEST zapisano
bezpośrednio w test DB, a job wykonano bez kolejki. Reguły ilości/ceny i
fille internal mock LIVE są syntetyczne, bez dowodu prawdziwych filli Binance,
LIVE lub produkcji. Pełne 011 i 011A pozostają `REVIEW`, `POSITION-CYCLE`
`OPEN`, wydanie `NO-GO`.

## Wariant źródłowy po faktycznym zaniku sygnału

[Poprawiony plan](position-parity-011-effective-momentum-signal-loss-plan.md)
zapisano przed próbą w SHA `8537eddee2653e7a0cbb8aa4424f9e9c682b66a9`.
Na kodowym SHA `81ffb2fb24a32858a6dc1540c5c033527a762efd` niezależny
statyczny review i runtime QA dały ograniczony `PASS` dla lokalnego
source-backed BACKTEST, PAPER i Binance FUTURES internal mock LIVE. Efektywny
`MOMENTUM(2)` dał na świecach 0–4 decyzje `[null,null,LONG,null,null]`:
po wejściu na 2 sygnał zniknął, a pozycje pozostały OPEN bez EXIT. Na tej
samej publicznej taśmie DCA `a=167049972` poprzedził uzbrojenie TTP
`a=167049975` i późniejszy TTP `a=167049977` na jednej świecy. Niezależny
QA na własnej `_test` i Redisie uzyskał `open` 1/1 oraz osobny PID `resume`
1/1, z trwałymi fillami, intentami i DCA dedupe bez duplikatów. BACKTEST
miał sześć trades i raport net PnL `+0,01386` USDT, lecz asercje nowego
wariantu nie przypinają jeszcze tych dwóch wartości. Net PnL pierwszego
cyklu to `-0,02232` USDT w BACKTEST wobec `-0,02231404958610045` USDT
w PAPER/mock LIVE; różnica wynika z jawnej syntetycznej precyzji.

`resume` to nowy PID bez `SIGKILL` pierwszego, więc nie dowodzi odzyskania
PAPER/mock LIVE po awarii. Run BACKTEST zapisano bezpośrednio w test DB i job
wykonano bez kolejki. Reguły oraz fille internal mock LIVE są syntetyczne;
rzeczywiste Binance i produkcja pozostają bez dowodu. Oddzielna rozbieżność
zapisanego `MOMENTUM(period=1)` i efektywnego okresu 2 ma ticket
`SOAR-STRATEGY-MOMENTUM-PERIOD-001` w tablicy; ten wariant jej nie naprawia.
Pełne 011 i 011A `REVIEW`, `POSITION-CYCLE` `OPEN`, release `NO-GO`.
