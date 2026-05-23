# Task

## Header
- ID: V1LIVE-11
- Title: Complete the first Binance adapter family inside the existing exchange boundary
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1LIVE-02, V1LIVE-03, V1LIVE-10
- Priority: P0

## Context
The repository already enforced exact `exchange + marketType` selection, but
the underlying implementation still treated the first live adapter family as a
generic futures-biased path. `BINANCE + SPOT` and `BINANCE + FUTURES` needed
to become explicit family entries inside the approved exchange boundary before
event-driven lifecycle wiring could land safely in `V1LIVE-12`.

## Goal
Make the first Binance adapter family explicit under the current exchange
boundary, and add boundary-ready user-data-stream services without yet wiring
them into canonical order/position lifecycle mutations.

## Deliverable For This Stage
Verified adapter-family code, focused exchange tests, and synchronized
queue/context truth for the closed `V1LIVE-11` slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `BINANCE + SPOT` and `BINANCE + FUTURES` resolve through explicit registry family paths.
- [x] Boundary tests prove SPOT and FUTURES stay isolated for connector and live-order adapter selection.
- [x] Binance user-data-stream lifecycle services exist inside `modules/exchange` and are ready for `V1LIVE-12`.

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
- Tests: `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterRegistry.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts src/modules/exchange/liveOrderAdapter.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts`
- Manual checks: none
- Screenshots/logs: not required
- High-risk checks: exact SPOT/FUTURES isolation and listenKey endpoint family isolation

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Canonical visual target: n/a
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused: n/a
- New shared pattern introduced: no
- Design-memory entry reused: n/a
- Design-memory update required: no
- Visual gap audit completed: no
- Background or decorative asset strategy: n/a
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: n/a
- Required states: success
- Responsive checks: n/a
- Input-mode checks: n/a
- Accessibility checks: n/a
- Parity evidence: n/a

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: no runtime behavior was wired yet; rollback is ordinary code revert

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
This slice intentionally stops before event-driven lifecycle mutation. The new
Binance user-data-stream services normalize and expose supported account/order
events, but canonical order/position/runtime handling still belongs to
`V1LIVE-12`.
