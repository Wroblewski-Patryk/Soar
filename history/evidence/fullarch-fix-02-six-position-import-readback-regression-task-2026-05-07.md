# Task

## Header
- ID: FULLARCH-FIX-02
- Title: Add six-position exchange import/readback regression
- Task Type: test
- Current Stage: implementation
- Status: DONE
- Owner: Backend Builder
- Depends on: FULLARCH-FIX-01
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
The operator reported that only one out of six exchange positions imports into
the bot. Previous focused tests proved reconciliation and ownership pieces
individually, but no DB-backed vertical regression proved six exchange
positions become six bot-visible runtime rows through real ownership and
canonical bot market scope.

## Goal
Add a regression test covering:
exchange snapshot -> reconciliation -> real ownership resolver -> DB positions
-> selected bot runtime readback.

## Scope
- `apps/api/src/modules/bots/bots.runtime-takeover.e2e.test.ts`
- Task/source-of-truth documentation.

## Implementation Plan
1. Create a live wallet-backed active opted-in bot with one canonical active
   market group containing six symbols.
2. Mock exchange position snapshot for the same six symbols.
3. Run `reconcileExternalPositionsFromExchange` using default DB-backed deps
   except exchange network calls and automation side effects.
4. Assert six positions are persisted as `BOT_MANAGED`, `IN_SYNC`,
   `CONFIRMED`, and tied to the same bot/wallet/strategy.
5. Assert selected bot runtime positions endpoint returns all six symbols.

## Acceptance Criteria
- Six exchange positions in canonical bot scope become six bot-visible open
  runtime positions.
- Test uses real DB-backed ownership resolver and bot market scope, not a
  stubbed ownership map.
- No production credentials or live-money actions are used.

## Definition of Done
- [x] Regression test added.
- [x] Focused import/ownership/runtime pack passes.
- [x] API typecheck and guardrails pass.
- [x] Context/task board are updated.

## Result Report
- Task summary: added a DB-backed vertical regression proving six exchange
  positions in one active LIVE bot's canonical symbol scope import as six
  `BOT_MANAGED`, `IN_SYNC`, `CONFIRMED` positions and are all visible through
  selected-bot runtime readback.
- Files changed:
  - `apps/api/src/modules/bots/bots.runtime-takeover.e2e.test.ts`
  - `history/evidence/fullarch-fix-02-six-position-import-readback-regression-task-2026-05-07.md`
  - source-of-truth context files
- How tested:
  - `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-takeover.e2e.test.ts --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` -> PASS, 5/5.
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` -> PASS, 46/46.
  - `pnpm --filter api run typecheck` -> PASS.
  - `pnpm run quality:guardrails` -> PASS.
- What is incomplete: per-symbol reconciliation diagnostics remain a separate
  follow-up; production readback still requires authenticated read-only access.
- Next steps: implement `FULLARCH-FIX-03`.
- Decisions made: no import or ownership behavior changed in this slice; the
  existing approved happy path is now covered by a vertical regression.
