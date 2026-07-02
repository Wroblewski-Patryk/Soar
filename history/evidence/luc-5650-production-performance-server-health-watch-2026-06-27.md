# LUC-5650 Production Performance And Server Health Watch

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH**
- Issue: [LUC-5650](/LUC/issues/LUC-5650)
- Evidence window: 2026-06-27T20:21Z to 2026-06-27T20:25Z
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
- source-control and process cleanup posture

Excluded:

- deploy, push, restart, rollback execution, environment edit, secret/account readback, database/Redis mutation, raw log capture, production account mutation, subscription/payment mutation, exchange action, order, position, or live-trading action

## Wake Context

The wake payload scoped this heartbeat to [LUC-5650](/LUC/issues/LUC-5650) with no pending comments and `fallbackFetchNeeded=false`. Heartbeat context showed the issue as `in_progress` and actionable.

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

Interpretation: production public endpoints and protected worker readiness are healthy through the approved fresh-login path. The pre-bound smoke token remains stale or insufficient and is not evidence of an active worker outage.

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 159.6 | 56.6 | 159.6, 70.3, 116.7, 21.1, 21.7, 22.4, 21.0, 19.7 |
| API `/ready` | `200:8` | 30.8 | 23.9 | 30.8, 21.1, 24.2, 24.1, 23.5, 19.8, 26.4, 21.0 |
| Web `/` | `200:8` | 191.3 | 48.7 | 191.3, 33.0, 27.4, 24.9, 26.9, 28.9, 30.6, 26.9 |
| Web `/api/build-info` | `200:8` | 28.4 | 25.9 | 25.6, 27.4, 24.5, 27.1, 25.5, 28.4, 23.2, 25.5 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Fresh login session source: cookie-based login. Payload bodies were not stored. Three samples per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 96.1 | 47.8 | 96.1, 22.8, 24.5 |
| `/dashboard/bots` | `200:3` | 57.4 | 39.2 | 57.4, 30.3, 29.8 |
| `/dashboard/wallets` | `200:3` | 36.6 | 30.2 | 34.7, 36.6, 19.3 |
| `/dashboard/markets/catalog` | `200:3` | 1667.9 | 592.9 | 1667.9, 55.2, 55.6 |
| `/dashboard/strategies` | `200:3` | 27.2 | 26.3 | 24.8, 27.0, 27.2 |
| `/dashboard/backtests/runs` | `200:3` | 31.6 | 29.8 | 31.6, 28.4, 29.4 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 50.4 | 46.3 | 50.3, 50.4, 38.2 |
| `/dashboard/logs` | `200:3` | 40.2 | 35.8 | 40.2, 29.6, 37.5 |
| `/dashboard/profile/subscription` | `200:3` | 36.6 | 34.4 | 36.6, 33.9, 32.8 |
| `/admin/users` | `200:3` | 28.4 | 26.9 | 28.2, 28.4, 24.0 |
| `/admin/subscriptions/plans` | `200:3` | 40.1 | 34.2 | 28.6, 40.1, 33.9 |

Focused follow-up for `/dashboard/markets/catalog`:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200:8` | 105.0 | 55.8 | 105.0, 58.8, 56.9, 76.1, 38.3, 33.5, 34.6, 43.0 |

Interpretation: no 60-second-class dashboard stall or persistent API bottleneck was reproduced. The market catalog showed one cold low-second sample and then normalized.

## Runtime Freshness

Command:

```powershell
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and `DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `21005 ms`, threshold `60000 ms`
- market data freshness: PASS, age `21005 ms`, threshold `120000 ms`
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

- Present binding names were checked without values: `COOLIFY_*`, `SMOKE_AUTH_*`, `PROD_UI_AUDIT_*`, and `VPS_HOST`.
- No token values, raw resource ids, internal URLs, cookies, credentials, database values, raw deployment objects, or log bodies were printed or stored.

Authenticated Coolify `GET` projection:

| Check | Result | Timing |
| --- | --- | ---: |
| `GET /api/v1/version` | pass `200` | 253 ms |
| `GET /api/v1/teams/current` | pass `200` | 114 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 79 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 76 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 121 ms |
| `GET /api/v1/resources` | pass `200` | 185 ms |
| `GET /api/v1/deployments` | pass `200` | 52 ms |

Production environment projection:

- applications: `6`
- application rows: `soar-web`, `workers-backtest`, `workers-market-stream`, `workers-execution`, `workers-market-data`, `soar-api`
- application statuses: `running:unknown` for all six rows
- restart counts: `soar-web=1`, `workers-backtest=0`, `workers-market-stream=0`, `workers-execution=2`, `workers-market-data=0`, `soar-api=2`
- databases: PostgreSQL and Redis, both `running:healthy`
- database restart counts: `postgresql=52`, `redis=682`
- global resources: `17`
- visible deployment rows: `0`

Host-level VPS pressure, proxy/container-engine pressure, and sanitized log-window capture were not attempted because this runner exposes `VPS_HOST` but no approved `SSH*` or dedicated read-only `VPS_*` status credential family.

## Source-Control Closure

Repository state at closure check:

- HEAD: `a3564a40ac434c3c298be4bb706c5152fef99a44`
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
- `node --test scripts/checkCoolifyStackEnv.test.mjs`: PASS (`11/11`).
- Read-only Coolify `GET` projection: PASS, zero visible deployment rows.

## Cleanup

This heartbeat did not start dev servers, Docker containers, Playwright, or headless browsers. Process cleanup check found no task-owned validation processes to stop.

## Disposition

[LUC-5650](/LUC/issues/LUC-5650) can close as a read-only production performance and server-health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- fresh-login protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection showed zero visible deployment rows and PostgreSQL/Redis `running:healthy`
- no duplicate incident/repair issue is required from this evidence window

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready` with `401`
- one `/dashboard/markets/catalog` cold sample reached `1667.9 ms`, then normalized to max `105.0 ms`
- Coolify application rows continue reporting `running:unknown`
- host-level VPS pressure/log-window evidence still requires approved read-only host-status credentials
- Web build-info provenance remains a separate release/source-control gate
