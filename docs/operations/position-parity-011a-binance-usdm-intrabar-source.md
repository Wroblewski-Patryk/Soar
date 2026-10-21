# SOAR-POSITION-PARITY-011A: uporządkowane zdarzenia intrabar Binance USD-M

Stan: **lokalny, częściowy dowód źródła; REVIEW; 011 i wydanie nadal NO-GO**. Zakres tej poprawki to BACKTEST Binance FUTURES z jawnym, krótkim zakresem 1m. Nie jest to dowód rzeczywistego LIVE ani historycznej dostępności bez ograniczenia czasu.

## Źródło i granice

- Oficjalny [Binance USD-M `GET /fapi/v1/aggTrades`](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data#compressed-aggregate-trades-list) udostępnia uporządkowane agregaty z identyfikatorem `a`, ceną `p`, ilością `q`, zakresem ID transakcji `f..l` i czasem `T`. Agregat łączy transakcje tej samej ceny i strony w krótkim oknie. Endpoint publiczny obejmuje tylko ostatnie 48 godzin; limit strony wynosi 1000. Porządek agregatów o tym samym `T` wyznacza `a`, nie sam znacznik czasu.
- [Oficjalne archiwum Binance Public Data](https://github.com/binance/binance-public-data/blob/master/README.md) publikuje dzienne i miesięczne pliki `aggTrades` oraz surowe `trades` z sumami kontrolnymi. Czytnik archiwum i trwała taśma per przebieg nie są częścią 011A. Po upływie 48 godzin ponowne pobranie taśmy z REST i timeline mogą się nie udać.
- Źródło jest ścieżką cen transakcyjnych, nie order bookiem ani rzeczywistym fillem użytkownika. Ta sama cena i strona w pojedynczym agregacie nie zmienia kolejności przekroczenia poziomów DCA/TTP. Brak pełnych surowych ticków w agregacie pozostaje jawną granicą modelu.

## Kontrakt lokalny

`seedConfig.intrabarSource = "BINANCE_USDM_AGGTRADES_REQUIRED"` jawnie włącza źródło. Wymaga Binance FUTURES, 1m, podanych `startAt` i `endAt` na granicach minut oraz dokładnie 1–120 świec (maksymalnie 2 godziny) w ostatnich 48 godzinach. `endAt` jest wyłączną granicą. Odczyt ma limit 20 stron po 1000 agregatów i 10 s na żądanie; brak strony, limit, błąd HTTP, luka w `a`, cofnięcie czasu/ID transakcji lub rozbieżność open/high/low/close/volume ze świecą kończą przebieg błędem. Luki w **surowych** ID `f..l` są dozwolone: rzeczywisty publiczny endpoint je zwraca, mimo ciągłości `a` i zgodności całej świecy z kline. Każda świeca dostaje zakres ID i SHA-256 zawartości; przebieg zapisuje skrót taśmy per symbol w `seedConfig` i odrzuca późniejszy retry ze zmienionym skrótem. Zwykły BACKTEST OHLC zachowuje dotychczasową politykę i nie deklaruje znanej kolejności high/low.

Wymagane źródło nie może zdegradować się do OHLC. Gdy choć jeden symbol nie ma zweryfikowanej taśmy, cały przebieg kończy się `FAILED`, bez symulacji częściowego portfela, bez PnL i z `reportReady=false`. Wznowienie wymaga ponownego udostępnienia tych samych danych i niezależnie istniejącego mechanizmu wyłącznego claimu; ten test źródła nie dowodzi restartu całej kolejki ani pracy produkcyjnego workera. Nie należy traktować samego heartbeat workera jako dowodu ukończenia.

## Odtworzenie i obecny dowód

```powershell
pnpm --filter api run typecheck
pnpm --filter api exec vitest run src/modules/backtests/backtestBinanceFuturesIntrabarSource.test.ts src/modules/backtests/backtestDataGateway.test.ts src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestDcaUsdtContribution.test.ts --reporter=dot
```

Na lokalnym kodzie 011A: typecheck PASS; 4 pliki / 47 testów PASS. Fixture sprawdza kolejność dwóch różnych cen o tym samym `T`, paginację od następnego `a`, identyczny skrót po ponowieniu, luki/zmianę kolejności, brak objętości i brak źródła. Job odrzuca zmieniony skrót po retry bez publikowania PnL. Replay 011 z taśmy źródła zachowuje potwierdzone DCA→późniejszy TTP tej samej świecy, fee `0,16136` i net PnL `+3,23864` USDT na syntetycznej strategii. To nie jest osobny, pełny trzytrybowy test procesu 011.

Mały odczyt **publicznego**, zamkniętego rynku BTCUSDT 2026-10-21 10:29 UTC (jedna świeca 1m, bez klucza i zapisów): 418 agregatów, `a=3491976945..3491977362`, OHLC i volume `37,768` zgodne z kline, SHA-256 `283ff0814397a20187da40c3c1dc7e6c86946f58776290e16d2817d34bc9331a`. Publiczna taśma nie dowodzi filli, salda, PAPER/LIVE ani trwałości po 48 h.

## Brakujący odbiór

Potrzebny jest trwały, zweryfikowany odczyt archiwum surowych `trades` albo `aggTrades` dla starszych okien, ze sprawdzeniem sumy kontrolnej, pokrycia granic i powtarzalnego odtworzenia po restarcie. Następnie trzeba wykonać 011 na rzeczywistym oknie zawierającym konkurencję DCA→TTP oraz niezależny test procesu na własnej bazie i Redisie: przerwanie i automatyczny resume bez podwójnego trade/raportu. Dopiero te dowody mogą przesunąć 011A i 011 z REVIEW; sam obecny czytnik tego nie zamyka.
