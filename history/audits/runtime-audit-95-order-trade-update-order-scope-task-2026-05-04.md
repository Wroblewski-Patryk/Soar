# Task

## Header
- ID: RUNTIME-AUDIT-95
- Title: fix(api-orders): scope trade updates to synced live orders
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-94
- Priority: P1
- Iteration: 95
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
LIVE Binance order-trade updates locate a local order by user,
`exchangeOrderId`, and symbol before applying fill lifecycle. That lookup did
not require the local order to be synced active truth or to belong to the LIVE
Binance market from the event.

## Goal
Ensure exchange order-trade updates mutate only `IN_SYNC` LIVE Binance orders
for the matching market type, so stale local rows cannot receive fills or steal
events from the valid active order.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add `syncState=IN_SYNC` to order-trade update order lookup.
2. Add LIVE Binance market-type scope through the order wallet or bot.
3. Add focused coverage where a newer stale local order shares the same
   exchange order id and must not receive the fill event.
4. Run exchange-event tests, API typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- Order-trade updates select only synced LIVE Binance orders for the event
  market type.
- A newer `ORPHAN_LOCAL` order with the same exchange id does not receive the
  fill event.
- Existing valid open, close, imported-close, and DCA event flows still pass.
- No order-trade update path bypasses lifecycle or market boundaries.

## Definition of Done
- [x] Implementation fits the approved LIVE order lifecycle.
- [x] Focused tests cover stale same-exchange-id local rows.
- [x] Relevant validation commands pass.
- [x] Context and planning docs are updated with evidence.

## Forbidden
- New exchange-event pipelines or duplicate lifecycle paths.
- Temporary bypasses or mock-only behavior.
- Architecture changes without explicit approval.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/runtime-signal-merge-contract.md`,
  `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous trade-update order
  lookup behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: order-trade update lookup lacks `syncState` and LIVE market scope.
- Gaps: stale local rows can receive fill state or steal an exchange event from
  the valid synced order.
- Inconsistencies: active order lists/runtime/dedupe now require synced active
  truth; this exchange event lookup did not.
- Architecture constraints: fill lifecycle must be driven by valid LIVE
  exchange-confirmed local order state.

### 2. Select One Priority Task
- Selected task: align order-trade update lookup with synced LIVE market scope.
- Priority rationale: this path mutates orders, positions, fills, trades, and
  runtime DCA state.
- Why other candidates were deferred: account-update scope was closed in
  RUNTIME-AUDIT-94; this is the next isolated exchange-event write path.

### 3. Plan Implementation
- Files or surfaces to modify: exchange events service, focused tests,
  planning/context docs.
- Logic: require `syncState=IN_SYNC` and matching LIVE Binance market through
  order wallet or bot.
- Edge cases: stale newer duplicate ignored; valid older synced order still
  receives fill event.

### 4. Execute Implementation
- Implementation notes: order-trade lookup now requires `syncState=IN_SYNC`
  and matching LIVE Binance market type through wallet or bot ownership.

### 5. Verify and Test
- Validation performed: exchange-events suite, API typecheck, repository
  guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only adding `syncState`.
- Technical debt introduced: no
- Scalability assessment: reuses existing wallet/bot market scope ownership.
- Refinements made: focused test proves a newer stale same-exchange-id order
  remains untouched while the valid synced order receives the event.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence, MVP next commits queue, MVP execution plan.
- Context updated: task board and project state.
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

## Result Report
- Task summary: order-trade updates are now scoped to synced LIVE Binance
  orders for the event market type.
- Files changed:
  `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`,
  `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`, and
  planning/context docs.
- How tested: exchange-events suite (`6/6`), API typecheck, repository
  guardrails, lint, and diff check.
- What is incomplete: none.
- Next steps: continue auditing lifecycle close/add paths for stale linked
  positions.
- Decisions made: event order lookup requires `IN_SYNC` and matching LIVE
  Binance market ownership.
