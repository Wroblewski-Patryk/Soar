# Task

## Header
- ID: AUTH-REGISTER-HOOK-REGRESSION-2026-04-23
- Title: Lock register-hook success and session-confirmation behavior
- Status: DONE
- Owner: QA/Test
- Depends on: `AUTH-SESSION-UX-REGRESSION-2026-04-23`
- Priority: P1

## Context
`useLoginForm` already had a focused regression pack for request failure, success redirect, and missing session confirmation. The matching register path used the same session-confirmation contract but lacked equivalent direct test coverage.

## Goal
Add a focused regression pack for `useRegisterForm` covering request failure, successful redirect, and the explicit failure path when post-registration session confirmation does not succeed.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] `useRegisterForm` has direct regression coverage for failure, success, and missing-session-confirmation paths.
- [x] Register-hook behavior is locked symmetrically with the existing login-hook test pack.
- [x] Canonical context reflects the new regression lock.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/auth/hooks/useRegisterForm.test.tsx src/features/auth/hooks/useLoginForm.test.tsx`
- Manual checks: none
- Screenshots/logs: none
- High-risk checks: post-registration session-confirmation failure path locked explicitly

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/engineering/testing.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing auth register flow
- Required states: error | success
- Responsive checks: none
- Accessibility checks: none
- Parity evidence: register hook now has the same regression depth as login hook for session-confirmation behavior

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
This task improves auth-hook confidence only and does not alter runtime behavior.
