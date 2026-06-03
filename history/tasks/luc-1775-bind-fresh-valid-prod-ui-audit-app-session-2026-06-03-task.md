# Task

## Header
- ID: LUC-1775
- Title: Bind fresh valid PROD_UI_AUDIT app session
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Portfolio Director
- Depends on: board-capable credential owner action
- Priority: P0
- Module Confidence Rows: Production UI protected proof / Auth session
- Requirement Rows: ARB-006 protected authenticated app proof
- Quality Scenario Rows: Release safety / auth-sensitive smoke
- Risk Rows: Production credential/session validity
- Iteration: 2026-06-03 portfolio heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-1775-PROD-UI-AUDIT-FRESH-SESSION-BINDING-2026-06-03
- Mission Status: BLOCKED

## Context
[LUC-1774](/LUC/issues/LUC-1774) escalated to Portfolio after Security proved
the current `PROD_UI_AUDIT_AUTH_TOKEN` is present but invalid for protected
production app proof. [LUC-1756](/LUC/issues/LUC-1756) cannot rerun ARB-006
protected browser/API proof until a fresh, valid, non-expired, least-privilege
production Soar app session is bound.

## Goal
Bind or verify one accepted read-only production app proof credential family:

- preferred: fresh `PROD_UI_AUDIT_AUTH_TOKEN` passing redacted `GET /auth/me`
  with HTTP `200`;
- alternative: real `PROD_UI_AUDIT_AUTH_EMAIL +
  PROD_UI_AUDIT_AUTH_PASSWORD` pair that can mint a fresh token and then pass
  redacted `/auth/me` with HTTP `200`.

## Constraints
- Do not print or persist token, cookie, email, password, private header, or
  protected response-body values.
- Do not mutate account settings, subscriptions, API keys, trading/live
  settings, exchange settings, external service state, production config, DB,
  deploy, restart, rollback, or live trading.
- Do not call logout during validation because logout increments
  `sessionVersion` and invalidates the reusable proof token.

## Definition of Done
- [x] Current target token was redacted-validated against `/auth/me`.
- [x] Previously approved source token was redacted-validated against
      `/auth/me`.
- [x] Email/password alternative was checked for viability by shape only.
- [x] Paperclip secret-store access was checked without secret value readback.
- [x] If no valid binding path exists in this runner, a named unblock
      owner/action is recorded.

## Forbidden
- Secret value readback or printing.
- Cookie/session export into comments, repo files, screenshots, generated
  artifacts, logs, or final reports.
- Reusing admin-only proof as dashboard app proof without explicit approval.
- Production state mutation or release operation.

## Validation Evidence
- Tests:
  - Redacted `GET https://api.soar.luckysparrow.ch/auth/me` with current
    `PROD_UI_AUDIT_AUTH_TOKEN` cookie: HTTP `401`, no user id, no role.
  - Redacted `GET https://api.soar.luckysparrow.ch/auth/me` with current
    `SMOKE_AUTH_TOKEN` cookie: HTTP `401`, no user id, no role.
- Manual checks:
  - Names-only env readback found `PROD_UI_AUDIT_API_BASE_URL`,
    `PROD_UI_AUDIT_WEB_BASE_URL`, `PROD_UI_AUDIT_AUTH_TOKEN`,
    `SMOKE_AUTH_TOKEN`, `SMOKE_AUTH_EMAIL`, and `SMOKE_AUTH_PASSWORD`
    present.
  - `SMOKE_AUTH_EMAIL` is present but not email-shaped, so the
    email/password alternative remains unusable in this runner.
  - Paperclip `GET /api/companies/{companyId}/secrets` returned HTTP `403`,
    confirming this Portfolio runner cannot list or bind company secrets.
- High-risk checks:
  - No secret values, cookies, emails, passwords, response bodies,
    screenshots, or browser protected payloads were written.
  - No logout, account mutation, subscription mutation, API-key mutation,
    exchange mutation, deploy, restart, rollback, DB write, or live-trading
    action occurred.
- Module confidence ledger updated: not applicable in this heartbeat; protected
  UI proof remains blocked until credential binding is corrected.
- Requirements matrix updated: not applicable in this heartbeat; ARB-006 proof
  remains blocked.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: blocked

## Result Report
Portfolio cannot complete the requested binding in this runner. The current
target token and the previously approved source token both fail redacted
`/auth/me` with HTTP `401`, the available email/password source is not
email-shaped, and this runner lacks board secret-store access (`403` on company
secrets metadata).

First-class unblock owner/action:

- Board-capable credential owner or operator must create or obtain a fresh,
  valid, non-expired, least-privilege production Soar app session and bind it
  as `PROD_UI_AUDIT_AUTH_TOKEN`, or bind a real
  `PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD` pair that can mint
  a fresh token. The owner must prove redacted `GET /auth/me` returns HTTP
  `200` with user identity and role presence only, without exposing secret
  values or protected response bodies.

Deployment impact: none.
