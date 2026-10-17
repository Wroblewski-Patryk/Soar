# LIVE order intent and unknown outcome

## Submission contract

For a LIVE order, `openOrder` commits `LiveOrderIntent` before any exchange `createOrder` call. The intent stores a unique venue `clientOrderId`, user, venue, symbol and command fingerprint. Its UUID becomes the local `Order.id`. A repeated request with the same client ID and fingerprint reads the existing order or queries the exchange; it never sends another `createOrder`. A different command with the same client ID fails with `LIVE_INTENT_CONFLICT`.

The exchange adapter calls `createOrder` once, regardless of the legacy retry-policy input. If submission throws or returns no exchange order ID, the service queries by the same client ID. A successful lookup follows the normal local order/fill lifecycle. A missing, failed, unsupported, or terminal-state lookup returns `LIVE_EXECUTION_UNKNOWN` with the intent/order ID and client ID. The intent remains durable. This response does **not** mean the order was rejected or never reached the exchange. A later retry with the same ID repeats only the lookup. Runtime deduplication allows this lookup retry. Pretrade errors known to occur before submission remove the unused intent and preserve their original error.

Runtime-generated IDs remain unchanged on Binance. Gate.io uses a deterministic 27-character `soar_` ID derived from the runtime ID; CCXT adds the required `t-` prefix for Spot and Futures. The manual order UI sends one request-scoped ID and retains it in browser storage for the same form after an error or reload. A successful response clears it. API clients can send `clientOrderId` directly and should reuse it for retries.

## Venue limits and operator handling

The venue ID is a lookup key, not a permanent exchange-side idempotency guarantee. Binance's Futures `newClientOrderId` is unique among open orders; historical order queries have retention limits. Gate.io custom `text` IDs are prefixed `t-` and have length and query-window limits. Therefore a `not found` response never authorizes resubmission. Inspect the exchange account/order history and the durable intent before taking a new trading action. The pending intent is not deleted automatically.

Source contracts: [Binance Spot trading REST](https://developers.binance.com/en/docs/catalog/core-trading-spot-trading/api/rest-api/trade), [Binance USD-M Futures trading REST](https://developers.binance.com/en/docs/catalog/core-trading-derivatives-trading-usd-s-m-futures/api/rest-api/trade), [Gate.io Spot API](https://www.gate.com/docs/developers/apiv4/en/spot/), [Gate.io Futures API](https://www.gate.com/docs/developers/apiv4/en/futures/).

## Rollout and verification

Deploy the additive Prisma migration before the API code. Existing orders need no backfill; only new LIVE submissions use intents. Rollback of application code is possible while retaining the table. Do not drop the table while unresolved intents exist.

The local order insert and periodic open-order importer serialize on the same PostgreSQL advisory transaction lock for a user and exchange order ID. If an exchange snapshot already imported an order after a lost response, the intent stays unresolved and returns `LIVE_EXECUTION_UNKNOWN` rather than creating another local order. An operator must reconcile the imported row and intent before declaring the command complete.

Validation uses the isolated `_test` database and mocked exchange clients: accepted-but-timeout, unresolved timeout followed by restart/retry, single submit, Binance/Gate Spot/Futures ID mapping, and manual UI reuse of a client ID. A real signed-in LIVE read/submit flow and exchange-history reconciliation were not executed by this change; they require a separately authorized safe environment. Until then, this is code and isolated-test evidence, not production acceptance.
