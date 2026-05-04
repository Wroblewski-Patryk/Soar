# Task

## Header
- ID: RUNTIME-AUDIT-124
- Title: Align aggregate trade meta page size with query limit
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-123
- Priority: P1
- Iteration: 124
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Aggregate trade reads request `perSessionLimit` from each projected session.
The aggregate response currently reports `meta.pageSize` as the number of
deduped trade rows returned, so metadata can drift from the requested read
contract and produce misleading page counts.

## Goal
Make aggregate trade metadata report page size from the aggregate query limit
instead of the already-returned item count.

## Success Signal
- User or operator problem: aggregate trade table pagination metadata can vary
  with dedupe/item count instead of the request contract.
- Expected product or reliability outcome: aggregate trade meta page size is
  stable and tied to `perSessionLimit`.
- How success will be observed: focused unit tests cover aggregate trade meta
  calculation.
- Post-launch learning needed: no

## Deliverable For This Stage
Release a verified aggregate trade metadata page-size alignment.

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
1. Add a small tested helper for aggregate trade metadata.
2. Use `query.perSessionLimit` as aggregate trade `meta.pageSize`.
3. Run focused unit tests plus typecheck, guardrails, lint, and diff review.
4. Update task, project state, and queue docs.

## Acceptance Criteria
- Aggregate trade `meta.pageSize` equals `perSessionLimit`.
- `hasNext` remains based on `totalTrades > returnedItems`.
- Empty aggregates continue to report zero total pages.

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
    PASS (`16/16`)
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
- Rollback note: revert this commit to restore previous aggregate trade meta
  sizing
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate trade `meta.pageSize` is derived from returned item count.
- Gaps: dedupe or incomplete projected rows can make page metadata drift from
  the requested per-session limit.
- Inconsistencies: per-session trade reads report request page size, aggregate
  reads report returned item count.
- Architecture constraints: read-model metadata should reflect the API read
  contract.

### 2. Select One Priority Task
- Selected task: align aggregate trade meta page size with query limit.
- Priority rationale: small dashboard metadata parity fix in active aggregate
  audit surface.
- Why other candidates were deferred: full aggregate pagination is a broader
  design task.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, focused unit test,
  planning/context docs.
- Logic: compute aggregate trade meta from `totalTrades`, returned item count,
  and `perSessionLimit`.
- Edge cases: zero total, returned count lower than total, minimum page size.

### 4. Execute Implementation
- Implementation notes: added `buildRuntimeAggregateTradesMeta` and changed
  aggregate trades meta to use `query.perSessionLimit` for `pageSize`.

### 5. Verify and Test
- Validation performed: focused runtime session position unit suite, API
  typecheck, repository guardrails, lint, and diff review.
- Result: PASS

### 6. Self-Review
- Simpler option considered: inline `query.perSessionLimit`; helper keeps the
  meta contract testable and centralizes `hasNext` behavior.
- Technical debt introduced: no
- Scalability assessment: constant-time metadata calculation.
- Refinements made: preserved existing `hasNext = total > returnedItemsCount`.

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
This is a read-only aggregate metadata fix. It does not implement full
cross-session pagination.

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
- User or operator affected: dashboard operator reviewing aggregate trades.
- Existing workaround or pain: pagination metadata can be based on returned
  rows instead of request size.
- Smallest useful slice: aggregate trade meta page-size parity.
- Success metric or signal: focused helper tests pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring aggregate trades.
- SLI: aggregate trade metadata reflects query limit.
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
- Residual risk: full aggregate cross-session pagination remains a separate
  design task.

## Result Report

- Task summary: aggregate trade metadata now reports `pageSize` from
  `perSessionLimit` instead of returned item count.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-124-aggregate-trade-meta-page-size-task-2026-05-04.md`
- How tested: focused unit suite (`16/16`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: full aggregate cross-session pagination remains outside
  this slice.
- Next steps: continue auditing aggregate pagination and current/projection
  metadata.
- Decisions made: keep `hasNext` based on returned item count while making
  `pageSize` stable from query input.
