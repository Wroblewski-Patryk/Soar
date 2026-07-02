# LUC-6894 Public Probe Runtime Restore Diagnosis

Date: 2026-07-02

## Scope

Read-only DRE diagnosis for [LUC-6894](/LUC/issues/LUC-6894), the critical
runtime gap where `https://soar.luckysparrow.ch` returns `503`.

No commit, push, deploy, restart, rollback execution, env edit, database/Redis
mutation, production account mutation, exchange/payment mutation, order,
position, subscription mutation, live-trading action, secret value readback, or
raw Coolify/log object storage was performed.

## Source Snapshot

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Local HEAD: `6aeb8b8b8c4e90b99d3837189200e0667fdabf1c`
- Worktree: already dirty/divergent before this heartbeat
  (`main...origin/main` ahead `22`, behind `3`); this heartbeat added scoped
  evidence/task/state records only.

## Checks

### Paperclip Context

- `GET /api/issues/LUC-6894/heartbeat-context` returned `200`.
- Issue status before closure: `in_progress`, priority `critical`.
- The wake payload had no pending user comments and did not require fallback
  thread fetch.

### Production Deploy Smoke

```powershell
corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `FAIL`

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 503`
- `WEB /api/build-info -> 503`

### Runtime Freshness / Rollback Guard Boundary

```powershell
$env:DEPLOY_FRESHNESS_API_BASE_URL='https://api.soar.luckysparrow.ch'
corepack pnpm run -s ops:deploy:runtime-freshness
```

Result: `FAIL-CLOSED`

- unauthenticated protected runtime freshness request returned `401`.

```powershell
$env:ROLLBACK_GUARD_API_BASE_URL='https://api.soar.luckysparrow.ch'
corepack pnpm run -s ops:deploy:rollback-guard
```

Result: `ROLLBACK_GUARD_ACTION_REQUIRED / FAIL-CLOSED`

- `shouldRollback=true`
- reasons: `workers_ready_endpoint_http_401`,
  `runtime_freshness_endpoint_http_401`, `alerts_endpoint_http_401`
- no rollback was executed.

### Coolify Read-Only Projection

Authenticated read-only Coolify API calls used configured environment bindings
by name only. No token, resource id, internal URL, raw deployment log, or raw
Coolify object was stored.

Result:

- `/api/v1/version`: `200`
- `/api/v1/teams/current`: `200`
- `/api/v1/resources`: `200`, `17` visible rows
- project-scoped Soar production endpoint: `200`, `7` visible rows

Production application projection:

| Resource | Type | Status |
| --- | --- | --- |
| `soar-web` | application | `exited:unhealthy` |
| `workers-backtest` | application | `exited:unhealthy` |
| `workers-market-stream` | application | `running:unknown` |
| `workers-execution` | application | `running:unknown` |
| `soar-api` | application | `running:unknown` |
| `workers-market-data` | application | `running:unknown` |

### Existing Owner Path Readback

- [LUC-6331](/LUC/issues/LUC-6331): `blocked`, critical, assigned to DRE,
  title `[Soar] Restore production Web and backtest worker health after LUC-6329 watch`.
- [LUC-6816](/LUC/issues/LUC-6816): `blocked`, critical, blocked by
  [LUC-6331](/LUC/issues/LUC-6331), title `[Soar] Coolify production deploy health sweep`.

## Diagnosis

Production is not restored. The current root-cause boundary is operational
runtime state, not a newly proven application-code gap:

- API public health and readiness are reachable.
- Public Web remains unavailable with `503` on `/` and `/api/build-info`.
- Coolify reports `soar-web` as `exited:unhealthy`.
- Coolify reports `workers-backtest` as `exited:unhealthy`.
- Protected runtime readiness cannot be proven from this runner without an
  approved protected auth context; unauthenticated runtime/rollback checks fail
  closed with `401`.

The exact next action requires a release/prod mutation permit for the affected
Coolify production resources: `soar-web` and `workers-backtest`.

## Disposition

`IN_REVIEW / MUTATION_PERMIT_REQUESTED / PUBLIC_WEB_503 /
SOAR_WEB_EXITED_UNHEALTHY / WORKERS_BACKTEST_EXITED_UNHEALTHY /
API_HEALTH_READY_PASS / NO_PRODUCTION_MUTATION`.

An issue-thread confirmation was requested on [LUC-6894](/LUC/issues/LUC-6894)
for an approved Ops/DRE production mutation path. If accepted, the resumed
assignee should confirm target SHA/resource/rollback/smoke, then restart,
redeploy, or rollback only the affected resources and rerun production smoke.

## Next Owner

Board/Ops confirmation path for [LUC-6894](/LUC/issues/LUC-6894):

1. Approve or reject the narrow production mutation permit for `soar-web` and
   `workers-backtest`.
2. On approval, DRE/Ops performs the approved mutation path only after naming
   source SHA/image, target resources, rollback path, and smoke plan.
3. DRE/QVE reruns deploy smoke, runtime freshness with approved protected auth,
   rollback guard, and authenticated production acceptance.
