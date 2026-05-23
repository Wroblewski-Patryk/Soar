# PMPLC-37 Exchange Settled Fee Pending Recovery Task

## Header
- ID: PMPLC-37
- Title: fix(api-orders): clear pending drift when exchange fee is settled
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-36
- Priority: P0
- Iteration: PMPLC-37
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-36 centralized the fee-pending decision. A helper-level adversarial check
found that already-settled `EXCHANGE_FILL` fee truth still preserved local
`feePending=true` drift.

## Goal
Ensure exact exchange fee truth always clears pending reconciliation, even when
local rows previously drifted to `feePending=true`.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- Canonical planning and context docs for PMPLC-37 closure evidence.

## Implementation Plan
1. Add a pure helper regression for `hasSettledExchangeFee=true` and
   `existingFeePending=true`.
2. Confirm pre-fix helper failure.
3. Give settled exact fee truth precedence over existing pending drift.
4. Add DB-backed service regression for a settled order with drifted pending.
5. Run focused DB, runtime/order, typecheck, guardrails, lint, and diff checks.

## Acceptance Criteria
- Settled `EXCHANGE_FILL` fee clears pending drift.
- Rejected unresolved fee still keeps/recover pending truth.
- No new fill/trade rows are created for stale settled checks.
- PMPLC-34/35 behavior remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented by focused regression,
  implementation, validation, self-review, and documentation evidence.
- [x] No temporary bypass, mock-only path, or parallel fee system introduced.
- [x] Money-impacting path has pure helper and DB-backed evidence.

## Forbidden
- Reopening pending for exact settled exchange fee.
- Downgrading `EXCHANGE_FILL` to `ESTIMATED`.
- Weakening rejected-fee pending recovery.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts -t "recovers false pending" --run` FAILED as expected: `feePending=true` instead of `false`.
  - Post-fix focused helper regression PASS (`1/1`)
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts -t "clears drifted fee pending" --run` PASS (`1/1`)
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` PASS (`23/23`)
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run` PASS (`16/16`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`98/98`)
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
- Rollback note: revert PMPLC-37 helper/test/doc changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: exact exchange fee truth did not override existing pending drift.
- Gap: helper coverage missed `hasSettledExchangeFee=true` with
  `existingFeePending=true`.
- Architecture constraints: exact exchange fill data must clear pending.

### 2. Select One Priority Task
- Selected task: PMPLC-37 settled fee pending recovery.
- Priority rationale: direct LIVE fee reconciliation correctness.
- Deferred: unrelated fee display and reporting audits remain separate.

### 3. Plan Implementation
- Files or surfaces to modify: fee helper, helper tests, DB-backed service test.
- Logic: settled exact fee returns `feePending=false`.
- Edge cases: settled exact drift versus unresolved rejected fee.

### 4. Execute Implementation
- Implementation notes: settled exact fee now short-circuits pending decision
  before existing pending is preserved.

### 5. Verify and Test
- Validation performed: pre-fix failing helper regression, post-fix helper and
  DB-backed regression, full focused runtime/order pack, API typecheck,
  repository guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: service-only DB patch; rejected because the bug was
  in the pure decision boundary.
- Technical debt introduced: no
- Scalability assessment: no DB/runtime cost change.
- Refinements made: DB service test locks actual persistence behavior.

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
- Task summary: settled exact exchange fee truth now clears local
  `feePending=true` drift in the pure helper and DB-backed service path.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `history/tasks/position-management-exchange-settled-fee-pending-recovery-task-2026-05-06.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: see Validation Evidence.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
