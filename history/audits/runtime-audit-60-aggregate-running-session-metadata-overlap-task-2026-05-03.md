# Task

## Header
- ID: RUNTIME-AUDIT-60
- Title: Prevent aggregate running session metadata double counting
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-59
- Priority: P1
- Iteration: 78
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Aggregate runtime read models now avoid overlapping RUNNING projection double
counts for symbols, trades, positions, and PnL summaries. The aggregate session
metadata still sums `durationMs` and `eventsCount` across every active session.
When duplicate RUNNING sessions overlap, this can make dashboard status
metadata show double elapsed runtime and double active event count while the
rest of the aggregate read model already uses the freshest RUNNING projection.

## Goal
Keep aggregate running session metadata from double-counting overlapping
RUNNING projections while preserving non-running historical session metadata
sums.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Canonical planning/context docs for this iteration.

## Success Signal
- User or operator problem: dashboard aggregate status metadata can overstate
  active runtime duration and event count during overlapping RUNNING sessions.
- Expected product or reliability outcome: aggregate metadata uses one freshest
  RUNNING projection for runtime duration and event count.
- How success will be observed: two overlapping RUNNING sessions with one event
  each return one freshest running duration and one event count.
- Post-launch learning needed: no

## Deliverable For This Stage
Released aggregate running session metadata overlap regression and fix.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add an aggregate e2e regression for overlapping RUNNING `durationMs` and
   `eventsCount`.
2. Reuse the existing running projection row selector for aggregate session
   metadata totals.
3. Keep `sessionsCount` and `symbolsTracked` unchanged because they describe
   observed sessions and configured symbol scope.
4. Run focused aggregate and runtime-scope validation, then sync docs/context.

## Acceptance Criteria
- Overlapping RUNNING sessions do not double-count aggregate `durationMs`.
- Overlapping RUNNING sessions do not double-count aggregate `eventsCount`.
- Existing aggregate, runtime-scope, typecheck, lint, and guardrails remain
  green.

## Definition of Done
- [x] Focused monitoring aggregate e2e passes.
- [x] Runtime-scope e2e passes.
- [x] API typecheck passes.
- [x] Repository guardrails and lint pass.
- [x] Diff review confirms scope is limited to aggregate session metadata
  projection composition.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run --sequence.concurrent=false` PASS (`18/18`)
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run --sequence.concurrent=false` PASS (`13/13`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `git diff --check` PASS
- Manual checks: code review confirmed scope is limited to aggregate session
  metadata projection selection and regression coverage.
- Screenshots/logs: not applicable
- High-risk checks: read-only dashboard aggregate path, no trading side effects.

## Architecture Evidence
- Architecture source reviewed: `.codex/context/PROJECT_STATE.md`,
  `.codex/context/TASK_BOARD.md`, `docs/planning/mvp-next-commits.md`,
  `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore prior all-active-session
  metadata summing.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate `durationMs` and `eventsCount` still sum every active
  session row.
- Gaps: overlap regressions covered runtime content summaries, not aggregate
  session metadata.
- Inconsistencies: active dashboard metadata can drift above the corrected
  aggregate current-state projection.
- Architecture constraints: preserve completed/non-running sums and reuse the
  existing aggregate read model.

### 2. Select One Priority Task
- Selected task: prevent running session metadata double counting.
- Priority rationale: status metadata is part of dashboard truth for live/paper
  runtime health.
- Why other candidates were deferred: broader process lifecycle cleanup is
  outside this one reversible read-model slice.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, aggregate e2e test,
  planning/context docs.
- Logic: sum all non-running rows plus the freshest RUNNING row for duration
  and event metadata.
- Edge cases: overlapping running sessions, completed session windows, retained
  observed `sessionsCount`.

### 4. Execute Implementation
- Implementation notes: added a failing-then-passing overlapping RUNNING
  session metadata regression and reused the existing running projection
  selector for aggregate `durationMs` and `eventsCount`.

### 5. Verify and Test
- Validation performed: focused aggregate e2e, runtime-scope e2e, API
  typecheck, lint, repository guardrails, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave session metadata as raw active-session sum.
- Technical debt introduced: no
- Scalability assessment: uses already-loaded session summaries, no extra DB
  query.
- Refinements made: kept `sessionsCount` and `symbolsTracked` unchanged to
  preserve diagnostic session visibility and configured symbol-scope metadata.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, task board, project state, next-commits queue.
- Context updated: task board, project state, and next-commits queue.
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

## Notes
This slice intentionally keeps aggregate `sessionsCount` and `symbolsTracked`
unchanged.

## Production-Grade Required Contract
- Goal: prevent aggregate running session metadata double counting.
- Scope: API aggregate read model, e2e regression, planning/context docs.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: follows `DEFINITION_OF_DONE.md` through focused e2e,
  runtime-scope regression, typecheck, guardrails, lint, and self-review.
- Result Report: pending.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard bot operator.
- Existing workaround or pain: inflated aggregate runtime status metadata.
- Smallest useful slice: running session metadata row selection.
- Success metric or signal: overlap regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring dashboard.
- SLI: aggregate running session metadata equals one freshest running
  projection.
- SLO: not separately defined.
- Error budget posture: not applicable
- Health/readiness check: unaffected.
- Logs, dashboard, or alert route: existing API logs.
- Smoke command or manual smoke: focused monitoring aggregate e2e.
- Rollback or disable path: revert commit.

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user-owned trading runtime data.
- Trust boundaries: authenticated owned bot API route.
- Permission or ownership checks: existing aggregate route ownership checks.
- Abuse cases: cross-user data leakage unchanged.
- Secret handling: no secrets touched.
- Security tests or scans: ownership isolation remains covered by aggregate
  tests.
- Fail-closed behavior: unchanged.
- Residual risk: actual duplicate runtime process prevention remains separate
  lifecycle work.

## Result Report
- Task summary: aggregate session metadata now avoids double counting
  overlapping RUNNING session projections for `durationMs` and `eventsCount`.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-60-aggregate-running-session-metadata-overlap-task-2026-05-03.md`
- How tested: focused monitoring aggregate e2e (`18/18`), runtime-scope e2e
  (`13/13`), API typecheck, lint, repository guardrails, and diff review.
- What is incomplete: nothing in this slice.
- Next steps: continue one-task runtime audit for the next dashboard LIVE/PAPER
  drift candidate.
- Decisions made: keep aggregate `sessionsCount` and `symbolsTracked`
  unchanged while treating overlapping RUNNING duration/event metadata as
  duplicate current projections.
