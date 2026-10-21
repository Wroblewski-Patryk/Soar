# SOAR-STRATEGY-MOMENTUM-PERIOD-001 — plan przed poprawką

Plan na bazowym SHA `2eb1b1acca9a395ba59f646087c8db5890032d61`.
Decyzja właściciela z 2026-10-21: nowe MOMENTUM `period=1` odrzucać;
istniejące definicje po odczytowym spisie jawnie przestawić na `2` przy
zachowaniu dotychczasowych decyzji botów. Efektywny kernel już klamruje 1 do
2. Żaden zapis produkcyjny, deploy ani real LIVE nie należy do tego zadania.

## Granica danych

Jedynym aktywnie migrowanym rekordem jest `Strategy.config` (po stronie
użytkownika). Spis obejmuje `open.indicatorsLong` i `open.indicatorsShort`
(albo starszy alias `openConditions`, gdy `open` nie istnieje),
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

## Wynik lokalny 2026-10-21

Plan powyżej wypchnięto przed kodem w SHA
`67a2e86c27209fafb443ffc6a80ab00de87f01c3`. Podczas implementacji
doprecyzowano starszy alias `openConditions`, z którego evaluator korzysta,
gdy `open` nie istnieje. Nowy kod walidacji API zwraca 400 z komunikatem
`MOMENTUM period must be at least 2` i ścieżkami pól dla create, update i
import. GET/eksport starej definicji nadal pokazują 1 do czasu jawnej
migracji; update bez `config` nie migruje jej. Formularz Web blokuje taki
zapis i pokazuje informację we wszystkich czterech lokalizacjach.

Lokalny skrypt `pnpm exec tsx scripts/migrateMomentumPeriodOne.ts` bez flag
wykonał wyłącznie spis. Dla przygotowanej starej definicji podał jednego
kandydata, jedno pole, jeden aktywny kanoniczny link bota i jeden powiązany
historyczny run; digest spisu był
`0098038a8c78eb860779d93f652432a91195359557af5c92356a9e57b29277f5`.
Apply z tym dokładnym digestem zmienił jeden rekord i jedno pole. Następny
spis nie miał kandydatów. Test API osobno wykazał odmowę przy niezgodnym i
przestarzałym digestcie, idempotencję drugiego apply, zachowanie obcego pola
JSON, aktywności powiązanego bota i niezmieniony historyczny `seedConfig`.
Wynik CLI pochodzi wyłącznie z własnej `_test`; nie jest spisem produkcyjnym.

Evaluator na finalnych świecach o close `[1,2,3,4]` dał te same decyzje dla
starego 1 i jawnego 2: LONG `[null,null,LONG,LONG]`, SHORT
`[null,null,SHORT,SHORT]` przy osobnych progach. Na publicznym źródle
`ALICEUSDT` test 011 najpierw zapisał starą definicję, jawnie zmigrował ją
do 2 i potwierdził zachowanie `[null,null,LONG,null,null]`; następnie ten
sam zapis przeprowadził przez BACKTEST, PAPER i Binance FUTURES internal mock
LIVE z jednym DCA i TTP, bez EXIT po zaniku sygnału. BACKTEST miał sześć
trades i raport `+0,01386` USDT; PAPER i mock LIVE miały po
`-0,02231404958610045` USDT w pierwszym cyklu. Historyczne fixture,
które w testach przez API tworzyły *nową* strategię z 1, zapisano jawnie
jako 2; ich dotychczasowe efektywne obliczenie pozostaje takie samo.

Własny PostgreSQL `soar_momentum_period_001_test` na porcie 5581 po 84
migracjach oraz Redis na porcie 6421: API CRUD `16/16`, jednostkowe
policy/evaluator `36/36`, Web form/map/validation `22/22`, publiczny test
trzech trybów `1 PASS / 2 SKIP`. API i Web typecheck, docs parity,
guardrails oraz strict architecture graph drift `939/939` przeszły.
Po cleanup User/Strategy/BacktestRun/Bot w `_test` wynosiły `0/0/0/0`,
Redis miał zero kluczy. Nie było deploy, produkcyjnego zapisu ani real LIVE.

Do zamknięcia ticketu pozostają odczytowy spis produkcyjnych definicji,
zatwierdzenie dokładnego digestu i osobne wykonanie migracji w oknie
operacyjnym oraz niezależny odbiór. Historyczne snapshoty i raporty mają
pozostać bez zmian; obecny wynik pozostaje REVIEW/NO-GO.

## Uzupełnienie planu po niezależnym FAIL na `ab2652da29f2580d5454be4a50584bf400087089`

