# PMPLC-40 Exchange Missing Partial Fee Pending Task

## Header
- ID: PMPLC-40
- Title: fix(api-orders): keep pending when earlier partial fill fee is missing
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: PMPLC-39
- Priority: P0
- Iteration: PMPLC-40
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-39 prevented a partial exact fee from becoming final settled fee truth
when a later terminal fill arrived without fee. The inverse edge remained:
an earlier partial fill with missing fee could be followed by a terminal fill
that has exact fee only for the last fill, and the order could still clear
pending even though one child fill fee remained unresolved.

## Goal
Keep final LIVE fee reconciliation pending when any earlier exchange fill for
the order still lacks fee truth, even if the current terminal fill has exact
exchange fee.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- Canonical planning and context docs for PMPLC-40 closure evidence.

## Implementation Plan
1. Add a DB-backed regression for partial fill without fee followed by terminal
   fill with exact fee.
2. Confirm the regression fails before the service fix.
3. Check for unresolved existing fill fee rows excluding the current
   `exchangeTradeId` that can be backfilled by the current event.
4. Prevent accepted current-fill fee from clearing pending while unresolved
   earlier fill fees remain.
5. Run focused DB, runtime/order, typecheck, guardrails, lint, and diff checks.

## Acceptance Criteria
- Terminal current-fill fee is persisted as `EXCHANGE_FILL`.
- Earlier missing child fill fee keeps `Order.feePending=true`.
- Generated lifecycle trade also remains `feePending=true`.
- Final fill row is retained with its exact fee.
- Existing settled terminal drift recovery remains green.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations represented by focused regression,
  implementation, validation, self-review, and documentation evidence.
- [x] No temporary bypass, mock-only path, or parallel fee system introduced.
- [x] Money-impacting path has DB-backed evidence.

## Forbidden
- Clearing pending while any exchange fill row for the order still has
  `feeCost=null`.
- Downgrading accepted current-fill exchange fee to estimated.
- Blocking later known-fill fee backfill.
- Weakening PMPLC-39 final-fill pending behavior.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts -t "keeps fee pending when a final exact fee leaves an earlier partial fill without fee" --run` FAILED as expected: `feePending=false` instead of `true`.
  - Post-fix focused DB-backed regression PASS (`1/1`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run` PASS (`19/19`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` PASS (`24/24`).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run --sequence.concurrent=false` PASS (`102/102`).
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
- Rollback note: revert PMPLC-40 service/test/doc changes.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: accepted terminal current-fill fee cleared pending even when an older
  `OrderFill` still lacked fee truth.
- Gap: no DB-backed sequence covered missing partial fee followed by terminal
  exact fee.
- Architecture constraints: LIVE fee reconciliation stores final fee total and
  pending remains visible while any exchange fee data is delayed.

### 2. Select One Priority Task
- Selected task: PMPLC-40 missing partial fee pending guard.
- Priority rationale: direct LIVE money-reporting correctness and TESTER-mode
  adversarial edge coverage.
- Deferred: broader async retry/backfill scheduling remains separate.

### 3. Plan Implementation
- Files or surfaces to modify: exchange-event service, DB-backed service test,
  planning/context docs.
- Logic: current accepted fee cannot clear pending while earlier fill rows
  still have missing fee.
- Edge cases: known-fill backfill for the current trade id remains allowed.

### 4. Execute Implementation
- Implementation notes: service now checks unresolved existing fill fees while
  excluding the current `exchangeTradeId`, so the current event can still
  backfill its own row but cannot hide missing fees from other fills.

### 5. Verify and Test
- Validation performed: pre-fix failing DB regression, post-fix focused
  regression, full helper and DB suite, focused runtime/order pack, API
  typecheck, repository guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: keeping all terminal multi-fill exact fee rows
  pending forever; rejected because fully known current+prior fee aggregates
  should still settle.
- Technical debt introduced: no
- Scalability assessment: one scoped `findFirst` on existing order fills per
  exchange event; acceptable for this reconciliation boundary.
- Refinements made: current `exchangeTradeId` is excluded from the missing-fee
  check so same-fill backfill remains monotonic.

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
- Task summary: terminal current-fill fee no longer clears pending when an
  earlier partial exchange fill still lacks fee truth.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `docs/planning/position-management-exchange-missing-partial-fee-pending-task-2026-05-06.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- How tested: see Validation Evidence.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
