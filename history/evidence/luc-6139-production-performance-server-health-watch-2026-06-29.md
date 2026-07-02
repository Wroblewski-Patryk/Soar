# LUC-6139 Production Performance And Server Health Watch - 2026-06-29

## Context

- Issue: [LUC-6139](/LUC/issues/LUC-6139)
- Role: DRE
- Stage: verification
- Scope: read-only production performance and server-health watch.
- Excluded: deploy, push, restart, rollback execution, environment edit,
  secret/account value readback, DB/Redis mutation, raw log capture,
  production account mutation, subscription/payment mutation, exchange
  mutation, order, position, and live-trading action.

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

## Public Timing

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| API `/health` | `200` | 136.0 | 40.0 | 136, 72.3, 22.1, 22.5, 16.7, 14.8, 17.8, 17.7 |
| API `/ready` | `200` | 22.8 | 20.1 | 19.4, 21.9, 18.6, 22.8, 21.1, 18.6, 17.9, 20.6 |
| Web `/` | `200` | 128.4 | 47.3 | 89.6, 28.4, 128.4, 28.4, 26.2, 23.4, 25.7, 28.5 |
| Web `/api/build-info` | `200` | 221.7 | 49.6 | 26.6, 20.8, 27.7, 24.1, 221.7, 24.8, 26.4, 24.6 |

No public HTTP failure or low-second timing tail reproduced in this window.

## Authenticated Dashboard API Timing

Read-only authenticated sampling through the existing ops auth helper and
approved smoke credential family. Three requests per endpoint:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| `/dashboard/bots` | `200` | 105.4 | 56.6 | 105.4, 34.6, 29.7 |
| `/dashboard/wallets` | `200` | 27.6 | 24.8 | 25.7, 21.2, 27.6 |
| `/dashboard/markets/catalog` | `200` | 1583.2 | 548.4 | 1583.2, 32.0, 30.0 |
| `/dashboard/strategies` | `200` | 226.1 | 93.4 | 226.1, 27.5, 26.5 |
| `/dashboard/backtests/runs` | `200` | 30.8 | 28.3 | 30.8, 27.8, 26.3 |
| `/dashboard/reports/cross-mode-performance` | `200` | 49.4 | 48.0 | 49.4, 48.4, 46.3 |
| `/dashboard/logs` | `200` | 34.1 | 31.6 | 34.1, 34.1, 26.7 |
| `/dashboard/profile/subscription` | `200` | 128.1 | 66.6 | 128.1, 46.9, 24.9 |
| `/admin/users` | `200` | 29.9 | 27.3 | 29.9, 25.8, 26.1 |
| `/admin/subscriptions/plans` | `200` | 32.9 | 29.3 | 32.9, 24.7, 30.4 |

Focused follow-up for `/dashboard/markets/catalog`, eight requests:

| Endpoint | Statuses | Max ms | Avg ms | Samples ms |
| --- | ---: | ---: | ---: | --- |
| `/dashboard/markets/catalog` | `200` | 99.1 | 37.7 | 99.1, 39.2, 26.8, 23.0, 30.2, 31.1, 24.0, 28.1 |

Interpretation: the known market-catalog cold sample repeated once, then
normalized in focused follow-up. No persistent 60-second-class dashboard stall
or outage was reproduced.

## Runtime Freshness

Command:

```bash
set DEPLOY_FRESHNESS_AUTH_EMAIL=%SMOKE_AUTH_EMAIL%&& set DEPLOY_FRESHNESS_AUTH_PASSWORD=%SMOKE_AUTH_PASSWORD%&& pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch
```

Result:

- worker heartbeat freshness: PASS, age `2381 ms`, threshold `60000 ms`
- market data freshness: PASS, age `2381 ms`, threshold `120000 ms`
- runtime signal lag: PASS, age `0 ms`, threshold `90000 ms`
- runtime sessions: PASS, running count `5`, stale session ids `[]`
- runtime decision activity: SKIP, not required for running sessions

Unauthenticated runtime freshness probe returned `401`, confirming the endpoint
remains fail-closed without approved credentials.

## Rollback Guard

Command:

```bash
set ROLLBACK_GUARD_AUTH_EMAIL=%SMOKE_AUTH_EMAIL%&& set ROLLBACK_GUARD_AUTH_PASSWORD=%SMOKE_AUTH_PASSWORD%&& pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch
```

Result:

- checked at `2026-06-29T01:27:25.108Z`
- `shouldRollback`: `false`
- reasons: `[]`
- workers ready status: `ready`
- topology status: `healthy`
- freshness: PASS
- runtime sessions: `5`
- alerts: `[]`

## Coolify Read-Only Projection

Environment binding shape check printed names and lengths only:

- `COOLIFY_BASE_URL`: present
- `COOLIFY_API_TOKEN`: present
- `COOLIFY_TOKEN`: present
- `COOLIFY_SOAR_PROJECT_ID`: present

Authenticated Coolify `GET` projection:

| Check | Result | Timing |
| --- | --- | ---: |
| `GET /api/v1/version` | pass `200` | 301 ms |
| `GET /api/v1/teams/current` | pass `200` | 107 ms |
| `GET /api/v1/projects/{configured-project-id}` | pass `200` | 55 ms |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass `200` | 48 ms |
| `GET /api/v1/projects/{configured-project-id}/production` | pass `200`, `8` rows | 95 ms |
| `GET /api/v1/resources` | pass `200` | 167 ms |
| `GET /api/v1/deployments` | pass `200`, `8` rows | 56 ms |

Production resource names visible: `soar-web`, `workers-backtest`,
`workers-market-stream`, `workers-execution`, `soar-api`,
`workers-market-data`, `postgresql`, and `redis`.

Deployment rows remain visible and include queued rows for
`workers-market-stream`, `workers-execution`, `workers-market-data`, and
`soar-api` created on `2026-06-28T06:23:11Z` to
`2026-06-28T06:23:12Z`.

## Runner Note

A broad parallel PowerShell read/search attempted at the start of this
heartbeat caused PowerShell initialization failures and out-of-memory errors.
The watch recovered by running narrow sequential commands through `cmd /c`.
This affected the local agent runner only; production checks completed after
the command strategy was narrowed.

## Result

Disposition: `DONE / VERIFIED_READ_ONLY / APP_HEALTHY /
MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH`.

No production outage, rollback trigger, runtime freshness failure, protected
smoke failure, or persistent dashboard API performance stall was reproduced.

Residual risks:

- `/dashboard/markets/catalog` still shows one cold sample in the low-second
  range before normalizing.
- Coolify deployment queue rows remain visible.
- Host-level VPS pressure/log-window proof still requires approved read-only
  host-status credentials and is not claimed here.
- Release-grade build provenance remains a separate release/source gate.
