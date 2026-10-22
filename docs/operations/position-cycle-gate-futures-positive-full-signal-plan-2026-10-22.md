# Gate.io FUTURES: dodatnie advanced DCA → TTP w trzech trybach — plan przed próbą

Stan wejściowy: `cb43aaf68af8fb2edb29788905f6fd48e5313d53`. To ograniczony
przypadek P0 w istniejącym `POSITION-CYCLE`; lokalny dowód 008O obejmuje
Gate FUTURES direct ENTRY, 008 obejmuje Gate FUTURES ujemne DCA/TSL z pełnym
sygnałem, a 011 obejmuje Binance FUTURES dodatnie DCA/TTP z pełnym sygnałem.
Żaden z nich nie stanowi odbioru opisanego tu połączenia dla Gate FUTURES.

## Scenariusz i kryteria

- Jedna zapisana strategia, jeden bot na jedną aktywną grupę dla każdego
  trybu, ten sam indeksowany ciąg świec dla BACKTEST, PAPER i wewnętrznego
  Gate.io FUTURES mock LIVE. Zwykłe `MOMENTUM(2) > 0,5` daje LONG na świecy
  2; późniejszy brak wejścia daje HOLD bez EXIT mimo zapisanego
  `noMatchAction=EXIT`.
- Taśma zamknięć: `0,2 → 1 → 1 → 0,99 → 1,24 → 1,13 → 1,13`.
  Świeca 5 ma jawne, uporządkowane ticki `1,25` (+20 s, DCA) i `1,13`
  (zamknięcie, TTP). Przy 1,24 TTP jest uzbrojone, lecz +25% DCA jeszcze
  nie osiągnięto. Potwierdzony fill DCA na 1,25 poprzedza TTP na późniejszym
  ticku tej samej świecy. Po DCA i przed TTP następuje restart procesu.
- Syntetyczne, jawne reguły Gate FUTURES: `contractSize=1`, krok/minimum
  1 kontrakt, minimum notional 5 USDT, krok ceny 0,01; saldo 1000/900 USDT,
  leverage 1, walletRisk 10%, fee 0,0004. ENTRY 100 kontraktów przy 1 za
  100 USDT, DCA +25% ×1 daje 80 kontraktów przy 1,25 za 100 USDT; średnia
  `200/180`. CLOSE 180 przy 1,13 daje notional 203,4, fee łącznie
  `0,16136`, net PnL `+3,23864` USDT. Odrzucenia niewykonalnych reguł
  muszą nastąpić przed kapitałem, dedupe, intentem i submittem.
- BACKTEST ma jeden `COMPLETED` run, raport, trade TTP i dwa wkłady z
  poziomem/mnożnikiem DCA; PAPER i mock LIVE mają trwałe ENTRY/DCA/CLOSE,
  zaś mock LIVE trzy unikalne intenty, zlecenia `FILLED`, fille i jedną
  deduplikację DCA. Ilości, średnia, fee i net PnL wynikają z trwałych filli.
  Retry tego samego ticku i BACKTEST nie tworzy kolejnych rekordów.
- Osobny replay tego samego OHLC bez kolejności ticków ma zachowawczo
  odroczyć TTP do kolejnej świecy. Fixture nie może zaszczepiać stanu
  ochrony ani podawać bezpośredniego ENTRY lub wymuszonego HOLD.

Errata planu przed ponowną próbą: bieżący endpoint zapisu strategii odrzucił
`MOMENTUM(1)` kodem 400, zgodnie z kontraktem okresu `2..255`. Okres 2 daje
LONG na świecy 2 względem świecy 0 i zanikanie wejścia na świecy 3; pozostała
taśma, strategia i kryteria są bez zmian. Nie traktować tego odrzucenia jako
wyniku odbioru trzech trybów.

## Wykonanie i granice

Przygotować jeden celowany opt-in test, korzystając z istniejących seamów
008O/008/011. Uruchomić go wyłącznie na własnej świeżej PostgreSQL
`soar_gate_futures_positive_parity_test` na porcie `127.0.0.1:5585` i
osobnym Redisie `127.0.0.1:6425`; przed startem sprawdzić dostępność.
Sprawdzić typecheck, celowany test, guardrails, docs parity i diff. Po próbie
odczytać licznik migracji oraz User/BacktestRun/Trade i Redis DBSIZE; usunąć
tylko własne kontenery. Zapisać wynik i ograniczenia, zrobić selektywny
commit/push i przekazać exact SHA do niezależnego odbioru.

Metadane kontraktu, saldo, fille i fee są syntetyczne; `contractSize≠1`,
rzeczywiste reguły Gate, transport, real LIVE, uwierzytelniona produkcja i
deploy pozostają poza tym odbiorem. Lokalny PASS nie zamyka pełnego
`POSITION-CYCLE` ani bramki wydania.
