# Exchange Access Ownership Matrix

Status: Active  
Updated: 2026-04-22

## Purpose

Freeze one canonical ownership model for exchange access so API modules do not
reintroduce parallel bootstrap, metadata, or snapshot flows.

## Ownership Matrix

| Access family | Canonical owner | Allowed consumers | Forbidden pattern |
| --- | --- | --- | --- |
| Public market-map loading | `apps/api/src/modules/exchange/exchangePublicRead.service.ts` | symbol rules and future public metadata readers | direct ad hoc `ccxt` market bootstrap in consumer modules |
| Symbol rules resolution | `apps/api/src/modules/exchange/exchangeSymbolRules.service.ts` | orders/manual-order/wallet metadata consumers through metadata contract | duplicate per-module rules loaders |
| Authenticated exchange client bootstrap | `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.ts` (via `exchangeConnectorFactory`) | positions snapshots, wallet balance previews, future authenticated reads | creating authenticated clients directly inside feature modules |
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

## Authenticated Read Truth Matrix

Authenticated account-read support must be explicit per operation family and
must fail closed when unsupported.

| Exchange | `BALANCE_PREVIEW` | `POSITIONS_SNAPSHOT` | `OPEN_ORDERS_SNAPSHOT` | Source derivation |
| --- | --- | --- | --- | --- |
| `BINANCE` | supported | supported | supported | actual exchange owner (`BINANCE`) |
| `BYBIT` | unsupported | unsupported | unsupported | reject with explicit unsupported error |
| `OKX` | unsupported | unsupported | unsupported | reject with explicit unsupported error |
| `KRAKEN` | unsupported | unsupported | unsupported | reject with explicit unsupported error |
| `COINBASE` | unsupported | unsupported | unsupported | reject with explicit unsupported error |

Canonical owner:

- `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts`

Consumers must never:

- hardcode `BINANCE` while route input accepts broader `exchange`,
- infer support from `LIVE_EXECUTION`,
- or silently narrow to another exchange at runtime.

## Non-Goals

- This contract does not redefine trading behavior, lifecycle semantics, or
  exchange business rules.
- This contract does not move runtime logic into exchange modules; it only
  freezes access ownership boundaries.
