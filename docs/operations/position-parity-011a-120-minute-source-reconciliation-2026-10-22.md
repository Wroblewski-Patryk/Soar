# 011A: odmowa pełnego okna 120 minut BTCUSDT i ETHUSDT

Zakres: lokalny, odczytowy spis publicznych danych Binance USD-M dla
2026-10-18 02:00–04:00 UTC, na kodowym SHA
`c82a63746ec2ff07656049944b0053fe28def08c`. Nie wykonano zapisu do
bazy, backtestu produkcyjnego, LIVE ani deployu. Pełne 011A pozostaje
`REVIEW`, a wydanie `NO-GO`.

## Źródła i wynik

Pobrano dzienne ZIP `aggTrades` oraz `klines/1m` z
`https://data.binance.vision/data/futures/um/daily/` dla `BTCUSDT` i
`ETHUSDT` z 2026-10-18. Ścieżki to
`aggTrades/<symbol>/<symbol>-aggTrades-2026-10-18.zip` oraz
`klines/<symbol>/1m/<symbol>-1m-2026-10-18.zip`.
SHA-256 każdego ZIP zgadzał się z jego oficjalnym
plikiem `.CHECKSUM`. Odczyt `GET https://fapi.binance.com/fapi/v1/klines`
z `interval=1m`, `startTime=1792288800000`,
`endTime=1792295999999`, `limit=120` dał 120 świec na symbol. Jedenaście
pól liczbowych każdej świecy REST było równe archiwum klines (120/120
na symbol). Porównanie użyło `Decimal` dla ceny i wolumenu; agregaty
przypisano do minut przez `floor(T / 60000) * 60000`, a ich `q` zsumowano
według opublikowanego `transact_time` (`T`).

| Symbol | SHA-256 aggTrades ZIP | SHA-256 klines ZIP | Agregaty w oknie | Niezgodne świece |
| --- | --- | --- | ---: | ---: |
| BTCUSDT | `673b4593a101ecba262b6424fc98ddf332f4e5d3a77ff8b97bc43201f0a4e5a8` | `b2ab88a1e7dde22620a427e6ba745dd98c75ba6448979a7cbe4067df7161d031` | 57 759 | 8/120 |
| ETHUSDT | `b1042326e8a3157497532da615dd744bddf955e4e5a8095b76c0d85fa129f8b8` | `81eb72939fa6716dc23a78cdc0c2470e2b3cdc704c61df66236d2908eda83872` | 49 585 | 8/120 |

W tabeli niżej `ΔV` oznacza sumę `q` agregatów z przypisanym `T` minus
oficjalny wolumen kline. W każdym przypadku różnica dodatnia w pierwszej
minucie jest dokładnie równoważona przez ujemną w następnej. W pięciu
parach nie zgadza się też cena `open` drugiej świecy. `T` ostatniego
agregatu pierwszej minuty wypada 13–53 ms przed granicą, a jego `q`
jest większe niż przeniesiony wolumen.

| Symbol | Minuty UTC | ΔV pierwsza / druga | Open drugiej: kline / aggTrades | Ostatni agregat przed granicą: `q`, `T` względem granicy |
| --- | --- | --- | --- | --- |
| BTCUSDT | 02:03 / 02:04 | +0.003 / −0.003 | 81694.30 / 81694.2 | 0.027, −27 ms |
| BTCUSDT | 02:09 / 02:10 | +0.006 / −0.006 | zgodne | 0.377, −53 ms |
| BTCUSDT | 02:16 / 02:17 | +0.001 / −0.001 | 81630.00 / 81630.1 | 0.003, −13 ms |
| BTCUSDT | 03:54 / 03:55 | +0.008 / −0.008 | zgodne | 0.019, −27 ms |
| ETHUSDT | 02:00 / 02:01 | +0.139 / −0.139 | zgodne | 9.106, −22 ms |
| ETHUSDT | 02:14 / 02:15 | +2.000 / −2.000 | 2407.00 / 2407.01 | 2.041, −45 ms |
| ETHUSDT | 03:03 / 03:04 | +0.147 / −0.147 | 2414.90 / 2414.89 | 0.227, −26 ms |
| ETHUSDT | 03:12 / 03:13 | +0.917 / −0.917 | 2420.80 / 2420.81 | 5.047, −22 ms |

[Dokumentacja Binance USD-M](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/market-data)
opisuje `aggTrades` jako łączenie transakcji o tej samej cenie i stronie
wykonanych w 100 ms. **Wniosek z obserwacji:** agregat tuż przed granicą
może obejmować surowe transakcje należące do obu minut, natomiast
publikuje jedno `T` i jedną sumę `q`. Para różnic wskazuje na taką utratę
rozdzielczości. Bez czasów i ilości poszczególnych surowych transakcji
nie da się udowodnić dokładnego podziału ani kolejności wewnątrz
agregatu. To hipoteza mechanizmu, nie odczyt surowych transakcji.

## Odtworzenie kontraktu kodu

1. Pobrać oba `aggTrades` ZIP i `.CHECKSUM` z powyższego katalogu pod
   nazwami `<symbol>-aggTrades-2026-10-18.zip` i
   `<symbol>-aggTrades-2026-10-18.zip.CHECKSUM` do własnego katalogu.
2. W PowerShell ustawić `RUN_011A_ARCHIVE_CAPACITY_PROOF=1` i
   `RUN_011A_ARCHIVE_DIR` na ten katalog, pozostawić
   `RUN_011A_CAPACITY_DB_PROOF` nieustawione oraz wskazać
   `DATABASE_URL` i `TEST_DATABASE_URL` na różne, lokalne nazwy baz,
   z których druga kończy się `_test`. Test nie wykonuje wtedy zapytania
   do bazy. Uruchomić:

   ```powershell
   pnpm --filter api exec vitest run src/modules/backtests/backtestBinanceFuturesIntrabarArchive.test.ts -t 'replays source-consistent windows' --reporter=dot
   ```

3. Wynik na wskazanym SHA: 1/1 `PASS` (14 pominiętych). Test potwierdza
   `BACKTEST_INTRABAR_SOURCE_OHLC_MISMATCH` dla pełnych 120 minut obu
   symboli, a następnie tylko spójne podokna BTC 02:18–03:48 UTC i ETH
   03:14–04:00 UTC. Pierwsza próba uruchomienia dała `ENOENT` przez
   niezgodne nazwy plików w katalogu tymczasowym; po skopiowaniu ich pod
   nazwami z punktu 1 ten sam test przeszedł. Podokna nie są dowodem
   poprawnego pełnego okna.

## Decyzja dla tego wycinka

Aktualny walidator słusznie odmawia pełnych 120 minut: nie ma snapshotu
ani PnL dla niespójnego OHLCV. Przenoszenie części `q` między świecami,
rozszerzanie tolerancji lub dopasowanie ceny `open` do kline tworzyłoby
nieudowodnioną taśmę. Nie zmieniono kodu ani progów.

Kolejny krok do uzgodnienia w 011A: źródło surowych transakcji z osobnym
czasem i ilością każdego wykonania albo jawnie ograniczone, spójne okna
z `aggTrades`. Jeśli pełne 120 minut dla tych symboli pozostaje wymogiem,
potrzebny jest osobny plan pojemności, pochodzenia i walidacji surowego
źródła oraz test odbioru: 120/120 świec zgodnych z oficjalnym OHLCV,
uporządkowana taśma, jeden trwały run/raport po automatycznym wznowieniu
bez duplikatu. Do tego czasu wynik pełnego okna to `FAIL` źródła,
pełne 011A `REVIEW`, wydanie `NO-GO`.
