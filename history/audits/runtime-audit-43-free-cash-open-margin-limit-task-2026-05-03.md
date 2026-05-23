# Task

## Header
- ID: RUNTIME-AUDIT-43
- Title: Preserve runtime free cash under hidden open-position margin
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-42
- Priority: P1
- Iteration: 61
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime position rows can be limited for dashboard payload size. Capital
summary `freeCash` is money-impacting and must account for all scoped open
position margin, not only visible open rows.

## Goal
Keep runtime position `summary.freeCash` truthful when `limit` /
`perSessionLimit` hides older open positions.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Canonical docs/context.

## Success Signal
- User or operator problem: dashboard can overstate available paper/live cash
  when open positions are hidden by row limits.
- Expected product or reliability outcome: visible rows remain limited, but
  free cash subtracts margin for all scoped open positions.
- How success will be observed: failing-then-passing aggregate e2e with
  `perSessionLimit=1` and two open positions with explicit margin.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement one capital-summary margin parity fix and verify it through focused
and relevant full tests.

## Constraints
- Reuse existing scoped open-position filters.
- Do not change visible row limits.
- Do not change exchange/wallet snapshot ownership semantics.
- Do not introduce a new capital subsystem.

## Implementation Plan
1. Extend aggregate open-position limit regression to assert free cash.
2. Add scoped open-position margin aggregate helper.
3. Use true scoped open margin in session positions capital summary.
4. Run focused/full relevant tests and validation gates.
5. Sync canonical docs/context and commit.

## Acceptance Criteria
- `openItems.length` can remain lower than `openCount`.
- `summary.freeCash` subtracts all scoped open margin.
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
- Manual checks: code review of scoped margin aggregate and capital summary
  inputs
- Screenshots/logs: not applicable
- High-risk checks: money-impacting free-cash calculation uses existing scoped
  ownership filters.

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
- Observability or alerting impact: dashboard free-cash accuracy only.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `usedMargin` is derived from limited visible open rows.
- Gaps: prior open-quantity fix did not cover free-cash margin semantics.
- Inconsistencies: open count/quantity can be true while free cash remains
  overstated.
- Architecture constraints: reuse scoped runtime position ownership filters.

### 2. Select One Priority Task
- Selected task: preserve free cash under hidden open-position margin.
- Priority rationale: money-impacting dashboard field with direct operator
  risk.
- Why other candidates were deferred: fee summaries remain a separate
  accounting slice.

### 3. Plan Implementation
- Files or surfaces to modify: repository aggregate helper, session positions
  read service, aggregate e2e test.
- Logic: sum explicit `marginUsed` for scoped open positions, falling back to
  modeled margin in a later slice if needed.
- Edge cases: no margin values, no positions, hidden rows.

### 4. Execute Implementation
- Implementation notes: added `sumRuntimeManagedPositionMarginUsed` and used
  scoped open-position margin as the primary `usedMargin` input for runtime
  capital summary, with visible-row margin retained as a fallback when no
  persisted margin exists.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full
  runtime-scope e2e, full monitoring aggregate e2e, typecheck, guardrails,
  lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: use visible rows only, rejected because it
  overstates free cash under limits.
- Technical debt introduced: no
- Scalability assessment: one aggregate query per session positions read.
- Refinements made: explicit persisted-margin scope only; modeled margin for
  null-margin hidden rows remains a separate candidate.

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
This first money-impacting slice covers persisted `marginUsed`; modeled margin
for null `marginUsed` remains a separate candidate because it requires row
projection or DB expression choices.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused aggregate free-cash under hidden margin
  e2e

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator monitoring free capital.
- Existing workaround or pain: dashboard free cash can look too high.
- Smallest useful slice: explicit-margin free-cash summary.
- Success metric or signal: focused e2e regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: dashboard smoke after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard runtime monitoring.
- SLI: runtime free-cash summary correctness.
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
- Task summary: fixed runtime free-cash summary so hidden open rows with
  persisted margin are included in used-margin subtraction.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - canonical planning/context docs
- How tested: focused failing-then-passing e2e, full runtime-scope e2e, full
  monitoring aggregate e2e, API typecheck, guardrails, lint, and diff check.
- What is incomplete: hidden open rows with `marginUsed=null` still rely on
  visible-row modeled fallback and remain a separate audit candidate.
- Next steps: audit fees and null-margin modeled used-margin behavior under
  row limits.
- Decisions made: free cash must subtract scoped persisted open margin, while
  visible open rows remain limited.
