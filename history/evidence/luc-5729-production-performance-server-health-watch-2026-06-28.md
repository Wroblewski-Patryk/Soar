# LUC-5729 Production Performance And Server Health Watch

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH**
- Issue: [LUC-5729](/LUC/issues/LUC-5729)
- Evidence window: 2026-06-28T00:30Z to 2026-06-28T00:33Z
- Owner: 09 DRE (Deployment & Reliability Engineer)

## Scope

Read-only recurring production performance and server-health watch for Soar.

Included:

- public smoke for API `/health`, API `/ready`, Web `/`, and Web `/api/build-info`
- protected `/workers/ready` through stale-token and fresh-login paths
- public timing samples
- authenticated dashboard/admin API timing
- focused follow-up timing for `/dashboard/markets/catalog`
- runtime freshness and rollback guard
- read-only Coolify project/environment/resource/deployment projection

Excluded:

- deploy, push, restart, rollback execution, environment edit, secret/account readback, database/Redis mutation, raw log capture, production account mutation, subscription/payment mutation, exchange action, order, position, or live-trading action

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

Fresh-login command, with `SMOKE_AUTH_TOKEN` suppressed only for the child process:

```powershell
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- PASS API `/workers/ready` -> `200`

Interpretation: public production endpoints and protected worker readiness are healthy through the approved fresh-login path. The pre-bound smoke token remains stale or insufficient and is not evidence of an active worker outage.

## Build Info

Web `/api/build-info` returned:

- `gitSha`: `42177530f2a2ddc22832133b545bccab6ab404eb`
- `gitRef`: `main`
- `metadataGeneratedAt`: `2026-06-15T21:00:54.489Z`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-06-28T00:32:39.715Z`

This remains diagnostic runtime provenance only; release-grade build provenance is a separate release/source-control gate.

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 60.7 | 22.6 | 60.7, 16.8, 17.0, 17.6, 17.0, 17.2, 17.5, 17.3 |
| API `/ready` | `200:8` | 30.0 | 21.9 | 22.2, 22.0, 19.5, 25.5, 19.8, 15.7, 20.8, 30.0 |
| Web `/` | `200:8` | 102.0 | 36.4 | 102.0, 27.3, 29.5, 27.7, 26.7, 24.3, 28.9, 25.0 |
| Web `/api/build-info` | `200:8` | 29.7 | 27.0 | 28.8, 25.8, 24.2, 28.9, 25.7, 27.5, 29.7, 25.2 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Fresh login session source: cookie-based login. Payload bodies were not stored. Three samples per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 27.5 | 26.8 | 25.6, 27.5, 27.4 |
| `/dashboard/bots` | `200:3` | 41.5 | 34.7 | 41.5, 31.6, 31.1 |
| `/dashboard/wallets` | `200:3` | 30.7 | 29.0 | 28.2, 28.2, 30.7 |
| `/dashboard/markets/catalog` | `200:3` | 1195.3 | 419.7 | 1195.3, 31.6, 32.3 |
| `/dashboard/strategies` | `200:3` | 31.3 | 28.7 | 31.3, 27.6, 27.2 |
| `/dashboard/backtests/runs` | `200:3` | 39.0 | 31.5 | 39.0, 26.9, 28.6 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 73.0 | 54.6 | 73.0, 43.5, 47.2 |
| `/dashboard/logs` | `200:3` | 36.9 | 36.2 | 34.8, 36.9, 36.8 |
| `/dashboard/profile/subscription` | `200:3` | 37.2 | 33.3 | 37.2, 31.5, 31.2 |
| `/admin/users` | `200:3` | 30.5 | 28.4 | 26.4, 30.5, 28.4 |
| `/admin/subscriptions/plans` | `200:3` | 35.6 | 28.9 | 26.0, 25.0, 35.6 |

