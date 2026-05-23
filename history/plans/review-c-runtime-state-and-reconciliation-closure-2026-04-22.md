# REVIEW-C Runtime State and Reconciliation Closure (2026-04-22)

Status: Closed  
Wave: `REVIEW-C`

## Objective

Close the remaining production-readiness truth gaps left after `REVIEW-B` so
runtime replay, operator exchange diagnostics, and reconciliation semantics no
longer synthesize local truth when canonical state is missing or ambiguous.

## Delivered

### 1. Canonical runtime-state replay after completed DCA reuse

Files:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`

Result:

- completed DCA dedupe reuse now reloads canonical quantity and entry price
  from the persisted position,
- runtime state rehydration no longer falls back to synthetic local
  `nextState` math when canonical fill-derived state is required,
- custom test seams stay non-invasive by using no-op telemetry defaults unless
  explicitly overridden.

### 2. Explicit exchange snapshot error normalization

Files:

- `apps/api/src/modules/positions/positions.service.ts`
- `apps/api/src/modules/positions/positions.exchangeSnapshot.e2e.test.ts`

Result:

- authenticated exchange snapshot fetch failures now normalize through the
  explicit `ExchangeSnapshotError` contract,
- unsupported authenticated-read operations still preserve their dedicated
  `ExchangeAuthenticatedReadUnsupportedError` path,
- operator-facing snapshot failures remain deterministic (`502`) instead of
  leaking raw generic errors.

### 3. Truthful reconciliation for orders disappearing from exchange open-orders

Files:

- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`

Result:

- reconciliation no longer synthesizes `CANCELED` when an exchange order simply
  disappears from the current open-orders snapshot,
- stale local synced orders are now marked unresolved through `syncState =
  ORPHAN_LOCAL` while preserving non-terminal order status,
- the runtime now distinguishes "not currently open on exchange" from
  "confirmed canceled".

## Validation

- `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/positions/positions.exchangeSnapshot.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts` ✅
- `pnpm --filter api run typecheck` ✅
- `pnpm --filter api run build` ✅
- `pnpm run quality:guardrails` ✅

## Closure Summary

`REVIEW-C` is closed. The remaining runtime/exchange production path is now
more truthful in the three places that still could silently drift after
`REVIEW-B`: replayed DCA state, exchange snapshot error semantics, and
reconciliation of disappearing exchange open orders.
