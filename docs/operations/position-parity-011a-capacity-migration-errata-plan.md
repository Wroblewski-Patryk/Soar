# 011A: errata migracji 86 i pojemności — plan przed korektą

Punkt wejściowy: kod `bafad15c9fa7c5f20b699cb729424ee1c415cb51`,
dokumentacja `c79dd18c799b6955a6f95d8d75a9fa030ee33995`.
Niezależny odbiór obu SHA dał `FAIL`. Dotyczy to nadal jednego ticketu
`SOAR-POSITION-PARITY-011A/HISTORICAL-INTRABAR-ORDER-SOURCE`.

## Błędy i kontrakt do naprawy

Migracja 86 wykonywała dwa DDL: `DROP CHECK`, potem `ADD CHECK`, bez
jawnej transakcji. PostgreSQL/Prisma nie zapewniają tu atomowości całej
migracji. Awaria po pierwszym DDL może zostawić tabelę bez limitu.
Drugi błąd: `CHECK` 16 MiB dotyczył pojedynczego ZIP, podczas gdy kod
ogranicza sumę 1–2 ZIP do 16 MiB. Wpisy direct SQL mogły przekroczyć
sumę. Limit 80 000 obejmuje dwa rekordy brzegowe, zatem najwyżej
**79 998 agregatów wewnątrz okna**.

Docelowy kontrakt: jeden run/symbol ma najwyżej dwa raw ZIP,
`SUM(octet_length(zipBytes)) <= 16 MiB`, każdy ZIP 1–16 MiB i każda
checksum 1–256 B. Aplikacja i baza odmawiają przekroczenia przed
publikacją snapshotu/PnL. Baza szereguje konkurencyjne inserty/updates
przez blokadę rekordu nadrzędnego. Migracja instaluje CHECK i trigger
w jednej jawnej transakcji; ponowienie jest idempotentne także wtedy,
gdy stary CHECK już zniknął. Przed naprawą ewentualnego stanu bez CHECK
operator musi zatrzymać wszystkich piszących. Istniejących danych
przekraczających budżet nie usuwamy automatycznie; stan pozostaje
STOP/NO-GO do inwentaryzacji i decyzji właściciela.

## Dowód lokalny przed odbiorem

1. Na **własnej** PostgreSQL `_test` po migracji 85 wstrzyknąć awarię
   procesu SQL po `DROP` w jawnej transakcji. Sprawdzić, że stary CHECK
   pozostał i 9 MiB nadal odrzuca. Potem zastosować poprawioną migrację
   i odczytać constraint, trigger oraz limit sumy.
2. W osobnej własnej `_test` zasymulować dawny częściowy stan bez CHECK,
   bez workerów/pisarzy. Ponowienie migracji ma przywrócić ograniczenia.
   Dwa równoległe inserty pod jednym runem, każdy poniżej 16 MiB, lecz
   razem powyżej 16 MiB: dokładnie jeden ma przejść; update i trzeci ZIP
   mają odmówić. Przy istniejących błędnych danych migracja ma zostawić
   ochronę nowych zapisów i zgłosić STOP bez czyszczenia danych.
3. Próbka 80 000 rekordów łącznie, w tym dwa brzegowe, ma przejść;
   80 001 ma odmówić. Zmierzyć `performance.now()` i
   `process.resourceUsage().maxRSS` dla odrębnego procesu testowego;
   zapisać platformę i charakter maxRSS jako high-water procesu.
4. Powtórzyć próbę backup/restore z **jedną** własną bazą i najwyżej
   jedną odtworzoną kopią jednocześnie. Próbkować łączne bajty własnego
   katalogu danych + dumpów co najwyżej co 100 ms przez cały przebieg,
   podać maksimum i częstotliwość. Próg z pierwotnego planu **250 MiB**
   nie zmienia się; przekroczenie to `FAIL` budżetu, nawet gdy checkpoint
   później spadnie poniżej progu. Własne pliki robocze pozostają <200 MiB.

Przed jakimkolwiek kodem zapisać tę erratę w osobnym commicie. Potem
oddzielić poprawkę migracji/kodu, lokalne testy i dowód produkcyjny.
Zmiana starej migracji wymaga kontroli checksum na każdym środowisku;
nie wolno zakładać, że `migrate deploy` naprawi automatycznie już
oznaczony jako failed/applied wpis. Operator musi odczytać katalogowe
constrainty i `_prisma_migrations` oraz zatwierdzić dokładną ścieżkę.
Nie ma produkcyjnych migracji, LIVE, resetu ani cleanupu cudzych zasobów.
