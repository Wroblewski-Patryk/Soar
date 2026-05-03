# Task

## Header
- ID: RUNTIME-AUDIT-58
- Title: Prevent aggregate running closed-position double counting
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-57
- Priority: P1
- Iteration: 76
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Aggregate `historyItems` are deduplicated by position ID, but closed-position
counts and realized PnL still summed all session position summaries. When two
RUNNING sessions overlap, the same newly closed position can be projected by
both sessions, leaving one visible history row but doubled closed count and
realized PnL.

## Goal
Keep aggregate running closed-position totals and realized PnL from
double-counting overlapping RUNNING session projections while preserving
historical non-running session sums.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Canonical planning/context docs for this iteration.

## Success Signal
- User or operator problem: dashboard can show one closed history row but
  doubled closed count and realized PnL during overlapping running sessions.
- Expected product or reliability outcome: running closed-position totals use
  one freshest running projection.
- How success will be observed: two overlapping RUNNING sessions with one
  closed position return `closedCount = 1` and realized PnL `12`.
- Post-launch learning needed: no

## Deliverable For This Stage
Released aggregate running closed-position overlap fix.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Reuse the existing running-overlap projection selection pattern.
2. Sum non-running position summaries as historical windows.
3. Include only the freshest RUNNING position summary for closed counts,
   realized PnL, and position fees.
4. Add an overlapping RUNNING closed-position regression.

## Acceptance Criteria
- Overlapping RUNNING sessions do not double-count closed-position totals.
- Visible history rows remain deduped.
- Existing aggregate and runtime-scope tests remain green.

## Definition of Done
- [x] Focused monitoring aggregate e2e passes.
- [x] Runtime-scope e2e passes.
- [x] API typecheck passes.
- [x] Repository guardrails and lint pass.
- [x] Diff review confirms scope is limited to running closed-position summary composition.

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
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run --sequence.concurrent=false` PASS (`16/16`)
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run --sequence.concurrent=false` PASS (`13/13`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `git diff --check` PASS
- Manual checks: code review confirmed scope is limited to aggregate running
  closed-position summary composition and regression coverage.
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
- Rollback note: revert this commit to restore prior all-session running
  position summary summing.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: closed-position totals and realized PnL could double-count
  overlapping RUNNING projections.
- Gaps: overlap regression covered open state and trade totals, not closed
  position history summaries.
- Inconsistencies: one visible history row could report closed count two.
- Architecture constraints: preserve historical non-running sums and avoid a new
  query path.

### 2. Select One Priority Task
- Selected task: prevent running closed-position double counting.
- Priority rationale: money-impacting dashboard summary drift.
- Why other candidates were deferred: symbols-tracked overlap was rejected after
  test evidence showed it represents configured scope metadata.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, aggregate e2e test,
  planning/context docs.
- Logic: sum all non-running rows plus the freshest running row for position
  history summaries.
- Edge cases: overlapping running sessions, deduped visible history, non-running
  session history.

### 4. Execute Implementation
- Implementation notes: reused the running-overlap projection helper for
  position history summaries, so aggregate closed-position counts, realized
  PnL, and position fees sum all non-running rows plus only the freshest
  RUNNING projection.

### 5. Verify and Test
- Validation performed: focused aggregate e2e, runtime-scope e2e, API
  typecheck, lint, repository guardrails, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: derive totals from visible history rows.
- Technical debt introduced: no
- Scalability assessment: uses already-loaded session read models, no extra DB
  query.
- Refinements made: consolidated position history summary rows into one local
  `historicalPositionRows` selection before composing `positionsSummary` and
  aggregate counts.

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
This slice intentionally keeps completed/non-running history aggregation
unchanged.

## Production-Grade Required Contract
- Goal: prevent aggregate running closed-position double counting.
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
- Existing workaround or pain: contradictory history rows and summary totals.
- Smallest useful slice: running closed-position summary row selection.
- Success metric or signal: overlap regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring dashboard.
- SLI: aggregate running closed-position totals equal one freshest running
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
- Security tests or scans: ownership isolation remains covered by aggregate tests.
- Fail-closed behavior: unchanged.
- Residual risk: completed-session overlap remains a separate analysis topic.

## Result Report
- Task summary: aggregate closed-position history totals now avoid double
  counting overlapping RUNNING session projections.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-58-aggregate-running-closed-position-overlap-task-2026-05-03.md`
- How tested: focused monitoring aggregate e2e (`16/16`), runtime-scope e2e
  (`13/13`), API typecheck, lint, repository guardrails, and diff review.
- What is incomplete: nothing in this slice.
- Next steps: continue one-task runtime audit for the next dashboard LIVE/PAPER
  drift candidate.
- Decisions made: keep completed/non-running history aggregation unchanged and
  treat only overlapping RUNNING rows as current projection overlap.
