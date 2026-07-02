# LUC-5608 Production Performance And Server Health Watch

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH**
- Issue: [LUC-5608](/LUC/issues/LUC-5608)
- Evidence window: 2026-06-27T18:21Z to 2026-06-27T18:24Z
- Owner: 09 DRE (Deployment & Reliability Engineer)

## Scope

Read-only recurring production performance and server-health watch for Soar.

Included:

- public smoke for API `/health`, API `/ready`, Web `/`, and Web
  `/api/build-info`
- protected `/workers/ready` through stale-token and fresh-login paths
- public timing samples
- authenticated dashboard/admin API timing
- authenticated route/module clickthrough artifact readback
- runtime freshness and rollback guard
- read-only Coolify project/environment/resource/deployment projection
- source-control and process cleanup posture

Excluded:

- deploy, push, restart, rollback execution, environment edit, secret/account
  readback, database/Redis mutation, raw log capture, screenshot capture,
  production account mutation, subscription/payment mutation, exchange action,
  order, position, or live-trading action

## Wake Context

The wake payload scoped this heartbeat to [LUC-5608](/LUC/issues/LUC-5608)
with no pending comments and `fallbackFetchNeeded=false`. Heartbeat context
showed the issue as `blocked` with no first-class blockers, so this heartbeat
treated that as a stale status and executed the actionable watch loop.

## Public And Protected Smoke

Stale-token command:

```powershell
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- FAIL API `/workers/ready` -> `401`

Fresh-login command, with `SMOKE_AUTH_TOKEN` suppressed only for the child
process:

```powershell
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- PASS API `/workers/ready` -> `200`

Interpretation: production public endpoints and protected worker readiness are
healthy through the approved fresh-login path. The pre-bound smoke token remains
stale or insufficient and is not evidence of an active worker outage.

## Build Info

Production Web `/api/build-info` returned:

- `gitSha`: `42177530f2a2ddc22832133b545bccab6ab404eb`
- `gitRef`: `main`
- `buildId`: `Urnq8xtZUh932c0e3vKGl`
- `metadataGeneratedAt`: `2026-06-15T21:00:54.489Z`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-06-27T18:24:31.942Z`

`env-runtime` remains diagnostic-only provenance and is not release-grade build
metadata.

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 226.4 | 52.4 | 226.4, 24.3, 29.4, 23.3, 20.1, 33.1, 28.7, 33.8 |
| API `/ready` | `200:8` | 40.9 | 34.4 | 38.0, 25.7, 39.8, 30.8, 29.2, 34.4, 36.1, 40.9 |
| Web `/` | `200:8` | 135.5 | 77.9 | 135.5, 60.0, 68.1, 60.1, 58.7, 95.5, 90.3, 54.9 |
| Web `/api/build-info` | `200:8` | 37.3 | 30.7 | 31.0, 37.3, 34.6, 27.2, 29.0, 29.2, 29.5, 28.1 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Fresh login token source: `login`. Payload bodies were not stored. Three
samples per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 69 | 41 | 69, 24, 30 |
| `/dashboard/bots` | `200:3` | 42 | 33 | 42, 26, 31 |
| `/dashboard/wallets` | `200:3` | 31 | 29 | 29, 27, 31 |
| `/dashboard/markets/catalog` | `200:3` | 45 | 41 | 45, 34, 44 |
| `/dashboard/strategies` | `200:3` | 29 | 27 | 25, 26, 29 |
| `/dashboard/backtests/runs` | `200:3` | 31 | 29 | 31, 27, 29 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 62 | 52 | 47, 62, 47 |
| `/dashboard/logs` | `200:3` | 31 | 30 | 31, 28, 30 |
| `/dashboard/profile/subscription` | `200:3` | 42 | 40 | 40, 42, 39 |
| `/admin/users` | `200:3` | 34 | 29 | 25, 27, 34 |
| `/admin/subscriptions/plans` | `200:3` | 28 | 26 | 28, 24, 26 |

No 60-second-class dashboard stall or HTTP failure was reproduced.

The generated JSON artifact for this heartbeat also contains an earlier
ten-sample timing window with public targets at `200:10` and one authenticated
`/dashboard/markets/catalog` cold sample at `2010.3 ms`, followed by
normalized samples under `37 ms`. This remains a watch residual, not an
incident trigger from this window.

## Authenticated UI Clickthrough

Existing artifact from this heartbeat window:

- `history/evidence/luc-5608-prod-ui-module-clickthrough-2026-06-27.md`
- `history/artifacts/luc-5608-prod-ui-module-clickthrough-2026-06-27.json`

Result: PASS.

- public routes: PASS `4/4`
- dashboard routes: PASS `18/18`
- admin routes: PASS `3/3`
- legacy redirects: PASS `3/3`
- observed build-info SHA:
  `42177530f2a2ddc22832133b545bccab6ab404eb`

## Runtime Freshness

Command:

```powershell
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and
`DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential
family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `13965 ms`, threshold `60000 ms`
- market data freshness: PASS, age `13965 ms`, threshold `120000 ms`
- runtime signal lag: PASS, age `0 ms`, threshold `90000 ms`
- runtime sessions: PASS, running count `5`, stale session ids `[]`
- runtime decision activity: SKIP, not required for running sessions

## Rollback Guard

Command:

```powershell
node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `ROLLBACK_GUARD_AUTH_EMAIL` and
`ROLLBACK_GUARD_AUTH_PASSWORD` mapped from the approved smoke credential family
only in the child process.

