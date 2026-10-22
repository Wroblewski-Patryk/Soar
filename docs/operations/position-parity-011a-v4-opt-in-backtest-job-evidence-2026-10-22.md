# 011A: opt-in raw v4 w pełnym jobie BACKTEST

**Wynik autorski:** lokalny PASS ograniczonej integracji na kodzie po
`4afa24855fcfc78b7ed166327cc2d66d53d13573`. Docelowy SHA/tree jest
identyfikatorem selektywnego commita z tym dokumentem. Niezależny odbiór,
automatyczny restart procesu, pełne trzy tryby i produkcyjne włączenie nadal
pozostają otwarte. `011A` ma status `REVIEW`, wydanie `NO-GO`.

## Granica wykonania

Job rozpoznaje `BINANCE_USDM_TRADES_V4_TEST_ONLY` tylko gdy proces ma
`RUN_011A_RAW_V4_JOB_PROOF=1` **i** wywołujący wstrzyknie adapter v4.
Produkcyjne `backtests.service.ts` nie wstrzykuje go. Odmowa bez adaptera
kończy run z diagnostycznym raportem `reportReady=false`, bez PnL i trades.
Adapter dopuszcza tylko Binance FUTURES, 1m, jeden symbol, 1–120 minut jednej
doby UTC i jawny dodatni budżet. Pod claim tokenem najpierw wiąże zweryfikowany
ZIP + `.CHECKSUM`, ref i snapshot v4 w bazie, a dopiero z ponownego odczytu
offline oddaje uporządkowane raw ticki symulatorowi. Na kolejnym odczycie tego
samego runu sprawdza zapisany blob i digest bez `loadSource` lub sieci.
Brak snapshotu przy istniejącej referencji albo digestcie retry odmawia
ponownego pobrania. Brak, zmiana checksum i limit kończą run przed symulacją.

## Lokalny test

Własna PostgreSQL `soar_011a_raw_foundation_test` pod `127.0.0.1:62436`
po 88 migracjach i własny Redis pod `127.0.0.1:62439`. Vitest miał
`DATABASE_URL` wskazujący nieużywaną bazę runtime,
`TEST_DATABASE_URL` wskazujący tę bazę `_test`, `REDIS_URL` na własny Redis.
Test joba wymagał `RUN_011A_RAW_V4_JOB_PROOF=1`.

```powershell
pnpm --filter api exec vitest run src/modules/backtests/backtestRawTradeV4Job.runtime.test.ts
pnpm --filter api exec vitest run src/modules/backtests/backtestRunJob.test.ts src/modules/backtests/backtestClaimedRun.test.ts src/modules/backtests/backtestIntrabarTimelineSource.test.ts
pnpm --filter api exec tsc --noEmit
```

Wynik: job `5/5 PASS`, trzy dotychczasowe pliki `33/33 PASS`, API typecheck
PASS. Jeden rzeczywisty `createClaimedBacktestRunJob` na lokalnie wytworzonym,
deterministycznym ZIP ze 100 świecami wykonał zapis przed symulacją,
`COMPLETED`, jeden raport `reportReady=true`, jeden trade, dwa wkłady
ENTRY 100 USDT po 1 oraz DCA 100 USDT po 1,25. Zapisana strategia
`MOMENTUM(2)` dała ENTRY; brak kolejnego sygnału wejścia utrzymał pozycję.
Tick DCA 1,25 przy +20 s poprzedził tick TTP 1,13 przy końcu tej samej
świecy. Utrwalone fee `0,16136` i net PnL `+3,23864` USDT były zgodne
z tradem. Drugi odczyt źródła tego runu i timeline użyły blobu offline,
`loadSource` pozostał wywołany raz, a ponowne wywołanie zakończonego joba
pozostawiło po jednym trade/raporcie i dwóch wkładach. Warianty disabled,
missing, changed checksum i limit dały `FAILED`, `reportReady=false`,
`netPnl=null`, zero trades i zero wywołań symulatora.

Osobny istniejący test na oficjalnym ETHUSDT 2026-10-18 02:00–04:00 UTC
z `RUN_011A_RAW_V4_PROOF=1`, lokalnym ZIP/`.CHECKSUM` i JSON klines
przeszedł ponownie `1/1 PASS` w 42,06 s. Potwierdza `120/120` OHLCV i
trade count, 199 234 raw w oknie, digest całej taśmy
`e29f15b7b5a7e9c98dc826f466d7dbafd30bb16aa7c74ff3933f2cf2ef6c3228`,
offline replay dwóch runów, retry i odmowę dla missing/changed/limit.
Ten test **nie** wykonuje joba ani nie wylicza PnL oficjalnego ETH.

## Pozostałe bramki

Nie wykonano SIGKILL ani automatycznego odzyskania tego samego
niezakończonego runu przez kolejkę. Ponowne wywołanie zakończonego joba
oraz ponowny odczyt źródła nie są takim dowodem. Brak zatwierdzonych
budżetów produkcyjnych, retencji/GC, backupu i rollbacku dla pełnych raw
ZIP. Nie ma dowodu PAPER/LIVE, rzeczywistego venue ani produkcyjnego UI.
Nie wykonano deployu, zapisów produkcyjnych, LIVE ani resetów.
