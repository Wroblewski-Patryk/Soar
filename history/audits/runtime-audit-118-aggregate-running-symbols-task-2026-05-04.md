# Task

## Header
- ID: RUNTIME-AUDIT-118
- Title: Align running aggregate symbolsTracked with projection rows
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-117
- Priority: P1
- Iteration: 118
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime monitoring aggregate already uses the latest RUNNING session projection
for `durationMs` and `eventsCount` to avoid double-counting overlapping running
sessions. `symbolsTracked` still sums all active sessions, so the aggregate
header can drift from the same projection semantics.

## Goal
Make aggregate header `symbolsTracked` use the same latest-running projection
rows as other session metadata.

## Success Signal
- User or operator problem: aggregate dashboard header can overstate tracked
  symbols during overlapping running sessions.
- Expected product or reliability outcome: aggregate metadata fields follow one
  projection contract.
- How success will be observed: focused unit tests cover latest-running row
  selection and symbols total helper behavior.
- Post-launch learning needed: no

## Deliverable For This Stage
Release a verified aggregate metadata symbol count alignment.

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
1. Export/test the latest-running projection helper or an adjacent metadata
   helper.
2. Use projection rows for `symbolsTracked`.
3. Run focused unit tests plus typecheck, guardrails, lint, and diff review.
4. Update task, project state, and queue docs.

## Acceptance Criteria
- Overlapping RUNNING sessions contribute only the latest running row to
  `symbolsTracked`.
- Non-running sessions continue to be summed.
- Existing duration and event semantics remain unchanged.

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
    PASS (`11/11`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: diff review and `git diff --check` PASS
- Screenshots/logs: not applicable
- High-risk checks: read-only aggregate metadata

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
- Rollback note: revert this commit to restore previous aggregate metadata
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `symbolsTracked` does not use latest-running projection rows.
- Gaps: overlapping RUNNING sessions can inflate aggregate header symbols.
- Inconsistencies: duration/events are projection-based; symbols are
  active-session-sum based.
- Architecture constraints: aggregate dashboard should present deterministic
  runtime read-model truth.

### 2. Select One Priority Task
- Selected task: align running aggregate `symbolsTracked`.
- Priority rationale: small dashboard metadata parity fix in the same aggregate
  surface.
- Why other candidates were deferred: aggregate trade total dedupe needs a
  larger pagination-aware design.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, focused unit test,
  planning/context docs.
- Logic: sum symbols from `sessionMetadataRows`.
- Edge cases: zero sessions, only completed sessions, overlapping running
  sessions.

### 4. Execute Implementation
- Implementation notes: exported the existing latest-running projection helper,
  added a small pure `sumRuntimeAggregateProjectedSymbolsTracked` helper, and
  changed aggregate `symbolsTracked` to sum `sessionMetadataRows`.

### 5. Verify and Test
- Validation performed: focused runtime session position unit suite, API
  typecheck, repository guardrails, lint, and diff review.
- Result: PASS

### 6. Self-Review
- Simpler option considered: inline reduce over `sessionMetadataRows`; a named
  helper was kept so projection semantics are testable without service wiring.
- Technical debt introduced: none.
- Scalability assessment: read-only aggregation remains linear in existing
  rows.
- Refinements made: helper test covers completed plus overlapping RUNNING rows.

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
This is a read-only metadata fix. It does not change runtime sessions,
positions, trades, or symbols persistence.

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
- User or operator affected: dashboard operator reviewing aggregate header.
- Existing workaround or pain: symbols tracked can be inflated while other
  metadata is already deduped.
- Smallest useful slice: metadata row projection parity.
- Success metric or signal: focused helper tests pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring aggregate header.
- SLI: aggregate metadata uses consistent projection semantics.
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
- Data classification: runtime dashboard metadata.
- Trust boundaries: no query scope changes.
- Permission or ownership checks: unchanged.
- Abuse cases: none introduced.
- Secret handling: none.
- Security tests or scans: typecheck and focused unit assertion.
- Fail-closed behavior: not applicable.
- Residual risk: DB-backed e2e remains dependent on local PostgreSQL
  availability.

## Result Report

- Task summary: aggregate runtime `symbolsTracked` now follows the same
  latest-running projection row contract as duration and event metadata.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-118-aggregate-running-symbols-task-2026-05-04.md`
- How tested: focused unit suite (`11/11`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
- Next steps: continue auditing aggregate/dashboard parity around trade totals
  and pagination-aware read-model consistency.
- Decisions made: reuse existing latest-running projection semantics for
  aggregate symbol metadata.
