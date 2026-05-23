# Task

## Header
- ID: RUNTIME-AUDIT-93
- Title: fix(api-engine): guard dedupe success by order state
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-92
- Priority: P1
- Iteration: 93
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`markSucceededByOrderId` is used by LIVE order exchange-event handling to mark
runtime DCA dedupe as complete after an exchange-confirmed fill. It currently
matches the dedupe row by `orderId` but does not verify the local order state
before writing `SUCCEEDED`.

## Goal
Ensure runtime execution dedupe can be marked successful by `orderId` only when
the linked order is confirmed active exchange truth: `status=FILLED` and
`syncState=IN_SYNC`.

## Scope
- `apps/api/src/modules/engine/runtimeExecutionDedupe.service.ts`
- `apps/api/src/modules/engine/runtimeExecutionDedupe.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Load the local order before completing dedupe by `orderId`.
2. Return `null` without mutating dedupe unless the order is `FILLED` and
   `IN_SYNC`.
3. Keep existing successful DCA fill behavior unchanged for valid orders.
4. Add focused tests for valid filled order and stale local orphan order.
5. Run focused tests, typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- `markSucceededByOrderId` updates dedupe for `FILLED` + `IN_SYNC` orders.
- `markSucceededByOrderId` does not update dedupe for `ORPHAN_LOCAL` orders.
- Existing caller contract remains `null` when no valid runtime dedupe success
  can be marked.
- Runtime lifecycle boundaries are not changed.

## Definition of Done
- [x] Implementation fits the runtime lifecycle boundary in architecture docs.
- [x] Focused tests cover valid and stale order-state behavior.
- [x] Relevant validation commands pass.
- [x] Context and planning docs are updated with evidence.

## Forbidden
- New dedupe systems or duplicate completion paths.
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
- Rollback note: revert this commit to restore previous dedupe success-by-order
  behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: dedupe success-by-order matches dedupe rows by `orderId` without
  validating the order state.
- Gaps: a stale or not-yet-filled order could mark runtime DCA dedupe as
  successful.
- Inconsistencies: active runtime/order truth requires synced state; this
  completion path did not enforce it.
- Architecture constraints: execution lifecycle cannot bypass order and
  exchange-confirmed state.

### 2. Select One Priority Task
- Selected task: guard runtime dedupe success-by-order with order status and
  sync state.
- Priority rationale: this path can mutate runtime DCA state after exchange
  events and must share the same active-truth contract.
- Why other candidates were deferred: broader order lifecycle reads remain for
  later; this is the smallest isolated completion-path fix.

### 3. Plan Implementation
- Files or surfaces to modify: runtime execution dedupe service, focused tests,
  planning/context docs.
- Logic: require order `status=FILLED` and `syncState=IN_SYNC` before updating
  dedupe to `SUCCEEDED`.
- Edge cases: missing order, unfilled order, and local orphan order return
  `null`.

### 4. Execute Implementation
- Implementation notes: `markSucceededByOrderId` now verifies the local order
  before dedupe mutation and returns `null` for missing, unfilled, or non-synced
  orders.

### 5. Verify and Test
- Validation performed: runtime execution dedupe suite, exchange-events suite,
  API typecheck, repository guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only check dedupe row status.
- Technical debt introduced: no
- Scalability assessment: reuses existing order state as source of truth.
- Refinements made: kept the caller contract as `null` when no valid success
  transition should happen.

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
- Task summary: dedupe success-by-order is now guarded by filled and synced
  order state.
- Files changed:
  `apps/api/src/modules/engine/runtimeExecutionDedupe.service.ts`,
  `apps/api/src/modules/engine/runtimeExecutionDedupe.service.test.ts`, and
  planning/context docs.
- How tested: runtime execution dedupe suite (`11/11`), exchange-events suite
  (`6/6`), API typecheck, repository guardrails, lint, and diff check.
- What is incomplete: none.
- Next steps: continue auditing remaining order lifecycle and dashboard parity
  paths for stale active-truth drift.
- Decisions made: `markSucceededByOrderId` returns `null` unless the linked
  local order is `FILLED` and `IN_SYNC`.
