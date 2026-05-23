# PMPLC-39 Exchange Final Fee Pending Task

## Header
- ID: PMPLC-39
- Title: fix(api-orders): keep final fill pending after partial fee truth
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-38
- Priority: P0
- Iteration: PMPLC-39
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-38 made non-terminal partial fills keep `feePending=true` even when the
current fill has exact exchange fee truth. A follow-up architecture check found
that a later terminal `FILLED` event without fee could still treat the existing
partial `EXCHANGE_FILL` fee as final settled order-fee truth.

## Goal
Prevent partial exchange fee truth from being promoted to final settled fee
truth when the terminal fill event arrives without fee data.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `.codex/context/LEARNING_JOURNAL.md`
- Canonical planning and context docs for PMPLC-39 closure evidence.

## Implementation Plan
1. Add a DB-backed regression for partial exact fee followed by final fill
   without fee.
2. Confirm the regression fails before the service fix.
3. Tighten service-level `hasSettledExchangeFee` so only already-terminal
   orders can treat existing exact exchange fee as final settled truth.
4. Run focused DB, runtime/order, typecheck, guardrails, lint, and diff checks.
5. Record the confirmed DB-backed parallel-test pitfall update.

## Acceptance Criteria
- A final fill without fee after partial exact fee keeps `feePending=true`.
- Existing partial exact fee remains persisted as `EXCHANGE_FILL`.
- The final fill row is retained with missing fee for later backfill.
- Lifecycle trade stays fee-pending until complete fee truth arrives.
- PMPLC-37 settled-terminal drift recovery remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented by focused regression,
  implementation, validation, self-review, and documentation evidence.
- [x] No temporary bypass, mock-only path, or parallel fee system introduced.
- [x] Money-impacting path has DB-backed evidence.

## Forbidden
- Treating partial `EXCHANGE_FILL` fee as final total when the order was not
  already terminal.
- Downgrading known partial exchange fee to estimated.
- Dropping the final fill row when its fee is delayed.
- Weakening terminal settled-fee pending recovery from PMPLC-37.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts -t "keeps fee pending when a final fill arrives without fee after a partial exact fee" --run` FAILED as expected: `feePending=false` instead of `true`.
  - Post-fix focused DB-backed regression PASS (`1/1`) when rerun sequentially.
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` PASS (`24/24`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run` PASS (`18/18`).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run --sequence.concurrent=false` PASS (`101/101`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with existing CRLF warnings only.
- Test hygiene note:
  - A focused DB case run in parallel with the same full DB-backed file produced
    a false empty-fill assertion. The case passed when rerun sequentially; the
    existing learning journal guardrail was updated.

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
- Rollback note: revert PMPLC-39 service/test/doc changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: service-level settled-fee detection treated any finite
  `EXCHANGE_FILL` fee as final, including partial-fill fee truth.
- Gap: no DB-backed test covered partial exact fee followed by a terminal event
  with delayed fee.
- Architecture constraints: LIVE fee reconciliation stores final fee total and
  keeps pending visible while exchange fee data is delayed.

### 2. Select One Priority Task
- Selected task: PMPLC-39 final fee pending after partial fee truth.
- Priority rationale: direct LIVE money-reporting correctness and architecture
  finality semantics.
- Deferred: broader async fee retry/backfill audits remain separate.

### 3. Plan Implementation
- Files or surfaces to modify: exchange-event service, DB-backed service test,
  learning journal, planning/context docs.
- Logic: existing exact exchange fee is final-settled only when the order was
  already terminal before the incoming event.
- Edge cases: terminal drift recovery versus partial fee followed by delayed
  final fee.

### 4. Execute Implementation
- Implementation notes: `hasSettledExchangeFee` now includes
  `existingOrder.status === 'FILLED'`, preventing partial rows from being used
  as final settled fee truth for a later terminal event without fee.

### 5. Verify and Test
- Validation performed: pre-fix failing DB regression, post-fix focused
  regression, full helper and DB suite, focused runtime/order pack, API
  typecheck, repository guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: changing the pure helper to infer finality from
  `existingFeePending`; rejected because PMPLC-37 intentionally recovers
  drifted terminal settled rows where `feePending=true`.
- Technical debt introduced: no
- Scalability assessment: no DB/runtime cost change.
- Refinements made: final-settled semantics now remain in the service where
  prior persisted status is available.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence, MVP plan, next-commits queue.
- Context updated: project state, task board, learning journal.
- Learning journal updated: DB-backed parallel validation pitfall reconfirmed.

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
- Task summary: final fill events without fee no longer clear pending when the
  only existing exact exchange fee came from earlier partial fill truth.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `.codex/context/LEARNING_JOURNAL.md`
  - `history/tasks/position-management-exchange-final-fee-pending-task-2026-05-06.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: see Validation Evidence.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
