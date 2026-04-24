# Task

## Header
- ID: V1LIFE-A
- Title: Close order/position lifetime enforcement and dashboard open-order control for final V1 runtime hygiene
- Status: READY
- Owner: Planning Agent
- Depends on: V1FINAL-A
- Priority: P0

## Context
Fresh repository and production audits on `2026-04-24` show that Soar is now
much closer to a truthful V1 handoff, but one lifecycle gap remains around
orders and positions:

- strategy builder already exposes `additional.maxOrders`,
  `additional.orderLifetime`, `additional.orderUnit`,
  `additional.maxPositions`, `additional.positionLifetime`,
  `additional.positionUnit`
- those values are persisted inside `strategy.config.additional`
- runtime currently consumes `maxPositions`, but no canonical runtime
  enforcement path was found for:
  - order lifetime expiry
  - position lifetime expiry
  - explicit `maxOrders` hygiene in runtime/manual operator flow
- dashboard open orders table already exists and backend already exposes
  `POST /dashboard/orders/:id/cancel`, but the UI does not expose a cancel
  action column yet
- strategy form currently forces lifetime inputs to `min=1`, which prevents the
  required operator semantic:
  - `0 = no time limit`

Production evidence also confirms one historical orphan case:
- a legacy paper manual `MARKET` order created before the immediate-fill fix is
  still present as `OPEN` in runtime aggregate
- user explicitly confirmed that this row was created manually during testing
  and may be cleaned up

This wave exists to finish the lifecycle contract properly instead of keeping
manual order hygiene as an operator-only workaround.

## Goal
Implement one canonical lifecycle contract where strategy-defined order and
position lifetime limits are enforced by runtime/manual order flows, `0` means
"no time limit", and dashboard open orders expose an explicit operator cancel
action over the existing backend endpoint.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- reuse the existing `orders.cancelOrder` command path
- keep the singular bot architecture intact
- keep `PAPER` and `LIVE` under one shared lifecycle contract where possible

## Definition of Done
- [ ] Strategy lifetime fields support `0` as explicit "no limit" in form
      semantics, payload mapping, and helper copy.
- [ ] Runtime/manual order lifecycle enforces strategy-configured order
      lifetime for both `PAPER` and `LIVE`, using one canonical cancel path.
- [ ] Runtime/manual position lifecycle enforces strategy-configured position
      lifetime for both `PAPER` and `LIVE`, with `0` meaning disabled.
- [ ] Dashboard open orders table exposes a final `Action` column with cancel
      affordance for uncancelled active orders.
- [ ] Historical pre-fix orphan paper order has an explicit cleanup or recovery
      path and is not left as silent garbage.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- ad-hoc UI-only hiding of stale open orders
- implementing lifetime cleanup in a separate side system if existing runtime
  lifecycle or order command flows can own it

## Validation Evidence
- Tests:
  - focused strategy form tests for `0 = no limit`
  - focused API/service tests for order-lifetime cancel path
  - focused API/service tests for position-lifetime close path
  - focused dashboard open-orders tests for cancel action
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - verify a strategy with `orderLifetime=0` leaves orders untouched by time
  - verify a strategy with `positionLifetime=0` leaves positions untouched by
    time
  - verify a non-zero lifetime causes deterministic cancel/close behavior
  - verify dashboard orders tab can cancel an active order
- Screenshots/logs:
  - dashboard orders tab before/after action column
  - production cleanup note for the historical paper manual order
- High-risk checks:
  - no regression in paper immediate-fill path
  - no regression in live order ownership and risk-ack behavior
  - no regression in runtime reconciliation or bot-managed position ownership

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - n/a
- Follow-up architecture doc updates:
  - document `0 = no limit` and lifetime ownership once implementation lands

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: current dashboard open orders table + strategy
  additional settings form
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks:
  - cancel action remains keyboard reachable
  - helper text is announced with the lifetime inputs
  - confirm/cancel affordance remains screen-reader clear
- Parity evidence:
  - dashboard orders tab action must reflect the same backend cancel contract as
    bot monitoring/runtime aggregates

