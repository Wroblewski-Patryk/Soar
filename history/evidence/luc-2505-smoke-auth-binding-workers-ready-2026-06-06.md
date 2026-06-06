# LUC-2505 Smoke Auth Binding Workers Ready Evidence - 2026-06-06

## Summary

- Issue: [LUC-2505](/LUC/issues/LUC-2505)
- Parent blocker: [LUC-1438](/LUC/issues/LUC-1438)
- Role: Security and Privacy Auditor
- Date: 2026-06-06
- Reality status: blocked

## Scope

Validate whether the current production smoke auth bindings are accepted by
Soar API auth for read-only `GET /workers/ready`, without printing or storing
secret values.

## Binding Presence

Names-only environment check found these bindings present in this run:

| Binding | Status |
| --- | --- |
| `SMOKE_AUTH_TOKEN` | present |
| `SMOKE_AUTH_EMAIL` | present |
| `SMOKE_AUTH_PASSWORD` | present |
| `PROD_UI_AUDIT_AUTH_TOKEN` | present |
| `PROD_UI_AUDIT_ADMIN_TOKEN` | present |
| `PROD_UI_AUDIT_ADMIN_EMAIL` | present |
| `PROD_UI_AUDIT_ADMIN_PASSWORD` | present |

No secret values, cookies, tokens, passwords, account-private data, payment
data, or exchange credentials were written to this artifact.

## Verification

### Supported smoke token binding

Command:

```powershell
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 56d8d440bfe0fd9ee692e9f669e35414d85d2493
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`, git SHA `56d8d440bfe0fd9ee692e9f669e35414d85d2493`
- FAIL API `/workers/ready` -> `401`

### Supported smoke email/password login binding

Command used the existing `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD` while
clearing only the process-local `SMOKE_AUTH_TOKEN` variable.

Result:

- FAIL before endpoint sweep: `/auth/login` returned `400 Validation failed`

### Admin audit token mapped to smoke token

Command mapped process-local `PROD_UI_AUDIT_ADMIN_TOKEN` to
`SMOKE_AUTH_TOKEN` for this run only.

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`, git SHA `56d8d440bfe0fd9ee692e9f669e35414d85d2493`
- FAIL API `/workers/ready` -> `401`

### Admin audit email/password mapped to smoke login

Command mapped process-local `PROD_UI_AUDIT_ADMIN_EMAIL` and
`PROD_UI_AUDIT_ADMIN_PASSWORD` to the smoke login names while clearing only the
process-local `SMOKE_AUTH_TOKEN` variable.

Result:

- FAIL before endpoint sweep: `/auth/login` returned `400 Validation failed`

## Security Review

- Endpoint contract reviewed: `apps/api/src/router/index.ts`.
- `GET /workers/ready` is protected by `requireAuth`, `requireRole('ADMIN')`,
  and `requireOpsNetwork`.
- Smoke runner reviewed: `scripts/deploySmokeCheck.mjs` resolves
  `SMOKE_AUTH_TOKEN` first, otherwise logs in using `SMOKE_AUTH_EMAIL` +
  `SMOKE_AUTH_PASSWORD`, then sends the bearer token to `/workers/ready`.
- Unauthenticated or invalid-auth access remains fail-closed at `401`.
- No product code, deploy configuration, account state, subscription state,
  exchange state, API keys, database state, or live-trading setting was mutated.

## Disposition

Blocked. The supported smoke binding names now exist, but none of the available
token or login bindings is accepted by Soar API auth for read-only
`GET /workers/ready`.

Required unblock owner/action: board-capable Security/Ops secret-store owner
must rotate or provision a production-smoke appropriate `ADMIN` principal or
session accepted by Soar API auth, then expose it to the QA/Ops smoke runtime
through exactly one supported path:

- `SMOKE_AUTH_TOKEN`; or
- `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD`.

After the valid binding is installed, wake [LUC-1438](/LUC/issues/LUC-1438) for
the worker-included smoke rerun.
