# PMPLC-34 Exchange Stale Fee Pending Guard Task

## Header
- ID: PMPLC-34
- Title: fix(api-orders): keep fee pending when stale unknown fee is rejected
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-33
- Priority: P0
- Iteration: PMPLC-34
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-32 blocked stale terminal fee events for unknown fills from changing
settled fee amounts. The adjacent unresolved-fee case still needed a guard:
when such an event is rejected, it must not clear `feePending`.

## Goal
Keep unresolved LIVE fee reconciliation visible when a finite fee from a stale
unknown `exchangeTradeId` is rejected by the fee refresh decision.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- Canonical planning and context docs for PMPLC-34 closure evidence.

## Implementation Plan
1. Add a DB-backed regression for an `ESTIMATED + feePending=true` filled order
   receiving finite fee from an unknown stale exchange fill.
2. Confirm pre-fix failure where `feePending` incorrectly clears.
3. Clear `feePending` only when recordable fee truth is actually accepted by
   the fee refresh decision.
4. Run focused DB, runtime/order, typecheck, guardrails, lint, and diff checks.
5. Update context and planning truth.

## Acceptance Criteria
- Rejected stale unknown fee does not change `Order.fee`.
- Rejected stale unknown fee does not change `Order.feeSource`.
- Rejected stale unknown fee keeps `Order.feePending=true`.
- No duplicate fill or trade rows are created.
- Known-fill fee backfill still clears pending when exact fee is accepted.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented by focused regression,
  implementation, validation, self-review, and documentation evidence.
- [x] No temporary bypass, mock-only path, or parallel fee system introduced.
- [x] Money-impacting path has DB-backed fail-closed/idempotency evidence.

## Forbidden
- Clearing pending reconciliation for rejected fee truth.
- Accepting unknown-fill fee without local fill progress.
- Weakening PMPLC-31 known-fill fee backfill.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts -t "keeps fee pending" --run` FAILED as expected: `feePending=false` instead of `true`.
  - Post-fix same focused regression PASS (`1/1`)
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run` PASS (`14/14`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`91/91`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS with existing CRLF warnings only
- Manual checks: Local Postgres-backed exchange-event suite executed.
- Screenshots/logs: not applicable.
- High-risk checks: rejected fee truth cannot hide unresolved fee reconciliation.

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
- Rollback note: revert PMPLC-34 service/test/doc changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: rejected stale unknown fee could still clear `feePending`.
- Gap: fee acceptance and pending clearance were not tied to the same decision.
- Architecture constraints: exact fee clears pending only once exchange fill
  truth is accepted; rejected truth keeps reconciliation visible.

### 2. Select One Priority Task
- Selected task: PMPLC-34 stale fee pending guard.
- Priority rationale: direct LIVE money-impacting reconciliation visibility.
- Deferred: broader UI/history fee display audits remain separate.

### 3. Plan Implementation
- Files or surfaces to modify: exchange-event service and DB-backed test.
- Logic: require `feeRefreshDecision.shouldRefreshFeeDetails` before clearing
  pending from a finite event fee.
- Edge cases: terminal duplicate, unknown trade id, estimated pending order.

### 4. Execute Implementation
- Implementation notes: aligned pending clearance with accepted fee refresh.

### 5. Verify and Test
- Validation performed: pre-fix failing regression, post-fix focused
  regression, full DB-backed exchange-event suite, focused runtime/order pack,
  API typecheck, repository guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: recomputing `shouldKeepFeePending` from raw event
  fee; rejected because raw fee can be rejected by the refresh guard.
- Technical debt introduced: no
- Scalability assessment: no new DB queries.
- Refinements made: pending truth now follows the existing fee refresh helper.

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
- Task summary: rejected stale unknown exchange-fill fee no longer clears
  unresolved fee reconciliation state.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `history/tasks/position-management-exchange-stale-fee-pending-guard-task-2026-05-06.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: see Validation Evidence.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
