# Exchange Context and Worker Topology Hardening Plan

Status: Closed  
Updated: 2026-04-25

## Purpose

Turn the approved architecture direction into one implementation-ready rollout:

- exact market/execution context is always `(exchange, marketType)`
- no mixing between `SPOT` and `FUTURES`
- no mixing between exchanges
- exchange integrations scale through narrow adapter families under one
  registry
- worker health/readiness reflects the full deployed topology honestly

This plan exists because the current codebase still contains Binance-shaped
direct exchange access in non-exchange modules and still exposes worker health
with a topology model narrower than the architecture baseline.

## Approved Direction

The user confirmed:

1. Exchange support must be driven by the user-selected exchange from the
   supported list, not by Binance-only assumptions.
2. `SPOT` and `FUTURES` are separate market domains and must never be mixed for
   prices, candles, indicators, or signal inputs.
3. The target implementation model is the narrow-adapter family approach:
   - `ExchangeMarketDataAdapter`
   - `ExchangeMetadataAdapter`
   - `ExchangeAccountAdapter`
   - `ExchangeExecutionAdapter`
4. Worker health/readiness should be brought in line with the full split-worker
   topology where possible and needed.

## Target Model

### 1. Canonical Exchange Context

Every exchange-owned operation resolves from:

```json
{
  "exchange": "BINANCE | BYBIT | OKX | KRAKEN | COINBASE",
  "marketType": "SPOT | FUTURES"
}
```

This exact pair governs:
- market catalog
- symbol rules
- candles and derivatives context
- indicator inputs
- signal evaluation inputs
- account reads
- order execution
- runtime position/order sync

### 2. Canonical Adapter Families

The adapter registry is keyed by the exact `(exchange, marketType)` pair.

Approved families:
- `ExchangeMarketDataAdapter`
- `ExchangeMetadataAdapter`
- `ExchangeAccountAdapter`
- `ExchangeExecutionAdapter`

Feature modules must consume these families instead of importing exchange SDKs
or hardcoded exchange constructors directly.

### 3. Capability Matrix Evolution

Capability truth must evolve from broad exchange-only flags toward:

```text
(exchange, marketType, operation)
```

Examples:
- `BINANCE + FUTURES + LIVE_ORDER_SUBMIT`
- `BINANCE + SPOT + MARKET_CATALOG`
- `BYBIT + FUTURES + POSITIONS_SNAPSHOT`

### 4. Worker Topology Truth

Worker health/readiness must reflect the canonical deployed topology:
- `market-data`
- `market-stream`
- `backtest`
- `execution`

If deployed environments use `inline`, that must surface as degraded or
exception-mode truth rather than a silent healthy equivalent.

## Current Drift This Plan Addresses

### Drift A - Direct exchange SDK usage outside `modules/exchange`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- `apps/api/src/modules/markets/markets.service.ts`

### Drift B - Generic market-catalog contract backed by Binance-only
implementation
- `apps/api/src/modules/markets/markets.service.ts`
- `apps/api/src/modules/exchange/exchangeMetadataContract.service.ts`

### Drift C - Worker health/readiness models only part of deployed topology
- `apps/api/src/router/index.ts`
- `apps/api/src/workers/workerOwnership.ts`
- `apps/api/src/observability/runtimeFreshness.ts`

## Execution Plan

### XVENUE-01 docs(contract): freeze exact `(exchange, marketType)` context and adapter-family architecture
- [x] update architecture docs with the approved exact-context rule
- [x] freeze the narrow-adapter family model
- [x] freeze the no-mixing rule for prices/candles/indicators/signals

### XVENUE-02 audit(api): inventory direct exchange access and boundary leaks outside `modules/exchange`
- [x] locate every confirmed non-exchange-module import of `ccxt` or exchange-specific client construction
- [x] classify each confirmed leak by adapter family target:
  - market data
  - metadata
  - account
  - execution
- [x] publish worker-topology drift inventory for the later ops slice

### XVENUE-03 docs(contract): freeze capability matrix evolution toward `(exchange, marketType, operation)`
- [x] define the target capability matrix shape
- [x] mark current exchange-only matrix as compatibility-stage truth
- [x] document staged migration rules

### XVENUE-04 refactor(api-exchange): introduce registry-driven adapter-family entrypoints
- [x] add family-level registry resolution for `(exchange, marketType)`
- [x] keep exchange module entrypoints dependent on family contracts instead of low-level connector bootstrap duplication

### XVENUE-05 refactor(api-markets-engine): remove direct exchange SDK access from `markets` and `engine`
- [x] migrate market catalog and runtime live-balance reads behind exchange families
- [x] preserve fail-closed behavior for unsupported contexts

### XVENUE-06 test(api): add explicit no-mixing parity coverage across exchange and market type pairs
- [x] prove `SPOT` does not reuse `FUTURES`
- [x] prove unsupported venue/context pairs stay fail-closed
- [x] lock capability and fallback behavior at exact-context seams

