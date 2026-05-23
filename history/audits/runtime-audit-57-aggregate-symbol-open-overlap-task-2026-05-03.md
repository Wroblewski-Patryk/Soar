# Task

## Header
- ID: RUNTIME-AUDIT-57
- Title: Prevent aggregate symbol open-state double counting across running sessions
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-56
- Priority: P1
- Iteration: 75
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Aggregate positions now treat current open-position state as a freshest session
projection, but aggregate symbol stats still summed per-symbol current open
fields across sessions. Overlapping RUNNING sessions could therefore make
`symbolStats.items` and `symbolStats.summary` report two open positions while
the positions table correctly reported one.

## Goal
Keep aggregate symbol current open-position count, quantity, and unrealized PnL
aligned with current-state truth instead of summing overlapping session
symbol-stat projections.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Canonical planning/context docs for this iteration.

## Success Signal
- User or operator problem: market/signal summary can disagree with positions
  summary for open position state.
- Expected product or reliability outcome: symbol stat current-state fields
  match the latest per-symbol snapshot once.
- How success will be observed: overlapping RUNNING sessions with one BTC open
  position return symbol item and summary open count one, quantity `0.01`, and
  unrealized PnL `-7`.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified aggregate symbol open-state overlap fix.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Keep historical symbol counters such as signals, entries, closes, and
   realized PnL summed.
2. For duplicate aggregate symbol rows, take current open-position fields from
   the newest `snapshotAt`.
3. Compose symbol summary current open fields from the final merged symbol
   items.
4. Extend the overlapping RUNNING session regression to cover symbol stat item
   and summary state.

## Acceptance Criteria
- `symbolStats.items[*].openPositionCount` does not double-count overlapping
  RUNNING projections.
- `symbolStats.summary.openPositionCount`, quantity, and unrealized PnL match
  final merged symbol items.
- Existing aggregate and runtime-scope tests remain green.

## Definition of Done
- [x] Focused monitoring aggregate e2e passes.
- [x] Runtime-scope e2e passes.
- [x] API typecheck passes.
- [x] Repository guardrails and lint pass.
- [x] Diff review confirms scope is limited to symbol current-state fields.

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
    (`15/15`)
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --run --sequence.concurrent=false`
    (`13/13`)
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
  - `pnpm run lint`
- Manual checks: diff review confirmed only aggregate symbol current-state merge
  semantics and the focused overlap regression changed.
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
- Rollback note: revert this commit to restore prior symbol current-state
  summing.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: symbol current-state open fields were still summed across overlapping
  sessions.
- Gaps: overlap regression covered positions summary but not symbol stats.
- Inconsistencies: symbol summary could disagree with positions summary.
- Architecture constraints: preserve historical symbol sums and existing
  aggregate read-model contracts.

### 2. Select One Priority Task
- Selected task: prevent symbol open-state double counting across running
  sessions.
- Priority rationale: dashboard market/signal current-state drift.
- Why other candidates were deferred: completed-session history overlap needs a
  separate analysis slice.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, aggregate e2e test,
  planning/context docs.
- Logic: use newest symbol `snapshotAt` for current open fields and derive
  current summary from merged symbol items.
- Edge cases: negative unrealized PnL, overlapping running sessions,
  historical signal sums.

### 4. Execute Implementation
- Implementation notes: duplicate aggregate symbol rows now keep historical
  counters summed while current open-position fields come from the newest
  `snapshotAt`; symbol summary current fields derive from merged symbol items.

### 5. Verify and Test
- Validation performed: focused monitoring aggregate e2e, runtime-scope e2e,
  API typecheck, repository guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leaving symbol stats as historical sums.
- Technical debt introduced: no
- Scalability assessment: no additional query; uses already-loaded symbol stat
  rows.
- Refinements made: corrected the regression fixture to use persisted position
  `unrealizedPnl`, matching the real symbol stats read-model pipeline.

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
This slice intentionally keeps historical symbol counters summed.

## Production-Grade Required Contract
- Goal: prevent symbol current open-state double counting.
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
- Existing workaround or pain: contradictory symbol and position summaries.
- Smallest useful slice: symbol current-state field merge.
- Success metric or signal: overlap regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring dashboard.
- SLI: aggregate symbol open-state metrics equal latest current-state
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
- Residual risk: none identified for this read-only slice.

## Result Report
- Task summary: aggregate symbol current open-position fields no longer
  double-count overlapping running session projections.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `history/audits/runtime-audit-57-aggregate-symbol-open-overlap-task-2026-05-03.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused aggregate e2e (`15/15`), runtime-scope e2e (`13/13`),
  API typecheck, guardrails, lint.
- What is incomplete: completed-session history overlap remains a separate
  analysis topic.
- Next steps: continue auditing dashboard/runtime read-model drift.
- Decisions made: historical symbol counters remain summed; current open state
  uses latest snapshot truth.
