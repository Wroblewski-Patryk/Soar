# Task

## Header
- ID: RUNTIME-AUDIT-35
- Title: Keep empty running aggregate unfinished
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-34
- Priority: P1
- Iteration: 53
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime monitoring aggregate returns a deterministic empty payload when no
runtime sessions match the selected bot and filters. After `RUNTIME-AUDIT-34`,
the empty payload preserves bot mode, but it still sets `finishedAt` to the
current time even when the requested empty state is `RUNNING`.

## Goal
Keep empty runtime monitoring aggregate session metadata internally consistent
for `RUNNING` filters.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard can render an empty aggregate as
  `RUNNING` and simultaneously finished.
- Expected product or reliability outcome: empty running aggregate metadata
  represents an unfinished runtime state.
- How success will be observed: regression test proves `status=RUNNING` empty
  aggregate returns `finishedAt: null`.
- Post-launch learning needed: no

## Deliverable For This Stage
A failing-then-passing monitoring aggregate empty running-state regression and
scoped read-model fix.

## Constraints
- reuse existing empty aggregate builder
- do not change non-empty aggregate session metadata
- do not change empty completed/failed/canceled semantics beyond the selected
  running-state contradiction
- keep ownership checks unchanged

## Implementation Plan
1. Add an e2e regression for empty aggregate queried with `status=RUNNING`.
2. Resolve empty aggregate status once in the builder.
3. Return `sessionDetail.finishedAt: null` when the empty aggregate status is
   `RUNNING`.
4. Run focused monitoring aggregate e2e, API typecheck, guardrails, lint, and
   diff review.

## Acceptance Criteria
- [x] Empty aggregate with `status=RUNNING` reports `finishedAt: null`.
- [x] Empty aggregate keeps deterministic zero totals and counts.
- [x] Non-empty aggregate metadata remains unchanged.
- [x] Source-of-truth docs are updated.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this runtime read-model slice.
- [x] Regression test fails before the fix and passes after the fix.
- [x] Relevant validation commands pass.
- [x] Diff review confirms no workaround, duplicate pipeline, or unrelated
  cleanup was introduced.

## Forbidden
- dashboard-only masking
- temporary bypasses
- changing runtime session persistence
- new systems without approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "keeps empty RUNNING aggregate metadata unfinished" --sequence.concurrent=false`
    failed before the fix with a serialized timestamp in `finishedAt`, then
    passed after the fix.
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --sequence.concurrent=false`
    PASS (`7/7`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
- Manual checks: diff review confirmed the change is limited to empty running
  aggregate metadata and regression coverage.
- Screenshots/logs: not applicable
- High-risk checks: read-model metadata only; no trading lifecycle decisions
  changed.

## Architecture Evidence
- Architecture source reviewed: docs/architecture/01_overview-and-principles.md,
  docs/modules/system-modules.md,
  docs/architecture/architecture-source-of-truth.md
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous empty aggregate
  `finishedAt` metadata.
- Observability or alerting impact: dashboard empty-state metadata improves.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `buildEmptyAggregatePayload` sets `finishedAt` to `now` regardless
  of the empty aggregate status.
- Gaps: monitoring aggregate e2e covers empty payload but not empty
  `status=RUNNING` timestamp consistency.
- Inconsistencies: non-empty running aggregate sets `finishedAt: null`, while
  empty running aggregate sets a finish timestamp.
- Architecture constraints: dashboard runtime metadata should remain internally
  consistent and source-of-truth oriented.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-35`.
- Priority rationale: this is a small dashboard truth drift in runtime
  monitoring metadata.
- Why other candidates were deferred: broader aggregate limit and lifecycle
  audits remain, but this is the smallest confirmed inconsistency.

### 3. Plan Implementation
- Files or surfaces to modify: runtime monitoring aggregate read-model,
  monitoring aggregate e2e, task board, project state, next queue.
- Logic: compute empty status once and null `finishedAt` for empty running
  aggregate metadata.
- Edge cases: empty default completed aggregate, empty running aggregate,
  non-empty running aggregate.

### 4. Execute Implementation
- Implementation notes: `buildEmptyAggregatePayload` now resolves the effective
  empty aggregate status once and sets `sessionDetail.finishedAt` to `null`
  when that status is `RUNNING`.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full
  monitoring aggregate e2e, API typecheck, guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: changing only the test expectation was rejected;
  the read-model metadata is contradictory.
- Technical debt introduced: no
- Scalability assessment: no query or data-shape expansion, only timestamp
  consistency in an existing builder.
- Refinements made: none needed after focused verification.

### 7. Update Documentation and Knowledge
- Docs updated: task doc and MVP next-commits queue.
- Context updated: task board and project state.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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
- Task summary: empty runtime monitoring aggregate metadata now keeps
  `finishedAt: null` when the effective empty aggregate status is `RUNNING`.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused regression, full monitoring aggregate e2e, API
  typecheck, guardrails, lint, and diff review.
- What is incomplete: nothing for this slice.
- Next steps: continue the runtime dashboard audit with the next smallest
  position/trade/wallet/market/strategy truth drift.
- Decisions made: default empty aggregate still reports `COMPLETED` with a
  deterministic finish timestamp.
