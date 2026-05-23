# Task

## Header
- ID: AUTH-SESSION-EXPIRED-REGRESSION-2026-04-23
- Title: Lock session-expired and logout UX behavior in AuthProvider
- Status: DONE
- Owner: QA/Test
- Depends on: `AUTH-I18N-TEST-SIGNAL-2026-04-23`
- Priority: P1

## Context
The auth layer intentionally shows a session-expired warning only in protected or explicitly hinted flows, then clears the `session=expired` query param to avoid repeat warnings. The same provider also owns logout cleanup plus redirect back to the login screen. Those behaviors existed in `AuthContext`, but the focused regression pack still lacked direct coverage for the explicit hint path and logout flow.

## Goal
Add focused regression tests that prove `AuthProvider` warns once for the explicit `session=expired` hint, removes the query parameter after handling it, and clears auth state plus redirects on logout.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] `AuthProvider` has direct regression tests for the explicit expired-session hint path and logout flow.
- [x] The tests lock warning/query-cleanup behavior plus logout state clearing and redirect behavior.
- [x] Canonical context reflects the new regression lock.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/lib/api.test.ts src/i18n/useOptionalI18n.test.tsx`
- Manual checks: none
- Screenshots/logs: none
- High-risk checks: explicit expired-session and logout UX paths locked without changing runtime auth behavior

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/engineering/testing.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing auth/session-expired login UX
- Required states: error | success
- Responsive checks: none
- Accessibility checks: none
- Parity evidence: regressions cover both the explicit `session=expired` path and the provider-owned logout redirect path used by the live auth shell

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
This task improves auth UX confidence only and does not alter the runtime session contract.
