# Task

## Header
- ID: RUNTIME-AUDIT-37
- Title: Do not invent heartbeat for empty runtime aggregate
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-36
- Priority: P1
- Iteration: 55
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime monitoring aggregate returns a synthetic empty `sessionDetail` when no
runtime sessions match the selected bot and filters. That empty object still
sets `lastHeartbeatAt` to the current time even though `sessionsCount` is `0`.

## Goal
Prevent empty aggregate metadata from implying a fresh runtime heartbeat when
there is no runtime session.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard can interpret an empty aggregate as fresh
  because `lastHeartbeatAt` is set to now.
- Expected product or reliability outcome: empty aggregate metadata makes the
  absence of runtime sessions explicit.
- How success will be observed: regression test proves empty aggregate returns
  `sessionDetail.lastHeartbeatAt: null`.
- Post-launch learning needed: no

## Deliverable For This Stage
A failing-then-passing empty aggregate heartbeat regression and scoped metadata
fix.

## Constraints
- reuse existing empty aggregate builder
- do not change non-empty aggregate heartbeat resolution
- do not change runtime session persistence
- keep deterministic empty timestamps for synthetic window fields where
  already expected
- keep ownership checks unchanged

## Implementation Plan
1. Add an e2e regression proving empty aggregate does not expose a synthetic
   heartbeat.
2. Set empty aggregate `sessionDetail.lastHeartbeatAt` to `null`.
3. Run focused monitoring aggregate e2e, API typecheck, guardrails, lint, and
   diff review.

## Acceptance Criteria
- [x] Empty aggregate with no sessions reports `lastHeartbeatAt: null`.
- [x] Empty aggregate still reports `sessionsCount: 0`.
- [x] Non-empty aggregate heartbeat behavior is unchanged.
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
- changing persisted runtime sessions
- new systems without approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "returns deterministic empty aggregate payload" --sequence.concurrent=false`
    failed before the fix with a serialized `lastHeartbeatAt` timestamp, then
    passed after the fix.
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --sequence.concurrent=false`
    PASS (`8/8`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
- Manual checks: diff review confirmed the change is limited to empty aggregate
  heartbeat metadata and regression coverage.
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
- Rollback note: revert this commit to restore previous synthetic empty
  heartbeat metadata.
- Observability or alerting impact: dashboard empty-state freshness truth
  improves.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `buildEmptyAggregatePayload` sets `lastHeartbeatAt` to `now` when no
  sessions exist.
- Gaps: monitoring aggregate e2e covers empty payload but not heartbeat
  absence.
- Inconsistencies: `metadata.sessionsCount: 0` conflicts with a fresh heartbeat
  timestamp.
- Architecture constraints: dashboard runtime freshness should come from real
  runtime session data, not synthetic placeholders.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-37`.
- Priority rationale: TESTER-mode audit found a clear false-freshness
  empty-state metadata bug.
- Why other candidates were deferred: per-session limit semantics need more
  product intent; this heartbeat issue is unambiguous and tiny.

### 3. Plan Implementation
- Files or surfaces to modify: runtime monitoring aggregate read-model,
  monitoring aggregate e2e, task board, project state, next queue.
- Logic: leave empty synthetic timestamps intact except for real session
  heartbeat, which should be `null` without sessions.
- Edge cases: no sessions, empty running filter, non-empty running session.

### 4. Execute Implementation
- Implementation notes: empty aggregate `sessionDetail.lastHeartbeatAt` now
  returns `null`, while non-empty aggregate heartbeat resolution remains based
  on real runtime sessions.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full
  monitoring aggregate e2e, API typecheck, guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leaving heartbeat as `now` was rejected because it
  falsely suggests runtime freshness.
- Technical debt introduced: no
- Scalability assessment: one metadata field in an existing builder.
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
- Task summary: empty runtime monitoring aggregate payloads no longer invent a
  fresh `lastHeartbeatAt` when no runtime sessions exist.
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
- Decisions made: synthetic empty window timestamps remain, but session
  heartbeat is reserved for real runtime sessions.
