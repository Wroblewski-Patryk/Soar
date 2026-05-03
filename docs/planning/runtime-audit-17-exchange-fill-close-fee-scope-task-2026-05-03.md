# RUNTIME-AUDIT-17 Exchange Fill Close Fee Scope Task - 2026-05-03

## Header
- ID: RUNTIME-AUDIT-17
- Title: Scope exchange-fill close entry fees by position lifecycle
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-15
- Priority: P1
- Iteration: 35
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-15` fixed synchronous runtime close PnL fee attribution in the
execution orchestrator. TESTER review found the asynchronous LIVE exchange
order-trade update close path still used `botId` and `walletId` projections
when aggregating entry fees.

## Goal
Make exchange-confirmed LIVE close fills calculate realized PnL with the same
position-lifecycle fee attribution contract as runtime orchestrator closes.

## Success Signal
- User or operator problem: LIVE close PnL can differ depending on whether the
  close is finalized synchronously or by exchange fill confirmation.
- Expected product or reliability outcome: close PnL subtracts entry fees from
  the same owned position even when imported lifecycle rows have null or
  drifted bot/wallet projections.
- How success will be observed: regression test fails before the fix and passes
  after entry-fee aggregation uses `positionId`.
- Post-launch learning needed: yes.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `docs/modules/api-orders.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add a failing regression for exchange fill close of an imported LIVE
   position whose entry trade has `botId=null` / `walletId=null`.
2. Remove `botId` / `walletId` from exchange-fill close entry-fee aggregation.
3. Keep aggregation scoped by `userId`, exact `positionId`, and entry side.
4. Run focused exchange events tests, broader orders/runtime close tests, and
   repository quality gates.
5. Sync docs/context.

## Acceptance Criteria
- Exchange-confirmed close PnL subtracts entry fees attached to the same
  position even when identity projections differ.
- Existing normal close PnL tests remain green.
- No exchange event matching, order status mapping, or position close
  attribution behavior changes.
- Security/ownership remains bounded by `userId` and exact `positionId`.

## Definition of Done
- [x] Regression fails before fix and passes after fix.
- [x] Focused exchange-events tests pass.
- [x] Broader relevant runtime/order tests pass.
- [x] Typecheck, lint, guardrails, and diff review pass.
- [x] Source-of-truth docs are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- User-wide or symbol-wide fee aggregation.
- New PnL calculators or duplicate lifecycle systems.
- Temporary bypasses or mock-only behavior.
- Exchange connector behavior changes.

## Validation Evidence
- Tests:
  - Initial focused regression before fix failed as expected: close PnL was
    `9.92` instead of `8.42`, proving the `1.5` entry fee was excluded.
  - PASS:
    `pnpm --filter api run test -- --run src/modules/orders/orders.exchangeEvents.service.test.ts --sequence.concurrent=false`
    (`6/6`).
  - PASS:
    `pnpm --filter api run test -- --run src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/executionOrchestrator.owned-import.e2e.test.ts src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts --sequence.concurrent=false`
    (`75/75`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
  - PASS: `git diff --check`.
- Manual checks: code-path and regression review only; no production mutation
  performed.
- Screenshots/logs: not applicable.
- High-risk checks: fee aggregation remains scoped by `userId` and exact
  `positionId`, and exchange event order matching is unchanged.

## Architecture Evidence
- Architecture source reviewed: `docs/modules/api-orders.md`,
  `docs/modules/api-engine.md`, `docs/architecture/06_execution-lifecycle.md`,
  `docs/architecture/reference/live-fee-reconciliation-contract.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: `docs/modules/api-orders.md`.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore prior exchange-fill close fee
  query scope.
- Observability or alerting impact: realized PnL emitted after exchange fill
  close becomes consistent with orchestrator close PnL.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: exchange fill close PnL fee aggregation still used mutable
  `botId/walletId` projections.
- Gaps: no regression covered imported position close confirmation where entry
  fees were linked by `positionId` but not by selected close order wallet.
- Inconsistencies: orchestrator close and exchange-fill close used different
  entry-fee scopes.
- Architecture constraints: fee truth is lifecycle/position based; LIVE fills
  are authoritative, but persisted lifecycle identity may be imported.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-17`.
- Priority rationale: TESTER mode found a money-impacting parity discrepancy
  between two legitimate LIVE close finalization paths.
- Why other candidates were deferred: dashboard trade-history null/null
  broadening remains unsafe without explicit ownership-proof design.

### 3. Plan Implementation
- Files or surfaces to modify: exchange event close PnL helper, focused exchange
  events regression, orders docs and canonical context.
- Logic: aggregate entry fees by `userId + positionId + entry side`.
- Edge cases: imported `botId=null/walletId=null`, normal direct bot close,
  LONG/SHORT entry sides, duplicate fill idempotency unchanged.

### 4. Execute Implementation
- Implementation notes: added an imported LIVE close regression in
  `orders.exchangeEvents.service.test.ts`; removed mutable `botId` and
  `walletId` projections from exchange-fill entry-fee aggregation in
  `orders.exchangeEvents.service.ts`.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, broader
  orders/runtime PnL pack, API typecheck, guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: `OR` over bot/wallet null combinations. Rejected
  because it keeps projection coupling and can still miss position lifecycle
  rows.
- Technical debt introduced: no.
- Scalability assessment: exact `positionId` is narrower and more stable than
  projected identity fields.
- Refinements made: kept the helper input narrower by removing now-unused
  `botId` and `walletId` fields from the close PnL calculation boundary.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-orders.md`,
  `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: yes, LIVE exchange order-trade update service.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: no schema change.
- Loading state verified: not applicable.
- Error state verified: unchanged.
- Refresh/restart behavior verified: close fill recalculation is deterministic
  from persisted trade lifecycle data.
- Regression check performed: yes.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: user trading lifecycle and PnL data.
- Trust boundaries: authenticated exchange stream processing for one user and
  persisted order/position lifecycle.
- Permission or ownership checks: unchanged; aggregation remains scoped by
  `userId` and exact `positionId`.
- Abuse cases: another user's trade cannot be included because `userId` is
  required; same-symbol unrelated trade cannot be included because `positionId`
  is required.
- Secret handling: none.
- Security tests or scans: typecheck, lint, guardrails, and focused ownership
  boundary regression review.
- Fail-closed behavior: event matching and order lookup unchanged.
- Residual risk: existing malformed trades without `positionId` remain excluded
  by design.

## Result Report
- Task summary: exchange-confirmed LIVE close PnL now subtracts entry fees by
  owned position lifecycle instead of mutable bot/wallet projections.
- Files changed: exchange events service, exchange events tests, orders module
  docs, planning queue, execution plan, task board, and project state.
- How tested: focused exchange-events pack (`6/6`), broader orders/runtime PnL
  pack (`75/75`), API typecheck, repository guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
- Next steps: continue the next single runtime audit slice from the active
  queue.
- Decisions made: exchange-fill close PnL uses the same position lifecycle fee
  boundary as orchestrator close PnL.
