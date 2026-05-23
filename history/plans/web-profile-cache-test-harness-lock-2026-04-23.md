# Task

## Header
- ID: V1CONF-03
- Title: Stabilize web test harness by isolating DataTable profile-preference I/O
- Status: DONE
- Owner: QA/Test
- Depends on: `V1CONF-02`
- Priority: P0

## Context
After route-context cleanup, the remaining `AggregateError` noise in several
dashboard component tests was traced to `DataTable` column-visibility hydration.
The shared hook reads `/dashboard/profile/basic` through
`profileBasicCache`, which is orthogonal to most rendering assertions and
should not hit real network paths in component tests.

## Goal
Prevent unrelated component tests from issuing real profile-preference requests
while preserving the ability to add explicit profile-cache tests separately.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep production behavior unchanged

## Definition of Done
- [x] Web Vitest setup provides a default mock for `profileBasicCache`.
- [x] The previously noisy dashboard table suites no longer emit
      `/dashboard/profile/basic` request noise.
- [x] Focused validation and wider web confidence validation are rerun.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run src/features/backtest/components/BacktestsRunsTable.test.tsx src/features/bots/components/BotsListTable.test.tsx src/features/wallets/components/WalletsListTable.test.tsx`
  - `pnpm --filter web run test -- --run`
- Manual checks: verified the prior `/dashboard/profile/basic` XHR noise source before replacing it with a stable test default.
- Screenshots/logs: not required
- High-risk checks: production profile-preference behavior left untouched

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/reference/v1-production-activation-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: current dashboard table behaviors
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: preserve existing semantics only
- Parity evidence: table rendering assertions stay unchanged

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
- This is a test-harness isolation rule, not a production-code change.
