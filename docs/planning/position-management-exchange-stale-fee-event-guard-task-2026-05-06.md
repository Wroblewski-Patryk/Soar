# PMPLC-32 Exchange Stale Fee Event Guard Task

## Header
- ID: PMPLC-32
- Title: fix(api-orders): ignore stale terminal fee events for unknown fills
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-31
- Priority: P0
- Iteration: PMPLC-32
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-31 correctly allowed a later finite exchange fee to backfill an already
recorded fill with missing fee truth. The adjacent risk was accepting a stale
terminal event with a new, unknown `exchangeTradeId` and no local fill progress
as if it were valid fee truth.

## Goal
Preserve PMPLC-31 fee backfill for known fills while preventing stale terminal
events for unknown fills from changing `Order.fee` or creating fee drift.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- Canonical planning and context docs for PMPLC-32 closure evidence.

## Implementation Plan
1. Add a DB-backed regression where a filled order receives a terminal duplicate
   with a new `exchangeTradeId`, no fill progress, and a higher fee.
2. Confirm pre-fix failure and record the money-impacting drift.
3. Restrict fee-only refresh to known `OrderFill` rows whose fee is missing.
4. Re-run DB-backed exchange-event suite, focused runtime/order pack, and repo
   validation gates.
5. Update context and planning truth.

## Acceptance Criteria
- Known missing-fee fills can still be backfilled.
- Unknown stale terminal fills cannot increase order fee without local fill
  progress.
- No duplicate `OrderFill` or `Trade` rows are created.
- Terminal lifecycle idempotency remains intact.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented by focused regression,
  implementation, validation, self-review, and documentation evidence.
- [x] No temporary bypass, mock-only path, or parallel fee system introduced.
- [x] Money-impacting path has DB-backed fail-closed/idempotency evidence.

## Forbidden
- Accepting fee truth from an unknown fill without local fill progress.
- Reversing PMPLC-31 known-fill fee backfill.
- Weakening terminal event lifecycle idempotency.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts -t "keeps stale terminal fee events" --run` FAILED as expected: order fee became `0.13` instead of staying `0.04`.
  - Post-fix same focused regression PASS (`1/1`)
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run` PASS (`13/13`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`86/86`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS with existing CRLF warnings only
- Manual checks: Local Postgres-backed exchange-event suite executed.
- Screenshots/logs: not applicable.
- High-risk checks: stale terminal fee event cannot mutate settled order fee
  when its `exchangeTradeId` has no recorded fill.

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
- Rollback note: revert PMPLC-32 service/test/doc changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: PMPLC-31 fee-only refresh could accept a stale terminal event with an
  unknown trade id and no fill progress.
- Gap: idempotent retries needed a stricter boundary between known-fill fee
  backfill and unknown-fill fee accumulation.
- Architecture constraints: fee updates are monotonic in quality and idempotent
  per order/trade.

### 2. Select One Priority Task
- Selected task: PMPLC-32 stale terminal fee guard.
- Priority rationale: direct LIVE money-impacting fee drift.
- Deferred: broader fee reconciliation observability remains separate.

### 3. Plan Implementation
- Files or surfaces to modify: exchange-event service and DB-backed test.
- Logic: allow fee-only refresh only when the current `exchangeTradeId` already
  maps to a local fill with missing fee.
- Edge cases: terminal duplicate with unknown trade id, no fill progress, and
  finite fee.

### 4. Execute Implementation
- Implementation notes: narrowed `shouldRefreshFeeDetails` so unknown fills do
  not qualify for fee-only refresh.

### 5. Verify and Test
- Validation performed: pre-fix failing regression, post-fix focused
  regression, full DB-backed exchange-event suite, focused runtime/order pack,
  API typecheck, repository guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: disabling all terminal fee-only refresh; rejected
  because it would break PMPLC-31 known-fill backfill.
- Technical debt introduced: no
- Scalability assessment: no new queries; only stricter use of the existing
  scoped fill lookup.
- Refinements made: retained PMPLC-31 behavior for known fills only.

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
- Task summary: stale terminal fee events for unknown fills no longer mutate
  settled order fee; known missing-fee fill backfill remains supported.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `docs/planning/position-management-exchange-stale-fee-event-guard-task-2026-05-06.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: see Validation Evidence.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
