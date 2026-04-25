# Exchange Boundary Leak Audit

Status: Published  
Date: 2026-04-25  
Wave: `XVENUE-A`

## Purpose

Inventory every currently confirmed exchange-boundary leak that violates the
approved exact `(exchange, marketType)` architecture or leaves worker topology
truth narrower than the deployed architecture baseline.

This packet is the implementation handoff for:
- `XVENUE-03 docs(contract): freeze capability matrix migration rules`
- `XVENUE-04 refactor(api-exchange): registry-driven adapter-family entrypoints`
- `XVENUE-05 refactor(api-markets-engine): remove direct exchange SDK access`
- `XVENUE-07 refactor(api-ops): align worker topology truth`

## Summary

The architecture is now clear, but the codebase still contains direct
exchange-specific behavior outside `apps/api/src/modules/exchange`.

Confirmed drift clusters:
1. Direct `ccxt` / Binance client construction in feature modules
2. Direct Binance REST usage in market-data and backtest paths
3. Generic-looking contracts backed by Binance-only implementations
4. Worker health/readiness ownership truth that models only part of the
   deployed topology

## Canonical Target

Approved target model:
- exact context is always `(exchange, marketType)`
- `SPOT` and `FUTURES` never mix prices, candles, indicators, or signal inputs
- exchanges never reuse each other's market data or execution/account behavior
- feature modules consume narrow adapter families under one registry
- worker health/readiness reflects the full topology:
  - `market-data`
  - `market-stream`
  - `backtest`
  - `execution`

## Leak Inventory

### A. Market Data Adapter Leaks

These places still own exchange-specific market-data behavior outside the
canonical exchange module.

1. `apps/api/src/modules/markets/markets.service.ts`
   - direct `ccxt` construction with `binance` / `binanceusdm`
   - direct Binance ticker/catalog behavior
   - `getMarketCatalog(exchange, marketType)` accepts a generic exchange input
     but currently resolves only Binance-backed public markets
   - target family: `ExchangeMetadataAdapter` plus `ExchangeMarketDataAdapter`

2. `apps/api/src/modules/engine/runtimeSignalMarketDataGateway.ts`
   - direct Binance REST base URLs for klines, funding, open interest, and
     depth
   - current runtime signal warmup and derivatives enrichment remain
     Binance-shaped even though runtime inputs should be resolved by exact
     `(exchange, marketType)`
   - target family: `ExchangeMarketDataAdapter`

3. `apps/api/src/modules/bots/runtimeMarketDataFallback.service.ts`
   - direct Binance REST base URLs for candle fallback and derivatives
     snapshots/history
   - fallback logic currently assumes Binance spot/futures endpoints instead of
     a venue-resolved market-data adapter
   - target family: `ExchangeMarketDataAdapter`

4. `apps/api/src/modules/backtests/backtestDataGateway.ts`
   - direct Binance REST URLs for klines plus futures-only derivatives context
     (`fundingRate`, `openInterestHist`)
   - backtest source selection is still exchange-specific rather than
     registry-driven by exact context
   - target family: `ExchangeMarketDataAdapter`

### B. Account Adapter Leaks

1. `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
   - direct `ccxt` construction of a Binance client for live balance reads
   - market type is respected locally, but the call bypasses the canonical
     exchange boundary and is not registry-driven
   - target family: `ExchangeAccountAdapter`

### C. Metadata Adapter Leaks

1. `apps/api/src/modules/exchange/exchangeMetadataContract.service.ts`
   - contract is generic and already shaped correctly at the call site
   - drift is indirect: it depends on `getMarketCatalog(exchange, marketType)`
     which still resolves through a Binance-only implementation
   - target family: `ExchangeMetadataAdapter`

### D. Execution/Onboarding Adapter Leaks

1. `apps/api/src/modules/profile/apiKey/binanceApiKeyProbe.service.ts`
   - direct `ccxt` Binance client construction remains outside
     `modules/exchange`
   - this is intentionally Binance-specific today, but still a boundary leak
     against the target adapter-family model
   - target family: `ExchangeAccountAdapter`
   - note: this slice should be migrated without broadening support claims

## Worker Topology Drift

### Current Problem

Worker health and readiness do not yet reflect the full deployed topology from
architecture docs.

Confirmed drift:
1. `apps/api/src/router/index.ts`
   - `/workers/health` defaults `WORKER_MODE` to `inline`
   - `/workers/ready` reports `ready` for all non-`split` modes
2. `apps/api/src/workers/workerOwnership.ts`
   - ownership model currently exposes only:
     - `backtest`
     - `marketData`
   - missing canonical topology families:
     - `market-stream`
     - `execution`
3. `apps/api/src/observability/runtimeFreshness.ts`
   - worker mode still defaults to `inline`, reinforcing the narrower
     operational truth

### Consequence

Operators cannot yet rely on the worker endpoints to tell the full truth about
split-worker deployment readiness versus local or degraded inline operation.

### Target Slice

This drift is explicitly deferred to `XVENUE-07`.

## Migration Implications

### What `XVENUE-03` Must Freeze

`XVENUE-03` should convert current capability truth from the compatibility-stage
shape:

```text
(exchange, capability)
```

toward the target shape:

```text
(exchange, marketType, operation)
```

It must also define which currently Binance-only behaviors are compatibility
truth versus future adapter-family extension points.

### What `XVENUE-04` Must Introduce

`XVENUE-04` should add registry-driven entrypoints for:
- `ExchangeMarketDataAdapter`
- `ExchangeMetadataAdapter`
- `ExchangeAccountAdapter`
- `ExchangeExecutionAdapter`

without yet claiming broad multi-exchange implementation where it does not
exist.

### What `XVENUE-05` Must Migrate First

Highest-value direct-leak migrations:
1. `markets.service.ts`
2. `runtimeCapitalContext.service.ts`
3. `runtimeSignalMarketDataGateway.ts`
4. `runtimeMarketDataFallback.service.ts`
5. `backtestDataGateway.ts`

### What Must Stay Fail-Closed

- unsupported exchanges
- unsupported market types per exchange
- futures-only derivatives enrichment on spot contexts
- exchange-specific onboarding checks not yet ported to the registry

## Non-Goals

- no broad second-exchange delivery in this audit
- no accidental support claims beyond proven capability
- no worker refactor in this slice
- no market-data behavior changes in this slice

## Outcome

The repository now has one concrete leak map tying each confirmed drift to its
target adapter family and to the next queued hardening slices. This closes the
audit uncertainty and makes `XVENUE-03` the next smallest honest step.
