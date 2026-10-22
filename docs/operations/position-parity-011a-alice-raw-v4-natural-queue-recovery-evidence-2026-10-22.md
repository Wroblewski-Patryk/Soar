# 011A: ALICE raw v4, automatyczne odzyskanie kolejki po naturalnym lease

**Autorski lokalny wynik: 1/1 PASS.** Zakres i stałe wejście zapisano
przed kodem i testem w [planie](position-parity-011a-alice-raw-v4-natural-queue-recovery-plan-2026-10-22.md),
commity `370d19e15f71c048409290126c22251b5635bba5` oraz
`6d01d07b770c44561976290bc94a907edab6689f` (doprecyzowanie pustej
bazy). Dokładny kod i test: SHA
`78cf2ac89890d52116bb7abac4d1c56d146c2023`, tree
`e9fd982cf1abbb54ad3268bc8c3517ca9c16c93c`.
Niezależny statyczny i runtime QA dały osobne, ograniczone lokalne
`PASS` na końcowym SHA kodu/dokumentacji
`d376298e3d5cd3aa893af413c2fdf14575ec041a`. Pełne 011A
`REVIEW`, wydanie `NO-GO`.

## Wcześniejszy blocker portów QA i korekta

Koordynator przekazał wcześniejszy ograniczony **statyczny PASS** niezależnego
reviewera dla ówczesnego SHA `91ab6a05064465205b3efe66e37912c576f7cc29`.
Niezależny runtime QA tej wcześniejszej wersji był **BLOCKED przed 10-minutową
próbą**: test i jego proces potomny wymuszały porty autora
`127.0.0.1:62436/62439`, zajęte przez zachowane własne kontenery.
Na tym SHA nie było niezależnego `1/1 PASS` procesu i nie należy przenosić
autorskiego wyniku z SHA `78cf2ac89890d52116bb7abac4d1c56d146c2023`
na odbiór QA.

Minimalna korekta na kodowym SHA
`dbf3a53e18474317b65c9fce44bf1c6feb6d945b`, tree
`760f034d27d3539e7c71b13a9b530f95ec9b7d57`, dopuszcza jawne
niestandardowe porty PostgreSQL i Redis na `127.0.0.1`, nadal wymaga
osobnej bazy `soar_011a_alice_raw_natural_test`, opt-in oraz
domyślnego `BACKTEST_LEASE_MS=600000`. Rodzic przekazuje swoje adresy
przez środowisko do child workera. Nowa mała kontrola uruchamia **ten
sam proces potomny** z portami `65136/65139`, odczytuje jego widok
hostów, portów i nazwy bazy, po czym proces kończy się przed
połączeniem z DB/Redis. Nie wypisuje danych uwierzytelniających.
Na tym exact SHA API typecheck i celowany Vitest: `1 PASS / 1 SKIP`
(`SKIP` to pełna naturalna próba), exit `0`. Log
`%TEMP%/soar-011a-alice-raw-v4-qa-ports-dbf3a53e-20261022.log`,
SHA-256
`2e24b4eea60118b8fa9d084e87b46ee239f1e05fc06f33af01bed499c97cfd7d`.
Pełnego 10-minutowego proof nie uruchamiano ponownie na tym SHA.

## Niezależny odbiór końcowego SHA

Niezależny statyczny reviewer dał ograniczony `PASS` na finalnym
SHA kodu/dokumentacji `d376298e3d5cd3aa893af413c2fdf14575ec041a`
(kod portów `dbf3a53e18474317b65c9fce44bf1c6feb6d945b`, kod pełnego
odzyskania `78cf2ac89890d52116bb7abac4d1c56d146c2023`).
Niezależny runtime QA użył własnej świeżej `_test` i Redis pod własnymi
portami loopback. Na tym samym SHA uzyskał `2/2 PASS`, w tym `1/1 PASS`
pełnego procesu z naturalnym `BACKTEST_LEASE_MS=600000`.

