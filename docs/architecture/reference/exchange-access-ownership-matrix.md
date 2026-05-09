# Exchange Access Ownership Matrix

Status: Active  
Updated: 2026-05-09

## Purpose

Freeze one canonical ownership model for exchange access so API modules do not
reintroduce parallel bootstrap, metadata, or snapshot flows.

## Ownership Matrix

| Access family | Canonical owner | Allowed consumers | Forbidden pattern |
| --- | --- | --- | --- |
| Public market-map loading | `apps/api/src/modules/exchange/exchangePublicRead.service.ts` | symbol rules and future public metadata readers | direct ad hoc `ccxt` market bootstrap in consumer modules |
| Public ticker and candle reads | `apps/api/src/modules/exchange/exchangePublicMarketData.service.ts` | approved market-data stream or polling adapters | feature/runtime modules calling exchange public REST/CCXT directly or reusing Binance fallback data for another exchange |
| Symbol rules resolution | `apps/api/src/modules/exchange/exchangeSymbolRules.service.ts` | orders/manual-order/wallet metadata consumers through metadata contract | duplicate per-module rules loaders |
| Authenticated exchange client bootstrap | `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.ts` (via `exchangeConnectorFactory`) | positions snapshots, wallet balance previews, future authenticated reads | creating authenticated clients directly inside feature modules |
| Live exchange order submit | `apps/api/src/modules/orders/orders.service.ts` through `apps/api/src/modules/exchange/liveOrderAdapter.service.ts` and authenticated connector bootstrap | manual `LIVE` order-open flow and future runtime execution submitters | direct `ccxt` order placement or connector bootstrap inside feature modules |
| Wallet metadata resolution | `apps/api/src/modules/exchange/exchangeMetadataContract.service.ts` | wallets module + manual-order symbol-rule metadata consumers | independent wallet+exchange fallback logic in each module |
| Exchange snapshot reads | `apps/api/src/modules/positions/positions.service.ts` through `exchangeAuthenticatedRead.service.ts` | dashboard positions/exchange sync consumers | direct authenticated client lifecycle ownership outside the shared boundary |
| Wallet ledger exchange-history reads | `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.ts` via `fetchSupportedExchangeWalletCashflowHistoryRaw` and `WALLET_CASHFLOW_HISTORY` capability | wallets ledger ingestion and wallet performance analytics | wallets/bots modules creating authenticated clients or scraping exchange history directly |
| Runtime market events | canonical `MarketStreamEvent` contract consumed by `runtimeSignalLoop.service.ts` | approved market-data stream or polling adapters that publish normalized ticker/candle events | publishing another exchange as `BINANCE`, or routing exchange-specific runtime data around the canonical event router |

## Integration Rules

1. Feature modules consume exchange access through canonical owner services.
2. Canonical owners may expose narrow helper APIs but keep bootstrap ownership
   internal.
3. New exchange-consuming flows must declare whether they need:
   - public metadata/rules access,
   - authenticated snapshot access,
   - wallet metadata context.
4. If a temporary compatibility bridge is required, it must be:
   - single-entrypoint,
   - documented in maintainability inventory,
   - queued for removal.

## Exchange Capability Truth Matrix

Exchange support must be explicit per operation family and must fail closed when
unsupported. Authenticated reads and write-side execution are separate
capability families and must never be inferred from each other.

### Stage 1 - Compatibility-Stage Matrix

The repository still contains exchange-level capability flags used by older
callers and compatibility surfaces:

- `MARKET_CATALOG`
- `PAPER_PRICING_FEED`
- `LIVE_EXECUTION`
- `API_KEY_PROBE`

These flags remain allowed only as coarse compatibility truth. They answer:

- whether a broad exchange family has any currently approved support for that
  area
- whether a caller may enter the exchange module for that capability family at
  all

Current compatibility-stage support:

| Exchange | `MARKET_CATALOG` | `PAPER_PRICING_FEED` | `LIVE_EXECUTION` | `API_KEY_PROBE` |
| --- | --- | --- | --- | --- |
| `BINANCE` | supported | supported | supported | supported |
| `GATEIO` | supported | supported | unsupported | unsupported |
| `BYBIT` | unsupported | unsupported | unsupported | unsupported |
| `OKX` | unsupported | unsupported | unsupported | unsupported |
| `KRAKEN` | unsupported | unsupported | unsupported | unsupported |
| `COINBASE` | unsupported | unsupported | unsupported | unsupported |

They do **not** answer:

- exact market-type support
- exact operation support
- whether spot and futures share the same implementation
- whether account reads, submit, and cancel are all available together

