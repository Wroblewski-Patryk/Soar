# Task

## Header
- ID: RUNTIME-AUDIT-39
- Title: Preserve aggregate trade totals under per-session row limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-38
- Priority: P1
- Iteration: 57
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The runtime monitoring aggregate endpoint is the dashboard read model for
selected bot runtime sessions. It combines per-session trade lists into one
aggregate payload.

## Goal
Keep aggregate trade count metadata truthful when `perSessionLimit` limits the
visible trade rows returned for each session.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Canonical planning/context docs for completion evidence.

## Success Signal
- User or operator problem: dashboard trade counts can under-report runtime
  activity when the aggregate view is row-limited.
- Expected product or reliability outcome: visible rows remain limited, but
  `trades.total` and pagination metadata preserve the real aggregate trade
  count reported by session read models.
- How success will be observed: focused failing-then-passing aggregate e2e
  regression with `perSessionLimit=1`.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement the regression and read-model fix, then move through verification and
documentation sync in the same tiny iteration.

## Constraints
- Reuse existing runtime session trade read-model totals.
- Do not add a new aggregation system.
- Do not change trade row visibility or session scoping semantics.
- Keep the change API-compatible.

## Implementation Plan
1. Add a regression proving `perSessionLimit=1` still reports the true
   aggregate trade total.
2. Change aggregate trade metadata to use the summed per-session
   `trades.total` values while keeping `items` limited.
3. Run focused and full relevant API checks.
4. Sync task board, project state, and MVP queue.

## Acceptance Criteria
- Aggregate `trades.items.length` can be lower than `trades.total`.
- Aggregate `trades.meta.total` equals `trades.total`.
- Aggregate `trades.meta.hasNext` is true when hidden trade rows remain.
- Existing aggregate contracts remain green.

## Definition of Done
- [x] Regression test fails before implementation and passes after.
- [x] Full monitoring aggregate e2e suite passes sequentially.
- [x] API typecheck, guardrails, lint, and diff check pass.
- [x] Canonical docs/context are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was planned explicitly for this autonomous
  iteration.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Duplicated trade aggregation paths.
- Temporary bypasses or fake data.
- Architecture changes without explicit approval.

## Validation Evidence
- Tests:
  - FAIL before fix:
    `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "keeps aggregate trade totals truthful" --sequence.concurrent=false`
  - PASS after fix:
    `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "keeps aggregate trade totals truthful" --sequence.concurrent=false`
  - PASS:
    `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --sequence.concurrent=false`
  - PASS: `pnpm --filter api run typecheck`
  - PASS: `pnpm run quality:guardrails`
  - PASS: `pnpm run lint`
  - PASS: `git diff --check`
- Manual checks: code review of aggregate metadata derivation
- Screenshots/logs: not applicable
- High-risk checks: fail-closed ownership scope remains delegated to existing
  session trade readers.

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
- Rollback note: revert the single aggregate read-model commit if needed.
- Observability or alerting impact: dashboard count accuracy only.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate `trades.total` is derived from limited visible aggregate
  items.
- Gaps: no regression covered hidden rows behind `perSessionLimit`.
- Inconsistencies: nested session trade read models expose true `total`, but
  the aggregate collapses it to visible row count.
- Architecture constraints: aggregate must compose existing read models.

### 2. Select One Priority Task
- Selected task: preserve aggregate trade totals under limits.
- Priority rationale: direct dashboard truthfulness issue with minimal blast
  radius.
- Why other candidates were deferred: position-level summary limit behavior
  needs a broader contract review.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate service and aggregate e2e suite.
- Logic: sum `row.trades.total` for aggregate totals and derive pagination
  metadata from visible row count versus true total.
- Edge cases: zero trades, hidden rows, duplicate visible trade IDs.

### 4. Execute Implementation
- Implementation notes: aggregate `trades.total` and `trades.meta.total` now
  sum the underlying per-session `trades.total` values, while `items` remains
  the limited visible row set. Aggregate pagination metadata now reports hidden
  rows with `hasNext`.

### 5. Verify and Test
- Validation performed: focused failing-then-passing e2e, full aggregate e2e,
  API typecheck, guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: using visible row count only, rejected because it
  repeats the dashboard drift.
- Technical debt introduced: no
- Scalability assessment: no extra DB reads; reuse existing per-session totals.
- Refinements made: pagination metadata now derives `totalPages` and `hasNext`
  from true total versus visible rows.

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
This task intentionally does not redefine position summary semantics under
limits. That needs a separate vertical-slice decision because it may affect
wallet/capital projections.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused aggregate trade-total e2e

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator monitoring LIVE/PAPER bot
  activity.
- Existing workaround or pain: count can look lower than actual bot activity.
- Smallest useful slice: aggregate trade total metadata only.
- Success metric or signal: focused e2e regression passes.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: dashboard smoke after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: dashboard runtime monitoring.
- SLI: aggregate read correctness for trade total metadata.
- SLO: not formally tracked for this tiny read-model slice.
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: unchanged
- Smoke command or manual smoke: focused API e2e
- Rollback or disable path: revert commit

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading telemetry.
- Trust boundaries: authenticated dashboard API, existing ownership readers.
- Permission or ownership checks: unchanged and delegated to session readers.
- Abuse cases: no expansion of accessible rows or symbols.
- Secret handling: none
- Security tests or scans: existing ownership regression remains in aggregate
  suite.
- Fail-closed behavior: unchanged
- Residual risk: low

## Result Report
- Task summary: fixed aggregate runtime trade metadata so dashboard totals do
  not collapse to visible row count under `perSessionLimit`.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - canonical planning/context docs
- How tested: focused failing-then-passing e2e, full aggregate e2e, API
  typecheck, guardrails, lint, and diff check.
- What is incomplete: broader position-summary limit semantics intentionally
  deferred for a separate task.
- Next steps: continue auditing aggregate/position summary parity under row
  limits.
- Decisions made: aggregate total metadata must represent real session totals,
  not limited visible rows.