Pierwszy worker QA PID `97116` utrwalił zimny ZIP z oryginalną
`.CHECKSUM` i snapshot, po czym został zabity przez `SIGKILL` przed
wynikiem. Drugi PID `49656` przejął run zwykłą kolejką `8741 ms` po
naturalnym wygaśnięciu lease, bez ręcznego claim/enqueue ani ponownego
fetch. Trzeci PID `114432` wykonał retry bez duplikatów. QA odczytał
100 świec i 1730 raw transakcji, DCA raw ID `394796061` przed TTP raw
ID `394796067` na tej samej świecy, jeden `COMPLETED` run i raport,
5 trades oraz 9 wkładów. Fee `0,72035` i net PnL `-0,16687` USDT;
Redis `DBSIZE=0→0`. SHA-256 logu QA:
`c8f96f4eb6bbe13fb62d409f927a2b4648bff8caa2404e4c1213930cb5f5bc48`.
QA posprzątał wyłącznie własne dwa kontenery i anonimowe
woluminy. Zasoby autora oraz zasoby wcześniejszej próby zablokowanej
przez policy review pozostały nietknięte.

## Źródło i środowisko

Zachowano publiczny Binance USD-M `ALICEUSDT-trades-2026-10-18.zip`
z oryginalnym `.CHECKSUM` oraz osobne klines 1m, okno
2026-10-18 **02:41–04:21 UTC**, 100 świec i 1730 raw transakcji.
ZIP SHA-256
`c90445e1b22111d993aef687d4bbea29bdb11de60c28e0219f035166a5486502`,
taśma SHA-256
`cbe297350b5752f44ab499193b0dd108a5a43f561c5539f42821dae209a8806b`.
Budżet parsera testowego ZIP/CSV/raw/time
`399792 / 1694239 / 1730 / 30000 ms`, strategia i parametry z
[poprzedniego pełnego joba](position-parity-011a-alice-raw-v4-full-job-evidence-2026-10-22.md)
bez zmian. Raw ID DCA `394796061` o 02:46:47.639 i późniejszy
TTP `394796067` o 02:46:57.282 w świecy 5 to inne ID niż
wcześniejsze `aggTrades` `a=167049972/977`.

Własny kontener PostgreSQL `soar-011a-foundation-c6867-pg`
(`soar.owner=011a-foundation-c6867`) pod `127.0.0.1:62436`, nowa
**pusta** baza `soar_011a_alice_raw_natural_test` po 88 migracjach;
przed startem User/Run/RawBlob `0/0/0`. Własny Redis
`soar-011a-foundation-c6867-redis` pod `127.0.0.1:62439`,
`DBSIZE=0`. Nie ruszano poprzedniej bazy źródłowej ani cudzych
zasobów. Lokalna kopia źródła poza repo:
`%TEMP%/soar-011a-alice-raw-20261022/`.

Test [procesowy](../../apps/api/src/modules/backtests/backtestRawTradeV4AliceNaturalQueue.runtime.test.ts)
uruchomiono raz na zamrożonym SHA z `RUN_011A_RAW_V4_JOB_PROOF=1`,
`RUN_011A_ALICE_RAW_V4_NATURAL_QUEUE_PROOF=1`, własnymi adresami
`TEST_DATABASE_URL` i `REDIS_URL` oraz ścieżką źródła:

```powershell
pnpm --filter api exec vitest run src/modules/backtests/backtestRawTradeV4AliceNaturalQueue.runtime.test.ts --reporter=verbose
```

`1/1 PASS`, exit `0`, czas testu `612,613 s`, procesu `613,64 s`.
Log `%TEMP%/soar-011a-alice-raw-v4-natural-78cf2ac8-20261022.log`,
SHA-256
`b56e43c164fe9cc4b3660fd5dcf84c16dba54b1dbf0370aa318095a88ab7b33f`.
Przed i po testem `git diff --quiet HEAD -- = 0`; obcy
nieśledzony katalog `docs/operations/api-endpoint-docs-parity-2026-10-20/`
pozostał nietknięty.

## Od przerwania do gotowego raportu

Jedyny PENDING run `ceb2c4be-8c28-4002-ab5e-30f580fe5259`
umieszczono raz w unikalnej `BacktestRunQueue` Redis. Pierwszy worker
PID `208712` pod tokenem utrwalił **nowy** blob ZIP+oryginalny
`.CHECKSUM` (`0→1`), ref (`0→1`) i snapshot v4 (`0→1`). Bariera
przed symulacją potwierdziła `RUNNING`, ważny token i lease, digest
replay `cc487ad53414aaf8a5f6a936658b388551a2581a5c7b1129d722e10fe08d91ec`,
`processing=[runId]`, `dedupe=true`, a raport/trades/wkłady `0/0/0`.
Odczyt SQL poza testem potwierdził ten stan. Zabito tylko PID `208712`
przez `SIGKILL`.

