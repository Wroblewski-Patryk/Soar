# 011A: większe raw v3 i próba kopii/rollbacku na własnej bazie

Plan przed kodem: [`5ca5e77c821d126d94fec733ad6402119784cce1`](position-parity-011a-capacity-rollback-plan.md).
Kod i migracja 86: `bafad15c9fa7c5f20b699cb729424ee1c415cb51`.
Zakres: wyłącznie lokalny BACKTEST Binance USD-M i własna PostgreSQL `_test`.
Pełne 011A pozostaje `REVIEW`; produkcja, LIVE, Gate.io i wydanie `NO-GO`.

**Errata:** ten dokument opisuje pierwotny kodowy SHA `bafad15c9fa7c5f20b699cb729424ee1c415cb51`, który dostał niezależny `FAIL` za nieatomową migrację 86, brak SQL limitu sumy ZIP oraz przekroczenie budżetu próby. [Korekta i nowy lokalny dowód](position-parity-011a-capacity-migration-errata-evidence.md) dotyczą kodu `b7c4f7f6535f0c6695f2fbef9f7e10a40e50b943`. Poniższe wartości historyczne pozostają świadectwem tamtej próby, nie odbiorem nowego SHA.

## Pomiar źródła i decyzja o limitach

Publiczne dzienne `aggTrades` z 2026-10-18 pobrano z
`https://data.binance.vision/data/futures/um/daily/aggTrades/`.
Pobrane `.CHECKSUM` obu plików pasowały do SHA-256 ZIP:

| Symbol | ZIP B | CSV B | SHA-256 ZIP | Agregaty w 02:00–04:00 UTC |
| --- | ---: | ---: | --- | ---: |
| BTCUSDT | 9 648 212 | 51 389 809 | `673b4593a101ecba262b6424fc98ddf332f4e5d3a77ff8b97bc43201f0a4e5a8` | 57 759 |
| ETHUSDT | 12 205 717 | 59 500 129 | `b1042326e8a3157497532da615dd744bddf955e4e5a8095b76c0d85fa129f8b8` | 49 585 |

Nowy limit to **16 MiB ZIP łącznie na run/symbol**, **64 MiB CSV** i
**80 000 rekordów łącznie, w tym dwa brzegowe (maksymalnie 79 998 w oknie)**; archiwalny replay może pobrać do 80 stron
po 1000. REST zachowuje limit 20 stron po 1000. SQL ogranicza każdy ZIP
do 16 MiB, a na tamtym SHA tylko kod sumę dwóch ZIP do 16 MiB. Skan CSV przestał tworzyć
tablicę wszystkich linii dnia. To nadal całodzienne pliki przechowywane
bez TTL do usunięcia runu, z kosztem bazy i kopii na każdy run/symbol.

Pełne 120 minut 02:00–04:00 UTC **nie dało wyniku**: w obu symbolach
osiem świec miało rozbieżność OHLCV między pobranym ZIP a publicznymi
klines. Walidator zwrócił `BACKTEST_INTRABAR_SOURCE_OHLC_MISMATCH`
bez snapshotu i PnL. Test celowo użył potem spójnych podokien z tych
samych dużych ZIP: BTCUSDT 02:18–03:48 UTC (90 świec, 41 022 agregaty)
oraz ETHUSDT 03:14–04:00 UTC (46 świec, 19 383 agregaty).
Powtórny odczyt na SHA `c82a63746ec2ff07656049944b0053fe28def08c`
pokazał dokładne różnice na ośmiu parach sąsiednich minut i zgodność
oficjalnego archiwum klines z REST: [protokół 120 minut](position-parity-011a-120-minute-source-reconciliation-2026-10-22.md).
Oba przeszły checksum, sekwencję, OHLCV, v3 i odczyt offline z DB;
snapshot zawierał po jednym rekordzie brzegowym z każdej strony.
Wybór spójnych podokien jest celowany i nie szacuje częstości sukcesu.
Pełne 120 minut pozostaje otwartą granicą danych źródłowych, a nie
usprawiedliwieniem dla interpolowania świec lub pozornego PnL.

