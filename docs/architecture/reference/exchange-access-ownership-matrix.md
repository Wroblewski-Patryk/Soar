# Exchange Access Ownership Matrix

Status: Active  
Updated: 2026-04-25

## Purpose

Freeze one canonical ownership model for exchange access so API modules do not
reintroduce parallel bootstrap, metadata, or snapshot flows.

## Ownership Matrix

| Access family | Canonical owner | Allowed consumers | Forbidden pattern |
| --- | --- | --- | --- |
| Public market-map loading | `apps/api/src/modules/exchange/exchangePublicRead.service.ts` | symbol rules and future public metadata readers | direct ad hoc `ccxt` market bootstrap in consumer modules |
| Symbol rules resolution | `apps/api/src/modules/exchange/exchangeSymbolRules.service.ts` | orders/manual-order/wallet metadata consumers through metadata contract | duplicate per-module rules loaders |
| Authenticated exchange client bootstrap | `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.ts` (via `exchangeConnectorFactory`) | positions snapshots, wallet balance previews, future authenticated reads | creating authenticated clients directly inside feature modules |
| Live exchange order submit | `apps/api/src/modules/orders/orders.service.ts` through `apps/api/src/modules/exchange/liveOrderAdapter.service.ts` and authenticated connector bootstrap | manual `LIVE` order-open flow and future runtime execution submitters | direct `ccxt` order placement or connector bootstrap inside feature modules |
| Wallet metadata resolution | `apps/api/src/modules/exchange/exchangeMetadataContract.service.ts` | wallets module + manual-order symbol-rule metadata consumers | independent wallet+exchange fallback logic in each module |
| Exchange snapshot reads | `apps/api/src/modules/positions/positions.service.ts` through `exchangeAuthenticatedRead.service.ts` | dashboard positions/exchange sync consumers | direct authenticated client lifecycle ownership outside the shared boundary |

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

| Exchange | `BALANCE_PREVIEW` | `POSITIONS_SNAPSHOT` | `OPEN_ORDERS_SNAPSHOT` | `LIVE_ORDER_SUBMIT` | `LIVE_ORDER_CANCEL` | Source derivation |
| --- | --- | --- | --- | --- | --- | --- |
| `BINANCE` | supported | supported | supported | supported | unsupported | authenticated-read contract + shared `LIVE_EXECUTION` capability + actual submit path through `orders.service.ts` / `liveOrderAdapter.service.ts`; no canonical exchange-cancel path yet |
| `BYBIT` | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |
| `OKX` | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |
| `KRAKEN` | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |
| `COINBASE` | unsupported | unsupported | unsupported | unsupported | unsupported | reject with explicit unsupported error / capability gate |

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
- or silently narrow to another exchange at runtime.

## Non-Goals

- This contract does not redefine trading behavior, lifecycle semantics, or
  exchange business rules.
- This contract does not move runtime logic into exchange modules; it only
  freezes access ownership boundaries.
