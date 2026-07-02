# LUC-6711 Production Performance And Server Health Watch

- Date: 2026-07-02
- Owner: DRE / Ops Release
- Scope: read-only production performance and server-health watch.
- Disposition: `BLOCKED / API_HEALTH_READY_PASS / PRODUCTION_WEB_503 / WORKERS_READY_503 / SOAR_WEB_EXITED_UNHEALTHY / WORKERS_BACKTEST_EXITED_UNHEALTHY / RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.

## Boundary

No product code, commit, push, deploy, restart, rollback execution, env edit,
secret/account value readback, DB/Redis mutation, production account mutation,
exchange/payment mutation, order, position, subscription mutation, or
live-trading action occurred.

## Paperclip Context

- Wake payload: `issue_assigned`, no pending comments, fallback fetch not needed.
- Scoped issue: [LUC-6711](/LUC/issues/LUC-6711), status `in_progress`.
- Existing restoration blocker: [LUC-6331](/LUC/issues/LUC-6331).

## Source Control

- Repo: `C:\Personal\Projekty\Aplikacje\Soar`
- Branch: `main`
- HEAD: `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`
- Git relation: `main...origin/main` is `[ahead 22, behind 3]`.
- Worktree: dirty before this heartbeat from existing lanes; this heartbeat
  added only scoped LUC-6711 evidence/task/state notes.
- Commit/push: not attempted.
- Deploy impact: none.

## Public Deploy Smoke

Command:

```powershell
$env:SMOKE_TIMEOUT_MS='10000'
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `FAIL`.

- API `/health` -> `200`, `PASS`
- API `/ready` -> `200`, `PASS`
- Web `/` -> `503`, `FAIL`
- Web `/api/build-info` -> `503`, `FAIL`

## Protected Worker Readiness

Command used the existing smoke auth bindings already present in the runner
environment. Secret values were not printed or stored in this evidence packet.

```powershell
$env:SMOKE_TIMEOUT_MS='10000'
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
$env:DEPLOY_FRESHNESS_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:DEPLOY_FRESHNESS_TIMEOUT_MS='10000'
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run -s ops:deploy:runtime-freshness
```

Result: `PASS`.

- worker heartbeat age: `4161 ms`
- market data age: `4161 ms`
- runtime signal lag: `0 ms`
- running sessions: `5`
- stale session ids: `[]`

## Rollback Guard

Command used process-local mapping from existing smoke auth bindings:

```powershell
$env:ROLLBACK_GUARD_API_BASE_URL='https://api.soar.luckysparrow.ch'
$env:ROLLBACK_GUARD_TIMEOUT_MS='10000'
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run -s ops:deploy:rollback-guard
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`.

- checked at: `2026-07-01T22:49:46.187Z`
- `shouldRollback`: `true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`
- rollback executed: no

## Representative HTTP Timing

Command:

```powershell
curl.exe -L -s -o NUL -w "%{http_code} %{time_total}" --max-time 15 <url>
```

Result:

- API `/health`: `200`, `0.116517s`
- API `/ready`: `200`, `0.105765s`
- Web `/`: `503`, `0.091400s`
- Web `/auth/login`: `503`, `0.098884s`
- Web `/api/build-info`: `503`, `0.083546s`
- API `/workers/ready` unauthenticated: `401`, `0.107602s`

## Coolify Read-Only Projection

Sanitized allowlist read-only API probe. No tokens, resource ids, raw URLs, raw
logs, or secret values are stored in this evidence packet.

- `/api/v1/version`: `200`
- `/api/v1/teams/current`: `200`
- `/api/v1/projects/{project}`: `200`
- `/api/v1/projects/{project}/production`: `200`
- `/api/v1/resources`: `200`, `17` visible rows
- `/api/v1/deployments`: `200`, `8` rows, `8` queued
- production application statuses:
  - `soar-web`: `exited:unhealthy`
  - `workers-backtest`: `exited:unhealthy`
  - `workers-market-stream`: `running:unknown`
  - `workers-execution`: `running:unknown`
  - `soar-api`: `running:unknown`
  - `workers-market-data`: `running:unknown`
- production backing services:
  - PostgreSQL: `running:healthy`
  - Redis: `running:healthy`

## Result

Production remains blocked for release and authenticated acceptance. API
health/readiness and runtime freshness are healthy, but the public Web surface,
Web build provenance, protected worker readiness, and two Coolify application
resources remain unhealthy.

## Next Owner And Action

Ops Release Lead / board-approved Coolify mutation owner continues
[LUC-6331](/LUC/issues/LUC-6331), inspects queued deployments and unhealthy
`soar-web` / `workers-backtest`, then performs approved restart/redeploy or
rollback through the protected mutation path. DRE/QVE rerun production smoke,
rollback guard, and authenticated acceptance after restoration.
