# Task

## Header
- ID: PAPERPNL-02
- Title: test(api-runtime): lock profitable PAPER EXIT realized-PnL sign for canonical LONG and SHORT closes
- Status: DONE
- Owner: Backend Builder
- Depends on: PAPERPNL-01
- Priority: P1

## Context
`PAPERPNL-01` recovered truthful close-price authority for manual/runtime paper
closes, but the canonical `EXIT` orchestrator still lacked an explicit
regression lock proving profitable `LONG` and profitable `SHORT` exits both
persist positive realized PnL when the canonical fill result is applied.

## Goal
Add focused engine-level regression coverage so future changes cannot silently
flip realized-PnL sign for profitable `PAPER` `EXIT` lifecycle handling.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep the scope test-only unless the new regression exposes a real defect

## Definition of Done
- [x] Canonical `PAPER` `EXIT` coverage proves profitable `LONG` close persists
      positive realized PnL to both closed position payload and close trade.
- [x] Canonical `PAPER` `EXIT` coverage proves profitable `SHORT` close
      persists positive realized PnL to both closed position payload and close
      trade.
- [x] Queue/context docs reflect the new follow-up slice and its closure.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  `pnpm --filter api exec vitest run src/modules/engine/executionOrchestrator.service.test.ts`
- Manual checks: none
- Screenshots/logs: targeted Vitest output only
- High-risk checks: profitable `LONG` vs profitable `SHORT` close sign parity

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: success
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: canonical fill-result close path keeps positive sign for
  profitable `LONG` and `SHORT`

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
This slice intentionally adds regression coverage only. No production runtime
logic changed unless the tests had exposed a defect.
