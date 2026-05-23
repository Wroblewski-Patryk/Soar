# Task

## Header
- ID: RUNTIME-AUDIT-55
- Title: Keep aggregate total positions aligned with deduped current open count
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-54
- Priority: P1
- Iteration: 73
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-54` changed aggregate current open-position count to freshest
session truth. The aggregate `positions.total` field still summed each session
response independently, which could leave total positions inconsistent with
the final `openCount` and `closedCount` in overlapping running-session cases.

## Goal
Make aggregate `positions.total` derive from the final aggregate open and
closed counts so dashboard totals stay internally consistent.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Canonical planning/context docs for this iteration.

## Success Signal
- User or operator problem: dashboard can show one open row and one open count
  while `total` still says two positions.
- Expected product or reliability outcome: `positions.total = openCount +
  closedCount` after aggregate composition.
- How success will be observed: overlapping-session regression returns
  `total = 1`, `openCount = 1`, `closedCount = 0`.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified aggregate total-count consistency fix.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Keep current open-count composition from `RUNTIME-AUDIT-54`.
2. Keep closed-count session aggregation unchanged for this slice.
3. Compute aggregate `positions.total` from the final open and closed counts.
4. Extend the overlap regression to assert total/count consistency.

## Acceptance Criteria
- Aggregate total count is derived from final open and closed counts.
- Overlapping running sessions with one open position return total one.
- Existing aggregate tests remain green.

## Definition of Done
- [x] Focused monitoring aggregate e2e passes.
- [x] Runtime-scope e2e passes.
- [x] API typecheck passes.
- [x] Repository guardrails and lint pass.
- [x] Diff review confirms scope is limited to total-count consistency.

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
- Tests: PASS
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run --sequence.concurrent=false`
    (`14/14`)
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run --sequence.concurrent=false`
    (`13/13`)
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
  - `pnpm run lint`
- Manual checks: diff review confirmed the change only derives total positions
  from final aggregate counts and extends the overlap regression.
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
- Rollback note: revert this commit to restore prior session-summed aggregate
  total count.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate `positions.total` could remain session-summed after
  current open count was deduped to freshest truth.
- Gaps: overlap regression did not assert total/count consistency.
- Inconsistencies: `total` could exceed `openCount + closedCount`.
- Architecture constraints: dashboard read models must be internally
  consistent and reuse existing aggregate composition.

### 2. Select One Priority Task
- Selected task: align aggregate total positions with final aggregate counts.
- Priority rationale: small dashboard truth drift adjacent to the previous
  current-state fix.
- Why other candidates were deferred: deeper closed-history overlap semantics
  need a separate analysis slice.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, aggregate e2e test,
  planning/context docs.
- Logic: derive `totalPositions` after final open/closed counts are known.
- Edge cases: overlapping running sessions, empty sessions, row limits.

### 4. Execute Implementation
- Implementation notes: `totalPositions` is now calculated as
  `totalOpenPositions + totalClosedPositions` after those final aggregate
  counts are composed.

### 5. Verify and Test
- Validation performed: focused monitoring aggregate e2e, runtime-scope e2e,
  API typecheck, repository guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave total as session sum.
- Technical debt introduced: no
- Scalability assessment: no additional query or data structure.
- Refinements made: extended the existing overlapping-session regression
  instead of adding a separate fixture path.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, task board, project state, next-commits queue.
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

## Notes
Closed-count aggregation is intentionally not changed in this slice.

## Production-Grade Required Contract
- Goal: keep aggregate position totals internally consistent.
- Scope: API aggregate read model, e2e regression, planning/context docs.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: follows `DEFINITION_OF_DONE.md` through focused e2e,
  runtime-scope regression, typecheck, guardrails, lint, and self-review.
- Result Report: complete.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: PASS.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard bot operator.
- Existing workaround or pain: no dashboard clue explains contradictory totals.
- Smallest useful slice: derive aggregate total from final counts.
- Success metric or signal: overlap regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring dashboard.
- SLI: aggregate `positions.total` equals final open plus closed count.
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
- Residual risk: none identified for this read-only slice.

## Result Report
- Task summary: aggregate total positions now stays aligned with final open and
  closed counts.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `history/audits/runtime-audit-55-aggregate-total-position-overlap-task-2026-05-03.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused aggregate e2e (`14/14`), runtime-scope e2e (`13/13`),
  API typecheck, guardrails, lint.
- What is incomplete: nothing for this slice.
- Next steps: continue auditing deeper closed-history overlap semantics in a
  separate iteration.
- Decisions made: closed-count aggregation stays unchanged in this slice.
