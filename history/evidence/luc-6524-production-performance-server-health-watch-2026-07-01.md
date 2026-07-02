# LUC-6524 Production Performance And Server Health Watch

Date: 2026-07-01

## Scope

Read-only SPM production performance and server-health watch for Soar.

No deploy, push, restart, rollback execution, env edit, secret/account value
readback, DB/Redis mutation, raw log capture, production account mutation,
subscription/payment mutation, exchange mutation, order, position, or
live-trading action was performed.

## Wake Acknowledgement

The wake payload assigned [LUC-6524](/LUC/issues/LUC-6524) directly with one
new local-board comment:

`softwarehouse-local-repair-lane-starter:v1`.

That comment changed the next action from a generic watch heartbeat into a
local repair/source-control closure lane: inspect the repository, run relevant
read-only validation, persist evidence, and either commit only if evidence
supports clean closure or record the no-commit blocker and next owner.

## Source Snapshot

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Local HEAD: `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`
- Worktree: dirty before this heartbeat from many existing product, docs,
  evidence, generated architecture, and agent-state lanes. This heartbeat
  added only LUC-6524 evidence/task/state notes.

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

- worker heartbeat: `PASS`, age `16507 ms`
- market data: `PASS`, age `16507 ms`
- runtime signal lag: `PASS`, age `0 ms`
- runtime sessions: `PASS`, running count `5`, stale session ids `[]`
- runtime decision activity: `SKIP`, not required for running sessions

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

- checked at `2026-07-01T03:03:46.552Z`
- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_503`
- runtime freshness inside guard: `PASS`
- alerts: `[]`

No rollback was executed.

### Representative Public Timing

Command: Node `fetch` timing sample with 12 second timeout.

Result:

- `https://api.soar.luckysparrow.ch/health -> 200`, `286.5 ms`
- `https://api.soar.luckysparrow.ch/ready -> 200`, `71.2 ms`
- `https://soar.luckysparrow.ch/ -> 503`, `85.1 ms`
- `https://soar.luckysparrow.ch/api/build-info -> 503`, `59.6 ms`

The API is reachable and responsive in this sample. Public Web remains
unavailable with fast `503` responses.

### Coolify Read-Only Projection

Authenticated read-only Coolify API projection used configured environment
bindings by name only; no token or secret values were printed.

Result:

- project endpoint: `200`, project `Soar`
- production environment endpoint: `200`
- resources endpoint: `200`, `17` visible rows
- visible relevant resources: `8`
- `soar-web`: `applications`, `exited:unhealthy`, commit
  `b894e5dd30614dfd2035e91e3d848c842d3ff380`
- `workers-backtest`: `applications`, `exited:unhealthy`, commit `HEAD`
- `soar-api`: `applications`, `running:unknown`, commit `HEAD`
- `workers-market-data`: `applications`, `running:unknown`, commit `HEAD`
- `workers-market-stream`: `applications`, `running:unknown`, commit `HEAD`
- `workers-execution`: `applications`, `running:unknown`, commit `HEAD`
- `postgresql`: `postgresqls`, `running:healthy`
- `redis`: `redis`, `running:healthy`

## Disposition

`BLOCKED / WATCH_COMPLETED / PRODUCTION_WEB_503 / WORKERS_READY_503 /
RUNTIME_FRESHNESS_PASS / ROLLBACK_GUARD_ACTION_REQUIRED`.

## Source-Control Closure

- Affected capability: production performance and server-health watch.
- Affected chain/files: this evidence packet, matching task packet, and
  state/context append notes for Soar production readiness.
- Commit decision: not committed in this heartbeat because the repository was
  already heavily dirty with many unrelated product, evidence, docs, generated
  architecture, and agent-state changes before the LUC-6524 slice. Staging
  only the LUC-6524 closure files while the broader release source tree is
  dirty would create a misleading release provenance commit.
- Push status: forbidden by the scoped wake and not needed.
- Deploy impact: none.

## Residual Risk And Next Owner

[LUC-6331](/LUC/issues/LUC-6331) remains the existing production Web and
backtest-worker restoration path. Ops Release Lead / board-approved Coolify
mutation owner must restart/redeploy or roll back `soar-web` and
`workers-backtest`, then DRE/QVE rerun production smoke, runtime freshness,
rollback guard, and authenticated acceptance.
