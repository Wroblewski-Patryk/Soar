# LUC-6329 Production Performance And Server Health Watch - 2026-06-30

## Context

- Issue: [LUC-6329](/LUC/issues/LUC-6329)
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

Check whether production is responsive and operational, with special attention
to public Web availability, protected worker readiness, runtime freshness,
rollback guard signals, representative dashboard API timing, and Coolify
resource state.

## Verification

### Deploy Smoke

Command:

```powershell
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha c357d957741f56835f27a1fc3a948dad43a91036
```

Result: FAIL.

- API `/health` -> `200`
- API `/ready` -> `200`
- Web `/` -> `503`
- Web `/api/build-info` -> `503`
- API `/workers/ready` -> `503`

Focused public retry confirmed Web `/` and Web `/api/build-info` returned
stable `503` with body `no available server`.

### Runtime Freshness

Command:

```powershell
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL; $env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD; pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Result: PASS.

- worker heartbeat age: about `2.1s`
- market data age: about `2.1s`
- runtime signal lag: `0 ms`
- runtime sessions: `5` running, `0` stale session ids
- runtime decision activity: skipped by current optional contract

### Workers Ready

Focused authenticated read:

- `/auth/me` -> `200`
- `/workers/ready` -> `503`
- status: `not_ready`
- topologyStatus: `healthy`
- degradedReasons: `[]`
- missing: `[]`
- required worker families: `backtest`, `execution`, `market-data`,
  `market-stream`
- backtest heartbeat: `missing`
- execution heartbeat: `fresh`
- market-data heartbeat: `fresh`
- market-stream heartbeat: `fresh`

Interpretation: the API and most runtime signals are alive, but the protected
readiness contract is currently failing because the backtest worker heartbeat is
missing.

### Rollback Guard

Command:

```powershell
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL; $env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD; pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Result: FAIL / rollback guard recommends action.

- checked at: `2026-06-30T00:22:01.625Z`
- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness: PASS
- alerts: `[]`

No rollback was executed in this heartbeat.

### Representative Timing

Read-only custom timing probe using the same approved auth-token resolver.

- API `/health`: `200/200`, max `78.7 ms`
- API `/ready`: `200/200`, max `29.2 ms`
- Web `/`: `503/503`, max `81.1 ms`
- Web `/api/build-info`: `503/503`, max `19.9 ms`
- API `/auth/me`: `200/200`, max `25.8 ms`
- API `/dashboard/bots/strategy-drift`: `200/200`, max `33.9 ms`
- API `/dashboard/markets/catalog`: `200/200`, cold sample `1612.4 ms`,
  second sample `33.5 ms`

Interpretation: the operator-facing severe stall is not reproduced in API
dashboard reads, but public Web is unavailable and the known market-catalog cold
first-sample pattern remains present.

### Coolify Read-Only Projection

Read-only API projection with secret values redacted.

- `GET /api/v1/version` -> `200`
- `GET /api/v1/projects/{project}` -> `200`, project `Soar`
- `GET /api/v1/projects/{project}/environments` -> `200`, `1` row
- `GET /api/v1/projects/{project}/production` -> `200`
- `GET /api/v1/resources` -> `200`
- project deployments endpoint -> `404`; global deployments endpoint -> `200`
- production applications:
  - `soar-web`: `exited:unhealthy`, commit
    `b894e5dd30614dfd2035e91e3d848c842d3ff380`
  - `workers-backtest`: `exited:unhealthy`, commit `HEAD`
  - `workers-market-stream`: `running:unknown`, commit `HEAD`
  - `workers-execution`: `running:unknown`, commit `HEAD`
  - `soar-api`: `running:unknown`, commit `HEAD`
  - `workers-market-data`: `running:unknown`, commit `HEAD`
- deployments list: `8` rows, `8` queued

## Result Report

Status:
`DONE / WATCH_COMPLETED / PRODUCTION_WEB_DOWN / BACKTEST_WORKER_NOT_READY /
RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.

Action taken:

- Created incident/repair child [LUC-6331](/LUC/issues/LUC-6331) for the
  production Web and backtest worker resource failure.

Residual risks:

- Public Web is unavailable through `https://soar.luckysparrow.ch` because the
  `soar-web` Coolify resource is `exited:unhealthy`.
- Protected `/workers/ready` fails because the backtest worker heartbeat is
  missing and `workers-backtest` is `exited:unhealthy`.
- Runtime freshness and alerts do not show a broader API/runtime outage.
- Market catalog still has a cold first-sample shape.
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
