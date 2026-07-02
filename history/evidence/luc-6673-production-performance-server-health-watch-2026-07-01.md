# LUC-6673 Production Performance And Server Health Watch

- Date: 2026-07-01
- Owner: DRE / Ops Release
- Scope: read-only production health and server watch.
- Disposition: `BLOCKED / API_HEALTH_READY_PASS / PRODUCTION_WEB_503 / WORKERS_READY_503 / SOAR_WEB_EXITED_UNHEALTHY / WORKERS_BACKTEST_EXITED_UNHEALTHY / RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.

## Boundary

No deploy, push, restart, rollback execution, env edit, secret value readback,
DB/Redis mutation, production account mutation, exchange/payment mutation,
order, position, subscription mutation, or live-trading action occurred.

## Paperclip Context

- Wake payload: `issue_assigned`, no pending comments, fallback fetch not needed.
- `GET /api/issues/{LUC-6673}/heartbeat-context` -> `200`; issue status `in_progress`.
- Existing restoration blocker: [LUC-6331](/LUC/issues/LUC-6331), status `blocked`.

## Source Control

- Repo: `C:\Personal\Projekty\Aplikacje\Soar`
- Branch state: `main...origin/main [ahead 22, behind 3]`.
- HEAD: `6aeb8b8b8c4e`.
- Worktree: dirty before this heartbeat; no commit or push was attempted.
- Deploy impact: none.

## Public Deploy Smoke

Command:

```powershell
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `FAIL`.

- API `/health` -> `200`, `PASS`
- API `/ready` -> `200`, `PASS`
- Web `/` -> `503`, `FAIL`
- Web `/api/build-info` -> `503`, `FAIL`

## Protected Worker Readiness

Command:

```powershell
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL`.

- API `/health` -> `200`, `PASS`
- API `/ready` -> `200`, `PASS`
- Web `/` -> `503`, `FAIL`
- Web `/api/build-info` -> `503`, `FAIL`
- API `/workers/ready` -> `503`, `FAIL`

## Runtime Freshness

Command used process-local mapping from existing smoke auth bindings:

```powershell
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run -s ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result: `PASS`.

- worker heartbeat age: `13384 ms`
- market data age: `13384 ms`
- runtime signal lag: `0 ms`
- running sessions: `5`
- stale session ids: `[]`

## Rollback Guard

Command used process-local mapping from existing smoke auth bindings:

```powershell
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run -s ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL`.

- `shouldRollback`: `true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`
- rollback executed: no

## Coolify Read-Only Projection

Sanitized read-only API probe. No tokens, resource ids, raw URLs, raw logs, or
secret values were stored.

- `/api/v1/version`: `200`
- `/api/v1/teams/current`: `200`
- `/api/v1/projects/{project}`: `200`
- `/api/v1/projects/{project}/environments`: `200`
- `/api/v1/projects/{project}/production`: `200`
- `/api/v1/resources`: `200`, `17` visible rows
- `/api/v1/deployments`: `200`, `8` rows, `8` queued
- production inventory: `6` applications, `1` PostgreSQL, `1` Redis
- application statuses:
  - `soar-web`: `exited:unhealthy:unknown`
  - `workers-backtest`: `exited:unhealthy:unknown`
  - `workers-market-stream`: `running:unknown:unknown`
  - `workers-execution`: `running:unknown:unknown`
  - `soar-api`: `running:unknown:unknown`
  - `workers-market-data`: `running:unknown:unknown`
- PostgreSQL: `running:healthy:unknown`
- Redis: `running:healthy:unknown`

## Result

Production remains blocked for release. API health/readiness and runtime
freshness are healthy, but the public Web surface, Web build provenance,
protected worker readiness, and two Coolify application resources are unhealthy.

## Next Owner And Action

Ops Release Lead / board-approved Coolify mutation owner continues
[LUC-6331](/LUC/issues/LUC-6331), inspects queued deployments and unhealthy
`soar-web` / `workers-backtest`, then performs approved restart/redeploy or
rollback through the protected mutation path. DRE/QVE rerun production smoke,
rollback guard, and authenticated acceptance after restoration.
