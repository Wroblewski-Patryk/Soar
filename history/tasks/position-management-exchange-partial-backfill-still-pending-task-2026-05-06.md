# Task

## Header
- ID: PMPLC-43
- Title: Keep fee pending after incomplete partial fee backfill
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-42
- Priority: P0
- Iteration: 43
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Exchange fee backfill can arrive one fill at a time. After an order has reached
`FILLED`, a delayed fee for one known `OrderFill` may still leave another
partial fill with `feeCost=null`. That state must remain operator-visible as
pending reconciliation.

## Goal
Prevent incomplete partial-fee backfill from clearing `feePending` on the order
or lifecycle trade while any other known fill for that order still lacks fee
truth.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.feeBackfill.test.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- planning and context source-of-truth files

## Success Signal
- User or operator problem: order and trade fee pending could appear settled
  while a known partial fill still had no exchange fee.
- Expected product or reliability outcome: aggregate known fee can update
  monotonically while final reconciliation remains pending until all known
  fills have fee truth.
- How success will be observed: DB-backed regression covers three partial
  fills, one existing exact fee, one newly backfilled fee, and one remaining
  missing fee.
- Post-launch learning needed: no

## Deliverable For This Stage
Post-release evidence that PMPLC-43 is implemented, verified, reviewed, and
documented.

## Constraints
- Use the existing exchange-event fee backfill path.
- Do not introduce a second reconciliation system.
- Do not hide unresolved `OrderFill.feeCost=null` rows behind settled fee state.
- Preserve PMPLC-37 settled-fee drift recovery when no known fill remains
  unresolved.

## Acceptance Criteria
- Backfilling one known missing partial fee updates aggregate `Order.fee`.
- If another known `OrderFill.feeCost` remains `null`, `Order.feePending`
  remains `true`.
- Lifecycle `Trade.fee` receives the updated aggregate known fee while
  `Trade.feePending` remains `true`.
- Existing fee reconciliation and runtime/order regressions remain green.

## Definition of Done
- [x] Regression fails before the fix and passes after it.
- [x] Existing architecture path is reused.
- [x] Relevant validations pass.
- [x] Source-of-truth documentation is updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New systems without approval.
- Temporary bypasses or fake settled fee truth.
- Duplicated fee reconciliation logic.
- Clearing pending while a known fill fee remains missing.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts -t "keeps fee pending when a partial fee backfill leaves another fill unresolved" --run --sequence.concurrent=false` FAILED as expected: `Order.feePending=false` while another fill remained unresolved.
  - Post-fix focused regression PASS (`1/1`), then moved to `orders.exchangeEvents.feeBackfill.test.ts` to stay inside file-size guardrails.
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.feeBackfill.test.ts --run --sequence.concurrent=false` PASS (`1/1`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run --sequence.concurrent=false` PASS (`21/21`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts --run --sequence.concurrent=false` PASS (`24/24`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.feeBackfill.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run --sequence.concurrent=false` PASS (`105/105`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Manual checks: reviewed diff for finality logic and PMPLC-37 compatibility.
- Screenshots/logs: not applicable.
- High-risk checks: money-impacting fee visibility regression included.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/modules/system-modules.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the PMPLC-43 commit to restore prior fee-pending behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `hasSettledExchangeFee` treated any finite exchange fee on a filled
  order as settled even when another known `OrderFill` still had no fee.
- Gaps: no regression covered multiple unresolved partial fill fees where only
  one missing fee was backfilled.
- Inconsistencies: order and trade aggregate fee could update to known partial
  truth while pending visibility falsely cleared.
- Architecture constraints: exchange-event reconciliation owns LIVE fee truth;
  known fill rows are the local audit trail for per-fill fee completeness.

### 2. Select One Priority Task
- Selected task: PMPLC-43 incomplete partial-fee backfill pending guard.
- Priority rationale: hiding unresolved exchange fees is P0 for financial
  correctness and operator trust.
- Why other candidates were deferred: broader reporting or UI work depends on
  persisted fee truth being correct first.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `orders.exchangeEvents.service.ts`
  - `orders.exchangeEvents.feeBackfill.test.ts`
  - source-of-truth docs
- Logic: require no other unresolved known fill fee before treating existing
  exchange fee as settled, and propagate the computed pending decision when a
  lifecycle trade fee is updated during backfill.
- Edge cases: preserve settled-fee pending recovery when no unresolved known
  fill remains; keep aggregate known fee monotonic even while pending stays
  open.

### 4. Execute Implementation
- Implementation notes: `hasSettledExchangeFee` now requires
  `unresolvedExistingFillFee == null`; trade fee backfill writes
  `feePendingDecision.feePending` instead of unconditional `false`.

### 5. Verify and Test
- Validation performed: focused regression, full exchange-event suite, helper
  suite, focused runtime/order pack, API typecheck, guardrails, lint, and diff
  check.
- Result: all post-fix validations passed.

### 6. Self-Review
- Simpler option considered: force all backfilled lifecycle trades to pending
  until every fill is known. Rejected because PMPLC-37 needs settled exact fee
  drift recovery when no known unresolved fill exists.
- Technical debt introduced: no
- Scalability assessment: the check uses the existing known-fill audit rows and
  remains bounded to the current order.
- Refinements made: moved the new regression into a dedicated fee-backfill test
  file after guardrails caught the service test file-size budget.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task evidence
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/LEARNING_JOURNAL.md`
- Learning journal updated: yes.

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
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
PMPLC-43 is DONE. Exchange-event fee backfill now keeps fee reconciliation
pending while any other known partial fill still lacks fee truth, while still
allowing aggregate known fee to update monotonically.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: yes, no schema change
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: regression replays exchange events through
  persisted DB state
- Regression check performed: yes

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: trading and account-derived financial data
- Trust boundaries: external exchange events entering local persistence
- Permission or ownership checks: updates are scoped by `userId` and `orderId`
- Abuse cases: delayed partial fee must not falsely mark reconciliation settled
- Secret handling: no secret changes
- Security tests or scans: not applicable beyond scoped DB tests
- Fail-closed behavior: unresolved known fill fee keeps pending visible
- Residual risk: none identified for the selected slice
