# V1GUARD-A - LIVE Protection Final Closure

Status: implemented
Date: 2026-04-29

## Scope Closed

- shared-engine `DCA-first` parity for `TTP`
- async `LIVE DCA` exchange-fill convergence into runtime state
- explicit lifecycle-price seam reuse in `LIVE` protection automation

## What Changed

1. `positionManagement.service.ts` now keeps `TTP` blocked until the canonical
   `DCA-first` guard is satisfied, matching the approved lifecycle parity
   matrix instead of letting trailing take-profit close early.
2. `orders.exchangeEvents.service.ts` now bridges exchange-confirmed `DCA`
   fills back into both runtime execution dedupe and persisted runtime
   position-state truth, so a submitted-then-filled `LIVE` add no longer leaves
   `currentAdds`, `averageEntryPrice`, or `lastDcaPrice` stale for subsequent
   automation ticks.
3. `runtimePositionAutomation.service.ts` now consumes one explicit
   lifecycle-price seam (`resolveLifecyclePrice`) instead of hardcoding raw
   ticker `lastPrice` directly into protection evaluation and DCA affordability
   checks.
4. `runtimePositionAutomation.helpers.ts` now owns extracted automation helper
   functions so the main runtime service stays inside repository monolith
   guardrails while preserving the same canonical behavior.

## Validation Evidence

- `pnpm --filter api exec vitest run src/modules/engine/positionManagement.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Acceptance Evidence

- `TTP` no longer closes while a pending DCA remains valid and affordable.
- Exchange-confirmed `LIVE DCA` fills now update runtime dedupe state and the
  persisted runtime position state in the same lifecycle closure path.
- Runtime protection automation now proves its price input through one explicit
  lifecycle-price seam rather than an ad hoc ticker-only read.

## Remaining Work

- no additional active repository task is queued from this wave
- next follow-up, if a real-account symptom remains, should start from
  production observation rather than another repository-only assumption
