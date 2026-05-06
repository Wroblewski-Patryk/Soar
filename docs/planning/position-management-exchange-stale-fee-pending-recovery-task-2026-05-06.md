# PMPLC-35 Exchange Stale Fee Pending Recovery Task

## Header
- ID: PMPLC-35
- Title: fix(api-orders): recover pending truth when rejected fee leaves estimate unresolved
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: PMPLC-34
- Priority: P0
- Iteration: PMPLC-35
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-34 kept `feePending=true` when a stale unknown exchange fee was rejected.
The remaining adversarial case was local drift where the same unresolved
estimated order/trade already had `feePending=false`.

## Goal
Recover pending reconciliation truth on both `Order` and existing estimated
`Trade` rows when a finite event fee is rejected by the fee refresh decision.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- Canonical planning and context docs for PMPLC-35 closure evidence.

## Implementation Plan
1. Add a DB-backed regression for stale unknown fee rejected after local
   `feePending=false` drift.
2. Confirm pre-fix failure on `Order`/`Trade` pending recovery.
3. Base `shouldKeepFeePending` on accepted fee truth rather than raw event fee.
4. Restore pending truth on existing estimated lifecycle trades for the order.
5. Run focused DB, runtime/order, typecheck, guardrails, lint, and diff checks.

## Acceptance Criteria
- Rejected unknown fee does not mutate fee amount/source.
- Unsettled estimated order recovers `feePending=true`.
- Existing estimated trade for the order recovers `feePending=true`.
- Settled `EXCHANGE_FILL` rows are not downgraded.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented by focused regression,
  implementation, validation, self-review, and documentation evidence.
- [x] No temporary bypass, mock-only path, or parallel fee system introduced.
- [x] Money-impacting path has DB-backed fail-closed/idempotency evidence.

## Forbidden
- Treating rejected raw event fee as settled fee truth.
- Downgrading settled `EXCHANGE_FILL` rows.
- Hiding unresolved LIVE fee reconciliation.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts -t "restores fee pending when stale unknown" --run` FAILED as expected: `feePending=false` instead of `true`.
  - Post-fix same focused regression PASS (`1/1`)
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run` PASS (`15/15`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`92/92`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS with existing CRLF warnings only

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
- Rollback note: revert PMPLC-35 service/test/doc changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: pending recovery still treated raw rejected event fee as enough to
  suppress `feePending`.
- Gap: estimated lifecycle trade pending state could remain hidden after local
  drift.
- Architecture constraints: only accepted exact exchange fee clears pending.

### 2. Select One Priority Task
- Selected task: PMPLC-35 stale rejected fee pending recovery.
- Priority rationale: TESTER-mode adversarial check on money-impacting LIVE fee
  reconciliation.
- Deferred: broader fee UI/history audits remain separate slices.

### 3. Plan Implementation
- Files or surfaces to modify: exchange-event service and DB-backed test.
- Logic: compute accepted event fee separately and restore estimated trade
  pending when fee remains unresolved.
- Edge cases: rejected unknown trade id, settled exact fee, drifted pending.

### 4. Execute Implementation
- Implementation notes: pending truth now follows accepted fee refresh, and
  estimated trade rows are restored when unresolved.

### 5. Verify and Test
- Validation performed: pre-fix failing regression, post-fix focused
  regression, full DB-backed exchange-event suite, focused runtime/order pack,
  API typecheck, repository guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: only updating order pending; rejected because
  lifecycle trade history would remain inconsistent.
- Technical debt introduced: no
- Scalability assessment: one order-scoped `updateMany` only when fee remains
  pending.
- Refinements made: settled `EXCHANGE_FILL` trades are excluded.

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
- Task summary: rejected stale unknown event fees now recover pending truth for
  unresolved estimated orders and lifecycle trades after local drift.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `docs/planning/position-management-exchange-stale-fee-pending-recovery-task-2026-05-06.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: see Validation Evidence.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
