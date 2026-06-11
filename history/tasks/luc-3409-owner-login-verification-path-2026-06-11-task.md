# LUC-3409 Owner Login Verification Path

## Header

- ID: LUC-3409
- Title: [Operator][Soar] Provide owner-login verification path
- Task Type: security/release-gate
- Current Stage: verification
- Status: IN_REVIEW
- Owner: Security & Privacy Auditor
- Priority: critical
- Mission ID: LUC-3409-OWNER-LOGIN-VERIFICATION-PATH-2026-06-11
- Operation Mode: BUILDER

## Context

Paperclip assigned [LUC-3409](/LUC/issues/LUC-3409) after the PM queue
surfaced an owner-login verification blocker for Soar. The latest PM comment
states that [LUC-3375](/LUC/issues/LUC-3375) should remain blocked until the
owner-login verification path is accepted or replaced by an equivalent redacted
proof path.

## Goal

Define the smallest security-approved owner-login verification path that lets
Paperclip prove the Soar owner can log in and inspect required workflows without
exposing secrets, cookies, payment data, exchange credentials, API keys, or
private response bodies.

## Scope

- Paperclip issue: [LUC-3409](/LUC/issues/LUC-3409)
- Downstream gate: [LUC-3375](/LUC/issues/LUC-3375)
- Existing proof runner: `pnpm run ops:prod-auth:proof`
- Existing helper tests:
  - `scripts/resolveOpsAuthToken.test.mjs`
  - `scripts/runProdAuthSessionBrowserProof.test.mjs`
- Current production target from [LUC-3375](/LUC/issues/LUC-3375):
  `56d8d440bfe0fd9ee692e9f669e35414d85d2493` on `main`

## Implementation Plan

1. Acknowledge the PM queue disposition and keep the work scoped to secure
   owner-login verification.
2. Inspect the existing protected-input and production-auth proof scripts.
3. Run no-secret checks for current protected input names and proof helper
   behavior.
4. Run a redacted session-validity probe that records only HTTP status.
5. Publish an issue document with the approved path and forbidden actions.
6. Move the issue to a real waiting path for operator/board confirmation.

## Acceptance Criteria

- The path consumes credentials only through protected runtime inputs or a
  supervised operator browser session.
- Artifacts store only redacted status/path summaries; no secret values,
  cookies, tokens, emails, passwords, headers, or response bodies are written.
- The current session state is classified without revealing values.
- The next owner/action is explicit.

## Definition of Done

- [x] Existing proof runner identified and verified by focused helper tests.
- [x] Protected input family presence checked by names/counts only.
- [x] Current session validity checked with status-only output.
- [x] Security-approved path documented on [LUC-3409](/LUC/issues/LUC-3409).
- [x] Issue moved to a clear waiting disposition with a Paperclip interaction.

## Forbidden

- Secret, cookie, token, email, password, header, payment, exchange credential,
  or response-body disclosure.
- Production account mutation, subscription/payment mutation, API-key mutation,
  exchange settings mutation, live runtime mutation, live order/position action,
  deploy, restart, rollback, database mutation, push, or commit.
- Treating an invalid or expired session reference as successful owner-login
  proof.

## Validation Evidence

- Protected input readiness:
  - command: `pnpm run -s ops:protected-inputs:check -- --today 2026-06-11 --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --git-ref main --build-info-checked-at 2026-06-11T02:20:26.743Z --json`
  - result: `PARTIAL`, `NO-GO`, `6` matching protected input names; only
    `PROD_UI_AUDIT_*` / `PROD_UI_*` present.
- Names-only auth input check:
  - command: Node env-name filter for `PROD_AUTH`, `PROD_UI_AUDIT`,
    `PROD_UI`, `SMOKE_AUTH`, and `SOAR_PROD_AUTH`
  - result: `PROD_UI_AUDIT_AUTH_TOKEN`,
    `PROD_UI_AUDIT_API_BASE_URL`, `PROD_UI_AUDIT_WEB_BASE_URL`,
    `PROD_UI_AUDIT_ADMIN_*`, and `SMOKE_AUTH_*` names present.
- Local helper proof:
  - command: `pnpm exec node --test scripts/resolveOpsAuthToken.test.mjs scripts/runProdAuthSessionBrowserProof.test.mjs`
  - result: PASS, `9/9`.
- Redacted session validity probe:
  - command: Node `GET /auth/me` using `PROD_UI_AUDIT_AUTH_TOKEN`, printing
    input name and status only.
  - result: HTTP `401`, `ok=false`.

## Security-Approved Verification Path

Preferred path:

1. Bind a fresh, short-lived, least-privilege read-only owner proof session as
   `PROD_UI_AUDIT_AUTH_TOKEN` through Paperclip secrets or the approved
   encrypted runtime store.
2. Before running browser proof, perform a redacted `/auth/me` status check and
   proceed only on HTTP `200`.
3. Run:
   `pnpm run ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493 --today 2026-06-11`
4. Accept only redacted artifacts that contain build-info, route/status/path,
   redirect, logout, and text-length summaries.

Equivalent allowed alternatives:

- supervised browser proof with Patryk present, where Paperclip records only
  redacted route/status evidence;
- an existing redacted owner-login artifact, if it names the production SHA,
  timestamp, proof scope, and no-secret handling.

## Result Report

- Task summary: the owner-login verification path is security-approved, but the
  current `PROD_UI_AUDIT_AUTH_TOKEN` reference is not valid (`/auth/me` returned
  `401`), so protected acceptance proof cannot run yet.
- Files changed:
  - `history/tasks/luc-3409-owner-login-verification-path-2026-06-11-task.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/next-steps.md`
  - `.agents/state/risk-register.md`
- Paperclip artifacts:
  - [LUC-3409](/LUC/issues/LUC-3409) issue document
    `owner-login-verification-path`
  - [LUC-3409](/LUC/issues/LUC-3409) request-confirmation interaction for the
    operator/board choice.
- Deployment impact: none.
- Source control impact: no commit or push.
- Next owner/action: operator or board-capable credential owner must accept the
  path and bind a fresh valid owner proof session, or provide a supervised
  proof/equivalent redacted artifact. Until then [LUC-3375](/LUC/issues/LUC-3375)
  remains fail-closed.