Statyczny odbiór wskazał trzy luki przed ponownym odbiorem. Publiczne
create/update/import i wewnętrzny import PAPER muszą przyjmować jedynie
**liczbę całkowitą** `MOMENTUM` z efektywnym `params.period` (albo aliasem
`params.length`) w przedziale `[2,255]`; obecny `clampPeriod` zaokrągla lub
klamruje także 0, 1, 1.5, string i >255, więc walidacja ma odmawiać każdej
takiej jawnej wartości przed zapisem. Brak parametru pozostaje domyślnym 14.
W testach przypiąć deterministyczny kod i ścieżkę dla tych wariantów.

Spis i migracja 1→2 mogą dotknąć tylko reguł wykonywanych przez parser:
`open` albo fallback `openConditions`, `indicatorsLong/Short`, poprawnej
reguły i jej faktycznie użytego operandowego `MOMENTUM`. Nie wolno przechodzić
rekurencyjnie przez metadata lub ignorowane pola. Kontrprzykład
`EMA` z `metadata:{name:'MOMENTUM',params:{period:1}}` musi zostać przyjęty
bez zmiany metadata i bez kandydata w spisie. Fallback runtime dla
historycznego 1 pozostaje, aby stare snapshoty nadal dawały efektywne 2.

Import PAPER ma zbadać wszystkie `snapshot.data.strategies[].config` **przed**
`ensureUser` i transakcją. Nieprawidłowa strategia ma zatrzymać import bez
jakiegokolwiek zapisu, zarówno przy nowym ID, jak i upsert istniejącego.
Test subprocessu na własnej `_test` sprawdzi odmowę i brak User/Strategy.
Wykonania produkcyjnego ani zmiany historycznych snapshotów nie ma w tym
uzupełnieniu. Po kodzie ponowić API/Web i lokalny dry-run/apply, typecheck,
guardrails oraz strict graph drift; przekazać exact SHA do nowego odbioru.

### Wynik lokalnej poprawki po FAIL

Walidacja API odmawia jawnych wartości `0`, `1`, `1.5`, string `"1"`/`"2"`
oraz `256` z kodem `INVALID_MOMENTUM_PERIOD`, ścieżką pola i granicami
`2..255`. Ta sama walidacja działa przed zapisem w publicznym
create/update/import i w imporcie snapshotu PAPER, zanim ten utworzy
użytkownika albo wykona upsert. Brak okresu zachowuje domyślne 14.

Spis korzysta z parsera ewaluatora i ogląda tylko wykonywalne reguły oraz
wybrany operand. EMA z `metadata.name=MOMENTUM` i `period=1` jest przyjmowana
bez zmiany oraz bez kandydata. Istniejące wykonywalne 1 trafia do migracji
1→2; inna niedozwolona wartość trafia do `unsafe` i blokuje apply. Test API
potwierdził także ochronę digestu, zachowanie `seedConfig` historycznego
backtestu, aktywnego bota i ponowny pusty apply.

Dowody na własnym PostgreSQL `soar_momentum_period_001_test` (127.0.0.1:5581,
84 migracje) i Redis (127.0.0.1:6421): API strategie `16/16`, polityka
`12/12`, Web form i walidacja `19/19`, import PAPER subprocess `2/2`.
Typecheck API/Web, `docs:parity:check`, `quality:guardrails` i
`architecture:graph:drift:strict` (`939/939`) przeszły. Po sprzątaniu
User/Strategy/BacktestRun/Bot `0/0/0/0`, Redis `0` kluczy. To jest dowód
lokalny; nie wykonano spisu ani migracji produkcyjnej, deploy ani real LIVE.
Status ticketu pozostaje REVIEW/NO-GO do niezależnego odbioru i osobnego
okna operacyjnego dla spisu oraz migracji produkcyjnej.

## Uzupełnienie po niezależnym FAIL na `2aae38d0fc9fa8e67cf5ad2e2f560af1c817e117`

Web błędnie traktuje każdy `operand.kind='constant'` jako wybrany. Gdy jego
`value` nie jest skończoną liczbą, parser evaluatora odrzuca operand jawny i
może wybrać serię z pola `value`. Dla EMA z
`value:{indicator:'MOMENTUM',params:{period:1}}` i
`operand:{kind:'constant',value:'invalid'}` API słusznie odrzuca zapis,
ale formularz nie pokazuje własnej walidacji.

Poprawka Web ma odwzorować wybór operandu parsera: poprawna stała lub seria
jawna mają pierwszeństwo, niepoprawny operand jawny dopuszcza fallback na
serię z `value`, a porównanie z wybraną band jest niewykonywalne. Dla reguł
zakresowych wybierana jest wyłącznie poprawna band. Test obejmie LONG i SHORT,
niepoprawną jawną stałą, poprawną stałą i jawny operand serii oraz wynik
formularza. Kontrole: celowane Vitest Web i typecheck, a potem selektywny
commit/push bez zmiany API, produkcji lub obcych plików.
