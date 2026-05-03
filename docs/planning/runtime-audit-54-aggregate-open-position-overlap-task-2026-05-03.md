# Task

## Header
- ID: RUNTIME-AUDIT-54
- Title: Prevent aggregate current open-position double counting across overlapping sessions
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-53
- Priority: P1
- Iteration: 72
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime monitoring aggregate deduplicates visible open-position rows by
position ID, but the aggregate counters and open-position summaries still
summed every session response. Open positions are current state, so overlapping
running sessions for one bot can expose the same open position more than once.

## Goal
Keep aggregate current open-position counts, quantity, and unrealized PnL as a
single current-state truth instead of summing duplicate session projections.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Canonical planning/context docs for this iteration.

## Success Signal
- User or operator problem: dashboard can overstate open positions and
  unrealized PnL when multiple running sessions overlap.
- Expected product or reliability outcome: aggregate current open-position
  state reflects the freshest session read model once.
- How success will be observed: two overlapping running sessions with one open
  position report `openCount = 1`, `openPositionQty = 0.01`, and
  `unrealizedPnl = -7`.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified aggregate read-model fix and regression coverage.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Preserve historical sums for realized PnL, fees, closed positions, and
   trades.
2. Use the freshest complete session row for current open-position count,
   quantity, and unrealized PnL.
3. Keep visible open rows deduped and limited as before.
4. Add an overlapping running-session regression with a negative unrealized PnL
   to prove the value is not doubled or maxed incorrectly.

## Acceptance Criteria
- Aggregate `positions.openCount` uses current-state truth once.
- Aggregate `sessionDetail.summary.openPositionCount` matches `positions.openCount`.
- Aggregate open quantity and unrealized PnL are not doubled across sessions.
- Existing limit-preservation regression remains green.

## Definition of Done
- [x] Focused monitoring aggregate e2e passes.
- [x] Runtime-scope e2e passes.
- [x] API typecheck passes.
- [x] Repository guardrails and lint pass.
- [x] Diff review confirms only current open-position aggregate semantics changed.

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
- Manual checks: diff review confirmed the change is limited to aggregate
  current open-position metrics and the focused regression.
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
- Rollback note: revert this commit to restore prior aggregate current-state
  summing.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate visible rows dedupe open positions, but open counts and
  current-state summaries summed session read models.
- Gaps: no regression covered overlapping running sessions with one shared open
  position.
- Inconsistencies: dashboard row count could show one row while summary showed
  two open positions and doubled unrealized PnL.
- Architecture constraints: aggregate read models should preserve dashboard
  runtime truth without creating new systems.

### 2. Select One Priority Task
- Selected task: prevent current open-position double counting across
  overlapping sessions.
- Priority rationale: money-impacting dashboard summary drift.
- Why other candidates were deferred: live missing-entry import is a
  documented fail-closed rule requiring product decision before behavior change.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, aggregate e2e test,
  planning/context docs.
- Logic: use freshest complete session positions response for current-state
  open metrics; keep historical aggregates summed.
- Edge cases: negative unrealized PnL, row limits, overlapping running sessions.

### 4. Execute Implementation
- Implementation notes: aggregate current open-position count, open quantity,
  and unrealized PnL now come from the freshest complete session positions
  response while visible rows remain deduped and historical sums remain
  unchanged.

### 5. Verify and Test
- Validation performed: focused monitoring aggregate e2e, runtime-scope e2e,
  API typecheck, repository guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: dedupe only visible rows and leave summaries
  summed.
- Technical debt introduced: no
- Scalability assessment: uses already-loaded session read models, no extra DB
  query.
- Refinements made: used a negative unrealized PnL regression to prove the
  aggregate does not use `Math.max` or accidental summing.

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
This task intentionally changes only current open-position aggregate metrics.
Historical closed/trade metrics remain session-window aggregates.

## Production-Grade Required Contract
- Goal: prevent current open-position double counting across overlapping
  sessions.
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
- Existing workaround or pain: no clear UI indication that current open state
  was double-counted across sessions.
- Smallest useful slice: current open-position aggregate metrics.
- Success metric or signal: overlapping-session regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring dashboard.
- SLI: aggregate current open-position metrics equal one current-state
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
- Security tests or scans: ownership isolation remains covered by existing
  aggregate tests.
- Fail-closed behavior: unchanged.
- Residual risk: none identified for this read-only slice.

## Result Report
- Task summary: aggregate current open-position metrics no longer double-count
  the same open position across overlapping running sessions.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `docs/planning/runtime-audit-54-aggregate-open-position-overlap-task-2026-05-03.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused aggregate e2e (`14/14`), runtime-scope e2e (`13/13`),
  API typecheck, guardrails, lint.
- What is incomplete: nothing for this slice.
- Next steps: continue auditing dashboard/runtime read-model drift.
- Decisions made: historical closed/trade metrics remain session-window sums;
  only current open-position state uses freshest session truth.
