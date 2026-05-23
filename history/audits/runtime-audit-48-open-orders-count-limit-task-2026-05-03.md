# Task

## Header
- ID: RUNTIME-AUDIT-48
- Title: Preserve runtime open-order counts under row limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-47
- Priority: P1
- Iteration: 66
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime positions already fetch a broad candidate set for open orders and
dedupe duplicate exchange/local order identities, but `openOrdersCount` is
currently the limited visible row length.

## Goal
Keep runtime positions `openOrdersCount` truthful when `limit` hides older
deduped open orders.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
- Canonical docs/context.

## Success Signal
- User or operator problem: dashboard can understate pending/open order count
  when visible open-order rows are limited.
- Expected product or reliability outcome: visible open-order rows remain
  limited, but `openOrdersCount` reflects all deduped scoped open orders.
- How success will be observed: failing-then-passing runtime-scope e2e with
  `limit=1` and two distinct deduped open orders.
- Post-launch learning needed: no

## Deliverable For This Stage
Closed the runtime open-order count limit drift and recorded validation
evidence.

## Constraints
- Reuse existing open-order dedupe preference.
- Do not change visible open-order row limits.
- Do not change ownership or symbol scopes.
- Do not introduce a new read model.

## Implementation Plan
1. Adjust the existing open-order dedupe regression to use `limit=1` and assert
   count truth.
2. Return deduped open-order count separately from visible items.
3. Run focused/full relevant tests and validation gates.
4. Sync canonical docs/context and commit.

## Acceptance Criteria
- `openOrders` remains limited by query limit.
- `openOrdersCount` reflects all deduped scoped open orders.
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
- High-risk checks: existing open-order ownership scopes remain reused.

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
- Observability or alerting impact: dashboard open-order count accuracy only.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `openOrdersCount` uses the visible limited row length.
- Gaps: existing dedupe regression did not assert count under a smaller limit.
- Inconsistencies: position counts are truthful under limits, but open-order
  count is not.
- Architecture constraints: reuse existing dedupe and scope.

### 2. Select One Priority Task
- Selected task: preserve runtime open-order counts under row limits.
- Priority rationale: direct dashboard management-state drift.
- Why other candidates were deferred: aggregate-specific open-order count can
  reuse this session contract and be audited separately if needed.

### 3. Plan Implementation
- Files or surfaces to modify: positions service and runtime-scope e2e test.
- Logic: compute deduped open-order rows once, return total deduped count plus
  limited visible items.
- Edge cases: duplicate exchange/local order identities, zero positions, no
  open orders.

### 4. Execute Implementation
- Implementation notes: open-order selection now returns a full deduped count
  plus limited visible items from the same deduped candidate list.

### 5. Verify and Test
- Validation performed: focused red/green regression, sequential runtime-scope
  e2e, sequential monitoring aggregate e2e, API typecheck, guardrails, lint,
  and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: visible-row count, rejected because it repeats the
  limit drift.
- Technical debt introduced: no
- Scalability assessment: no extra DB query; uses already fetched open-order
  candidate rows.
- Refinements made: kept the change in the existing dedupe helper without an
  extra DB query.

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
This slice keeps open-order item visibility unchanged.

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
- User or operator affected: dashboard operator monitoring open orders.
- Existing workaround or pain: dashboard open-order count can look too low.
- Smallest useful slice: session positions open-order count only.
- Success metric or signal: focused e2e regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: dashboard smoke after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard runtime monitoring.
- SLI: runtime open-order count correctness.
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
- Abuse cases: count uses already-scoped open-order candidates.
- Secret handling: none
- Security tests or scans: existing ownership regressions remain in suites.
- Fail-closed behavior: unchanged
- Residual risk: low

## Result Report
- Task summary: Runtime positions open-order counts now stay truthful when
  `limit` hides older deduped open-order rows.
- Files changed:
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`,
  `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `docs/planning/mvp-next-commits.md`, and this task file.
- How tested: focused regression failed with old visible-row count
  (`1` vs expected `2`) and passed after the fix; runtime-scope e2e `12/12`;
  monitoring aggregate e2e `11/11`; API typecheck; repository guardrails;
  lint; diff check.
- What is incomplete: production deploy/smoke is outside this local slice.
- Next steps: continue the next runtime dashboard read-model audit slice.
- Decisions made: return count and visible items from the existing deduped
  open-order list instead of adding another query.
