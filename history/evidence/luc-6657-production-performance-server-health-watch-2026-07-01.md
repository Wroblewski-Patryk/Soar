# LUC-6657 Production Performance And Server Health Watch

Date: 2026-07-01

## Scope

Read-only DRE production performance and server health watch for Soar.

No deploy, push, restart, rollback execution, environment edit, database/Redis
mutation, production account mutation, exchange/payment mutation, order,
position, subscription mutation, live-trading action, secret value readback, or
raw log-body storage was performed.

## Source Snapshot

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Local branch state: `main...origin/main [ahead 22, behind 3]`
- Worktree: dirty before this heartbeat from existing product, docs, evidence,
  generated architecture, and agent-state lanes. This heartbeat added only
  LUC-6657 evidence/task/state notes.

## Checks

### Public Production Deploy Smoke

Command:

```powershell
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `FAIL`

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 503`
- `WEB /api/build-info -> 503`

### Protected Production Deploy Smoke

Command:

```powershell
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
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
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL; $env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD; node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch --timeout-ms 15000
```

Result: `PASS`

- worker heartbeat age: `9028 ms`, threshold `60000 ms`
- market data age: `9028 ms`, threshold `120000 ms`
- runtime signal lag: `0 ms`, threshold `90000 ms`
- running runtime sessions: `5`
- stale session ids: `[]`

### Rollback Guard

Command used process-local mapping from `SMOKE_AUTH_EMAIL` and
`SMOKE_AUTH_PASSWORD` to the `ROLLBACK_GUARD_*` namespace. No secret values
were printed or stored.

```powershell
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL; $env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD; node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch --timeout-ms 15000
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

- checked at: `2026-07-01T16:26:35.783Z`
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
- `/api/v1/deployments`: `200`, `8` rows, `8` queued

## Result

`BLOCKED / API_HEALTH_READY_PASS / PRODUCTION_WEB_503 /
WORKERS_READY_503 / SOAR_WEB_EXITED_UNHEALTHY /
WORKERS_BACKTEST_EXITED_UNHEALTHY / RUNTIME_FRESHNESS_PASS /
ROLLBACK_GUARD_ACTION_REQUIRED`

This is not a release-ready production state. API health/readiness and runtime
freshness pass, but Web availability, Web build provenance, protected worker
readiness, and Coolify resource health fail.

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
  - `history/evidence/luc-6657-production-performance-server-health-watch-2026-07-01.md`
  - `history/tasks/luc-6657-production-performance-server-health-watch-2026-07-01-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/system-health.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/next-steps.md`
- Verification commands: listed above.
- Commit SHA: not committed; the shared worktree was already heavily dirty and
  `main` was ahead/behind before this heartbeat.
- Push status: blocked; pushing from this dirty/divergent worktree would be a
  production deploy risk.
- Deploy impact: none from this heartbeat.
- Residual risk: production Web remains unavailable and protected worker
  readiness remains failed until the approved Coolify mutation owner resolves
  [LUC-6331](/LUC/issues/LUC-6331).
