# Task

## Header
- ID: V1LIVE-14
- Title: Rerun the focused V1LIVE closure pack and synchronize canonical queue/context truth
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: V1LIVE-13
- Priority: P0

## Context
`V1LIVE-A` could not be closed honestly until the focused regression pack proved
all live-execution, imported-position, takeover, and dashboard cleanup slices
worked together under the approved architecture. The final blocker was stale
fixture drift in `orders-positions.e2e`, which is now corrected.

## Goal
Run the focused closure pack for the complete `V1LIVE-A` wave and synchronize
canonical docs/context once the evidence is green.

## Deliverable For This Stage
Green closure evidence plus synchronized queue/context truth marking
`V1LIVE-A` completed.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] The focused API `V1LIVE-A` closure pack is green.
- [x] The focused web `V1LIVE-A` closure pack is green.
- [x] Queue/context/project-state artifacts reflect `V1LIVE-13`, `V1LIVE-14`, and full `V1LIVE-A` closure truth.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/liveOrderAdapter.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/orders/orders.service.test.ts src/modules/orders/orders.manual-paper-market.e2e.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`, `pnpm --filter web exec vitest run src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx`, `pnpm run typecheck`, `pnpm run quality:guardrails`
- Manual checks: none
- Screenshots/logs: not required
- High-risk checks: closure pack covers exact exchange context, imported-position ownership parity, event-driven Binance lifecycle, manual LIVE runtime visibility, and imported-position close authority

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`, `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: `docs/ux/dashboard-design-system.md`
- Canonical visual target: dashboard manual-order/runtime sidebar parity
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: yes
- Visual-direction brief reviewed: no
- Existing shared pattern reused: yes
- New shared pattern introduced: no
- Design-memory entry reused: n/a
- Design-memory update required: no
- Visual gap audit completed: no
- Background or decorative asset strategy: n/a
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: none in closure scope
- Required states: success
- Responsive checks: n/a
- Input-mode checks: n/a
- Accessibility checks: none needed for focused closure rerun
- Parity evidence: `RuntimeSidebarSection.test.tsx`, `HomeLiveWidgets.manual-order.test.tsx`

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: no deployment change in this slice; rollback is doc/context-only

## Review Checklist (mandatory)
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

## Notes
The final green closure pack confirms the `V1LIVE-A` wave is no longer blocked
by stale test debt. The remaining open work in the repository now lives
outside this wave.