## Jednorazowa baza i kopie

Własny kontener PostgreSQL 15 miał etykietę
`soar.proof=011a-capacity-5ca5e77` i losowy port loopback `58249`.
Własna baza `soar_011a_capacity_test` otrzymała 84 migracje do v2,
dwa syntetyczne rekordy wersji v1/v2 i kopię `pg_dump -Fc`.
Kopia sprzed v3 miała 205 335 B i SHA-256
`a567a17481474cbcc34a0b518e399ce6a74e0e8b8454c3db892f893578b731da`;
restore do osobnej `soar_011a_pre_restore_test` dał 84 migracje,
dwa rekordy legacy i brak tabeli raw.

Do pierwszej bazy zastosowano bez błędu migracje 85 raw v3 i 86 nowego
ograniczenia. Dwa publiczne ZIP i pobrane `.CHECKSUM` zapisano pod
syntetycznymi runami. Relacja raw zajęła 22 740 992 B, baza 34 250 087 B;
samych ZIP było 21 853 929 B. Próba wstawienia pojedynczego ZIP
16 777 217 B została odrzucona przez SQL `CHECK`, bez nowego rekordu.
Po zastąpieniu syntetycznych payloadów v3 prawdziwymi snapshotami
próby aplikacyjnej wykonano drugą kopię `pg_dump -Fc` (25 530 433 B,
SHA-256 `f80e964c010e522df459ac9ba0bfc3d7e89d033612e753fc467d1dcdde10f240`).
Restore do odrębnej `soar_011a_verified_restore_test` dał
86 migracji, cztery snapshoty, dwa raw ZIP i 21 853 929 B raw;
SHA-256 obu ZIP i ich `.CHECKSUM` nadal pasowały. Aplikacyjny
`readVerifiedRunArchive` ponownie zweryfikował i odtworzył oba v3
z oznaczeniem `PERSISTED_CHECKSUM_REVERIFIED`.
Test odczytu kopii powtórzono na dokładnym kodowym SHA powyżej: 1/1 `PASS`.

Rekordy v1/v2 w tej próbie kopii były **syntetycznymi markerami
przechowywania**, nie pełnymi archiwami do replay. Odrębny test jednostkowy
sprawdza rzeczywisty odczyt v1/v2 jako `LEGACY_SNAPSHOT`. Próba kopii
potwierdza zachowanie tych rekordów przez migrację i restore, nie ich
aplikacyjny replay po restore. Nie było produkcyjnej migracji ani backupu.

**Przekroczenie budżetu próby:** cztery równocześnie zachowane bazy wraz z
WAL zajęły 257 479 216 B; trzy kopie łącznie 50 353 953 B, czyli
307 833 169 B (około 293,6 MiB) wobec planowanych 250 MiB na bazę i
kopię. Nie rozszerzano testu dalej. Następna próba musi usuwać własne
pośrednie restore przed utworzeniem kolejnego albo zatwierdzić większy
budżet miejsca. Własny kontener i jego anonimowy wolumen zostały
usunięte, podobnie pobrane ZIP/checksum. Automatyczna kontrola odrzuciła
rekurencyjne usunięcie wyłącznie własnego katalogu kopii migracji
(`blocked by policy`); pozostał katalog tymczasowy
`soar011a-capacity-5ca5e77/prisma-pre-v3` o rozmiarze 139 430 B.

## Komendy do powtórzenia w izolacji

1. Utworzyć **własny** kontener Postgres 15 z unikalną etykietą i portem
   wyłącznie na `127.0.0.1`; ustalić port przez `docker inspect`, sprawdzić
   `pg_isready`. Nigdy nie wybierać istniejącego kontenera Soar/Roost.
