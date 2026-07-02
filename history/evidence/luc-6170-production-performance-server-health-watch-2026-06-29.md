# LUC-6170 Production Performance And Server Health Watch - 2026-06-29

## Context

- Issue: [LUC-6170](/LUC/issues/LUC-6170)
- Role: DRE
- Stage: verification
- Scope: read-only production performance and server-health watch.
- Excluded: deploy, push, restart, rollback execution, environment edit,
  secret/account value readback, DB/Redis mutation, raw log capture,
  production account mutation, subscription/payment mutation, exchange
  mutation, order, position, and live-trading action.

Wake context: `issue_assigned`, no pending comments, `fallbackFetchNeeded=false`.

## Deploy Smoke

Command:

```bash
node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- PASS Web `/` -> `200`
- PASS Web `/api/build-info` -> `200`
- PASS API `/workers/ready` -> `200`

## Runtime Freshness

Command:

```bash
pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Result:

- worker heartbeat freshness: PASS, age `8808 ms`, threshold `60000 ms`
- market data freshness: PASS, age `8808 ms`, threshold `120000 ms`
- runtime signal lag: PASS, age `0 ms`, threshold `90000 ms`
- runtime sessions: PASS, running count `5`, stale session ids `[]`
- runtime decision activity: SKIP, not required for running sessions

## Rollback Guard

Command:

```bash
pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Result:

- checked at `2026-06-29T07:08:09.964Z`
- `shouldRollback`: `false`
- reasons: `[]`
- workers ready status: `ready`
- topology status: `healthy`
- freshness: PASS
- runtime sessions: `5`
- alerts: `[]`

## Public Timing

Eight requests per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| API `/health` | `200` | 72.9 | 25.8 | 72.9, 18.3, 16.5, 22.8, 18.8, 17.6, 18.4, 20.9 |
| API `/ready` | `200` | 21.9 | 19.7 | 21.9, 17.8, 19.5, 21.0, 20.1, 19.5, 17.6, 20.5 |
| Web `/` | `200` | 94.3 | 33.8 | 94.3, 26.6, 24.9, 23.9, 27.8, 25.4, 20.9, 26.6 |
| Web `/api/build-info` | `200` | 30.4 | 25.1 | 30.4, 22.2, 23.2, 22.9, 24.3, 26.1, 26.1, 25.8 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Read-only authenticated sampling through the existing ops auth helper and
approved smoke credential family. Three requests per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| `/dashboard/bots` | `200` | 43.2 | 34.2 | 43.2, 27.5, 31.8 |
| `/dashboard/wallets` | `200` | 26.8 | 26.7 | 26.6, 26.8, 26.8 |
| `/dashboard/markets/catalog` | `200` | 1559.9 | 537.2 | 1559.9, 22.3, 29.5 |
| `/dashboard/strategies` | `200` | 37.3 | 30.0 | 26.6, 37.3, 26.0 |
| `/dashboard/backtests/runs` | `200` | 31.2 | 29.5 | 31.2, 27.4, 30.0 |
| `/dashboard/reports/cross-mode-performance` | `200` | 54.0 | 48.9 | 54.0, 48.5, 44.1 |
| `/dashboard/logs` | `200` | 39.6 | 33.6 | 39.6, 27.6, 33.7 |
| `/dashboard/profile/subscription` | `200` | 45.7 | 36.7 | 45.7, 35.5, 28.9 |
| `/admin/users` | `200` | 26.2 | 25.5 | 25.6, 26.2, 24.7 |
| `/admin/subscriptions/plans` | `200` | 34.0 | 31.0 | 28.8, 30.2, 34.0 |

Focused follow-up for `/dashboard/markets/catalog`, eight requests:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200` | 36.0 | 30.9 | 30.8, 28.1, 30.5, 36.0, 29.6, 30.7, 32.1, 29.1 |

Interpretation: the known market-catalog cold sample repeated once, then
normalized in focused follow-up. No persistent 60-second-class dashboard stall
or outage was reproduced.

Runner note: the first authenticated timing attempt hit a transient
`UND_ERR_CONNECT_TIMEOUT` during auth-token resolution. The retry completed
successfully and endpoint samples had zero retry attempts.

## Coolify Read-Only Projection

Environment binding shape check printed names and presence only:

- `COOLIFY_BASE_URL`: present
- `COOLIFY_API_TOKEN`: present
- `COOLIFY_TOKEN`: present
- `COOLIFY_SOAR_PROJECT_ID`: present

Authenticated Coolify `GET` projection:

| Check | Result | Timing |
| --- | --- | ---: |
| `GET /api/v1/version` | pass `200` | 449 ms |
| `GET /api/v1/teams/current` | pass `200` | 104 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 56 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200`, `1` row | 69 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200` | 103 ms |
| `GET /api/v1/resources` | pass `200`, `17` rows | 185 ms |
| `GET /api/v1/deployments` | pass `200`, `8` rows | 56 ms |

Production environment id `6` still exposes six application resources and two
data resources:

- applications: `soar-web`, `workers-backtest`, `workers-market-stream`,
  `workers-execution`, `soar-api`, `workers-market-data`
- data: `postgresql`, `redis`
- application statuses: `running:unknown`
- PostgreSQL/Redis statuses: `running:healthy`

Deployment rows remain visible and include queued rows for
`workers-market-stream`, `workers-execution`, `workers-market-data`, and
`soar-api` at commit `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`, plus queued
rows for `workers-market-stream`, `workers-execution`, `soar-api`, and
`workers-market-data` at commit `c357d957741f56835f27a1fc3a948dad43a91036`.

## Result

Disposition: `DONE / VERIFIED_READ_ONLY / APP_HEALTHY /
MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH`.

No production outage, rollback trigger, runtime freshness failure, protected
smoke failure, or persistent dashboard API performance stall was reproduced.

Residual risks:

- `/dashboard/markets/catalog` still shows one cold sample in the low-second
  range before normalizing.
- Coolify queued deployment rows increased from the previous visible four rows
  to eight rows, including a newer commit family. This remains a watch item,
  not a proven outage, because deploy smoke, runtime freshness, rollback guard,
  and resource health checks passed.
- Coolify application rows still report `running:unknown`.
- Host-level VPS pressure/log-window proof still requires approved read-only
  host-status credentials and is not claimed here.
- Release-grade build provenance remains a separate release/source gate.