Drugi worker PID `187464` wystartował na **tej samej** kolejce.
Po awarii nie było ręcznego enqueue/claim, skrócenia lease, zmiany
zegara ani źródła. Domyślny `BACKTEST_LEASE_MS=600000`, skan recovery
co 30 s. Przed wygaśnięciem test stale potwierdzał brak `JOB_INVOKED`
oraz niezmieniony token i `processing`. Pierwszy lease wygasł
2026-10-22 **14:52:37.516 UTC** (`1792680757516` ms);
`JOB_INVOKED` wystąpił **8,678 s** później (`1792680766194` ms),
a checkpoint po nowym claimie **8,865 s** później
(`1792680766381` ms). Nowy token różnił się od starego;
warunkowe `update` i terminalny `commit` ze starym tokenem oba
zwróciły `false`, bez częściowego wyniku. To **naturalny 10-minutowy
lease**; w tej próbie nie było wariantu skróconego.

Drugi worker odczytał persisted blob/ref/snapshot offline, bez
drugiego `loadSource` lub sieciowego fetch, odtworzył 100 świec i
1730 raw ticków, a dopiero potem dokończył symulację. Test
potwierdził DCA raw ID `394796061` przed TTP raw ID `394796067` na
tej samej świecy i w jednym cyklu. Run przeszedł do `COMPLETED`, ma
`finishedAt`, wyczyszczony token i lease. Jeden gotowy raport
`9e752668-b7fd-46d6-8114-8630fbab3c15` (`reportReady=true`)
uzgadnia 5 trwałych trades, 9 wkładów (5 ENTRY, 4 DCA), łączną
opłatę `0,72035` USDT i net PnL `-0,16687` USDT. Pierwsze trwałe
DCA o 02:46:47.639 ma cenę `0,1454` i świecę 5; odpowiadający
trade TTP zamknął o 02:46:57.282 przy `0,1454`, z fee `0,16006`
i PnL `-0,02232` USDT. Metryka raportu ma 9 wkładów i DCA USDT
`400,055312`; sumy SQL są zgodne.

Po ACK własne `pending/processing/dedupe` były puste. Odczyt
persisted źródła i opt-in timeline przeszedł offline z oboma raw ID.
Dopiero po ukończeniu świadomie ponownie enqueue ten sam run:
trzeci PID `34888` wywołał job bez nowej symulacji i bez pobrania
źródła, a identyfikatory i zawartość runu, raportu, trades i wkładów
pozostały identyczne. Ostateczny readback SQL: 88 migracji;
User/Strategy/Run/Report/Trade/Contribution/RawBlob/RawRef/Snapshot
`1/1/1/1/5/9/1/1/1`; Redis `DBSIZE=0`. Rekordy i własne
kontenery pozostawiono do odczytu, bez resetu i cleanupu.

API typecheck na exact SHA, docs parity, guardrails i graph drift
`950/950` przeszły. `git diff --check` bez błędów.

## Granica i dalszy odbiór

To lokalny dowód **automatycznego wznowienia niezakończonego pełnego
BACKTEST raw v4 bez duplikatu trwałego wyniku**, po naturalnym lease
i z rzeczywistym `SIGKILL` własnego workera. Po restarcie drugi worker
przelicza symulację od początku zapisanej taśmy; wynik nie dowodzi
jednokrotnego wykonania samych obliczeń. Niezależny QA na końcowym SHA
potwierdził ten ograniczony lokalny wynik; wcześniejsza blokada portów
nie jest już bieżącą blokadą QA. Produkcyjna iniekcja v4 pozostaje
wyłączona. Brak zatwierdzonych budżetów i retencji/GC, backupu,
PAPER/LIVE, realnych filli oraz
uwierzytelnionego produkcyjnego readbacku. Pełne 011A nadal `REVIEW`,
wydanie `NO-GO`.
