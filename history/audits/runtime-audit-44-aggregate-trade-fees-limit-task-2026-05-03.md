# Task

## Header
- ID: RUNTIME-AUDIT-44
- Title: Preserve aggregate trade fees under row limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-43
- Priority: P1
- Iteration: 62
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Aggregate trade counts were made truthful under `perSessionLimit`, but
aggregate header fees still use the limited visible trade rows.

## Goal
Keep runtime monitoring aggregate `sessionDetail.summary.feesPaid` truthful
when `perSessionLimit` hides older trades.

## Scope
- `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Canonical docs/context.

## Success Signal
- User or operator problem: dashboard can understate paid fees when trade rows
  are hidden by limits.
- Expected product or reliability outcome: visible trade rows remain limited,
  but header fee summary reflects all scoped trade rows in the session window.
- How success will be observed: failing-then-passing aggregate e2e with
  `perSessionLimit=1` and two trade fees.
- Post-launch learning needed: no

## Deliverable For This Stage
Closed the aggregate trade-fee limit drift and recorded validation evidence.

## Constraints
- Reuse existing session trade read-model scoping.
- Do not change visible trade row limits.
- Do not alter symbol-stat fee semantics in this slice.
- Do not introduce a new trade aggregation system.

## Implementation Plan
1. Extend the existing trade-total limit regression to assert aggregate fees.
2. Add `feesPaid` to session trades read response, computed before pagination.
3. Compose aggregate header `feesPaid` from per-session trade `feesPaid`.
4. Run focused/full relevant tests and validation gates.
5. Sync canonical docs/context and commit.

## Acceptance Criteria
- `trades.items.length` can remain lower than `trades.total`.
- `sessionDetail.summary.feesPaid` includes hidden scoped trade fees.
- Existing runtime/aggregate contracts remain green.

## Definition of Done
- [x] Regression test fails before implementation and passes after.
- [x] Aggregate and runtime-scope e2e suites pass sequentially.
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
- High-risk checks: existing trade ownership scopes remain reused.

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
- Issues: aggregate header fees use limited visible trade rows.
- Gaps: trade-total regression did not assert fee summary truth.
- Inconsistencies: `trades.total` can be true while `feesPaid` remains partial.
- Architecture constraints: reuse existing session trade read-model scope.

### 2. Select One Priority Task
- Selected task: preserve aggregate trade fees under row limits.
- Priority rationale: direct dashboard accounting summary drift.
- Why other candidates were deferred: position fee attribution across hidden
  positions needs a separate position-accounting slice.

### 3. Plan Implementation
- Files or surfaces to modify: session trades read service, aggregate read
  service, aggregate e2e test.
- Logic: compute fee sum before pagination and aggregate it across sessions.
- Edge cases: empty trade rows, anchor trades with zero fees, hidden rows.

### 4. Execute Implementation
- Implementation notes: session trades now expose unpaginated scoped
  `feesPaid`; aggregate monitoring composes those per-session fee totals in
  `sessionDetail.summary.feesPaid` and `trades.feesPaid` while preserving
  visible row limits.

### 5. Verify and Test
- Validation performed: focused red/green regression, sequential runtime-scope
  e2e, sequential monitoring aggregate e2e, API typecheck, guardrails, lint,
  and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: using visible rows only, rejected because it
  repeats the limit drift.
- Technical debt introduced: no
- Scalability assessment: no extra DB query; fee sum uses rows already read by
  the session trade read model.
- Refinements made: kept the fee sum in the existing session trade read model
  to avoid a duplicate aggregation path.

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
This slice covers aggregate trade fees. Position `summary.feesPaid` remains a
separate audit candidate.

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
- Existing workaround or pain: dashboard fees can look too low.
- Smallest useful slice: aggregate header fees only.
- Success metric or signal: focused e2e regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: dashboard smoke after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard runtime monitoring.
- SLI: runtime fee summary correctness.
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
- Abuse cases: fee summary uses the same scoped trade rows as visible rows.
- Secret handling: none
- Security tests or scans: existing ownership regressions remain in suites.
- Fail-closed behavior: unchanged
- Residual risk: low

## Result Report
- Task summary: Runtime monitoring aggregate fee summaries now stay truthful
  when `perSessionLimit` hides older trade rows.
- Files changed:
  `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`,
  `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`,
  `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `docs/planning/mvp-next-commits.md`, and this task file.
- How tested: focused regression failed with old visible-row fee sum
  (`0.6` vs expected `1.1`) and passed after the fix; runtime-scope e2e
  `12/12`; monitoring aggregate e2e `11/11`; API typecheck; repository
  guardrails; lint; diff check.
- What is incomplete: production deploy/smoke is outside this local slice.
- Next steps: continue the next runtime dashboard read-model audit slice.
- Decisions made: expose `feesPaid` from the existing session trade read model
  instead of adding a separate aggregate trade query.
