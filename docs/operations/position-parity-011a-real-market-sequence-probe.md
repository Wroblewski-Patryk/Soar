# 011A: ustalona próba rzeczywistej sekwencji DCA → TTP

## Plan ustalony przed odczytem wyniku

Próba dotyczy wyłącznie publicznej taśmy Binance USD-M `ALICEUSDT` z dnia
2026-10-18, okna 02:27–04:07 UTC (100 zamkniętych świec 1m). Źródłem jest
`https://data.binance.vision/data/futures/um/daily/aggTrades/ALICEUSDT/ALICEUSDT-aggTrades-2026-10-18.zip`
oraz jego `.CHECKSUM`. Wcześniejszy test archiwum odczytał SHA-256 ZIP
`4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`;
nowa próba ponownie sprawdzi sumę i nie przyjmie zmienionego pliku bez jawnego
odnotowania zmiany.

Jedna zapisana strategia ma sygnał LONG `MOMENTUM(1) > -100`, historyczne
`noMatchAction=EXIT` (zanik wejścia nie zamyka pozycji), dźwignię 1 i margin
`ISOLATED`. Ma jeden dodatni poziom advanced DCA `+0,10%` z mnożnikiem
bieżącego wkładu USDT `1`, a advanced TTP uzbraja się przy `+0,08%` z krokiem
trailing `0,05%`. Nie ma TSL ani prostego TP/SL. Saldo początkowe wynosi
1000 USDT, ryzyko portfela 10%, opłata za każdy symulowany fill `0,0004`,
slippage 0. Parametry są celowo małe, aby zbadać chronologię na ograniczonym
publicznym oknie; nie stanowią rekomendowanej strategii ani dowodu zyskowności.

Test ma utworzyć strict BACKTEST run przez zwykłe `createRun`, pobrać i
utrwalić sprawdzony ZIP, digest oraz taśmę, zatrzymać pierwszy proces przed
symulacją i wznowić ten sam run z drugiego PID po wygaśnięciu jego lease w
odizolowanej bazie. Drugi proces nie może pobrać źródła ponownie. Odbiór
pozytywny wymaga w **tym samym runie** co najmniej jednej pary DCA i późniejszego
TTP na tej samej świecy, której `eventTime` i `sequenceId` pochodzą z dwóch
rzeczywistych uporządkowanych agregatów; trwałego wkładu, ilości, średniej,
opłat, PnL, jednego raportu i zgodnego timeline bez duplikatów. Jeśli taśma
nie wytworzy takiej pary przy tych parametrach, wynik jest negatywny; nie
zmieniamy progów po obejrzeniu danych w tej próbie.

Granica: agregaty dokumentują kolejność cen, lecz nie dowodzą rzeczywistych
filli użytkownika ani zachowania PAPER/LIVE lub produkcji. Pełne 011A pozostaje
`REVIEW`, 011 `OPEN`, wydanie `NO-GO`.

## Wynik ustalonej próby

Na publicznym ZIP i `.CHECKSUM` zgodnym z wyżej zapisanym SHA-256, strict run
utrwalił digest taśmy `ba2e8a273032ed1dfa816132e77316429cd7a0f6f67f40cae13b37d6804388a2`.
Pierwszy PID zatrzymano po zapisie snapshotu i digest, przed symulacją. Drugi
PID odzyskał ten sam run z Redis po skróconym lease **wyłącznie własnego runu
testowego**; jego fetch był zablokowany, a taśma pochodziła z PostgreSQL.
Nie ma dowodu naturalnego 10-minutowego lease dla tej konkretnej strategii;
osobny test 011A wcześniej potwierdził to na tej samej publicznej taśmie z
inną strategią.

Wynik warunku tej samej świecy jest **negatywny** przy ustalonych parametrach:
4 trwałe trades, 3 DCA i 3 TTP, lecz 0 par DCA→TTP na tej samej świecy.
Trzy pary w jednym runie to:

| DCA z agregatu | Cena | TTP modelu na późniejszym zamknięciu | Cena |
| --- | ---: | --- | ---: |
| 02:33:33.109 UTC, świeca 4, `a=167049888` | 0,1457 | 02:55:59.999 UTC, świeca 26 | 0,1457 |
| 03:01:00.488 UTC, świeca 32, `a=167050085` | 0,1460 | 03:12:59.999 UTC, świeca 43 | 0,1460 |
| 03:42:25.875 UTC, świeca 73, `a=167050444` | 0,1463 | 03:48:59.999 UTC, świeca 79 | 0,1464 |

