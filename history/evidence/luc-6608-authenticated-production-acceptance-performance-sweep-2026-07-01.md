# LUC-6608 Authenticated Production Acceptance And Performance Sweep

Date: 2026-07-01

## Scope

Read-only QVE production acceptance and performance sweep for Soar production.

No deploy, push, restart, rollback execution, env edit, secret/account value
readback, DB/Redis mutation, production account mutation, exchange/payment
mutation, order, position, subscription mutation, or live-trading action was
performed.

## Source Snapshot

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Worktree: dirty before this heartbeat from existing lanes; this heartbeat
  added only scoped LUC-6608 evidence/task/state notes and a UI audit artifact.

## Credential Boundary

Current runner bindings were checked by name only:

- Present: `PROD_UI_AUDIT_API_BASE_URL`, `PROD_UI_AUDIT_WEB_BASE_URL`,
  `PROD_UI_AUDIT_AUTH_EMAIL`, `PROD_UI_AUDIT_AUTH_PASSWORD`,
  `PROD_UI_AUDIT_ADMIN_EMAIL`, `PROD_UI_AUDIT_ADMIN_PASSWORD`.
- Absent by name in the scoped check: `SMOKE_*`, `DEPLOY_FRESHNESS_*`,
  `ROLLBACK_GUARD_*`, `SOAR_PROD_*`, `PROD_DB_CHECK_*`,
  `PRODUCTION_DB_CHECK_*`, `RC_*`, and `GATE* / GATE_*`.

Secret values, cookies, tokens, passwords, account payloads, and screenshots
were not printed or stored.

## Checks

### Production Deploy Smoke

```powershell
$env:SMOKE_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:SMOKE_WEB_BASE_URL='https://soar.luckysparrow.ch'
$env:SMOKE_TIMEOUT_MS='10000'
pnpm run -s ops:deploy:smoke
```

Result: `FAIL`

- API `/health`: `200`
- API `/ready`: `200`
- Web `/`: `503`
- Web `/api/build-info`: `503`
- API `/workers/ready`: `401` in this unauthenticated smoke runner

### Runtime Freshness

```powershell
$env:DEPLOY_FRESHNESS_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:DEPLOY_FRESHNESS_TIMEOUT_MS='10000'
pnpm run -s ops:deploy:runtime-freshness
```

Result: `FAIL`

- `/workers/runtime-freshness`: `401` in this runner because current
  `DEPLOY_FRESHNESS_*` auth bindings are absent by name.

### Rollback Guard

```powershell
$env:ROLLBACK_GUARD_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:ROLLBACK_GUARD_TIMEOUT_MS='10000'
pnpm run -s ops:deploy:rollback-guard
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

- checked at `2026-07-01T10:36:02.169Z`
- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_401`,
  `runtime_freshness_endpoint_http_401`, `alerts_endpoint_http_401`

No rollback was executed.

### Production UI Clickthrough

```powershell
$env:PROD_UI_AUDIT_WEB_BASE_URL='https://soar.luckysparrow.ch'
$env:PROD_UI_AUDIT_API_BASE_URL='https://api.soar.luckysparrow.ch'
pnpm run -s ops:ui:prod-clickthrough -- --today 2026-07-01 --output-json history/artifacts/luc-6608-prod-ui-module-clickthrough-2026-07-01.json --output-md history/evidence/luc-6608-prod-ui-module-clickthrough-2026-07-01.md
```

Result: `FAIL`

- public routes: `FAIL:4`
- dashboard routes: `FAIL:18`
- admin routes: `FAIL:3`
- legacy redirects: `FAIL:3`
- observed build-info SHA: `n/a`
- dashboard auth: `login:present`
- admin auth: `login:present`

### Auth Session Browser Proof

```powershell
$env:PROD_AUTH_WEB_BASE_URL='https://soar.luckysparrow.ch'
$env:PROD_AUTH_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:PROD_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:PROD_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --today 2026-07-01 --output-json history/artifacts/luc-6608-prod-auth-session-browser-proof-2026-07-01.json --output-md history/evidence/luc-6608-prod-auth-session-browser-proof-2026-07-01.md
```

Result: `FAIL before artifact write`

- Error: `build-info does not match expected SHA`
- Matching context: production Web `/api/build-info` returned `503` in deploy
  smoke, so the auth proof harness failed closed before accepting browser
  session evidence.

### Representative HTTP Timing

```powershell
curl.exe -L -s -o NUL -w "%{http_code} %{time_total}" --max-time 15 <url>
```

Result:

- API `/health`: `200`, `0.202857s`
- API `/ready`: `200`, `0.115640s`
- Web `/`: `503`, `0.282904s`
- Web `/api/build-info`: `503`, `0.194022s`

### Process Cleanup

```powershell
Get-Process chrome-headless-shell -ErrorAction SilentlyContinue
```

Result: no rows returned.

## Interpretation

Authenticated production acceptance cannot be accepted in this heartbeat. The
production API health/readiness path is reachable, but the production Web
frontend is unavailable (`503` for `/` and `/api/build-info`) and protected
runtime/rollback checks cannot be accepted from this runner without current
approved auth bindings.

This remains aligned with the active production restoration class tracked by
[LUC-6331](/LUC/issues/LUC-6331), not a fresh product-code or Backend/Auth
repair finding from QVE.

## Evidence

- UI clickthrough markdown:
  `history/evidence/luc-6608-prod-ui-module-clickthrough-2026-07-01.md`
- UI clickthrough JSON:
  `history/artifacts/luc-6608-prod-ui-module-clickthrough-2026-07-01.json`
- Task packet:
  `history/tasks/luc-6608-authenticated-production-acceptance-performance-sweep-2026-07-01-task.md`

## Disposition

`BLOCKED / PRODUCTION_WEB_503 / AUTHENTICATED_ACCEPTANCE_NOT_EXECUTABLE /
PROTECTED_RUNTIME_AUTH_BINDING_ABSENT / ROLLBACK_GUARD_ACTION_REQUIRED`.

Paperclip control-plane result:

- `POST /api/issues/{PAPERCLIP_TASK_ID}/comments` returned comment id
  `17fb20c1-ba5a-4717-966e-3923b3cc1121` at
  `2026-07-01T10:40:31.562Z`.
- `PATCH /api/issues/{PAPERCLIP_TASK_ID}` returned `identifier=LUC-6608`,
  `status=blocked`, `updatedAt=2026-07-01T10:40:40.882Z`.

## Next Owner

Ops Release Lead / board-approved Coolify mutation owner resolves
[LUC-6331](/LUC/issues/LUC-6331) by restoring or rolling back `soar-web` and
`workers-backtest`, and Security/Ops ensures approved protected runtime auth
bindings are available by name for the QVE runner. QVE then reruns deploy
smoke, runtime freshness, rollback guard, UI clickthrough, auth-session browser
proof, and representative timing.
