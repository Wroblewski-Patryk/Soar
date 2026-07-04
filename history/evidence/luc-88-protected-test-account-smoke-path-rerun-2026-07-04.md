# LUC-88 Protected Test-Account Smoke Path Rerun

## Scope

TAE rerun after the wake delta reported protected smoke access refs were bound.
The current runner exposes `SMOKE_AUTH_EMAIL` and `SMOKE_AUTH_PASSWORD` by name,
so the existing deploy smoke and runtime freshness consumers were exercised
without printing or storing secret values.

No deploy, push, restart, rollback execution, env edit, secret/account value
readback, DB/Redis mutation, production account mutation, exchange/payment
mutation, order, position, subscription mutation, or live-trading action was
performed.

## Result

`DONE / PROTECTED_TEST_ACCOUNT_PATH_VERIFIED / SECRET_REFS_REDACTED`.

The protected test-account smoke path is currently usable through
`SMOKE_AUTH_EMAIL` plus `SMOKE_AUTH_PASSWORD`. Direct `SMOKE_AUTH_TOKEN` remains
absent, preserving the fresh-login path.

## Direct Names-Only Check

| Name | Present | Length |
| --- | --- | ---: |
| `PROD_UI_AUDIT_AUTH_EMAIL` | no | 0 |
| `PROD_UI_AUDIT_AUTH_PASSWORD` | no | 0 |
| `SMOKE_AUTH_TOKEN` | no | 0 |
| `SMOKE_AUTH_EMAIL` | yes | 50 |
| `SMOKE_AUTH_PASSWORD` | yes | 35 |
| `DEPLOY_FRESHNESS_AUTH_EMAIL` | no | 0 |
| `DEPLOY_FRESHNESS_AUTH_PASSWORD` | no | 0 |
| `ROLLBACK_GUARD_AUTH_EMAIL` | no | 0 |
| `ROLLBACK_GUARD_AUTH_PASSWORD` | no | 0 |

## Redaction-Safe Smoke Proof

### Protected-Input Checker Regression

```powershell
pnpm run -s ops:protected-inputs:check:test
```

Result: `PASS`, `7/7` node test subtests.

### Production Deploy Smoke With Bound Fresh-Login Refs

```powershell
$env:SMOKE_TIMEOUT_MS='15000'
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `PASS`.

- API `/health`: `200`
- API `/ready`: `200`
- Web `/`: `200`
- Web `/api/build-info`: `200`
- API `/workers/ready`: `200`

### Runtime Freshness With Process-Local Mapping

```powershell
$env:DEPLOY_FRESHNESS_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:DEPLOY_FRESHNESS_TIMEOUT_MS='15000'
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run -s ops:deploy:runtime-freshness
```

Result: `PASS`.

- worker heartbeat age: `13933 ms`
- market data age: `13933 ms`
- runtime signal lag: `0 ms`
- running runtime sessions: `5`
- stale session ids: `[]`

## Interpretation

The requested non-dangerous protected smoke path is provided and verified for
read-only login/core smoke. Live trading, API-key changes, exchange settings,
payment, subscription, production account mutation, order, and position
mutation remain blocked unless separately approved.

# V1 Protected Input Readiness Sweep

## Context

- Evidence date: 2026-07-04
- Deployed build-info SHA: `unknown`
- Build-info readback time: `not provided`
- Scope: current execution shell only
- Secret handling: no secret values printed, copied, or stored

## Result

- Status: `PARTIAL`
- Matching protected input names present: `2`
- Account-access gate: `FAIL`
- Missing required account-access families: `ROLLBACK_GUARD_*, PROD_DB_CHECK_* or PRODUCTION_DB_CHECK_*, RC_*, GATE* / GATE_*`
- V1 release status: `NO-GO`

## Checked Input Families

| Family | Required for account-access gate | State | Matching names | Purpose |
| --- | --- | --- | --- | --- |
| `LIVEIMPORT_READBACK_*` | no | missing | 0 | Protected LIVEIMPORT-03 production runtime readback |
| `ROLLBACK_GUARD_*` | yes | missing | 0 | Protected production rollback/runtime freshness proof |
| `PROD_UI_AUDIT_*` | no | missing | 0 | Authenticated production dashboard/admin UI clickthrough |
| `PROD_UI_*` | no | missing | 0 | Legacy production UI audit input family |
| `SOAR_PROD_*` | yes | present | 2 | Production app/operator context |
| `PROD_DB_CHECK_*` | yes | missing | 0 | Production DB restore context |
| `PRODUCTION_DB_CHECK_*` | yes | missing | 0 | Alternate production DB restore context |
| `RC_*` | yes | missing | 0 | Release-candidate gate context |
| `GATE* / GATE_*` | yes | missing | 0 | Gate approver context |

## Observed Output

```text
MATCHING_PROTECTED_INPUT_NAMES_PRESENT_BUT_ACCOUNT_ACCESS_GATE_INCOMPLETE
```

## Release Impact

- The current shell can run no-secret checks only when required protected
  families are missing.
- Protected `AUD-19` evidence remains blocked until approved operator inputs
  are provided.
- Public build-info and smoke evidence must not be substituted for protected
  runtime, rollback, restore, UI, SLO, or sign-off proof.

## Next Action

Execute the current operator unblock packet only after approved protected inputs and real approver fields are available.
