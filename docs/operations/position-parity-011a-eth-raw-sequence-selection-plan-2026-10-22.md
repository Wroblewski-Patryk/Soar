# 011A: zamrożony selektor raw ETH DCA→TTP

**Stan przed odczytem wyniku:** plan tylko do lokalnego, opt-in testu.
Punkt bazowy kodu `70e5407e27bd7b0ef1aafd466da0e5d9e4c381e8`.
Ten plan nie zmienia ani nie zastępuje wybranego wcześniej świadka
ALICEUSDT `aggTrades`.

## Jedno źródło i stały zakres

Użyj wyłącznie już zweryfikowanej lokalnej kopii oficjalnych
`ETHUSDT-trades-2026-10-18.zip` i oryginalnego `.CHECKSUM` z
`%TEMP%/soar-011a-raw-trades-2026-10-22/` oraz 120 świec 1m z
`%TEMP%/soar-011a-120m-c82a637/ETHUSDT-klines.json`. Godziny
**02:00–04:00 UTC** dnia 2026-10-18. Oczekiwane SHA-256 ZIP
`8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7`,
JSON klines
`9334eb8e2f94a34e8a45c9dfdba6544a0ee7d8f5129b85d2055cd6d19f2acc3f`.
Przed selekcją zweryfikuj oryginalną parę ZIP/checksum, wszystkie 120
świec OHLCV, `tradeCount`, ciągłość minut i uporządkowanie raw ID/czasu.
Nie używaj agregatów, rekonstrukcji OHLC ani ticków syntetycznych.

Budżet **testowy** na jeden strumieniowy odczyt całej doby:
`maxZipBytes=29 176 827`, `maxCsvBytes=178 044 910`,
`maxSelectedTrades=199 234` w oknie, `maxElapsedMs=120 000`.
To są wcześniej zmierzone granice źródła, nie nowe limity produkcyjne.
Walidator czyta ZIP raz dla 120 minut z `collectTicks=true`; selektor
przegląda tylko podokna już zweryfikowanej taśmy. Przy niezgodności
źródła lub limitu zakończ bez wyniku, bez podnoszenia budżetu.

## Stała strategia i kolejność

Użyj bez zmian obecnego `marketSequenceStrategyConfig` z
`apps/api/src/modules/backtests/backtest011aMarketWitness.config.ts`:
LONG, `MOMENTUM(period=2)>-100`, legacy `noMatchAction=EXIT`
(zgodnie z decyzją właściciela zanik wejścia przy otwartej pozycji jest
HOLD), advanced DCA `+0,10%`, jeden poziom, mnożnik wkładu USDT `1`,
advanced TTP z `percent=0,08` i `arm=0,05`, bez TSL. Zmieniamy tylko
symbol z ALICEUSDT na ETHUSDT. Symulator `simulateInterleavedPortfolio`:
FUTURES, leverage `1`, `ISOLATED`, wallet risk `10%`, saldo `1000` USDT,
fee rate `0,0004`, slippage `0`, `analysisStartIndex=2`.

Sprawdź dokładnie **21** okien po 100 minut, w kolejności startu
02:00, 02:01, ..., 02:20 UTC. Pierwsze kończy się 03:40, ostatnie
04:00 UTC. Nie pomijaj okna, nie zmieniaj strategii i nie skanuj
innego dnia albo późniejszego startu po wyniku.

## Jedyny warunek wyboru

Pierwsze kwalifikujące się okno ma zawierać w jednym `tradeSequence`
zdarzenia DCA i późniejszy TTP w **tej samej** świecy 1m. Dla obu
zdarzeń trzeba znaleźć dokładnie po jednym raw ticku o identycznej
cenie i czasie; wieloznaczne dopasowanie odrzuca kandydaturę. Zapisz
konkretne `sequenceId` surowych transakcji, przy czym
`id(TTP)>id(DCA)` i `time(TTP)>time(DCA)`. TTP na modelowym
`closeTime` bez dopasowanego raw ticku jest negatywne. Nie wolno
wnioskować kolejności z high/low ani ze świecy bez ticków.

Selektor wypisuje liczbę obejrzanych okien, wynik każdego i pierwszy
wybrany zakres z ID/czasem/ceną zdarzeń albo `witness:null` po 21.
Gdy nie ma świadka, zapisz wynik negatywny i **zakończ ten etap** bez
zmiany ustawień. Gdy świadek istnieje, uruchom **jeden** opt-in pełny
v4 BACKTEST na wybranym oknie na własnej `_test`/Redis: źródło ma być
utrwalone przed symulacją; sprawdź DCA i TTP względem raw ID,
trwałe wkłady/trades/raport, fee/PnL i timeline oraz offline retry bez
fetch/duplikatów. Jeśli kontrakt joba nie przyjmie wybranego okna,
opisz dokładną odmowę bez rozszerzania zakresu.

To jest funkcjonalny selektor na małym, uprzednio ustalonym zakresie,
nie próba oszacowania częstości strategii. Nie dowodzi PAPER/LIVE,
rzeczywistego fillu, produkcji ani automatycznego wznowienia po
SIGKILL. Pełne 011A `REVIEW`, wydanie `NO-GO`.
