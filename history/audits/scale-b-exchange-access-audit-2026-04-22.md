# SCALE-B Exchange Access Audit and Closure (2026-04-22)

Status: Closed (`SCALE-06..SCALE-10`)

## Scope

- `apps/api/src/modules/exchange/exchangeSymbolRules.service.ts`
- `apps/api/src/modules/exchange/exchangePublicRead.service.ts`
- `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.ts`
- `apps/api/src/modules/exchange/exchangeMetadataContract.service.ts`
- `apps/api/src/modules/orders/orders.manualContext.service.ts`
- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/wallets/wallets.service.ts`

## SCALE-06 Audit Map (Before Refactor)

Canonical owner already in place:

- `orders.service.ts` via `exchangeConnectorFactory` for live execution flows.

Should delegate:

- `exchangeSymbolRules.service.ts` (direct `ccxt` public market-map bootstrap).
- `positions.service.ts` (direct authenticated `ccxt` snapshot clients).
- `wallets.service.ts` (direct authenticated `ccxt` balance preview client).
- `orders.manualContext.service.ts` (symbol-rules dependency through connector-local lookup path).

Temporary bridge (kept intentionally):

- `runtimeCapitalContext.service.ts` and profile API key probe flows remain outside this slice
  because they were not in `SCALE-B` task scope.

## Implemented Ownership Convergence

- Added canonical public read boundary:
  - `exchangePublicRead.service.ts`
- Added canonical authenticated read boundary:
  - `exchangeAuthenticatedRead.service.ts`
- Added canonical metadata contract for wallet metadata + symbol-rule metadata:
  - `exchangeMetadataContract.service.ts`
- Rewired symbol-rules loader to public boundary:
  - `exchangeSymbolRules.service.ts`
- Rewired manual-order context symbol rules to metadata contract:
  - `orders.manualContext.service.ts`
- Rewired positions snapshots to authenticated boundary:
  - `positions.service.ts`
- Rewired wallet balance preview and metadata to canonical boundaries:
  - `wallets.service.ts`

## Validation

- `pnpm --filter api run test -- --run src/modules/exchange/exchangeConnectorFactory.service.test.ts src/modules/exchange/exchangePublicRead.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/exchangeMetadataContract.service.test.ts src/modules/exchange/exchangeSymbolRules.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`
- `pnpm run quality:guardrails`

All listed validations passed on 2026-04-22.

