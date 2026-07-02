# LUC-6580 Coolify Production Deploy Health Sweep

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
- Local HEAD: `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`
- Local branch state: `main...origin/main [ahead 22, behind 3]`
- Worktree: dirty before this heartbeat from existing product, docs, evidence,
  generated architecture, and agent-state lanes. This heartbeat added only
  LUC-6580 evidence/task/state notes.

## Checks

### Public Production Deploy Smoke

Command:

```powershell
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `FAIL`

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 503`
- `WEB /api/build-info -> 503`

### Protected Production Deploy Smoke

Command:

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
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL; $env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD; pnpm run -s ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result: `PASS`

- worker heartbeat age: `8001 ms`, threshold `60000 ms`
- market data age: `8001 ms`, threshold `120000 ms`
- runtime signal lag: `0 ms`, threshold `90000 ms`
- running runtime sessions: `5`
- stale session ids: `[]`

### Rollback Guard

Command used process-local mapping from `SMOKE_AUTH_EMAIL` and
`SMOKE_AUTH_PASSWORD` to the `ROLLBACK_GUARD_*` namespace. No secret values
were printed or stored.

```powershell
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL; $env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD; pnpm run -s ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

- `shouldRollback: true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`
- rollback was not executed.

### Coolify Read-Only Projection

Sanitized read-only API probe. No resource ids, tokens, URLs, or raw logs were
stored.

- `/api/v1/version`: `200`
- `/api/v1/teams/current`: `200`
- `/api/v1/projects/{project}`: `200`
- `/api/v1/projects/{project}/environments`: `200`
- `/api/v1/projects/{project}/production`: `200`
- production inventory: `6` applications, `1` PostgreSQL, `1` Redis
- application statuses:
  - `soar-web`: `exited:unhealthy`
  - `workers-backtest`: `exited:unhealthy`
  - `workers-market-stream`: `running:unknown`
  - `workers-execution`: `running:unknown`
  - `soar-api`: `running:unknown`
  - `workers-market-data`: `running:unknown`
- PostgreSQL: `running:healthy`
- Redis: `running:healthy`
- `/api/v1/resources`: `200`, `17` visible rows
- relevant global resources visible by name:
  - `soar-web`: `application`, `exited:unhealthy`
  - `soar-api`: `application`, `running:unknown`
- `/api/v1/deployments`: `200`, `8` rows, `8` queued

## Result

`BLOCKED / API_HEALTH_READY_PASS / PRODUCTION_WEB_503 /
WORKERS_READY_503 / SOAR_WEB_EXITED_UNHEALTHY /
WORKERS_BACKTEST_EXITED_UNHEALTHY / RUNTIME_FRESHNESS_PASS /
ROLLBACK_GUARD_ACTION_REQUIRED`

This is not a safe release-ready production state. API health/readiness and
runtime freshness pass, but Web availability, Web build provenance, protected
worker readiness, and Coolify resource health fail.

## Heartbeat Recheck

Second DRE recheck on 2026-07-01 reproduced the same blocked state.

- Public deploy smoke: `FAIL`; API `/health` and `/ready` returned `200`;
  Web `/` and `/api/build-info` returned `503`.
- Protected deploy smoke: `FAIL`; API `/health` and `/ready` returned `200`;
  Web `/` and `/api/build-info` returned `503`; protected `/workers/ready`
  returned `503`.
- Runtime freshness: `PASS`; worker heartbeat and market data age were about
  `5.3s`, runtime signal lag `0 ms`, and running runtime sessions `5`.
- Rollback guard: `FAIL / shouldRollback=true`; reason
  `workers_ready_endpoint_http_503`; runtime freshness inside the guard
  passed and alerts were empty.
- Coolify read-only projection: endpoints returned `200`; production inventory
  remained `6` applications, `1` PostgreSQL, and `1` Redis; `soar-web` and
  `workers-backtest` remained `exited:unhealthy`; PostgreSQL and Redis
  remained `running:healthy`; deployments endpoint still showed `8` queued
  rows.
- Production mutation: none.
- Paperclip control-plane update: final `PATCH /api/issues/{task}` to
  `blocked` aborted after `20s`; `/api/health` also aborted after `8s` from
  this runner. On control-plane recovery, apply the same `blocked` disposition
  if it did not land.

## Next Owner And Action

- Owner: Ops Release Lead / board-approved Coolify mutation owner.
- Action: continue the existing [LUC-6331](/LUC/issues/LUC-6331) production
  Web and backtest-worker restoration path; inspect queued deployments and
  unhealthy `soar-web` / `workers-backtest`, then restart/redeploy/rollback
  only through the approved protected mutation lane.
- After restoration: DRE/QVE reruns deploy smoke, runtime freshness, rollback
  guard, authenticated acceptance, and provenance checks.

## Source-Control Closure

- Application/repo path: `C:/Personal/Projekty/Aplikacje/Soar`
- Files changed by this heartbeat:
  - `history/evidence/luc-6580-coolify-production-deploy-health-sweep-2026-07-01.md`
  - `history/tasks/luc-6580-coolify-production-deploy-health-sweep-2026-07-01-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/system-health.md`
  - `.agents/state/module-confidence-ledger.md`
- Verification commands: listed above.
- Commit SHA: not committed; the shared worktree was already heavily dirty and
  `main` was ahead/behind before this heartbeat.
- Push status: `blocked`; pushing from this dirty/divergent worktree would be
  a production deploy risk.
- Deploy impact: none from this heartbeat.
- Residual risk: production Web remains unavailable and protected worker
  readiness remains failed until the approved Coolify mutation owner resolves
  [LUC-6331](/LUC/issues/LUC-6331).
- Control-plane caveat: Paperclip issue mutation was attempted but is
  unconfirmed because local API health and PATCH calls timed out from this
  runner.
