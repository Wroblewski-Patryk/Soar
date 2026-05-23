# V1GUARD-A - LIVE Protection Final Hardening Plan

Status: Active
Owner: Codex Execution Agent
Stage: planning
Last Updated: 2026-04-29

## Context

`V1SAFE-A` closed the read-model versus runtime-truth gap for imported and
recovered `LIVE` positions, but a fresh repository audit still shows three
remaining protection drifts that matter directly for real money:

1. shared lifecycle logic still allows `TTP` to close before the canonical
   `DCA-first` guard is satisfied, which conflicts with the approved parity
   matrix;
2. `LIVE DCA` runtime state can remain stale when a market add is submitted
   first and only becomes `FILLED` later through exchange events, which means
   `currentAdds`, `averageEntryPrice`, and trailing state may lag behind the
   canonical position row;
3. `LIVE` protection evaluation still consumes raw ticker `lastPrice`
   directly inside runtime automation instead of one canonical lifecycle-price
   resolution seam, making it harder to prove parity and reason about futures
   behavior.

These gaps fit the user's reported symptom class: `PAPER` can appear healthy
while `LIVE` still misses DCA, fails to close on expected protection paths, or
continues from stale runtime state after exchange-confirmed fills.

## Goal

Close the last confirmed architecture drifts in `LIVE DCA/TTP/TSL` behavior so
runtime protection follows the canonical lifecycle contract instead of a
partially stale or mode-specific path.

## Scope

- `apps/api/src/modules/engine/positionManagement.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimeExecutionDedupe.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- focused runtime and exchange-event tests under `apps/api/src/modules/engine/`
  and `apps/api/src/modules/orders/`
- canonical planning/context files for queue and closure sync

## Non-Goals

- no broad exchange-native protective-order redesign
- no new lifecycle engine fork for `LIVE`
- no UI redesign outside operator-truth surfaces required by the fixes

## Architecture Alignment

Reviewed authorities:

- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`

Confirmed drifts versus architecture:

- `TTP` currently bypasses the mandatory `DCA-first` guard
- async `LIVE DCA` fill truth can update DB rows without advancing runtime
  management state in the same canonical lifecycle
- runtime protection price truth is still consumed ad hoc from ticker events
  instead of one explicit lifecycle-price seam

## Execution Plan

1. Add focused red regressions for:
   - `TTP` remaining blocked while pending DCA is still valid and affordable
   - async `LIVE DCA` submit -> exchange fill -> runtime state convergence
   - lifecycle-price resolution reuse inside `LIVE` position automation
2. Fix shared engine ordering so `TTP` respects the same `DCA-first` guard as
   `TSL` and `SL`.
3. Fix `LIVE DCA` runtime convergence so exchange-confirmed add fills advance
   canonical runtime state even when the original market order was only
   `submitted` during the automation tick.
4. Replace direct ticker-price consumption in protection evaluation with one
   explicit lifecycle-price resolution seam that runtime automation can reuse.
5. Run focused regression pack, typecheck, and guardrails, then publish
   closure evidence.

## Acceptance Criteria

- `TTP` does not close when a pending DCA level is still valid and affordable.
- An async `LIVE DCA` fill leaves runtime state converged with canonical
  position quantity, entry price, and `currentAdds` on the next lifecycle pass.
- `LIVE` protection evaluation reuses one explicit lifecycle-price seam instead
  of hardcoding ticker `lastPrice` inside the automation path.
- Focused tests prove the above in `PAPER`/shared-engine and `LIVE` paths.

## Risks

- shared-engine ordering changes can affect existing `PAPER` expectations, so
  red tests must freeze the exact intended parity first
- async fill convergence must not duplicate DCA accounting or create a second
  add-leg for the same exchange fill
- lifecycle-price refactor must stay inside the current architecture and avoid
  inventing a second price-authority system

## Validation Plan

- `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Result Report

- Task summary: pending implementation
- Files changed: planning packet only
- How tested: `pnpm run quality:guardrails`
- What is incomplete: runtime/tests/docs implementation wave
- Next steps: `V1GUARD-01..05`
