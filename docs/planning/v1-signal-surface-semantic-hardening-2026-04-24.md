# Task

## Header
- ID: V1SIGSEM-A
- Title: Runtime signal surface semantic hardening
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1IND-A
- Priority: P1

## Context
`V1IND-A` closed the canonical indicator-registry and signal-analysis drift, so
dashboard-home and bot-monitoring surfaces now calculate market conditions from
the same kernel as runtime/backtest. The remaining operator problem is
semantic: `CONFIGURED_ONLY` rows still read too much like runtime decisions,
even though architecture says they are market snapshots from the latest closed
candle, not accepted or evaluated runtime truth.

## Goal
Make selected-bot dashboard and bot monitoring surfaces describe
`CONFIGURED_ONLY` rows explicitly as closed-candle market snapshots instead of
quasi-signals, without changing runtime logic, layout structure, or decision
ownership.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Dashboard-home labels `CONFIGURED_ONLY` and `configured_fallback` as
      market-snapshot truth instead of runtime decision truth.
- [x] Bot monitoring copy makes the same distinction for operators reviewing
      runtime state.
- [x] Focused regression evidence proves the selected-bot rail no longer
      advertises configured fallback as a runtime signal surface.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Manual checks: n/a
- Screenshots/logs: n/a
- High-risk checks: verified no runtime/execution logic changed; scope is copy
  and presentation semantics only

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/08_operator-surfaces-and-routing.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none required

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing dashboard-home and bot-monitoring operator
  surfaces
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: existing labels retained; no icon-only semantic loss
- Parity evidence: dashboard-home and bot monitoring now use aligned
  operator-facing wording for configured-only market snapshots

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
This slice is intentionally presentation-only. If operators still report
confusion after this semantic hardening, the next slice should consider a
stronger view-model split between market snapshot rows and runtime-decision
rows, but that would be a larger UX contract change.
