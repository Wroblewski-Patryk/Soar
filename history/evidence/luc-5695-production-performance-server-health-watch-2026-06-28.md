# LUC-5695 Production Performance And Server Health Watch

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH**
- Issue: [LUC-5695](/LUC/issues/LUC-5695)
- Evidence window: 2026-06-27T22:35Z to 2026-06-27T22:38Z
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

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 186.0 | 62.8 | 136.0, 186.0, 29.7, 24.4, 25.2, 26.0, 32.4, 42.9 |
| API `/ready` | `200:8` | 81.6 | 48.2 | 74.8, 34.9, 34.5, 35.6, 81.6, 28.9, 38.6, 56.6 |
| Web `/` | `200:8` | 109.6 | 34.6 | 109.6, 22.7, 26.3, 30.3, 25.4, 25.2, 20.5, 16.5 |
| Web `/api/build-info` | `200:8` | 107.4 | 35.0 | 25.8, 25.9, 107.4, 24.6, 23.0, 25.7, 28.6, 18.6 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Fresh login session source: cookie-based login. Payload bodies were not stored. Three samples per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 31.0 | 29.6 | 30.4, 31.0, 27.4 |
| `/dashboard/bots` | `200:3` | 47.8 | 35.4 | 47.8, 30.3, 28.2 |
| `/dashboard/wallets` | `200:3` | 44.0 | 32.1 | 28.0, 24.3, 44.0 |
| `/dashboard/markets/catalog` | `200:3` | 1629.6 | 563.0 | 1629.6, 32.4, 27.1 |
| `/dashboard/strategies` | `200:3` | 33.7 | 28.6 | 33.7, 27.0, 25.1 |
| `/dashboard/backtests/runs` | `200:3` | 35.1 | 31.0 | 30.3, 27.6, 35.1 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 56.8 | 51.9 | 55.7, 43.1, 56.8 |
| `/dashboard/logs` | `200:3` | 37.7 | 32.4 | 37.7, 26.1, 33.3 |
| `/dashboard/profile/subscription` | `200:3` | 49.8 | 44.1 | 49.8, 45.8, 36.6 |
| `/admin/users` | `200:3` | 88.6 | 50.8 | 33.9, 30.0, 88.6 |
| `/admin/subscriptions/plans` | `200:3` | 150.3 | 73.8 | 33.0, 150.3, 38.2 |

Focused follow-up for `/dashboard/markets/catalog`:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200:8` | 92.1 | 60.9 | 52.6, 51.0, 50.0, 59.9, 48.5, 51.4, 92.1, 81.9 |

Interpretation: no 60-second-class dashboard stall or persistent API bottleneck was reproduced. The market catalog again showed one cold low-second sample and then normalized.

## Runtime Freshness

Command:

```powershell
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and `DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `13022 ms`, threshold `60000 ms`
- market data freshness: PASS, age `13022 ms`, threshold `120000 ms`
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
| `GET /api/v1/version` | pass `200` | 182 ms |
| `GET /api/v1/teams/current` | pass `200` | 92 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 62 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 50 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 245 ms |
| `GET /api/v1/resources` | pass `200` | 304 ms |
| `GET /api/v1/deployments` | pass `200` | 55 ms |

Production environment projection:

- applications: `6`
- application rows: `soar-web`, `workers-backtest`, `workers-market-stream`, `workers-execution`, `workers-market-data`, `soar-api`
- application statuses: `running:unknown` for all six rows
- restart counts: `soar-web=1`, `workers-backtest=0`, `workers-market-stream=0`, `workers-execution=2`, `workers-market-data=0`, `soar-api=2`
- databases: PostgreSQL and Redis, both `running:healthy:true`
- database restart counts: `postgresql=52`, `redis=682`
- global resources: `17`
- visible deployment rows: `0`

Host-level VPS pressure, proxy/container-engine pressure, and sanitized log-window capture were not attempted because this runner exposes `VPS_HOST` but no approved `SSH*` or dedicated read-only `VPS_*` status credential family.

## Source-Control Closure

Repository state at closure check:

- branch: `main...origin/main [ahead 14, behind 1]`
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

[LUC-5695](/LUC/issues/LUC-5695) can close as a read-only production performance and server-health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- fresh-login protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection showed zero visible deployment rows and PostgreSQL/Redis `running:healthy:true`
- no duplicate incident/repair issue is required from this evidence window

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready` with `401`
- one `/dashboard/markets/catalog` cold sample reached `1629.6 ms`, then normalized to max `92.1 ms`
- Coolify application rows continue reporting `running:unknown`
- host-level VPS pressure/log-window evidence still requires approved read-only host-status credentials
- Web build-info provenance remains a separate release/source-control gate
