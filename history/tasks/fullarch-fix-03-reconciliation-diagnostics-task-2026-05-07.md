# Task

## Header
- ID: FULLARCH-FIX-03
- Title: Add per-symbol live import reconciliation diagnostics
- Task Type: feature
- Current Stage: implementation
- Status: DONE
- Owner: Backend Builder
- Depends on: FULLARCH-FIX-02
- Priority: P0
- Iteration: 2026-05-07
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the active iteration context.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Operators need to understand why a live exchange snapshot with several open
positions results in only some positions becoming bot-visible. Prior audit
found that reconciliation had logs and counts, but no structured per-symbol
outcome available from the reconciliation result or loop status.

## Goal
Expose structured per-symbol diagnostics from live position reconciliation
without changing import ownership, management mode, actionability, exchange,
or automation behavior.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.diagnostics.ts`
- `apps/api/src/modules/positions/livePositionReconciliationLoop.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.diagnostics.test.ts`

## Implementation Plan
1. Add diagnostic result and status types.
2. Record per-symbol outcomes for created, updated, skipped zero-size,
   unresolved side, unresolved symbol, and missing entry truth.
3. Include ownership status, management mode, sync state, continuity state,
   bot/wallet/strategy projections, bot visibility, and reason.
4. Store last diagnostics and summary on the reconciliation loop status.
5. Keep existing `openPositionsSeen` compatibility.

## Acceptance Criteria
- Reconciliation result contains `positionDiagnostics` and
  `diagnosticSummary`.
- Loop status exposes `lastPositionDiagnostics` and `lastDiagnosticSummary`.
- Diagnostics distinguish owned, manual-only, ambiguous, unowned, and
  missing-entry positions.
- No row is upgraded to bot-managed or actionable by diagnostics alone.
- Guardrails remain green without monolith allowlist changes.

## Definition of Done
- [x] Diagnostics implemented.
- [x] Focused diagnostics/import/ownership/runtime tests pass.
- [x] API typecheck and guardrails pass.
- [x] Context/task board are updated.

## Result Report
- Task summary: live position reconciliation now returns structured
  per-symbol diagnostics and stores the last run diagnostics on loop status.
- Files changed:
  - `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.diagnostics.ts`
  - `apps/api/src/modules/positions/livePositionReconciliationLoop.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.diagnostics.test.ts`
  - source-of-truth context files
- How tested:
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.diagnostics.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` -> PASS, 47/47.
  - `pnpm --filter api run typecheck` -> PASS.
- What is incomplete: Web presentation of diagnostics is not implemented in
  this slice; authenticated production readback still requires credentials.
- Next steps: repair Web test harness drift or add Web/operator presentation
  for diagnostics, depending on active queue priority.
- Decisions made: diagnostics are additive and do not alter ownership or
  actionability semantics.
