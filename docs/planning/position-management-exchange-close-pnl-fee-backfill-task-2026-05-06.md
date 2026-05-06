# Task

## Header
- ID: PMPLC-42
- Title: Refresh close PnL after missing partial close fee backfill
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-41
- Priority: P0
- Iteration: 42
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-41 settled delayed partial-fill exchange fees across `Order`,
`OrderFill`, and lifecycle `Trade` fee fields. A remaining money-impacting
drift existed for close orders: the lifecycle close `Trade.realizedPnl` and
`Position.realizedPnl` were calculated when the position closed, but were not
refreshed when an earlier missing partial close fee was later backfilled.

## Goal
Keep close-order realized PnL aligned with final exchange fee truth after a
known missing partial close fee is backfilled.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- planning and context source-of-truth files

## Success Signal
- User or operator problem: closed-position PnL can remain overstated after a
  delayed exchange close fee arrives.
- Expected product or reliability outcome: settled order fee, close trade PnL,
  and position PnL converge to the same fee-adjusted money truth.
- How success will be observed: DB-backed regression covers partial close fill
  without fee, terminal close fill with partial fee, and later backfill of the
  missing fee.
- Post-launch learning needed: no

## Deliverable For This Stage
Post-release evidence that PMPLC-42 is implemented, verified, reviewed, and
documented.

## Constraints
- Use existing exchange-event fee backfill and close-PnL calculation paths.
- Do not reapply close lifecycle or create duplicate trades.
- Do not introduce workaround reconciliation paths.
- Keep the fix scoped to known fee backfill for close lifecycle trades.

## Acceptance Criteria
- A delayed fee for an already recorded close `OrderFill` updates aggregate
  order fee and lifecycle trade fee.
- Close lifecycle `Trade.realizedPnl` is recalculated with the final exit fee.
- Closed `Position.realizedPnl` is recalculated with the same final exit fee.
- Existing exchange-event, helper, and runtime/order regressions remain green.

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
- Duplicated close-PnL calculation logic outside the existing helper.
- Temporary bypasses, fake fee truth, or mock-only behavior.
- Reapplying terminal lifecycle during fee backfill.

## Validation Evidence
- Tests:
  - Pre-fix `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts -t "refreshes close PnL after a missing partial close fee is backfilled" --run --sequence.concurrent=false` FAILED as expected: close trade `realizedPnl` stayed `8.8` instead of final-fee-adjusted `8.7`.
  - Post-fix focused regression PASS (`1/1`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts --run --sequence.concurrent=false` PASS (`21/21`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts --run --sequence.concurrent=false` PASS (`24/24`).
  - `pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run --sequence.concurrent=false` PASS (`104/104`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Manual checks: reviewed diff for lifecycle scope, idempotency, and fee/PnL consistency.
- Screenshots/logs: not applicable.
- High-risk checks: money-impacting close PnL regression included.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/README.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
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
- Rollback note: revert the PMPLC-42 commit to restore prior fee-backfill behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: late partial close fee backfill updated fee truth but not already
  calculated close `realizedPnl`.
- Gaps: no DB-backed regression covered final PnL refresh after delayed close
  fee truth.
- Inconsistencies: `Order.fee` and `Trade.fee` could settle to `0.3` while
  `Trade.realizedPnl` and `Position.realizedPnl` still reflected `0.2`.
- Architecture constraints: exchange event reconciliation remains the sole
  path for LIVE fill truth; close PnL is computed by `computeCloseRealizedPnl`.

### 2. Select One Priority Task
- Selected task: PMPLC-42 close PnL refresh after missing partial close fee
  backfill.
- Priority rationale: money-reporting drift on closed positions is P0 for a
  money-management application.
- Why other candidates were deferred: broader UI or reporting work is lower
  priority than canonical persisted PnL correctness.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `orders.exchangeEvents.service.ts`
  - `orders.exchangeEvents.service.test.ts`
  - planning/context docs
- Logic: after accepted known-fill fee backfill settles aggregate fee truth,
  refresh any close lifecycle trades for that order using the existing close
  PnL calculator, then update the linked position PnL.
- Edge cases: skip non-close trades, missing positions, non-finite fees, and
  malformed trade price/quantity.

### 4. Execute Implementation
- Implementation notes: added `refreshCloseRealizedPnlForOrder` and invoked it
  only from the existing known-fill fee backfill branch when aggregate fee is
  finite.

### 5. Verify and Test
- Validation performed: focused regression, full exchange-event suite, helper
  suite, focused runtime/order suite, API typecheck, guardrails, lint, and diff
  check.
- Result: all post-fix validations passed.

### 6. Self-Review
- Simpler option considered: update PnL directly in the trade fee `updateMany`
  branch. Rejected because PnL requires position side, entry price, close price,
  close quantity, and entry-fee aggregation.
- Technical debt introduced: no
- Scalability assessment: scoped helper is adequate for current one-close-trade
  lifecycle and remains guarded for malformed rows.
- Refinements made: regression asserts both intermediate pending PnL and final
  settled PnL.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task evidence
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
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
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
PMPLC-42 is DONE. Exchange-event fee backfill now refreshes close lifecycle PnL
when final aggregate close fee truth arrives after an earlier partial close
fill was missing fee data.

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
- Abuse cases: stale or delayed fee event must not create duplicate lifecycle
  application or fake PnL
- Secret handling: no secret changes
- Security tests or scans: not applicable beyond existing scoped DB tests
- Fail-closed behavior: non-finite fee or malformed close trade is skipped
- Residual risk: multi-close-order partial position close accounting remains a
  future architecture area if product scope expands beyond whole-position close
