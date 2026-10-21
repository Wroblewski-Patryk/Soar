# SOAR-STRATEGY-MOMENTUM-PERIOD-001 — plan przed poprawką

Plan na bazowym SHA `2eb1b1acca9a395ba59f646087c8db5890032d61`.
Decyzja właściciela z 2026-10-21: nowe MOMENTUM `period=1` odrzucać;
istniejące definicje po odczytowym spisie jawnie przestawić na `2` przy
zachowaniu dotychczasowych decyzji botów. Efektywny kernel już klamruje 1 do
2. Żaden zapis produkcyjny, deploy ani real LIVE nie należy do tego zadania.

## Granica danych

Jedynym aktywnie migrowanym rekordem jest `Strategy.config` (po stronie
użytkownika). Spis obejmuje `open.indicatorsLong` i `open.indicatorsShort`,
zagnieżdżone operandy serii zarówno w `operand`, jak i w `value`, oraz
`params.period` i zgodny z kernelem alias `params.length`, gdy `period` brak.
Zwykłe inne wskaźniki nie są ruszane. Rozpoznanie nazwy musi odpowiadać
`MOMENTUM` używanemu przez evaluator/kernel. Ścieżka pola i liczba zmian są
jawne w dry-run; zamiana zmienia tylko wskazane `1` na `2`, bez naruszania
pozostałego JSON.

Historyczne `BacktestRun.seedConfig`, snapshoty połączeń strategii, raporty,
trades i zapisane wyniki pozostają bez zmian. Stare snapshoty `period=1`
zachowują dotychczasowe efektywne `2` w evaluatorze. Nie usuwamy clampu
runtime przed spisem i odbiorem, bo historyczne oraz aktywne konfiguracje mogą
jeszcze zawierać 1. Nie normalizujemy po cichu w GET ani eksporcie.

## Granica zapisu i Web

Wspólna walidacja API musi zwrócić czytelny kod 400 i ścieżkę pola dla
`POST /dashboard/strategies`, `PUT /dashboard/strategies/:id` z nowym
`config` oraz `POST /dashboard/strategies/import`. Obie strony LONG/SHORT,
bezpośrednia reguła i seria w operandzie podlegają tej samej regule.
`GET` i eksport istniejącej definicji są odczytem i nie zmieniają jej.
Update bez `config` nie jest migracją i nie może przepisać definicji.

Metadane wskaźnika w API już podają `min=2`; formularz Web musi dodatkowo
blokować wysłanie wczytanej lub ręcznie podmienionej wartości 1 i pokazać
zrozumiałą informację. Po migracji ponowny odczyt oraz zapis mają pokazać 2.
Server pozostaje ostateczną granicą dla dowolnego klienta.

## Kolejność i bezpieczna migracja

1. Odczytowy spis wszystkich zapisanych `Strategy.config`: tylko identyfikatory,
   ścieżki pól, liczba kandydatów i digest wersji rekordów; bez publikowania
   prywatnych konfiguracji. Sprawdzić też liczbę aktywnych botów powiązanych z
   kandydatami i zakres snapshotów historycznych, bez ich modyfikacji.
2. Na własnej `_test` i Redisie wykazać, że `1` i `2` dają identyczne decyzje
   na finalnych świecach `[1,2,3,4]` (w tym LONG i SHORT) w evaluatorze oraz
   ścieżkach BACKTEST/PAPER/internal mock LIVE. Prawdziwy okres 1 dawałby inny
   wynik, więc świadek musi odróżniać skuteczne 2.
3. Dodać opt-in skrypt migracji: domyślnie tylko dry-run; apply wymaga digestu
   dokładnie tego spisu, ponownego porównania wersji rekordów w transakcji i
   warunku zapobiegającego nadpisaniu równoległej edycji. Błąd lub nowy
   kandydat zatrzymuje całość. Lokalny test potwierdzi idempotencję i brak
   zmian poza konfiguracją strategii. Wykonanie produkcyjne pozostaje osobną
   bramką po niezależnym przeglądzie spisu.
4. Rollout: najpierw przejrzeć spis; wdrożyć API/Web odmowy nowych 1, następnie
   po zatwierdzeniu dokładnego digestu wykonać migrację istniejących rekordów.
   Ponowić spis i porównać liczbę 1/2 oraz decyzje powiązanych botów. Nie
   przepisywać raportów i nie wnioskować o LIVE na podstawie lokalnych testów.

## Odbiór lokalny

Regresja create/read/update/import API obejmie czytelny 400 dla nowych 1,
odczyt starego 1, odmowę edycji z 1, brak zmiany przy odrzuconym zapisie i
poprawny zapis 2. Web obejmie widoczną walidację oraz brak wysłania.
Dry-run ma być bez zapisów; lokalny apply po zgodnym digestcie ma zmienić
wyłącznie kandydatów, a drugi przebieg dać zero zmian. Różne digesty mają
odmawiać apply. Testy na własnej `_test`/Redisie, typecheck, guardrails i
strict graph drift kończą lokalny etap. Ticket pozostaje REVIEW/NO-GO bez
produkcyjnego spisu, migracji i niezależnego odbioru.
