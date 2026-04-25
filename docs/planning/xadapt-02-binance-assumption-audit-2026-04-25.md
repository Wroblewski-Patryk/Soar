# XADAPT-02 Audit

Status: Active  
Updated: 2026-04-25

## Purpose

Classify current exchange-related implementation seams after `XADAPT-01` froze
the canonical capability matrix. This audit is the handoff packet for
`XADAPT-03`, so the refactor can distinguish between:

- intentional Binance-only scope
- compatibility-only generic seams
- generic-looking surfaces that now exceed truthful V1 product support

## Classification Legend

- `INTENTIONAL_BINANCE_SCOPE`: current V1 scope is explicitly Binance-only and
  should stay explicit
- `COMPATIBILITY_SEAM`: generic-looking implementation is acceptable only as a
  narrow compatibility bridge behind the frozen capability contract
- `GENERIC_LOOKING_DRIFT_RISK`: current API or naming looks broader than the
  actual product support and should be narrowed or wrapped by a clearer
  boundary

## Inventory

### INTENTIONAL_BINANCE_SCOPE

1. `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
   - hard-filters synced API keys and LIVE bot ownership to `exchange:
     'BINANCE'`
   - rationale: reconciliation runtime is still intentionally Binance-first in
     V1 and should remain explicit instead of pretending to be exchange-agnostic

2. `apps/api/src/modules/positions/positions.service.ts`
   - takeover and sync-oriented owner queries still hard-filter LIVE candidates
     to `BINANCE` / `FUTURES`
   - rationale: external position adoption and takeover status are still tied to
     the current Binance runtime shape

3. `apps/api/src/modules/exchange/exchangeAuthenticatedReadContract.service.ts`
   - explicit support matrix for `BALANCE_PREVIEW`, `POSITIONS_SNAPSHOT`, and
     `OPEN_ORDERS_SNAPSHOT` marks only `BINANCE` as supported
   - rationale: this is already the healthy, truthful contract and should be
     reused rather than generalized

### COMPATIBILITY_SEAM

1. `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.ts`
   - exposes generic raw readers (`fetchPositions`, `fetchOpenOrders`,
     `fetchBalance`) but does so behind the authenticated-read contract
   - why this is acceptable today: call sites such as `positions.service.ts`
     already gate support explicitly before using the connector
   - refactor note for `XADAPT-03`: keep this seam, but make the surrounding
     boundary obviously capability-owned

2. `apps/api/src/modules/orders/orders.service.ts`
   - manual LIVE submit path resolves canonical key ownership, then delegates to
     `createAuthenticatedExchangeConnector()` and `createLiveOrderAdapter()`
   - why this is acceptable today: capability truth now says only Binance is
     supported for `LIVE_ORDER_SUBMIT`, so the generic connector seam is still
     protected by higher-level truth
   - refactor note for `XADAPT-03`: move toward one named exchange-execution
     boundary so the submit path does not look broader than it is

3. `apps/api/src/modules/exchange/ccxtFuturesConnector.service.ts`
   - can normalize futures/spot order placement and authenticated reads from a
     lower-level CCXT client
   - why this is acceptable today: it is an adapter primitive, not the product
     contract
   - refactor note for `XADAPT-03`: preserve it as infrastructure, but stop
     feature modules from depending on it implicitly

### GENERIC_LOOKING_DRIFT_RISK

1. `apps/api/src/modules/exchange/exchangeConnectorFactory.service.ts`
   - accepts any `Exchange` and instantiates a CCXT connector by lowercasing the
     exchange enum
   - drift risk: this makes unsupported exchanges look executable or readable
     even when the product contract is Binance-only for the relevant family
   - `XADAPT-03` target: keep the factory low-level, but hide it behind one
     canonical adapter boundary per capability family

2. `apps/api/src/modules/exchange/liveOrderAdapter.service.ts`
   - generic class name and constructor shape suggest reusable multi-exchange
     live submit support
   - drift risk: V1 product truth is only `BINANCE` for `LIVE_ORDER_SUBMIT`
   - `XADAPT-03` target: preserve the implementation but put it behind a
     boundary whose public contract is explicitly capability-gated

3. `apps/api/src/modules/orders/orders.service.ts::cancelOrder`
   - local cancel route mutates Soar order state and writes audit logs, but does
     not call any exchange-side cancel boundary
   - drift risk: route existence can be misread as `LIVE_ORDER_CANCEL`
     support
   - `XADAPT-03` target: make the absence of exchange-side cancel support
     obvious at the boundary and in future owner naming

4. `apps/api/src/modules/exchange/exchangeCapabilities.ts` + `libs/shared/index.js`
   - broad `LIVE_EXECUTION` capability exists separately from the narrower
     authenticated-read and write-submit truths
   - drift risk: future code can still infer read or cancel support from
     `LIVE_EXECUTION`
   - `XADAPT-03` target: consume the frozen family-specific matrix first and
     keep `LIVE_EXECUTION` scoped to wallet/bot eligibility only

## Refactor Ownership Map For XADAPT-03

1. Keep as canonical truth owners:
   - `exchangeAuthenticatedReadContract.service.ts`
   - `docs/architecture/reference/exchange-access-ownership-matrix.md`

2. Wrap or narrow as boundary infrastructure:
   - `exchangeConnectorFactory.service.ts`
   - `liveOrderAdapter.service.ts`
   - `ccxtFuturesConnector.service.ts`

3. Keep explicit Binance-only runtime scope:
   - `livePositionReconciliation.service.ts`
   - Binance-specific LIVE takeover/adoption queries in `positions.service.ts`

4. Make explicitly unsupported:
   - exchange-side `LIVE_ORDER_CANCEL` for every exchange until a canonical
     cancel boundary exists

## Non-Goals

- no second-exchange implementation
- no exchange-cancel feature work
- no runtime reconciliation broadening beyond explicit Binance-first truth

## Exit Criteria For XADAPT-02

- `XADAPT-03` can refactor against one explicit audit packet instead of
  rediscovering support truth
- queue/context docs point to `XADAPT-03` as the next smallest honest slice
