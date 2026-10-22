# Gate.io FUTURES DCA przy niejednostkowym kontrakcie — plan przed poprawką

Stan bazowy: `4f5dbab3e0d6a61886cbffcddf66f1a608f032b6`. Zakres: liniowy,
rozliczany w USDT Gate FUTURES, BACKTEST/PAPER/internal mock LIVE. Real LIVE,
produkcja i nadrzędny `POSITION-CYCLE` pozostają `OPEN` / `NO-GO`.

## Jednostki i źródło metadanych

- [Gate API v4 Futures](https://www.gate.com/docs/developers/apiv4/en/futures/):
  `size` zlecenia oznacza liczbę kontraktów; `quanto_multiplier` mówi, ile
  jednostek aktywa bazowego przypada na kontrakt. `order_size_min` podaje
  minimum kontraktów, a `enable_decimal` rozstrzyga, czy rozmiar może mieć
  część ułamkową. Dla kontraktu liniowego notional USDT to
  `contracts × quanto_multiplier × price`.
- [CCXT Manual](https://github.com/ccxt/ccxt/wiki/Manual) i
  [FAQ](https://github.com/ccxt/ccxt/wiki/FAQ) potwierdzają, że `createOrder`
  `amount` i `position.contracts` to liczba kontraktów; bazowa ilość to
  `contracts × contractSize`. Lokalnie zainstalowany CCXT `4.5.43` bierze
  `market.contractSize` z Gate `quanto_multiplier`, `market.limits.amount.min`
  z `order_size_min`; `parseOrder` i `parseTrade` przenoszą Gate `size` jako
  `amount` kontraktów, a `safeTrade` wylicza `cost` z mnożnikiem.
- Bieżący adapter Soar przekazuje `request.amount` wprost do CCXT
  `createOrder`, przyjmuje `order.filled` i `trade.amount` bez konwersji,
  zapisuje je jako ilość kontraktów. `getSymbolTradingRules` odczytuje
  `market.contractSize`; fallback `normalizeTradeFill` liczy jednak
  `price × quantity` bez mnożnika. CCXT Gate `4.5.43` ustawia krok ilości
  na 1 i nie wystawia `limits.cost.min` dla FUTURES. Rozmiary dziesiętne
  `enable_decimal=true` wymagają osobnej weryfikacji adaptera; nie wolno
  zgadywać kroku ani obejmować kontraktów odwrotnych tym wzorem.
- Kontrakt wewnętrzny: `Order.quantity`, `Order.filledQuantity`,
  `OrderFill.quantity`, `Trade.quantity`, `Position.quantity` dla FUTURES
  pozostają liczbą kontraktów. `price` i średnia są USDT za jednostkę
  bazową. Wkład, budżet, notional, opłata i PnL są w USDT i wymagają
  dodatniego, skończonego `contractSize` w aktywie bazowym na kontrakt.
  Jednostkę trzeba utrwalić przy ENTRY i zachować przez DCA, restart,
  CLOSE i późniejszy refresh/reconcile. Brak wiarygodnej jednostki musi
  zatrzymać automatyczny zapis, a nie przyjąć domyślnie 1.

## Liczbowy test odbioru

Syntetyczny liniowy Gate FUTURES: `contractSize=0,01` jednostki bazowej na
kontrakt, krok/minimum 1 kontrakt, `minNotional=5` USDT tylko w fixture,
leverage 100, fee 0,0004. ENTRY 100 kontraktów po 100 = 1 baza = 100 USDT
notional, 1 USDT margin. Dodatnie DCA ×1 po 130 celuje w 100 USDT:
`100/(130×0,01)=76,923...` kontraktu; zaokrąglenie w dół daje 76,
0,76 bazy i 98,8 USDT notional (margin 0,988 USDT). Po DCA jest 176
kontraktów = 1,76 bazy, wkład 198,8 USDT i średnia
`198,8/1,76=112,954545...` USDT za bazę. CLOSE 176 po 120 daje
211,2 USDT; gross PnL 12,4, trzy opłaty razem 0,164, net PnL +12,236 USDT.

Ujemny wariant: ENTRY 100 po 100, DCA ×1 po 70 daje
`floor(100/(70×0,01))=142` kontrakty = 99,4 USDT. Średnia po 242
kontraktach wynosi `199,4/2,42=82,396694...`. CLOSE przez SL po 80:
193,6 USDT, gross PnL -5,8, fee 0,1572, net -5,9572 USDT. Przy wolnym
margin 0,5 USDT DCA wymagające 0,994 USDT ma zostać odmówione przed
dedupe/intent/submit; osobna reguła ryzyka może później zamknąć dotychczasową
pozycję. Brak `contractSize`, zero, NaN, nieznany krok/precyzja lub
niezgodność metadanych pozycji z rynkiem mają dać odmowę bez zlecenia.

## Ścieżka i warunki wdrożenia

1. ENTRY: pobrać potwierdzone liniowe reguły Gate także dla PAPER, przeliczyć
   budżet USDT na kontrakty, zastosować krok/minimum i nie wydać więcej niż
   cel. Zapisać `contractSize` z momentu ENTRY przy pozycji i zleceniu.
   BACKTEST ma użyć tej samej jawnej jednostki w snapshot konfiguracji;
   bez niej nie twierdzić, że jest parytet z Gate.
2. DCA: dla pozytywnego i negatywnego progu wyliczyć surową liczbę kontraktów
   z wkładu `USDT/(markPrice×contractSize)`, obciąć do kroku, sprawdzić
   minimum i notional oraz realny margin `contracts×contractSize×price/leverage`
   przed dedupe i intentem. DCA nie zmienia znaczenia ilości pozycji.
3. Fill/CLOSE: walidować `cost`/notional jako `price×contracts×contractSize`,
   zachować średnią ważoną kontraktami, przemnożyć gross PnL i szacowane fee
   przez jednostkę. Zamknięcie wysyła liczbę otwartych kontraktów. Ponowienie
   i restart nie mogą utworzyć drugiego DCA lub CLOSE; fee po późniejszym
   reconcile nie może przepisać PnL w złej skali.
4. Niezależny opt-in test na własnej PostgreSQL `_test` i Redisie: pełne
   ENTRY/DCA/CLOSE, dodatni i ujemny wariant, niedofinansowanie/SL,
   brakujące metadane, restart/retry i trwały ledger w BACKTEST/PAPER/mock
   LIVE. Sprawdzić typecheck, testy celowane, docs parity, guardrails i diff.
   Nie uruchamiać generatora grafu ani graph drift w tym checkoutcie.

## Zidentyfikowany warunek bezpieczeństwa

Obecne `Position` i `Order` nie przechowują `contractSize`; ścieżki PnL w
`executionOrchestrator`, `runtimeImmediateFillFinalizer`, finalizacji
zdarzeń giełdy i refreshu finansów liczą `price×contracts`. Sama zmiana
`runtimeDcaOrderRules.ts` otworzyłaby błędny ledger. Nie włączać
`contractSize≠1`, dopóki jednostka nie przejdzie przez wszystkie te ścieżki
i test po restarcie. Jeżeli utrwalenie jednostki oraz pewne metadane
`enable_decimal`/typu kontraktu okażą się niemożliwe w obecnym adapterze,
pozostawić odmowę DCA i zgłosić dokładny blocker do koordynatora.

## Wynik analizy i blocker przed implementacją

Pełna ścieżka pozostaje zablokowana w bieżącej zależności. Pinned CCXT
`4.5.43` w `js/src/gate.js` wystawia dla Gate FUTURES stałe
`precision.amount=1`, nie odczytuje `enable_decimal` do kroku, a w
`createOrder` przesyła `size` jako liczbę. Gate API odróżnia rynki z
`enable_decimal=true`; według [poprawki CCXT #30911](https://github.com/ccxt/ccxt/pull/30911),
scalonej 2026-10-19 i wydanej w `4.5.89`, wcześniejsza wersja potrafi
uciąć ułamkową ilość także w odczycie WS bez nagłówka
`X-Gate-Size-Decimal: 1`. Dla takiego rynku nie da się na podstawie
bieżącego adaptera potwierdzić liczby kontraktów zlecenia, fillu i pozycji.
Nie wolno dodać obsługi tylko dla nominalnie całkowitych kontraktów i
nazywać jej pełnym Gate FUTURES `contractSize≠1`.

Drugi niezależny warunek: CCXT `4.5.43` dla Gate FUTURES wystawia
`limits.cost.min=undefined`, podczas gdy bieżący resolver DCA wymaga
`minNotional>0`. Gate podaje `order_size_min`, lecz dokumentacja nie
określa ogólnego dodatniego minimum notional. Wprowadzanie arbitralnej
wartości lub użycie `price×contracts` bez `contractSize` byłoby zgadywaniem.

Dlatego ten etap kończy się na planie; fail-closed
`DCA_ORDER_RULES_INVALID` dla `contractSize≠1` pozostaje aktywny. Test
odblokowujący: po osobno ocenionej aktualizacji CCXT zweryfikować w
izolowanym adapterze fixture Gate dla `enable_decimal=false` i `true`
(kontrakt, krok, min, `createOrder` amount, `fetchOrder` filled,
`fetchMyTrades` amount/cost i pozycja po restarcie), łącznie z wartościami
ułamkowymi i brakującymi metadanymi. Następnie utrwalić jednostkę przy
ENTRY i przejść opisany wyżej opt-in test trzech trybów na świeżej `_test`
oraz własnym Redisie, w tym fee/PnL/reconcile po retry. Do tego czasu
rzeczywisty venue i produkcja pozostają bez dowodu.

## Zamrożony etap trwałej jednostki ENTRY (HEAD `f401ed19ab73f655ca329d1397615bb413c3026c`)

Zapisana jednostka `contractSize` oznacza aktywo bazowe na **jeden kontrakt**;
FUTURES `Order.quantity`, `Order.filledQuantity` i `Position.quantity`
pozostają kontraktami. Nie wolno wyprowadzać zapisanej jednostki z obecnej
ceny ani późniejszego `market.contractSize`. Zamrożone przypadki:

| ENTRY | Kontrakty | Zapisana jednostka | Baza | Notional przy cenie ENTRY |
| --- | ---: | ---: | ---: | ---: |
| Gate USDT linear integer | 100 | 0,01 | 1 | 100 USDT przy cenie 100 |
| Gate USDT linear decimal | 1,7 | 0,01 | 0,017 | 34 USDT przy cenie 2000 |
| SPOT | 1 bazowa jednostka | 1 | 1 | cena × 1 |

Po restarcie, odczycie order/position, odroczonym fillu i refreshu ma zostać
ta sama zapisana dodatnia, skończona jednostka. Brak lub różnica między
Order, Position i trwałym intentem dla jednego ENTRY wymaga odmowy nowego
intentu/submita przed użyciem bieżących metadanych rynku. Replay istniejącego
intentu pozostaje lookup-only; nie wolno nadpisywać snapshotu wynikiem
nowego `loadMarkets`.

### Matryca migracji i starych rekordów

| Rekord / przypadek | Oczekiwane postępowanie |
| --- | --- |
| Nowy Order i Position Gate FUTURES | Snapshot dodatniego finite `quanto_multiplier` ze zweryfikowanych surowych reguł ENTRY; ten sam snapshot przy późniejszym fillu. Nonunit ENTRY ma pozostać zablokowany, dopóki ledger nie używa tej jednostki. |
| Nowy LIVE intent przed submit | Jednostka musi być zweryfikowana i trwale przypięta przed intentem; ponowienie korzysta z zapisanego snapshotu. Stary intent bez snapshotu nie może dać nowego submitu. |
| Stary Order/Position FUTURES z `NULL` | Kolumna nullable, bez automatycznego backfill `1` i bez pobrania aktualnego rynku jako substytutu historii. Nie dopuszczać nowej akcji wymagającej jednostki, dopóki nie ma niezależnego dowodu/naprawy. |
| Order z jednostką, Position `NULL`, lub dwie różne wartości | Stan niespójny; odmowa nowego intentu/submita, jawna diagnoza, bez cichej korekty. |
| Importowana pozycja bez oryginalnego ENTRY | `NULL` do osobnego reconcile; bieżące metadata mogą służyć diagnostyce, lecz nie są historią ENTRY. |
| SPOT | Jednostka 1 wynika z definicji ilości bazowej; stary `NULL` można czytać jako SPOT unit 1 tylko po potwierdzeniu typu rynku, bez dopisania w bazie. |

### Warunek bezpieczeństwa i granica etapu

Aktualny `executionOrchestrator` liczy fee jako `price×contracts×rate`, a
ścieżki finalizacji/refreshu PnL również używają `price×contracts`. Dla
przykładu 100 kontraktów × 0,01 × 100 to 100 USDT, podczas gdy obecny
rachunek bez mnożnika dałby 10000 USDT. Sam zapis `contractSize` nie pozwala
bezpiecznie uruchomić nonunit ENTRY ani DCA/CLOSE. Dodatkowo LIVE tworzy
`LiveOrderIntent` przed pretrade w adapterze, a obecny payload intentu nie
przechowuje jednostki. Zmiana kolejności walidacji, utrwalenie snapshotu i
ochrona starszych intencji są konieczne przed jakimkolwiek nonunit submitem.
Jeżeli nie da się tego spójnie zamknąć bez ruszania fee/PnL w bieżącym
ograniczonym etapie, pozostawić nonunit ENTRY z odmową i zgłosić blocker.

### Wynik ograniczonego etapu ENTRY

Migracja dodaje nullable `contractSize` do `Order` i `Position`, bez backfillu
historycznych FUTURES. Nowy Gate.io linear USDT FUTURES ENTRY pobiera jednostkę
potwierdzoną przez surowe `quanto_multiplier`, zgodny rozmiar CCXT oraz typ,
walutę kwotowaną i rozliczeniową rynku. Jednostka 1 trafia do trwałego intentu,
Order i Position także przy odroczonym fillu. Retry używa zapisu intentu, nie
bieżących metadanych. Stary intent bez jednostki, aktywny Order lub Position z
`NULL` albo odmienną jednostką blokują nowy intent i submit. Finalny pretrade
odmawia niejednostkowego Gate FUTURES otwarcia. SPOT zachowuje semantykę
jednostki bazowej 1; stare `NULL` nie jest automatycznie przepisywane.

Gate FUTURES `contractSize≠1` nadal pozostaje zablokowany dla ENTRY. DCA,
CLOSE, fee i PnL nie były przeliczane w tym etapie, więc nie ma podstaw do
odblokowania pełnego cyklu. Lokalny test na osobnej PostgreSQL `_test` oraz
typecheck nie są dowodem LIVE ani zachowania produkcji.

### Domknięcie bramki akcji powiązanych z pozycją

Późniejsza kontrola wykazała obejście: `reduceOnly=true` bez `positionId`
omijało sprawdzenie jednostki Gate FUTURES i mogło utworzyć LIVE intent oraz
wejść do submit. Teraz taka komenda jest odrzucana przed intentem. DCA i CLOSE
z `positionId` wymagają pozycji tego użytkownika, bota, portfela i symbolu,
potwierdzonej jako `IN_SYNC`, z `contractSize=1` zapisanym w Position.
Jednostka zostaje przypięta do intentu; finalny pretrade sprawdza ją ponownie
wobec świeżych reguł rynku przed submit. Stare `NULL`, rozbieżność lub
`contractSize≠1` nie dostają nowego intentu/submita. Dokładne ponowienie
wypełnionego CLOSE korzysta z zapisanego intentu bez ponownego submit.

Test RED odtworzył wcześniejsze utworzenie zlecenia bez pozycji. Po poprawce
147/147 testów pięciu powiązanych plików oraz typecheck przeszły na osobnej
bazie PostgreSQL `_test`. Nadal brak dowodu rzeczywistego Gate LIVE i pełnego
cyklu dla `contractSize≠1`.

Niezależny odbiór tego commitu wykrył dwie luki PAPER: runtime CLOSE nie ustawia
`reduceOnly=true`, więc bramka rozpoznawała przeciwne `SELL` dla LONG jako
błędne DCA; ponadto dla pozycji bota PAPER nie wymagała `walletId=NULL`.
Korekta rozpoznaje CLOSE po stronie przeciwnej do pozycji w PAPER i zawsze
porównuje właściwy zakres portfela (`NULL` dla pozycji bota PAPER). Test RED
odtworzył oba błędy, a test GREEN przeszedł przez prawdziwą lokalną ścieżkę
orkiestrator → Order → wypełnienie PAPER → Trade/Position. To nadal nie jest
dowód zachowania giełdy ani produkcji.
