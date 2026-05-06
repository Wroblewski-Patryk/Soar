# PMPLC-41 Exchange Missing Partial Fee Backfill Task

## Header
- ID: PMPLC-41
- Title: fix(api-orders): settle lifecycle fee after missing partial fee backfill
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-40
- Priority: P0
- Iteration: PMPLC-41
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-40 kept final fee reconciliation pending when an earlier partial fill
still lacked fee truth. A follow-up check found that when the missing earlier
fee later arrived, `Order` and `OrderFill` rows settled correctly, but the
order-level lifecycle `Trade` could remain on the terminal fill's partial fee
because its `exchangeTradeId` did not match the earlier backfilled fill.

## Goal
When a missing partial fill fee is backfilled and the order fee total becomes
complete, settle the order-level lifecycle trade to the aggregate exchange fee
truth as well.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- Canonical planning and context docs for PMPLC-41 closure evidence.

## Implementation Plan
1. Add a DB-backed regression for partial fill without fee, terminal fill with
   fee, and later fee backfill for the first fill.
2. Confirm the regression fails before the service fix.
3. Update fee backfill propagation from current `exchangeTradeId` only to the
   unresolved order-level lifecycle trade.
4. Run focused DB, runtime/order, typecheck, guardrails, lint, and diff checks.
5. Sync canonical context and planning evidence.

## Acceptance Criteria
- Order fee total settles to the aggregate exchange fill fee.
- Both child fill rows retain exact fee truth.
- The lifecycle trade fee updates to the same aggregate exact fee total.
- The lifecycle trade clears `feePending`.
- Existing missing-fee pending guards from PMPLC-39/40 remain green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented by focused regression,
  implementation, validation, self-review, and documentation evidence.
- [x] No temporary bypass, mock-only path, or parallel fee system introduced.
- [x] Money-impacting path has DB-backed evidence.

## Forbidden
- Leaving lifecycle trade fee stale after order-level fee truth settles.
- Creating duplicate trade rows for backfill events.
- Downgrading exact exchange fee to estimated.
- Weakening PMPLC-40 pending behavior while earlier fill fees remain missing.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts -t "settles lifecycle trade fee when a missing earlier partial fee is backfilled" --run` FAILED as expected: lifecycle trade fee stayed `0.02` instead of aggregate `0.03`.
  - Post-fix focused DB-backed regression PASS (`1/1`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run` PASS (`20/20`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` PASS (`24/24`).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run --sequence.concurrent=false` PASS (`103/103`).
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
- Rollback note: revert PMPLC-41 service/test/doc changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: fee backfill updated the matching fill row and matching trade
  `exchangeTradeId`, but order-level lifecycle trades can use the terminal
  fill id while earlier partial fill fees are backfilled later.
- Gap: no DB-backed test covered lifecycle trade settlement after missing
  partial fee backfill.
- Architecture constraints: LIVE fee truth must remain monotonic and consistent
  across order, fills, and lifecycle trade reporting.

### 2. Select One Priority Task
- Selected task: PMPLC-41 lifecycle fee settlement after missing partial fee
  backfill.
- Priority rationale: direct money-reporting correctness for order history and
  lifecycle reporting.
- Deferred: broader reconciliation retry scheduling remains separate.

### 3. Plan Implementation
- Files or surfaces to modify: exchange-event service, DB-backed service test,
  planning/context docs.
- Logic: when backfilled fee completes order-level fee truth, update unresolved
  trade rows for the order, not only rows matching the backfilled fill
  `exchangeTradeId`.
- Edge cases: no duplicate trade creation, PMPLC-40 pending while missing fee
  remains unresolved.

### 4. Execute Implementation
- Implementation notes: backfill trade propagation now updates unresolved
  trades by `orderId` with `fee=null`, `feeSource=ESTIMATED`, or
  `feePending=true`, using the aggregate exchange fee.

### 5. Verify and Test
- Validation performed: pre-fix failing DB regression, post-fix focused
  regression, full helper and DB suite, focused runtime/order pack, API
  typecheck, repository guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: updating only the matching partial-fill trade;
  rejected because partial fill events do not create lifecycle trades.
- Technical debt introduced: no
- Scalability assessment: update remains scoped by `orderId` and unresolved
  fee predicates.
- Refinements made: existing predicates prevent rewriting already-settled
  exact-fee trades.

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
- Task summary: missing partial fee backfill now settles the order-level
  lifecycle trade to the aggregate exchange fee and clears its pending flag.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `docs/planning/position-management-exchange-missing-partial-fee-backfill-task-2026-05-06.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: see Validation Evidence.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
