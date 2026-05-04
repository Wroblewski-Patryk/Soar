# Task

## Header
- ID: RUNTIME-AUDIT-98
- Title: Release stale local position blockers before immediate fill create
- Task Type: fix
- Current Stage: implementation
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-97
- Priority: P1
- Iteration: 98
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
RUNTIME-AUDIT-97 aligned order open-position reads with the active-truth
contract by requiring `syncState=IN_SYNC`. The immediate fill create path can
therefore correctly ignore stale `ORPHAN_LOCAL` open rows, but the database
partial unique indexes still treat any `status=OPEN` row in the same
user/symbol/scope as a blocker.

## Goal
Ensure PAPER and LIVE immediate fills can create a new canonical `IN_SYNC`
position after stale local rows were excluded from active-truth reads, while
only closing stale `ORPHAN_LOCAL` blockers in the exact same DB uniqueness
scope.

## Scope
- `apps/api/src/modules/orders/orders.lifecycle.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- This task document

## Success Signal
- User or operator problem: immediate PAPER/LIVE fills should not fail because
  a stale local open row remains in the same position uniqueness scope.
- Expected product or reliability outcome: dashboard-active positions reflect
  canonical synced truth after fills, without stale local rows blocking opens.
- How success will be observed: regression test proves stale `ORPHAN_LOCAL`
  blockers are closed with system repair attribution before a new `IN_SYNC`
  position is created.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement the smallest lifecycle fix and focused regression test, then verify
with targeted and repository-level gates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it
- close only `status=OPEN` and `syncState=ORPHAN_LOCAL` blockers in the exact
  wallet/bot/unowned uniqueness scope

## Implementation Plan
1. Add a scoped stale-blocker resolver in the order fill lifecycle.
2. Before creating a new position, close matching stale local blockers with
   existing `SYSTEM_REPAIR` attribution and `REPAIR_ONLY_CLEANUP` continuity.
3. Add a PAPER MARKET regression proving the create path releases a stale
   unowned blocker and creates a fresh `IN_SYNC` position.
4. Run targeted order tests, API typecheck, guardrails, lint, and diff review.
5. Update planning/context docs and commit a single-purpose change.

## Acceptance Criteria
- Immediate fill lifecycle does not update or close active `IN_SYNC` rows as
  stale blockers.
- Stale `ORPHAN_LOCAL` rows in the same uniqueness scope are closed before a
  new position create.
- New position remains `syncState=IN_SYNC`.
- Regression evidence covers the previously failing DB unique-blocker path.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this slice.
- [x] Focused tests pass.
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
  - `pnpm --filter api run test -- src/modules/orders/orders.service.test.ts --run` PASS (`34/34`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS
- Manual checks: diff review confirmed only exact-scope stale `ORPHAN_LOCAL`
  blockers are repair-closed before a new position create.
- Screenshots/logs: not applicable
- High-risk checks: fail-closed stale blocker scope reviewed before closure;
  `IN_SYNC` and `DRIFT` rows are not included in the repair close predicate.

## Architecture Evidence
- Architecture source reviewed: AGENTS.md, autonomous engineering loop, active
  runtime audit queue, position repair attribution pattern
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
- Rollback note: revert this commit to restore previous create behavior
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: active-truth reads exclude stale local open rows, but DB partial
  unique indexes still block creates when a stale `ORPHAN_LOCAL` row remains
  `status=OPEN`.
- Gaps: no immediate-fill cleanup existed at the point where the unique
  blocker is encountered.
- Inconsistencies: order lifecycle active reads and DB uniqueness enforcement
  could disagree after RUNTIME-AUDIT-97.
- Architecture constraints: reuse existing system repair attribution and
  preserve `IN_SYNC` as the only active truth.

### 2. Select One Priority Task
- Selected task: release stale local position blockers before immediate fill
  creates a new active position.
- Priority rationale: this can directly explain PAPER positions missing after
  valid immediate fills and is a small continuation of RUNTIME-AUDIT-97.
- Why other candidates were deferred: wallet/dashboard and broader LIVE sync
  checks remain queued; this slice fixes one confirmed blocker path first.

### 3. Plan Implementation
- Files or surfaces to modify: order lifecycle, focused order service test, and
  planning/context docs.
- Logic: close exact-scope `ORPHAN_LOCAL` open blockers with system repair
  attribution before creating the fresh synced position.
- Edge cases: wallet scope, bot-only scope, unowned scope, and avoiding
  `IN_SYNC`/`DRIFT` mutation.

### 4. Execute Implementation
- Implementation notes: added `releaseStaleOpenPositionBlockers` to the order
  fill lifecycle and invoked it immediately before `tx.position.create`.

### 5. Verify and Test
- Validation performed: targeted order service regression, API typecheck,
  repository guardrails, lint, and diff whitespace check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: broad close of all stale symbol rows was rejected;
  the implemented predicate mirrors the DB uniqueness scopes.
- Technical debt introduced: no
- Scalability assessment: scoped `updateMany` by user/symbol/wallet/bot and
  stale sync state, so the change remains bounded.
- Refinements made: reused existing system repair attribution instead of
  adding a new close reason.

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
This is not a new reconciliation system. It is a narrow release of stale local
rows that are already outside active truth but can still block the DB create
contract because their status remains `OPEN`.

## Production-Grade Required Contract
- Goal: release stale local position blockers before immediate fill position
  create.
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
- Error state verified: focused regression planned
- Refresh/restart behavior verified: not applicable
- Regression check performed: pending

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading data
- Trust boundaries: API service and database transaction
- Permission or ownership checks: scoped by `userId` and exact position scope
- Abuse cases: stale local row must not let one user/scope affect another
- Secret handling: no secret changes
- Security tests or scans: existing API tests and typecheck
- Fail-closed behavior: only `ORPHAN_LOCAL` open blockers are repair-closed
- Residual risk: low after regression

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: order fill lifecycle now releases exact-scope stale local
  position blockers before creating the fresh synced position for filled
  orders.
- Files changed:
  - `apps/api/src/modules/orders/orders.lifecycle.service.ts`
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/runtime-audit-98-immediate-fill-stale-position-blocker-task-2026-05-04.md`
- How tested: orders service suite (`34/34`), API typecheck, repository
  guardrails, lint, and diff check all passed.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue the next tiny runtime/dashboard active-truth audit
  slice.
- Decisions made: reused `SYSTEM_REPAIR` and `REPAIR_ONLY_CLEANUP` because the
  stale row is local cleanup, not exchange-confirmed closure.
