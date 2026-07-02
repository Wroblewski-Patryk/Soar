# LUC-5835 Production Performance And Server Health Watch

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH**
- Issue: [LUC-5835](/LUC/issues/LUC-5835)
- Evidence window: 2026-06-28T07:22Z to 2026-06-28T07:24Z
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
- `checkedAt`: `2026-06-28T07:23:40.471Z`

This remains diagnostic runtime provenance only; release-grade build provenance is a separate release/source-control gate.

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 141.8 | 40.1 | 141.8, 64.4, 16.8, 18.0, 23.4, 21.9, 16.7, 17.6 |
| API `/ready` | `200:8` | 25.1 | 21.1 | 25.1, 17.6, 20.3, 21.0, 19.5, 19.4, 20.6, 24.9 |
| Web `/` | `200:8` | 74.1 | 30.9 | 74.1, 25.6, 19.8, 26.9, 26.0, 24.2, 23.7, 26.9 |
| Web `/api/build-info` | `200:8` | 36.6 | 25.5 | 27.4, 27.4, 21.5, 20.9, 23.1, 26.5, 36.6, 20.9 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Fresh login session source: cookie/bearer login. Payload bodies were not stored. Three samples per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 26.7 | 26.0 | 26.7, 25.4, 25.8 |
| `/dashboard/bots` | `200:3` | 39.9 | 32.9 | 39.9, 29.8, 28.9 |
| `/dashboard/wallets` | `200:3` | 26.5 | 26.0 | 26.5, 25.9, 25.5 |
| `/dashboard/markets/catalog` | `200:3` | 1542.4 | 597.5 | 1542.4, 224.2, 26.0 |
| `/dashboard/strategies` | `200:3` | 210.8 | 87.0 | 25.3, 210.8, 25.0 |
| `/dashboard/backtests/runs` | `200:3` | 30.3 | 27.5 | 30.3, 25.9, 26.2 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 58.5 | 54.3 | 50.6, 58.5, 53.9 |
| `/dashboard/logs` | `200:3` | 34.6 | 31.8 | 34.6, 31.1, 29.7 |
| `/dashboard/profile/subscription` | `200:3` | 40.5 | 36.3 | 40.5, 37.2, 31.2 |
| `/admin/users` | `200:3` | 41.5 | 33.1 | 28.3, 41.5, 29.4 |
| `/admin/subscriptions/plans` | `200:3` | 32.1 | 28.6 | 32.1, 25.0, 28.8 |

Focused follow-up for `/dashboard/markets/catalog`:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200:8` | 29.8 | 27.7 | 23.6, 27.9, 28.2, 29.8, 26.3, 29.1, 28.0, 28.4 |

Interpretation: no 60-second-class dashboard stall or persistent API bottleneck was reproduced. The market catalog again showed one cold low-second sample and then normalized.

## Runtime Freshness

Command:

```powershell
node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and `DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `14922 ms`, threshold `60000 ms`
- market data freshness: PASS, age `14922 ms`, threshold `120000 ms`
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

- checked at `2026-06-28T07:22:29.443Z`
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
| `GET /api/v1/version` | pass `200` | 166 ms |
| `GET /api/v1/teams/current` | pass `200` | 96 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 53 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 50 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 98 ms |
| `GET /api/v1/resources` | pass `200` | 176 ms |
| `GET /api/v1/deployments` | pass `200` | 245 ms |

Production/resource projection:

- production applications: `6`
- application rows: `workers-backtest`, `soar-web`, `workers-market-stream`, `workers-execution`, `soar-api`, `workers-market-data`
- application statuses: `running:unknown` for all six rows
- restart counts from production projection: `workers-backtest=0`, `soar-web=12`, `workers-market-stream=0`, `workers-execution=2`, `soar-api=2`, `workers-market-data=0`
- global resources: `17`
- matching database/cache resources: PostgreSQL rows and Redis row report `running:healthy`
- visible deployment rows: `4`, all `queued`, for `workers-market-stream`, `workers-execution`, `workers-market-data`, and `soar-api` at commit `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`

Interpretation: Coolify API is reachable and database/cache resources are healthy. The queued deployment rows need continued watch, but the deployed Web build-info already reports the same commit and production health checks are green, so this evidence window does not justify a duplicate incident by itself.

Host-level VPS pressure, proxy/container-engine pressure, and sanitized log-window capture were not attempted because this runner exposes only `VPS_HOST` by name and no approved `SSH*` or dedicated read-only `VPS_*` status credential family.

## Source-Control Closure

Repository state at closure check:

- branch: `main`
- local `HEAD`: `8d800ca4b7de684e70247e4de1f9129981085378`
- `origin/main`: `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- dirty worktree: pre-existing mixed same-day state/evidence/package/code changes from multiple lanes
- branch divergence: `ahead 15, behind 2`
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

[LUC-5835](/LUC/issues/LUC-5835) can close as a read-only production performance and server-health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- fresh-login protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection is reachable and PostgreSQL/Redis report `running:healthy`
- no duplicate incident/repair issue is required from this evidence window

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready` with `401`
- one `/dashboard/markets/catalog` cold sample reached `1542.4 ms`, then normalized to max `29.8 ms`
- Coolify application rows continue reporting `running:unknown`
- Coolify shows four queued deployment rows for commit `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- host-level VPS pressure/log-window evidence still requires approved read-only host-status credentials
- Web build-info provenance remains a separate release/source-control gate
