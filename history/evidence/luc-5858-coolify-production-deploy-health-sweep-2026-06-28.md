# LUC-5858 Coolify Production Deploy Health Sweep

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / COOLIFY_QUEUE_WATCH**
- Issue: [LUC-5858](/LUC/issues/LUC-5858)
- Evidence window: 2026-06-28T08:35Z to 2026-06-28T08:38Z
- Owner: 09 DRE (Deployment & Reliability Engineer)

## Scope

Read-only Coolify production deploy health sweep for Soar.

Excluded: deploy, push, restart, rollback execution, environment edit, secret/account readback, database/Redis mutation, raw log capture, production account mutation, subscription/payment mutation, exchange action, order, position, or live-trading action.

## Smoke

Current-binding command:

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

Interpretation: the known stale runner token still fails protected readiness, but protected worker readiness is healthy through the approved fresh-login path.

## Build Info

Web `/api/build-info` returned:

- `gitSha`: `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- `gitRef`: `main`
- `metadataGeneratedAt`: `2026-06-28T06:23:59.137Z`
- `metadataSource`: `env-runtime`
- checked at: `2026-06-28T08:37:57.750Z`

This remains diagnostic runtime provenance only; release-grade build provenance is a separate release/source-control gate.

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 147.9 | 45.4 | 147.9, 73.7, 28.6, 31.9, 19.6, 26.2, 17.4, 17.5 |
| API `/ready` | `200:8` | 33.1 | 26.8 | 28.2, 20.5, 22.1, 33.1, 31.5, 18.1, 29.0, 31.5 |
| Web `/` | `200:8` | 111.2 | 40.0 | 111.2, 24.3, 31.9, 34.8, 30.7, 29.6, 32.6, 24.5 |
| Web `/api/build-info` | `200:8` | 30.7 | 26.6 | 27.1, 25.8, 30.7, 24.8, 27.0, 26.2, 25.8, 25.4 |

## Authenticated Dashboard API Timing

Fresh login session source: cookie/bearer login. Payload bodies were not stored. Three samples per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 25.9 | 25.3 | 25.9, 25.9, 24.0 |
| `/dashboard/bots` | `200:3` | 238.9 | 107.6 | 45.7, 238.9, 38.3 |
| `/dashboard/wallets` | `200:3` | 29.9 | 29.0 | 29.9, 28.9, 28.3 |
| `/dashboard/markets/catalog` | `200:3` | 1590.7 | 551.6 | 1590.7, 33.2, 31.0 |
| `/dashboard/strategies` | `200:3` | 28.1 | 27.1 | 25.7, 28.1, 27.5 |
| `/dashboard/backtests/runs` | `200:3` | 34.5 | 30.7 | 34.5, 28.6, 29.1 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 61.5 | 51.6 | 61.5, 51.2, 42.2 |
| `/dashboard/logs` | `200:3` | 227.0 | 98.8 | 36.3, 227.0, 33.0 |
| `/dashboard/profile/subscription` | `200:3` | 36.9 | 36.3 | 36.9, 36.5, 35.4 |
| `/admin/users` | `200:3` | 28.0 | 27.3 | 27.0, 26.9, 28.0 |
| `/admin/subscriptions/plans` | `200:3` | 30.3 | 27.9 | 30.3, 27.7, 25.8 |

Focused follow-up for `/dashboard/markets/catalog`:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200:8` | 37.5 | 28.9 | 23.0, 37.5, 30.5, 29.0, 27.7, 30.3, 24.6, 28.5 |

Interpretation: no 60-second-class dashboard stall or persistent API bottleneck was reproduced. The market catalog again showed one cold low-second sample and then normalized.

## Runtime Freshness

Command:

```powershell
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and `DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `1459 ms`, threshold `60000 ms`
- market data freshness: PASS, age `1459 ms`, threshold `120000 ms`
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

- checked at `2026-06-28T08:37:01.040Z`
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
| `GET /api/v1/version` | pass `200` | 164 ms |
| `GET /api/v1/teams/current` | pass `200` | 314 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 53 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 64 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 164 ms |
| `GET /api/v1/resources` | pass `200` | 251 ms |
| `GET /api/v1/deployments` | pass `200` | 56 ms |

Production/resource projection:

- production applications: `6`
- application rows: `workers-backtest`, `soar-web`, `workers-market-stream`, `workers-execution`, `soar-api`, `workers-market-data`
- application statuses: `running:unknown`, `serverStatus=true` for all six rows
- restart counts from production projection: `workers-backtest=0`, `soar-web=12`, `workers-market-stream=0`, `workers-execution=2`, `soar-api=2`, `workers-market-data=0`
- production PostgreSQL: `running:healthy`, `serverStatus=true`, restart count `52`
- production Redis: `running:healthy`, `serverStatus=true`, restart count `682`
- global resources: `17`
- visible deployment rows: `4`, all `queued`, for `workers-market-stream`, `workers-execution`, `workers-market-data`, and `soar-api` at commit `3bd65e21d09f...`, created `2026-06-28T06:23:11Z` to `2026-06-28T06:23:12Z`

Interpretation: the board-observed failed/unfinished deploy condition is represented as persistent queued deployment rows. This heartbeat did not mutate the queue. Because public health, fresh-login protected readiness, runtime freshness, rollback guard, database/cache status, and Web build-info are healthy, this is a queue-watch residual rather than a confirmed production outage in this evidence window.

Host-level VPS pressure, proxy/container-engine pressure, and sanitized log-window capture were not attempted because this runner exposes `VPS_HOST` by name but no approved `SSH_HOST` or dedicated read-only host-status credential family.

## Source-Control Closure

Repository state at closure check:

- dirty worktree: pre-existing mixed same-day state/evidence/package/code changes from multiple lanes
- commit: not created
- push: not needed and not authorized
- deploy impact: none

This issue produced evidence/state only and did not change runtime code, package behavior, deployment config, or production state.

## Cleanup

This heartbeat did not start dev servers, Docker containers, Playwright, or headless browsers. No task-owned validation processes needed teardown.

## Disposition

[LUC-5858](/LUC/issues/LUC-5858) can close as a read-only Coolify production deploy health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- fresh-login protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection is reachable
- PostgreSQL and Redis report `running:healthy`
- the deploy queue residual is visible and recorded without performing a redeploy/restart/queue mutation

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready` with `401`
- one `/dashboard/markets/catalog` cold sample reached `1590.7 ms`, then normalized to max `37.5 ms`
- Coolify application rows continue reporting `running:unknown`
- Coolify shows four queued deployment rows for commit `3bd65e21d09f...`
- host-level VPS pressure/log-window evidence still requires approved read-only host-status credentials
- Web build-info provenance remains a separate release/source-control gate
