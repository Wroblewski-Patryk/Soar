# LUC-6548 Production Performance And Server Health Watch

Date: 2026-07-01

## Scope

Read-only SPM production performance and server-health watch for Soar.

No deploy, push, restart, rollback execution, env edit, secret/account value
readback, DB/Redis mutation, raw log capture, production account mutation,
subscription/payment mutation, exchange mutation, order, position, or
live-trading action was performed.

## Wake Acknowledgement

The wake payload assigned [LUC-6548](/LUC/issues/LUC-6548) directly with one
new local-board comment:

`softwarehouse-local-repair-lane-starter:v1`.

That comment changed the next action from a generic watch heartbeat into a
local repair/source-control closure lane: inspect the repository, run relevant
read-only validation, persist evidence, and either commit only if evidence
supports clean closure or record the no-commit blocker and next owner.

## Source Snapshot

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Local HEAD: `6aeb8b8b8c4e`
- Worktree: dirty before this heartbeat from many existing product, docs,
  evidence, generated architecture, and agent-state lanes. This heartbeat
  added only [LUC-6548](/LUC/issues/LUC-6548) evidence/task/state notes.

## Checks

### Deploy Smoke

Command:

```powershell
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL`

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> status 503`
- `WEB /api/build-info -> status 503`
- `API /workers/ready -> status 503`

### Runtime Freshness

Command:

```powershell
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Result: `FAIL / PROTECTED_AUTH_BINDING_ABSENT_IN_RUNNER`

- protected runtime freshness request returned HTTP `401`
- current runner has no `SMOKE_AUTH_TOKEN`, `SMOKE_LOGIN_EMAIL`,
  `SMOKE_LOGIN_PASSWORD`, `PROD_UI_AUDIT_EMAIL`, or
  `PROD_UI_AUDIT_PASSWORD` environment binding present by name
- no secret values were read or printed

### Rollback Guard

Command:

```powershell
pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result: `FAIL / ROLLBACK_GUARD_ACTION_REQUIRED`

```json
{
  "checkedAt": "2026-07-01T06:05:07.112Z",
  "shouldRollback": true,
  "reasons": [
    "workers_ready_endpoint_http_401",
    "runtime_freshness_endpoint_http_401",
    "alerts_endpoint_http_401"
  ],
  "workersReady": null,
  "freshness": null,
  "alerts": []
}
```

No rollback was executed.

### Representative Public Timing

Command: Node `fetch` timing sample.

Result:

- `https://api.soar.luckysparrow.ch/health -> 200`, `364 ms`
- `https://api.soar.luckysparrow.ch/ready -> 200`, `74 ms`
- `https://soar.luckysparrow.ch/ -> 503`, `86 ms`
- `https://soar.luckysparrow.ch/auth/login -> 503`, `64 ms`
- `https://soar.luckysparrow.ch/api/build-info -> 503`, `17 ms`
- `https://api.soar.luckysparrow.ch/workers/ready -> 401`, `17 ms`

The API is reachable and responsive in this sample. Public Web remains
unavailable with fast `503` responses. Protected `/workers/ready` without auth
fails closed with `401` in the direct probe.

### Coolify Read-Only Projection

Authenticated read-only Coolify API projection used configured environment
bindings by name only; no token or secret values were printed.

Result:

- `/api/v1/version`: `200`
- `/api/v1/teams/current`: `200`
- `/api/v1/projects/{project}`: `200`
- `/api/v1/projects/{project}/environments`: `200`
- `/api/v1/projects/{project}/production`: `200`
- `/api/v1/resources`: `200`, `17` visible rows
- `/api/v1/deployments`: `200`, `8` rows, `8` queued
- visible relevant resources: `8`
- `soar-web`: `exited:unhealthy`, git commit present
- `workers-backtest`: `exited:unhealthy`, git commit present
- `workers-market-stream`: `running:unknown`, git commit present
- `workers-execution`: `running:unknown`, git commit present
- `workers-market-data`: `running:unknown`, git commit present
- `soar-api`: `running:unknown`, git commit present
- `postgresql`: `running:healthy`
- `redis`: `running:healthy`

## Disposition

`BLOCKED / WATCH_COMPLETED / PRODUCTION_WEB_503 /
PROTECTED_RUNTIME_AUTH_BINDING_ABSENT / COOLIFY_WEB_BACKTEST_UNHEALTHY /
ROLLBACK_GUARD_ACTION_REQUIRED / NO_COMMIT_DIRTY_TREE`.

## Source-Control Closure

- Affected capability: production performance and server-health watch.
- Affected chain/files: this evidence packet, matching task packet, and
  state/context append notes for Soar production readiness.
- Commit decision: not committed in this heartbeat because the repository was
  already heavily dirty with many unrelated product, evidence, docs, generated
  architecture, and agent-state changes before the [LUC-6548](/LUC/issues/LUC-6548)
  slice. Staging only the [LUC-6548](/LUC/issues/LUC-6548) closure files while
  the broader release source tree is dirty would create misleading release
  provenance.
- Push status: forbidden by the scoped wake and not needed.
- Deploy impact: none.

## Residual Risk And Next Owner

[LUC-6331](/LUC/issues/LUC-6331) remains the existing production Web and
backtest-worker restoration path. Ops Release Lead / board-approved Coolify
mutation owner must restart/redeploy or roll back `soar-web` and
`workers-backtest`, then DRE/QVE rerun production smoke, runtime freshness,
rollback guard, and authenticated acceptance with approved protected auth
bindings.
