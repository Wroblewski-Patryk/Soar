# LUC-243 Protected Production Input Inventory

## Summary

- Issue: [LUC-243](/LUC/issues/LUC-243)
- Date: 2026-07-10
- Role: 09 DRE
- Scope: names-only protected production input inventory for release audit tooling.
- Runtime boundary: no deploy, push, restart, rollback execution, env mutation, DB/Redis mutation, protected smoke execution, secret readback, account mutation, exchange/payment/subscription mutation, order, position, or live-trading action.
- Secret handling: binding names/classes only. No values, cookies, tokens, passwords, account data, or screenshots captured.

## Affected Capability Chain

| Capability | Chain | Files and tools reviewed | Current proof state |
| --- | --- | --- | --- |
| Release audit tooling evidence chain | `CHAIN-RELEASE-AUDIT-TOOLING` / `CAP-007` | `scripts/checkProtectedInputReadiness.mjs`, `scripts/checkOperatorUnblockPacket.mjs`, `scripts/runV1FinalPreflight.mjs`, `scripts/deploySmokeCheck.mjs`, `scripts/checkPostDeployRuntimeFreshness.mjs`, `scripts/evaluateRollbackGuard.mjs`, `scripts/runRollbackProofEvidence.mjs`, `scripts/waitForWebBuildInfo.mjs` | Inventory complete locally; protected execution remains gate-controlled. |

## Names-Only Inventory

| Input family | Safe names/classes | Required for account-access gate | Proof surface | Read-only or approval-gated | Owner action when missing |
| --- | --- | --- | --- | --- | --- |
| Production app/operator context | `SOAR_PROD_*`, including app/API base URL and approved test account refs such as `SOAR_PROD_TEST_EMAIL` / `SOAR_PROD_TEST_PASSWORD` | Yes | Production smoke context, protected app/browser proof, protected `/ready/details` and related app proof helpers | Protected execution is [LUC-241](/LUC/issues/LUC-241)-class gated when auth/session/account access is needed | Board-capable secrets/Ops owner binds encrypted refs in the approved runner; DRE/QVE reruns proof after names are present. |
| Deploy smoke protected auth | `SMOKE_AUTH_TOKEN` or `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD`, optional `SMOKE_OPS_BASIC_*` or `SMOKE_OPS_AUTH_HEADER_*` | No for account-access gate, required for protected worker readiness | `pnpm run ops:deploy:smoke -- --api-base-url <api> --web-base-url <web> --expected-sha <sha>`; checks `/health`, `/ready`, Web `/`, Web `/api/build-info`, and protected `/workers/ready` | Public portions are read-only; protected worker readiness is auth-gated | Provide approved auth refs or run with `--skip-workers` only when explicitly documenting that protected worker readiness was not proven. |
| Runtime freshness | `DEPLOY_FRESHNESS_AUTH_TOKEN` or `DEPLOY_FRESHNESS_AUTH_EMAIL` + `DEPLOY_FRESHNESS_AUTH_PASSWORD`, optional `DEPLOY_FRESHNESS_OPS_BASIC_*` or `DEPLOY_FRESHNESS_OPS_AUTH_HEADER_*` | No | `pnpm run ops:deploy:runtime-freshness -- --base-url <api>`; checks `/workers/runtime-freshness` | Read-only but protected-auth gated | Bind approved protected auth refs; stop on 401/403/503 or non-`PASS` payload. |
| Rollback guard | `ROLLBACK_GUARD_API_BASE_URL`, `ROLLBACK_GUARD_AUTH_TOKEN` or `ROLLBACK_GUARD_AUTH_EMAIL` + `ROLLBACK_GUARD_AUTH_PASSWORD`, optional `ROLLBACK_GUARD_OPS_BASIC_*` or `ROLLBACK_GUARD_OPS_AUTH_HEADER_*` | Yes | `pnpm run ops:deploy:rollback-guard -- --base-url <api>` and `pnpm run ops:deploy:rollback-proof:prod -- --base-url <api> --expected-sha <sha>` | Read-only evaluation, but production rollback execution is forbidden without separate approval | Bind rollback guard refs. DRE may evaluate guard read-only; any restart, rollback, or lifecycle mutation needs explicit board gate. |
| LIVEIMPORT readback | `LIVEIMPORT_READBACK_API_BASE_URL`, `LIVEIMPORT_READBACK_WEB_BASE_URL`, `LIVEIMPORT_READBACK_AUTH_TOKEN` or `LIVEIMPORT_READBACK_AUTH_EMAIL` + `LIVEIMPORT_READBACK_AUTH_PASSWORD`, optional `LIVEIMPORT_READBACK_OPS_BASIC_*` / `LIVEIMPORT_READBACK_OPS_AUTH_HEADER_*`, `LIVEIMPORT_READBACK_BOT_ID`, `LIVEIMPORT_READBACK_SESSION_ID`, `LIVEIMPORT_READBACK_SYMBOLS`, `LIVEIMPORT_READBACK_EXPECTED_SHA`, `LIVEIMPORT_READBACK_OUTPUT` | No | `pnpm run ops:liveimport:readback` | Read-only collector, but protected trading/account context is gated; LIVE mutation is outside this inventory | Security/Ops/Trading bind read-only refs and expected target identifiers; separate approval is required for any LIVE submit/cancel/close or account mutation. |
| Production UI audit | `PROD_UI_AUDIT_AUTH_TOKEN` or `PROD_UI_AUDIT_AUTH_EMAIL` + `PROD_UI_AUDIT_AUTH_PASSWORD`; `PROD_UI_AUDIT_ADMIN_TOKEN` or `PROD_UI_AUDIT_ADMIN_EMAIL` + `PROD_UI_AUDIT_ADMIN_PASSWORD` | No | `pnpm run ops:ui:prod-clickthrough`, `pnpm run ops:prod-auth:proof`, related protected browser packets | Protected browser proof is [LUC-241](/LUC/issues/LUC-241)-class gated | QA/Ops binds approved non-mutating test/admin refs; artifacts must be redacted. |
| Legacy UI audit | `PROD_UI_*` | No | Legacy production UI proof helpers and compatibility checks | Protected browser/auth gated | Prefer current `PROD_UI_AUDIT_*`; keep legacy refs only if a current helper still requires them. |
| Production DB/restore context | `PROD_DB_CHECK_CONTAINER`, `PROD_DB_CHECK_USER`, `PROD_DB_CHECK_NAME`; or `PRODUCTION_DB_CHECK_CONTAINER`, `PRODUCTION_DB_CHECK_USER`, `PRODUCTION_DB_CHECK_NAME` | Yes, one complete family required | `pnpm run ops:db:backup-verify:prod`, `pnpm run ops:db:restore-drill:prod`, release preflight and gate checks | Read-only/restore-drill proof can be sensitive and must follow Ops approval; no DB mutation from this issue | Ops Release Lead binds names through encrypted refs and approves any prod restore drill profile. |
| Release-candidate and gate context | `RC_*`, `GATE*` / `GATE_*`, release owner names and approver fields | Yes | `pnpm run ops:rc:gates:*`, `pnpm run ops:release:v1:preflight`, `pnpm run ops:release:v1:gate` | Local evidence checks are read-only; sign-off and production release actions need owner/board approval | PM/Ops/RC owner supplies named approvers and sign-off refs without raw secrets. |
| Build provenance | `RELEASE_GATE_EXPECTED_SHA`, `SMOKE_EXPECTED_SHA`, `WEB_BUILD_INFO_URL`, `WEB_BASE_URL`, or command `--expected-sha` / `--web-base-url` | No, but release-critical | `pnpm run ops:deploy:wait-web-build-info -- --web-base-url <web> --expected-sha <sha>` and Web `/api/build-info` | Public read-only when no private headers are required | DRE records exact source commit and target build-info SHA before protected proof. |

