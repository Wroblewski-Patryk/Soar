# Task

## Header
- ID: RUNTIME-AUDIT-121
- Title: Align aggregate dynamic stop flag with current projection
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-120
- Priority: P1
- Iteration: 121
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Aggregate position rows now use current/projection semantics. The aggregate
`showDynamicStopColumns` flag still checks every fetched session response, so a
stale older RUNNING snapshot can enable dynamic-stop columns even when the
current aggregate open-position rows no longer need them.

## Goal
Make aggregate `showDynamicStopColumns` use the current position response that
also owns aggregate current open rows and open-order rows.

## Success Signal
- User or operator problem: dynamic stop columns can appear because of stale
  non-displayed aggregate position snapshots.
- Expected product or reliability outcome: aggregate position table flags and
  aggregate current rows share one projection source.
- How success will be observed: focused unit tests cover stale-vs-current flag
  selection.
- Post-launch learning needed: no

## Deliverable For This Stage
Release a verified aggregate dynamic-stop flag projection alignment.

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
1. Add a tiny tested helper for current aggregate dynamic-stop column flag.
2. Use the latest position response for `positions.showDynamicStopColumns`.
3. Run focused unit tests plus typecheck, guardrails, lint, and diff review.
4. Update task, project state, and queue docs.

## Acceptance Criteria
- Older overlapping RUNNING rows do not enable aggregate dynamic-stop columns
  when the current position response has the flag disabled.
- Current position response can enable aggregate dynamic-stop columns.
- Frontend row-truth fallback remains unchanged.

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
    PASS (`14/14`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: diff review and `git diff --check` PASS
- Screenshots/logs: not applicable
- High-risk checks: read-only aggregate display flag

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
- Rollback note: revert this commit to restore previous aggregate dynamic-stop
  flag behavior
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate dynamic-stop flag uses all position responses.
- Gaps: stale older RUNNING responses can enable columns after table rows have
  moved to the current response.
- Inconsistencies: aggregate current row source and aggregate column flag source
  can differ.
- Architecture constraints: dashboard read-model flags should match the
  displayed row projection.

### 2. Select One Priority Task
- Selected task: align aggregate dynamic-stop flag with current projection.
- Priority rationale: small display parity fix directly adjacent to R120.
- Why other candidates were deferred: broader pagination/read-model cleanup is
  larger than one tiny slice.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, focused unit test,
  planning/context docs.
- Logic: resolve flag from latest position response only.
- Edge cases: null latest response, stale true/current false, current true.

### 4. Execute Implementation
- Implementation notes: added
  `resolveRuntimeAggregateCurrentDynamicStopColumns` and changed aggregate
  `positions.showDynamicStopColumns` to use the freshest position response.

### 5. Verify and Test
- Validation performed: focused runtime session position unit suite, API
  typecheck, repository guardrails, lint, and diff review.
- Result: PASS

### 6. Self-Review
- Simpler option considered: inline `latestPositionResponse?.showDynamicStopColumns === true`;
  a named helper keeps the flag projection contract testable.
- Technical debt introduced: no
- Scalability assessment: constant-time display flag resolution.
- Refinements made: kept frontend row-truth fallback unchanged.

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
This is a read-only dashboard flag fix. It does not change position
persistence, execution, exchange synchronization, or strategy behavior.

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
- User or operator affected: dashboard operator reviewing aggregate open
  position table columns.
- Existing workaround or pain: stale session response can enable dynamic-stop
  columns that current rows do not need.
- Smallest useful slice: aggregate flag projection parity.
- Success metric or signal: focused helper tests pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring aggregate position table.
- SLI: aggregate display flag uses current projection source.
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
- Data classification: runtime dashboard display metadata.
- Trust boundaries: no query scope changes.
- Permission or ownership checks: unchanged.
- Abuse cases: none introduced.
- Secret handling: none.
- Security tests or scans: typecheck and focused unit assertion.
- Fail-closed behavior: not applicable.
- Residual risk: DB-backed e2e remains dependent on local PostgreSQL
  availability.

## Result Report

- Task summary: aggregate dynamic-stop column flag now uses the same current
  position response as aggregate current open rows and open-order rows.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-121-aggregate-dynamic-stop-flag-task-2026-05-04.md`
- How tested: focused unit suite (`14/14`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
- Next steps: continue auditing aggregate/dashboard parity around pagination and
  remaining current-vs-history display metadata.
- Decisions made: use latest position response for aggregate strategy-mode
  dynamic-stop flag while preserving frontend row-truth fallback.
