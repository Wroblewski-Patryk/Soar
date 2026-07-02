# LUC-5880 Production Performance And Server Health Watch

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH**
- Issue: [LUC-5880](/LUC/issues/LUC-5880)
- Evidence window: 2026-06-28T08:20Z to 2026-06-28T08:23Z
- Owner: 09 DRE (Deployment & Reliability Engineer)

## Scope

Read-only recurring production performance and server-health watch for Soar.

Excluded: deploy, push, restart, rollback execution, environment edit, secret/account readback, database/Redis mutation, raw log capture, production account mutation, subscription/payment mutation, exchange action, order, position, or live-trading action.

## Smoke

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

- `gitSha`: `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- `gitRef`: `main`
- `metadataGeneratedAt`: `2026-06-28T06:23:59.137Z`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-06-28T08:22:08.064Z`

This remains diagnostic runtime provenance only; release-grade build provenance is a separate release/source-control gate.

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 131.9 | 38.9 | 131.9, 71.0, 22.3, 16.8, 17.1, 18.3, 16.8, 16.8 |
| API `/ready` | `200:8` | 23.3 | 21.1 | 23.3, 21.1, 20.9, 21.1, 19.9, 20.8, 20.0, 21.4 |
| Web `/` | `200:8` | 91.5 | 33.2 | 91.5, 21.6, 24.0, 30.4, 26.2, 24.9, 23.4, 23.3 |
| Web `/api/build-info` | `200:8` | 27.8 | 25.4 | 24.8, 26.0, 26.2, 24.1, 23.3, 24.3, 27.1, 27.8 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Fresh login session source: cookie/bearer login. Payload bodies were not stored. Three samples per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 72.1 | 39.3 | 72.1, 23.6, 22.1 |
| `/dashboard/bots` | `200:3` | 39.6 | 31.2 | 39.6, 27.3, 26.8 |
| `/dashboard/wallets` | `200:3` | 26.4 | 25.4 | 25.0, 24.9, 26.4 |
| `/dashboard/markets/catalog` | `200:3` | 1395.1 | 485.2 | 1395.1, 33.5, 27.0 |
| `/dashboard/strategies` | `200:3` | 26.9 | 25.6 | 26.9, 26.4, 23.4 |
| `/dashboard/backtests/runs` | `200:3` | 31.8 | 28.0 | 31.8, 26.5, 25.7 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 51.0 | 47.6 | 51.0, 46.6, 45.3 |
| `/dashboard/logs` | `200:3` | 37.0 | 33.2 | 37.0, 29.0, 33.6 |
| `/dashboard/profile/subscription` | `200:3` | 40.3 | 35.1 | 40.3, 32.7, 32.2 |
| `/admin/users` | `200:3` | 29.3 | 26.7 | 29.3, 25.8, 24.9 |
| `/admin/subscriptions/plans` | `200:3` | 28.1 | 25.3 | 27.3, 20.5, 28.1 |

Focused follow-up for `/dashboard/markets/catalog`:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200:8` | 32.6 | 28.4 | 25.6, 31.2, 28.5, 24.8, 30.5, 26.1, 28.0, 32.6 |

Interpretation: no 60-second-class dashboard stall or persistent API bottleneck was reproduced. The market catalog again showed one cold low-second sample and then normalized.

## Runtime Freshness

Command:

```powershell
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and `DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `1091 ms`, threshold `60000 ms`
- market data freshness: PASS, age `1091 ms`, threshold `120000 ms`
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

- checked at `2026-06-28T08:21:15.472Z`
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
| `GET /api/v1/version` | pass `200` | 161 ms |
| `GET /api/v1/teams/current` | pass `200` | 104 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 51 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 51 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 121 ms |
| `GET /api/v1/resources` | pass `200` | 175 ms |
| `GET /api/v1/deployments` | pass `200` | 52 ms |

Production/resource projection:

- production applications: `6`
- application rows: `soar-web`, `workers-backtest`, `workers-market-stream`, `workers-execution`, `workers-market-data`, `soar-api`
- application statuses: `running:unknown` for all six rows
- restart counts from production projection: `soar-web=12`, `workers-backtest=0`, `workers-market-stream=0`, `workers-execution=2`, `workers-market-data=0`, `soar-api=2`
- global resources: `17`
- matching database/cache resources: PostgreSQL rows and Redis row report `running:healthy`
- visible deployment rows: `4`, all `queued`, for `workers-market-stream`, `workers-execution`, `workers-market-data`, and `soar-api` at commit `3bd65e21d09f...`

Interpretation: Coolify API is reachable and database/cache resources are healthy. The queued deployment rows need continued watch, but the deployed Web build-info already reports the same commit and production health checks are green, so this evidence window does not justify a duplicate incident by itself.

Host-level VPS pressure, proxy/container-engine pressure, and sanitized log-window capture were not attempted because this runner exposes `VPS_HOST` by name but no approved `SSH_HOST` or dedicated read-only host-status credential family.

## Source-Control Closure

Repository state at closure check:

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
- Read-only Coolify `GET` projection: PASS; six app rows `running:unknown`, PostgreSQL/Redis `running:healthy`, four visible queued deployment rows for current build-info commit.

## Cleanup

This heartbeat did not start dev servers, Docker containers, Playwright, or headless browsers. No task-owned validation processes needed teardown.

## Disposition

[LUC-5880](/LUC/issues/LUC-5880) can close as a read-only production performance and server-health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- fresh-login protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection is reachable and PostgreSQL/Redis report `running:healthy`
- no duplicate incident/repair issue is required from this evidence window

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready` with `401`
- one `/dashboard/markets/catalog` cold sample reached `1395.1 ms`, then normalized to max `32.6 ms`
- Coolify application rows continue reporting `running:unknown`
- Coolify shows four queued deployment rows for commit `3bd65e21d09f...`
- host-level VPS pressure/log-window evidence still requires approved read-only host-status credentials
- Web build-info provenance remains a separate release/source-control gate
