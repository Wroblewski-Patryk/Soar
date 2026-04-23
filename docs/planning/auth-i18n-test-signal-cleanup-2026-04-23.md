# Task

## Header
- ID: AUTH-I18N-TEST-SIGNAL-2026-04-23
- Title: Align optional i18n auth tests with auth-route namespace context
- Status: DONE
- Owner: QA/Test
- Depends on: `AUTH-INTERCEPTOR-REGRESSION-2026-04-23`
- Priority: P2

## Context
The focused auth regression pack was green, but `useOptionalI18n.test.tsx` still emitted a missing-namespace warning because the provider-backed test rendered at `/` while asserting an auth translation key. That warning was noise rather than a product issue.

## Goal
Keep the auth-focused i18n regression pack quiet by rendering the provider-backed optional i18n test under an auth route that loads the expected namespace.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] The auth-focused optional i18n test runs under an auth route context.
- [x] The focused auth regression pack stays green without the previous namespace warning.
- [x] Canonical context notes the cleanup so the signal-improvement work is traceable.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/i18n/useOptionalI18n.test.tsx src/lib/api.test.ts src/context/AuthContext.test.tsx`
- Manual checks: none
- Screenshots/logs: none
- High-risk checks: test signal only; no runtime behavior change

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/engineering/testing.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: auth-route namespace loading contract
- Required states: success
- Responsive checks: none
- Accessibility checks: none
- Parity evidence: test now matches the real `/auth/*` namespace-loading route context

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
This task improves test signal only and intentionally leaves runtime code untouched.
