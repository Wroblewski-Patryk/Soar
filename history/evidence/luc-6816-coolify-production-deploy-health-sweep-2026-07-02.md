# LUC-6816 Coolify Production Deploy Health Sweep

- Date: 2026-07-02
- Owner: DRE / Ops Release
- Scope: read-only Coolify production deploy health sweep.
- Disposition: `BLOCKED / API_HEALTH_READY_PASS / PRODUCTION_WEB_503 / WORKERS_READY_503 / SOAR_WEB_EXITED_UNHEALTHY / WORKERS_BACKTEST_EXITED_UNHEALTHY / RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.

## Boundary

No product code, commit, push, deploy, restart, rollback execution, env edit,
secret/account value readback, DB/Redis mutation, production account mutation,
exchange/payment mutation, order, position, subscription mutation, or
live-trading action occurred.

## Source Control

- Repo: `C:\Personal\Projekty\Aplikacje\Soar`
- Branch: `main`
- HEAD: `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`
- `origin/main`: `c357d957741f56835f27a1fc3a948dad43a91036`
- Git relation: `main...origin/main` is `[ahead 22, behind 3]`.
- Worktree: dirty before this heartbeat.
- Commit/push: not attempted.
- Deploy impact: none.

## Public And Protected Smoke

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

Command used process-local mapping from existing smoke auth bindings. Secret
values were not printed or stored.

```powershell
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run -s ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result: `PASS`.

- worker heartbeat age: `24843 ms`
- market data age: `24843 ms`
- runtime signal lag: `0 ms`
- running sessions: `5`
- stale session ids: `[]`

## Rollback Guard

Command used process-local mapping from existing smoke auth bindings. Secret
values were not printed or stored.

```powershell
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm run -s ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`.

- checked at: `2026-07-02T07:31:24.753Z`
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

- API `/health`: `200`, `0.083680s`
- API `/ready`: `200`, `0.085559s`
- Web `/`: `503`, `0.083987s`
- Web `/auth/login`: `503`, `0.079106s`
- Web `/api/build-info`: `503`, `0.088032s`
- API `/workers/ready` unauthenticated: `401`, `0.092788s`

## Coolify Read-Only Projection

Sanitized allowlist read-only API probe. No tokens, resource ids, raw URLs, raw
logs, or secret values are stored in this evidence packet.

- checked at: `2026-07-02T07:31:50.305Z`
- `/api/v1/version`: pass
- `/api/v1/teams/current`: pass, current team `LuckySparrow`
- `/api/v1/projects/{project}`: pass, project `Soar`
- `/api/v1/projects/{project}/production`: pass
- `/api/v1/resources`: pass, `17` visible rows
- `/api/v1/deployments`: pass, `0` rows visible in this runner
- production application statuses:
  - `soar-api`: `running:unknown`
  - `soar-web`: `exited:unhealthy`
  - `workers-backtest`: `exited:unhealthy`
  - `workers-execution`: `running:unknown`
  - `workers-market-data`: `running:unknown`
  - `workers-market-stream`: `running:unknown`

## Result

Production remains blocked for release and authenticated acceptance. API
health/readiness and runtime freshness are healthy, but the public Web surface,
Web build provenance, protected worker readiness, and two Coolify application
resources remain unhealthy.

## Next Owner And Action

Ops Release Lead / board-approved Coolify mutation owner continues
[LUC-6331](/LUC/issues/LUC-6331), inspects unhealthy `soar-web` and
`workers-backtest`, then performs approved restart/redeploy or rollback through
the protected mutation path. DRE/QVE rerun production smoke, rollback guard,
and authenticated acceptance after restoration.
