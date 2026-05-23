# Task

## Header
- ID: V1UX-MANUAL-2026-04-25-A
- Title: web(manual-order-ux): polish symbol/price autofill, budget slider, and sidebar noise reduction
- Status: CLOSED
- Owner: Frontend Builder
- Depends on: V1COH-07
- Priority: P0

## Context
The dashboard manual-order sidebar is now semantically truthful for `LIVE`
action state, but three UX gaps still block smooth operator use:

1. symbol changes do not automatically refresh the editable `Price` input from
   the canonical market/reference price,
2. quantity-only slider forces operators to mentally convert `%` into quote
   currency spend,
3. several helper lines add noise without improving the current V1 workflow.

The implementation must stay inside the existing selected-bot dashboard manual
order surface and must reuse the current manual-order controller rather than
introducing a second estimation path.

## Goal
Ship one coherent manual-order UX polish slice that:
- auto-fills `Price` from the current market/reference price when symbol scope
  is initialized or changed,
- adds a quote-budget input under the qty slider for `Price * Qty` constrained
  by the selected bot wallet free funds,
- removes the non-essential summary / lifecycle / action-state copy while
  preserving order type, margin mode, and leverage fields.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] `Price` auto-fills from `Use market` semantics on first symbol hydrate and
      on subsequent symbol changes, but does not overwrite user-edited price
      during ordinary typing.
- [x] a new quote-budget control under the qty slider can drive quantity from
      final order value and stays capped by the selected bot wallet free funds.
- [x] non-essential summary/lifecycle/action-state helper copy is removed from
      the sidebar while order type, margin mode, and leverage remain visible.
- [x] focused manual-order web regressions cover the new autofill, budget
      control, and reduced-sidebar rendering.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`
- Manual checks: selected-bot dashboard manual order on production after deploy
- Screenshots/logs: n/a
- High-risk checks: auto price refresh must not silently alter a user-edited
  price except on symbol-context re-selection; budget control must fail closed
  to wallet free-funds cap

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none required

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard manual-order sidebar for selected bot
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: preserve labeled inputs and keyboard operability for new budget field
- Parity evidence: quote-budget and price autofill remain scoped to the selected bot context only

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
- Implementation should be split into three tiny commits/tasks:
  - `V1UX-01` controller autofill semantics for symbol-driven price refresh
  - `V1UX-02` quote-budget input + capped slider parity
  - `V1UX-03` sidebar noise removal + focused closure pass

## Closure Notes
- 2026-04-25: closed in one coherent web UX slice after focused production
  feedback. The selected-bot dashboard manual-order sidebar now auto-fills
  price from canonical market reference truth, exposes a quote-budget input
  under the qty slider with free-funds fail-closed behavior, and removes the
  summary/lifecycle/action-state helper noise from the static context block.
