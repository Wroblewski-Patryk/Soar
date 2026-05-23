# Task

## Header
- ID: V1SURF-01
- Title: Runtime market truth surface for selected bot dashboard
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1SIG-A, V1ALIGN-A
- Priority: P0

## Context
The selected-bot dashboard surface was still mixing factual runtime signal truth
with configured fallback strategy context. Production investigation showed that
operators could see RSI condition cards for configured markets even when
runtime had persisted zero accepted signals and zero positions. This violated
the operator-surface contract by making configured context look like a live
signal feed.

## Goal
Expose one truthful selected-bot runtime markets surface that shows all markets
attached to the active bot together with explicit runtime state:
- configured only
- evaluated with no trade
- accepted signal
- open position

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] API runtime symbol read model exposes one explicit runtime market truth state.
- [x] Dashboard selected-bot markets section renders all configured/runtime markets using factual runtime state instead of treating configured fallback as signal truth.
- [x] Architecture, queue, and context are synchronized with this contract.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`
  - `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.preview-parity.test.tsx src/features/bots/services/botsMonitoringAggregate.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
- Manual checks:
  - reviewed production aggregate payload earlier in the investigation and aligned the selected-bot surface with factual `configured_fallback` vs `latest_decision` vs `latest_signal` semantics
- Screenshots/logs:
  - n/a
- High-risk checks:
  - ensured configured fallback remains visible as configuration context without being counted or rendered as accepted runtime signal truth

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/05_strategy-signal-and-decision-flow.md`
  - `docs/architecture/08_operator-surfaces-and-routing.md`
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: yes
- Approval reference if architecture changed:
  - user approved the final direction in thread on 2026-04-23 to build the docelowy truth-based version instead of another frontend-only filter
- Follow-up architecture doc updates:
  - `docs/architecture/08_operator-surfaces-and-routing.md`

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing selected-bot dashboard markets/signal section
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks:
  - preserved explicit labels for state/context text and existing pager controls
- Parity evidence:
  - `HomeLiveWidgets.preview-parity.test.tsx`

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This slice intentionally does not claim that runtime signal generation is fixed.
It only makes the selected-bot market surface truthful, so the remaining
runtime issue can be diagnosed without UI ambiguity.
