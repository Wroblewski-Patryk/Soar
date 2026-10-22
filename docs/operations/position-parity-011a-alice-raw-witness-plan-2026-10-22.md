# 011A: zamrożony plan raw trades ALICE w oknie 02:41–04:21

**Stan przed parsowaniem raw CSV i przed symulacją:** plan testu opt-in.
Punkt bazowy kodu `6771178c32b10990767c071b7110cc274c452ece`.
Wcześniej wybrany świadek ALICE używał `aggTrades`; jego ID
`a=167049972` i `a=167049977` nie są ID surowych transakcji w tym
planie. Nie przepisujemy ani nie interpretujemy ich jako raw IDs.

## Jedyna para źródłowa i zmierzone granice

Oficjalny dzienny Binance USD-M
[`ALICEUSDT-trades-2026-10-18.zip`](https://data.binance.vision/data/futures/um/daily/trades/ALICEUSDT/ALICEUSDT-trades-2026-10-18.zip)
z oryginalnym
[`zip.CHECKSUM`](https://data.binance.vision/data/futures/um/daily/trades/ALICEUSDT/ALICEUSDT-trades-2026-10-18.zip.CHECKSUM).
Lokalne kopie są w `%TEMP%/soar-011a-alice-raw-20261022/`.
Przed parsowaniem CSV potwierdzono HTTP 200, ZIP `399 792 B`,
`.CHECKSUM` `98 B` i identyczny SHA-256 ZIP oraz sumy opublikowanej:
`c90445e1b22111d993aef687d4bbea29bdb11de60c28e0219f035166a5486502`.
Central directory wskazuje jeden wpis
`ALICEUSDT-trades-2026-10-18.csv` o `1 694 239 B`.

Oficjalne Binance USD-M `/fapi/v1/klines` dla `ALICEUSDT`, `1m`,
2026-10-18 **02:41–04:21 UTC** zwróciło 100 kolejnych wierszy,
od openTime `1792291260000` do `1792297200000`, z sumą
`tradeCount=1 730`. Nie analizowano jeszcze ścieżki cen ani sygnałów.
Lokalny niezmieniony JSON ma SHA-256
`4738f1e447658e153413b01b32c07ad6f5d1791993e83404e611631caa698133`.
To jest **jedyne** okno 100 minut. Nie sprawdzaj innego startu/dnia/symbolu
po wyniku.

Testowy budżet jednego parsera raw jest równy zmierzonym rozmiarom
i count w tym oknie: `maxZipBytes=399 792`,
`maxCsvBytes=1 694 239`, `maxSelectedTrades=1 730`,
`maxElapsedMs=30 000`. Czas jest jawnie ograniczonym pułapem próby;
rzeczywisty czas ma być zmierzony przy weryfikacji. Budżet nie jest
limitem produkcyjnym i nie będzie zwiększany po niepowodzeniu.
Walidator ma sprawdzić oryginalną parę ZIP/checksum, cały dzienny porządek
raw ID/czasu i 100/100 OHLCV oraz `tradeCount` wobec osobnych klines.
Brak pliku, limit, luka lub rozbieżność kończy etap bez wyniku joba.

## Stała strategia i warunek świadka

Użyj istniejącego `marketSequenceStrategyConfig` z
`backtest011aMarketWitness.config.ts`: LONG,
`MOMENTUM(period=2)>-100`, legacy `noMatchAction=EXIT` z obecną
semantyką HOLD przy zaniku wejścia w otwartej pozycji, advanced DCA
`+0,10%` raz z mnożnikiem wkładu USDT `1`, advanced TTP
`percent=0,08`, `arm=0,05`, bez TSL. FUTURES, leverage `1`,
`ISOLATED`, wallet risk `10%`, saldo `1000` USDT, fee rate
`0,0004`, slippage `0`, `analysisStartIndex=2`.
Nie zmieniaj konfiguracji po odczycie raw wyniku.

Przyjmij wynik pozytywny tylko gdy DCA i późniejszy TTP dotyczą
jednego `tradeSequence` w **tej samej** świecy 1m. Każde zdarzenie musi
jednoznacznie odpowiadać jednemu raw tickowi o identycznym czasie i cenie;
ticki mają różne ID z `rawId(TTP)>rawId(DCA)` i rosnącym czasem.
Wieloznaczne dopasowanie albo modelowy `closeTime` bez raw ticku nie
kwalifikuje się. Nie wolno wnioskować z samego OHLC.

Jeśli nie ma takiej pary, zapisz negatywny wynik i zatrzymaj etap bez
zmiany źródła, progu lub okna. Jeśli jest, uruchom **jeden** pełny opt-in
v4 `createClaimedBacktestRunJob` na własnej `_test`/Redis: zapisz
zweryfikowany blob/ref/snapshot przed symulacją, uzgodnij trwałe
wkłady/trades/fee/PnL/raport z tymi dwoma raw ID, następnie odczytaj
timeline i retry offline bez fetch oraz duplikatów. Gdy job odmówi,
zapisz dokładny błąd bez rozszerzania zakresu.

To nie jest dowód wcześniejszego świadka `aggTrades`, PAPER/LIVE,
realnych filli, produkcji ani automatycznego przejęcia po SIGKILL.
Pełne 011A `REVIEW`, wydanie `NO-GO`.
