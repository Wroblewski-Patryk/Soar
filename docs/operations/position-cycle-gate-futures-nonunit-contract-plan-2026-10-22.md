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
