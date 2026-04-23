# Task

## Header
- ID: AUTH-BOOTSTRAP-REGRESSION-2026-04-23
- Title: Lock AuthProvider bootstrap against repeated `/auth/me` rerender loops
- Status: DONE
- Owner: QA/Test
- Depends on: `PROD-AUTH-HOTFIX stop providerless i18n fallback from looping auth bootstrap`
- Priority: P1

## Context
The production login incident was traced to repeated `/auth/me` bootstrap calls in `AuthProvider` when it ran above route-level i18n providers. The hotfix stabilized the optional i18n fallback, but the repo still lacked a direct regression test proving that `AuthProvider` does not repeat bootstrap session fetches across parent rerenders.

## Goal
Add a focused web regression test that locks `AuthProvider` to a single bootstrap `/auth/me` request across rerenders when no explicit i18n provider is mounted above it.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] `AuthProvider` has a focused regression test for single bootstrap fetch behavior.
- [x] The test runs without introducing a parallel auth implementation or alternate bootstrap path.
- [x] Canonical context is synced for the regression lock.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/i18n/useOptionalI18n.test.tsx`
- Manual checks: none
- Screenshots/logs: none
- High-risk checks: bootstrap rerender path covered directly in test instead of relying only on provider fallback identity tests

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`, `docs/engineering/testing.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing auth bootstrap flow
- Required states: success
- Responsive checks: none
- Accessibility checks: none
- Parity evidence: regression protects the same providerless bootstrap path used by public auth and dashboard shells

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
This task adds confidence only; it does not change runtime behavior beyond the already-landed hotfix.
