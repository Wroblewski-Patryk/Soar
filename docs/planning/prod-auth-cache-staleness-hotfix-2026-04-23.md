# Task

## Header
- ID: PROD-AUTH-HOTFIX-2026-04-23
- Title: Prevent stale cached public auth pages from serving outdated login clients
- Status: DONE
- Owner: Frontend Builder
- Depends on: `PROD-HOTFIX web auth base-url fallback for login/runtime API calls`
- Priority: P0

## Context
Production login reports still surfaced `Could not confirm session. Please sign in again.` even after the API-base fallback hotfix was live. Fresh browser automation against production confirmed `POST /auth/login` and follow-up `GET /auth/me` both succeed with valid session cookies, while the public `/auth/login` HTML response is still served with aggressive shared-cache headers. That combination makes stale auth shells a credible recurrence path after deploys.

## Goal
Keep public auth entry pages (`/auth/login`, `/auth/register`) out of static revalidation so production users fetch a fresh auth client after deploys and do not stay pinned to outdated login code.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Login and register App Router pages explicitly opt out of static caching.
- [x] A focused regression check locks the auth page cache contract.
- [x] Canonical context documents capture the production evidence and guardrail.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/app/(public)/auth/authPageCacheContract.test.ts`, `pnpm run quality:guardrails`
- Manual checks: production `curl -I https://soar.luckysparrow.ch/auth/login`; production browser automation login with `POST /auth/login` -> `GET /auth/me` = `200`
- Screenshots/logs: terminal evidence from prod `curl` and Playwright reproduction in this task
- High-risk checks: validated that prod API login/session confirmation succeeds before treating cache staleness as the remaining failure mode

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`, `docs/engineering/local-development.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: existing production auth pages
- Required states: error | success
- Responsive checks: desktop
- Accessibility checks: none; no markup behavior changed
- Parity evidence: both login and register routes now share the same no-stale-cache contract

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
This hotfix does not change API session behavior. It hardens the public auth delivery path so already-fixed login behavior is not masked by stale cached route shells after deploy.
