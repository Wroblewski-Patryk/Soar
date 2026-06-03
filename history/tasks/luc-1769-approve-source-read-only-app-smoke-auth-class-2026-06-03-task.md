# LUC-1769 Approve Source Read-Only App Smoke Auth Class

## Context

- Issue: LUC-1769
- Parent blocker: LUC-1766
- Stage: verification
- Role: Security Review Lead
- Existing blocker context: LUC-1761 approved `PROD_UI_AUDIT_ADMIN_*` only for non-mutating admin-route proof and did not approve it as the app/dashboard smoke class.

## Goal

Approve an existing source secret-ref class for Portfolio/Ops to bind as the read-only app/dashboard smoke auth family, or explicitly block it with the exact missing owner action.

## Constraints

- Do not print, read back, copy, or persist secret values.
- Prefer non-admin production AI/test account or session class.
- Do not expand admin credentials into app/dashboard proof.
- Stay in names and approval boundaries only.

## Definition Of Done

- Exact approved source and target env family named.
- Permitted QA route/action scope recorded.
- Forbidden mutations recorded.
- Revocation owner and cleanup expectation recorded.
- Issue disposition updated in Paperclip.

## Forbidden

- Secret value disclosure.
- Cookie/session export.
- Protected response-body capture.
- Subscription, API key, trading/live, exchange, external service, or user account mutation.
- Deploy, restart, rollback, database mutation, or live-trading action.

## Result Report

- Approved source: `SMOKE_AUTH_TOKEN`.
- Approved target binding: `PROD_UI_AUDIT_AUTH_TOKEN`.
- Not approved: `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD` as email/password target refs from this run, because the redacted email-shape check did not validate the email ref.
- Not approved: `PROD_UI_AUDIT_ADMIN_*` as app/dashboard smoke class; it remains admin-route only.
- Verification:
  - `GET /api/issues/LUC-1769/heartbeat-context` passed.
  - Names-only environment readback found `SMOKE_AUTH_TOKEN`, `SMOKE_AUTH_EMAIL`, `SMOKE_AUTH_PASSWORD`, and `PROD_UI_AUDIT_ADMIN_*` present; `PROD_UI_AUDIT_AUTH_*` and `SOAR_PROD_AUTH_*` absent.
  - Redacted shape check showed `SMOKE_AUTH_TOKEN` present/non-empty and opaque, `SMOKE_AUTH_EMAIL` present but not email-shaped, and `SMOKE_AUTH_PASSWORD` present/non-empty.
- Deployment impact: none.
- Files changed:
  - `history/evidence/luc-1769-source-read-only-app-smoke-auth-approval-2026-06-03.md`
  - `history/tasks/luc-1769-approve-source-read-only-app-smoke-auth-class-2026-06-03-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/active-mission.md`
- Source-control closure: not committed because the worktree already contains broader ARB-006 state/evidence changes from adjacent lanes.
