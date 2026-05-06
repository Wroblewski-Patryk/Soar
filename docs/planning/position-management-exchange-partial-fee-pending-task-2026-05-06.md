# PMPLC-38 Exchange Partial Fee Pending Task

## Header
- ID: PMPLC-38
- Title: fix(api-orders): keep fee pending for partial exchange fills
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-37
- Priority: P0
- Iteration: PMPLC-38
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-37 recovered settled exact exchange-fee rows from local pending drift.
A follow-up adversarial check found the opposite edge: a non-terminal
`PARTIALLY_FILLED` order with an accepted exact fill fee could clear
`feePending=false` before the final order fee total was knowable.

## Goal
Keep LIVE fee reconciliation visibly pending while an order is only partially
filled, even when the current fill already has exact exchange fee truth.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- Canonical planning and context docs for PMPLC-38 closure evidence.

## Implementation Plan
1. Add a pure helper regression for accepted exact fee on a non-terminal
   partial fill.
2. Add a DB-backed exchange-event regression for a partial fill with exact fee.
3. Confirm both regressions fail before the helper fix.
4. Require terminal `FILLED` status before exact fee truth clears pending.
5. Run focused DB, runtime/order, typecheck, guardrails, lint, and diff checks.

## Acceptance Criteria
- Partial exchange fills keep `feePending=true`.
- Exact current-fill fee is still persisted as `EXCHANGE_FILL`.
- No position lifecycle trade is created for the partial fill.
- Terminal filled exact-fee behavior from PMPLC-37 remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented by focused regression,
  implementation, validation, self-review, and documentation evidence.
- [x] No temporary bypass, mock-only path, or parallel fee system introduced.
- [x] Money-impacting path has pure helper and DB-backed evidence.

## Forbidden
- Clearing final fee reconciliation pending before terminal fill.
- Downgrading accepted exchange fill fee to estimated.
- Creating lifecycle trade rows for partial fills.
- Weakening settled exact-fee pending recovery from PMPLC-37.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts -t "keeps pending while an accepted exchange fee" --run` FAILED as expected: `feePending=false` instead of `true`.
  - Pre-fix `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts -t "keeps fee pending while exact exchange fee belongs only to a partial fill" --run` FAILED as expected: `feePending=false` instead of `true`.
  - Post-fix focused helper regression PASS (`1/1`).
  - Post-fix focused DB-backed service regression PASS (`1/1`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` PASS (`24/24`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run` PASS (`17/17`).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`100/100`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with existing CRLF warnings only.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/live-fee-reconciliation-contract.md`,
  `docs/architecture/06_execution-lifecycle.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert PMPLC-38 helper/test/doc changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: accepted exact fee on a partial fill could clear final fee pending.
- Gap: helper coverage did not distinguish exact current-fill fee from final
  terminal order fee truth.
- Architecture constraints: LIVE stores final fee total and uses pending state
  while reconciliation is not final.

### 2. Select One Priority Task
- Selected task: PMPLC-38 partial fill fee pending guard.
- Priority rationale: direct LIVE fee visibility and money-impacting reporting
  correctness.
- Deferred: unrelated fee display and exchange retry audits remain separate.

### 3. Plan Implementation
- Files or surfaces to modify: fee helper, helper tests, DB-backed service test.
- Logic: exact fee clears pending only when persisted status is terminal
  `FILLED`.
- Edge cases: partial exact fee versus terminal exact fee and settled drift.

### 4. Execute Implementation
- Implementation notes: `resolveExchangeFeePendingDecision` now gates both
  accepted and already-settled exact fee clearing by terminal `FILLED` status.

### 5. Verify and Test
- Validation performed: pre-fix failing helper and DB-backed regressions,
  post-fix focused regressions, full helper and DB suite, focused runtime/order
  pack, API typecheck, repository guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: service-only override; rejected because the
  incorrect behavior belonged to the pure fee-pending decision boundary.
- Technical debt introduced: no
- Scalability assessment: no DB/runtime cost change.
- Refinements made: DB test locks persistence, child fill, and no-trade
  behavior for the partial case.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence, MVP plan, next-commits queue.
- Context updated: project state and task board.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: non-terminal partial exchange fills now keep final fee
  reconciliation pending while preserving exact current-fill fee truth.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `docs/planning/position-management-exchange-partial-fee-pending-task-2026-05-06.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: see Validation Evidence.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
