# Task

## Header
- ID: RUNTIME-AUDIT-56
- Title: Prevent aggregate running trade total double counting
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-55
- Priority: P1
- Iteration: 74
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime monitoring aggregate deduplicates visible trade rows by ID, but
`trades.total` and fee summary still summed all session trade totals. When two
RUNNING sessions overlap, they can project the same current trades, causing the
dashboard to show one visible trade but doubled total and fees.

## Goal
Keep aggregate running trade totals and fees from double-counting overlapping
RUNNING session projections while preserving historical non-running session
sums.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Canonical planning/context docs for this iteration.

## Success Signal
- User or operator problem: dashboard can show one trade row but doubled trade
  total and fee summary during overlapping running sessions.
- Expected product or reliability outcome: running trade totals use the
  freshest running projection once.
- How success will be observed: two overlapping RUNNING sessions with one
  trade return `trades.total = 1` and `feesPaid = 0.75`.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified aggregate running trade total overlap fix.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Keep visible aggregate trade row dedupe unchanged.
2. Keep non-running session trade totals summed as historical windows.
3. When RUNNING sessions are present, include only the freshest running
   session trade total and fees in aggregate totals.
4. Add an overlapping RUNNING trade regression.

## Acceptance Criteria
- Overlapping RUNNING sessions do not double-count trade totals.
- Fee summary and `trades.feesPaid` remain aligned.
- Existing aggregate limit and runtime-scope regressions remain green.

## Definition of Done
- [x] Focused monitoring aggregate e2e passes.
- [x] Runtime-scope e2e passes.
- [x] API typecheck passes.
- [x] Repository guardrails and lint pass.
- [x] Diff review confirms scope is limited to running trade total composition.

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
- Manual checks: diff review confirmed the change only affects aggregate trade
  total row selection and the focused overlap regression.
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
- Rollback note: revert this commit to restore prior all-session running trade
  total summing.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate trade visible rows dedupe by ID, but total and fees summed
  overlapping RUNNING session projections.
- Gaps: no regression covered overlapping running sessions with one trade.
- Inconsistencies: one visible trade could report total two and doubled fees.
- Architecture constraints: keep read-model changes scoped and preserve
  historical non-running session sums.

### 2. Select One Priority Task
- Selected task: prevent running trade total double counting.
- Priority rationale: money-impacting dashboard summary drift adjacent to
  current-state overlap fixes.
- Why other candidates were deferred: deeper completed-session overlap
  semantics need separate analysis.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, aggregate e2e test,
  planning/context docs.
- Logic: select all non-running trade total rows plus the freshest running row.
- Edge cases: multiple running sessions, non-running history, fee alignment.

### 4. Execute Implementation
- Implementation notes: aggregate trade totals now sum all non-running session
  trade totals plus only the freshest running session trade total.

### 5. Verify and Test
- Validation performed: focused monitoring aggregate e2e, runtime-scope e2e,
  API typecheck, repository guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: use deduped visible trade item count for total.
- Technical debt introduced: no
- Scalability assessment: uses already-loaded session read models, no extra DB
  query.
- Refinements made: used a helper over already-loaded session rows instead of
  adding a new query path.

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
This slice intentionally does not change completed-session trade aggregation.

## Production-Grade Required Contract
- Goal: prevent aggregate running trade total and fee double counting.
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
- Existing workaround or pain: contradictory row count, total, and fee summary.
- Smallest useful slice: running trade total row selection.
- Success metric or signal: overlap regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring dashboard.
- SLI: aggregate running trade total equals one freshest running projection.
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
- Task summary: aggregate running trade totals and fees no longer double-count
  overlapping RUNNING session projections.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `history/audits/runtime-audit-56-aggregate-running-trade-overlap-task-2026-05-03.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused aggregate e2e (`15/15`), runtime-scope e2e (`13/13`),
  API typecheck, guardrails, lint.
- What is incomplete: completed-session overlap semantics remain a separate
  analysis topic.
- Next steps: continue auditing dashboard/runtime read-model drift.
- Decisions made: preserve non-running historical trade total sums; dedupe only
  overlapping RUNNING trade total projections.
