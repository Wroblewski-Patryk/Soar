# Task

## Header
- ID: V1LIVE-12
- Title: Wire Binance user-data-stream events into canonical order and position lifecycle
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1LIVE-11
- Priority: P0

## Context
After `V1LIVE-11`, the repository had explicit Binance family plumbing plus
normalized stream events, but canonical lifecycle truth still depended on REST
reconciliation and immediate submit responses. The next required step was to
apply supported Binance user-data-stream events through the existing
order/position lifecycle rather than leaving them as disconnected exchange
telemetry.

## Goal
Make supported Binance order/account stream events mutate canonical orders and
positions through one explicit apply path that reuses existing lifecycle rules.

## Deliverable For This Stage
Verified event-application service plus synchronized queue/context truth for
the closed `V1LIVE-12` slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Supported Binance order-trade updates can fill pending LIVE orders through canonical lifecycle.
- [x] Supported Binance close fills can close linked LIVE positions through the same apply path.
- [x] Supported Binance account updates can refresh canonical open-position quantity/entry/unrealized PnL.

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
- Tests: `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/exchange/binanceUserDataStream.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts`
- Manual checks: none
- Screenshots/logs: not required
- High-risk checks: verified open-fill, close-fill, and account-update parity through canonical models

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
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert `orders.exchangeEvents.service.ts` and related boundary-ready stream handlers if event application must be disabled

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
This slice wires supported Binance event truth into canonical models, but it
does not yet remove all older fallback and compatibility seams. That cleanup
remains owned by `V1LIVE-13`.
