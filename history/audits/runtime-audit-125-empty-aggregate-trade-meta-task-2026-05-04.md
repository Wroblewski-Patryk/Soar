# Task

## Header
- ID: RUNTIME-AUDIT-125
- Title: Align empty aggregate trade meta page size
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-124
- Priority: P1
- Iteration: 125
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
RUNTIME-AUDIT-124 aligned non-empty aggregate trade metadata with
`perSessionLimit`. Empty aggregate payloads still hard-code `meta.pageSize=1`,
so the metadata contract changes when no sessions or complete payload rows are
available.

## Goal
Make empty aggregate trade metadata use the same query page-size contract as
non-empty aggregate trade metadata.

## Success Signal
- User or operator problem: empty aggregate trade tables can report a different
  page size than normal aggregate reads.
- Expected product or reliability outcome: aggregate trade metadata is stable
  across empty and non-empty states.
- How success will be observed: focused unit tests cover empty trade meta page
  size.
- Post-launch learning needed: no

## Deliverable For This Stage
Release a verified empty aggregate trade metadata page-size alignment.

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
1. Pass `perSessionLimit` into empty aggregate payload creation.
2. Reuse aggregate trade meta helper for empty trade metadata.
3. Run focused unit tests plus typecheck, guardrails, lint, and diff review.
4. Update task, project state, and queue docs.

## Acceptance Criteria
- Empty aggregate trades `meta.pageSize` equals `perSessionLimit`.
- Empty aggregate trades still report `total=0`, `totalPages=0`, and
  `hasNext=false`.
- Non-empty aggregate behavior remains unchanged.

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
- High-risk checks: read-only empty aggregate metadata

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
- Rollback note: revert this commit to restore previous empty aggregate trade
  meta page-size behavior
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: empty aggregate trade meta hard-codes page size `1`.
- Gaps: empty-state metadata does not follow R124 query-limit contract.
- Inconsistencies: empty and non-empty aggregate trades report page size from
  different sources.
- Architecture constraints: empty/read success states should preserve the same
  response contract.

### 2. Select One Priority Task
- Selected task: align empty aggregate trade meta page size.
- Priority rationale: TESTER-mode empty-state edge case directly adjacent to
  R124.
- Why other candidates were deferred: full aggregate pagination remains a
  larger design slice.

### 3. Plan Implementation
- Files or surfaces to modify: aggregate read service, focused unit test,
  planning/context docs.
- Logic: reuse `buildRuntimeAggregateTradesMeta` with `totalTrades=0`.
- Edge cases: no sessions, no complete payload rows, minimum page size.

### 4. Execute Implementation
- Implementation notes: empty aggregate payloads now receive `perSessionLimit`
  and reuse `buildRuntimeAggregateTradesMeta`.

### 5. Verify and Test
- Validation performed: focused runtime session position unit suite, API
  typecheck, repository guardrails, lint, and diff review.
- Result: PASS

### 6. Self-Review
- Simpler option considered: hard-code empty `pageSize` to the default `200`;
  passing query `perSessionLimit` preserves caller-specific contracts.
- Technical debt introduced: no
- Scalability assessment: constant-time metadata calculation.
- Refinements made: reused the R124 helper to avoid a second meta contract.

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
This is a read-only empty-state metadata fix. It does not change runtime
session, trade, position, or wallet persistence.

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
- User or operator affected: dashboard operator viewing empty aggregate trade
  state.
- Existing workaround or pain: empty-state metadata uses a different page-size
  contract.
- Smallest useful slice: empty aggregate trade meta parity.
- Success metric or signal: focused helper tests pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime monitoring aggregate trades empty state.
- SLI: empty and non-empty aggregate trade metadata share one page-size source.
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

- Task summary: empty aggregate trade metadata now uses the same
  `perSessionLimit` page-size source as non-empty aggregate trade metadata.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-125-empty-aggregate-trade-meta-task-2026-05-04.md`
- How tested: focused unit suite (`16/16`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: full aggregate cross-session pagination remains outside
  this slice.
- Next steps: continue auditing aggregate pagination and empty-state parity.
- Decisions made: pass query `perSessionLimit` into empty aggregate payloads
  instead of hard-coding page size.
