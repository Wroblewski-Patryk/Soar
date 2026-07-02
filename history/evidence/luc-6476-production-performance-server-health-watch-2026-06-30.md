# LUC-6476 Production Performance And Server Health Watch

Date: 2026-06-30

## Scope

Read-only DRE production performance and server-health watch for Soar.

No deploy, push, restart, rollback execution, env edit, secret/account value
readback, DB/Redis mutation, raw log capture, production account mutation,
subscription/payment mutation, exchange mutation, order, position, or
live-trading action was performed.

## Source Snapshot

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Local HEAD: `dedb0e532defe0afddf12c5a5d130295a72af660`
- Worktree: dirty before this heartbeat from existing unrelated lanes; this
  heartbeat added only LUC-6476 evidence/task/state notes.

## Checks

### Deploy Smoke

Command:

```powershell
$env:SMOKE_TIMEOUT_MS='12000'
pnpm exec node scripts/deploySmokeCheck.mjs --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL`

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 503`
- `WEB /api/build-info -> 503`
- `API /workers/ready -> 503`

### Runtime Freshness

Command used process-local environment mapping from `SMOKE_AUTH_EMAIL` and
`SMOKE_AUTH_PASSWORD` to the `DEPLOY_FRESHNESS_*` namespace without printing
secret values.

```powershell
$env:DEPLOY_FRESHNESS_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:DEPLOY_FRESHNESS_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch --timeout-ms 12000
```

Result: `PASS`

- worker heartbeat: `PASS`, age `10670 ms`
- market data: `PASS`, age `10670 ms`
- runtime signal lag: `PASS`, age `0 ms`
- runtime sessions: `PASS`, running count `5`, stale session ids `[]`
- runtime decision activity: `SKIP`, not required for running sessions

The first unauthenticated attempt returned `401`; the accepted proof is the
rerun through the approved process-local smoke-login alias path.

### Rollback Guard

Command used process-local environment mapping from `SMOKE_AUTH_EMAIL` and
`SMOKE_AUTH_PASSWORD` to the `ROLLBACK_GUARD_*` namespace without printing
secret values.

```powershell
$env:ROLLBACK_GUARD_AUTH_EMAIL=$env:SMOKE_AUTH_EMAIL
$env:ROLLBACK_GUARD_AUTH_PASSWORD=$env:SMOKE_AUTH_PASSWORD
$env:ROLLBACK_GUARD_TIMEOUT_MS='12000'
pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

- checked at `2026-06-30T20:37:50.716Z`
- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`

No rollback was executed.

### Representative Public Timing

Command: PowerShell `.NET HttpClient` timing sample with 12 second timeout.

Result:

- `https://api.soar.luckysparrow.ch/health -> 200`, `225.7 ms`
- `https://api.soar.luckysparrow.ch/ready -> 200`, `23.6 ms`
- `https://soar.luckysparrow.ch/ -> 503`, `71.7 ms`
- `https://soar.luckysparrow.ch/api/build-info -> 503`, `15.2 ms`

The API is reachable in this sample. Public Web remains unavailable.

### Coolify Read-Only Projection

Authenticated read-only Coolify API projection used configured environment
bindings by name only; no token or secret values were printed.

Result:

- project endpoint: `200`
- production endpoint: `200`
- resources endpoint: `200`
- visible resources: `17`
- `soar-web`: `application`, `exited:unhealthy`
- `workers-backtest`: `application`, `exited:unhealthy`
- `soar-api`: `application`, `running:unknown`
- `workers-market-data`: `application`, `running:unknown`
- `workers-market-stream`: `application`, `running:unknown`
- `workers-execution`: `application`, `running:unknown`
- PostgreSQL rows: `running:healthy`
- Redis row: `running:healthy`

## Disposition

`BLOCKED / WATCH_COMPLETED / PRODUCTION_WEB_503 / WORKERS_READY_503 /
RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.

Paperclip control-plane caveat: `PATCH /api/issues/LUC-6476` with full
comment timed out after `12s`; a status-only retry timed out after `8s`.
Next successful control-plane recovery should confirm whether either mutation
landed and, if not, apply `blocked` using this evidence.

## Residual Risk And Next Owner

[LUC-6331](/LUC/issues/LUC-6331) remains the existing production Web and
backtest-worker restoration path. DRE/Ops should resolve that incident path,
then rerun the protected production watch. Host-level proof and release-grade
source/build provenance remain separate existing gates.
