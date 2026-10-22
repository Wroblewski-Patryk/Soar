# 011A/V4-OFFICIAL-WITNESS-JOB: preflight źródła i blokada

**Status:** `BLOCKED` przed uruchomieniem testu runtime. Przegląd kontraktu na
`35407b3a9f8822a358e800a04d30f0c28e9387e8`, tree
`5cc5eca7dbac417eb3d62cc0bc4ab13bab87b515`. Pełne 011A i 011
pozostają `REVIEW`, wydanie `NO-GO`.

## Zamrożony plan i odbiór przed próbą

Zakres jest dokładnie wcześniej wybranym [świadkiem ALICEUSDT](position-parity-011a-functional-witness-selection.md):
Binance USD-M, 2026-10-18 02:41–04:21 UTC, oryginalny
`ALICEUSDT-aggTrades-2026-10-18.zip` oraz odpowiadający mu `.CHECKSUM`,
SHA-256 ZIP `4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b`.
Pierwotny plan wyboru zadeklarował `MOMENTUM(period=1)`.
Późniejszy commit `ab2652da29f2580d5454be4a50584bf400087089` zmienił
`backtest011aMarketWitness.config.ts` na jawne `period=2`, więc nie jest to
niezmieniona deklarowana konfiguracja. Kernel wcześniej efektywnie klamrował
`1` do `2`; [lokalny dowód polityki okresu](strategy-momentum-period-001-plan.md)
porównał decyzje dla starego `1` i jawnego `2` na finalnych świecach oraz
potwierdził zachowanie `[null,null,LONG,null,null]` po migracji strategii na
publicznym źródle ALICEUSDT. To ograniczony dowód równoważności zachowania,
nie ponowny odbiór niniejszego joba. Nie zmieniamy wybranego okna, pary
źródłowej ani obecnych parametrów po wyniku preflight.

Planowany test na własnej PostgreSQL `_test` i Redisie miał najpierw
zweryfikować oryginalny ZIP i checksum z mierzonym budżetem, następnie
pod claim tokenem utrwalić raw/ref/snapshot przed symulacją. Odbiór wymagał
jednego `COMPLETED` runu i raportu, trwałego trade z DCA na agregacie
`a=167049972` przed TTP na `a=167049977` w tej samej minucie,
wkładów ENTRY+DCA, uzgodnionych fee/PnL, offline retry i timeline bez
ponownego fetch lub duplikatów. Źródło ma być *tym samym* źródłem,
które wybrał selektor; brak zgodności formatu jest warunkiem stop przed
testem joba i przed zmianą limitów.

## Wynik preflight: niezgodna tożsamość i semantyka

Selektor zamroził źródło `daily/aggTrades` z basename
`ALICEUSDT-aggTrades-2026-10-18.zip`, CSV z siedmioma polami zaczynającym
się od `agg_trade_id,price,quantity,...`, a tickom nadaje `sequenceId=row.a`.
Świadkowe `a=167049972` i `a=167049977` są ID **agregatów**.

Walidator v4 ma typ `BINANCE_USDM_TRADES_DAILY`. Dla tego samego symbolu/dnia
wymaga basename `ALICEUSDT-trades-2026-10-18.zip`, checksum zawierającego
ten basename, wpisu ZIP `...-trades-....csv` i sześciopolowego nagłówka
`id,price,qty,quote_qty,time,is_buyer_maker`. Tickom nadaje
`sequenceId=id`, czyli ID **surowych transakcji**. Dodatkowo porównuje
`tradeCount` każdej świecy z liczbą surowych wierszy. Nie ma zachowującej
kontrakt konwersji oryginalnego archiwum agregatów na surowe trades.

Przekazanie niezmienionej pary świadka do
`verifyBinanceUsdMRawTradeSource` kończy się deterministycznie
`BACKTEST_RAW_SOURCE_CHECKSUM_INVALID` na porównaniu nazwy z `.CHECKSUM`
**przed** rozpakowaniem ZIP i przed zapisem snapshotu. Podmiana nazwy
w checksum nie byłaby oryginalną zweryfikowaną parą; po takiej podmianie
kontrola nazwy wpisu ZIP odrzuciłaby plik, a schemat CSV i ID nadal
pozostałyby odmienne. Zwiększenie `maxZipBytes`, `maxCsvBytes`, liczby
ticków lub czasu niczego tu nie naprawia. Użycie nowego dziennego
`trades` ZIP zmieniłoby zamrożone źródło i nie dowodziłoby tych samych
agregatowych ID `a`.

Dlatego nie uruchomiono joba, testu na bazie, Docker ani Redisie; nie
utworzono runu, blobu, ref, snapshotu, raportu ani trade w tym etapie.
Nie ma logu runtime, budżetu zmierzonego dla oryginalnego ZIP w adapterze
v4 ani wyniku `COMPLETED` v4 na publicznym świadku. Wcześniejszy lokalny
wynik `COMPLETED` na tym oknie pochodził ze ścieżki `aggTrades` v3 i nie
może zostać przypisany do raw-trade v4.

## Warunek ponownego podjęcia

Potrzebny jest osobno uzgodniony kontrakt wykonawczy, który przyjmie
oryginalne `aggTrades` ZIP + `.CHECKSUM` i zachowa `a` jako tożsamość
ticków, **albo** nowa, uprzednio zamrożona selekcja świadka z raw `trades`
z nowymi kryteriami ID. Dopiero na takim kontrakcie test odbioru ma
sprawdzić ten sam pełny job, trwały rachunek oraz retry offline na własnej
`_test`/Redis. Samo dopuszczenie innej nazwy pliku w v4 byłoby błędnym
połączeniem dwóch formatów i nie spełnia tego testu.
