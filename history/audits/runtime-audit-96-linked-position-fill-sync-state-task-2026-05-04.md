# Task

## Header
- ID: RUNTIME-AUDIT-96
- Title: fix(api-orders): guard linked position fill lifecycle
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-95
- Priority: P1
- Iteration: 96
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
LIVE order-trade updates can receive a filled order that is already linked to
a local position. The linked-position branch checked `status=OPEN` only for
close handling and otherwise treated any linked position as a DCA/add target.

## Goal
Ensure exchange-confirmed linked-position fill lifecycle only mutates positions
that are active synced truth: `status=OPEN` and `syncState=IN_SYNC`.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Gate linked-position lifecycle on `status=OPEN` and `syncState=IN_SYNC`.
2. Leave exchange order status/fill updates intact for the matched valid order.
3. Add focused coverage for a filled order linked to an `ORPHAN_LOCAL` position.
4. Run exchange-event tests, API typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- Linked DCA/close lifecycle mutates only open synced positions.
- A linked stale local position remains unchanged after a fill event.
- No DCA trade or runtime DCA dedupe completion is written for the stale
  linked position.
- Existing valid open, close, imported-close, and DCA event flows still pass.

## Definition of Done
- [x] Implementation fits the approved LIVE order lifecycle.
- [x] Focused tests cover stale linked-position behavior.
- [x] Relevant validation commands pass.
- [x] Context and planning docs are updated with evidence.

## Forbidden
- New exchange-event pipelines or duplicate lifecycle paths.
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
- Rollback note: revert this commit to restore previous linked-position fill
  behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: linked-position fill branch can mutate stale local positions.
- Gaps: DCA/add branch did not require active synced position truth.
- Inconsistencies: dashboard/runtime active position reads require
  `syncState=IN_SYNC`; linked fill lifecycle did not.
- Architecture constraints: order fill lifecycle must not bypass active
  position ownership and lifecycle guards.

### 2. Select One Priority Task
- Selected task: guard linked-position exchange fill lifecycle with active sync
  state.
- Priority rationale: this path mutates positions, trades, and runtime DCA
  state after LIVE exchange events.
- Why other candidates were deferred: unlinked fill lifecycle has its own
  reusable-position query and can be audited next.

### 3. Plan Implementation
- Files or surfaces to modify: exchange events service, focused tests,
  planning/context docs.
- Logic: linked-position branch runs only for `OPEN` + `IN_SYNC`; otherwise the
  order remains updated but position lifecycle is skipped.
- Edge cases: stale local linked position unchanged; valid linked DCA still
  updates.

### 4. Execute Implementation
- Implementation notes: linked-position fill branch now requires
  `status=OPEN` and `syncState=IN_SYNC` before close/DCA lifecycle mutation.

### 5. Verify and Test
- Validation performed: exchange-events suite, API typecheck, repository
  guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only guarding close branch.
- Technical debt introduced: no
- Scalability assessment: reuses existing `syncState` active-truth contract.
- Refinements made: stale linked DCA test asserts position, trade, and dedupe
  remain unchanged while the order fill itself is recorded.

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
- Task summary: linked-position exchange fill lifecycle now mutates only open
  synced positions.
- Files changed:
  `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`,
  `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`, and
  planning/context docs.
- How tested: exchange-events suite (`7/7`), API typecheck, repository
  guardrails, lint, and diff check.
- What is incomplete: none.
- Next steps: audit unlinked order fill reusable-position lookup for stale
  imported/open rows.
- Decisions made: order fill can update the order itself, but position
  lifecycle requires linked position `OPEN` and `IN_SYNC`.
