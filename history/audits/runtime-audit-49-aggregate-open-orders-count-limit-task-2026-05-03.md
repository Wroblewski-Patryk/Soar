# Task

## Header
- ID: RUNTIME-AUDIT-49
- Title: Preserve aggregate open-order counts under row limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-48
- Priority: P1
- Iteration: 67
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime session positions now expose a full deduped `openOrdersCount`
separately from limited visible `openOrders`. The aggregate monitoring read
model still derived its aggregate `positions.openOrdersCount` from visible
aggregate rows.

## Goal
Keep aggregate dashboard open-order counts truthful when `perSessionLimit`
hides older open-order rows.

## Success Signal
- User or operator problem: dashboard management-state counters must reflect
  runtime truth, not visible row limits.
- Expected product or reliability outcome: aggregate monitoring count remains
  equal to full per-session open-order counts while visible rows remain
  limited.
- How success will be observed: a regression with `perSessionLimit=1` and two
  open orders returns `positions.openOrdersCount = 2` and one visible row.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement one backend read-model fix with focused aggregate regression coverage.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Aggregate `positions.openOrdersCount` composes current-state session count truth.
- [x] Visible `positions.openOrders` rows remain limited and deterministic.
- [x] Relevant runtime aggregate tests, typecheck, guardrails, lint, and diff
  checks pass.

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
- Tests: failing-then-passing focused aggregate regression; full monitoring
  aggregate e2e (`12/12`); runtime-scope e2e (`12/12`); API typecheck; lint;
  repository guardrails
- Manual checks: `git diff --check`
- Screenshots/logs: not applicable
- High-risk checks: fail-closed read-only dashboard aggregation path, no trading
  side effects

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: runtime read models remain backend-composed
  dashboard truth.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this single read-model commit if aggregate counts
  regress.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `runtimeMonitoringAggregateRead.service.ts` used visible
  `openOrders.length` for aggregate `positions.openOrdersCount`.
- Gaps: aggregate coverage did not assert count truth when `perSessionLimit`
  hides visible open-order rows.
- Inconsistencies: session positions had full `openOrdersCount`; aggregate
  positions still had visible-row count semantics.
- Architecture constraints: dashboard aggregate must compose existing
  per-session truth instead of introducing a second counting path.

### 2. Select One Priority Task
- Selected task: preserve aggregate open-order counts under row limits.
- Priority rationale: directly affects dashboard management-state truth for LIVE
  and PAPER runtime monitoring.
- Why other candidates were deferred: empty payload shape parity and symbol
  stats limit checks remain separate smaller slices.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - canonical context and planning docs
- Logic: use the maximum `response.openOrdersCount` from complete position
  responses while keeping `openOrders` as deduped limited visible rows.
- Edge cases: duplicate visible orders remain deduped; multiple sessions do not
  double-count the same current open orders; zero sessions remain zero.

### 4. Execute Implementation
- Implementation notes: added aggregate regression coverage for two current
  open orders with `perSessionLimit=1`; changed aggregate count composition to
  use full session open-order count truth while preserving limited visible
  rows.

### 5. Verify and Test
- Validation performed: focused regression before and after the fix, full
  aggregate e2e, runtime-scope e2e, API typecheck, guardrails, lint, and diff
  check.
- Result: PASS. The pre-fix focused regression failed with count `1` instead
  of `2`; after the fix it passed and full aggregate coverage confirmed
  multi-session current-state orders are not double-counted.

### 6. Self-Review
- Simpler option considered: keep visible `openOrders.length`; rejected because
  it repeats the already confirmed row-limit drift.
- Technical debt introduced: no
- Scalability assessment: composes existing session-level truth and avoids
  extra database queries.
- Refinements made: changed the first sum-based implementation to maximum
  session count after full aggregate coverage showed current open orders are
  not session-scoped.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, planning queue
- Context updated: project state and task board
- Learning journal updated: not applicable

## Review Checklist (mandatory)
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
- [x] Learning journal was updated if a recurring pitfall is confirmed.

## Notes
This is a read-model-only dashboard truth fix. It must not change order
lifecycle, exchange synchronization, or trading behavior.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to
`READY` or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime
  surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB
-> validation -> error handling -> test. Partial implementations, mock-only
paths, placeholders, fake data, and temporary fixes are forbidden.

## Scope
- Aggregate runtime monitoring positions read model.
- Aggregate monitoring E2E regression coverage.
- Canonical planning and context documentation.

## Implementation Plan
1. Add failing aggregate regression for two scoped open orders with
   `perSessionLimit=1`.
2. Change aggregate `openOrdersCount` to compose full current-state session
   `openOrdersCount` without double-counting across sessions.
3. Run focused and relevant aggregate/runtime validations.
4. Update task, project state, task board, and planning queue.

## Acceptance Criteria
- Aggregate response returns full open-order count under limited visible rows.
- Aggregate visible order list remains limited.
- Existing deterministic aggregate ordering remains unchanged.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: bot operator monitoring LIVE/PAPER dashboard
- Existing workaround or pain: operator must inspect exchange or session detail
  manually when aggregate counters are low.
- Smallest useful slice: count-only aggregate read-model correction.
- Success metric or signal: regression test remains green.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: monitor operator dashboard parity.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable
- Critical user journey: runtime monitoring dashboard
- SLI: aggregate count correctness
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused E2E
- Rollback or disable path: revert single commit

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: no schema change
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: deterministic repeat aggregate covered by
  existing suite
- Regression check performed: yes

## AI Testing Evidence (required for AI features)

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: user-owned bot runtime data
- Trust boundaries: existing owner-authenticated dashboard endpoint
- Permission or ownership checks: unchanged
- Abuse cases: no new inputs or access path
- Secret handling: none
- Security tests or scans: ownership-isolated aggregate suite remains in scope
- Fail-closed behavior: missing owned bot still returns null via existing
  guard
- Residual risk: low read-model risk

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: aggregate `positions.openOrdersCount` now reports full
  current open-order count under limited visible rows and avoids multi-session
  double-counting.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-49-aggregate-open-orders-count-limit-task-2026-05-03.md`
- How tested: focused failing-then-passing aggregate regression; monitoring
  aggregate e2e (`12/12`); runtime-scope e2e (`12/12`); API typecheck;
  repository guardrails; lint; `git diff --check`.
- What is incomplete: nothing for this slice.
- Next steps: continue auditing dashboard read-model parity for remaining
  wallet, markets, strategies, and runtime lifecycle surfaces.
- Decisions made: current open orders are bot current-state data, so aggregate
  count uses maximum session count rather than summing per-session counts.