Focused follow-up for `/dashboard/markets/catalog`:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200:8` | 35.9 | 31.0 | 29.4, 33.2, 27.4, 33.2, 30.2, 35.9, 30.3, 28.1 |

Interpretation: no 60-second-class dashboard stall or persistent API bottleneck was reproduced. The market catalog again showed one cold low-second sample and then normalized.

## Runtime Freshness

Command:

```powershell
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and `DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `14956 ms`, threshold `60000 ms`
- market data freshness: PASS, age `14956 ms`, threshold `120000 ms`
- runtime signal lag: PASS, age `0 ms`, threshold `90000 ms`
- runtime sessions: PASS, running count `5`, stale session ids `[]`
- runtime decision activity: SKIP, not required for running sessions

## Rollback Guard

Command:

```powershell
node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `ROLLBACK_GUARD_AUTH_EMAIL` and `ROLLBACK_GUARD_AUTH_PASSWORD` mapped from the approved smoke credential family only in the child process.

Result:

- checked at `2026-06-28T00:31:00.537Z`
- `shouldRollback`: `false`
- reasons: none
- workers ready: `ready`
- topology status: `healthy`
- required worker families: `backtest`, `execution`, `market-data`, `market-stream`
- freshness: PASS
- running runtime sessions: `5`
- stale session ids: none
- alerts: none

## Coolify / VPS Read-Only Projection

Secret handling:

- Present binding names were checked without values: `COOLIFY_*`, `SMOKE_AUTH_*`, `SOAR_*`, and `VPS_HOST`.
- No token values, raw resource ids, internal URLs, cookies, credentials, database values, raw deployment objects, or log bodies were printed or stored.

Authenticated Coolify `GET` projection:

| Check | Result | Timing |
| --- | --- | ---: |
| `GET /api/v1/version` | pass `200` | 252 ms |
| `GET /api/v1/teams/current` | pass `200` | 110 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 75 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 52 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 88 ms |
| `GET /api/v1/resources` | pass `200` | 162 ms |
| `GET /api/v1/deployments` | pass `200` | 53 ms |

Production environment projection:

- applications: `6`
- application rows: `soar-web`, `workers-backtest`, `workers-market-stream`, `workers-execution`, `soar-api`, `workers-market-data`
- application statuses: `running:unknown` for all six rows
- restart counts: `soar-web=1`, `workers-backtest=0`, `workers-market-stream=0`, `workers-execution=2`, `soar-api=2`, `workers-market-data=0`
- databases: PostgreSQL and Redis, both `running:healthy`
- database restart counts: `postgresql=52`, `redis=682`
- global resources: `17`
- visible deployment rows: `0`

Host-level VPS pressure, proxy/container-engine pressure, and sanitized log-window capture were not attempted because this runner exposes `VPS_HOST` but no approved `SSH*` or dedicated read-only `VPS_*` status credential family.

## Source-Control Closure

Repository state at closure check:

- branch: `main...origin/main [ahead 14, behind 1]` from prior state
- dirty worktree: pre-existing mixed same-day state/evidence/package/code changes from multiple lanes
- commit: not created
- push: not needed and not authorized
- deploy impact: none

This issue produced evidence/state only and did not change runtime code, package behavior, deployment config, or production state.

## Validation

- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`: public PASS, protected `/workers/ready` failed through stale token with `401`.
- Same deploy smoke with `SMOKE_AUTH_TOKEN` suppressed: all checks passed, including protected `/workers/ready`.
- Public timing: API `/health`, API `/ready`, Web `/`, and Web `/api/build-info` all returned `200:8`.
- Authenticated dashboard/admin API timing: all representative reads returned `200:3`; market catalog cold sample normalized on follow-up `200:8`.
- `node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch`: PASS.
- `node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch`: PASS, `shouldRollback=false`.
- Read-only Coolify `GET` projection: PASS, zero visible deployment rows.

## Cleanup

This heartbeat did not start dev servers, Docker containers, Playwright, or headless browsers. No task-owned validation processes needed teardown.

## Disposition

[LUC-5729](/LUC/issues/LUC-5729) can close as a read-only production performance and server-health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- fresh-login protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection showed zero visible deployment rows and PostgreSQL/Redis `running:healthy`
- no duplicate incident/repair issue is required from this evidence window

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready` with `401`
- one `/dashboard/markets/catalog` cold sample reached `1195.3 ms`, then normalized to max `35.9 ms`
- Coolify application rows continue reporting `running:unknown`
- host-level VPS pressure/log-window evidence still requires approved read-only host-status credentials
- Web build-info provenance remains a separate release/source-control gate
