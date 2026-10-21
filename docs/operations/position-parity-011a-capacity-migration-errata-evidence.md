# 011A: errata limitu raw v3 — lokalny dowód po niezależnym FAIL

Plan przed poprawką: [`7dd81f9eecd46c67c9768a4cf833342d205902e8`](position-parity-011a-capacity-migration-errata-plan.md).
Kod, migracje 86/87 i test: `b7c4f7f6535f0c6695f2fbef9f7e10a40e50b943`.
Punkt wejściowy `bafad15c9fa7c5f20b699cb729424ee1c415cb51` dostał niezależny `FAIL`.
Zakres dowodu: lokalne, własne PostgreSQL 15 `_test` oraz izolowany proces Vitest.
Pełne `SOAR-POSITION-PARITY-011A` nadal ma `REVIEW`; STAGE/PROD, Gate.io, LIVE i wydanie pozostają `NO-GO`.

## Kontrakt po poprawce

Jeden `(runId, symbol)` może mieć najwyżej dwa raw ZIP i łącznie najwyżej
`16 777 216` B ZIP. Każdy ZIP ma 1–`16 777 216` B, a każda checksum
1–256 B. Migracja 86 zakłada CHECK i trigger w jednej jawnej transakcji
z blokadą tabeli; migracja 87 powtarza ochronę idempotentnie dla baz,
które oznaczyły dawną 86 jako wykonaną. Trigger szereguje konkurencyjne
zmiany tego samego runu przez aktualizację rekordu nadrzędnego i odrzuca
nadmiar z kodem `23514`. Po `COMMIT` migracja waliduje istniejące dane;
naruszenie zostawia ochronę nowych zapisów i kończy migrację błędem.
Żadnych istniejących bajtów nie usuwa automatycznie.

## Kontrolowana awaria i naruszenia na własnej bazie

Na `soar_011a_errata_test` po rzeczywistej migracji 85 wstawiono jeden
mały raw. Sesja wykonała `BEGIN; DROP CHECK; pg_sleep(60)`; druga sesja
potwierdziła dokładnie jeden własny backend w oczekiwaniu i zakończyła
go `pg_terminate_backend`. Po awarii katalog nadal zawierał CHECK
`<= 8 388 608`, a insert 9 MiB dostał `check_violation`.
Poprawiona migracja 86 zakończyła się bez błędu; katalog pokazał
zwalidowany CHECK `<= 16 777 216` i jeden aktywny trigger.

Dwa równocześnie uruchomione transakcyjne inserty po 9 MiB do jednego
nowego runu dały jeden `COMMIT`, drugi `23514`; odczyt wykazał jeden raw
o `9 437 184` B. Na innym runie UPDATE zwiększający sumę ponad 16 MiB
oraz trzeci ZIP zostały odrzucone. Następnie poza transakcją usunięto
CHECK i trigger **tylko na tej bazie testowej**, symulując stary stan
częściowy bez pisarzy. Ponowne wykonanie 86, a potem naprawczej 87
przywróciło jeden zwalidowany CHECK i jeden aktywny trigger.

Osobna własna `_test` sprawdziła wielowierszowy `INSERT`: dwa ZIP po
9 MiB w jednym poleceniu dały `23514` i **zero** zapisanych wierszy.
Dwie równoległe transakcje `REPEATABLE READ`, obie ze snapshotem sprzed
zapisu, dały jeden `COMMIT`, a drugiej PostgreSQL odmówił z
`could not serialize access due to concurrent update`; pozostał jeden raw.

Osobny wariant miał dwa istniejące raw po 9 MiB, wstawione przy
wyłączonym triggerze wyłącznie w tej bazie testowej. Ponowienie 87
zgłosiło `existing intrabar raw archive capacity violation` z `23514`;
po błędzie katalog nadal miał aktywny trigger i zwalidowany CHECK,
a odczyt wykazał jedną historyczną grupę ponad limitem. Nie wykonano
automatycznego usunięcia danych. Świeża pełna baza otrzymała przez
`prisma migrate deploy` wszystkie **87/87 migracji** na dokładnym SHA
`b7c4f7f6535f0c6695f2fbef9f7e10a40e50b943`.

