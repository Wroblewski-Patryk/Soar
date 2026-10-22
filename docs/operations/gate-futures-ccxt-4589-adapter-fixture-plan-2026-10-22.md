# Gate FUTURES decimal size — zamrożony plan izolowanego testu adaptera

Stan wejściowy: `23dad672d59f70ee2e1e4f78a7faa6f57384f35b`. Etap
odblokowuje wyłącznie zależność adaptera dla przyszłego `contractSize!=1`.
Nie włącza DCA nonunit ani nie zmienia ledgera pozycji.

## Kandydat i źródła

Kandydat: **CCXT `4.5.89` dokładnie**, npm integrity
`sha512-m+TaSeWS5syv83InmSo+ZR2Mdt+tP6O6/vRuNNSiNtk3gUeXmrZSGgssR+t7BhNjIY286vYKhQZN0tgM/j6kyQ==`.
Stara wersja: `4.5.43`. [Gate API FUTURES](https://www.gate.com/docs/developers/apiv4/en/futures/)
definiuje `size` jako liczbę kontraktów i `quanto_multiplier` jako bazę na
kontrakt. [CCXT #30911](https://github.com/ccxt/ccxt/pull/30911),
wydany w `4.5.89`, dodaje obsługę `enable_decimal`, string `size` i nagłówek
`X-Gate-Size-Decimal: 1` na futures REST/WS.

## Zamrożone fixture i oczekiwania

Oba syntetyczne kontrakty są liniowe, USDT settled, `swap` i mają cenę
2000/50000 USDT za bazę. Nie przypisujemy tych liczb do aktualnego rynku.

| Fixture | Gate metadata | Zlecenie i odczyt | Ekonomia |
| --- | --- | --- | --- |
| `BTC_USDT` integer | `quanto_multiplier="0.0001"`, `order_size_min="1"`, `enable_decimal=false` | `amount=2` kontrakty, `size` całkowite 2; `parseOrder` i `fetchOrder` filled=2; trade amount=2 | 0,0002 BTC, przy 50000 notional 10 USDT |
| `ETH_USDT` decimal | `quanto_multiplier="0.01"`, `order_size_min="0.1"`, `enable_decimal=true` | `amount=1.7` kontraktu, `size="1.7"`; order `left="0.4"` daje filled=1.3; trade `size="-0.3"` daje abs amount=0.3 | 0,017 ETH, przy 2000 notional 34 USDT; trade 0,3 kontraktu = 6 USDT |

Zarówno publiczne `loadMarkets`/`market`, jak i `getSymbolTradingRules`
powinny pokazać odpowiednio `contractSize` 0,0001/0,01, precision/min 1/0,1
i tryb TICK_SIZE. Dla requestu Gate FUTURES po zmianie oczekiwany nagłówek
to `X-Gate-Size-Decimal: 1`; SPOT nie dostaje tego nagłówka. Porównać
stary i nowy pakiet offline na identycznym wejściu, w tym `parseOrder`,
`parseTrade`, `createOrderRequest` i `sign`; żadnego realnego submitu.

Brak `quanto_multiplier`, zero, NaN, brak `order_size_min`, nieznany tryb
precyzji lub niezgodność `enable_decimal` ze step mają pozostawić
wykonanie zablokowane przed wysłaniem zlecenia. Nie podstawiać fikcyjnego
`minNotional`: CCXT Gate FUTURES nie podaje `limits.cost.min`; tę lukę
rejestrować jawnie do późniejszego etapu reguł venue.

## Odtworzone luki P0 i oczekiwany fail-closed

Registry przekazuje publiczne `GATEIO` jako `gateio` do dynamicznej fabryki
`ccxtModule[exchangeId]`, lecz CCXT `4.5.89` eksportuje konstruktor `gate`,
nie `gateio`. Test bez sieci ma przejść przez prawdziwą fabrykę dla Gate
SPOT i FUTURES, potwierdzić `loadMarkets` i brak submitu. Publiczna nazwa
`GATEIO` pozostaje bez zmian; wewnętrzna nazwa konstruktora to `gate`.

CCXT `parseContractMarket` przy surowym Gate `quanto_multiplier="0"`
zwraca `contractSize=1`; brak lub niefinitywna wartość daje wartość
nieokreśloną. Soar musi odczytać surową wartość dla reguł Gate FUTURES:
zero, brak i niefinitywna wartość mają dać `contractSize=null`, a DCA musi
odmówić przed intentem i transportem. Nie używać domyślnego `1` z CCXT jako
dowodu poprawnej wielkości kontraktu.

## Odbiór etapu

Najpierw porównanie `4.5.43`/`4.5.89` bez sieciowego zapisu. Gdy nowa
wersja zachowuje jednostki i nagłówek, zmienić tylko `apps/api/package.json`,
`pnpm-lock.yaml` i celowane testy lub niezbędną normalizację adaptera.
Sprawdzić opt-in test adaptera Gate integer/decimal/missing metadata oraz
istniejące testy adaptera Binance/Gate SPOT/FUTURES, API typecheck,
docs parity i diff. Nie uruchamiać generatora grafu ani graph drift w
brudnym wspólnym checkoutcie. `runtimeDcaOrderRules.ts` ma nadal odmawiać
`contractSize!=1`; fee/PnL/pozycja i rzeczywisty Gate pozostają `OPEN`.

## Wynik lokalny adaptera

Porównanie offline `4.5.43` i `4.5.89` na tych samych syntetycznych
kontraktach: stara wersja zaokrąglała decimal `1.7` do `1` i nie wysyłała
nagłówka; nowa zachowuje `size="1.7"`, `precision.amount=0.1` oraz
`X-Gate-Size-Decimal: 1`. Odczyt order `filled=1.3` i trade `amount=0.3`,
`cost=6` zachowuje liczbę kontraktów i kwotę. Integer fixture pozostał
`size=2`, trade `amount=2`, `cost=10`; SPOT nie ma decimal header.

Przed poprawką dwa izolowane testy wykazały `Unsupported CCXT exchange:
gateio` i przekształcenie surowego `quanto_multiplier="0"` w regułę
`contractSize=1`. Po poprawce registry otwiera Gate SPOT/FUTURES przez
rzeczywisty konstruktor CCXT z atrapą `loadMarkets`, a reguły dla 0/braku/NaN
zwracają `contractSize=null` i resolver DCA odmawia. Nie było transportu
zlecenia ani testu rzeczywistej giełdy.

Niezależny review pierwszego SHA `1c7283c2224c95a80072f50e8e2156077b9cc5c4`
wykrył drugą osiągalną fabrykę CCXT: próba klucza API nadal szukała
`ccxtModule['gateio']` i zwracała `UNKNOWN` z oboma uprawnieniami `false`.
Był to niezależny `FAIL` probe; izolowany test RED przez rzeczywistą
fabrykę probe odtworzył tę odmowę.
Poprawka mapuje publiczne `GATEIO` na wewnętrzne `gate` także tutaj;
test GREEN sprawdza SPOT i FUTURES (`defaultType` i parametry balance)
bez sieci oraz kontrolnie obie ścieżki Binance. To nadal nie dowodzi
rzeczywistych uprawnień żadnego klucza.

Manifest pakietu w `apps/api/package.json` i lock wskazują dokładnie
`ccxt@4.5.89` z przypiętą integralnością npm, a załadowana biblioteka
zwraca wewnętrzne `ccxt.version="4.5.88"`. To rozbieżność metadanych
wewnątrz wydanego pakietu; dowodem użytej wersji są package/lock i
sprawdzone zachowanie `createOrderRequest` oraz `sign`, nie sam `ccxt.version`.

## Odbiór końcowego adaptera

Autor na dokładnym kodowym SHA `75a4035dbb1edbc83d52dd33dac73266b3c6d964`
potwierdził `18` plików i `152 PASS`, API typecheck, docs parity oraz diff
check. Manifest i lock przypinają `ccxt@4.5.89`; registry i próba klucza API
mapują publiczne `GATEIO` na konstruktor `gate`, a surowy Gate FUTURES
`quanto_multiplier` równy zero, brakujący lub `NaN` daje odmowę
zamiast domyślnego `contractSize=1`. Wewnętrzne `ccxt.version` nadal podaje
`4.5.88`; wersję pakietu identyfikują manifest, lock, npm integrity i
sprawdzone zachowanie. Wcześniejszy `FAIL` probe na `1c7283c2224c95a80072f50e8e2156077b9cc5c4`
pozostaje historycznym wynikiem przed tą korektą.

Niezależny reviewer dał ograniczony statyczny `PASS` na tym samym
końcowym SHA: `57/57` testów w 3 plikach, API typecheck, docs parity i
diff check `PASS`. Odrębny niezależny QA dał ograniczony lokalny `PASS`:
`89/89` testów w 6 plikach, API typecheck i docs parity `PASS`;
SHA-256 logu QA
`0f2be3d8da269cefeb796e2ce047345ca60c248c189b7efe209c16eac92795ce`.
To testy offline na fixture i mock transporcie, bez zlecenia w realnym Gate.

Ten odbiór dotyczy adaptera, nie odblokowuje nonunit DCA. `contractSize`
nie jest jeszcze trwale zapisany przy pozycji i zleceniu, rzeczywiste
minimum notional Gate pozostaje niepotwierdzone, a osobnych asercji
`order_size_min` oraz zgodności `enable_decimal` ze step nie ma. DCA dla
`contractSize!=1` nadal odmawia fail-closed; ledger fee/PnL po DCA,
rzeczywisty LIVE, produkcja i pełny `POSITION-CYCLE` pozostają bez odbioru.
Wydanie `NO-GO`.

## Zamrożony odbiór uzupełniający metadanych (HEAD wejściowy `f49968a14b6f0b0050571bf0d441fea459e5a773`)

Test pozostaje lokalny i bez sieci. Dwa rynki są syntetycznymi liniowymi
Gate `swap`, rozliczanymi w USDT; `amount`, `size`, `filled` i trade `amount`
oznaczają **kontrakty**, nie bazową ilość. Wartości liczbowe są ustalone
przed zmianą testów:

| Rynek | Surowe Gate | Oczekiwane market/rules | Submit i odczyt offline | Baza i USDT |
| --- | --- | --- | --- | --- |
| `BTC_USDT` integer | `quanto_multiplier="0.0001"`, `order_size_min="1"`, `enable_decimal=false` | `contractSize=0.0001`, min=1, step=1, TICK_SIZE, `minNotional=null` | request `amount=2` → `size=2` (number), futures header `X-Gate-Size-Decimal: 1`; `fetchOrder.filled=2`, `fetchMyTrades.amount=2`, `cost=10` | 2 kontrakty × 0,0001 = 0,0002 BTC; × 50000 = 10 USDT |
| `ETH_USDT` fractional | `quanto_multiplier="0.01"`, `order_size_min="0.1"`, `enable_decimal=true` | `contractSize=0.01`, min=0.1, step=0.1, TICK_SIZE, `minNotional=null` | request `amount=1.7` → `size="1.7"`, ten sam futures header; order `size=1.7`, `left=0.4` → `filled=1.3`; trade `size=-0.3` → `amount=0.3`, `cost=6` | request 0,017 ETH / 34 USDT; filled 0,013 ETH / 26 USDT; trade 0,003 ETH / 6 USDT |

Ujemne fixture: surowe `quanto_multiplier` brak/0/NaN/Infinity oraz
rozbieżność z `market.contractSize` dają `rules.contractSize=null`.
Surowe `order_size_min` brak/0/NaN, różnica względem
`market.limits.amount.min`, brak `enable_decimal`, `enable_decimal=false`
z ułamkowym minimum/krokiem oraz `enable_decimal=true` z krokiem różnym
od dodatniego `order_size_min` dają niekompletne reguły (`minAmount` lub
`amountPrecision=null`). Wszystkie takie przypadki mają zatrzymać DCA
przed intentem i `createOrder`; test może podać wyłącznie syntetyczny
`minNotional=1` do izolacji powodu odmowy. Rzeczywistego minimum Gate
nie wolno wyprowadzać z ceny ani tej fixture.
