# Task

## Header
- ID: RUNTIME-AUDIT-41
- Title: Preserve runtime position realized PnL under row limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-40
- Priority: P1
- Iteration: 59
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-40` made runtime position counts independent from visible row
limits. The same dashboard read-model still derives realized PnL summary from
visible mapped rows.

## Goal
Keep runtime position `summary.realizedPnl` truthful when closed position rows
exceed the visible limit.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- Focused API e2e regression and canonical docs/context.

## Success Signal
- User or operator problem: dashboard can show correct closed-position counts
  but understate realized PnL when history rows are hidden by limits.
- Expected product or reliability outcome: visible rows remain limited, but
  realized PnL summary uses the true scoped closed-position aggregate.
- How success will be observed: failing-then-passing API e2e with `limit=1`
  and multiple closed positions.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement one realized-PnL summary parity fix and verify it through focused and
relevant full tests.

## Constraints
- Reuse existing scoped position `where` clauses.
- Do not alter visible row limits.
- Do not redefine fee or unrealized PnL semantics in this slice.
- Do not introduce a new summary subsystem.

## Implementation Plan
1. Extend the existing limit regression to assert total realized PnL across
   hidden closed positions.
2. Add a repository aggregate helper for scoped position `realizedPnl`.
3. Use that aggregate in session positions summary.
4. Make aggregate monitoring compose session position summaries for realized
   PnL instead of limited history rows.
5. Run focused/full relevant tests and validation gates.
6. Sync canonical docs/context and commit.

## Acceptance Criteria
- `historyItems.length` can remain lower than `closedCount`.
- `positions.summary.realizedPnl` includes hidden closed positions.
- Aggregate monitoring `positions.summary.realizedPnl` and
  `sessionDetail.summary.realizedPnl` preserve session summary truth.
- Existing aggregate and runtime-scope contracts remain green.

## Definition of Done
- [x] Regression test fails before implementation and passes after.
- [x] Runtime-scope and aggregate e2e suites pass sequentially.
- [x] API typecheck, guardrails, lint, and diff check pass.
- [x] Canonical docs/context are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was planned explicitly for this autonomous
  iteration.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Fee/unrealized PnL changes in this realized-PnL slice.
- Workarounds or fake data.
- Architecture changes without explicit approval.

## Validation Evidence
- Tests:
  - FAIL before fix:
    `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts -t "keeps open runtime positions visible" --sequence.concurrent=false`
  - PASS after fix:
    `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts -t "keeps open runtime positions visible" --sequence.concurrent=false`
  - PASS:
    `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --sequence.concurrent=false`
  - PASS:
    `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --sequence.concurrent=false`
  - PASS: `pnpm --filter api run typecheck`
  - PASS: `pnpm run quality:guardrails`
  - PASS: `pnpm run lint`
  - PASS: `git diff --check`
- Manual checks: code review of scoped realized-PnL aggregate and aggregate
  monitoring composition
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
- Observability or alerting impact: dashboard PnL accuracy only.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: realized PnL summary is derived from limited visible mapped rows.
- Gaps: count regression did not assert PnL summary truth.
- Inconsistencies: counts can now be true while realized PnL remains partial.
- Architecture constraints: summary must use existing scoped runtime position
  ownership filters.

### 2. Select One Priority Task
- Selected task: preserve runtime position realized PnL under row limits.
- Priority rationale: direct dashboard truthfulness issue with small blast
  radius after count parity.
- Why other candidates were deferred: fee and unrealized PnL require separate
  source-of-truth decisions.

### 3. Plan Implementation
- Files or surfaces to modify: repository aggregate helper, session positions
  read service, aggregate read service, e2e test.
- Logic: aggregate closed-position `realizedPnl` from DB with the same scoped
  closed-position filter.
- Edge cases: null realized PnL, no positions, aggregate multi-session
  composition.

### 4. Execute Implementation
- Implementation notes: added `sumRuntimeManagedPositionRealizedPnl` and
  reused the same scoped closed-position filter as visible history rows.
  Aggregate monitoring now composes realized PnL from session position
  summaries instead of limited aggregate history rows.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full
  runtime-scope e2e, full monitoring aggregate e2e, typecheck, guardrails,
  lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: increasing row limit, rejected because it would
  hide the summary/visibility contract.
- Technical debt introduced: no
- Scalability assessment: one aggregate query per session positions read.
- Refinements made: kept fee and unrealized PnL unchanged as explicitly
  deferred follow-up candidates.

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
Fee and unrealized PnL under limits remain separate audit candidates.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused runtime-scope realized-PnL limit e2e

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator monitoring LIVE/PAPER realized
  PnL.
- Existing workaround or pain: dashboard PnL can look lower than actual closed
  position PnL.
- Smallest useful slice: realized PnL summary only.
- Success metric or signal: focused e2e regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: dashboard smoke after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard runtime monitoring.
- SLI: runtime realized PnL summary correctness.
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
- Task summary: fixed runtime position realized PnL summary so hidden closed
  positions under row limits remain included in session and aggregate
  dashboard summaries.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - canonical planning/context docs
- How tested: focused failing-then-passing e2e, full runtime-scope e2e, full
  monitoring aggregate e2e, API typecheck, guardrails, lint, and diff check.
- What is incomplete: fees and unrealized PnL under limits remain separate
  audit candidates.
- Next steps: continue auditing fee and open-position quantity/used-margin
  summaries under row limits.
- Decisions made: realized PnL summary must use scoped closed-position truth,
  while visible history rows remain limited.