### XVENUE-07 refactor(api-ops): align worker ownership, health, and readiness to full topology truth
- [x] model all four canonical worker families
- [x] make deployed `inline` surface as degraded/exception truth instead of silent healthy equivalence
- [x] keep local/test inline support explicit

### XVENUE-08 qa(closure): rerun focused exchange-context and worker-topology closure pack
- [x] rerun focused API tests
- [x] rerun typecheck and guardrails
- [x] sync queue/context/docs

## Validation Expectations

Per-wave validation should include:
- focused API tests for adapter families and capability matrix
- explicit regression tests for no-mixing between exchange/marketType pairs
- focused worker health/readiness tests
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Non-Goals

- no all-at-once second-exchange implementation in this planning packet
- no new browser transport model
- no runtime strategy-model rewrite unrelated to exchange context
- no speculative support claims for exchanges or market types not yet wired

## Recommended Queue Order
1. `XVENUE-02 audit(api): inventory boundary leaks and direct exchange SDK usage`
Context:
`XVENUE-01` is now closed through the canonical architecture updates in
`04_runtime-contexts.md`, `05_strategy-signal-and-decision-flow.md`, and
`09_integrations-deployment-and-runtime-services.md`.
2. `XVENUE-03 docs(contract): freeze capability matrix migration rules`
3. `XVENUE-04 refactor(api-exchange): registry-driven adapter-family entrypoints`
4. `XVENUE-05 refactor(api-markets-engine): remove direct exchange SDK access from feature modules`
5. `XVENUE-06 test(api): add no-mixing parity coverage`
6. `XVENUE-07 refactor(api-ops): align worker topology truth`
7. `XVENUE-08 qa(closure): rerun focused closure pack and sync docs/context`

## Progress Log

- 2026-04-25: Closed `XVENUE-02` by publishing
  `history/audits/xvenue-02-exchange-boundary-leak-audit-2026-04-25.md` plus
  the task packet `history/audits/xvenue-02-boundary-leak-audit-task-2026-04-25.md`.
  The audit confirms direct exchange boundary leaks in `markets`, `engine`,
  `bots`, `backtests`, and profile API-key probing, plus narrower-than-approved
  worker topology truth in `/workers/*` and `workerOwnership.ts`. The queue now
  advances to `XVENUE-03`.
- 2026-04-25: Closed `XVENUE-03` by freezing capability migration rules in
  `docs/architecture/reference/exchange-access-ownership-matrix.md` and
  `docs/architecture/09_integrations-deployment-and-runtime-services.md`.
  Canonical docs now distinguish compatibility-stage exchange flags from the
  target exact-stage `(exchange, marketType, operation)` matrix and explicitly
  forbid support inference across operation families, market types, or
  exchanges. The queue now advances to `XVENUE-04`.
- 2026-04-25: Closed `XVENUE-04` by adding
  `apps/api/src/modules/exchange/exchangeAdapterRegistry.service.ts` as the
  canonical exact-context registry entrypoint for adapter families. Existing
  exchange connector/bootstrap entrypoints now resolve public/account/execution
  wiring through that registry, and focused exchange tests plus API typecheck
  remain green. The queue now advances to `XVENUE-05`.
- 2026-04-25: Closed `XVENUE-05` by moving market catalog ownership to
  `apps/api/src/modules/exchange/exchangeMarketCatalog.service.ts` and routing
  runtime live-balance reads through the canonical exchange balance boundary.
  `markets.service.ts` and `runtimeCapitalContext.service.ts` no longer own
  direct exchange SDK/bootstrap logic for those paths. Focused exchange/runtime
  tests, API typecheck, and repository guardrails remained green; local
  `markets.e2e` is still infra-blocked by unreachable `localhost:5432`. The
  queue now advances to `XVENUE-06`.
- 2026-04-25: Closed `XVENUE-06` by adding focused no-mixing parity coverage
  for the exact-context registry and market catalog seams. Regression tests now
  prove `BINANCE + SPOT` does not reuse `BINANCE + FUTURES`, keep unsupported
  venue/context pairs fail-closed, and preserve current capability truth at the
  exchange module boundary. The queue now advances to `XVENUE-07`.
- 2026-04-25: Closed `XVENUE-07` by extending
  `apps/api/src/workers/workerOwnership.ts` into the canonical worker-topology
  contract for ops and freshness truth. `/workers/health` and `/workers/ready`
  now expose all four approved families (`market-data`, `market-stream`,
  `backtest`, `execution`), distinguish local/test inline from deployed
  degraded inline, and fail closed when deployed topology deviates from the
  canonical split-worker contract. `runtimeFreshness.ts` now skips passive
  inline checks only for explicit local/test inline. The queue now advances to
  `XVENUE-08`.
- 2026-04-25: Closed `XVENUE-08` by rerunning the focused `XVENUE-A` closure
  pack across exchange exact-context seams, worker-topology truth, API
  typecheck, and repository guardrails. The full wave is now closed in one
  canonical evidence pass, and queue/context artifacts no longer keep
  `XVENUE-A` as an active `NOW` item.
