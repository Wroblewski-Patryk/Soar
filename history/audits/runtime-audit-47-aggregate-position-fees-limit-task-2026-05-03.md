# Task

## Header
- ID: RUNTIME-AUDIT-47
- Title: Preserve aggregate position fees under row limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-46
- Priority: P1
- Iteration: 65
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime session positions expose full scoped `summary.feesPaid`, but runtime
monitoring aggregate still composes `positions.summary.feesPaid` from limited
visible position rows.

## Goal
Keep monitoring aggregate `positions.summary.feesPaid` truthful when
`perSessionLimit` hides older scoped positions with direct trade fees.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Canonical docs/context.

## Success Signal
- User or operator problem: aggregate dashboard positions/wallet fee summary
  can look too low when visible position rows are limited.
- Expected product or reliability outcome: visible position rows remain
  limited, but aggregate positions fee summary composes the full session
  position summaries.
- How success will be observed: failing-then-passing aggregate e2e with
  `perSessionLimit=1` and two open position fees.
- Post-launch learning needed: no

## Deliverable For This Stage
Closed the aggregate positions fee limit drift and recorded validation
evidence.

## Constraints
- Reuse existing session positions summary contract.
- Do not change visible position row limits.
- Do not change trade header fee semantics.
- Do not introduce a new read model.

## Implementation Plan
1. Extend the existing aggregate open-position limit regression to assert
   aggregate positions fees.
2. Compose aggregate `positions.summary.feesPaid` from
   `response.summary.feesPaid`.
3. Run focused/full relevant tests and validation gates.
4. Sync canonical docs/context and commit.

## Acceptance Criteria
- `positions.openItems` remains limited by `perSessionLimit`.
- `positions.summary.feesPaid` includes hidden scoped position fees.
- Existing runtime scope and aggregate contracts remain green.

## Definition of Done
- [x] Regression test fails before implementation and passes after.
- [x] Runtime-scope and monitoring aggregate e2e suites pass sequentially.
- [x] API typecheck, guardrails, lint, and diff check pass.
- [x] Canonical docs/context are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was planned explicitly for this autonomous
  iteration.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Visibility-limit changes.
- Workarounds or fake data.
- Architecture changes without explicit approval.

## Validation Evidence
- Tests: PASS
- Manual checks: diff review and self-review complete
- Screenshots/logs: not applicable
- High-risk checks: existing position ownership scopes remain reused.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/01_overview-and-principles.md`,
  `docs/architecture/architecture-source-of-truth.md`
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
- Rollback note: revert this read-model commit if needed.
- Observability or alerting impact: dashboard fee accuracy only.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate positions fee summary uses limited visible rows.
- Gaps: session-level fee summary was fixed, but aggregate did not reuse it.
- Inconsistencies: aggregate uses session summaries for realized and
  unrealized PnL, but not positions fees.
- Architecture constraints: compose existing read-model outputs.

### 2. Select One Priority Task
- Selected task: preserve aggregate position fees under row limits.
- Priority rationale: direct dashboard accounting summary drift.
- Why other candidates were deferred: deeper symbol-stat/position parity needs
  a separate slice.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service and aggregate e2e test.
- Logic: sum `positionResponses[].summary.feesPaid`.
- Edge cases: hidden open positions, empty rows, null fees.

### 4. Execute Implementation
- Implementation notes: aggregate positions fee summary now composes
  `positionResponses[].summary.feesPaid` instead of visible aggregate rows.

### 5. Verify and Test
- Validation performed: focused red/green regression, sequential runtime-scope
  e2e, sequential monitoring aggregate e2e, API typecheck, guardrails, lint,
  and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: visible-row sum, rejected because it repeats the
  current aggregate drift.
- Technical debt introduced: no
- Scalability assessment: no extra DB query; reuses session summary output.
- Refinements made: kept this as a composition-only fix with no new DB query.

### 7. Update Documentation and Knowledge
- Docs updated: task, project state, task board, and MVP next commits queue.
- Context updated: yes
- Learning journal updated: not applicable

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

## Notes
This slice only affects aggregate positions summary fee composition.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator monitoring fee cost.
- Existing workaround or pain: aggregate positions fees can look too low.
- Smallest useful slice: aggregate positions summary fees only.
- Success metric or signal: focused e2e regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: dashboard smoke after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard runtime monitoring.
- SLI: aggregate position fee summary correctness.
- SLO: not formally tracked for this tiny read-model slice.
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: unchanged
- Smoke command or manual smoke: focused API e2e
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading telemetry.
- Trust boundaries: authenticated dashboard API, existing ownership scopes.
- Permission or ownership checks: unchanged.
- Abuse cases: aggregate uses already-scoped session position summaries.
- Secret handling: none
- Security tests or scans: existing ownership regressions remain in suites.
- Fail-closed behavior: unchanged
- Residual risk: low

## Result Report
- Task summary: Aggregate positions fee summaries now stay truthful when
  `perSessionLimit` hides older scoped position rows.
- Files changed:
  `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`,
  `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `docs/planning/mvp-next-commits.md`, and this task file.
- How tested: focused regression failed with old visible-row aggregate
  (`0.6` vs expected `1.1`) and passed after the fix; runtime-scope e2e
  `12/12`; monitoring aggregate e2e `11/11`; API typecheck; repository
  guardrails; lint; diff check.
- What is incomplete: production deploy/smoke is outside this local slice.
- Next steps: continue the next runtime dashboard read-model audit slice.
- Decisions made: compose aggregate position fees from existing session
  summaries instead of adding another aggregation path.