## Review Checklist (mandatory)
- [ ] Architecture alignment confirmed.
- [ ] Existing systems were reused where applicable.
- [ ] No workaround paths were introduced.
- [ ] No logic duplication was introduced.
- [ ] Definition of Done evidence is attached.
- [ ] Relevant validations were run.
- [ ] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
The implementation should prefer one shared lifetime-resolution helper over
scattering `orderLifetime` / `positionLifetime` parsing across web, orders, and
runtime modules.

The historical paper orphan order should be treated as a recovery/cleanup case,
not as justification to keep stale open orders indefinitely.

## Execution Plan

### Slice 1 - Freeze semantics and form contract
- [x] `V1LIFE-01 docs+web(contract): freeze and expose 0=no-limit semantics for strategy order/position lifetime`
  - update planning/architecture/source-of-truth with explicit `0 = disabled`
  - update strategy form inputs to allow `0`
  - add helper text so the user understands `0` means no time cap
  - update mapping/tests so config payload preserves `0`

### Slice 2 - Canonical lifetime parsing
- [x] `V1LIFE-02 api(shared-lifetime): add one canonical strategy-lifetime resolver for order and position policies`
  - resolve `orderLifetime` + `orderUnit`
  - resolve `positionLifetime` + `positionUnit`
  - normalize invalid or missing values fail-closed to `disabled`
  - keep ownership on strategy config only

### Slice 3 - Order lifetime enforcement
- [x] `V1LIFE-03 api(order-lifetime): enforce strategy-configured order lifetime via canonical cancel path`
  - cover both `PAPER` and `LIVE`
  - reuse existing `cancelOrder` semantics or extracted shared order-cancel
    lifecycle where necessary
  - include recovery/cleanup path for the known historical orphan paper order

### Slice 4 - Position lifetime enforcement
- [x] `V1LIFE-04 api(position-lifetime): enforce strategy-configured position lifetime via canonical close lifecycle`
  - cover both `PAPER` and `LIVE`
  - do not bypass lifecycle ownership or create a second close system
  - preserve `0 = no limit`

### Slice 5 - Dashboard control
- [ ] `V1LIFE-05 web(open-orders-action): add final Action column with cancel affordance in dashboard Orders tab`
  - use existing backend cancel endpoint
  - add pending/error/success operator states
  - show action only for cancelable active orders

### Slice 6 - Closure
- [ ] `V1LIFE-06 qa(closure): run focused lifetime/order-control pack and sync canonical docs/context`
  - rerun focused api/web tests
  - verify prod orphan-order cleanup note
  - sync queue/context/architecture notes

## Progress Notes
- `V1LIFE-01` closed on `2026-04-24`
  - strategy lifetime inputs now allow `0`
  - helper copy explicitly documents `0 = no time limit`
  - payload mapping is regression-locked to preserve `0` for both
    `positionLifetime` and `orderLifetime`
- `V1LIFE-02` closed on `2026-04-24`
  - one canonical API helper now resolves both order and position lifetime
    policies from `strategy.config.additional`
  - invalid, missing, negative, unsupported-unit, and explicit `0` values now
    fail closed to `disabled`
  - downstream runtime/order consumers can now depend on one normalized
    `durationMs` contract instead of re-parsing strategy config ad hoc
- `V1LIFE-03` closed on `2026-04-24`
  - runtime watchdog now enforces stale-order lifetime through one canonical
    service (`runtimeOrderLifetime.service.ts`) instead of ad-hoc cleanup
  - stale `PENDING` / `OPEN` / `PARTIALLY_FILLED` orders are canceled via the
    existing `cancelOrder` lifecycle with runtime `CANCEL` dedupe
    (`reasonCode=stale_open`)
  - race cases where an order is already terminal during cleanup are treated as
    successful resolution rather than noisy retry loops
- `V1LIFE-04` closed on `2026-04-24`
  - runtime watchdog now enforces stale-position lifetime through one
    canonical service (`runtimePositionLifetime.service.ts`) instead of a
    side cleanup path
  - stale `OPEN` positions for active bots are closed through the existing
    runtime EXIT orchestration with `reason='position_lifetime_expired'`
  - mark-price authority is fail-closed: runtime prefers current ticker truth,
    falls back to the most recent close for the bot strategy interval, and
    skips closure when no valid positive price can be proven
