# LUC-6424 Authenticated Production Acceptance And Performance Sweep

## Status

- Result: **BLOCKED / PRODUCTION_WEB_503 / WORKERS_READY_503 / AUTHENTICATED_ACCEPTANCE_NOT_EXECUTABLE / ROLLBACK_GUARD_ACTION_REQUIRED**
- Environment: production
- Evidence date: 2026-06-30
- Scope: QVE read-only production acceptance and performance sweep.

## Safety Boundary

- No deploy, push, restart, rollback execution, env edit, secret/account readback,
  production DB/Redis mutation, exchange/payment mutation, order, position,
  subscription/payment mutation, or live-trading action occurred.
- Production auth bindings were used only through approved environment variable
  names. Secret values, cookies, tokens, passwords, payment data, and account
  data were not printed or stored.

## Commands

```powershell
$env:SMOKE_API_BASE_URL=$env:PROD_UI_AUDIT_API_BASE_URL
$env:SMOKE_WEB_BASE_URL=$env:PROD_UI_AUDIT_WEB_BASE_URL
$env:SMOKE_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:SMOKE_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run ops:deploy:smoke -- --api-base-url $env:PROD_UI_AUDIT_API_BASE_URL --web-base-url $env:PROD_UI_AUDIT_WEB_BASE_URL
```

Result: FAIL.

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- FAIL Web `/` -> `503`
- FAIL Web `/api/build-info` -> `503`
- FAIL API `/workers/ready` -> `503`

```powershell
$env:DEPLOY_FRESHNESS_API_BASE_URL=$env:PROD_UI_AUDIT_API_BASE_URL
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run ops:deploy:runtime-freshness -- --base-url $env:PROD_UI_AUDIT_API_BASE_URL
```

Result: PASS.

- worker heartbeat age: about `5.0s`
- market data age: about `5.0s`
- runtime signal lag: `0ms`
- runtime sessions: `5` running, no stale session ids

```powershell
$env:ROLLBACK_GUARD_API_BASE_URL=$env:PROD_UI_AUDIT_API_BASE_URL
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run ops:deploy:rollback-guard -- --base-url $env:PROD_UI_AUDIT_API_BASE_URL
```

Result: FAIL.

- `shouldRollback=true`
- reason: `workers_ready_endpoint_http_503`
- runtime freshness: PASS
- alerts: empty

```powershell
pnpm run ops:ui:prod-clickthrough -- --web-base-url $env:PROD_UI_AUDIT_WEB_BASE_URL --api-base-url $env:PROD_UI_AUDIT_API_BASE_URL --output-json history/artifacts/luc-6424-prod-ui-module-clickthrough-2026-06-30.json --output-md history/evidence/luc-6424-prod-ui-module-clickthrough-2026-06-30.md --today 2026-06-30
```

Result: FAIL.

- Public routes: `FAIL:4`
- Dashboard routes: `FAIL:18`
- Admin routes: `FAIL:3`
- Legacy redirects: `FAIL:3`
- Web build-info HTTP status: `503`
- Dashboard auth: `login:present`
- Admin auth: `login:present`

## Interpretation

Authenticated browser acceptance and representative Web performance cannot be
accepted because the production Web frontend is unavailable and build-info
cannot prove the deployed SHA. The protected worker readiness endpoint also
returns `503`, causing rollback guard to require action. Runtime freshness is
healthy, so the freshest observed blocker is Web availability plus
`/workers/ready`, not stale runtime heartbeat data.

## Evidence

- UI clickthrough markdown:
  `history/evidence/luc-6424-prod-ui-module-clickthrough-2026-06-30.md`
- UI clickthrough JSON:
  `history/artifacts/luc-6424-prod-ui-module-clickthrough-2026-06-30.json`
- Task packet:
  `history/tasks/luc-6424-authenticated-production-acceptance-performance-sweep-2026-06-30-task.md`

## Residual Risk And Next Owner

- DRE/Ops restoration owner should continue the existing production Web and
  worker-readiness incident path, currently tracked by [LUC-6331](/LUC/issues/LUC-6331).
- QVE should rerun authenticated production acceptance after Web `/`,
  Web `/api/build-info`, and protected `/workers/ready` return healthy.
- No duplicate Backend/Auth repair child is required from this heartbeat because
  auth credential resolution succeeded and the blocking failures are Web `503`
  and protected worker readiness `503`.
