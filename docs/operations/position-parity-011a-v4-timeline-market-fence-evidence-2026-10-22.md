# 011A/v4: granica żądania adaptera timeline

**Stan:** lokalna poprawka po niezależnym `FAIL` na
`f5aac29cd1529f63fa472faeeaa1dbd14ac0d123`; oczekuje na ponowny
niezależny odbiór. Pełne 011A `REVIEW`, wydanie `NO-GO`.

## Naruszenie i poprawka

Wcześniejszy opt-in adapter po otrzymaniu `rawTradeV4Budget` odczytywał
snapshot Binance USD-M po samym `runId`, symbolu, oknie i poprawnym
digestcie. Nie sprawdzał `exchange`, `marketType`, `timeframe` ani
`maxCandles` z żądania. Żądanie Gate.io SPOT mogło więc otrzymać świece
Binance FUTURES 1m z istniejącego runu. To był błąd kontraktu źródła,
nie dowód zgodności między giełdami.

Na kodowym SHA `9261d9293f852a9b09b60fa2fa5e0290b4ef7759` adapter
przed wywołaniem odczytu v4 wymaga `Exchange.BINANCE`, `FUTURES`, `1m`,
bezpiecznej dodatniej liczby `maxCandles`, pełnego wyrównanego okna
1–120 minut jednej doby UTC oraz liczby świec nie większej od
`maxCandles`. Niezgodność daje `SOURCE_UNAVAILABLE`; nie czyta snapshotu
ani nie próbuje legacy archiwum/REST. Pozytywne żądanie trafia do
offline v4 z tym samym budgetem i oczekiwanym digestem. Domyślna ścieżka
timeline bez jawnego budżetu zachowuje dotychczasowe v1/v2/v3 i REST.

Przegląd wywołań `readVerifiedRawTradeSnapshotV4ForRun`,
`saveVerifiedRawTradeSnapshotV4ForRun` i `rawTradeV4Budget` w
`apps/api/src` oraz `apps/web/src` wykazał tylko ten opt-in adapter i
testy; brak publicznego routingu v4 i call site w produkcyjnym jobie.
Bezpośrednie funkcje repozytorium v4 nie przyjmują kontekstu giełdy z
żądania; odczytują wyłącznie snapshot opisany jako Binance USD-M.

## Dokładny kod i testy

Przed i po teście `git rev-parse HEAD` zwrócił
`9261d9293f852a9b09b60fa2fa5e0290b4ef7759`, tree
`c6fc1cc42975ff563eab15ef7a29159f98e993e6`, a
`git diff --quiet HEAD --` zwrócił `0`. Jedyny obcy nieśledzony katalog
`docs/operations/api-endpoint-docs-parity-2026-10-20/` pozostał nietknięty.
Blob Git adaptera: `364701cdf702cc2488d3604f8bb2d95ebfa62583`;
testu: `a5313a0e53be7ba0b086233114ed4f53d8183af0`.

Na własnej PostgreSQL `_test` `127.0.0.1:62436` i Redis `62439`, bez
zmiany żadnego cudzego środowiska, wykonano:

```powershell
pnpm --filter api run typecheck
pnpm --filter api exec vitest run src/modules/backtests/backtestIntrabarTimelineSource.test.ts src/modules/backtests/backtestBinanceFuturesIntrabarArchive.test.ts src/modules/backtests/backtestBinanceFuturesIntrabarSource.test.ts src/modules/backtests/backtestRawTradeSource.test.ts --reporter=verbose
# Tylko po ustawieniu RUN_011A_RAW_V4_PROOF=1 oraz jawnych lokalnych
# TEST_DATABASE_URL, REDIS_URL, RUN_011A_RAW_ARCHIVE_DIR i RUN_011A_KLINES_DIR:
pnpm --filter api exec vitest run src/modules/backtests/backtestRawTradeSnapshotV4.runtime.test.ts --reporter=verbose
```

Typecheck `PASS`. Jednostkowy zestaw v1–v3/raw: `42 PASS`,
`5` opcjonalnych `SKIP`. Celowane testy odmówiły przed jakimkolwiek
odczytem v4 dla: obcej giełdy, SPOT, innego timeframe, za małego,
zerowego lub ułamkowego `maxCandles`, źle wyrównanej granicy, okna
szerszego niż limit, ponad 120 minut, brakujących granic i przejścia
przez północ. Poprawne Binance USD-M 1m z dokładnym limitem przeszło
bez legacy/REST fallbacku. Opt-in test oficjalnego ETH 2026-10-18
przeszedł `1/1` na exact SHA, czas `49,91 s` (plik `50,90 s`).
Log `%TEMP%/soar-011a-v4-market-fence-exact-9261d929.log` miał SHA-256
`c31600732da7fde225717753ca3c159772510fd1b63719162d73040b234a1cdd`.
Test używał wyłącznie zmierzonych limitów testowych z
[raportu źródła v4](position-parity-011a-v4-raw-trade-offline-evidence-2026-10-22.md).

Po tym uruchomieniu globalnie we własnej bazie: `1` blob, `13`
referencji, `10` snapshotów v4, `0` trades, `0` raportów; Redis
`DBSIZE=0`. Liczniki obejmują wcześniejsze próby i własną fault
injection, więc nie są miarą produkcji ani ukończonego backtestu.

## Granica dowodu

Adapter v4 jest lokalnie obecny i testowany po jawnym opt-in. Nie ma
pełnej integracji joba ani runtime PASS procesu SIGKILL → automatyczne
wznowienie tego samego runu → `COMPLETED` z jednym raportem. Nie ma
zatwierdzonego budżetu, retencji/GC, backupu, deployu ani dowodu
PAPER/LIVE. Produkcyjny writer raw pozostaje wyłączony.