### Stage 2 - Exact-Stage Matrix

The target canonical matrix resolves support by:

```text
(exchange, marketType, operation)
```

Examples:
- `BINANCE + FUTURES + LIVE_ORDER_SUBMIT`
- `BINANCE + SPOT + MARKET_CATALOG`
- `BYBIT + FUTURES + POSITIONS_SNAPSHOT`

This exact-stage matrix is the only form allowed to answer whether a specific
operation is supported for a specific venue context.

### Migration Rules

During the transition from stage 1 to stage 2:

1. broad exchange-level flags may gate entry into a capability family
2. exact behavior must still fail closed at the narrower operation contract
3. feature modules must not invent their own support inference rules
4. new exchange-facing code must prefer the narrowest already-approved contract
5. when stage-1 and stage-2 truth disagree, stage-2 exact operation truth wins

### Forbidden Inferences

Consumers must never infer:

- `LIVE_EXECUTION => BALANCE_PREVIEW`
- `LIVE_EXECUTION => POSITIONS_SNAPSHOT`
- `LIVE_EXECUTION => OPEN_ORDERS_SNAPSHOT`
- `LIVE_EXECUTION => LIVE_ORDER_CANCEL`
- `LIVE_EXECUTION => wallet cashflow history support`
- `BALANCE_PREVIEW => wallet cashflow history support`
- `MARKET_CATALOG(exchange) => MARKET_CATALOG(exchange, all market types)`
- `API_KEY_PROBE(exchange) => authenticated reads or execution support`
- `supported on SPOT => supported on FUTURES`
- `supported on BINANCE => supported on another exchange`

| Exchange | `BALANCE_PREVIEW` | `POSITIONS_SNAPSHOT` | `OPEN_ORDERS_SNAPSHOT` | `LIVE_ORDER_SUBMIT` | `LIVE_ORDER_CANCEL` | Source derivation |
| --- | --- | --- | --- | --- | --- | --- |
| `BINANCE` | supported | supported | supported | supported | unsupported | authenticated-read contract + shared `LIVE_EXECUTION` capability + actual submit path through `orders.service.ts` / `liveOrderAdapter.service.ts`; no canonical exchange-cancel path yet |
| `BYBIT` | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |
| `OKX` | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |
| `KRAKEN` | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |
| `COINBASE` | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |
| `GATEIO` | unsupported | unsupported | unsupported | unsupported | unsupported | selected second-exchange target; public market catalog is supported through the exchange adapter registry, while authenticated reads and execution remain fail-closed until exact operation adapters are implemented and verified |

Runtime market-event boundary:

- canonical runtime market events may carry any registered `Exchange`
- the Binance websocket normalizer still emits only `BINANCE`
- Gate.io runtime events are allowed only as normalized input from the approved
  exchange-owned public market-data reader and market-stream polling adapter
- Gate.io public ticker and candle reads are available inside the exchange
  module through the public market-data reader, and app `GATEIO/FUTURES`
  resolves to CCXT `swap` for perpetual futures
- Gate.io public symbol rules are available through
  `exchangeSymbolRules.service.ts` when `MARKET_CATALOG` is supported; this
  is public metadata only and does not imply authenticated reads or live
  execution support
- `GATEIO` `PAPER_PRICING_FEED` is supported for public `FUTURES` paper
  runtime after the approved exchange-owned polling source emitted real ticker
  and final-candle events. This is public pricing only and does not imply
  authenticated reads, live order submit, or exchange-side cancel support.

Canonical owner:

- authenticated reads:
  - `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts`
- write-side execution submit:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/exchange/liveOrderAdapter.service.ts`

Current V1 truth for `LIVE_ORDER_CANCEL`:

- the repository has a local order-cancel route (`POST /orders/:id/cancel`)
  that mutates Soar order state
- it does **not** yet provide a canonical exchange-side cancel boundary
- therefore `LIVE_ORDER_CANCEL` must remain `unsupported` for every exchange in
  this matrix until a real exchange-cancel path exists

Consumers must never:

- hardcode `BINANCE` while route input accepts broader `exchange`,
- infer support from `LIVE_EXECUTION`,
- infer exchange-side cancel support from the existence of a local cancel route,
- infer support for one `marketType` from another `marketType`,
- or silently narrow to another exchange at runtime.

## Non-Goals

- This contract does not redefine trading behavior, lifecycle semantics, or
  exchange business rules.
- This contract does not move runtime logic into exchange modules; it only
  freezes access ownership boundaries.
