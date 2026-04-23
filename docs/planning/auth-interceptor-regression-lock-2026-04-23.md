# Task

## Header
- ID: AUTH-INTERCEPTOR-REGRESSION-2026-04-23
- Title: Lock auth-me interceptor redirect behavior for 401, 429, and backend outage paths
- Status: DONE
- Owner: QA/Test
- Depends on: `AUTH-BOOTSTRAP-REGRESSION-2026-04-23`
- Priority: P1

## Context
The production auth incident ended up touching both bootstrap fetch behavior and response interceptor behavior around `/auth/me`. The current interceptor is intentionally strict on `401`, tolerant on transient backend failures, and should not treat `429` as a session-expired redirect. That contract was implicit in code but not directly locked with a focused test.

## Goal
Add a focused regression test for the shared web API interceptor so protected-route auth handling stays explicit for `401`, `429`, and repeated backend failures.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Shared API interceptor behavior is directly tested for protected-route `/auth/me` responses.
- [x] `429` is explicitly locked as non-expiring-session behavior.
- [x] Canonical context documents the regression lock.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/lib/api.test.ts src/context/AuthContext.test.tsx src/i18n/useOptionalI18n.test.tsx`
- Manual checks: none
- Screenshots/logs: none
- High-risk checks: protected-route redirect behavior is locked without changing runtime semantics

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`, `docs/engineering/testing.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing protected-route auth redirect behavior
- Required states: error | success
- Responsive checks: none
- Accessibility checks: none
- Parity evidence: regression covers the shared interceptor used by both login-confirmation and dashboard auth checks

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
This task adds direct contract coverage only. It does not broaden redirect behavior beyond the existing implementation.
