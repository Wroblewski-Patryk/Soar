# V1 Post-V1 Auth Deploy Rerun

## Header

- ID: V1-POST-V1-AUTH-DEPLOY-RERUN-2026-05-14
- Title: Deploy logout invalidation and rerun production Auth proof
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release + QA/Test
- Depends on: `V1-POST-V1-AUTH-LOGOUT-TOKEN-REUSE-HARDENING-2026-05-14`
- Priority: P0
- Module Confidence Rows: `SOAR-AUTH-001`
- Requirement Rows: auth/session lifecycle
- Quality Scenario Rows: production auth, fail-closed session, deployment freshness
- Risk Rows: `RISK-004`
- Iteration: 2026-05-14-post-v1-hardening
- Operation Mode: TESTER
- Mission ID: POST-V1-AUTH-HARDENING
- Mission Status: VERIFIED

## Context

The local auth fix invalidated reused JWT sessions on logout via
`sessionVersion`, but production still ran `2fc90a08`. Auth could not be marked
verified until the fixed build deployed and the same production proof passed.

## Goal

Deploy the fixed branch to `main`, wait for production build-info to match, and
rerun the production auth browser/API proof.

## Scope

- Push `codex/v1-proof-and-ops-evidence` HEAD to `origin/main`.
- Wait for `https://soar.luckysparrow.ch/api/build-info` to report
  `84711599ae15e7295b2514fae649ab99e2c87ec3`.
- Rerun `pnpm run ops:prod-auth:proof` against that SHA.
- Update module confidence, risk, and project state.

## Constraints

- Do not write credentials, cookies, tokens, private headers, or response
  bodies to artifacts.
- Do not mutate application data beyond normal login/logout proof.
- Do not perform LIVE trading or exchange-side mutation.

## Definition Of Done

- Production build-info matches the fixed commit.
- Production auth proof returns `PASS`.
- `SOAR-AUTH-001` is promoted to `VERIFIED`.
- `RISK-004` is closed.

## Result Report

Result: `verified`.

Deployment:

- Pushed `84711599ae15e7295b2514fae649ab99e2c87ec3` to `origin/main`.
- `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha 84711599ae15e7295b2514fae649ab99e2c87ec3 --timeout-seconds 900 --interval-seconds 15` passed on attempt 32.

Production proof:

- `pnpm run ops:prod-auth:proof -- --expected-sha 84711599ae15e7295b2514fae649ab99e2c87ec3 --i-understand-production-auth-proof` passed.
- Evidence:
  `docs/operations/prod-auth-session-browser-proof-84711599-2026-05-14.md`.

Covered production checks:

- unauthenticated protected route redirects to `/auth/login`
- authenticated dashboard renders
- invalid-token protected route redirects to `/auth/login?session=expired`
- logout API returns `200`
- `/auth/me` after logout with the pre-logout token returns `401`
- dashboard after logout redirects to `/auth/login`

Validation:

- Previous local validation for the deployed commit passed:
  focused Auth/middleware tests (`21/21`), API typecheck, root typecheck, lint,
  build, guardrails, diff check, secret scan, and browser-process cleanup.
- Post-rerun validation passed: repository guardrails, diff check with
  LF-to-CRLF warnings only, raw temporary credential scan over touched proof
  artifacts/state files, `chrome-headless-shell` process check, and temporary
  CDP profile cleanup.
