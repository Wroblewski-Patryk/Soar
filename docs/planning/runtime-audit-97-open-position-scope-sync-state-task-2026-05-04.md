# Task

## Header
- ID: RUNTIME-AUDIT-97
- Title: fix(api-orders): require synced open position scope
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-96
- Priority: P1
- Iteration: 97
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Manual order conflict checks and unlinked fill lifecycle share the same open
position scope helper. That helper still defined active position truth as
`status=OPEN` without `syncState=IN_SYNC`. LIVE imported-position fallbacks in
orders service and lifecycle used the same active-truth shape.

## Goal
Ensure order open/conflict and unlinked fill lifecycle reuse only open synced
positions, not stale local rows.

## Scope
- `apps/api/src/modules/orders/orders.positionScope.ts`
- `apps/api/src/modules/orders/orders.lifecycle.service.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add `syncState=IN_SYNC` to the shared open-position scope helper.
2. Add `syncState=IN_SYNC` to LIVE imported-position fallback queries used by
   order conflict and fill lifecycle.
3. Add focused tests proving stale local and stale imported rows no longer
   block new valid order opens.
4. Run focused order tests, API typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- Shared open-position scope returns only `OPEN` + `IN_SYNC` positions.
- Stale same-symbol local rows do not trigger reverse-direction conflicts.
- Stale owned imported rows do not trigger LIVE reverse-direction conflicts.
- Existing synced open-position conflict behavior remains intact.

## Definition of Done
- [x] Implementation fits the approved order lifecycle.
- [x] Focused tests cover stale local and imported position scopes.
- [x] Relevant validation commands pass.
- [x] Context and planning docs are updated with evidence.

## Forbidden
- New order lifecycle systems or duplicate scope helpers.
- Temporary bypasses or mock-only behavior.
- Architecture changes without explicit approval.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/runtime-signal-merge-contract.md`,
  `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous open-position scope
  behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: shared order open-position scope lacks `syncState=IN_SYNC`.
- Gaps: stale local rows can still block or absorb unlinked order fill
  lifecycle.
- Inconsistencies: runtime/dashboard active position truth already requires
  synced state.
- Architecture constraints: order lifecycle must not treat stale local rows as
  active position truth.

### 2. Select One Priority Task
- Selected task: align shared order open-position scope with active sync state.
- Priority rationale: this helper feeds manual order conflicts and unlinked
  fill position reuse.
- Why other candidates were deferred: linked-position exchange fill lifecycle
  was closed in RUNTIME-AUDIT-96; this is the shared unlinked scope.

### 3. Plan Implementation
- Files or surfaces to modify: shared position scope, lifecycle imported
  fallback, service imported conflict fallback, focused tests, context docs.
- Logic: require `IN_SYNC` for all order open-position reuse/conflict queries.
- Edge cases: synced conflicts still block; stale local/imported rows no
  longer block.

### 4. Execute Implementation
- Implementation notes: shared open-position scope now requires
  `syncState=IN_SYNC`; both LIVE imported-position order conflict and fill
  lifecycle fallback queries now apply the same active-truth guard.

### 5. Verify and Test
- Validation performed: orders service suite, API typecheck, repository
  guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: patching only lifecycle call site.
- Technical debt introduced: no
- Scalability assessment: centralizes active-truth behavior in existing helper.
- Refinements made: stale local conflict test uses a LIMIT order to isolate
  reverse-conflict scope from separate position-create uniqueness behavior.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence, MVP next commits queue, MVP execution plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable.

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

## Result Report
- Task summary: shared order open-position scope now uses `OPEN` and
  `IN_SYNC` as active truth.
- Files changed:
  `apps/api/src/modules/orders/orders.positionScope.ts`,
  `apps/api/src/modules/orders/orders.lifecycle.service.ts`,
  `apps/api/src/modules/orders/orders.service.ts`,
  `apps/api/src/modules/orders/orders.service.test.ts`, and planning/context
  docs.
- How tested: orders service suite (`33/33`), API typecheck, repository
  guardrails, lint, and diff check.
- What is incomplete: separate future task should inspect stale local rows vs
  DB uniqueness during immediate position creation.
- Next steps: audit position-create uniqueness behavior for stale local rows in
  immediate fill lifecycle.
- Decisions made: stale local/imported open rows are not active order
  conflict/reuse truth.
