# PMPLC-31 Exchange Fill Fee Backfill Task

## Header
- ID: PMPLC-31
- Title: fix(api-orders): backfill missing exchange fill fee truth
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-30
- Priority: P0
- Iteration: PMPLC-31
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-30 made exchange fee aggregation total-fee based across partial fills.
The next money-impacting gap was a retry or later exchange event for an already
recorded `exchangeTradeId` where the original `OrderFill` and lifecycle
`Trade` had no finite fee yet.

## Goal
Allow the existing exchange-event reconciliation path to monotonically upgrade
fee truth from unresolved or estimated to `EXCHANGE_FILL` for the same
`exchangeTradeId`, without duplicating fills, trades, or position lifecycle.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- Canonical planning and context docs for PMPLC-31 closure evidence.

## Implementation Plan
1. Add a DB-backed regression for terminal duplicate fee backfill.
2. Reuse existing `OrderFill` lookup and fee aggregation, selecting current
   `feeCost` to distinguish duplicate settled fee from missing fee truth.
3. Permit fee-only refresh when the current fill has no finite fee and the
   incoming event has recordable finite fee.
4. Backfill the existing `OrderFill` and unresolved lifecycle `Trade` for the
   same `exchangeTradeId`.
5. Run focused DB, runtime/order, typecheck, guardrails, lint, and diff checks.

## Acceptance Criteria
- Already recorded fills are not duplicated.
- Missing `OrderFill.feeCost` is backfilled from later exchange fee truth.
- Existing unresolved lifecycle trade fee is upgraded to `EXCHANGE_FILL`.
- Terminal order idempotency still blocks lifecycle reapplication.
- Relevant validation passes with local Postgres.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented by focused regression,
  implementation, validation, self-review, and documentation evidence.
- [x] No temporary bypass, mock-only path, or parallel fee system introduced.
- [x] Money-impacting path has DB-backed fail-closed/idempotency evidence.

## Forbidden
- Creating a second exchange reconciliation path.
- Duplicating fill or trade rows for a fee-only retry.
- Weakening stale terminal-event idempotency for price, quantity, or lifecycle.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts -t "backfills missing fee truth" --run` PASS (`1/1`)
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run` PASS (`12/12`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`85/85`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS with existing CRLF warnings only
- Manual checks: Local Postgres-backed exchange-event suite executed.
- Screenshots/logs: not applicable.
- High-risk checks: terminal duplicate fee backfill updates fee truth without
  duplicate fills/trades or lifecycle reapplication.

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
- Rollback note: revert PMPLC-31 service/test/doc changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: `exchangeTradeId` dedupe treated an existing fill as fully settled
  even when `feeCost` was still missing.
- Gap: late fee truth could leave order, fill, and trade fee fields unresolved.
- Architecture constraints: fee quality may improve monotonically; stale
  terminal events must not reapply lifecycle.

### 2. Select One Priority Task
- Selected task: PMPLC-31 fee backfill for already recorded exchange fills.
- Priority rationale: money-impacting LIVE fee reconciliation and v1 readiness.
- Deferred: broader fee observability and UI surfacing remain separate slices.

### 3. Plan Implementation
- Files or surfaces to modify: exchange-event service and DB-backed test.
- Logic: distinguish existing fill with fee from existing fill without fee.
- Edge cases: terminal duplicate events, no duplicate fills/trades, estimated
  trade fee upgrade only.

### 4. Execute Implementation
- Implementation notes: reused the existing recordable fill decision and
  aggregation path; added fee-only refresh and unresolved trade backfill.

### 5. Verify and Test
- Validation performed: focused regression, full exchange-event suite, focused
  runtime/order pack, typecheck, guardrails, lint, diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: only updating `Order.fee`; rejected because it
  would leave `OrderFill` and `Trade` out of sync.
- Technical debt introduced: no
- Scalability assessment: one targeted lookup/update on an already scoped
  exchange event; no broad scans added beyond existing order-scoped aggregate.
- Refinements made: fee-only refresh does not loosen quantity, price, or
  lifecycle terminal idempotency.

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
- Task summary: exchange order-trade reconciliation now backfills missing fee
  truth for an existing fill/trade when the exchange later sends finite fee for
  the same `exchangeTradeId`.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `history/tasks/position-management-exchange-fill-fee-backfill-task-2026-05-06.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: see Validation Evidence.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
