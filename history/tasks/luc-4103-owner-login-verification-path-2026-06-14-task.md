# LUC-4103 Owner Login Verification Path

## Header

- ID: LUC-4103
- Title: [Operator][Soar] Provide owner-login verification path
- Task Type: security/release-gate
- Current Stage: verification
- Status: IN_REVIEW
- Owner: Security & Privacy Auditor
- Priority: critical
- Mission ID: LUC-4103-OWNER-LOGIN-VERIFICATION-PATH-2026-06-14
- Operation Mode: BUILDER

## Context

Paperclip assigned [LUC-4103](/LUC/issues/LUC-4103) to provide an approved
owner-login verification method for Soar. The issue requires a path that lets
Paperclip prove Patryk can log in and inspect required workflows without
exposing private exchange data, API keys, cookies, tokens, payment data, or
response bodies.

Prior related evidence exists under [LUC-3409](/LUC/issues/LUC-3409), where
Security approved a redacted proof path but the available
`PROD_UI_AUDIT_AUTH_TOKEN` returned HTTP `401` on `/auth/me`. This checkpoint
refreshes the same path against the current production build.

## Goal

Provide the smallest security-approved owner-login verification path and
classify the current protected auth state without disclosing secret values or
mutating production.

## Scope

- Paperclip issue: [LUC-4103](/LUC/issues/LUC-4103)
- Current production build-info:
  `9f61eb9781c323f052f95cae7cf0c1c3c71901c7` on `main`, checked at
  `2026-06-14T21:48:42.315Z`
- Existing proof runner: `pnpm run ops:prod-auth:proof`
- Existing helper tests:
  - `scripts/resolveOpsAuthToken.test.mjs`
  - `scripts/runProdAuthSessionBrowserProof.test.mjs`

## Implementation Plan

1. Reuse the already-approved [LUC-3409](/LUC/issues/LUC-3409) owner-login
   proof path instead of creating a parallel process.
2. Refresh the public build-info target.
3. Run focused local helper tests for redacted production auth proof tooling.
4. Run protected-input names/counts readiness without value disclosure.
5. Run a status-only `/auth/me` check if `PROD_UI_AUDIT_AUTH_TOKEN` is present.
6. Publish an issue document and structured Paperclip interaction for the
   operator-approved path selection.

## Acceptance Criteria

- Credentials are consumed only through protected runtime inputs, a supervised
  operator browser proof, or an already-redacted artifact.
- Artifacts and comments contain only redacted target, route/status/path, and
  summary information.
- The current proof session is not treated as valid unless `/auth/me` returns
  HTTP `200`.
- The next owner/action is explicit in Paperclip.

## Definition of Done

- [x] Existing proof runner identified.
- [x] Focused helper tests pass.
- [x] Public production target refreshed.
- [x] Protected input family presence checked by names/counts only.
- [x] Current session validity checked with status-only output.
- [x] Issue has a real waiting path for owner/operator method selection.

## Forbidden

- Secret, cookie, token, email, password, header, payment, exchange credential,
  API-key, or response-body disclosure.
- Production account mutation, subscription/payment mutation, API-key mutation,
  exchange settings mutation, live runtime mutation, live order/position action,
  deploy, restart, rollback, database mutation, push, or commit.
- Treating an expired or invalid session reference as accepted owner-login
  proof.

## Validation Evidence

- Public build-info:
  - command: `GET https://soar.luckysparrow.ch/api/build-info`
  - result: `gitSha=9f61eb9781c323f052f95cae7cf0c1c3c71901c7`,
    `gitRef=main`, `checkedAt=2026-06-14T21:48:42.315Z`
- Local helper proof:
  - command: `pnpm exec node --test scripts/resolveOpsAuthToken.test.mjs scripts/runProdAuthSessionBrowserProof.test.mjs`
  - result: PASS, `9/9`
- Names-only auth input check:
  - command: Node env-name filter for `PROD_AUTH`, `PROD_UI_AUDIT`,
    `PROD_UI`, `SMOKE_AUTH`, and `SOAR_PROD_AUTH`
  - result: `11` matching names, no values printed.
- Protected input readiness:
  - command: `pnpm run -s ops:protected-inputs:check -- --today 2026-06-14 --expected-sha 9f61eb9781c323f052f95cae7cf0c1c3c71901c7 --git-ref main --build-info-checked-at 2026-06-14T21:48:42.315Z --json`
  - result: `PARTIAL`, `NO-GO`; `PROD_UI_AUDIT_*` / `PROD_UI_*` present,
    release-critical runtime, rollback, DB, RC, gate, and `SOAR_PROD_*`
    families still missing.
- Redacted session validity probe:
  - command: Node `GET /auth/me` using `PROD_UI_AUDIT_AUTH_TOKEN`, printing
    input name, presence, status, and ok flag only.
  - result: HTTP `401`, `ok=false`.

## Security-Approved Verification Path

Preferred path:

1. Bind a fresh, short-lived, least-privilege read-only owner proof session as
   `PROD_UI_AUDIT_AUTH_TOKEN` through Paperclip secrets or the approved
   encrypted runtime store.
2. Before browser proof, perform a redacted `/auth/me` status check and proceed
   only on HTTP `200`.
3. Run:
   `pnpm run ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 9f61eb9781c323f052f95cae7cf0c1c3c71901c7 --today 2026-06-14`
4. Accept only redacted artifacts that contain build-info, route/status/path,
   redirect, logout, and text-length summaries.

Equivalent allowed alternatives:

- supervised browser proof with Patryk present, where Paperclip records only
  redacted route/status evidence;
- an existing redacted owner-login artifact, if it names the production SHA,
  timestamp, proof scope, no-secret handling, and inspected workflow coverage.

## Security / Privacy Evidence

- Data classification: protected account/session material exists only in
  protected runtime inputs; this task records names/counts/status only.
- Trust boundaries: browser session, production API, Paperclip secret store,
  and issue comments/artifacts remain separated.
- Permission or ownership checks: owner proof must be read-only and
  least-privilege; protected proof cannot start on HTTP `401`.
- Abuse cases: stale token accepted as proof, screenshot/body leakage,
  exchange/private-data exposure, and unauthorized mutation.
- Secret handling: no secret values, cookies, headers, response bodies, account
  emails, or passwords were printed, copied, stored, or committed.
- Fail-closed behavior: current token state is invalid (`401`), so production
  owner-login proof remains blocked until a fresh valid method is selected.
- Residual risk: owner-login acceptance cannot be completed until the
  operator/board selects a method and provides a valid protected session,
  supervised proof, or equivalent redacted artifact.

## Result Report

- Task summary: the owner-login verification path is security-approved for
  [LUC-4103](/LUC/issues/LUC-4103), reusing the [LUC-3409](/LUC/issues/LUC-3409)
  process and current production SHA. The current token reference is not valid
  proof because `/auth/me` returned HTTP `401`.
- Files changed:
  - `history/tasks/luc-4103-owner-login-verification-path-2026-06-14-task.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `.agents/state/risk-register.md`
- Paperclip artifacts:
  - [LUC-4103](/LUC/issues/LUC-4103) issue document
    `owner-login-verification-path`
  - [LUC-4103](/LUC/issues/LUC-4103) ask-user-questions interaction for
    method selection.
- Deployment impact: none.
- Source control impact: no commit or push.
- Next owner/action: operator or board-capable credential owner must select
  one approved method and provide a fresh valid owner proof session, supervised
  proof, or equivalent redacted artifact. Downstream owner-login acceptance
  proof remains fail-closed until then.
