# Task

## Header
- ID: RUNTIME-AUDIT-42
- Title: Preserve aggregate open position quantity under row limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-41
- Priority: P1
- Iteration: 60
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Recent runtime audit slices separated visible row limits from true dashboard
counts and realized PnL. Aggregate header `openPositionQty` still uses visible
aggregate open rows.

## Goal
Keep aggregate runtime `sessionDetail.summary.openPositionQty` truthful when
`perSessionLimit` hides older open positions.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- Aggregate e2e regression and canonical docs/context.

## Success Signal
- User or operator problem: dashboard can show correct open position count but
  understate total open quantity when rows are hidden.
- Expected product or reliability outcome: visible open rows remain limited,
  but aggregate open quantity reflects all scoped open positions.
- How success will be observed: failing-then-passing aggregate e2e with
  `perSessionLimit=1` and two open positions.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement one open-quantity summary parity fix and verify it through focused
and relevant full tests.

## Constraints
- Reuse existing scoped position filters.
- Do not change visible row limits.
- Do not alter wallet/freeCash semantics in this slice.
- Do not introduce a new aggregation system.

## Implementation Plan
1. Add aggregate regression for hidden open position quantity.
2. Add scoped open-position quantity aggregate helper.
3. Expose session positions summary `openPositionQty`.
4. Compose aggregate header `openPositionQty` from session summaries.
5. Run focused/full relevant tests and validation gates.
6. Sync canonical docs/context and commit.

## Acceptance Criteria
- `openItems.length` can remain lower than `openCount`.
- `sessionDetail.summary.openPositionQty` includes hidden open rows.
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
- Wallet/freeCash changes in this open-quantity slice.
- Workarounds or fake data.
- Architecture changes without explicit approval.

## Validation Evidence
- Tests:
  - FAIL before fix:
    `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "keeps aggregate open position quantity" --sequence.concurrent=false`
  - PASS after fix:
    `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "keeps aggregate open position quantity" --sequence.concurrent=false`
  - PASS:
    `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --sequence.concurrent=false`
  - PASS:
    `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --sequence.concurrent=false`
  - PASS: `pnpm --filter api run typecheck`
  - PASS: `pnpm run quality:guardrails`
  - PASS: `pnpm run lint`
  - PASS: `git diff --check`
- Manual checks: code review of scoped quantity aggregate and aggregate header
  composition
- Screenshots/logs: not applicable
- High-risk checks: existing ownership scopes remain reused.

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
- Observability or alerting impact: dashboard quantity accuracy only.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate header open quantity uses limited visible open rows.
- Gaps: previous count tests did not assert quantity summary truth.
- Inconsistencies: open count can be true while open quantity remains partial.
- Architecture constraints: reuse scoped runtime position filters.

### 2. Select One Priority Task
- Selected task: preserve aggregate open quantity under row limits.
- Priority rationale: direct dashboard position-management truth issue.
- Why other candidates were deferred: wallet/freeCash requires a separate
  money-impacting capital semantics slice.

### 3. Plan Implementation
- Files or surfaces to modify: repository aggregate helper, session positions
  read service, aggregate read service, aggregate e2e test.
- Logic: sum open-position `quantity` with the same scoped open-position
  filter used for visible open rows.
- Edge cases: null/empty positions, multi-session aggregate composition.

### 4. Execute Implementation
- Implementation notes: added `sumRuntimeManagedPositionQuantity`, exposed
  session positions `summary.openPositionQty`, and used that session summary
  in aggregate header `openPositionQty`.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full
  runtime-scope e2e, full monitoring aggregate e2e, typecheck, guardrails,
  lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: using symbol stats, rejected because imported
  positions can exist without fresh symbol stats.
- Technical debt introduced: no
- Scalability assessment: one aggregate query per session positions read.
- Refinements made: kept wallet/freeCash unchanged as a separate
  money-impacting audit candidate.

### 7. Update Documentation and Knowledge
- Docs updated: task doc, project state, task board, MVP next commits.
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
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Wallet/freeCash under hidden open rows remains a separate audit candidate.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused aggregate open-position quantity e2e

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator monitoring LIVE/PAPER open
  positions.
- Existing workaround or pain: dashboard quantity can look lower than actual
  scoped open exposure.
- Smallest useful slice: aggregate header open quantity only.
- Success metric or signal: focused e2e regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: dashboard smoke after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard runtime monitoring.
- SLI: runtime open quantity summary correctness.
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
- Abuse cases: aggregate uses the same scoped `where` clauses as visible rows.
- Secret handling: none
- Security tests or scans: existing ownership regressions remain in suites.
- Fail-closed behavior: unchanged
- Residual risk: low

## Result Report
- Task summary: fixed aggregate runtime open-position quantity so hidden open
  rows under `perSessionLimit` remain included in dashboard header summary.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - canonical planning/context docs
- How tested: focused failing-then-passing e2e, full runtime-scope e2e, full
  monitoring aggregate e2e, API typecheck, guardrails, lint, and diff check.
- What is incomplete: wallet/freeCash under hidden open rows remains a
  separate audit candidate.
- Next steps: continue auditing capital/freeCash and fee summaries under row
  limits.
- Decisions made: open quantity summary must use scoped open-position truth,
  while visible open rows remain limited.