Result:

- `shouldRollback`: `false`
- reasons: none
- workers ready: `ready`
- topology status: `healthy`
- required worker families: `backtest`, `execution`, `market-data`,
  `market-stream`
- freshness: PASS
- running runtime sessions: `5`
- stale session ids: none
- alerts: none

## Coolify / VPS Read-Only Projection

Secret handling:

- Present binding names were checked without values:
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_API_APP_ID`, `COOLIFY_SOAR_WEB_APP_ID`,
  `COOLIFY_SOAR_POSTGRES_RESOURCE_ID`, `COOLIFY_SOAR_REDIS_RESOURCE_ID`, and
  `VPS_HOST`.
- No token values, raw resource ids, internal URLs, cookies, credentials,
  database values, raw deployment objects, or log bodies were printed or
  stored.

Authenticated Coolify `GET` projection:

| Check | Result | Timing |
| --- | --- | ---: |
| `GET /api/v1/version` | pass `200` | 173 ms |
| `GET /api/v1/teams/current` | pass `200` | 103 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 54 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 46 ms |
| `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass `200` | 98 ms |
| `GET /api/v1/resources` | pass `200` | 169 ms |
| `GET /api/v1/deployments` | pass `200` | 48 ms |

Production environment projection:

- applications: `6`
- application rows:
  `soar-web`, `workers-backtest`, `workers-market-stream`,
  `workers-execution`, `soar-api`, `workers-market-data`
- application statuses: `running:unknown` for all six rows
- restart counts:
  `soar-web=1`, `workers-backtest=0`, `workers-market-stream=0`,
  `workers-execution=2`, `soar-api=2`, `workers-market-data=0`
- databases: `postgresql` and `redis`, both `running:healthy`
- database restart counts: `postgresql=52`, `redis=682`
- global resources: `17`
- visible deployment rows: `0`

Host-level VPS pressure, proxy/container-engine pressure, and sanitized
log-window capture were not attempted because this runner exposes `VPS_HOST`
but no approved `SSH*` or dedicated read-only `VPS_*` status credential family.

## Source-Control Closure

Repository state at closure check:

- branch: `main...origin/main [ahead 14, behind 1]`
- dirty worktree: pre-existing mixed same-day state/evidence/package/code
  changes from multiple lanes
- commit: not created
- push: not needed and not authorized
- deploy impact: none

This issue produced evidence/state only and did not change runtime code,
package behavior, deployment config, or production state.

## Validation

- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`:
  public PASS, protected `/workers/ready` failed through stale token with
  `401`.
- Same deploy smoke with `SMOKE_AUTH_TOKEN` suppressed:
  all checks passed, including protected `/workers/ready`.
- Public timing:
  API `/health`, API `/ready`, Web `/`, and Web `/api/build-info` all returned
  `200:8`.
- Authenticated dashboard/admin API timing:
  all representative reads returned `200:3`.
- Generated JSON artifact:
  earlier timing window public targets `200:10`, one
  `/dashboard/markets/catalog` cold sample `2010.3 ms` that normalized.
- `node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch`:
  PASS.
- `node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch`:
  PASS, `shouldRollback=false`.
- `node --test scripts/checkCoolifyStackEnv.test.mjs`:
  PASS (`11/11`).
- Read-only Coolify `GET` projection:
  PASS, zero visible deployment rows.

## Cleanup

This heartbeat did not start dev servers, Docker containers, Playwright, or
headless browsers. Process cleanup check found no `chrome-headless-shell`,
`chromium`, `chrome`, or `msedge` validation processes to stop.

## Disposition

[LUC-5608](/LUC/issues/LUC-5608) can close as a read-only production
performance and server-health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- fresh-login protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection showed zero visible deployment rows and
  PostgreSQL/Redis `running:healthy`
- no duplicate incident/repair issue is required from this evidence window

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready` with
  `401`
- one `/dashboard/markets/catalog` cold sample reached `2010.3 ms`, then
  normalized
- Coolify application rows continue reporting `running:unknown`
- host-level VPS pressure/log-window evidence still requires approved
  read-only host-status credentials
- Web build-info still reports diagnostic `metadataSource=env-runtime`
