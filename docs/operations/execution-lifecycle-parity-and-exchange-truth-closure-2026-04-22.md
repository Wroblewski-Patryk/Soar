# XLIFE-A Closure Evidence (2026-04-22)

Status: Closed  
Wave: `XLIFE-A`

## Objective

Close the remaining V1 execution-truth drift so `PAPER` and `LIVE` share one
canonical `order -> fill -> position -> trade` lifecycle, while `LIVE` remains
safe against exchange-side partial or pending execution.

## Scope Delivered

### 1. Fail-Closed Close Lifecycle

- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- focused runtime tests

Delivered behavior:

- close orders that remain `OPEN` or `PARTIALLY_FILLED` now return explicit
  `submitted` state
- local positions are no longer closed optimistically before canonical fill
  truth exists
- runtime position automation keeps monitoring state alive while close remains
  pending instead of clearing local state early

### 2. Canonical Fill Truth for Trades and Realized PnL

- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- focused orchestrator and smoke tests

Delivered behavior:

- runtime open trades resolve price and quantity from canonical order fill
  fields before persistence
- runtime close trades and realized PnL resolve from canonical exit fill truth
  instead of signal `markPrice`
- reference `markPrice` remains only fallback/diagnostic data when canonical
  fill fields are unavailable

### 3. Shared PAPER/LIVE Lifecycle Ownership

- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`

Delivered behavior:

- runtime-origin orders now persist with `origin=BOT`
- bot-opened positions created through canonical order-fill lifecycle preserve
  bot ownership truth instead of leaking manual/user origin
- `PAPER` and `LIVE` now use the same touched lifecycle semantics, with fill
  source remaining the only intended boundary difference

### 4. Exchange Scope Truth in Runtime Infrastructure

- `apps/api/src/modules/engine/runtimeScanLoop.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- focused runtime watchdog/automation tests

Delivered behavior:

- runtime scan watchdog remains explicitly Binance-scoped in contract and test
- runtime position automation now resolves exchange truth from bot context when
  present instead of silently collapsing to manual defaults

## Regression Locks Added or Updated

- `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- `apps/api/src/modules/engine/runtimeCrashRetry.regression.test.ts`
- `apps/api/src/modules/engine/runtime-orchestration-smoke.e2e.test.ts`
- `apps/api/src/modules/engine/runtimeScanLoop.service.test.ts`
- `apps/api/src/modules/engine/executionAdapterParity.test.ts`
- `apps/api/src/modules/engine/paperLiveDecisionEquivalence.test.ts`

Key locked behaviors:

- no local close-before-fill on pending or partial close
- no trade-price drift back to signal `markPrice` when canonical fill truth
  exists
- no loss of bot ownership truth when runtime order lifecycle creates position
- no duplicate open replay when lifecycle is submitted or dedupe remains
  pending after crash window

## Validation

Passed:

- `pnpm --filter api exec vitest run src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimeScanLoop.service.test.ts src/modules/engine/executionAdapterParity.test.ts src/modules/engine/paperLiveDecisionEquivalence.test.ts src/modules/engine/runtimeCrashRetry.regression.test.ts src/modules/engine/runtime-orchestration-smoke.e2e.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`
- `pnpm run quality:guardrails`

## Future-Agent Rules Frozen by This Closure

- never close local runtime position state before canonical close fill truth
- never compute persisted execution accounting from signal `markPrice` when
  fill truth exists
- keep `PAPER` and `LIVE` differences at the adapter/fill-source boundary, not
  in position semantics
- if runtime infrastructure is still Binance-only, say so explicitly in
  contracts and code
