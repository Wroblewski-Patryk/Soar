# 011A: surowe transakcje rozstrzygają granicę minuty, lecz przekraczają limity

Zakres: lokalny odczyt publicznego źródła Binance USD-M, bez zmiany kodu,
bazy, Redis, runtime produkcyjnego i LIVE. Punkt wejściowy: kodowy SHA
`4d8650f03a147f24f35098f13fd463bace5c9760`. Niezależny odbiór
[diagnozy aggTrades i klines](position-parity-011a-120-minute-source-reconciliation-2026-10-22.md)
na tym SHA dał ograniczony `PASS` dokumentacji i źródeł. Obecny etap
sprawdza hipotezę tylko dla ETHUSDT 2026-10-18 02:14/02:15 UTC oraz
pojemność pełnego okna 02:00–04:00 UTC. Pełne 011A pozostaje `REVIEW`,
wydanie `NO-GO`.

## Oficjalne źródło i granica

[Binance Public Data](https://github.com/binance/binance-public-data/blob/master/README.md)
podaje, że dzienne `trades` USD-M zawierają ID, cenę, ilość, kwotę, czas
każdej transakcji i stronę maker. Pobrano jeden plik:

`https://data.binance.vision/data/futures/um/daily/trades/ETHUSDT/ETHUSDT-trades-2026-10-18.zip`

oraz ten sam URL z `.CHECKSUM`. ZIP ma **29 176 827 B**, zawarty CSV
**178 044 910 B**, a SHA-256 ZIP
`8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7`
zgadza się z `.CHECKSUM`. CSV ma nagłówek
`id,price,qty,quote_qty,time,is_buyer_maker`. Odczytano go strumieniowo
bez rozpakowywania na dysk. UTC: `start=1792288800000` (02:00),
`end=1792296000000` (04:00, wyłącznie). Minuta 02:15 zaczyna się
`1792289700000`.

Agregat `a=3121808899` z oficjalnego ZIP `aggTrades` obejmuje surowe ID
`8867044763..8867044766`, ma `p=2407.0`, `q=2.041` i opublikowane
`T=1792289699955` (**45 ms przed 02:15**). Cztery transakcje składowe
pokazują rzeczywisty podział:

| Raw ID | UTC względem 02:15 | Cena | Ilość ETH | Minuta kline |
| ---: | ---: | ---: | ---: | --- |
| 8867044763 | −45 ms | 2407.0 | 0.022 | 02:14 |
| 8867044764 | −37 ms | 2407.0 | 0.019 | 02:14 |
| 8867044765 | +20 ms | 2407.0 | 1.665 | 02:15 |
| 8867044766 | +20 ms | 2407.0 | 0.335 | 02:15 |

`0.022 + 0.019 = 0.041`, `1.665 + 0.335 = 2.000`, suma `2.041`.
Przypisanie całego agregatu według jego jednego `T` zawyża minutę
02:14 o **2.000 ETH** i zaniża 02:15 o **2.000 ETH**. Gubi też pierwszy
raw trade 02:15 po `2407.0`, przez co następny agregat daje pozorny
open `2407.01`; oficjalny kline i surowe transakcje mają open `2407.00`.
To bezpośredni dowód przekroczenia granicy minuty przez ten agregat,
nie tylko korelacja wolumenów.

## Pełne 120 minut i obecne limity

W przedziale 02:00–04:00 UTC surowy CSV ma **199 234 transakcje**,
przypisane według własnego `time` do 120 świec. Ceny OHLC, suma `qty`
liczona przez `Decimal` i liczba transakcji zgadzają się ze wszystkimi
**120/120** oficjalnymi świecami REST; archiwum klines i REST były
wcześniej niezależnie zgodne 120/120 na tym samym zakresie. Dla minut
granicznych:

| Minuta UTC | Raw OHLC | Raw qty | Raw liczba transakcji | Oficjalne kline |
| --- | --- | ---: | ---: | --- |
| 02:14 | 2406.30 / 2407.44 / 2406.25 / 2407.00 | 1156.319 | 2315 | równe |
| 02:15 | 2407.00 / 2407.66 / 2405.75 / 2406.20 | 694.829 | 2166 | równe |

W oknie ID rosną i czasy nie cofają się, lecz między kolejnymi raw ID
jest 1213 luk (największa obejmuje dwa ID). Mimo nich liczba transakcji
i OHLCV zgadzają się co do każdej świecy. Przyszły walidator nie może
uznać samej luki raw ID za dowód brakującej transakcji rynkowej.

Obecny kontrakt `backtestBinanceFuturesIntrabarArchive.ts` i ochrona SQL
przechowują **cały dzienny ZIP** pod runem/symbolem: najwyżej
**16 777 216 B ZIP**, **67 108 864 B CSV** i **80 000 wybranych
rekordów wraz z dwoma brzegowymi**. Ten jeden oficjalny dzień ETHUSDT
przekracza wszystkie trzy limity: ZIP o 12 399 611 B, CSV o
110 936 046 B, a sam fragment 120 minut o co najmniej 119 234
rekordy (przed dodaniem brzegowych). Parser i model snapshotu są ponadto
zbudowane dla `aggTrades`, nie dla pojedynczych `trades`. Podmiana URL
bez projektu pojemności i retencji nie jest bezpieczną poprawką.

## Odtworzenie i decyzja

1. Pobrać podany ZIP i `.CHECKSUM`, porównać SHA-256 oraz odczytać rozmiar
   jedynego wpisu CSV z katalogu ZIP. Nie używać poświadczeń ani API LIVE.
2. Odczytać CSV strumieniowo przez `zipfile.ZipFile.open` + `csv.reader`;
   filtrować `1792288800000 <= int(time) < 1792296000000`, a minutę
   liczyć jako `floor(int(time)/60000)*60000`. Ceny i ilości zliczać przez
   `Decimal`, zachowując kolejność CSV. Porównać OHLCV i trade count z
   `GET /fapi/v1/klines?symbol=ETHUSDT&interval=1m&startTime=1792288800000&endTime=1792295999999&limit=120`.
3. Odfiltrować cztery raw ID z tabeli i porównać z `a=3121808899` w
   oficjalnym `ETHUSDT-aggTrades-2026-10-18.zip`. Oczekiwane:
   `0.041` przed granicą, `2.000` po niej, raw/kline 120/120 zgodne.

Wynik: przyczyna rozbieżności tej pary minut jest potwierdzona, lecz
pełne 120 minut **nie mieści się w obecnych limitach ani retencji**.
Nie zmieniono walidatora, limitów ani modelu. `aggTrades` dla pełnego
okna nadal odmawia `BACKTEST_INTRABAR_SOURCE_OHLC_MISMATCH` bez
domniemanego snapshotu i PnL. Samo lokalne przeliczenie raw 120/120
nie dowodzi trwałego BACKTEST, automatycznego wznowienia ani produkcji.

Decyzja projektowa dla 011A: zatwierdzić budżet i model trwałego
źródła pojedynczych transakcji. Trzeba wybrać między przechowaniem
całego, zweryfikowanego dziennego ZIP a utrwaleniem wycinka z dowodem
pochodzenia, integralności i późniejszego odczytu offline; dla wycinka
sam hash pełnego ZIP nie odtworzy jego treści. Następny test odbioru na
własnej bazie `_test` i Redisie: 120/120 OHLCV **i trade count** z
oficjalnym kline, uporządkowana taśma raw, trwała weryfikacja źródła,
automatyczne wznowienie jednego runu po utracie workera, jeden raport,
trades/PnL bez duplikatu; zmienione albo brakujące źródło kończy `FAILED`
bez częściowego wyniku. Do zatwierdzenia projektu pełne 011A pozostaje
`REVIEW`, wydanie `NO-GO`.
