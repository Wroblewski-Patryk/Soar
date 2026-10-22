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

## Odbiór etapu

Najpierw porównanie `4.5.43`/`4.5.89` bez sieciowego zapisu. Gdy nowa
wersja zachowuje jednostki i nagłówek, zmienić tylko `apps/api/package.json`,
`pnpm-lock.yaml` i celowane testy lub niezbędną normalizację adaptera.
Sprawdzić opt-in test adaptera Gate integer/decimal/missing metadata oraz
istniejące testy adaptera Binance/Gate SPOT/FUTURES, API typecheck,
docs parity i diff. Nie uruchamiać generatora grafu ani graph drift w
brudnym wspólnym checkoutcie. `runtimeDcaOrderRules.ts` ma nadal odmawiać
`contractSize!=1`; fee/PnL/pozycja i rzeczywisty Gate pozostają `OPEN`.