## Granica 80 000 i koszt procesu

Opt-in test `RUN_011A_80K_PROOF=1` na dokładnym kodowym SHA przeszedł:
**80 000 rekordów łącznie** (79 998 w oknie i dwa brzegowe) dało replay
79 998 ticków, natomiast 80 001 rekordów odmówiło z `LIMIT`.
Windows `win32`, Vitest 3.2.4, jeden proces testowy: `elapsedMs=812`,
`process.resourceUsage().maxRSS=181 592 KiB` (około 177,34 MiB).
To high-water całego procesu Vitest, nie wyłącznie przyrost operacji.
Zwykły plik testowy: 10/10 PASS, pięć opt-in pominiętych; API typecheck PASS.

## Szczyt miejsca i odtworzenie

W osobnym własnym kontenerze `soar011astorage7dd81f9` jedna baza
`soar_011a_storage_test` otrzymała 87 migracji i dwa publiczne ZIP z
2026-10-18 wraz z oryginalnymi `.CHECKSUM`: BTCUSDT `9 648 212` B,
ETHUSDT `12 205 717` B. Ich SHA-256 odpowiadają [wcześniejszemu
pomiarowi](position-parity-011a-capacity-rollback-evidence.md); przy
ponownym pobraniu zgadzały się także nazwy i SHA w `.CHECKSUM`.
Do tej próby wstawiono syntetyczne rekordy runów oraz znaczniki payload
v3; **nie jest to ponowny aplikacyjny replay v3**. Wcześniejszy dowód
readback v3 pozostaje opisany osobno. `pg_dump -Fc` miał `24 620 188` B,
SHA-256 `7e1c5870f39d27b51083cf0b44ab201f100d86a3c442c191287a72491916effd`.
Restore do jednej drugiej własnej bazy `_test` zakończył się bez błędu:
87 migracji, dwa archiwa i identyczne długości oraz MD5 obu ZIP i
checksum przed i po odtworzeniu.

Sampler działał od startu próby do końca restore i sumował `du -sb`
całego katalogu PostgreSQL oraz `/tmp` kontenera (w tym publiczne ZIP
przed usunięciem i dump). **1295 próbek przez 70 738 ms**, największa
przerwa między odczytami **57 ms**, najwyższy zaobserwowany stan
**183 530 572 B = 175,03 MiB**. Jest to poniżej pierwotnego budżetu
**250 MiB** (`262 144 000` B) o `78 613 428` B. Próbkowanie nie daje
matematycznej gwarancji dla krótszego niż 57 ms skoku; wykazuje
rzeczywisty zaobserwowany szczyt w powtarzalnym przebiegu. Po restore
bazy miały `34 144 771` i `34 184 551` B według `pg_database_size`.
[Pełna seria próbek](position-parity-011a-capacity-peak-samples.tsv) zawiera
kolumny `epoch_ms bytes` bez nagłówka; SHA-256 pliku:
`73edcd63bfcbda9c1d6298de73b5fa1f6e4a008b8cb47ae7e4d88489f48b80c9`.

## Bramka operatora

Zmiana zawartości migracji 86 zmienia jej checksum. Przed STAGE/PROD
operator musi zatrzymać wszystkich piszących, zinwentaryzować
`_prisma_migrations` oraz rzeczywiste definicje CHECK i triggera w
`pg_constraint`/`pg_trigger`, mieć zatwierdzony backup/restore i
zidentyfikować SHA obrazu API oraz workerów. Jeśli dawna 86 została
oznaczona jako wykonana, 87 jest migracją naprawczą, lecz nie wolno
zakładać automatycznej zgodności historii checksum. Jeśli dawna 86
została oznaczona jako failed po utracie CHECK, `migrate deploy` nie
powinno być traktowane jako automatyczna naprawa: najpierw izolacja
pisarzy i świadoma procedura naprawy/rozwiązania wpisu Prisma. Przy
istniejących danych ponad limitem obowiązuje STOP i decyzja właściciela
po inwentaryzacji, bez kasowania. Odbiór wymaga osobnego odczytu workera,
kolejki i przejścia konkretnego backtestu `PENDING` do stanu końcowego;
API `/health` i `/ready` nie są tym dowodem.
