# Architecture Conformance Remediation Plan (2026-04-21)

## Objective
- align code ownership and runtime behavior with the canonical architecture in
  `docs/architecture/`
- remove architecture drift only where the drift is real and safety-relevant
- improve code quality without broad cleanup work or speculative rewrites
- preserve runtime behavior unless the current behavior already violates
  canonical fail-closed or source-of-truth rules

## Scope Lock
- no product-surface redesign
- no opportunistic rewrites of healthy modules
- no schema deletions or destructive migrations in the first wave
- no behavior changes that weaken current trading safety

## Keep As-Is (Confirmed Conformance)
- server-owned market-stream transport is implemented and matches the canonical
  SSE contract (`apps/api/src/modules/market-stream/marketStream.routes.ts`,
  `apps/web/src/lib/marketStream.ts`)
- runtime open lifecycle uses explicit order-first semantics with waiting-fill
  state before position visibility (`apps/api/src/modules/orders/orders.service.ts`,
  `apps/api/src/modules/engine/executionOrchestrator.service.ts`)
- execution idempotency is implemented through runtime dedupe keys rather than
  optimistic replays (`apps/api/src/modules/engine/runtimeExecutionDedupe.service.ts`)
- selected-bot monitoring and aggregate runtime reads are backed by API
  contracts and deterministic read models (`apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`)

## Confirmed Architecture Drift

### 1. Hidden fallback remains in manual-order strategy-context resolution
- Canonical docs require no hidden fallback for critical trading context.
- Current code resolves a symbol-scoped strategy from canonical links first,
  then legacy links, but if nothing matches the requested symbol it falls back
  to the first available canonical or legacy strategy:
  `apps/api/src/modules/orders/orders.service.ts:195-317`.
- This is architecture drift because the selected symbol can inherit unrelated
  strategy context silently.

### 2. Bot context still duplicates wallet and venue ownership
- Canonical docs state:
  - market universe owns venue context
  - wallet owns execution mode and capital context
- Prisma schema still stores duplicated context on `Bot`:
  `mode`, `exchange`, `marketType`, `apiKeyId`
  (`apps/api/prisma/schema.prisma:294-337`).
- Bot validation still compares symbol-group universe directly against bot-level
  exchange and market type instead of treating wallet + market-universe as the
  canonical authorities (`apps/api/src/modules/bots/botOwnership.service.ts:56-79`).
- Current runtime often behaves correctly because later waves added
  canonical-first read logic, but the data model and validation contract are
  still mixed.

### 3. Legacy `BotStrategy` remains a live compatibility path, not just archived data
- Projection still falls back from canonical market-group strategy links to
  legacy `botStrategies` (`apps/api/src/modules/bots/botResponseMapper.service.ts:54-80`).
- Manual-order strategy resolution still reads legacy `botStrategy`
  associations (`apps/api/src/modules/orders/orders.service.ts:257-315`).
- Legacy helper still auto-creates default universes/groups and writes
  `BotStrategy` records (`apps/api/src/modules/bots/botLegacyStrategyLink.service.ts:4-87`).
- This keeps two topology models alive at once, which is inconsistent with the
  canonical `User -> Bot -> BotMarketGroup -> MarketGroupStrategyLink` model.

### 4. Runtime-service ownership is only partially aligned with the documented split-worker topology
- Execution worker performs real runtime work
  (`apps/api/src/workers/execution.worker.ts:1-34`).
- Market-stream worker performs real runtime work
  (`apps/api/src/workers/marketStream.worker.ts:1-167`).
- Backtest worker currently only boots heartbeat metadata
  (`apps/api/src/workers/backtest.worker.ts:1-8`).
- Market-data worker currently only boots heartbeat metadata
  (`apps/api/src/workers/marketData.worker.ts:1-8`).
- Backtest execution is still owned by an in-process API queue:
  `BacktestRunQueue` is instantiated in
  `apps/api/src/modules/backtests/backtests.service.ts:497-516`, and new runs
  are enqueued inline at `apps/api/src/modules/backtests/backtests.service.ts:642`.
- Ops endpoints also still default worker mode to `inline`
  (`apps/api/src/router/index.ts:93-118`).
- This is acceptable as an intermediate state, but it does not fully match the
  canonical worker-service ownership written in architecture docs.

