# Task

## Header
- ID: V1TAKE-06
- Title: lock manual PAPER/LIVE open truth from dashboard submission to order/position state
- Status: DONE
- Owner: Backend Builder
- Depends on: V1TAKE-05
- Priority: P1

## Context
The runtime/takeover side is now aligned with wallet-owned truth. The remaining
user-visible gap is manual order truth. Current behavior still permits `PAPER`
`MARKET` requests without canonical fill price truth, which can degrade into an
`OPEN` order with no position instead of failing closed. The dashboard
controller also does not currently block that submit path when both manual
context and runtime fallback price truth are unavailable.

## Goal
Add focused API + web regressions that lock fail-closed behavior for `PAPER`
`MARKET` orders without proven fill price, while preserving the existing
truthful `LIVE` submitted/open/imported-position state progression.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep `LIVE` submitted/open/imported-position semantics explicit and unchanged

## Definition of Done
- [x] Backend regression proves `PAPER MARKET` without canonical fill price is
      rejected instead of persisted as `OPEN`.
- [x] Web regression proves dashboard manual-order submit is blocked when
      `PAPER MARKET` price truth is unavailable.
- [x] Existing `LIVE` manual-order state progression remains covered and
      untouched by the red slice.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- optimistic fallback that manufactures `PAPER MARKET` fill truth from unknown
  price

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts`
  - `pnpm --filter api exec vitest run src/modules/orders/orders.manual-paper-market.e2e.test.ts`
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`
- Manual checks:
  - inspect `orders.service.ts`
  - inspect `useManualOrderController.ts`
- Screenshots/logs:
  - The service-level red contract replaced the old permissive expectation
    where `PAPER MARKET` without fill truth stayed `OPEN`. The new route-level
    regression now requires an explicit `400` with no persisted order/position.
- High-risk checks:
  - `PAPER MARKET` must not silently persist waiting-for-fill rows without
    canonical price truth
  - `LIVE MARKET` submitted/open/imported-position semantics must remain intact

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/reference/wallet-source-of-truth-contract.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/modules/api-positions.md`
  - `docs/modules/api-bots.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  - n/a
- Follow-up architecture doc updates:
  - none yet; this slice is red coverage first

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: current dashboard manual-order panel contract
- Required states: success | error
- Responsive checks: desktop
- Accessibility checks:
  - preserve existing form-button semantics and validation flow
- Parity evidence:
  - dashboard submit behavior must match backend fail-closed order contract

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
This task intentionally targets the exact user-visible drift where a manual
order can look "accepted" but does not progress to a truthful filled position.
