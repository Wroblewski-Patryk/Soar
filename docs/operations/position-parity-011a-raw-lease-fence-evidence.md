# 011A — fence lease przy zapisie raw: lokalny dowód autorski

Plan przed kodem: `97dc57e02673aeddee81d1f63877a97c727aa082`.
Kod i testy: `34a8d0c11beaa45478d111431d26f90fbc01fa37`.
Korekta dotyczy P1 z niezależnego review wcześniejszego wycinka
`fffe48b618576d2d7e0e3ab13f3f4cd3a14352f3`. Pełne 011A/011
pozostają `REVIEW`.

## Mechanizm

`createClaimedBacktestRunJob` przekazuje token claimu do archiwalnego
fetch i zapisu. Nowy `saveVerifiedRunArchive` wymaga tokenu. W **tej
samej transakcji** co snapshot v3 i wszystkie raw wykonuje warunkową
aktualizację `BacktestRun`: `RUNNING`, zgodny token i niewygasły lease;
jedno trafienie odnawia lease oraz blokuje wiersz do końca transakcji.
Zero trafień daje `BACKTEST_INTRABAR_ARCHIVE_CLAIM_LOST` bez zapisu raw.
Istniejący terminalny commit osobno fence'uje token i zapisuje raport,
trades oraz wkłady atomowo. Odczyt utrwalonego archiwum nadal działa
offline bez nowego fetch.

## Wynik na własnej bazie i Redisie

Świeża PostgreSQL `soar_011a_raw_race_test` i
`soar_011a_archived_process_test` na odrębnym porcie po 85 migracjach,
osobny Redis i unikatowa kolejka. Test raw 1/1 `PASS` użył **pięciu
osobnych runów** z rzeczywistymi tokenami claimu:

- Dwa PID z tym samym aktywnym tokenem zapisały identyczne dwa ZIP bez
  duplikatu; przy różnych poprawnych ZIP drugi zapis otrzymał
  `SOURCE_CHANGED_ON_RETRY`, a SQL zawierał tylko dwa raw zwycięzcy.
- Zła suma drugiego ZIP odmówiła zapisu przed transakcją.
- PID 80072 przygotował poprawny, lecz różny surowy zestaw. Po
  testowym wygaśnięciu jego lease i nowym claimie PID 222508 zapisał
  kanoniczny zestaw. Stary PID dostał `CLAIM_LOST`, bez częściowego raw.
- Po `SIGKILL` klienta z zapisanym źródłem kolejny PID dostał nowy
  token, odczytał DB offline i ponowił zapis tej samej tożsamości bez
  duplikatu. **Harness po odczycie odtworzył syntetyczny ZIP lokalnym
  fetcherem**; sam ten wariant nadal nie dowodzi automatycznego retry
  joba ani działania kolejki. Redis `DBSIZE=0` potwierdził tylko brak
  kluczy w teście raw.

Osobny procesowy test prawdziwego joba 1/1 `PASS` na publicznych ZIP
ALICEUSDT przez północ UTC: PID 49656 zatrzymał się po odpowiedzi HTTP
na drugi ZIP, przed odczytem jego bajtów i zapisem. Skrócono lease
**tylko własnego runu**;
PID 230284 przejął ten sam run przez Redis, pobrał źródło, zapisał
jeden snapshot i dwa raw oraz zakończył `COMPLETED`. Po zwolnieniu
starego workera jego transakcja raw dostała `CLAIM_LOST`. SQL przed i
po tym zdarzeniu miał identyczny run, jeden raport, trzy trades,
niezmienione wkłady i net PnL `+0,34133` USDT. Stary worker nie
uruchomił symulatora. Kolejka `pending` i `processing` oraz dedupe
były puste po ACK. Ponieważ pierwszy worker zatrzymał się **przed**
zapisem, drugi musiał pobrać źródło.

Na tym samym kodzie wcześniejszy wariant `midnight-baseline` 1/1
`PASS` zatrzymał PID **po** trwałym zapisie ZIP/digest. Nowy PID wznowił
ten sam run po testowo skróconym lease **bez drugiego fetch**, z jednym
raportem, trzema trades, PnL `+0,34133` USDT i pustą kolejką.
API typecheck `PASS`; celowane testy archiwum, claimu i repozytorium
lease: 16 `PASS`, 3 świadomie `SKIP`; docs parity, guardrails i strict
graf `943/943` `PASS`. Po selektywnym cleanup obie własne bazy miały
zero User/Strategy/Run/Archive/Raw/Trade/Report, Redis `DBSIZE=0`.

Nie wykonywano real LIVE, deploy ani zapisu produkcyjnego. Test
trzytrybowy z internal mock LIVE po adaptacji sygnatury przeszedł
typecheck, ale nie został uruchomiony w tej korekcie. Naturalnego
10-minutowego lease, pojemności, rollbacku migracji, większych
archiwów i produkcji nie zweryfikowano tu ponownie. Dowód jest lokalny
i autorski; niezależny odbiór korekty pozostaje otwarty. Pełne 011A/011
`REVIEW`, `POSITION-CYCLE` `OPEN`, wydanie `NO-GO`.
