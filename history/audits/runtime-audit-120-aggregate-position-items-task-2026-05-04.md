# Task

## Header
- ID: RUNTIME-AUDIT-120
- Title: Align aggregate position items with current projection rows
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-119
- Priority: P1
- Iteration: 120
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime monitoring aggregate uses latest/freshest session projections for
current open-position counters and latest-running projections for historical
closed counters. Position table items still flatten all complete payload rows,
so older RUNNING session rows can remain visible after counters move to a newer
projection.

## Goal
Make aggregate position table rows use the same current/projection semantics as
the aggregate position counters.

## Success Signal
- User or operator problem: aggregate dashboard position tables can show stale
  open positions or open orders that are no longer counted.
- Expected product or reliability outcome: aggregate position tables and
  counters represent the same read-model truth.
- How success will be observed: focused unit tests cover current open
  positions/orders and projected historical rows.
- Post-launch learning needed: no

## Deliverable For This Stage
Release a verified aggregate position item projection alignment.

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
1. Add small tested helpers for aggregate open position rows, historical rows,
   and open order rows.
2. Use the freshest position response for current open positions and open
   orders, and latest-running projection rows for historical position rows.
3. Run focused unit tests plus typecheck, guardrails, lint, and diff review.
4. Update task, project state, and queue docs.

## Acceptance Criteria
- Older overlapping RUNNING rows do not contribute aggregate current open
  position rows.
- Older overlapping RUNNING rows do not contribute aggregate current open order
  rows.
- Completed/non-running rows still contribute aggregate historical position
  rows through the latest-running projection contract.

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
    PASS (`13/13`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: diff review and `git diff --check` PASS
- Screenshots/logs: not applicable
- High-risk checks: read-only aggregate position metadata

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
- Rollback note: revert this commit to restore previous aggregate position item
  projection
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate position table items flatten all complete payload rows while
  current counters use freshest/latest projection semantics.
- Gaps: stale RUNNING rows can remain visible in open position and open-order
  tables.
- Inconsistencies: aggregate open counters and aggregate current row lists can
  represent different session snapshots.
- Architecture constraints: dashboard read-models should be deterministic and
  use one source of truth per displayed concept.

### 2. Select One Priority Task
- Selected task: align aggregate position items with current/projection rows.
- Priority rationale: TESTER-mode table/counter mismatch with direct dashboard
  impact.
- Why other candidates were deferred: broader pagination behavior remains a
  separate read-model design slice.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, focused unit test,
  planning/context docs.
- Logic: use freshest position response for current open rows/orders and
  latest-running projection rows for history rows.
- Edge cases: no latest response, duplicate ids, completed plus overlapping
  running rows, deterministic sorting.

### 4. Execute Implementation
- Implementation notes: added current/projection table helpers and changed the
  aggregate to source current open positions and open orders from the freshest
  position response while historical rows use latest-running projection rows.

### 5. Verify and Test
- Validation performed: focused runtime session position unit suite, API
  typecheck, repository guardrails, lint, and diff review.
- Result: PASS

### 6. Self-Review
- Simpler option considered: inline flatten/sort expressions in the aggregate
  body; named helpers keep projection contracts testable and mirror R118/R119.
- Technical debt introduced: no
- Scalability assessment: unchanged linear dedupe/sort over already fetched
  rows.
- Refinements made: tightened open-item helper typing so margin calculation
  still has `entryNotional` and `leverage`.

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
This is a read-only aggregate dashboard fix. It does not change position
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
- User or operator affected: dashboard operator reviewing aggregate position
  tables and counters.
- Existing workaround or pain: stale RUNNING rows can remain visible after
  counters are projected to a newer session snapshot.
- Smallest useful slice: aggregate position item projection parity.
- Success metric or signal: focused helper tests pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring aggregate position tables.
- SLI: aggregate position tables and counters use aligned projection sources.
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
- Data classification: runtime dashboard position metadata.
- Trust boundaries: no query scope changes.
- Permission or ownership checks: unchanged.
- Abuse cases: none introduced.
- Secret handling: none.
- Security tests or scans: typecheck and focused unit assertion.
- Fail-closed behavior: not applicable.
- Residual risk: DB-backed e2e remains dependent on local PostgreSQL
  availability.

## Result Report

- Task summary: aggregate position tables now align current open rows/open
  orders with the freshest position response and historical rows with
  latest-running projection rows.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-120-aggregate-position-items-task-2026-05-04.md`
- How tested: focused unit suite (`13/13`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
- Next steps: continue auditing aggregate/dashboard parity around remaining
  metadata flags and pagination-aware read-model consistency.
- Decisions made: use freshest position response for current tables and
  latest-running projection for historical tables.