## Stop Conditions

- Stop immediately if a command would print or persist a secret value, cookie, bearer token, password, account password, API key, payment data, exchange credential, or full production account record.
- Stop on missing protected auth/session refs for protected routes; report the missing binding family by name only.
- Stop before deploy, production restart, rollback, env edit, DB/Redis mutation, account mutation, exchange/payment/subscription mutation, order, position, or live-trading action unless a separate explicit approval gate exists.
- Stop on mismatched build-info SHA, stale target SHA, non-`PASS` runtime freshness/rollback payload, or 401/403/503 auth/dependency failure; record as blocked evidence, not as pass.

## Redaction Rules

- Evidence may include variable names, counts, HTTP statuses, endpoint names, script names, timestamps, build SHAs, and redacted file paths.
- Evidence must not include raw variable values, auth headers, cookies, tokens, passwords, account identifiers beyond approved redacted IDs, exchange credentials, or production data payloads with user-sensitive fields.
- JSON/Markdown artifacts must store `present`/`missing` and counts only for protected input readiness.

## Current Readiness Result

`corepack pnpm run ops:protected-inputs:check` returned:

```text
Protected input readiness: PARTIAL
- Matching protected input names present: 3
- LIVEIMPORT_READBACK_*: missing (0)
- ROLLBACK_GUARD_*: missing (0)
- PROD_UI_AUDIT_*: missing (0)
- PROD_UI_*: missing (0)
- SOAR_PROD_*: present (3)
- PROD_DB_CHECK_*: missing (0)
- PRODUCTION_DB_CHECK_*: missing (0)
- RC_*: missing (0)
- GATE* / GATE_*: missing (0)
```

## Disposition

- Inventory work can proceed and is complete as read-only Ops proof.
- Protected production execution is still [LUC-241](/LUC/issues/LUC-241)-class gated because the required binding families are incomplete.
- Missing required account-access families: `ROLLBACK_GUARD_*`, `PROD_DB_CHECK_* or PRODUCTION_DB_CHECK_*`, `RC_*`, and `GATE* / GATE_*`.
- Additional missing proof families: `LIVEIMPORT_READBACK_*`, `PROD_UI_AUDIT_*`, and `PROD_UI_*`.

## Validation

- `corepack pnpm run ops:protected-inputs:check`: pass, result `PARTIAL`.
- `corepack pnpm run ops:protected-inputs:check:test`: pass, `7/7`.
- `git diff --check`: pending at packet creation time; final task record contains the closure result.
