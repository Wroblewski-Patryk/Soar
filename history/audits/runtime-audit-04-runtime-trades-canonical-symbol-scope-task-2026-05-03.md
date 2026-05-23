# RUNTIME-AUDIT-04 Runtime Trades Canonical Symbol Scope

## Header
- ID: RUNTIME-AUDIT-04
- Title: Keep runtime trade history scoped to selected bot canonical symbols
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: DASHDRIFT-05, RUNTIME-AUDIT-03
- Priority: P1
- Iteration: 22
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The selected-bot `symbol-stats` read path is now locked to active canonical market scope, but the runtime trade-history endpoint still accepted an explicit `symbol` filter based only on persisted trade `botId` and symbol. That allowed stale historical rows from a previous or off-scope market to appear in dashboard monitoring even when the active selected-bot market group no longer included the symbol.

## Goal
Align runtime trade history with selected-bot symbol-stats and monitoring aggregate scope: explicit trade symbol filters must be intersected with the selected bot's active canonical configured symbols before returning rows.

## Scope
- `apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/modules/api-bots.md`

## Implementation Plan
1. Extend runtime trade bot context with active canonical market-group symbol scope and legacy symbol-group fallback data.
2. Resolve configured symbols through the existing market-universe/catalog-aware resolver.
3. For explicit `symbol` filters outside selected-bot scope, return an empty paginated trade response.
4. Add regression coverage proving stale off-scope trade rows are hidden while symbol-stats remains strict.
5. Run focused and broader monitoring validations.

## Acceptance Criteria
- `GET /dashboard/bots/:id/runtime-sessions/:sessionId/trades?symbol=<off-scope>` returns `total=0` and no items when the symbol is outside selected-bot active canonical scope.
- Existing in-scope trade history queries continue to work.
- Monitoring aggregate remains compatible because it calls the same trade read service.
- No new symbol-scope system is introduced.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for the touched backend slice.
- [x] Existing canonical symbol resolver reused.
- [x] Regression test proves the confirmed stale trade leak is closed.
- [x] Docs and context updated.
- [x] Validation evidence recorded.

## Forbidden
- Filtering trade scope using only persisted `Trade.botId`.
- Adding a parallel symbol resolver.
- Returning stale off-scope trade rows through selected-bot dashboard monitoring.
- Running DB-backed e2e evidence in parallel.

## Validation Evidence
- Tests:
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts -t "keeps runtime symbol-stats strictly" --run --sequence.concurrent=false` PASS (`1/1`, `9` skipped).
  - `pnpm --filter api test -- src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/runtimeSessionSymbolStatsRead.service.test.ts --run --sequence.concurrent=false` PASS (`45/45`).
- Manual checks: reviewed runtime trades query scope and aggregate caller path.
- Screenshots/logs: not applicable.
- High-risk checks: selected-bot dashboard runtime history and aggregate paths included.

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
- Rollback note: revert this commit to restore previous trade-history symbol filter behavior.
- Observability or alerting impact: selected-bot monitoring history becomes stricter and less likely to show stale rows.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime trade history could return off-scope stale rows for explicit symbol filters.
- Gaps: symbol-stats had canonical scope enforcement, but trade history did not.
- Inconsistencies: dashboard aggregate could combine canonical symbol-stats with non-canonical trade history.
- Architecture constraints: selected-bot dashboard reads must reflect active canonical runtime topology.

### 2. Select One Priority Task
- Selected task: close runtime trade-history selected-bot symbol scope drift.
- Priority rationale: directly affects dashboard truth for position management history.
- Why other candidates were deferred: this was a confirmed failing regression with a narrow fix.

### 3. Plan Implementation
- Files or surfaces to modify: runtime trade repository/service, runtime-scope e2e, docs/context.
- Logic: reuse existing catalog-aware symbol resolver and empty paginated response shape.
- Edge cases: stale direct `Trade.botId` row for off-scope symbol, aggregate caller compatibility.

### 4. Execute Implementation
- Implementation notes: repository now loads canonical and legacy symbol-group context; service validates explicit symbols before trade queries.

### 5. Verify and Test
- Validation performed: focused regression and broader monitoring pack.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: filtering only by known active symbols from request context. Rejected because the service already has a shared catalog-aware symbol resolver.
- Technical debt introduced: no.
- Scalability assessment: only explicit symbol filters perform scope validation before query; existing pagination and sorting behavior is unchanged.
- Refinements made: regression added to existing selected-bot scope test.

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
- Task summary: runtime trade history now rejects explicit off-scope symbol filters using selected-bot canonical symbol scope.
- Files changed: listed in `Scope`.
- How tested: validation commands listed above.
- What is incomplete: production readback/deploy verification remains queued separately.
- Next steps: continue auditing runtime positions and aggregate display parity for remaining stale direct projections.
- Decisions made: stale off-scope trades are hidden from selected-bot monitoring rather than treated as valid selected-bot history.
