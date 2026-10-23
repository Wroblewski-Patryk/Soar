# 011A: oficjalny ETH raw v4 w pełnym jobie BACKTEST

**Autorski lokalny wynik:** `PASS` ograniczonego testu opt-in. Plan i
strategię [zamrożono przed wykonaniem](position-parity-011a-v4-official-eth-job-plan-2026-10-22.md)
w commicie `dbb84feb8ff09192bcfc6a0fedb39940037d9932`. Testowany exact
code/test SHA `b44ada58d60a64999a87bfc2b24e910e8d13c3de`, tree
`3670fa36606ae421db82086bcd60b7a67ecd54d2`. Niezależny odbiór
tego wyniku pozostaje otwarty. Pełne 011A `REVIEW`, wydanie `NO-GO`.

## Źródło, budżet i środowisko

Oryginalny publiczny Binance USD-M `ETHUSDT-trades-2026-10-18.zip` i
`.CHECKSUM` z lokalnej kopii oraz niezależny JSON 1m klines obejmują
2026-10-18 02:00–04:00 UTC. ZIP `29 176 827 B`, CSV `178 044 910 B`,
ZIP SHA-256
`8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7`;
JSON klines SHA-256
`9334eb8e2f94a34e8a45c9dfdba6544a0ee7d8f5129b85d2055cd6d19f2acc3f`.
Weryfikacja v4 potwierdziła 120/120 OHLCV i trade count, 199 234 raw
ticki oraz digest taśmy
`e29f15b7b5a7e9c98dc826f466d7dbafd30bb16aa7c74ff3933f2cf2ef6c3228`.
Zachowano zamrożony testowy budżet ZIP/CSV/tick/time
`29 176 827 / 178 044 910 / 199 234 / 120 000 ms`; nie zmieniano
limitu ani źródła po wyniku. To nie jest budżet produkcyjny.

Własna PostgreSQL `soar_011a_raw_foundation_test` pod
`127.0.0.1:62436` oraz własny Redis pod `127.0.0.1:62439`.
`DATABASE_URL` wskazywał nieużywaną bazę runtime, `TEST_DATABASE_URL`
wyłącznie tę `_test`, a `REDIS_URL` własny Redis. Lokalne pliki źródłowe
były poza repo. Polecenie po ustawieniu tych adresów i katalogów źródeł
(`RUN_011A_RAW_ARCHIVE_DIR`, `RUN_011A_KLINES_DIR`):

```powershell
$env:RUN_011A_RAW_V4_JOB_PROOF='1'
$env:RUN_011A_RAW_V4_OFFICIAL_JOB_PROOF='1'
pnpm --filter api exec vitest run src/modules/backtests/backtestRawTradeV4OfficialJob.runtime.test.ts --reporter=verbose
```

`git diff --quiet HEAD --` zwróciło `0` przed i po teście. Jedyny
nieśledzony katalog był obcy
`docs/operations/api-endpoint-docs-parity-2026-10-20/`, nietknięty.
Test `1/1 PASS`, exit `0`, czas testu `22,961 s`. Log lokalny
`%TEMP%/soar-011a-v4-official-job-b44ada58-20261022.log`, SHA-256
`f3624ea645503b8827777021d71ee8100dafd100c5f823c7db09c0f21c5c59ca`.

## Trwały wynik

Job działał przez prawdziwy `createClaimedBacktestRunJob`. Pod claim
tokenem adapter najpierw utrwalił ref i snapshot v4 z oryginalnym
ZIP/`.CHECKSUM`; bezpośredni odczyt SQL przed wywołaniem symulatora
potwierdził `version=4`, digest taśmy i jeden ref. Dopiero potem
symulator dostał 120 świec z 199 234 uporządkowanymi raw tickami.
Nie użyto sieci: `fetch` był zablokowany w teście.

Run `2d796a25-492b-4486-9233-c4df05451acb` zakończył się
`COMPLETED`. Digest replay w seedzie:
`1dc02821428ce7530ea4c45288f5c1bb9d7b58d427176fccf756a6823753f87c`.
Jeden raport ma `reportReady=true`, `totalTrades=13`, net PnL
`-0,39662` USDT. Odczyt SQL dał 13 trwałych trades z sumą PnL
`-0,39662000` i fee `1,04016000` USDT oraz 13 wkładów wyłącznie
`ENTRY` o łącznym wkładzie `1299,91213228` USDT, zgodnym z raportem.
Podział zamknięć: 9 TP (`+0,32635` PnL, `0,72035` fee), 3 SL
(`-0,58078`, `0,23986` fee), 1 FINAL_CANDLE (`-0,14219`,
`0,07995` fee). `DCA=0`, `TTP=0` zgodnie z zamrożoną strategią.

Po jobie ponowny odczyt źródła tego samego runu i opt-in timeline
odtworzył 120 świec z persisted blob. `loadSource` wywołano dokładnie
raz, `fetch` zero razy. Ponowne wywołanie ukończonego joba nie dodało
raportu, trade, wkładu ani snapshotu.

Globalne liczniki własnej bazy przed→po: User `35→36`, Strategy `6→7`,
Run `45→46`, Report `25→26`, Trade `6→19`, Contribution `12→25`,
RawBlob `7→7` (deduplikacja identycznego oficjalnego ZIP), RawRef
`20→21`, Snapshot `18→19`; Redis `DBSIZE=0→0`. Własne rekordy i
kontenery zachowano, bez resetu ani cleanupu.

## Granica dowodu

To jest oficjalna **raw trades** taśma ETH i jeden lokalnie zakończony
BACKTEST. Nie jest to zamrożony świadek ALICE `aggTrades` z DCA
`a=167049972` i TTP `a=167049977`, ani dowód parytetu PAPER/LIVE.
Ponowne wywołanie ukończonego runu nie potwierdza automatycznego
przejęcia `RUNNING` po SIGKILL i wygaśnięciu lease. Produkcyjny job
nadal nie wstrzykuje v4; brak zatwierdzonych limitów, retencji/GC,
backupu, produkcyjnego UI i dowodu rzeczywistego venue. Nie wykonano
deployu, LIVE, produkcyjnych zapisów, resetów ani raw-archive race.
