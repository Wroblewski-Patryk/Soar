# Task

## Header
- ID: RUNTIME-AUDIT-123
- Title: Remove stale aggregate position response collection
- Task Type: refactor
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-122
- Priority: P2
- Iteration: 123
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Recent aggregate dashboard slices moved position tables, open-order counters,
and dynamic-stop display flags onto current/projection sources. The old
`positionResponses` flattening source remains allocated but unused.

## Goal
Remove the stale aggregate `positionResponses` collection so the read-model has
one clear source per displayed concept.

## Success Signal
- User or operator problem: stale parallel read-model sources increase the risk
  of future dashboard table/counter drift.
- Expected product or reliability outcome: aggregate read-model implementation
  reflects the documented projection contract without unused source paths.
- How success will be observed: focused runtime aggregate helper suite remains
  green and diff review shows no behavioral source change.
- Post-launch learning needed: no

## Deliverable For This Stage
Release a verified stale source cleanup.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Remove unused aggregate `positionResponses` collection.
2. Run focused unit tests plus typecheck, guardrails, lint, and diff review.
3. Update task, project state, and queue docs.

## Acceptance Criteria
- No unused aggregate position-response source remains.
- Existing current/projection helper behavior remains unchanged.
- No API response shape changes.

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
    PASS (`15/15`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
- Manual checks: diff review and `git diff --check` PASS
- Screenshots/logs: not applicable
- High-risk checks: read-only aggregate cleanup

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
- Rollback note: revert this commit to restore the previous internal local
  variable
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: an unused aggregate position-response collection remains after
  current/projection cleanup.
- Gaps: future edits could accidentally reuse that stale all-session source.
- Inconsistencies: implementation still names a flattened source no longer used
  by the aggregate contract.
- Architecture constraints: read-model concepts should have one clear source of
  truth.

### 2. Select One Priority Task
- Selected task: remove stale aggregate position response collection.
- Priority rationale: ARCHITECT-mode cleanup preventing future drift in the
  same dashboard surface.
- Why other candidates were deferred: larger pagination work is not a tiny
  architecture slice.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service and planning/context docs.
- Logic: remove only the unused local collection.
- Edge cases: response shape unchanged; helper contracts unchanged.

### 4. Execute Implementation
- Implementation notes: removed the unused `positionResponses` local collection
  from aggregate runtime monitoring read assembly.

### 5. Verify and Test
- Validation performed: focused runtime session position unit suite, API
  typecheck, repository guardrails, lint, and diff review.
- Result: PASS

### 6. Self-Review
- Simpler option considered: leave the unused variable in place; removed it to
  keep the projection source contract unambiguous.
- Technical debt introduced: no
- Scalability assessment: unchanged.
- Refinements made: none needed after diff review.

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
This is an internal read-model cleanup. It does not change persistence,
execution, exchange synchronization, or API response shape.

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
- User or operator affected: future dashboard operator stability.
- Existing workaround or pain: stale source path invites reintroduction of
  table/counter drift.
- Smallest useful slice: remove unused aggregate source.
- Success metric or signal: focused tests and diff review pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring aggregate dashboard.
- SLI: implementation source paths match projection contract.
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

- Task summary: removed the stale all-session aggregate position response
  collection after current/projection sources became canonical.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-123-remove-stale-position-response-aggregate-task-2026-05-04.md`
- How tested: focused unit suite (`15/15`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
- Next steps: continue auditing aggregate pagination and runtime read-model
  source clarity.
- Decisions made: remove the stale collection instead of leaving a misleading
  parallel source in place.
