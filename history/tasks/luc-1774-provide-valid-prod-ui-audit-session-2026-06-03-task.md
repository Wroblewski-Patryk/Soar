# Task

## Header
- ID: LUC-1774
- Title: Provide valid PROD_UI_AUDIT session for protected app proof
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Security
- Depends on: LUC-1775
- Priority: P0
- Module Confidence Rows: Production UI protected proof / Auth session
- Requirement Rows: ARB-006 protected authenticated app proof
- Quality Scenario Rows: Release safety / auth-sensitive smoke
- Risk Rows: Production credential/session validity
- Iteration: 2026-06-03 security heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1774-PROD-UI-AUDIT-SESSION-VALIDITY-2026-06-03
- Mission Status: BLOCKED

## Context
[LUC-1756](/LUC/issues/LUC-1756) requires protected production app/browser
proof for ARB-006. Earlier Security approval bound `PROD_UI_AUDIT_AUTH_TOKEN`
by name, but QA/Test later proved the token was not a valid API session:
redacted `/auth/me` returned `401` and the authenticated browser proof stayed
on `/auth/login`.

## Goal
Confirm whether the current runner can provide a valid, non-expired,
least-privilege production Soar app session for read-only QA/Test proof.

## Constraints
- Do not print or persist token, cookie, email, password, private header, or
  protected response-body values.
- Do not mutate account settings, subscriptions, API keys, trading/live
  settings, exchange settings, external service state, production config, DB,
  deploy, restart, rollback, or live trading.
- Do not call logout during session-validity testing because logout increments
  `sessionVersion` and intentionally invalidates the tested session.

## Definition of Done
- [x] Current `PROD_UI_AUDIT_AUTH_TOKEN` validity checked via redacted
      `/auth/me`.
- [x] Existing approved source credential refs checked for ability to mint a
      fresh session.
- [x] If no valid session exists, first-class unblock owner/action is recorded.

## Forbidden
- Secret value readback or printing.
- Cookie/session export into comments, repo files, screenshots, generated
  artifacts, logs, or final reports.
- Reusing admin-only proof as a dashboard app user session without explicit
  approval.
- Production state mutation or release operation.

## Validation Evidence
- Tests:
  - Redacted `GET https://api.soar.luckysparrow.ch/auth/me` with current
    `PROD_UI_AUDIT_AUTH_TOKEN` cookie: `401`, no user id, no role.
  - Redacted `POST https://api.soar.luckysparrow.ch/auth/login` with
    `SMOKE_AUTH_EMAIL + SMOKE_AUTH_PASSWORD`: `400`; stored email ref is not
    email-shaped; no session token returned.
  - Redacted `GET /auth/me` with current `PROD_UI_AUDIT_ADMIN_TOKEN` cookie:
    `401`, no user id, no role.
  - Redacted `POST /auth/login` with `PROD_UI_AUDIT_ADMIN_EMAIL +
    PROD_UI_AUDIT_ADMIN_PASSWORD`: `400`; stored email ref is not email-shaped;
    no session token returned.
- Manual checks:
  - Environment names present: `PROD_UI_AUDIT_AUTH_TOKEN`,
    `PROD_UI_AUDIT_ADMIN_*`, `SMOKE_AUTH_*`, `PROD_UI_AUDIT_API_BASE_URL`,
    `PROD_UI_AUDIT_WEB_BASE_URL`.
  - No complete valid app-session credential family was available in the
    runner.
- High-risk checks:
  - No secret values, cookies, emails, passwords, response bodies, screenshots,
    or browser protected payloads were written.
  - No logout, account mutation, subscription mutation, API-key mutation,
    exchange mutation, deploy, restart, rollback, DB write, or live-trading
    action occurred.
- Module confidence ledger updated: not applicable in this heartbeat; existing
  protected UI proof remains blocked until credential binding is corrected.
- Requirements matrix updated: not applicable in this heartbeat; ARB-006 proof
  remains blocked.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: blocked

## Result Report
Security cannot supply a valid `PROD_UI_AUDIT_AUTH_TOKEN` from the currently
injected refs. The active token is expired/invalid, and the available
email/password refs are not usable login credentials because the email values
fail API validation before a session can be minted.

First-class unblock owner/action:

- Portfolio Director / board-capable secret owner must bind one fresh,
  valid, non-expired, least-privilege production Soar app session as
  `PROD_UI_AUDIT_AUTH_TOKEN`, or bind a real
  `PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD` pair that can mint
  a session. The binding must pass redacted `/auth/me` with HTTP `200` before
  QA/Test reruns protected browser proof.

Deployment impact: none.
