# LUC-6102 Production Performance And Server Health Watch

## Status

- Result: **DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH**
- Issue: [LUC-6102](/LUC/issues/LUC-6102)
- Evidence window: 2026-06-28T22:23Z to 2026-06-28T22:27Z
- Owner: 09 DRE (Deployment & Reliability Engineer)

## Scope

Read-only recurring production performance and server-health watch for Soar.

Excluded: deploy, push, restart, rollback execution, environment edit,
secret/account readback, database/Redis mutation, raw log capture, production
account mutation, subscription/payment mutation, exchange action, order,
position, or live-trading action.

## Wake Context

Wake payload had no pending comments (`0/0`) and `fallbackFetchNeeded=false`.
The issue was already checked out by the harness, so no checkout mutation was
performed. Because no new comment changed scope, this heartbeat continued the
standard DRE read-only watch path.

## Smoke

Current-binding smoke:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- PASS API `/workers/ready` -> `200`

Runner binding shape, recorded without values:

- `SMOKE_AUTH_TOKEN`: absent
- `SMOKE_AUTH_EMAIL`: present by name/length only
- `SMOKE_AUTH_PASSWORD`: present by name/length only

Interpretation: public production endpoints and protected worker readiness are
healthy through the current approved fresh-login binding. The stale
`SMOKE_AUTH_TOKEN` false negative from earlier DRE watches was not present in
this runner.

## Build Info

Web `/api/build-info` returned:

- `gitSha`: `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- `gitRef`: `main`
- `metadataGeneratedAt`: `2026-06-28T06:23:59.137Z`
- `metadataSource`: `env-runtime`
- `checkedAt`: `2026-06-28T22:24:09.976Z`

This remains diagnostic runtime provenance only; release-grade build provenance
is a separate release/source-control gate.

## Public Timing

Eight samples per target:

| Target | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| API `/health` | `200:8` | 134.9 | 38.7 | 134.9, 66.5, 20.1, 16.8, 16.3, 18.3, 20.9, 15.8 |
| API `/ready` | `200:8` | 29.9 | 21.3 | 19.8, 20.2, 18.3, 23.8, 19.4, 20.9, 17.7, 29.9 |
| Web `/` | `200:8` | 227.4 | 62.5 | 97.9, 227.4, 38.8, 31.6, 30.3, 24.4, 27.7, 22.0 |
| Web `/api/build-info` | `200:8` | 32.7 | 28.3 | 27.7, 25.0, 32.5, 26.4, 30.0, 24.0, 32.7, 27.8 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Fresh login session source: cookie login. Payload bodies were not stored.

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/auth/me` | `200:3` | 28.6 | 26.4 | 25.1, 25.4, 28.6 |
| `/dashboard/bots` | `200:3` | 48.9 | 39.1 | 48.9, 31.8, 36.6 |
| `/dashboard/wallets` | `200:3` | 35.5 | 29.2 | 35.5, 22.1, 29.9 |
| `/dashboard/markets/catalog` | `200:3` | 1719.3 | 595.5 | 1719.3, 35.5, 31.7 |
| `/dashboard/strategies` | `200:3` | 27.3 | 25.6 | 24.1, 25.3, 27.3 |
| `/dashboard/backtests/runs` | `200:3` | 34.3 | 29.5 | 34.3, 29.7, 24.4 |
| `/dashboard/reports/cross-mode-performance` | `200:3` | 56.4 | 52.7 | 56.4, 55.2, 46.6 |
| `/dashboard/logs` | `200:3` | 35.5 | 33.6 | 35.5, 33.1, 32.3 |
| `/dashboard/profile/subscription` | `200:3` | 44.1 | 40.9 | 44.1, 36.1, 42.5 |
| `/admin/users` | `200:3` | 37.0 | 34.2 | 37.0, 33.3, 32.3 |
| `/admin/subscriptions/plans` | `200:3` | 32.3 | 30.8 | 30.5, 29.7, 32.3 |

Focused follow-up for `/dashboard/markets/catalog`:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | --- | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200:8` | 44.3 | 32.8 | 29.5, 32.4, 29.0, 44.3, 33.5, 32.3, 26.9, 34.4 |

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

- worker heartbeat freshness: PASS, age `14874 ms`, threshold `60000 ms`
- market data freshness: PASS, age `14874 ms`, threshold `120000 ms`
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

- checked at `2026-06-28T22:24:01.655Z`
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
| `GET /api/v1/version` | pass `200` | 168 ms |
| `GET /api/v1/teams/current` | pass `200` | 98 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 59 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 53 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 102 ms |
| `GET /api/v1/resources` | pass `200` | 201 ms |
| `GET /api/v1/deployments` | pass `200` | 65 ms |

Production/resource projection:

- production applications: `6`
- application rows: `soar-web`, `workers-backtest`, `workers-market-stream`,
  `workers-execution`, `soar-api`, `workers-market-data`
- application statuses: `running:unknown` for all six rows
- PostgreSQL resources: `1`
- Redis resources: `1`
- visible deployment rows: `4`
- queued deployment rows: `4`
- total visible resources: `17`

Interpretation: Coolify API is reachable and the expected Soar production
resource shape is still visible. The queued deployment rows and application
`running:unknown` values need continued watch, but production smoke and runtime
health are green, so this evidence window does not justify a duplicate incident
by itself.

Host-level VPS pressure, proxy/container-engine pressure, and sanitized
log-window capture were not attempted because this runner exposes `VPS_HOST` by
name but no approved `SSH_HOST` or dedicated read-only host-status credential
family.

## Source-Control Closure

Repository state at closure check:

- branch: `main...origin/main [ahead 17, behind 2]`
- dirty worktree: pre-existing mixed same-day state/evidence/package/code
  changes from multiple lanes
- commit: not created
- push: not needed and not authorized
- deploy impact: none

This issue produced evidence/state only and did not change runtime code,
package behavior, deployment config, or production state.

## Validation

- `pnpm exec node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`: PASS, including protected `/workers/ready -> 200`.
- Public timing: API `/health`, API `/ready`, Web `/`, and Web
  `/api/build-info` all returned `200:8`.
- Authenticated dashboard/admin API timing: all representative reads returned
  `200:3`; market catalog cold sample normalized on follow-up `200:8`.
- `pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch`: PASS.
- `pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch`: PASS, `shouldRollback=false`.
- Read-only Coolify `GET` projection: PASS; six app rows `running:unknown`,
  PostgreSQL/Redis rows present, four visible queued deployment rows.

## Cleanup

This heartbeat did not start dev servers, Docker containers, Playwright, or
headless browsers. No task-owned validation processes needed teardown.

## Disposition

[LUC-6102](/LUC/issues/LUC-6102) can close as a read-only production
performance and server-health checkpoint:

- no public outage was observed
- no dashboard 60-second-class stall was reproduced
- current-binding protected workers readiness passed
- runtime freshness passed
- rollback guard returned `shouldRollback=false`
- Coolify read-only projection is reachable and expected Soar production
  resource families are visible
- no duplicate incident/repair issue is required from this evidence window

Residuals:

- one `/dashboard/markets/catalog` cold sample reached `1719.3 ms`, then
  normalized to focused max `44.3 ms`
- Coolify application rows continue reporting `running:unknown`
- Coolify shows four queued deployment rows
- host-level VPS pressure/log-window evidence still requires approved
  read-only host-status credentials
- Web build-info provenance remains a separate release/source-control gate
