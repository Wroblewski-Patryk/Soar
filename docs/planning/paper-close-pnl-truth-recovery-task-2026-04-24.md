# Task

## Header
- ID: PAPERPNL-01
- Title: fix(api-runtime): recover truthful PAPER close PnL and wallet-capital updates for manual/runtime exits
- Status: READY
- Owner: Backend Builder
- Depends on: none
- Priority: P0

## Context
Production paper-bot investigation confirmed that profitable closed positions can
still be persisted and surfaced as losses when the close path falls back to a
non-market price source. The approved architecture already requires one
canonical lifecycle and fail-closed runtime truth, so this slice is limited to
recovering close-price authority and downstream parity for paper runtime
history and capital.

## Goal
Make `PAPER` manual and runtime close flows persist one truthful realized PnL
outcome so runtime history, aggregate trade views, and wallet-capital summary
all reflect the same profitable close result.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep the close-price resolver canonical across manual and automated runtime
  close paths

## Definition of Done
- [ ] Manual dashboard close no longer falls back to `position.entryPrice` as
      synthetic close truth when current market price cannot be proven.
- [ ] `PAPER` close lifecycle persists matching realized PnL truth across
      `position`, `trade`, runtime history, and capital summary reads.
- [ ] Focused regression coverage proves profitable manual close and profitable
      runtime close both increase paper runtime capital instead of showing a
      loss.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: targeted API Vitest pack for runtime close/manual close/capital
  summary parity
- Manual checks: none required before implementation; prod repro should be used
  only as a reference symptom
- Screenshots/logs: test output only
- High-risk checks: profitable `LONG` and `SHORT` close cases, missing ticker
  fail-closed behavior, history vs capital parity

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none expected unless implementation
  exposes a second close-price authority

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: production operator report for paper close/history
  mismatch
- Required states: success | error
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: runtime history and capital summary must show the same
  realized PnL sign

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
Verified code-level suspicion before queuing:
- manual dashboard close currently falls back to `position.entryPrice` in
  `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`
- realized PnL then feeds both runtime history and paper capital summary via
  existing canonical read models
