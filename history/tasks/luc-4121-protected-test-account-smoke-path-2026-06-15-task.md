# LUC-4121 Protected Test-Account Smoke Path

## Header

- ID: LUC-4121
- Title: [Operator][Soar] Provide protected test-account smoke path
- Task Type: release / verification
- Current Stage: verification
- Status: DONE
- Owner: QA & Verification Engineer
- Priority: critical
- Mission ID: LUC-4121-PROTECTED-TEST-ACCOUNT-SMOKE-PATH-2026-06-15
- Mission Status: VERIFIED
- Operation Mode: BUILDER

## Context

Paperclip assigned [LUC-4121](/LUC/issues/LUC-4121) to provide a protected
test-account smoke path for Soar. The prior owner-login path in
[LUC-4103](/LUC/issues/LUC-4103) was security-approved but blocked on the
pre-bound `PROD_UI_AUDIT_AUTH_TOKEN` returning HTTP `401` on `/auth/me`.

This task verifies whether the current protected test-account credentials can
produce a redaction-safe production auth smoke without exposing secrets or
mutating product state beyond login/logout session lifecycle.

## Goal

Prove the smallest protected test-account auth smoke path for current Soar
production, or fail closed with a named unblock owner/action.

## Scope

- Production Web: `https://soar.luckysparrow.ch`
- Production API: `https://api.soar.luckysparrow.ch`
- Expected production SHA:
  `9f61eb9781c323f052f95cae7cf0c1c3c71901c7`
- Existing proof runner: `pnpm run ops:prod-auth:proof`
- Protected input family used by name only:
  `PROD_UI_AUDIT_AUTH_EMAIL` + `PROD_UI_AUDIT_AUTH_PASSWORD`
- Redacted evidence:
  `history/evidence/luc-4121-prod-test-account-auth-session-browser-proof-2026-06-15.md`
  and matching JSON.

## Implementation Plan

1. Reuse existing production auth proof tooling instead of creating a parallel
   smoke path.
2. Run focused local helper tests for auth-token resolution, browser proof,
   and production UI audit redaction behavior.
3. Check protected input names/counts without printing secret values.
4. Run a redacted status-only auth probe to distinguish stale token behavior
   from protected email/password login behavior.
5. Run the production auth browser proof with process-local mapping from
   `PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` to `PROD_AUTH_EMAIL/PASSWORD`.
6. Clean up proof-owned browser process/profile artifacts.
7. Record evidence and residual release risk.

## Acceptance Criteria

- No secret values, cookies, tokens, emails, passwords, response bodies, payment
  data, API keys, exchange data, or screenshots are written to artifacts.
- Production build-info matches the expected SHA before protected proof is
  accepted.
- Authenticated dashboard proof reaches `/dashboard`; invalid token and logout
  checks fail closed.
- The proof uses existing approved runner behavior and does not introduce a
  new auth bypass or duplicate smoke system.

## Definition of Done

- [x] Existing proof runner identified.
- [x] Focused helper tests passed.
- [x] Protected input presence checked by names/counts only.
- [x] Current stale token state classified.
- [x] Protected test-account email/password path verified with redacted browser
      proof.
- [x] Browser process/profile cleanup checked and task evidence recorded.

## Forbidden

- Secret, cookie, token, email, password, response-body, private data, API-key,
  payment, exchange credential, or live-trading data disclosure.
- Production deploy, restart, rollback, env edit, database mutation,
  subscription/payment mutation, API-key mutation, exchange setting mutation,
  live order/position action, push, or commit.
- Treating a stale token as valid proof.
- Creating a parallel smoke framework when the approved runner is sufficient.

## Validation Evidence

- Focused local tests:
  - command:
    `pnpm exec node --test scripts/resolveOpsAuthToken.test.mjs scripts/runProdAuthSessionBrowserProof.test.mjs scripts/runProdUiModuleClickthroughAudit.test.mjs`
  - result: PASS, `13/13`
