# LUC-6369 Production Performance And Server Health Watch - 2026-06-30

## Context

- Issue: [LUC-6369](/LUC/issues/LUC-6369)
- Role: Deployment and Reliability Engineer
- Stage: verification
- Environment: production
- API: `https://api.soar.luckysparrow.ch`
- Web: `https://soar.luckysparrow.ch`
- Boundary: read-only production health watch. No deploy, push, restart,
  rollback execution, env edit, secret/account value readback, DB/Redis
  mutation, raw log capture, production account mutation, subscription/payment
  mutation, exchange mutation, order, position, or live-trading action.

## Goal

Check whether the production performance/server-health watch is healthy after
the earlier [LUC-6329](/LUC/issues/LUC-6329) watch found public Web down and
backtest worker readiness failing.

## Verification

### Direct Public Probe

Run at `2026-06-30T02:21Z`.

- API `/health` -> `200`, `376.6 ms`
- API `/ready` -> `200`, `32.3 ms`
- Web `/` -> `503`
- Web `/api/build-info` -> `503`

Interpretation: API liveness/readiness is responsive, but the public Web route
and Web build-info route remain unavailable.

### Deploy Smoke

Command:

```powershell
$env:SMOKE_API_BASE_URL='https://api.soar.luckysparrow.ch'; $env:SMOKE_WEB_BASE_URL='https://soar.luckysparrow.ch'; pnpm run ops:deploy:smoke
```

Result: FAIL.

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `503`
- Web `/api/build-info` -> `503`
- API `/workers/ready` -> `503`

### Runtime Freshness

Command:

```powershell
$env:DEPLOY_FRESHNESS_API_BASE_URL='https://api.soar.luckysparrow.ch'; $env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL; $env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD; pnpm run ops:deploy:runtime-freshness
```

Result: PASS.

- worker heartbeat age: `24097 ms`
- market data age: `24097 ms`
- runtime signal lag: `0 ms`
- runtime sessions: `5` running, `0` stale session ids
- runtime decision activity: skipped by current optional contract

### Workers Ready

Focused authenticated read:

- `/workers/ready` -> `503`
- status: `not_ready`
- topologyStatus: `healthy`
- degradedReasons: `[]`
- missing: `[]`
- required worker families: `backtest`, `execution`, `market-data`,
  `market-stream`

Interpretation: the protected readiness contract is still failing even though
runtime freshness passes.

### Rollback Guard

Command:

```powershell
$env:ROLLBACK_GUARD_API_BASE_URL='https://api.soar.luckysparrow.ch'; $env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL; $env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD; pnpm run ops:deploy:rollback-guard
```

Result: FAIL / rollback guard recommends action.

- checked at: `2026-06-30T02:21:57.000Z`
- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness: PASS
- alerts: `[]`

No rollback was executed in this heartbeat.

### Representative Timing

Read-only custom timing probe using the approved auth-token resolver.

- API `/health`: `200/200`, max `71.1 ms`
- API `/ready`: `200/200`, max `25.8 ms`
- Web `/`: `503/503`, max `83.5 ms`
- Web `/api/build-info`: `503/503`, max `18.2 ms`
- API `/auth/me`: `200/200`, max `25.3 ms`
- API `/dashboard/bots/strategy-drift`: `200/200`, max `35.1 ms`
- API `/dashboard/markets/catalog`: `200/200`, cold sample `1586.9 ms`,
  second sample `24.7 ms`

Interpretation: the API and authenticated dashboard APIs sampled here are
responsive, but the public Web remains unavailable. The known market-catalog
cold first-sample pattern remains present.

### Coolify Read-Only Projection

Read-only API projection with secret values redacted.

- `GET /api/v1/version` -> `200`, Coolify `4.0.0-beta.473`
- `GET /api/v1/projects/{project}` -> `200`, project `Soar`
- `GET /api/v1/projects/{project}/environments` -> `200`, `1` row
- `GET /api/v1/projects/{project}/production` -> `200`
- `GET /api/v1/resources` -> `200`, `17` visible rows
- `GET /api/v1/deployments` -> `200`, `8` rows, `8` queued
- production applications:
  - `soar-web`: `exited:unhealthy`, commit
    `b894e5dd30614dfd2035e91e3d848c842d3ff380`
  - `workers-backtest`: `exited:unhealthy`, commit `HEAD`
  - `workers-market-stream`: `running:unknown`, commit `HEAD`
  - `workers-execution`: `running:unknown`, commit `HEAD`
  - `soar-api`: `running:unknown`, commit `HEAD`
  - `workers-market-data`: `running:unknown`, commit `HEAD`

## Result Report

Status:
`BLOCKED / WATCH_COMPLETED / PRODUCTION_WEB_DOWN / WORKERS_READY_503 /
RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.

Action taken:

- Reused existing restoration incident [LUC-6331](/LUC/issues/LUC-6331)
  instead of creating a duplicate child. Paperclip search found
  [LUC-6331](/LUC/issues/LUC-6331) still `in_review`.

Residual risks:

- Public Web is unavailable through `https://soar.luckysparrow.ch` because the
  `soar-web` Coolify resource is `exited:unhealthy`.
- Protected `/workers/ready` fails with `503`, and Coolify reports
  `workers-backtest` as `exited:unhealthy`.
- Rollback guard returns `shouldRollback=true`; no rollback/restart/deploy was
  executed in this read-only DRE heartbeat.
- Coolify global deployments endpoint still exposes `8` queued rows.
- Host-level VPS pressure/log-window proof remains gated on approved read-only
  host-status credentials.

Source-control closure:

- Repo path: `C:/Personal/Projekty/Aplikacje/Soar`
- Files changed by this heartbeat: this evidence file, the matching task
  record, and top-of-file status summaries.
- Commit SHA: not committed; shared `main` is pre-existing dirty/divergent and
  this routine produced evidence/state only.
- Push status: not needed.
- Deploy impact: none from this heartbeat.
