# LUC-6716 Authenticated Production Acceptance And Performance Sweep

Date: 2026-07-02

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
  added only scoped LUC-6716 evidence/task/state notes and UI audit artifacts.
- Git relation: `main...origin/main [ahead 22, behind 3]`.

## Credential Boundary

Protected read-only ops checks mapped the stored production audit email/password
bindings into each script's expected environment variable names. Secret values,
cookies, tokens, passwords, account payloads, screenshots, and private headers
were not printed or stored.

## Checks

### Production Deploy Smoke

```powershell
$env:SMOKE_TIMEOUT_MS='10000'
$env:SMOKE_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:SMOKE_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL`

- API `/health`: `200`
- API `/ready`: `200`
- Web `/`: `503`
- Web `/api/build-info`: `503`
- API `/workers/ready`: `503`

### Runtime Freshness

```powershell
$env:DEPLOY_FRESHNESS_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:DEPLOY_FRESHNESS_TIMEOUT_MS='10000'
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:runtime-freshness
```

Result: `PASS`

- worker heartbeat age: `3586 ms`
- market data age: `3586 ms`
- runtime signal lag: `0 ms`
- running runtime sessions: `5`

### Rollback Guard

```powershell
$env:ROLLBACK_GUARD_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:ROLLBACK_GUARD_TIMEOUT_MS='10000'
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:rollback-guard
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

- checked at `2026-07-01T22:37:37.349Z`
- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside rollback guard: `PASS`
- alerts: none returned

No rollback was executed.

### Production UI Clickthrough

```powershell
$env:PROD_UI_AUDIT_WEB_BASE_URL='https://soar.luckysparrow.ch'
$env:PROD_UI_AUDIT_API_BASE_URL='https://api.soar.luckysparrow.ch'
pnpm run -s ops:ui:prod-clickthrough -- --today 2026-07-02 --output-json history/artifacts/luc-6716-prod-ui-module-clickthrough-2026-07-02.json --output-md history/evidence/luc-6716-prod-ui-module-clickthrough-2026-07-02.md
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
pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --today 2026-07-02 --output-json history/artifacts/luc-6716-prod-auth-session-browser-proof-2026-07-02.json --output-md history/evidence/luc-6716-prod-auth-session-browser-proof-2026-07-02.md
```

Result: `FAIL before artifact write`

- Error: `build-info does not match expected SHA`
- Matching context: production Web `/api/build-info` returned `503`, so the
  auth proof harness failed closed before accepting browser session evidence.

### Representative HTTP Timing

```powershell
curl.exe -L -s -o NUL -w "%{http_code} %{time_total}" --max-time 15 <url>
```

Result:

- API `/health`: `200`, `0.099632s`
- API `/ready`: `200`, `0.102410s`
- Web `/`: `503`, `0.092303s`
- Web `/api/build-info`: `503`, `0.099146s`

### Process Cleanup

`Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` returned no
rows after the proof attempt.

## Interpretation

Authenticated production acceptance cannot be accepted in this heartbeat. The
production API health/readiness path is reachable and protected runtime
freshness is healthy when the approved audit-login binding is mapped into the
ops script environment, but production Web is unavailable and protected
`/workers/ready` returns `503`. Rollback guard correctly requests action.

This remains aligned with the active production restoration class tracked by
[LUC-6331](/LUC/issues/LUC-6331), not a fresh product-code or Backend/Auth
repair finding from QVE.

## Evidence

- UI clickthrough markdown:
  `history/evidence/luc-6716-prod-ui-module-clickthrough-2026-07-02.md`
- UI clickthrough JSON:
  `history/artifacts/luc-6716-prod-ui-module-clickthrough-2026-07-02.json`
- Task packet:
  `history/tasks/luc-6716-authenticated-production-acceptance-performance-sweep-2026-07-02-task.md`

## Disposition

`BLOCKED / PRODUCTION_WEB_503 / WORKERS_READY_503 /
AUTHENTICATED_ACCEPTANCE_NOT_EXECUTABLE / RUNTIME_FRESHNESS_PASS /
ROLLBACK_GUARD_ACTION_REQUIRED`.

Paperclip control-plane result:

- `PATCH /api/issues/{PAPERCLIP_TASK_ID}` returned `identifier=LUC-6716`,
  `status=blocked`, `updatedAt=2026-07-01T22:42:07.091Z`.
- The issue is first-class blocked by [LUC-6331](/LUC/issues/LUC-6331).

## Next Owner

Ops Release Lead / board-approved Coolify mutation owner resolves
[LUC-6331](/LUC/issues/LUC-6331) by restoring or rolling back `soar-web` and
`workers-backtest`. QVE then reruns deploy smoke, runtime freshness, rollback
guard, UI clickthrough, auth-session browser proof, and representative timing.
