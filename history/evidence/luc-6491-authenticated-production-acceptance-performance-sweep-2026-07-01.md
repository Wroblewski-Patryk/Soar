# LUC-6491 Authenticated Production Acceptance And Performance Sweep

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
- Local HEAD: `dedb0e532defe0afddf12c5a5d130295a72af660`
- Worktree: dirty before this heartbeat from unrelated lanes; this heartbeat
  added only scoped LUC-6491 evidence/artifacts/state notes.

## Credential Boundary

Approved audit-login bindings were checked by name and length only:

- `PROD_UI_AUDIT_API_BASE_URL`: present
- `PROD_UI_AUDIT_WEB_BASE_URL`: present
- `PROD_UI_AUDIT_AUTH_EMAIL`: present
- `PROD_UI_AUDIT_AUTH_PASSWORD`: present
- `SMOKE_AUTH_TOKEN`: absent

Secret values, cookies, tokens, passwords, account payloads, and screenshots
were not printed or stored.

## Checks

### Production Deploy Smoke

```powershell
$env:SMOKE_API_BASE_URL=$env:PROD_UI_AUDIT_API_BASE_URL
$env:SMOKE_WEB_BASE_URL=$env:PROD_UI_AUDIT_WEB_BASE_URL
$env:SMOKE_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:SMOKE_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:smoke
```

Result: `FAIL`

- API `/health`: `200`
- API `/ready`: `200`
- Web `/`: `503`
- Web `/api/build-info`: `503`
- API `/workers/ready`: `503`

### Runtime Freshness

```powershell
$env:DEPLOY_FRESHNESS_API_BASE_URL=$env:PROD_UI_AUDIT_API_BASE_URL
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:runtime-freshness
```

Result: `PASS`

- worker heartbeat age: `8969 ms`
- market data age: `8969 ms`
- runtime signal lag: `0 ms`
- runtime sessions: `5` running, stale session ids `[]`
- runtime decision activity: `SKIP`, not required for running sessions

### Rollback Guard

```powershell
$env:ROLLBACK_GUARD_API_BASE_URL=$env:PROD_UI_AUDIT_API_BASE_URL
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:PROD_UI_AUDIT_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:PROD_UI_AUDIT_AUTH_PASSWORD
pnpm run -s ops:deploy:rollback-guard
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

- checked at `2026-06-30T22:42:34.076Z`
- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`

No rollback was executed.

### Production UI Clickthrough

```powershell
pnpm run -s ops:ui:prod-clickthrough -- --web-base-url $env:PROD_UI_AUDIT_WEB_BASE_URL --api-base-url $env:PROD_UI_AUDIT_API_BASE_URL --output-json history/artifacts/luc-6491-prod-ui-module-clickthrough-2026-07-01.json --output-md history/evidence/luc-6491-prod-ui-module-clickthrough-2026-07-01.md --today 2026-07-01
```

Result: `FAIL`

- public routes: `FAIL:4`
- dashboard routes: `FAIL:18`
- admin routes: `FAIL:3`
- legacy redirects: `FAIL:3`
- Web build-info status: `503`
- dashboard auth: `login:present`
- admin auth: `login:present`

## Interpretation

Authenticated browser acceptance and Web performance cannot be accepted in this
heartbeat. Production API health/readiness and runtime freshness are healthy,
but the production Web frontend is unavailable and protected worker readiness
still returns `503`. This is the same production restoration class tracked by
[LUC-6331](/LUC/issues/LUC-6331), not a fresh Backend/Auth repair finding.

## Evidence

- UI clickthrough markdown:
  `history/evidence/luc-6491-prod-ui-module-clickthrough-2026-07-01.md`
- UI clickthrough JSON:
  `history/artifacts/luc-6491-prod-ui-module-clickthrough-2026-07-01.json`
- Task packet:
  `history/tasks/luc-6491-authenticated-production-acceptance-performance-sweep-2026-07-01-task.md`

## Disposition

`BLOCKED / PRODUCTION_WEB_503 / WORKERS_READY_503 /
AUTHENTICATED_ACCEPTANCE_NOT_EXECUTABLE / RUNTIME_FRESHNESS_PASS /
ROLLBACK_GUARD_ACTION_REQUIRED`.

Paperclip control-plane caveat: final `PATCH /api/issues/LUC-6491` to
`blocked` timed out after `20s`. Follow-up `/api/health` and
`GET /api/issues/LUC-6491` also timed out from this runner. The next
control-plane-capable heartbeat should confirm whether the status/comment
landed and, if not, apply the same blocked disposition from this packet.

Repository guardrail caveat: `pnpm run -s quality:guardrails` was attempted
after the evidence updates but timed out after `124s`. No product code changed
in this heartbeat.

## Next Owner

Ops Release Lead / board-approved Coolify mutation owner resolves
[LUC-6331](/LUC/issues/LUC-6331) by restoring or rolling back `soar-web` and
`workers-backtest`, then QVE reruns deploy smoke, runtime freshness, rollback
guard, UI clickthrough, authenticated browser acceptance, and representative
performance timing.
