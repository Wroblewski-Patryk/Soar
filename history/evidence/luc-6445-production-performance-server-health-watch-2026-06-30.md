# LUC-6445 Production Performance And Server Health Watch

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
  heartbeat added only LUC-6445 evidence/task/state notes.

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
pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch --timeout-ms 12000
```

Result: `PASS`

- worker heartbeat: `PASS`, age `26706 ms`
- market data: `PASS`, age `26706 ms`
- runtime signal lag: `PASS`, age `0 ms`
- runtime sessions: `PASS`, running count `5`, stale session ids `[]`
- runtime decision activity: `SKIP`, not required for running sessions

### Rollback Guard

Command used process-local environment mapping from `SMOKE_AUTH_EMAIL` and
`SMOKE_AUTH_PASSWORD` to the `ROLLBACK_GUARD_*` namespace without printing
secret values.

```powershell
$env:ROLLBACK_GUARD_TIMEOUT_MS='12000'
pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

- checked at `2026-06-30T18:22:50.192Z`
- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`

No rollback was executed.

### Representative Public Timing

Command: PowerShell `Invoke-WebRequest` timing sample with 12 second timeout.

Result:

- `https://api.soar.luckysparrow.ch/health -> 200`, `4729.9 ms`
- `https://api.soar.luckysparrow.ch/ready -> 200`, `11012.8 ms`
- `https://soar.luckysparrow.ch/ -> 503`, `226.3 ms`
- `https://soar.luckysparrow.ch/api/build-info -> 503`, `18.9 ms`

The API is reachable but `/ready` was slow in this sample. Web remains down.

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

## Residual Risk And Next Owner

[LUC-6331](/LUC/issues/LUC-6331) remains the existing production Web and
backtest-worker restoration path. DRE/Ops should resolve that incident path,
then rerun the protected production watch. Host-level proof and release-grade
source/build provenance remain separate existing gates.
