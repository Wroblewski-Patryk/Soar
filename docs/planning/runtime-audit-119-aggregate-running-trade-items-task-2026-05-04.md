# Task

## Header
- ID: RUNTIME-AUDIT-119
- Title: Align aggregate trade items with latest-running projection rows
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-118
- Priority: P1
- Iteration: 119
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime monitoring aggregate already uses latest-running projection rows for
session metadata, symbol summaries, position totals, and trade totals. Trade
table items still flatten all complete payload rows, so an older RUNNING row
can remain visible in the aggregate trade table after totals have moved to the
newer RUNNING projection.

## Goal
Make aggregate trade table items use the same latest-running projection rows
as aggregate trade totals and fees.

## Success Signal
- User or operator problem: aggregate dashboard trade table can show stale
  RUNNING session rows that are no longer counted in the trade total.
- Expected product or reliability outcome: aggregate trade table and aggregate
  trade counters are computed from one projection contract.
- How success will be observed: focused unit tests cover latest-running trade
  item projection and dedupe/sort behavior.
- Post-launch learning needed: no

## Deliverable For This Stage
Release a verified aggregate trade item projection alignment.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add a small tested helper that flattens aggregate trade items from projected
   rows only.
2. Reuse the existing latest-running projection row selection for aggregate
   `trades.items`, `total`, and `feesPaid`.
3. Run focused unit tests plus typecheck, guardrails, lint, and diff review.
4. Update task, project state, and queue docs.

## Acceptance Criteria
- Older overlapping RUNNING rows do not contribute aggregate trade table items.
- Completed/non-running rows continue to contribute aggregate trade table
  items.
- Aggregate trade table sorting and unique-id dedupe remain deterministic.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` standards are satisfied for this slice.
- [x] Focused tests pass.
- [x] Typecheck, guardrails, and lint pass.
- [x] Documentation and queue state are updated.

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
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
    PASS (`12/12`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: diff review and `git diff --check` PASS
- Screenshots/logs: not applicable
- High-risk checks: read-only aggregate trade metadata

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous aggregate trade item
  projection
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate `trades.items` flattens all complete payload rows while
  aggregate trade totals use latest-running projection rows.
- Gaps: overlapping RUNNING sessions can leave stale trade rows visible in the
  aggregate table.
- Inconsistencies: trade totals/fees and trade table items can represent
  different session projections.
- Architecture constraints: dashboard read-models should be deterministic and
  should reuse existing projection semantics.

### 2. Select One Priority Task
- Selected task: align aggregate trade items with latest-running projection
  rows.
- Priority rationale: small dashboard parity fix adjacent to R118 with direct
  operator-visible impact.
- Why other candidates were deferred: broader pagination-aware aggregate design
  and position item projection deserve separate, smaller slices.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, focused unit test,
  planning/context docs.
- Logic: build trade table items from `tradeTotalRows` instead of all complete
  payload rows, preserving existing unique-id dedupe and timestamp sorting.
- Edge cases: zero rows, completed rows only, overlapping RUNNING rows, duplicate
  trade ids.

### 4. Execute Implementation
- Implementation notes: added `buildRuntimeAggregateProjectedTradeItems` and
  changed aggregate trade table rows to use the same projected rows as trade
  totals and fees.

### 5. Verify and Test
- Validation performed: focused runtime session position unit suite, API
  typecheck, repository guardrails, lint, and diff review.
- Result: PASS

### 6. Self-Review
- Simpler option considered: inline flatten over `tradeTotalRows`; a named
  helper keeps the projection item contract testable.
- Technical debt introduced: no
- Scalability assessment: unchanged linear flatten/dedupe over already fetched
  per-session rows.
- Refinements made: formatted helper sorting for readability after diff review.

### 7. Update Documentation and Knowledge
- Docs updated: task contract and queue docs.
- Context updated: project state and task board.
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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
This is a read-only aggregate dashboard fix. It does not change trade
persistence, execution, exchange synchronization, or order lifecycle behavior.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`: Goal, Scope, Implementation Plan, Acceptance Criteria,
Definition of Done, and Result Report.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused runtime session position unit suite

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator reviewing aggregate trade
  table and counters.
- Existing workaround or pain: stale RUNNING trade rows can remain visible
  after totals are projected to a newer RUNNING session.
- Smallest useful slice: aggregate trade item projection parity.
- Success metric or signal: focused helper tests pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring aggregate trade table.
- SLI: aggregate trade table and counters use one projection source.
- SLO: no change.
- Error budget posture: not applicable
- Health/readiness check: no change.
- Logs, dashboard, or alert route: no change.
- Smoke command or manual smoke: focused unit tests.
- Rollback or disable path: revert this commit.

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: runtime dashboard trade metadata.
- Trust boundaries: no query scope changes.
- Permission or ownership checks: unchanged.
- Abuse cases: none introduced.
- Secret handling: none.
- Security tests or scans: typecheck and focused unit assertion.
- Fail-closed behavior: not applicable.
- Residual risk: DB-backed e2e remains dependent on local PostgreSQL
  availability.

## Result Report

- Task summary: aggregate trade table items now use the same latest-running
  projection rows as aggregate trade totals and fees.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-119-aggregate-running-trade-items-task-2026-05-04.md`
- How tested: focused unit suite (`12/12`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
- Next steps: continue auditing aggregate/dashboard parity around position item
  projection and pagination-aware read-model consistency.
- Decisions made: reuse existing latest-running projection semantics for
  aggregate trade table items.
