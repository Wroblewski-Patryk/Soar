# EXCHANGE2-31 Live Order Cancel Boundary

## Header
- ID: `EXCHANGE2-31-LIVE-ORDER-CANCEL-BOUNDARY-2026-05-10`
- Title: Enable exchange-side live order cancel through canonical exchange boundary
- Task Type: implementation
- Current Stage: verification
- Status: DONE
- Owner: Execution Agent
- Depends on:
  - `EXCHANGE2-30-GATEIO-LIVE-ORDER-SUBMIT-2026-05-10`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Priority: P0
- Iteration: 49
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches iteration 49 (`BUILDER`).
- [x] The task is aligned with repository source-of-truth documents.

## Context
The repository intentionally kept `LIVE_ORDER_CANCEL` unsupported while only a
local Soar order-cancel route existed. Gate.io live submit is now implemented
through the canonical orders/exchange boundary, so open LIVE orders need a real
exchange-side cancel path instead of a local-only mutation or unsupported
response.

## Goal
Add one canonical exchange-side live order cancel boundary and route
exchange-backed order cancellation through it before local Soar order state is
mutated.

## Success Signal
- User or operator problem: an open LIVE exchange order can be canceled from
  Soar without pretending a local-only mutation canceled the venue order.
- Expected product or reliability outcome: supported exchanges use the shared
  exchange boundary for cancel, while contextless or unsupported orders still
  fail closed.
- How success will be observed: focused connector, boundary, capability, and
  orders tests pass without real live-money exchange calls.
- Post-launch learning needed: yes

## Deliverable For This Stage
A narrow implementation slice for exchange-side cancel across `BINANCE` and
`GATEIO`, with tests and source-of-truth updates. No live exchange action is
performed.

## Scope
- `apps/api/src/modules/exchange/ccxtFuturesConnector.types.ts`
- `apps/api/src/modules/exchange/ccxtFuturesConnector.service.ts`
- `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.ts`
- `apps/api/src/modules/exchange/exchangeExecutionCapabilityContract.service.ts`
- `apps/api/src/modules/orders/orders.service.ts`
- focused API tests for exchange and orders services
- architecture, module, planning, and state docs

## Implementation Plan
1. Add typed CCXT cancel input and connector `cancelOrder`.
2. Add `cancelLiveOrderThroughBoundary` in the exchange adapter boundary.
3. Enable exact `LIVE_ORDER_CANCEL` for `BINANCE` and `GATEIO`.
4. Route exchange-backed `orders.cancelOrder` through the boundary before local
   state mutation.
5. Preserve fail-closed behavior for exchange-backed orders without canonical
   bot/wallet exchange context.
6. Update architecture/module/status docs.
7. Run focused tests, typecheck, guardrails, docs parity, and diff check.

## Acceptance Criteria
- `BINANCE` and `GATEIO` exact `LIVE_ORDER_CANCEL` support is true.
- Exchange cancel calls use `orders.service.ts -> exchangeAdapterBoundary.service.ts -> authenticated connector`.
- Local order state changes only after the boundary call succeeds.
- Contextless exchange-backed rows still return `LIVE_ORDER_CANCEL_UNSUPPORTED`.
- No real live-money exchange call is run.

## Definition of Done
- [x] Focused exchange capability/boundary/connector tests pass.
- [x] Focused orders cancel contract test passes.
- [x] API typecheck passes.
- [x] Repository guardrails, docs parity, and diff check pass.
- [x] Source-of-truth docs are updated.

## Forbidden
- Do not call production or real exchange cancel endpoints during validation.
- Do not locally cancel exchange-backed orders before a successful boundary
  call.
- Do not add a second cancel path outside the exchange boundary.
- Do not infer cancel support from broad `LIVE_EXECUTION` alone.

## Validation Evidence
- Tests:
  - PASS: API typecheck.
  - PASS: focused exchange connector/boundary/capability pack:
    `vitest.CMD run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/ccxtFuturesConnector.service.test.ts --sequence.concurrent=false`.
  - PASS: focused order cancel contract:
    `vitest.CMD run src/modules/orders/orders.liveCancelBoundary.service.test.ts src/modules/orders/orders.service.test.ts --sequence.concurrent=false -t "orders live cancel boundary|manual order action active sync-state contract"`.
  - PASS: `node scripts\repoGuardrails.mjs`.
  - PASS: `node scripts\checkDocsParity.mjs`.
  - PASS: `git diff --check` with line-ending warnings only.
- Manual checks: not applicable.
- High-risk checks: no real live-money action is performed; tests use mocks.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/exchange-access-ownership-matrix.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no; the architecture explicitly allowed support once a
  real exchange-cancel boundary exists.
- Decision required from user: no.

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore fail-closed exchange-backed
  cancel behavior.
- Observability or alerting impact: existing order audit remains the visible
  lifecycle signal.
- Staged rollout or feature flag: exact operation capability matrix gates
  supported exchanges.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `LIVE_ORDER_CANCEL` is unsupported because no exchange boundary
  existed.
- Gaps: open LIVE exchange orders could not be canceled from Soar through a
  supported venue call.
- Inconsistencies: UI exposed cancel affordances while exchange-backed rows
  failed closed.
- Architecture constraints: cancel must be exchange-owned and exact-operation
  gated.

### 2. Select One Priority Task
- Selected task: implement canonical live order cancel boundary.
- Priority rationale: it is the remaining exchange operation gap after Gate.io
  live submit.
- Why other candidates were deferred: protected production evidence still
  requires operator auth not present in this shell.

### 3. Plan Implementation
- Files or surfaces to modify: connector types/service, exchange boundary,
  capability matrix, orders service, focused tests, docs/status.
- Logic: call exchange cancel first, then persist Soar cancellation.
- Edge cases: missing risk acknowledgement, stale local rows, missing
  bot/wallet exchange context, unsupported exchange.

### 4. Execute Implementation
- Implementation notes: added typed connector cancel and boundary-level cancel;
  order cancel now resolves venue context from wallet/bot ownership.

### 5. Verify and Test
- Validation performed: focused exchange tests, focused orders cancel tests,
  API typecheck, repository guardrails, docs parity, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: flipping `LIVE_ORDER_CANCEL` without a boundary.
- Technical debt introduced: no.
- Scalability assessment: the path reuses the existing registry and
  authenticated connector lifecycle.
- Refinements made: contextless exchange-backed rows remain fail-closed.

### 7. Update Documentation and Knowledge
- Docs updated: architecture matrix, API/Web module docs, completion gap
  report, second-exchange readiness plan, task artifact.
- Context updated: project state, task board, current focus, system health,
  next steps, MVP next commits.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Result Report

- Task summary: implemented canonical exchange-side live order cancel for
  Binance and Gate.io.
- Files changed: exchange connector/types, exchange adapter boundary,
  execution capability matrix, orders service, focused tests, architecture,
  module, planning, and state docs.
- How tested: focused exchange tests, focused orders cancel tests, API
  typecheck, repository guardrails, docs parity, and diff check.
- What is incomplete: production build-info later reached
  `9c12568379ee77cda9c9e9df39879e141b5615fb`, which includes `b414e523`, and
  public smoke passed. Protected live-money operator evidence, liveimport,
  rollback, restore, RC, and authenticated/admin UI evidence remain pending.
- Next steps: continue protected V1 evidence when operator credentials and
  production DB restore context are available.
- Decisions made: exchange-backed cancel must call the exchange boundary before
  local order mutation.
