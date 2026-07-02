# LUC-6028 Production Performance And Server Health Watch

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH**
- Issue: [LUC-6028](/LUC/issues/LUC-6028)
- Evidence window: 2026-06-28T21:03Z to 2026-06-28T21:07Z
- Owner: 09 DRE (Deployment & Reliability Engineer)

## Scope

Read-only recurring production performance and server-health watch for Soar.

Excluded: deploy, push, restart, rollback execution, environment edit,
secret/account readback, database/Redis mutation, raw log capture, production
account mutation, subscription/payment mutation, exchange action, order,
position, or live-trading action.

## Smoke

Stale-token smoke:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- FAIL API `/workers/ready` -> `401`

Fresh-login smoke, with `SMOKE_AUTH_TOKEN` suppressed only for the child
process:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- PASS API `/workers/ready` -> `200`

Interpretation: public production endpoints and protected worker readiness are
healthy through the approved fresh-login path. The pre-bound smoke token remains
stale or insufficient and is not evidence of an active worker outage.

## Build Info

Web `/api/build-info` returned:

- `gitSha`: `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- `gitRef`: `main`
- `metadataGeneratedAt`: `2026-06-28T06:23:59.137Z`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-06-28T21:04:25.446Z`

This remains diagnostic runtime provenance only; release-grade build provenance
is a separate release/source-control gate.

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 350.2 | 68.2 | 350.2, 27.5, 30.4, 28.6, 27.6, 30.9, 26.7, 24.1 |
| API `/ready` | `200:8` | 57.4 | 37.6 | 34.8, 57.4, 32.2, 31.1, 37.5, 28.9, 34.1, 44.8 |
| Web `/` | `200:8` | 251.9 | 102.8 | 147.4, 67.9, 69.0, 75.6, 67.4, 62.3, 251.9, 81.3 |
| Web `/api/build-info` | `200:8` | 37.6 | 30.8 | 31.8, 29.6, 29.3, 34.9, 37.6, 27.4, 26.7, 29.0 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Fresh login session source: cookie login. Payload bodies were not stored.

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 65.7 | 45.2 | 65.7, 33.4, 36.4 |
| `/dashboard/bots` | `200:3` | 49.5 | 47.1 | 47.5, 49.5, 44.3 |
| `/dashboard/wallets` | `200:3` | 40.1 | 38.5 | 38.1, 40.1, 37.4 |
| `/dashboard/markets/catalog` | `200:3` | 1691.9 | 622.5 | 1691.9, 90.6, 85.0 |
| `/dashboard/strategies` | `200:3` | 38.4 | 34.3 | 30.4, 34.1, 38.4 |
| `/dashboard/backtests/runs` | `200:3` | 51.4 | 48.7 | 51.4, 49.1, 45.7 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 92.2 | 66.9 | 92.2, 51.9, 56.5 |
| `/dashboard/logs` | `200:3` | 112.9 | 99.2 | 112.9, 84.1, 100.7 |
| `/dashboard/profile/subscription` | `200:3` | 245.0 | 110.8 | 245.0, 49.4, 38.1 |
| `/admin/users` | `200:3` | 46.8 | 39.9 | 41.9, 46.8, 30.9 |
| `/admin/subscriptions/plans` | `200:3` | 72.8 | 55.7 | 42.6, 51.6, 72.8 |

Focused follow-up for `/dashboard/markets/catalog`:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200:8` | 255.7 | 118.6 | 121.3, 91.9, 91.4, 121.9, 91.1, 92.9, 255.7, 83.0 |

Interpretation: no 60-second-class dashboard stall or persistent API bottleneck
was reproduced. The market catalog again showed one cold low-second sample and
then normalized.

## Runtime Freshness

Command:

```powershell
pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `DEPLOY_FRESHNESS_AUTH_EMAIL` and
`DEPLOY_FRESHNESS_AUTH_PASSWORD` mapped from the approved smoke credential
family only in the child process.

Result: PASS.

