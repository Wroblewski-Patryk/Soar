# RUNTIME-AUDIT-05 Runtime Rows Canonical Symbol Scope

## Header
- ID: RUNTIME-AUDIT-05
- Title: Keep selected-bot runtime rows scoped to active canonical symbols
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-04
- Priority: P1
- Iteration: 23
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After explicit symbol filters were locked down, unfiltered runtime read endpoints still had one residual drift: persisted `Trade.botId` and `Position.botId` rows for stale/off-scope symbols could appear in selected-bot dashboard history and open position lists after market reassignment.

## Goal
Make selected-bot runtime row reads consistent across `symbol-stats`, `trades`, and `positions`: filtered and unfiltered runtime rows must be constrained by the selected bot's active canonical configured symbols.

## Scope
- `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- `apps/api/src/modules/bots/bots.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/modules/api-bots.md`

## Implementation Plan
1. Extend positions runtime bot context with canonical symbol group symbols and market-universe filter metadata.
2. Resolve selected-bot configured symbols with the existing catalog-aware symbol resolver.
3. Apply `symbol in scopedSymbols` to runtime positions, open orders, carry-over positions, and unfiltered runtime trade history.
4. Add regression coverage for stale off-scope trade and position rows.
5. Update dynamic-stop fixture to include all symbols it intentionally asserts.
6. Run focused and broader monitoring/position validations.

## Acceptance Criteria
- Unfiltered runtime trade history does not include stale off-scope symbols.
- Unfiltered runtime positions do not include stale off-scope symbols.
- Explicit off-scope symbol filters still return empty responses.
- Existing in-scope dynamic-stop and monitoring payload tests continue to pass.
- No new symbol-scope system is introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for the touched backend runtime slice.
- [x] Existing canonical symbol resolver reused.
- [x] Regression test covers stale off-scope trades and positions.
- [x] Docs and context updated.
- [x] Validation evidence recorded.

## Forbidden
- Letting selected-bot dashboard runtime rows rely only on persisted `botId`.
- Adding parallel symbol-scope logic.
- Hiding fixture mismatch by relaxing product assertions.
- Running DB-backed e2e evidence in parallel.

## Validation Evidence
- Tests:
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts -t "keeps runtime symbol-stats strictly" --run --sequence.concurrent=false` PASS (`1/1`, `9` skipped).
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts --run --sequence.concurrent=false` PASS (`57/57`).
- Manual checks: reviewed runtime row query filters for stats/trades/positions/aggregate.
- Screenshots/logs: not applicable.
- High-risk checks: position-management dashboard payloads and close command tests included.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
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
- Rollback note: revert this commit to restore previous unfiltered runtime row behavior.
- Observability or alerting impact: dashboard runtime rows should no longer show stale off-scope symbols after market reassignment.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: unfiltered trades and positions could leak stale off-scope rows.
- Gaps: prior fix covered explicit trade filters but not full list scope.
- Inconsistencies: `symbol-stats` was strict while `trades` and `positions` were still persisted-row scoped.
- Architecture constraints: selected-bot dashboard reads must reflect active canonical runtime topology.

### 2. Select One Priority Task
- Selected task: close unfiltered selected-bot runtime row scope drift.
- Priority rationale: directly affects dashboard truth for live/paper position management.
- Why other candidates were deferred: this drift was confirmed by failing regression and had a narrow fix.

### 3. Plan Implementation
- Files or surfaces to modify: runtime trades/positions read services, repository select, runtime-scope e2e, docs/context.
- Logic: derive configured symbols once from canonical group and apply to runtime row queries.
- Edge cases: stale direct `botId` rows, explicit off-scope filters, fixture symbols intentionally asserted by dynamic-stop tests.

### 4. Execute Implementation
- Implementation notes: reused `resolveEffectiveSymbolGroupSymbolsWithCatalog` and `normalizeSymbols`.

### 5. Verify and Test
- Validation performed: focused regression and wider monitoring/positions pack.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only filtering explicit `symbol` requests. Rejected because aggregate and dashboard default views use unfiltered reads.
- Technical debt introduced: no.
- Scalability assessment: symbol filtering happens before DB row retrieval and reduces stale row volume.
- Refinements made: dynamic-stop fixture now declares the full market scope it expects.

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
- Task summary: selected-bot runtime trades and positions now filter both explicit and unfiltered reads through active canonical configured symbols.
- Files changed: listed in `Scope`.
- How tested: validation commands listed above.
- What is incomplete: production readback/deploy verification remains queued separately.
- Next steps: continue auditing remaining runtime dashboard rows and production readback.
- Decisions made: off-scope persisted bot rows are not valid selected-bot dashboard rows after market reassignment.