Po drugim DCA źródłowa świeca ma jeszcze 8 późniejszych agregatów, ale
ustalony TTP nie zamknął pozycji w tej świecy. Test sprawdza ich istnienie,
trwały wkład DCA równy bieżącemu wkładowi ENTRY (około 100 USDT na parę),
ilość i średnią ważoną, opłatę `0,0004` od notional wejścia i wyjścia z
zaokrągleniem symulatora, PnL każdego zamknięcia oraz raportową sumę
`-0,42076` USDT dla czterech trades. Odczyt timeline po ponowieniu ma te same
zdarzenia. Trzy TTP są zdarzeniami modelu na **zamknięciach późniejszych
świec**, a nie potwierdzonymi źródłowo tickami TTP. Nie stanowią dowodu
rynkowej kolejności DCA→TTP na tej samej świecy.

Najbliższy mały wycinek odbioru to jedna dodatkowa, wcześniej zadeklarowana
100-minutowa próba na sąsiednim oknie `ALICEUSDT` 04:07–05:47 UTC tego samego
dnia, z identycznymi progami i kryteriami. Jeśli również nie ma pary na jednej
świecy, wynik pozostaje negatywny; nie należy stroić progów pod obejrzaną
taśmę ani podnosić pełnego 011A/011 z `REVIEW`/`OPEN`.

Powtórzenie lokalne: na własnej PostgreSQL `soar_011a_archived_process_test`
po 84 migracjach i osobnym Redisie użyć `WORKER_MODE=split`,
`WORKER_BACKTEST_OWNERSHIP=worker`, unikalnej kolejki z prefiksem
`backtest-011a-archived-process-` oraz
`RUN_BACKTEST_REAL_MARKET_SEQUENCE_PROBE=1`. Z `apps/api` uruchomić
`pnpm exec vitest run src/modules/backtests/backtestArchivedProcess.runtime.test.ts -t 'records separate-candle'`.
Cały plik przy dodatkowym `RUN_BACKTEST_ARCHIVED_PROCESS_PROOF=1` przeszedł
4/4 scenariusze procesowe (naturalny 10-minutowy wariant był pominięty);
API typecheck `PASS`. Test po każdym wariancie usuwa wyłącznie swoje rekordy
i klucze kolejki.

## Druga wcześniej zadeklarowana próba: 04:07–05:47 UTC

Na sąsiednim 100-minutowym oknie użyto **tej samej strategii, progów, opłaty
i kryteriów** z planu wyżej. Publiczny dzienny ZIP i `.CHECKSUM` ponownie dały
SHA-256 `4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`.
Digest zapisanego fragmentu taśmy to
`5a5e873d4480e50341e3df3d867297bf76edabb7909e0987fa1bec4c60ff9fc8`.
Pierwszy PID zakończono po zapisie archiwum i digest, przed symulacją; drugi
PID przejął ten sam run z PostgreSQL po skróceniu lease wyłącznie własnego
izolowanego rekordu, bez nowego submitu ani fetch źródła.

Wynik P0 jest **negatywny** również tu: jeden `COMPLETED` run, jeden raport,
jeden trade i trwałe ENTRY+DCA, ale **zero TTP**, więc zero par DCA→późniejszy
TTP na tej samej świecy. DCA o 04:11:02.745 UTC przy 0,1463 odpowiada
rzeczywistemu agregatowi `a=167050730` na źródłowej świecy 4; w tej świecy
było jeszcze 7 późniejszych agregatów. Wkład ENTRY i DCA wynosił po około
100 USDT, trwała ilość `1367,989696093452`, średnia `0,146199931601`.
Pozycja została zamknięta wyłącznie przez regułę `FINAL_CANDLE` o
05:46:59.999 UTC przy 0,1444, z opłatą `0,15902` i net PnL
`-2,62131` USDT zgodnym z raportem i odtworzonym timeline. To zamknięcie
jest decyzją symulatora na końcu zakresu, a nie tickiem TTP ani rzeczywistym
fillem na Binance.

Opt-in `RUN_BACKTEST_ADJACENT_MARKET_SEQUENCE_PROBE=1` uruchamia test
`backtestArchivedProcess.runtime.test.ts -t 'predeclared adjacent'` na własnej
`_test` po 84 migracjach i osobnym Redisie. Pozytywny wynik tego testu oznacza
**prawidłowe wykrycie wyniku negatywnego** na ustalonej taśmie, nie zamknięcie
bramki P0. Do dodatniego odbioru potrzebne będzie inne okno zadeklarowane
przed jego oceną; nie dobierać progów pod obejrzane agregaty. Pełne 011A
`REVIEW`, 011 `OPEN`, wydanie `NO-GO`.
