# LUC-5986 Production Performance And Server Health Watch

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH**
- Issue: [LUC-5986](/LUC/issues/LUC-5986)
- Evidence window: 2026-06-28T14:21Z to 2026-06-28T14:23Z
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
- `checkedAt`: `2026-06-28T14:22:20.909Z`

This remains diagnostic runtime provenance only; release-grade build provenance is a separate release/source-control gate.

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 313.6 | 63.5 | 313.6, 78.5, 24.9, 16.1, 17.4, 19.7, 20.6, 17.3 |
| API `/ready` | `200:8` | 34.3 | 22.9 | 19.8, 24.3, 16.7, 21.6, 18.5, 27.2, 34.3, 21.0 |
| Web `/` | `200:8` | 318.2 | 102.6 | 306.5, 318.2, 28.6, 27.9, 58.5, 26.7, 29.1, 24.9 |
| Web `/api/build-info` | `200:8` | 24.9 | 22.3 | 22.0, 24.0, 21.0, 21.1, 21.7, 24.2, 19.1, 24.9 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Fresh login session source: cookie login. Payload bodies were not stored.

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 78.3 | 43.2 | 78.3, 25.8, 25.4 |
| `/dashboard/bots` | `200:3` | 48.1 | 36.1 | 48.1, 27.8, 32.4 |
| `/dashboard/wallets` | `200:3` | 32.8 | 29.9 | 30.5, 32.8, 26.3 |
| `/dashboard/markets/catalog` | `200:3` | 1659.9 | 574.0 | 1659.9, 28.8, 33.4 |
| `/dashboard/strategies` | `200:3` | 28.2 | 26.0 | 28.2, 25.3, 24.5 |
| `/dashboard/backtests/runs` | `200:3` | 30.8 | 28.9 | 30.8, 26.2, 29.8 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 74.2 | 64.7 | 63.5, 56.3, 74.2 |
| `/dashboard/logs` | `200:3` | 42.2 | 35.1 | 42.2, 31.5, 31.6 |
| `/dashboard/profile/subscription` | `200:3` | 44.3 | 36.3 | 44.3, 32.9, 31.8 |
| `/admin/users` | `200:3` | 43.0 | 32.0 | 43.0, 26.3, 26.6 |
| `/admin/subscriptions/plans` | `200:3` | 34.1 | 31.3 | 27.7, 34.1, 32.0 |

Focused follow-up for `/dashboard/markets/catalog`:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200:8` | 284.8 | 93.3 | 29.3, 32.1, 33.5, 242.8, 39.4, 32.4, 284.8, 52.2 |

Interpretation: no 60-second-class dashboard stall or persistent API bottleneck was reproduced. The market catalog again showed one cold low-second sample and then normalized.

## Runtime Freshness

Command:

```powershell
pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and `DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `22813 ms`, threshold `60000 ms`
- market data freshness: PASS, age `22813 ms`, threshold `120000 ms`
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

- checked at `2026-06-28T14:21:39.333Z`
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
| `GET /api/v1/version` | pass `200` | 359 ms |
| `GET /api/v1/teams/current` | pass `200` | 104 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 57 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 50 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 172 ms |
| `GET /api/v1/resources` | pass `200` | 698 ms |
| `GET /api/v1/deployments` | pass `200` | 78 ms |

Production/resource projection:

- production applications: `6`
- application rows: `soar-web`, `workers-backtest`, `workers-market-stream`, `workers-execution`, `soar-api`, `workers-market-data`
- application statuses: `running:unknown` for all six rows
- restart counts from production projection: `soar-web=12`, `workers-backtest=0`, `workers-market-stream=0`, `workers-execution=2`, `soar-api=2`, `workers-market-data=0`
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

[LUC-5986](/LUC/issues/LUC-5986) can close as a read-only production performance and server-health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- fresh-login protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection is reachable and PostgreSQL/Redis report `running:healthy`
- no duplicate incident/repair issue is required from this evidence window

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready` with `401`
- one `/dashboard/markets/catalog` cold sample reached `1659.9 ms`, then normalized to focused max `284.8 ms`
- Coolify application rows continue reporting `running:unknown`
- Coolify shows four queued deployment rows for commit `3bd65e21d09f...`
- host-level VPS pressure/log-window evidence still requires approved read-only host-status credentials
- Web build-info provenance remains a separate release/source-control gate
