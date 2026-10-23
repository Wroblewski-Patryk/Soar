# 011A: pojemność raw v3 i rollback migracji — plan przed zmianą kodu

Punkt bazowy: `7c72283032c422bd2a51b21c6acec8f17aa67953`.
Ticket: `SOAR-POSITION-PARITY-011A/HISTORICAL-INTRABAR-ORDER-SOURCE`.
Pełne 011A pozostaje `REVIEW`, a wydanie `NO-GO`. Ten wycinek nie dowodzi
produkcyjnych workerów, zakończenia `PENDING` ani filli LIVE/Gate.io.

## Fakt wejściowy i hipoteza

Raw v3 przechowuje całe 1–2 dzienne ZIP w `BYTEA`, choć żądany zakres ma
1–120 świec. Aktualny kod dopuszcza 8 MiB ZIP łącznie, 64 MiB CSV i
20 000 wybranych agregatów; baza ogranicza pojedynczy ZIP do 8 MiB.
Publiczny odczyt HEAD na `data.binance.vision` dla 2026-10-18 wykazał
`Content-Length` BTCUSDT 9 648 212 B, ETHUSDT 12 205 717 B, SOLUSDT
3 278 328 B i ALICEUSDT 205 652 B. Odpowiedzi HEAD nie dowodzą
poprawności checksum, rozmiaru CSV ani zdolności odtworzenia okna.

## Budżet próby i kryteria

- Tylko publiczne ZIP/`.CHECKSUM` Binance USD-M i syntetyczne rekordy;
  najwyżej dwa pełne większe ZIP do 32 MiB pobrania łącznie, dwa odczyty
  nagłówków i jedno ograniczone okno 120 minut na źródło. Bez miesięcznych
  archiwów, trzeciej doby, kluczy, poświadczeń i danych użytkowników.
- Roboczy limit własnych plików najwyżej 200 MiB, własna jednorazowa baza
  `_test` i jej kopia najwyżej 250 MiB łącznie; przed próbą wymagane ponad
  1 GiB wolnego na C:. Czas sieci 20 s na żądanie jak w kodzie, cała
  pojedyncza próba nie dłużej niż 5 min; backup/restore do 10 min.
- Zmierzyć skompresowane i rozpakowane bajty, liczbę wybranych agregatów,
  czas walidacji, przyrost `pg_total_relation_size` i rozmiar `pg_dump`.
  Jeśli próg pamięci/parsing/DB jest niebezpieczny, pozostawić odmowę
  `LIMIT` bez częściowego snapshotu/raportu. Podniesienie limitu wymaga
  jednej stałej sumy ZIP w fetch, replay i SQL oraz ograniczenia CSV/rows.
- Dodatni odbiór: reprezentatywny ZIP większy niż 8 MiB przechodzi pełną
  kontrolę checksum i v3 tylko jeśli mieści się w zadeklarowanym budżecie;
  mniejszy wariant dwóch dni i v1/v2 zachowują dotychczasowe wyniki.
  Negatywne: ponad budżet ZIP/CSV/rows odmawia przed zapisem i PnL,
  przerwana/zmieniona część nadal odmawia przy offline retry/timeline.
- Test rollbacku: na własnej jednorazowej PostgreSQL `_test` przejść schemat
  przed v3 i po v3, zapisać syntetyczne v1/v2/v3, wykonać `pg_dump -Fc`,
  odtworzyć do odrębnej własnej bazy i porównać migracje, raw bytes,
  checksum, relacje i odczyt legacy. Nie usuwać tabeli raw z baz
  współdzielonych; rollback aplikacji po rozpoczęciu nowego workera wymaga
  zgodności czytania v3 lub stop-before-start i decyzji operatora.

## Granica operacyjna

Procedura dla STAGE/PROD ma być instrukcją do zatwierdzenia, nie wykonaną
operacją. Przed migracją: identyfikacja dokładnego SHA, właściciela,
okna, wolnego miejsca, liczby runów/raw i sprawdzona kopia/restore na
odrębnym hoście lub bazie. Po migracji: readback wersji schematu i danych,
API, workerów, kolejki i historycznego v3. Przy niezgodności: zatrzymać
promocję i nowe workery, zachować backup i dowód in-flight, wybrać
kompatybilny build; odtworzenie bazy, utrata danych po checkpoint lub
DROP tabeli są osobnymi nieodwracalnymi krokami wymagającymi jawnej
decyzji operatora. Nie uruchamiać ich w tym zadaniu.
