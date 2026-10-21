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
produkcji lub pełnego 011A. Pełne 011A `REVIEW`, 011 `OPEN`, release `NO-GO`.

## Wynik

Do uzupełnienia po selektywnym commicie planu i wykonaniu próby.
