# Task

## Header
- ID: FULLARCH-FIX-01
- Title: Restore recovered imported LIVE position runtime visibility
- Task Type: fix
- Current Stage: implementation
- Status: DONE
- Owner: Backend Builder
- Depends on: FULLARCH-AUDIT-2026-05-07
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
Architecture requires recovered imported LIVE positions to remain visible while
automation is fail-closed until canonical ownership and strategy context are
actionable. The runtime positions read model currently filters open positions
to `syncState=IN_SYNC`, hiding recovered imported rows with
`continuityState=RECOVERED_UNACTIONABLE` and `syncState=DRIFT`.

## Goal
Restore runtime positions visibility for recovered imported LIVE positions
without changing actionability, ownership proof, exchange execution, or
automation behavior.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- Focused API tests for runtime takeover/readback.

## Implementation Plan
1. Add a narrow reusable open-position sync predicate:
   - include normal `syncState=IN_SYNC` rows;
   - include only `origin=EXCHANGE_SYNC`,
     `continuityState=RECOVERED_UNACTIONABLE`, `syncState=DRIFT` rows.
2. Use that predicate for open runtime position reads and open-position
   aggregate/fee scopes.
3. Run focused tests proving recovered rows are visible and non-actionable.
4. Update source-of-truth files with the result.

## Acceptance Criteria
- Recovered imported LIVE position e2e test passes.
- `actionable` remains false unless `continuityState=CONFIRMED` and bot and
  strategy context are present.
- No unowned/manual/ambiguous row is made bot-managed by this fix.
- No exchange, DB schema, Web, or live-money behavior changes.

## Definition of Done
- [x] Code change is scoped to runtime read-model visibility.
- [x] Focused API regression tests pass.
- [x] Guardrails and diff validation pass.
- [x] Context/task board are updated.

## Result Report
- Task summary: runtime positions readback now includes recovered imported
  exchange-synced open positions with `RECOVERED_UNACTIONABLE` / `DRIFT` in
  the visible bot runtime set while preserving fail-closed actionability.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `docs/planning/fullarch-fix-01-recovered-imported-position-visibility-task-2026-05-07.md`
  - source-of-truth context files
- How tested:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-takeover.e2e.test.ts --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` -> PASS, 4/4.
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` -> PASS, 45/45.
  - `pnpm --filter api run typecheck` -> PASS.
  - `pnpm run quality:guardrails` -> PASS.
- What is incomplete: the six-position DB-backed import/readback regression and
  per-symbol reconciliation diagnostics remain separate follow-up slices.
- Next steps: implement `FULLARCH-FIX-02`.
- Decisions made: no architecture change was needed; the implementation was
  brought back to the documented visibility/actionability contract.
