# Task

## Header
- ID: RUNTIME-AUDIT-38
- Title: Resolve non-running aggregate finishedAt from session window end
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-37
- Priority: P1
- Iteration: 56
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime session position reads resolve a non-running session window end from
`finishedAt ?? lastHeartbeatAt ?? startedAt`. Runtime monitoring aggregate
currently computes aggregate `sessionDetail.finishedAt` only from persisted
`finishedAt` values, so a failed/canceled/completed session with no persisted
`finishedAt` can show `sessionDetail.finishedAt: null` while nested runtime
windows have a concrete end.

## Goal
Keep non-running runtime monitoring aggregate session metadata aligned with the
same window-end fallback used by runtime position/trade reads.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard can show a failed aggregate as not
  running but with no finish timestamp even though the runtime window ended at
  the last heartbeat.
- Expected product or reliability outcome: aggregate top-level session metadata
  and nested runtime windows agree on non-running end time.
- How success will be observed: regression test proves a failed session without
  `finishedAt` returns aggregate `finishedAt` from `lastHeartbeatAt`.
- Post-launch learning needed: no

## Deliverable For This Stage
A failing-then-passing non-running aggregate end-time regression and scoped
read-model fix.

## Constraints
- reuse existing runtime session time fields
- do not change running aggregate `finishedAt: null`
- do not mutate persisted runtime sessions
- keep ownership and market scope filters unchanged
- do not introduce a new aggregate read path

## Implementation Plan
1. Add an e2e regression for a failed runtime session with `lastHeartbeatAt`
   but no `finishedAt`.
2. Resolve aggregate non-running `finishedAt` from
   `finishedAt ?? lastHeartbeatAt ?? startedAt`.
3. Run focused monitoring aggregate e2e, API typecheck, guardrails, lint, and
   diff review.

## Acceptance Criteria
- [x] FAILED aggregate without persisted `finishedAt` reports
  `sessionDetail.finishedAt` from `lastHeartbeatAt`.
- [x] RUNNING aggregate still reports `sessionDetail.finishedAt: null`.
- [x] Nested runtime windows remain unchanged.
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
- changing persisted runtime session data
- new systems without approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "uses last heartbeat as aggregate finish time" --sequence.concurrent=false`
    failed before the fix with `sessionDetail.finishedAt: null`, then passed
    after the fix.
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --sequence.concurrent=false`
    PASS (`9/9`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
- Manual checks: diff review confirmed the change is limited to aggregate
  non-running end-time metadata and regression coverage.
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
- Rollback note: revert this commit to restore persisted-`finishedAt`-only
  aggregate metadata.
- Observability or alerting impact: dashboard non-running end-time truth
  improves.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate `sessionDetail.finishedAt` ignores `lastHeartbeatAt` for
  non-running sessions.
- Gaps: no monitoring aggregate test covers failed session metadata when
  `finishedAt` is absent.
- Inconsistencies: runtime nested windows can end at `lastHeartbeatAt` while
  aggregate top-level metadata remains `null`.
- Architecture constraints: aggregate dashboard metadata should reuse runtime
  read-model window semantics and avoid duplicate truth.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-38`.
- Priority rationale: small runtime dashboard metadata drift affecting failed
  or otherwise non-running sessions.
- Why other candidates were deferred: limit semantics need product intent; this
  timestamp inconsistency is confirmed and reversible.

### 3. Plan Implementation
- Files or surfaces to modify: runtime monitoring aggregate read-model,
  monitoring aggregate e2e, task board, project state, next queue.
- Logic: preserve running `finishedAt: null`; for non-running aggregate, choose
  the latest concrete session window end from `finishedAt`, `lastHeartbeatAt`,
  or `startedAt`.
- Edge cases: failed session without `finishedAt`, running session, completed
  session with `finishedAt`.

### 4. Execute Implementation
- Implementation notes: added `resolveAggregateSessionWindowEnd` and used it
  for aggregate non-running `finishedAt` resolution while preserving running
  aggregate `finishedAt: null`.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full
  monitoring aggregate e2e, API typecheck, guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leaving `null` was rejected because nested runtime
  windows already have a concrete end from the same session.
- Technical debt introduced: no
- Scalability assessment: one helper calculation in an existing aggregate
  read-model.
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
- Task summary: non-running runtime monitoring aggregate `finishedAt` now uses
  the same session window-end fallback as nested runtime read models.
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
- Decisions made: running aggregate keeps `finishedAt: null`; non-running
  aggregate uses `finishedAt ?? lastHeartbeatAt ?? startedAt`.
