# Task

## Header
- ID: V1TAKE-07
- Title: harden manual-order fill/context truth and fail-closed UI semantics
- Status: DONE
- Owner: Backend Builder
- Depends on: V1TAKE-06
- Priority: P1

## Context
`V1TAKE-06` isolates a narrow but important drift: `PAPER MARKET` submit can
cross the dashboard/API boundary without proven price truth, which contradicts
the canonical `order -> fill -> position` lifecycle. The fix must keep `LIVE`
manual-order semantics explicit while tightening `PAPER` behavior to fail
closed.

## Goal
Reject `PAPER MARKET` opens when canonical fill price cannot be proven, and
align dashboard submit behavior so the UI never sends that degraded request.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep `LIVE` manual-order submitted/open/imported-position semantics intact

## Definition of Done
- [x] API returns an explicit domain error for `PAPER MARKET` without canonical
      fill price truth.
- [x] Dashboard submit path blocks that request before calling the shared order
      endpoint.
- [x] Focused API + web regressions pass together with repo/API guardrails.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- synthetic paper fill fallback from stale or unknown values

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts`
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - inspect `orders.service.ts`
  - inspect `orders.controller.ts`
  - inspect `useManualOrderController.ts`
- Screenshots/logs:
  - `orders.service.ts` now throws `PAPER_MARKET_PRICE_UNAVAILABLE` before any
    order row is written, while the dashboard controller blocks the same
    degraded path locally when neither manual context nor runtime fallback can
    prove a valid market price.
- High-risk checks:
  - `PAPER MARKET` unresolved fill truth fails closed
  - `LIVE` waiting-for-fill/imported-open-order/position-opened UI states stay
    truthful

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/modules/api-positions.md`
  - `docs/modules/api-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - n/a
- Follow-up architecture doc updates:
  - queue/context docs only if the slice closes successfully

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: current dashboard manual-order panel contract
- Required states: success | error
- Responsive checks: desktop
- Accessibility checks:
  - preserve button and field validation affordances
- Parity evidence:
  - dashboard manual-order button now matches backend fail-closed semantics for
    paper market orders

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
The fix should stay localized to order-open validation and dashboard submit
validation; it should not invent a second manual-order lifecycle.
