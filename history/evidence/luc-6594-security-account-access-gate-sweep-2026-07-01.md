# LUC-6594 Security And Account-Access Gate Sweep

## Status

`BLOCKED / PROTECTED_INPUT_READINESS_PARTIAL / SECURITY_ACCOUNT_ACCESS_NO_GO / API_SECURITY_BOUNDARIES_PASS / NO_SECRET_PATTERN_MATCHES`

## Scope

Read-only security verification for Soar V1 account-access readiness.

No deploy, push, restart, rollback, env edit, secret/account value readback, DB/Redis mutation, production account mutation, exchange/payment mutation, API-key mutation, order, position, subscription mutation, or live-trading action occurred.

## Threat Model

- Assets: production account-access inputs, runtime rollback/restore proof inputs, API-key credentials, auth sessions, admin/ops diagnostics, subscription entitlements, exchange access boundaries.
- Actors: authenticated users, admins, ops principals, unauthenticated callers, test runner.
- Trust boundaries: browser to API, dashboard router auth, admin/ops middleware, encrypted API-key storage, exchange connector boundary, protected runtime input environment.
- Entry points: `/dashboard/profile/*`, `/admin/*`, `/workers/*`, auth middleware, exchange capability contracts, protected input checker.
- Abuse cases: user accesses another user's account or API-key state, non-admin reads ops diagnostics, unsupported exchange operation is inferred as allowed, secret values leak into repo/evidence, release gate is passed from public smoke only.
- Required controls: server-side authz, admin/ops network gates, encrypted key storage, fail-closed exchange capability contracts, no-secret evidence.

## Evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Protected input checker regression | PASS | `pnpm run -s ops:protected-inputs:check:test` -> `7/7` |
| Current protected input readiness | FAIL closed | `history/evidence/luc-6594-security-account-access-gate-readiness-c357d957-2026-07-01.md`; `history/artifacts/luc-6594-security-account-access-gate-readiness-c357d957-2026-07-01.json` |
| Ops/auth/crypto/critical-secret tests | PASS | `4` files / `19` tests |
| Profile API-key, exchange capability/auth-read, subscription entitlement tests | PASS | `4` files / `15` tests |
| High-confidence token/private-key path scan | PASS | no matching file paths outside excluded generated evidence/artifact areas |
| Broad quoted password/api-key/secret assignment path scan | REVIEWED | broad path-only scan matched test/fixture labels and four non-test paths; sampled non-test paths contain CLI option labels, cookie names, and error codes, not secret values |

## Account-Access Gate

- Matching protected input names present: `11`.
- Account-access gate: `FAIL`.
- Missing required account-access families:
  - `ROLLBACK_GUARD_*`
  - `SOAR_PROD_*`
  - `PROD_DB_CHECK_* or PRODUCTION_DB_CHECK_*`
  - `RC_*`
  - `GATE* / GATE_*`
- Release status: `NO-GO`.

## Interpretation

The focused server-side security boundaries are implemented and verified by the current local test packets. The release/account-access gate still fails because required protected input families are absent by name in this execution shell. Public smoke, build-info, or UI evidence must not substitute for protected runtime, rollback, restore, release-candidate, or gate-approver inputs.

The static scan result is not a release pass for all secret hygiene. It means the high-confidence token/private-key path scan found no paths, while the broad generic quoted-string scan produced expected review noise in tests/fixtures plus four sampled non-test paths: `scripts/runProdSecurityExchangeProof.mjs`, `apps/web/src/middleware.ts`, `apps/api/src/modules/profile/security/security.errors.ts`, and `apps/api/src/middleware/requireTrustedOrigin.ts`. The sampled lines are option names, cookie-name checks, and error-code labels, not embedded secret values.

## Next Owner

Security/Ops protected secret owner must bind the missing protected input families through approved encrypted runtime paths. After that, QA/Ops should rerun the protected release/account proof, and DRE/QVE should rerun production smoke after the current Web/backtest-worker restoration blocker is resolved.

## Paperclip Control-Plane Caveat

Final issue disposition was attempted from this runner, but Paperclip control-plane calls timed out:

- `PATCH /api/issues/{PAPERCLIP_TASK_ID}` with evidence comment -> aborted after 15s.
- status-only `PATCH /api/issues/{PAPERCLIP_TASK_ID}` -> aborted after 8s.
- `GET /api/health` -> aborted after 5s.

On control-plane recovery, [LUC-6594](/LUC/issues/LUC-6594) should be set to `blocked` with the owner/action above if the timed-out mutation did not land.