### 5. Backtest report availability contract is weaker than the architecture implies
- The backtest run is created synchronously, but report persistence is
  asynchronous after the job completes (`apps/api/src/modules/backtests/backtestRunJob.ts`).
- The report endpoint returns `404` for owned runs when the report is not ready
  yet (`apps/api/src/modules/backtests/backtests.controller.ts:82-90`).
- In grouped go-live API smoke, this produced a flaky failure because the test
  helper waited only a bounded polling window while the run finished later.
- This is not a proven business-logic failure, but it is an API lifecycle
  contract ambiguity that should be tightened.

### 6. Route-level i18n ownership is still leaky on `/dashboard/bots`
- Bot feature code uses `dashboard.home.*` keys instead of bot-owned namespace
  keys (`apps/web/src/features/bots/components/BotCreateEditForm.tsx`,
  `apps/web/src/features/bots/components/BotsManagement.tsx`).
- The route namespace registry for `/dashboard/bots` does not canonically own
  those keys.
- This is not a trading-runtime defect, but it is architectural drift against
  the route-owned operator-surface contract and weakens documentation parity.

## Delivery Strategy

### Wave ARCCON-A - Fail-Closed Context Ownership
1. Add red regressions for manual-order symbol-context resolution when the
   selected bot has no matching strategy for the requested symbol.
2. Remove first-strategy fallback from manual-order context resolution and keep
   the unresolved state explicit.
3. Add red regressions for canonical wallet + market-universe precedence over
   duplicated bot venue fields.
4. Refactor bot validation so canonical ownership is authoritative and bot-level
   duplicated fields are treated as compatibility reads only.

### Wave ARCCON-B - Legacy Topology Containment
1. Freeze the deprecation contract for `BotStrategy` and duplicated bot venue
   fields before changing writes.
2. Add drift-detection/regression coverage that proves canonical links are
   sufficient for runtime and operator surfaces.
3. Reduce live write paths that still auto-create or depend on legacy topology.
4. Keep read-only fallback only where needed for historical compatibility, with
   explicit repair/deprecation path instead of silent preference mixing.

### Wave ARCCON-C - Runtime Service Ownership Closure
1. Add red ops/runtime tests that expose current split-worker versus inline
   ownership behavior.
2. Decide one safe target per service:
   - either wire real worker ownership for backtests and market-data
   - or downgrade docs/health contracts to explicit inline ownership
3. Implement the chosen ownership model without changing product semantics.
4. Align `workers/health`, `workers/ready`, local scripts, and deployment docs
   to the same reality.

### Wave ARCCON-D - Async Contract and Operator-Surface Cleanup
1. Tighten backtest report lifecycle contract:
   - explicit pending/degraded response, or
   - stronger readiness guarantee before report reads are expected
2. Remove bot-route i18n namespace leakage and keep route-owned keys explicit.
3. Sync docs/modules/ops artifacts and run closure validation.

## Safe Sequencing Rules
- do not delete legacy schema fields in the same wave that changes read/write
  authority
- do not move worker ownership and API lifecycle contracts in one commit
- do not weaken existing selected-bot scope guards while removing legacy
  fallbacks
- do not replace healthy server-owned SSE or aggregate monitoring contracts

## Test Matrix

### API
- manual-order context resolution fails closed when symbol has no canonical
  strategy match
- bot create/edit validation uses wallet + market-universe canonical context
- legacy topology compatibility remains readable for historical bots
- backtest run/report lifecycle remains deterministic under async completion
- worker health/readiness reports match actual ownership mode

### Web
- `/dashboard` and `/dashboard/bots/*` still render selected-bot scoped runtime
  state correctly
- `/dashboard/bots` loads only route-owned i18n namespaces for its copy
- degraded aggregate/runtime states remain explicit and readable

### Ops / Smoke
- `quality:guardrails`
- focused API/web regression packs for touched slices
- `test:go-live:smoke` after any worker-ownership change

## Recommended Queue
- `ARCCON-01..ARCCON-12` in tiny reversible commits
- start with fail-closed context ownership before worker/service ownership
- postpone schema-deletion cleanup until all compatibility reads are proven dead

## Planner Note
- this wave is quality- and architecture-driven, not feature-driven
- acceptance means stronger source-of-truth ownership and safer runtime
  contracts, not visible UI expansion
