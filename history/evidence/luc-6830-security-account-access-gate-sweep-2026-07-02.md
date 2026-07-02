# LUC-6830 Security And Account-Access Gate Sweep

## Status

`BLOCKED / PROTECTED_INPUT_READINESS_PARTIAL / SECURITY_ACCOUNT_ACCESS_NO_GO / API_SECURITY_BOUNDARIES_PASS / REVIEWED_SECRET_PATTERN_NOISE`

## Scope

Read-only Security & Privacy Auditor verification for the Soar V1
security/account-access release gate.

No deploy, push, restart, rollback, env edit, secret/account value readback,
DB/Redis mutation, production account mutation, exchange/payment mutation,
API-key mutation, order, position, subscription mutation, or live-trading
action occurred.

## Threat Model

- Assets: protected production account-access inputs, rollback/restore proof
  inputs, API-key credentials, auth sessions, admin/ops diagnostics,
  subscription entitlements, and exchange access boundaries.
- Actors: unauthenticated callers, authenticated users, admins, ops
  principals, and the current test runner.
- Trust boundaries: browser to API, dashboard/admin auth, ops network
  middleware, encrypted API-key storage, exchange connector capability
  contracts, and protected runtime input environment.
- Abuse cases: release gate accepted from public smoke only; user reads another
  user's account/API-key state; unsupported exchange capability inferred as
  allowed; secret values leak into repo evidence; non-admin or untrusted network
  principal reads ops diagnostics.

## Evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Protected input checker regression | PASS | `pnpm run -s ops:protected-inputs:check:test` -> `7/7` |
| Current protected input readiness | FAIL closed | `history/evidence/luc-6830-security-account-access-gate-readiness-2026-07-02.md`; `history/artifacts/luc-6830-security-account-access-gate-readiness-2026-07-02.json` |
| Ops/auth/crypto/critical-secret tests | PASS | `pnpm --filter api exec vitest run src/middleware/requireRole.test.ts src/middleware/requireOpsNetwork.test.ts src/utils/crypto.test.ts src/config/criticalSecretsReadiness.test.ts --reporter=verbose` -> `4` files / `19` tests |
| Profile API-key, exchange capability/auth-read, subscription entitlement tests | PASS | `pnpm --filter api exec vitest run src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts src/modules/exchange/exchangeAuthenticatedReadContract.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/subscriptions/subscriptionEntitlements.service.test.ts --reporter=verbose` -> `4` files / `15` tests |
| High-confidence token/private-key path scan | REVIEWED | Active-code matches were `scripts/runProdSecurityExchangeProof.mjs` redaction-token pattern labels and `useHomeLiveWidgetsController.ts` local refresh counter names, not secret values. |
| Broad quoted password/api-key/secret assignment path scan | REVIEWED | Active-code sample contained test helper password defaults, UI copy labels, security error labels, and explicit `KEY_PLACEHOLDER` / `SECRET_PLACEHOLDER` placeholders, not embedded secret values. |

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

The focused server-side security boundaries remain verified locally for this
packet. The release/account-access gate still fails closed because required
protected input families are absent by name in the current execution shell.
Public build-info, public smoke, or local test success must not substitute for
protected runtime, rollback, restore, release-candidate, or gate-approver
inputs.

The current build-info SHA was not rechecked in this security heartbeat because
active Ops/QVE evidence already shows production Web/build-info returning
`503`. This packet is therefore a current shell readiness and local boundary
verification packet, not production acceptance evidence.

## Next Owner

Security/Ops protected secret owner must bind the missing protected input
families through approved encrypted runtime paths without exposing values. After
that, QA/Ops should rerun the protected release/account proof, and DRE/QVE
should rerun production smoke after the current Web/backtest-worker restoration
blocker is resolved.