- Names-only protected input check:
  - command: Node env-name filter for `PROD_AUTH`, `PROD_UI_AUDIT`,
    `PROD_UI`, `SMOKE_AUTH`, `SOAR_PROD_AUTH`, `PROD_TEST`, `TEST_ACCOUNT`,
    and `SOAR_TEST`
  - result: `5` matching names, all under `PROD_UI_AUDIT_*`; no values printed.
- Protected input readiness:
  - command:
    `pnpm run -s ops:protected-inputs:check -- --today 2026-06-15 --json`
  - result: `PARTIAL / NO-GO`; `PROD_UI_AUDIT_*` and overlapping `PROD_UI_*`
    names present, release-critical runtime/readback/rollback/DB/RC/gate
    families still missing.
- Redacted auth-state probe:
  - build-info: HTTP `200`, SHA
    `9f61eb9781c323f052f95cae7cf0c1c3c71901c7`, ref `main`.
  - `PROD_UI_AUDIT_AUTH_TOKEN` `/auth/me`: HTTP `401`, `ok=false`.
  - `PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` login: HTTP `200`, token cookie
    returned.
  - `/auth/me` with login token: HTTP `200`, `ok=true`.
- Protected browser proof:
  - command:
    `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 9f61eb9781c323f052f95cae7cf0c1c3c71901c7 --today 2026-06-15 --output-json history/evidence/luc-4121-prod-test-account-auth-session-browser-proof-2026-06-15.json --output-md history/evidence/luc-4121-prod-test-account-auth-session-browser-proof-2026-06-15.md`
  - process-local env mapping: `PROD_AUTH_EMAIL/PASSWORD` from
    `PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD`; `PROD_AUTH_TOKEN` cleared so the
    stale token could not mask the login path.
  - result: PASS.
  - covered steps: build-info freshness, auth token resolved from login,
    unauthenticated dashboard redirect, authenticated dashboard rendering,
    invalid-token expired-session redirect, logout API, `/auth/me` fail-closed
    after logout, and dashboard redirect after logout.
- Cleanup:
  - proof-owned Edge root PID `41432` reported `HasExited=True`.
  - proof-owned `.tmp/prod-auth-cdp-1781478023532` profile directory removed.
  - residual WMI row for PID `41432` behaved as stale: `taskkill` returned no
    running task instance while `Get-Process` reported exited.

## Security / Privacy Evidence

- Data classification: protected auth material stayed in process environment
  only; artifacts contain names, statuses, paths, timestamps, and text lengths.
- Trust boundaries: production API/Web, browser proof profile, and repo
  evidence are separated; no response body or credential material was stored.
- Permission checks: the accepted path requires login success and `/auth/me`
  HTTP `200`; stale token HTTP `401` is explicitly rejected.
- Abuse cases covered: stale token accepted as proof, invalid token accepted by
  route, logout not invalidating session, unauthenticated dashboard access, and
  artifact data leakage.
- Fail-closed behavior: invalid token and post-logout proof both returned to
  login/HTTP `401`.
- Residual risk: this is protected auth/session smoke only. Full V1 release
  remains `NO-GO` until runtime readback, rollback, DB/restore, RC, gate
  approver, worker freshness, SLO, and release approval evidence are complete.

## Result Report

- Task summary: [LUC-4121](/LUC/issues/LUC-4121) is verified for the protected
  test-account auth smoke path using existing runner tooling and protected
  email/password refs. The stale token path remains invalid and must not be
  used as proof.
- Files changed:
  - `history/tasks/luc-4121-protected-test-account-smoke-path-2026-06-15-task.md`
  - `history/evidence/luc-4121-prod-test-account-auth-session-browser-proof-2026-06-15.md`
  - `history/evidence/luc-4121-prod-test-account-auth-session-browser-proof-2026-06-15.json`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/risk-register.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Deployment impact: none.
- Source control impact: no commit or push.
- Next steps: downstream release controller may consume this as protected
  test-account auth/session smoke evidence for SHA `9f61eb9781c3...`, while
  keeping unrelated production release gates fail-closed.
