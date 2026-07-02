# LUC-6331 Production Web And Backtest Worker Restoration Recheck

Date: 2026-07-01

## Scope

Read-only DRE recheck for the Soar production Web and backtest-worker
restoration incident after the LUC-6329 production watch.

No deploy, push, restart, rollback execution, env edit, database/Redis
mutation, production account mutation, exchange/payment mutation, order,
position, subscription mutation, live-trading action, secret value readback, or
raw log-body storage was performed.

## Source Snapshot

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Local HEAD: `dedb0e532defe0afddf12c5a5d130295a72af660`
- Worktree: dirty before this heartbeat from unrelated lanes; this heartbeat
  added only LUC-6331 evidence/task/state notes.

## Checks

### Production Deploy Smoke

Command used the existing smoke script with process-local production URL
mapping from `PROD_UI_AUDIT_API_BASE_URL` and `PROD_UI_AUDIT_WEB_BASE_URL`.
Approved smoke-login credentials were consumed through existing environment
names only; no secret values were printed.

```powershell
$env:SMOKE_API_BASE_URL=$env:PROD_UI_AUDIT_API_BASE_URL
$env:SMOKE_WEB_BASE_URL=$env:PROD_UI_AUDIT_WEB_BASE_URL
pnpm run -s ops:deploy:smoke
```

Result: `FAIL`

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 503`
- `WEB /api/build-info -> 503`
- `API /workers/ready -> 503`

### Runtime Freshness

Command used process-local mapping from `SMOKE_AUTH_EMAIL` and
`SMOKE_AUTH_PASSWORD` to the `DEPLOY_FRESHNESS_*` namespace.

```powershell
$env:DEPLOY_FRESHNESS_API_BASE_URL=$env:PROD_UI_AUDIT_API_BASE_URL
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run -s ops:deploy:runtime-freshness
```

Result: `PASS`

- worker heartbeat: `PASS`, age `12210 ms`
- market data: `PASS`, age `12210 ms`
- runtime signal lag: `PASS`, age `0 ms`
- runtime sessions: `PASS`, running count `5`, stale session ids `[]`
- runtime decision activity: `SKIP`, not required for running sessions

### Rollback Guard

Command used process-local mapping from `SMOKE_AUTH_EMAIL` and
`SMOKE_AUTH_PASSWORD` to the `ROLLBACK_GUARD_*` namespace.

```powershell
$env:ROLLBACK_GUARD_API_BASE_URL=$env:PROD_UI_AUDIT_API_BASE_URL
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run -s ops:deploy:rollback-guard
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

- checked at `2026-06-30T22:29:22.717Z`
- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`

No rollback was executed.

### Coolify Read-Only Projection

Authenticated read-only Coolify API calls used configured environment bindings
by name only. `curl.exe` was used because the PowerShell web client failed
before returning HTTP responses, while `curl.exe` returned `200` for the same
read-only endpoints. No token, resource id, internal URL, or raw object was
stored.

Result:

- `/api/v1/version`: `200`
- `/api/v1/teams/current`: `200`
- `/api/v1/resources`: `200`, but this runner's global resource projection
  exposed only one row and zero canonical Soar rows.
- `/api/v1/projects/{project}/production`: `200`, eight resource rows.

Production resource projection:

| Resource | Type | Status |
| --- | --- | --- |
| `soar-web` | application | `exited:unhealthy` |
| `workers-backtest` | application | `exited:unhealthy` |
| `soar-api` | application | `running:unknown` |
| `workers-execution` | application | `running:unknown` |
| `workers-market-data` | application | `running:unknown` |
| `workers-market-stream` | application | `running:unknown` |
| `postgresql` | postgresql | `running:healthy` |
| `redis` | redis | `running:healthy` |

## Diagnosis

The restoration is not complete. API health/readiness and runtime freshness
are healthy, while the two incident targets remain unavailable:

- `soar-web` is `exited:unhealthy` in Coolify and public Web routes return
  `503`.
- `workers-backtest` is `exited:unhealthy` in Coolify and protected
  `/workers/ready` returns `503`.

The current DRE heartbeat has read-only access and no fresh approval to deploy,
restart, rollback, or mutate Coolify/VPS runtime state. The next action belongs
to an Ops/Coolify mutation owner with explicit approval to restart/redeploy or
roll back the affected production resources, followed by DRE protected smoke.

## Disposition

`BLOCKED / RESTORATION_NOT_COMPLETE / PRODUCTION_WEB_503 /
WORKERS_READY_503 / SOAR_WEB_EXITED_UNHEALTHY /
WORKERS_BACKTEST_EXITED_UNHEALTHY / RUNTIME_FRESHNESS_PASS /
ROLLBACK_GUARD_ACTION_REQUIRED`.

Paperclip control-plane caveat: `GET /api/health` returned `200`, but
`GET /api/issues/LUC-6331/heartbeat-context` timed out after `12s` and direct
`PATCH /api/issues/LUC-6331` to `blocked` with the evidence comment timed out
after `20s`; `POST /api/issues/LUC-6331/comments` also timed out after `12s`.
Next control-plane-capable heartbeat should confirm whether the PATCH/comment
landed and, if not, apply the same `blocked` disposition from this packet.

## Next Owner

Ops Release Lead / board-approved Coolify mutation owner:

1. Confirm approved production mutation path for `soar-web` and
   `workers-backtest`.
2. Restart/redeploy or roll back the affected resources using the documented
   Soar Coolify production topology.
3. Hand back to DRE/QVE for deploy smoke, runtime freshness, rollback guard,
   and authenticated production acceptance rerun.
