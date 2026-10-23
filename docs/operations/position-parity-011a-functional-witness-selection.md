# 011A: plan wyboru funkcjonalnego świadka z publicznej taśmy

## Reguła ustalona przed odczytem wyniku

Jest to **celowany test funkcjonalny**, a nie reprezentatywna próba skuteczności
strategii. Źródło: dzienny Binance USD-M `ALICEUSDT` `aggTrades` z 2026-10-18,
ten sam ZIP i `.CHECKSUM` co w dwóch poprzednich próbach. Weryfikujemy opublikowaną
sumę ZIP i oczekiwany SHA-256
`4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`.
Nie zmieniamy parametrów dotychczasowej strategii: LONG `MOMENTUM(1)>-100`,
advanced DCA `+0,10%` (jeden poziom, mnożnik wkładu USDT 1), advanced TTP
uzbrojenie `+0,08%`, trailing `0,05%`, legacy `noMatchAction=EXIT` traktowane
jako HOLD, dźwignia 1, `ISOLATED`, ryzyko 10%, saldo 1000 USDT, fee `0,0004`,
slippage 0.

Deterministyczny selektor w `apps/api/scripts/select011aMarketWitness.ts` ocenia
wszystkie dopuszczalne 100-minutowe okna tego dnia w rosnącym porządku minut:
start 00:01, 00:02, ..., 22:19 UTC (1339 okien). Nie pomija wcześniejszych
negatywnych okien. Dla każdego sprawdza kompletność co najmniej dwóch
agregatów na minutę, ciągłość `a`, rosnący czas i zgodność OHLC/volume
wyprowadzonych z tej samej taśmy; okno niekompletne odrzuca i liczy osobno.
Następnie uruchamia istniejący `simulateInterleavedPortfolio` z 100 świecami
i `analysisStartIndex=2`. Pierwszy kandydat musi mieć w jednym `tradeSequence`
DCA i późniejszy TTP w tej samej świecy. Oba zdarzenia muszą odpowiadać
**różnym** agregatom źródłowym o zgodnej cenie/czasie, z `a(TTP)>a(DCA)`.
TTP na modelowym `closeTime` bez dokładnie dopasowanego agregatu nie przechodzi.
Selektor kończy się na pierwszym takim oknie lub po 1339 oknach; wypisuje
liczbę ocenionych, odrzuconych i wybrany zakres wraz z ID/czasami. Wybór jest
warunkowy na tym jednym dniu i jednej konfiguracji, więc nie wolno z niego
wnioskować częstości zdarzenia ani rentowności.

Po wyborze wykonujemy **jeden** strict BACKTEST `createRun` na wybranym oknie:
publiczny ZIP i `.CHECKSUM`, zapis archiwum/digest w PostgreSQL, zabicie PID
przed symulacją, wznowienie przez drugi PID bez pobrania źródła, jeden run i
raport, brak duplikatów kolejki/trades, wkłady ENTRY+DCA, średnia, fee, PnL i
zgodny timeline. Wznowienie po skróceniu lease wyłącznie własnego runu testowego
jest dowodem lokalnym; naturalny lease ma osobny istniejący dowód. Gdy strict
run nie potwierdzi obu źródłowych ticków, wynik pozostaje negatywny i selektor
nie szuka następnego okna po ujawnieniu wyniku integracji.

Granice pozostają: agregat to cena, nie fill użytkownika; brak dowodu PAPER/LIVE,
produkcji lub pełnego 011A. Pełne 011A `REVIEW`, 011 `REVIEW`, release `NO-GO`.

## Wynik lokalny na uprzednio zapisanym planie

Plan i selektor zapisano oraz wypchnięto **przed** skanem w commicie
`5a85cb5d82751efb40c82ad712b3b9471b7d2094` (`api` typecheck PASS).
Skan `pnpm exec tsx scripts/select011aMarketWitness.ts` z `apps/api` sprawdził
opublikowany `.CHECKSUM` i SHA-256 ZIP
`4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`.
CSV zawierał 13 278 agregatów; niezależne publiczne 1m klines zgadzały się z
wyprowadzonymi OHLC/volume. Pierwszy kwalifikujący się zakres to
**02:41–04:21 UTC**. W porządku planu obejrzano **161** okien: **146** miało
przynajmniej jedną minutę z mniej niż dwoma agregatami, a **15** pełnych
oceniono silnikiem. Nie oglądano późniejszych 1178 okien i nie zmieniono
parametrów po wyniku.

Selektor wskazał DCA 02:46:47.639 UTC przy 0,1454 z `a=167049972` i
późniejszy TTP 02:46:57.282 UTC przy 0,1454 z `a=167049977`. Oba agregaty są
jednoznaczne w tej samej źródłowej świecy 02:46–02:47 UTC. TTP nie ma czasu
modelowego close świecy 02:46:59.999 UTC.

Opt-in `RUN_BACKTEST_FUNCTIONAL_MARKET_WITNESS_PROOF=1` w
`backtestArchivedProcess.runtime.test.ts` wykonał strict `createRun` dla tego
zakresu na własnej PostgreSQL `_test` (84 migracje) i osobnym Redisie. PID A
zapisał zweryfikowane archiwum i digest
`506d8d6a1032cc955e5cf6b4232120aadb918217bb7107af8f8061e6609ec2a8`
przed symulacją i został zabity. Po skróceniu lease wyłącznie własnego runu
testowego PID B odzyskał **ten sam** run offline, bez ponownego pobrania ZIP lub
`.CHECKSUM` i bez nowego submitu. Status `COMPLETED`, jeden raport, pięć
trades, cztery DCA, cztery TTP, z których wybrana para odpowiada powyższym
dwóm ID źródłowym. Kolejka i dedupe były puste po ACK.

Dla trade z parą tej samej świecy trwałe ENTRY i DCA wyniosły po około
100 USDT, ilość `1376,463143376176`, średnia `0,145299931177`, fee
`0,16006` USDT i net PnL `-0,02232` USDT. Cały raport ma net PnL
`-0,16687` USDT, zgodny z sumą pięciu trades; powtórny odczyt timeline
odtworzył te same zdarzenia. Te kwoty są modelem BACKTEST, nie rzeczywistymi
fillami Binance ani dowodem zyskowności. Wynik nie podnosi pełnego 011A ponad
`REVIEW`, 011 pozostaje `REVIEW`, a wydanie `NO-GO`.

Powtórzenie: w `apps/api` z własną PostgreSQL `soar_011a_archived_process_test`
po 84 migracjach, osobnym Redisie i unikalnym prefiksem kolejki
`backtest-011a-archived-process-`, ustawić `WORKER_MODE=split`,
`WORKER_BACKTEST_OWNERSHIP=worker`,
`RUN_BACKTEST_FUNCTIONAL_MARKET_WITNESS_PROOF=1` i wykonać
`pnpm exec vitest run src/modules/backtests/backtestArchivedProcess.runtime.test.ts -t 'source-tick DCA' --reporter=dot`.
Wynik lokalny 1/1 PASS. Cały plik przy włączonych również wcześniejszych
wariantach archiwum i obu negatywnych prób: 6 PASS, 1 SKIP (naturalny lease).
API typecheck, docs parity, repo guardrails i graph drift 936/936 PASS.
Po selektywnym cleanup własne SQL migracje/User/Strategy/Run/Archive/Trade/
Report/Contribution `84/0/0/0/0/0/0/0`, Redis `DBSIZE=0`. Nie wykonano
manualnego UI, PAPER/LIVE ani produkcyjnego testu.
