# 011A: plan procesowego odzyskania ALICE raw v4 po naturalnym lease

**Plan przed kodem i przed testem.** Baza kodu
`3a40e716d2e559a09796d9e40e7c49d792f8a5fe`. Zakres jest
wyłącznie lokalnym opt-in pełnego joba BACKTEST v4, a nie odrębną
zablokowaną próbą raw-archive race. Nie uruchamiać tamtego testu ani
nie tworzyć dla niego zasobów. Obcy nieśledzony katalog pozostaje bez
zmian.

## Zamrożone wejście i środowisko

Użyć dokładnie poprzedniego [planu źródła](position-parity-011a-alice-raw-witness-plan-2026-10-22.md)
i [odebranego lokalnie joba](position-parity-011a-alice-raw-v4-full-job-evidence-2026-10-22.md):
publiczny Binance USD-M `ALICEUSDT-trades-2026-10-18.zip` z oryginalnym
`.CHECKSUM`, osobne klines 1m, okno 2026-10-18 02:41–04:21 UTC,
100 świec, 1730 raw transakcji. ZIP SHA-256
`c90445e1b22111d993aef687d4bbea29bdb11de60c28e0219f035166a5486502`,
taśma SHA-256
`cbe297350b5752f44ab499193b0dd108a5a43f561c5539f42821dae209a8806b`.
DCA raw ID `394796061` o 02:46:47.639, TTP raw ID `394796067`
o 02:46:57.282, ta sama świeca 5 i cykl 1. Nie zastępować tych ID
identyfikatorami `aggTrades`.

Strategia `marketSequenceStrategyConfig` bez modyfikacji: LONG,
`MOMENTUM(2)>-100`, legacy no-match EXIT interpretowany jako HOLD,
advanced DCA +0,10% raz ×1, TTP 0,08% z arm 0,05%, bez TSL;
FUTURES isolated leverage 1, wallet risk 10%, saldo 1000 USDT,
fee 0,0004, slippage 0. Budżet parsera testowego ZIP/CSV/raw/time
`399792 / 1694239 / 1730 / 30000 ms` bez podnoszenia po wyniku.
Oczekiwany rachunek trwały z poprzedniego pełnego joba: 5 trades,
9 wkładów (5 ENTRY, 4 DCA), fee `0,72035` USDT, net PnL
`-0,16687` USDT, jeden gotowy raport.

Wykorzystać wyłącznie nową pustą bazę PostgreSQL
`soar_011a_alice_raw_natural_test` na istniejącym własnym kontenerze
`127.0.0.1:62436` i własny Redis
`127.0.0.1:62439`, z nową unikalną nazwą kolejki. Źródłowe pliki
pozostają w `%TEMP%/soar-011a-alice-raw-20261022/`; żaden worker
nie używa sieci. Przed startem blob o zamrożonym ZIP SHA musi mieć
licznik 0, po zapisie pierwszego workera 1; test nie może korzystać z
bloba poprzedniego joba. Nie resetować bazy/Redis ani cudzych rekordów.

## Jedna próba naturalnego lease

1. Przed startem sprawdzić checksum i hash oryginalnych plików,
   100 świec i sumę `tradeCount=1730`. Zapisać pojedynczy PENDING run
   z powyższą strategią i seedem v4 opt-in, umieścić go **raz** w
   zwykłej `BacktestRunQueue` Redis. W testowym procesie workera
   wstrzyknąć wyłącznie `createOptInRawTradeV4JobSource`; produkcyjna
   iniekcja v4 pozostaje wyłączona.
2. Pierwszy worker ma pod claim tokenem utrwalić pełny ZIP, oryginalny
   checksum, ref i snapshot v4. Bariera przed symulacją potwierdzi
   SQL `RUNNING`, niewygasły 10-minutowy lease, digest i jeden blob/ref/
   snapshot, Redis `processing=[runId]`, `dedupe=true`, bez trades,
   wkładów i raportu. Następnie twardo zabić **tylko własny PID**.
3. Uruchomić drugi worker z tą samą kolejką, zwykłym skanem recovery
   (`30 s`) i domyślnym `BACKTEST_LEASE_MS=600000`. Bez ręcznego
   skrócenia lease, enqueue, claim, zmian zegara lub źródła. Przed
   wygaśnięciem nie może wykonać joba; po wygaśnięciu i najdalej
   90 sekund później ma sam przejąć ten sam run. `loadSource` w tym
   procesie rzuca błąd, więc jakikolwiek drugi odczyt ZIP/checksum
   unieważnia próbę. Stary token musi odmówić update/terminal commit.
4. Po automatycznym przejęciu job ma skończyć `COMPLETED`; sprawdzić
   jeden run/report/snapshot/ref, 5 trades, 9 wkładów, raw ID i
   kolejność DCA→TTP, dokładny fee/PnL i metryki raportu oraz puste
   `pending/processing/dedupe` po ACK. Odczytać źródło i timeline
   offline. Dopiero **po** tym świadomie enqueue ukończony run jako
   test idempotencji; trzeci proces nie może ponowić symulacji,
   fetch ani zmienić identyfikatorów i rachunku.
5. Zapisać rzeczywisty pierwszy `leaseExpiresAt`, moment startu
   nowego PID i moment `JOB_INVOKED`; wynik 10-minutowy raportować
   osobno od jakiejkolwiek skróconej próby. Jeśli zachowanie się nie
   potwierdzi, zapisać błąd i naprawić tylko minimalną przyczynę.
   Nie zmieniać źródła, okna, strategii ani budżetu pod wynik.

Po testach: API typecheck, celowany Vitest, docs parity, guardrails,
graph drift, SQL/Redis readback i selektywny commit. Niezależny QA na
dokładnym SHA jest wymagany do odbioru. To lokalny dowód procesu i
trwałego wyniku, bez twierdzenia o dokładnie jednokrotnym przeliczeniu
symulacji. Nie dowodzi produkcji, rzeczywistego LIVE ani pełnego
011A; statusy `REVIEW`/`NO-GO` pozostają.
