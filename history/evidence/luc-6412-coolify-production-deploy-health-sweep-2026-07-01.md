# LUC-6412 Coolify Production Deploy Health Sweep

Date: 2026-07-01

## Scope

Read-only DRE production deploy health sweep for Soar.

No deploy, push, restart, rollback execution, env edit, database/Redis
mutation, production account mutation, exchange/payment mutation, order,
position, subscription mutation, live-trading action, secret value readback, or
raw log-body storage was performed.

## Source Snapshot

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Local HEAD: `dedb0e532defe0afddf12c5a5d130295a72af660`
- Worktree: dirty before this heartbeat from unrelated lanes; this heartbeat
  added only LUC-6412 evidence/task/state notes.
- Local branch state: `main...origin/main [ahead 21, behind 3]`

## Checks

### Public Production Deploy Smoke

```powershell
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `FAIL`

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 503`
- `WEB /api/build-info -> 503`

### Protected Production Deploy Smoke

```powershell
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL`

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 503`
- `WEB /api/build-info -> 503`
- `API /workers/ready -> 503`

### Runtime Freshness

Command used process-local mapping from `SMOKE_AUTH_EMAIL` and
`SMOKE_AUTH_PASSWORD` to the `DEPLOY_FRESHNESS_*` namespace. No secret values
were printed or stored.

```powershell
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run -s ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch --auth-email $env:SMOKE_AUTH_EMAIL
```

Result: `PASS`

- worker heartbeat: `PASS`, age `7514 ms`
- market data: `PASS`, age `7514 ms`
- runtime signal lag: `PASS`, age `0 ms`
- runtime sessions: `PASS`, running count `5`, stale session ids `[]`
- runtime decision activity: `SKIP`, not required for running sessions

### Rollback Guard

Command used process-local mapping from `SMOKE_AUTH_EMAIL` and
`SMOKE_AUTH_PASSWORD` to the `ROLLBACK_GUARD_*` namespace. No secret values
were printed or stored.

```powershell
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run -s ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --auth-email $env:SMOKE_AUTH_EMAIL
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

- checked at `2026-06-30T22:51:04.563Z`
- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`

No rollback was executed.

### Coolify Read-Only Projection

Authenticated read-only Coolify API calls used configured environment bindings
by name only. No token, internal URL, or raw object was stored.

Result:

- `/api/v1/version`: `200`
- `/api/v1/teams/current`: `200`
- `/api/v1/projects/{project}/production`: `200`, six application rows visible

Production resource projection:

| Resource | Status |
| --- | --- |
| `soar-web` | `exited:unhealthy` |
| `workers-backtest` | `exited:unhealthy` |
| `workers-market-stream` | `running:unknown` |
| `workers-execution` | `running:unknown` |
| `workers-market-data` | `running:unknown` |
| `soar-api` | `running:unknown` |

## Diagnosis

The deploy health sweep is blocked by the same production restoration incident
tracked on [LUC-6331](/LUC/issues/LUC-6331):

- API health/readiness are reachable.
- Runtime freshness remains healthy through the approved env-only fresh-login
  path.
- Public Web is unavailable: `/` and `/api/build-info` return `503`.
- Protected workers readiness is unavailable: `/workers/ready` returns `503`.
- Coolify production projection confirms `soar-web` and `workers-backtest` are
  `exited:unhealthy`.

The current DRE heartbeat has read-only access and no fresh approval to deploy,
restart, roll back, or mutate Coolify/VPS runtime state.

## Disposition

`BLOCKED / PRODUCTION_WEB_503 / WORKERS_READY_503 /
SOAR_WEB_EXITED_UNHEALTHY / WORKERS_BACKTEST_EXITED_UNHEALTHY /
RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.

## Next Owner

Ops Release Lead / board-approved Coolify mutation owner:

1. Confirm approved production mutation path for `soar-web` and
   `workers-backtest`.
2. Restart/redeploy or roll back the affected resources using the documented
   Soar Coolify production topology.
3. Hand back to DRE/QVE for deploy smoke, runtime freshness, rollback guard,
   and authenticated production acceptance rerun.
