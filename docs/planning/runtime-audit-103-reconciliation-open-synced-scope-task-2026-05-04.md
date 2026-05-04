# Task

## Header
- ID: RUNTIME-AUDIT-103
- Title: Exclude orphan local rows from live reconciliation open synced lookups
- Task Type: fix
- Current Stage: implementation
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-102
- Priority: P1
- Iteration: 103
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Live reconciliation default dependencies use "synced" open-position semantics
to update existing imported exchange positions and to scan stale local rows for
a given API key. Those default queries still selected every `status=OPEN`
matching row and could include `ORPHAN_LOCAL` records, while `DRIFT` should
remain recoverable.

## Goal
Ensure live reconciliation default open-synced lookups exclude stale local
`ORPHAN_LOCAL` rows while preserving `DRIFT` recovery.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- This task document

## Success Signal
- User or operator problem: stale local imported rows should not be reused or
  closed again by LIVE reconciliation after they are outside active truth.
- Expected product or reliability outcome: reconciliation updates `IN_SYNC` or
  recoverable `DRIFT` rows, not stale `ORPHAN_LOCAL` rows.
- How success will be observed: default-deps regression proves
  `ORPHAN_LOCAL` is ignored and `DRIFT` remains findable.
- Post-launch learning needed: no

## Deliverable For This Stage
Apply query predicate fixes, add focused default-deps regression, validate,
update source-of-truth docs, and commit.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add `syncState: { not: 'ORPHAN_LOCAL' }` to default
   `findOpenSyncedPositionByExternalId`.
2. Add the same exclusion to default `listOpenSyncedPositionsForApiKey`.
3. Add a regression proving default lookup ignores `ORPHAN_LOCAL` and returns
   a recoverable `DRIFT` open row.
4. Run focused reconciliation tests plus API typecheck, guardrails, lint, and
   diff check.
5. Update task board, project state, and planning docs.
6. Create one small commit.

## Acceptance Criteria
- Default external-id lookup ignores open `ORPHAN_LOCAL` rows.
- Default external-id lookup still returns open `DRIFT` rows.
- Default stale-position scan no longer includes open `ORPHAN_LOCAL` rows.
- No change to reconciliation behavior for `IN_SYNC` and `DRIFT` rows.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this slice.
- [x] Focused reconciliation tests pass.
- [x] API typecheck passes.
- [x] Repository guardrails and lint pass.
- [x] Documentation/context files are updated.
- [x] A tiny single-purpose commit is created.

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
  - `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --run` PASS (`31/31`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS
- Manual checks: diff review confirmed `ORPHAN_LOCAL` is excluded while `DRIFT`
  remains eligible for reconciliation recovery.
- Screenshots/logs: not applicable
- High-risk checks: stale local rows cannot steal default external-id lookup;
  recoverable `DRIFT` rows still resolve.

## Architecture Evidence
- Architecture source reviewed: AGENTS.md, autonomous engineering loop, active
  runtime audit queue, live reconciliation active-truth behavior.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous reconciliation lookup
  predicates
- Observability or alerting impact: reduces stale local reconciliation noise
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: default live reconciliation open-synced lookups could include
  `ORPHAN_LOCAL` rows.
- Gaps: query predicates did not match the "synced" naming or active-truth
  contract.
- Inconsistencies: `DRIFT` should be recoverable, `ORPHAN_LOCAL` should not be
  active.
- Architecture constraints: reuse existing reconciliation; no new repair path.

### 2. Select One Priority Task
- Selected task: exclude `ORPHAN_LOCAL` from live reconciliation open-synced
  default deps.
- Priority rationale: this is a LIVE import/reconciliation path tied directly
  to the user's missing exchange-position reports.
- Why other candidates were deferred: broader positions repair predicates can
  be audited later; this is the clearest default-deps drift.

### 3. Plan Implementation
- Files or surfaces to modify: reconciliation service, focused test, planning
  and context docs.
- Logic: exclude only `ORPHAN_LOCAL`, preserving `DRIFT`.
- Edge cases: legacy external ids and market-scoped ids remain unchanged.

### 4. Execute Implementation
- Implementation notes: narrowed default external-id lookup and API-key stale
  scan with `syncState: { not: 'ORPHAN_LOCAL' }`.

### 5. Verify and Test
- Validation performed: focused reconciliation suite, API typecheck,
  repository guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: requiring `IN_SYNC` only was rejected because
  `DRIFT` is intentionally recoverable by reconciliation.
- Technical debt introduced: no
- Scalability assessment: enum inequality narrows existing external-id and
  api-key scoped scans.
- Refinements made: compacted predicate formatting to stay within production
  monolith line budget.

### 7. Update Documentation and Knowledge
- Docs updated: task, MVP next commits, MVP execution plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
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
The task intentionally does not require `IN_SYNC` only, because `DRIFT` is a
recoverable reconciliation state.

## Production-Grade Required Contract
- Goal: exclude orphan local rows from live reconciliation open synced lookups.
- Scope: listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: listed above.
- Result Report: pending.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: default dependency regression
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading and exchange position data
- Trust boundaries: exchange reconciliation worker and database
- Permission or ownership checks: scoped by `userId`, API key id, and external
  position id
- Abuse cases: stale local rows must not steal or duplicate LIVE exchange
  reconciliation
- Secret handling: no secret changes
- Security tests or scans: focused tests plus typecheck/lint
- Fail-closed behavior: `ORPHAN_LOCAL` rows stay outside reconciliation active
  truth
- Residual risk: low

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: live reconciliation default open-synced lookups now exclude
  `ORPHAN_LOCAL` while preserving `DRIFT`.
- Files changed:
  - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
  - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/runtime-audit-103-reconciliation-open-synced-scope-task-2026-05-04.md`
- How tested: focused reconciliation suite (`31/31`), API typecheck,
  repository guardrails, lint, and diff check all passed.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue the next tiny runtime/dashboard active-truth audit
  slice.
- Decisions made: exclude only `ORPHAN_LOCAL`, not all non-`IN_SYNC`, because
  `DRIFT` is a recoverable reconciliation state.
