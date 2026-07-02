# LUC-5798 Production Performance And Server Health Watch

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH**
- Issue: [LUC-5798](/LUC/issues/LUC-5798)
- Evidence window: 2026-06-28T04:23Z to 2026-06-28T04:25Z
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
- `checkedAt`: `2026-06-28T04:23:51.176Z`

This remains diagnostic runtime provenance only; release-grade build provenance is a separate release/source-control gate.

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 125.2 | 37.5 | 125.2, 69.8, 21.3, 16.4, 14.8, 20.0, 15.0, 17.3 |
| API `/ready` | `200:8` | 22.1 | 19.5 | 20.7, 19.2, 22.1, 21.1, 18.3, 15.1, 19.3, 20.3 |
| Web `/` | `200:8` | 77.0 | 31.9 | 77.0, 20.2, 25.3, 29.1, 27.0, 25.7, 26.1, 25.1 |
| Web `/api/build-info` | `200:8` | 32.5 | 25.7 | 26.1, 23.2, 24.4, 25.1, 26.2, 25.3, 22.9, 32.5 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Fresh login session source: cookie/bearer login. Payload bodies were not stored. Three samples per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 73.8 | 40.4 | 73.8, 24.2, 23.2 |
| `/dashboard/bots` | `200:3` | 43.8 | 36.6 | 43.8, 34.0, 32.0 |
| `/dashboard/wallets` | `200:3` | 34.5 | 30.5 | 34.5, 31.4, 25.7 |
| `/dashboard/markets/catalog` | `200:3` | 1543.1 | 534.2 | 1543.1, 33.3, 26.2 |
| `/dashboard/strategies` | `200:3` | 27.0 | 24.8 | 21.9, 25.4, 27.0 |
| `/dashboard/backtests/runs` | `200:3` | 28.9 | 27.6 | 28.9, 28.0, 26.0 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 201.7 | 97.8 | 49.5, 201.7, 42.1 |
| `/dashboard/logs` | `200:3` | 35.0 | 31.1 | 35.0, 29.1, 29.1 |
| `/dashboard/profile/subscription` | `200:3` | 49.4 | 40.0 | 36.5, 34.2, 49.4 |
| `/admin/users` | `200:3` | 40.8 | 33.9 | 32.3, 40.8, 28.6 |
| `/admin/subscriptions/plans` | `200:3` | 29.8 | 27.0 | 29.8, 27.2, 24.0 |

Focused follow-up for `/dashboard/markets/catalog`:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200:8` | 29.5 | 26.5 | 22.2, 25.0, 29.5, 28.3, 24.3, 28.3, 26.5, 28.0 |

Interpretation: no 60-second-class dashboard stall or persistent API bottleneck was reproduced. The market catalog again showed one cold low-second sample and then normalized.

## Runtime Freshness

Command:

```powershell
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and `DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `13074 ms`, threshold `60000 ms`
- market data freshness: PASS, age `13074 ms`, threshold `120000 ms`
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

- checked at `2026-06-28T04:23:14.091Z`
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

- Present binding names were checked without storing values.
- No token values, cookies, credentials, database values, raw deployment objects, raw logs, or secret values were stored in this evidence packet.

Authenticated Coolify `GET` projection:

| Check | Result | Timing |
| --- | --- | ---: |
| `GET /api/v1/version` | pass `200` | 187 ms |
| `GET /api/v1/teams/current` | pass `200` | 95 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 52 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 54 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 101 ms |
| `GET /api/v1/resources` | pass `200` | 188 ms |
| `GET /api/v1/deployments` | pass `200` | 56 ms |

Production/resource projection:

- production applications: `6`
- application rows: `soar-web`, `workers-backtest`, `workers-market-stream`, `workers-execution`, `workers-market-data`, `soar-api`
- application statuses: `running:unknown` for all six rows
- restart counts from production projection: `soar-web=1`, `workers-backtest=0`, `workers-market-stream=0`, `workers-execution=2`, `workers-market-data=0`, `soar-api=2`
- global resources: `17`
- matching database/cache resources: PostgreSQL rows and Redis row report `running:healthy`
- visible deployment rows: `0`

Host-level VPS pressure, proxy/container-engine pressure, and sanitized log-window capture were not attempted because this runner exposes no approved `SSH*` or dedicated read-only `VPS_*` status credential family.

## Source-Control Closure

Repository state at closure check:

- branch: `main`
- local `HEAD`: `8d800ca4b7de684e70247e4de1f9129981085378`
- `origin/main`: `42177530f2a2ddc22832133b545bccab6ab404eb`
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

[LUC-5798](/LUC/issues/LUC-5798) can close as a read-only production performance and server-health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- fresh-login protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection showed zero visible deployment rows and PostgreSQL/Redis `running:healthy` in global resources
- no duplicate incident/repair issue is required from this evidence window

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready` with `401`
- one `/dashboard/markets/catalog` cold sample reached `1543.1 ms`, then normalized to max `29.5 ms`
- Coolify application rows continue reporting `running:unknown`
- host-level VPS pressure/log-window evidence still requires approved read-only host-status credentials
- Web build-info provenance remains a separate release/source-control gate
