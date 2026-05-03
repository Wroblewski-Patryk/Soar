# RUNTIME-AUDIT-06 Close Position Canonical Symbol Scope

## Header
- ID: RUNTIME-AUDIT-06
- Title: Fail closed dashboard close for off-scope selected-bot positions
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-05
- Priority: P1
- Iteration: 24
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Selected-bot read models now hide stale off-scope runtime rows after market reassignment, but the money-impacting dashboard close command still needed the same guard. A cached URL or direct API call could target a stale `Position.botId` row outside the selected bot's active market scope.

## Goal
Make dashboard position close fail closed unless the target position symbol belongs to the selected bot's configured active canonical symbol scope.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts`
- `apps/api/src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/modules/api-bots.md`

## Implementation Plan
1. Extend close-command bot context with canonical and legacy symbol-group scope.
2. Reuse the catalog-aware symbol resolver before ownership claim/backfill or close orchestration.
3. Return the existing ignored/no-open-position response for off-scope targets.
4. Add a unit regression proving directly owned off-scope positions are not closed.
5. Align imported-DCA fixtures with their intended symbol-group scope.
6. Run focused and broader close/imported-position validations.

## Acceptance Criteria
- Off-scope directly owned positions return `{ status: 'ignored', reason: 'no_open_position' }`.
- Close orchestration is not called for off-scope positions.
- In-scope dashboard close and imported DCA visibility continue to pass.
- No new symbol-scope system is introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for the touched money-impacting backend slice.
- [x] Existing canonical symbol resolver reused.
- [x] Fail-closed behavior covered by tests.
- [x] Docs and context updated.
- [x] Validation evidence recorded.

## Forbidden
- Closing selected-bot positions outside the bot's active configured symbol scope.
- Guessing scope from stale direct `Position.botId` alone.
- Adding parallel scope resolution logic.
- Running DB-backed e2e evidence in parallel.

## Validation Evidence
- Tests:
  - `pnpm --filter api test -- src/modules/bots/runtimeSessionPositionCommand.service.test.ts --run` PASS (`9/9`).
  - `pnpm --filter api test -- src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts --run --sequence.concurrent=false` PASS (`74/74`).
- Manual checks: reviewed close path ordering so scope check runs before ownership backfill and `orchestrateRuntimeSignal`.
- Screenshots/logs: not applicable.
- High-risk checks: money-impacting close command and imported LIVE/PAPER continuity tests included.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/modules/api-bots.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: module docs updated.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore previous close-command scope behavior.
- Observability or alerting impact: off-scope dashboard close attempts now surface as ignored/no-open-position.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: close command could target stale off-scope positions even after read models hid them.
- Gaps: selected-bot symbol scope was enforced for rows but not for the close command.
- Inconsistencies: dashboard display and command actionability did not share the same symbol boundary.
- Architecture constraints: money-impacting lifecycle commands must fail closed against canonical selected-bot topology.

### 2. Select One Priority Task
- Selected task: close-command canonical symbol-scope guard.
- Priority rationale: money-impacting action path.
- Why other candidates were deferred: this was the next confirmed command/read parity gap.

### 3. Plan Implementation
- Files or surfaces to modify: close command service, close command unit test, imported DCA fixtures, docs/context.
- Logic: resolve configured symbols from canonical market group before close orchestration.
- Edge cases: directly owned stale position, legacy bots without symbol-group context, imported position fixtures.

### 4. Execute Implementation
- Implementation notes: compatibility remains for legacy test contexts without any configured symbol group; when a group exists, scope is enforced.

### 5. Verify and Test
- Validation performed: focused unit regression and broad runtime/positions pack.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: rely on hidden read rows only. Rejected because command endpoints must be safe against stale clients/direct calls.
- Technical debt introduced: no.
- Scalability assessment: one configured-symbol resolution per close request is acceptable and reuses existing cache-aware resolver.
- Refinements made: imported-DCA fixtures now explicitly declare the intended symbol in the assigned market group.

### 7. Update Documentation and Knowledge
- Docs updated: planning task, task board, project state, MVP queue, API bots module.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: dashboard close now ignores off-scope selected-bot positions before ownership mutation or close orchestration.
- Files changed: listed in `Scope`.
- How tested: validation commands listed above.
- What is incomplete: production readback/deploy verification remains queued separately.
- Next steps: continue auditing remaining command paths and production readback.
- Decisions made: off-scope selected-bot close attempts use the existing `no_open_position` ignored result.
