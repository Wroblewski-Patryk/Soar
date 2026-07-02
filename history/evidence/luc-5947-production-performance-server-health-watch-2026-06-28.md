# LUC-5947 Production Performance And Server Health Watch

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH**
- Issue: [LUC-5947](/LUC/issues/LUC-5947)
- Evidence window: 2026-06-28T12:21Z to 2026-06-28T12:24Z
- Owner: 09 DRE (Deployment & Reliability Engineer)

## Scope

Read-only recurring production performance and server-health watch for Soar.

Excluded: deploy, push, restart, rollback execution, environment edit, secret/account readback, database/Redis mutation, raw log capture, production account mutation, subscription/payment mutation, exchange action, order, position, or live-trading action.

## Smoke

Stale-token smoke:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- FAIL API `/workers/ready` -> `401`

Fresh-login smoke, with `SMOKE_AUTH_TOKEN` suppressed only for the child process:

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
- `checkedAt`: `2026-06-28T12:23:52.236Z`

This remains diagnostic runtime provenance only; release-grade build provenance is a separate release/source-control gate.

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 208.0 | 65.6 | 155.2, 64.5, 16.7, 208.0, 22.1, 21.4, 18.4, 18.5 |
| API `/ready` | `200:8` | 26.4 | 22.1 | 26.4, 23.8, 22.8, 20.7, 19.2, 22.2, 22.3, 19.5 |
| Web `/` | `200:8` | 132.4 | 49.5 | 92.5, 24.7, 33.5, 25.5, 132.4, 29.9, 29.2, 28.1 |
| Web `/api/build-info` | `200:8` | 33.3 | 27.7 | 33.3, 25.6, 29.2, 26.7, 24.8, 31.4, 26.9, 23.5 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Fresh login session source: cookie/bearer login. Payload bodies were not stored.

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 27.1 | 26.7 | 26.5, 26.5, 27.1 |
| `/dashboard/bots` | `200:3` | 48.6 | 39.0 | 48.6, 35.3, 33.0 |
| `/dashboard/wallets` | `200:3` | 30.3 | 28.3 | 28.5, 30.3, 26.0 |
| `/dashboard/markets/catalog` | `200:3` | 1251.7 | 436.7 | 1251.7, 29.9, 28.5 |
| `/dashboard/strategies` | `200:3` | 203.1 | 113.4 | 111.2, 203.1, 25.8 |
| `/dashboard/backtests/runs` | `200:3` | 35.1 | 30.3 | 35.1, 26.6, 29.2 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 55.6 | 49.5 | 55.6, 48.7, 44.3 |
| `/dashboard/logs` | `200:3` | 39.8 | 37.2 | 39.8, 34.7, 37.1 |
| `/dashboard/profile/subscription` | `200:3` | 58.2 | 45.5 | 58.2, 43.2, 35.2 |
| `/admin/users` | `200:3` | 32.9 | 29.6 | 29.5, 26.5, 32.9 |
| `/admin/subscriptions/plans` | `200:3` | 39.6 | 34.4 | 39.6, 27.7, 35.9 |

Focused follow-up for `/dashboard/markets/catalog`:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200:8` | 137.5 | 44.9 | 26.4, 34.7, 36.6, 34.2, 137.5, 31.5, 29.3, 28.7 |

Interpretation: no 60-second-class dashboard stall or persistent API bottleneck was reproduced. The market catalog again showed one cold low-second sample and then normalized.

## Runtime Freshness

Command:

```powershell
pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and `DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `3164 ms`, threshold `60000 ms`
- market data freshness: PASS, age `3164 ms`, threshold `120000 ms`
- runtime signal lag: PASS, age `0 ms`, threshold `90000 ms`
- runtime sessions: PASS, running count `5`, stale session ids `[]`
- runtime decision activity: SKIP, not required for running sessions

## Rollback Guard

Command:

```powershell
pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `ROLLBACK_GUARD_AUTH_EMAIL` and `ROLLBACK_GUARD_AUTH_PASSWORD` mapped from the approved smoke credential family only in the child process.

Result:

- checked at `2026-06-28T12:22:04.392Z`
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
| `GET /api/v1/teams/current` | pass `200` | 100 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 53 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 49 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 146 ms |
| `GET /api/v1/resources` | pass `200` | 366 ms |
| `GET /api/v1/deployments` | pass `200` | 63 ms |

Production/resource projection:

- production applications: `6`
- application rows: `workers-backtest`, `soar-web`, `workers-market-stream`, `workers-execution`, `soar-api`, `workers-market-data`
- application statuses: `running:unknown` for all six rows
- restart counts from production projection: `soar-web=12`, `workers-backtest=0`, `workers-market-stream=0`, `workers-execution=2`, `soar-api=2`, `workers-market-data=0`
- global resources: `17`
- matching database/cache resources: PostgreSQL rows and Redis row report `running:healthy`
- visible deployment rows: `4`, all `queued`, for `workers-market-stream`, `workers-execution`, `workers-market-data`, and `soar-api` at commit `3bd65e21d09f...`

Interpretation: Coolify API is reachable and database/cache resources are healthy. The queued deployment rows need continued watch, but the deployed Web build-info already reports the same commit and production health checks are green, so this evidence window does not justify a duplicate incident by itself.

Host-level VPS pressure, proxy/container-engine pressure, and sanitized log-window capture were not attempted because this runner exposes `VPS_HOST` by name but no approved `SSH_HOST` or dedicated read-only host-status credential family.

## Source-Control Closure

Repository state at closure check:

- branch: `main...origin/main [ahead 15, behind 2]`
- dirty worktree: pre-existing mixed same-day state/evidence/package/code changes from multiple lanes
- commit: not created
- push: not needed and not authorized
- deploy impact: none

This issue produced evidence/state only and did not change runtime code, package behavior, deployment config, or production state.

## Validation

- `pnpm exec node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`: public PASS, protected `/workers/ready` failed through stale token with `401`.
- Same deploy smoke with `SMOKE_AUTH_TOKEN` suppressed: all checks passed, including protected `/workers/ready`.
- Public timing: API `/health`, API `/ready`, Web `/`, and Web `/api/build-info` all returned `200:8`.
- Authenticated dashboard/admin API timing: all representative reads returned `200:3`; market catalog cold sample normalized on follow-up `200:8`.
- `pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch`: PASS.
- `pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch`: PASS, `shouldRollback=false`.
- Read-only Coolify `GET` projection: PASS; six app rows `running:unknown`, PostgreSQL/Redis `running:healthy`, four visible queued deployment rows for current build-info commit.

## Cleanup

This heartbeat did not start dev servers, Docker containers, Playwright, or headless browsers. No task-owned validation processes needed teardown.

## Disposition

[LUC-5947](/LUC/issues/LUC-5947) can close as a read-only production performance and server-health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- fresh-login protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection is reachable and PostgreSQL/Redis report `running:healthy`
- no duplicate incident/repair issue is required from this evidence window

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready` with `401`
- one `/dashboard/markets/catalog` cold sample reached `1251.7 ms`, then normalized to focused max `137.5 ms`
- Coolify application rows continue reporting `running:unknown`
- Coolify shows four queued deployment rows for commit `3bd65e21d09f...`
- host-level VPS pressure/log-window evidence still requires approved read-only host-status credentials
- Web build-info provenance remains a separate release/source-control gate
