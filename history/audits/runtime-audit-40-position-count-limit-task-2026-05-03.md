# Task

## Header
- ID: RUNTIME-AUDIT-40
- Title: Preserve runtime position counts under row limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-39
- Priority: P1
- Iteration: 58
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime session and aggregate position read models show limited row lists for
dashboard ergonomics, but their count fields should represent the true scoped
position counts.

## Goal
Keep runtime position `total`, `openCount`, and `closedCount` truthful when
`limit` / `perSessionLimit` hides older rows.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- Focused API e2e regression coverage and canonical docs/context.

## Success Signal
- User or operator problem: dashboard can show fewer positions than the bot
  actually owns when row limits are active.
- Expected product or reliability outcome: visible rows remain limited, but
  count fields reflect true scoped position counts.
- How success will be observed: failing-then-passing API e2e regression with
  `limit=1` and multiple closed positions.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement one count-parity fix across session and aggregate runtime position
read models, then verify and sync docs.

## Constraints
- Reuse existing Prisma read-model repository ownership.
- Do not change visible row limits.
- Do not redefine PnL/fee summary semantics in this slice.
- Do not introduce a parallel positions aggregation system.

## Implementation Plan
1. Add a regression proving position counts stay true when history rows exceed
   the visible limit.
2. Add repository count helpers for scoped runtime positions.
3. Return true `total`, `openCount`, and `closedCount` from session positions.
4. Sum session counts in aggregate positions metadata.
5. Run focused/full relevant tests and validation gates.
6. Sync canonical docs/context and commit.

## Acceptance Criteria
- `historyItems.length` can remain limited to `1`.
- `closedCount` reports all scoped closed positions.
- `total` reports all scoped open plus closed positions.
- Aggregate position counts sum session truth rather than visible rows.

## Definition of Done
- [x] Regression test fails before implementation and passes after.
- [x] Relevant runtime-scope and aggregate e2e suites pass sequentially.
- [x] API typecheck, guardrails, lint, and diff check pass.
- [x] Canonical docs/context are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was planned explicitly for this autonomous
  iteration.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Summary/PnL semantics changes in this count-only slice.
- Workarounds or fake counts.
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
- Manual checks: code review of count queries and aggregate count summing
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
- Rollback note: revert the count-parity commit if needed.
- Observability or alerting impact: dashboard count accuracy only.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: position count fields are derived from limited visible position rows.
- Gaps: tests covered one open plus one closed row, not multiple hidden closed
  rows.
- Inconsistencies: trade aggregate totals were fixed in `RUNTIME-AUDIT-39`,
  but position counts had the same limit collapse pattern.
- Architecture constraints: read models must compose existing scoped queries.

### 2. Select One Priority Task
- Selected task: preserve runtime position counts under row limits.
- Priority rationale: direct dashboard truthfulness issue with low blast
  radius.
- Why other candidates were deferred: PnL/fees summary under limits needs a
  broader product contract decision.

### 3. Plan Implementation
- Files or surfaces to modify: repository count helper, session positions read
  service, aggregate read service, e2e test.
- Logic: count open and closed scoped positions independently of visible row
  limits.
- Edge cases: no positions, open-only, closed-only, aggregate multi-session
  summing.

### 4. Execute Implementation
- Implementation notes: added `countRuntimeManagedPositions` and reused the
  same scoped `where` clauses as visible open/closed row queries. Session and
  aggregate count fields now use true counts while row arrays remain limited.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full
  runtime-scope e2e, full monitoring aggregate e2e, typecheck, guardrails,
  lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: increasing the limit, rejected because it would
  hide the count/visibility contract.
- Technical debt introduced: no
- Scalability assessment: two bounded count queries per session positions read.
- Refinements made: documented the confirmed e2e parallelism pitfall in the
  learning journal after false failures from parallel DB-backed suite runs.

### 7. Update Documentation and Knowledge
- Docs updated: task doc, project state, task board, MVP next commits,
  learning journal.
- Context updated: yes
- Learning journal updated: yes

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
This is intentionally count-only. Summary totals under limits are tracked as a
separate audit candidate.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused runtime-scope count-limit e2e

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator monitoring LIVE/PAPER runtime
  positions.
- Existing workaround or pain: dashboard count can look lower than actual
  scoped positions.
- Smallest useful slice: count metadata only.
- Success metric or signal: focused e2e regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: dashboard smoke after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard runtime monitoring.
- SLI: runtime position count correctness.
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
- Abuse cases: counts use the same scoped `where` clauses as visible rows.
- Secret handling: none
- Security tests or scans: existing ownership regressions remain in suites.
- Fail-closed behavior: unchanged
- Residual risk: low

## Result Report
- Task summary: fixed runtime position count metadata so session and aggregate
  reads do not collapse counts to visible row limits.
- Files changed:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - canonical planning/context docs
- How tested: focused failing-then-passing e2e, full runtime-scope e2e, full
  monitoring aggregate e2e, API typecheck, guardrails, lint, and diff check.
- What is incomplete: PnL/fees summary semantics under row limits are still a
  separate audit candidate.
- Next steps: continue auditing summary fields and open-order counts under
  limits.
- Decisions made: count fields must represent true scoped counts; row arrays
  remain limited for dashboard payload size.
