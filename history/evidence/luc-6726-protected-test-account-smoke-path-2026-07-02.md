# LUC-6726 Protected Test-Account Smoke Path

Date: 2026-07-02

## Scope

QVE verification of whether Soar has a non-dangerous protected smoke path that
does not require Patryk's exchange-linked live account.

No deploy, push, restart, rollback execution, env edit, secret/account value
readback, DB/Redis mutation, production account mutation, exchange/payment
mutation, order, position, subscription mutation, or live-trading action was
performed.

## Result

`DONE / PROTECTED_TEST_ACCOUNT_PATH_PRESENT / SECRET_REFS_REDACTED /
RUNTIME_FRESHNESS_PASS / PRODUCTION_SMOKE_BLOCKED_BY_503`.

The protected smoke path is present through the project-level
`PROD_UI_AUDIT_AUTH_EMAIL` and `PROD_UI_AUDIT_AUTH_PASSWORD` secret-ref family.
This is the accepted non-dangerous account path for read-only QA smoke. The
legacy direct `SMOKE_AUTH_TOKEN` path is absent, which preserves the intended
fresh-login behavior.

Production service availability is not currently green: deploy smoke still
fails because Web root/build-info and protected `/workers/ready` return `503`.
That is already covered by the production restoration lane
[LUC-6331](/LUC/issues/LUC-6331) and does not mean the test-account path is
missing.

## Credential Boundary

Secret values, cookies, tokens, passwords, private headers, and account payloads
were not printed or stored. The validation checked names, presence, and lengths
only.

## Evidence

### Names-Only Secret Presence

```powershell
$names = 'PROD_UI_AUDIT_AUTH_EMAIL','PROD_UI_AUDIT_AUTH_PASSWORD',
  'SMOKE_AUTH_TOKEN','SMOKE_AUTH_EMAIL','SMOKE_AUTH_PASSWORD'
```

Result:

| Name | Present | Length |
| --- | --- | ---: |
| `PROD_UI_AUDIT_AUTH_EMAIL` | yes | 26 |
| `PROD_UI_AUDIT_AUTH_PASSWORD` | yes | 9 |
| `SMOKE_AUTH_TOKEN` | no | 0 |
| `SMOKE_AUTH_EMAIL` | no | 0 |
| `SMOKE_AUTH_PASSWORD` | no | 0 |

### Protected-Input Checker Regression

```powershell
pnpm run -s ops:protected-inputs:check:test
```

Result: `PASS`, `7/7` node test subtests.

### Production Deploy Smoke With Fresh-Login Mapping

```powershell
$env:SMOKE_TIMEOUT_MS='10000'
$env:SMOKE_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:SMOKE_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL`, due current production service health:

- API `/health`: `200`
- API `/ready`: `200`
- Web `/`: `503`
- Web `/api/build-info`: `503`
- API `/workers/ready`: `503`

### Runtime Freshness With Protected Credential Family

```powershell
$env:DEPLOY_FRESHNESS_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:DEPLOY_FRESHNESS_TIMEOUT_MS='10000'
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:runtime-freshness
```

Result: `PASS`.

- worker heartbeat age: `5260 ms`
- market data age: `5260 ms`
- runtime signal lag: `0 ms`
- running runtime sessions: `5`

## Interpretation

The protected test-account smoke path is provided and reusable for QA as an
environment-only fresh-login binding. It is safe for read-only smoke and core
flow verification. Live trading, API-key changes, exchange settings, payment,
subscription, and production account mutations remain blocked unless separately
approved.

Current production smoke cannot be accepted until [LUC-6331](/LUC/issues/LUC-6331)
restores or rolls back `soar-web` and `workers-backtest`.

## Source Control

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Worktree: already dirty/divergent before this heartbeat.
- Git relation: `main...origin/main [ahead 22, behind 3]`
- Commit: not created; this heartbeat added only scoped evidence/task/state
  notes and should not be mixed into the existing dirty release bundle.