2. Skopiować schemat i migracje do 84 w katalogu tymczasowym, utworzyć
   własną bazę z sufiksem `_test`, uruchomić
   `pnpm --filter api exec prisma migrate deploy --schema <kopia-schema>`.
   Wstawić syntetyczne v1/v2. `pg_dump -Fc` z tej bazy odtworzyć przez
   `pg_restore` do drugiej własnej `_test`; sprawdzić 84/2 i brak raw.
3. Na pierwszej bazie uruchomić ten sam `prisma migrate deploy` z
   `apps/api/prisma/schema.prisma`; oczekiwać migracji 85 i 86. Wstawić
   wyłącznie publiczne ZIP/checksum do własnych syntetycznych runów.
   Sprawdzić `octet_length`, `sha256(bytea)` i rozmiary relacji.
4. Dla pobranych ZIP ustawić `RUN_011A_ARCHIVE_CAPACITY_PROOF=1`,
   `RUN_011A_ARCHIVE_DIR=<własny katalog>` oraz uruchomić
   `pnpm --filter api exec vitest run src/modules/backtests/backtestBinanceFuturesIntrabarArchive.test.ts -t 'replays source-consistent windows' --reporter=dot`.
   `RUN_011A_CAPACITY_DB_PROOF=seed` wymaga `DATABASE_URL` wskazującego
   własny lokalny `postgres` i `TEST_DATABASE_URL` wskazującego własną
   `soar_011a_capacity_test`; aktualizuje tylko te dwa syntetyczne v3.
5. Wykonać `pg_dump -Fc` po v3, odtworzyć do trzeciej własnej `_test`
   i uruchomić ten sam test z `RUN_011A_CAPACITY_DB_PROOF=verify` oraz
   `TEST_DATABASE_URL` wskazującym restore. Ten tryb czyta bez zapisu.
   Komendy `pg_dump`, `pg_restore` i `prisma migrate deploy` wolno tu
   kierować wyłącznie do własnej bazy próby; nie są instrukcją
   automatycznego uruchomienia na produkcji.

## Procedura do zatwierdzenia przez operatora

Przed STAGE i PROD operator identyfikuje dokładny SHA aplikacji i
migracji, zgodność starego/nowego kodu z v3, historię startów workerów,
runy `PENDING`/`RUNNING`, stan kolejki i lease. Potrzebne są planowane
okno, wolne miejsce na **co najmniej pełną kopię bazy oraz WAL i drugą
kopię do weryfikacji**, off-host checkpoint z hashem, test `pg_restore`
na osobnej bazie tej samej wersji PostgreSQL oraz zatwierdzony tryb
rollbacku. Raw może rosnąć do 16 MiB ZIP na każdy run/symbol plus JSON,
TOAST, WAL i kopie; brak oszacowania liczby runów oznacza STOP/NO-GO.

Po migracji należy odczytać `_prisma_migrations`, ograniczenie SQL,
liczbę/raw SHA rekordów, a osobno API, worker readiness, kolejkę i
zakończenie konkretnego backtestu z `PENDING`. Zielone `/health` ani
`/ready` API nie dowodzą tego ostatniego. Przy awarii wstrzymać promocję
i nowe workery; nie wznawiać ręcznie starych runów, nie uruchamiać
starszego workera przy nieuzgodnionym lease/rezultacie. Preferować
kompatybilny build naprawczy. Przywrócenie kopii sprzed v3 **usuwałoby
runy, raw i inne zapisy po checkpoint**; DROP tabeli lub restore na
aktywnej bazie są nieodwracalne. Wymagają jawnej decyzji operatora,
zatrzymania/readback wszystkich konsumentów, uzgodnienia in-flight,
zabezpieczenia bieżącego stanu i osobnego planu utraty/odzyskania danych.
W tym wycinku nie wykonano żadnego z tych kroków na STAGE/PROD.