- worker heartbeat freshness: PASS, age `4758 ms`, threshold `60000 ms`
- market data freshness: PASS, age `4758 ms`, threshold `120000 ms`
- runtime signal lag: PASS, age `0 ms`, threshold `90000 ms`
- runtime sessions: PASS, running count `5`, stale session ids `[]`
- runtime decision activity: SKIP, not required for running sessions

## Rollback Guard

Command:

```powershell
pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Run with `ROLLBACK_GUARD_AUTH_EMAIL` and
`ROLLBACK_GUARD_AUTH_PASSWORD` mapped from the approved smoke credential family
only in the child process.

Result:

- checked at `2026-06-28T21:03:52.053Z`
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
- No token values, cookies, credentials, database values, raw deployment
  objects, raw logs, or secret values were stored in this evidence packet.

Authenticated Coolify `GET` projection:

| Check | Result | Timing |
| --- | --- | ---: |
| `GET /api/v1/version` | pass `200` | 374 ms |
| `GET /api/v1/teams/current` | pass `200` | 61 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 64 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 60 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 177 ms |
| `GET /api/v1/resources` | pass `200` | 490 ms |
| `GET /api/v1/deployments` | pass `200` | 71 ms |

Production/resource projection:

- production applications: `6`
- application rows: `soar-api`, `soar-web`, `workers-backtest`,
  `workers-execution`, `workers-market-data`, `workers-market-stream`
- application statuses: `running:unknown` for all six rows
- matching database/cache resources: PostgreSQL and Redis report
  `running:healthy`
- visible deployment rows: `4` queued rows

Interpretation: Coolify API is reachable and database/cache resources are
healthy. The queued deployment rows need continued watch, but production health
checks are green, so this evidence window does not justify a duplicate incident
by itself.

Host-level VPS pressure, proxy/container-engine pressure, and sanitized
log-window capture were not attempted because this runner exposes `VPS_HOST` by
name but no approved `SSH_HOST` or dedicated read-only host-status credential
family.

## Source-Control Closure

Repository state at closure check:

- branch: `main...origin/main [ahead 15, behind 2]`
- dirty worktree: pre-existing mixed same-day state/evidence/package/code
  changes from multiple lanes
- commit: not created
- push: not needed and not authorized
- deploy impact: none

This issue produced evidence/state only and did not change runtime code,
package behavior, deployment config, or production state.

## Validation

- `pnpm exec node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`: public PASS, protected `/workers/ready` failed through stale token with `401`.
- Same deploy smoke with `SMOKE_AUTH_TOKEN` suppressed: all checks passed,
  including protected `/workers/ready`.
- Public timing: API `/health`, API `/ready`, Web `/`, and Web
  `/api/build-info` all returned `200:8`.
- Authenticated dashboard/admin API timing: all representative reads returned
  `200:3`; market catalog cold sample normalized on follow-up `200:8`.
- `pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch`: PASS.
- `pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch`: PASS, `shouldRollback=false`.
- Read-only Coolify `GET` projection: PASS; six app rows `running:unknown`,
  PostgreSQL/Redis `running:healthy`, four visible queued deployment rows.

## Cleanup

This heartbeat did not start dev servers, Docker containers, Playwright, or
headless browsers. No task-owned validation processes needed teardown.

## Disposition

[LUC-6028](/LUC/issues/LUC-6028) can close as a read-only production
performance and server-health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- fresh-login protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection is reachable and PostgreSQL/Redis report
  `running:healthy`
- no duplicate incident/repair issue is required from this evidence window

Residuals:

- stale `SMOKE_AUTH_TOKEN` path still fails protected `/workers/ready` with
  `401`
- one `/dashboard/markets/catalog` cold sample reached `1691.9 ms`, then
  normalized to focused max `255.7 ms`
- Coolify application rows continue reporting `running:unknown`
- Coolify shows four queued deployment rows
- host-level VPS pressure/log-window evidence still requires approved
  read-only host-status credentials
- Web build-info provenance remains a separate release/source-control gate
