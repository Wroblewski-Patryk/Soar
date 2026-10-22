# 011A: ALICE raw trades v4, pełny lokalny BACKTEST

**Autorski wynik ograniczonej próby: PASS 1/1.** Zamrożony
[plan](position-parity-011a-alice-raw-witness-plan-2026-10-22.md) powstał
**przed parsowaniem raw CSV** w commicie
`9b6f593b893286abc3b82b0e3730d52ef013956c`. Kod selektora
`37ec3051ff77e7acbb37e53654a6ee060fee097a`; pełny test joba
`5de00b2ac4e63383f860f4ca9df79e2b491cf491`, tree
`80b1c2cf4eb030f1659798c923c4cc58c21a87eb`. Niezależny odbiór
tego SHA pozostaje otwarty. Pełne 011A `REVIEW`, wydanie `NO-GO`.

## Źródło i selekcja przed jobem

Oryginalny publiczny Binance USD-M `ALICEUSDT-trades-2026-10-18.zip`
z `.CHECKSUM`, osobny JSON 1m klines, stałe okno
**2026-10-18 02:41–04:21 UTC**, 100 świec. ZIP `399 792 B`, CSV
`1 694 239 B`, ZIP SHA-256
`c90445e1b22111d993aef687d4bbea29bdb11de60c28e0219f035166a5486502`,
JSON SHA-256
`4738f1e447658e153413b01b32c07ad6f5d1791993e83404e611631caa698133`.
Weryfikator potwierdził oryginalną sumę, dzienną kolejność raw ID/czasu,
100/100 OHLCV i `tradeCount` względem klines oraz 1730 raw transakcji w
oknie. Limit testowy ZIP/CSV/tick/time pozostał
`399 792 / 1 694 239 / 1730 / 30 000 ms`; pomiar weryfikacji `62 ms`.
Digest zweryfikowanej taśmy:
`cbe297350b5752f44ab499193b0dd108a5a43f561c5539f42821dae209a8806b`.

Offline [selektor](../../apps/api/scripts/select011aAliceRawWitness.ts)
uruchomiony na swoim dokładnym SHA zwrócił `WITNESS`: 4 DCA, 4 TTP i
jedną kwalifikującą się parę w tej samej świecy. Pierwszy cykl ma DCA
2026-10-18 **02:46:47.639 UTC**, cena `0,1454`, raw ID `394796061`,
oraz późniejszy TTP **02:46:57.282 UTC**, cena `0,1454`, raw ID
`394796067`; oba `candleIndex=5`, `tradeSequence=1`. Dopasowanie czasu
i ceny było jednoznaczne, ID i czas rosną. Log selektora:
`%TEMP%/soar-011a-alice-raw-selector-37ec3051-20261022.log`, SHA-256
`5c4bed9a78b178fc86211007066063a20e01c5ea786e90b016e414c0df8a2571`.
To są raw trade IDs, a nie wcześniejsze ALICE `aggTrades`
`a=167049972/977`.

## Pełny claimed job i odczyt trwały

Własna PostgreSQL `soar_011a_raw_foundation_test` pod
`127.0.0.1:62436` i własny Redis pod `127.0.0.1:62439`.
`DATABASE_URL` wskazywał nieużywaną bazę runtime,
`TEST_DATABASE_URL` tylko tę `_test`, `REDIS_URL` własny Redis.
Lokalne źródła były poza repo. Uruchomiono dokładnie jeden pełny
[test opt-in](../../apps/api/src/modules/backtests/backtestRawTradeV4AliceWitness.runtime.test.ts)
z `RUN_011A_RAW_V4_JOB_PROOF=1`,
`RUN_011A_ALICE_RAW_V4_JOB_PROOF=1` i ścieżką
`RUN_011A_ALICE_RAW_SOURCE_DIR`:

```powershell
pnpm --filter api exec vitest run src/modules/backtests/backtestRawTradeV4AliceWitness.runtime.test.ts --reporter=verbose
```

