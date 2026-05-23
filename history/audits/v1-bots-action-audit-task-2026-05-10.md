# Task

## Header
- ID: V1-BOTS-ACTION-AUDIT-2026-05-10
- Title: Verify Bots module action-level behavior after P0 deletion regression
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: `V1-PRODUCT-ACTION-AUDIT-P0-2026-05-10`
- Priority: P0
- Iteration: 2026-05-10-BOTS-ACTION-AUDIT
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is TESTER because this slice validates action behavior.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The product action audit matrix marks Bots as `FAIL` because a user-visible
delete action failed in production and prior route/module reachability evidence
did not catch it. The backend P0 cleanup fix is in place, but the active list
UI also needs action-level regression coverage for success and failure states.

## Goal
Close the first Bots action audit slice by proving the current Bots list UI and
Bots API action contracts cover delete success/failure, CRUD, activation,
market groups, strategy links, assistant config, and ownership/security paths.

## Scope
- `apps/web/src/features/bots/components/BotsListTable.test.tsx`
- `history/audits/v1-product-action-audit-matrix-2026-05-10.md`
- canonical state/context files updated in this task

## Implementation Plan
1. Add `BotsListTable` action tests for delete success and API failure.
2. Run focused Web list-table tests.
3. Run focused API Bots module action packs that cover CRUD, activation, market groups, strategy links, assistant config, duplicate guards, wallet contracts, subscription gates, and orchestration.
4. Update the action audit matrix with evidence and remaining Bots gaps.
5. Update source-of-truth state.

## Acceptance Criteria
- The current Bots list UI removes the deleted row only after delete success.
- The current Bots list UI preserves the row after delete API failure.
- Focused API Bots action packs pass locally.
- The product action matrix no longer leaves Bots as a generic `FAIL`; it records passed action families and any remaining gaps precisely.

## Definition of Done
- [x] Focused Web Bots list action tests pass.
- [x] Focused API Bots action packs pass.
- [x] Audit matrix updated with exact Bots status.
- [x] State/context updated.

## Result Report
- Task summary: added action-level Bots list delete regression coverage and
  hardened Bots e2e runtime close setup with deterministic runtime ticker
  state. Reset helpers now clear the runtime ticker store between Bots e2e
  cases to avoid hidden cross-test state.
- Files changed:
  `apps/web/src/features/bots/components/BotsListTable.test.tsx`,
  `apps/api/src/modules/bots/bots.e2e.test.ts`,
  `apps/api/src/modules/bots/bots.e2e.shared.ts`,
  `history/audits/v1-product-action-audit-matrix-2026-05-10.md`.
- How tested:
  `apps/web`: `node_modules/.bin/vitest.CMD run src/features/bots/components/BotsListTable.test.tsx --run` => `4/4 PASS`;
  `node_modules/.bin/tsc.CMD --noEmit` => `PASS`.
  `apps/api`: `node_modules/.bin/vitest.CMD run src/modules/bots/bots.e2e.test.ts --run --sequence.concurrent=false` => `27/27 PASS`;
  `node_modules/.bin/vitest.CMD run src/modules/bots/bots.duplicate-guard.e2e.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts --run --sequence.concurrent=false` => `17/17 PASS`;
  `node_modules/.bin/tsc.CMD --noEmit` => `PASS`.
- What is incomplete: production-safe clickthrough for Bots remains separate;
  do not treat local safe-fixture action proof as destructive production proof.
- Next steps: execute the Dashboard Home/runtime table action audit slice from
  the matrix, then continue module-by-module.
