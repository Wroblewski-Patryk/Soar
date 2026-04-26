# Task

## Header
- ID: V1LIVE-10
- Title: Lock signal-driven LIVE submit lifecycle truth before adapter-family event wiring
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: V1LIVE-02, V1LIVE-03, V1LIVE-04, V1LIVE-05, V1LIVE-06, V1LIVE-07, V1LIVE-08, V1LIVE-09
- Priority: P0

## Context
`V1LIVE-A` still lacked one focused regression proving that a signal-driven
`LIVE` execution may remain explicitly `submitted` while preserving exact
runtime execution context. The approved lifecycle contract requires pending
`LIVE` truth to stay unresolved instead of fabricating a position-opened state
or degrading into a pre-trade block.

## Goal
Freeze one high-signal regression that proves runtime signal execution keeps
`LIVE` submit truth explicit and forwards the exact canonical runtime context
to the orchestration boundary.

## Deliverable For This Stage
Focused automated coverage plus synchronized queue/context artifacts for the
closed `V1LIVE-10` test slice only.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Focused `api-engine` regression proves signal-driven `LIVE` can end as `submitted`.
- [x] Regression proves exact runtime context (`walletId`, strategy scope, candle window, mode) reaches orchestration.
- [x] Queue/context truth is synchronized for the closed task.

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
- Tests: `pnpm --filter api exec vitest run src/modules/engine/runtimeFinalCandleDecision.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts`
- Manual checks: none
- Screenshots/logs: not required
- High-risk checks: verified that `submitted` does not degrade into `PRETRADE_BLOCKED` at the final-candle decision layer

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
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not needed

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
This slice intentionally stops at the regression boundary. Event-driven
Binance adapter wiring remains owned by `V1LIVE-11` and `V1LIVE-12`.
