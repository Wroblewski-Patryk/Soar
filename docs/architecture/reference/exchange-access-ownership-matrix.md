# Exchange Access Ownership Matrix

Status: Active  
Updated: 2026-05-21

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
| Live exchange order cancel | `apps/api/src/modules/orders/orders.service.ts` through `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.ts` and authenticated connector bootstrap | manual and runtime open-order cancellation for supported LIVE exchange-backed orders | local order-state mutation that pretends to cancel an exchange-backed order before the exchange cancel boundary succeeds |
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
Capability entries describe implementation routing and fail-closed behavior, not
current production-readiness proof for live-money mutation. Production readiness
requires fresh approved evidence for the exact `(exchange, marketType,
operation)` tuple.

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
| `GATEIO` | supported | supported | supported | supported |
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
- `API_KEY_PROBE(exchange) => balance preview, positions, open orders, trade
  history, or execution support`
- `supported on SPOT => supported on FUTURES`
- `supported on BINANCE => supported on another exchange`

| Exchange | `BALANCE_PREVIEW` | `POSITIONS_SNAPSHOT` | `OPEN_ORDERS_SNAPSHOT` | `TRADE_HISTORY_SNAPSHOT` | `WALLET_CASHFLOW_HISTORY` | `LIVE_ORDER_SUBMIT` | `LIVE_ORDER_CANCEL` | Source derivation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `BINANCE` | supported | supported | supported | supported | supported | supported | supported | authenticated-read contract + shared `LIVE_EXECUTION` capability + actual submit/cancel paths through `orders.service.ts` / exchange boundary / live adapter |
| `BYBIT` | unsupported | unsupported | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |
| `OKX` | unsupported | unsupported | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |
| `KRAKEN` | unsupported | unsupported | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |
| `COINBASE` | unsupported | unsupported | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |
| `GATEIO` | supported | supported | supported | supported | supported | supported | supported | selected second-exchange target; balance preview, positions snapshot, open-orders snapshot, trade-history snapshot, wallet cashflow history, live order submit, and live order cancel are supported through canonical exchange boundaries |

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
- `GATEIO` `API_KEY_PROBE` is supported through the profile API-key connection
  test surface using the shared exchange-aware probe service. This validates
  credential reachability/permissions only and does not enable balance preview,
  positions/open-orders/trade-history snapshots, live submit, or exchange-side
  cancel support.
- `GATEIO` `BALANCE_PREVIEW` is supported through the canonical
  authenticated-read boundary and wallet preview route. This reads account
  balance only and does not imply positions/open-orders/trade-history snapshots,
  live submit, or exchange-side cancel support.
- `GATEIO` `POSITIONS_SNAPSHOT` is supported through the canonical
  authenticated-read boundary and positions exchange-snapshot route. This reads
  positions only and does not imply open-orders/trade-history snapshots, live
  submit, or exchange-side cancel support.
- `GATEIO` `OPEN_ORDERS_SNAPSHOT` is supported through the canonical
  authenticated-read boundary and reconciliation snapshot service. This reads
  open orders only and does not imply trade-history snapshots, live submit, or
  exchange-side cancel support.
- `GATEIO` `TRADE_HISTORY_SNAPSHOT` is supported through the canonical
  authenticated-read boundary and trade-history snapshot service. This reads
  executed trades only and does not imply wallet cashflow history, live submit,
  or exchange-side cancel support.
- `GATEIO` `WALLET_CASHFLOW_HISTORY` is supported through the canonical
  exchange adapter boundary for ledger/performance analytics reads. This reads
  deposits, withdrawals, transfers, fees, funding, and income-like account
  history only and does not imply live submit or exchange-side cancel support.
- `GATEIO` `LIVE_ORDER_SUBMIT` is supported through the canonical
  `orders.service.ts` -> `exchangeAdapterBoundary.service.ts` ->
  `liveOrderAdapter.service.ts` path. This enables live submit only; it does
  not imply exchange-side cancel support.
- `GATEIO` `LIVE_ORDER_CANCEL` is supported through the canonical
  `orders.service.ts` -> `exchangeAdapterBoundary.service.ts` -> authenticated
  connector path. Local order state is mutated only after the boundary call
  succeeds.

Canonical owner:

- authenticated reads:
  - `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts`
- write-side execution submit:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/exchange/liveOrderAdapter.service.ts`

Current V1 truth for `LIVE_ORDER_CANCEL`:

- the repository has a local order-cancel route (`POST /orders/:id/cancel`)
  for local/PAPER orders
- exchange-backed LIVE orders for supported exchanges must call the canonical
  exchange cancel boundary before local Soar order state is mutated
- exchange-backed orders without canonical bot/wallet exchange context still
  fail closed with `LIVE_ORDER_CANCEL_UNSUPPORTED`

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