`1/1 PASS`, exit `0`, test `489 ms` (cały proces `1,73 s`). Log
`%TEMP%/soar-011a-alice-raw-v4-job-5de00b2a-20261022.log`, SHA-256
`c617ee98fcaa75269b750bbaea1a4a802abdfde292b73d26f8685f86c1432541d`.
`git diff --quiet HEAD --` zwrócił `0` przed i po teście. Obcy
nieśledzony katalog `docs/operations/api-endpoint-docs-parity-2026-10-20/`
pozostał nietknięty.

Job działał przez `createClaimedBacktestRunJob`. Pod claim tokenem
adapter najpierw utrwalił oryginalny ZIP/checksum, jedną referencję i
snapshot v4; SQL przed wejściem do symulatora potwierdził `version=4`
i digest taśmy. Symulator dostał 100 świec oraz 1730 uporządkowanych
raw ticków. Test związał DCA/TTP z unikalnymi raw ID, a późniejszy SQL
potwierdził trwały wkład DCA i trade TTP w tych samych czasach i cenach.

Run `5b586023-2915-4273-8c9e-8b8dc5d7e096` ma `COMPLETED`,
`finishedAt`, wyczyszczony token i lease, digest replay
`cc487ad53414aaf8a5f6a936658b388551a2581a5c7b1129d722e10fe08d91ec`.
Jeden raport ma `reportReady=true`, 5 trades i net PnL
`-0,16687` USDT, zgodny z sumą 5 trwałych trades. Cztery TTP mają
razem PnL `+0,45853` i fee `0,64053`; jeden `FINAL_CANDLE` ma PnL
`-0,62540` i fee `0,07982`. Łączne fee `0,72035` USDT.
Dziewięć wkładów to 5 ENTRY (`500,101165` USDT) i 4 DCA
(`400,055312` USDT), zgodne z metrykami raportu. Pierwsze DCA
`tradeSequence=1`, `addSequence=1`, świeca 5, `100,000000000032` USDT;
odpowiadający TTP o 02:46:57.282 ma PnL `-0,02232` i fee `0,16006`
USDT. Ujemny PnL tego cyklu po opłatach nie unieważnia kolejności.

Odczyt persisted blob przez adapter i timeline zwrócił te same 100
świec oraz raw ID. `loadSource` wywołano raz, `fetch` zero razy.
Ponowne wywołanie **ukończonego** joba nie dodało raportu, trades,
wkładów ani snapshotu. SQL przed→po: User `36→37`, Strategy `7→8`,
Run `46→47`, Report `26→27`, Trade `19→24`, Contribution `25→34`,
RawBlob `7→8`, RawRef `21→22`, Snapshot `19→20`; Redis `DBSIZE=0→0`.
Własne rekordy i kontenery zachowano bez resetu i cleanupu.

API typecheck, `quality:guardrails`, `docs:parity:check` i
`git diff --check` przeszły; graph drift `949/949`, brak brakujących
ścieżek.

## Granica dowodu i następny odbiór

To jeden lokalny BACKTEST na publicznych **raw trades** i trwały
rachunek pierwszego DCA→późniejszego TTP. Nie dowodzi PAPER/LIVE,
rzeczywistych filli, produkcji ani tego, że worker sam przejmie
**niedokończony** run po `SIGKILL` i naturalnym wygaśnięciu lease.
Ponowienie już zakończonego runu nie zastępuje tego testu. Produkcyjna
iniekcja v4 pozostaje wyłączona; brak zatwierdzonych budżetów,
retencji/GC, backupu i produkcyjnego readbacku.

Proponowany niezależny odbiór następnego etapu: na tym samym źródle i
strategii zatrzymać własny worker po trwałym snapshot v4, lecz przed
terminalnym commitem; po naturalnym lease uruchomić nowy proces bez
ręcznego enqueue/claim. Potwierdzić ten sam run ID, dokładnie jeden
raport, 5 trades i 9 wkładów, zgodne raw ID/czas/fee/PnL, zero drugiego
fetch ZIP/.CHECKSUM, brak duplikatów w Redis i odmowę zapisu starego
tokenu. Zmiana/brak źródła musi dać jawne `FAILED` bez częściowego
raportu/trades. Dopiero niezależny QA na dokładnym SHA może przyjąć
wynik lokalny; pełne 011A pozostaje `REVIEW` i `NO-GO`.
