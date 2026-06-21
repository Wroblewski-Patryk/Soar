# LUC-4767 Coolify/VPS Health Readback

## Status

- Result: `DONE / VERIFIED_READ_ONLY / APP_HEALTHY / VPS_PRESSURE_LIMITED`
- Issue: [LUC-4767](/LUC/issues/LUC-4767)
- Wake reason: `issue_children_completed`
- Environment: production
- Evidence date: 2026-06-21
- Checked at: `2026-06-21T00:34:14Z` through `2026-06-21T00:35:11Z`

## Wake Delta

The prior child blocker [LUC-4806](/LUC/issues/LUC-4806) is `done` and reports
that read-only Coolify/VPS status binding names are available. This heartbeat
therefore resumed the DRE read-only health projection instead of leaving
[LUC-4767](/LUC/issues/LUC-4767) blocked.

## Secret Handling

Present by name without value disclosure:

- `COOLIFY_API_TOKEN`
- `COOLIFY_BASE_URL`
- `COOLIFY_LOGIN_EMAIL`
- `COOLIFY_LOGIN_PASSWORD`
- `COOLIFY_SOAR_API_APP_ID`
- `COOLIFY_SOAR_APP_ID`
- `COOLIFY_SOAR_POSTGRES_RESOURCE_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_REDIS_RESOURCE_ID`
- `COOLIFY_SOAR_TEAM_ID`
- `COOLIFY_SOAR_WEB_APP_ID`
- `COOLIFY_TEAM_ID`
- `COOLIFY_TOKEN`
- `VPS_HOST`
- `SMOKE_AUTH_EMAIL`
- `SMOKE_AUTH_PASSWORD`
- `SMOKE_AUTH_TOKEN`

Missing or unavailable for this runner by names-only scan:

- `SSH*`
- dedicated `VPS_*` status credential names beyond `VPS_HOST`
- `ROLLBACK_GUARD_*`
- `SOAR_PROD*`
- `PROD_DB_CHECK*`
- `PRODUCTION_DB_CHECK*`
- `RC_*`
- `GATE*`

Token values, credentials, raw resource ids, internal URLs, cookies, database
values, raw log bodies, and screenshot artifacts were not printed or stored.

## Coolify Read-Only Projection

Read-only `GET` calls succeeded for:

| Check | Result |
| --- | --- |
| `GET /api/v1/version` | pass |
| `GET /api/v1/teams/current` | pass |
| `GET /api/v1/projects` | pass; `5` visible project rows |
| `GET /api/v1/projects/{configured-project-id}` | pass |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass; `1` environment row |
| `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass |
| `GET /api/v1/resources` | pass; `17` visible global resource rows |
| `GET /api/v1/deployments` | pass; `0` visible deployment rows |

Global resource status counts:

| Status | Count |
| --- | ---: |
| `running:unknown` | 12 |
| `running:healthy` | 5 |

## Production Environment Inventory

| Resource | Coolify status | Public FQDN | Commit metadata | Dockerfile | Restart count |
| --- | --- | --- | --- | --- | ---: |
| `soar-web` | `running:unknown` | yes | present | `/apps/web/Dockerfile` | 1 |
| `soar-api` | `running:unknown` | yes | present | `/apps/api/Dockerfile` | 2 |
| `workers-backtest` | `running:unknown` | no | present | `/apps/api/Dockerfile.worker.backtest` | 0 |
| `workers-execution` | `running:unknown` | no | present | `/apps/api/Dockerfile.worker.execution` | 2 |
| `workers-market-data` | `running:unknown` | no | present | `/apps/api/Dockerfile.worker.market-data` | 0 |
| `workers-market-stream` | `running:unknown` | no | present | `/apps/api/Dockerfile.worker.market-stream` | 0 |
| `postgresql` | `running:healthy` | no | absent | n/a | 52 |
| `redis` | `running:healthy` | no | absent | n/a | 682 |

Counts:

- Production applications: `6`
- Production PostgreSQL resources: `1`
- Production Redis resources: `1`
- Visible deployment rows: `0`

## App, Worker, And Runtime Health

Public smoke passed:

```text
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

- API `/health`: PASS `200`
- API `/ready`: PASS `200`
- Web `/`: PASS `200`
- Web `/api/build-info`: PASS `200`

Protected smoke with the pre-bound token path failed closed on workers:

- API `/workers/ready`: FAIL `401`

Protected smoke passed after clearing the stale pre-bound token and forcing the
env-bound email/password login path:

```text
pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb
```

Result:

- API `/health`: PASS `200`
- API `/ready`: PASS `200`
- Web `/`: PASS `200`
- Web `/api/build-info`: PASS `200`, expected SHA matched
- API `/workers/ready`: PASS `200`

Rollback guard passed with auth mapped in-process from the same read-only smoke
credential family:

- `shouldRollback=false`
- reasons: none
- workers ready: `status=ready`, `topologyStatus=healthy`
- required worker families: `backtest`, `execution`, `market-data`,
  `market-stream`
- runtime freshness: PASS
- worker heartbeat age: `20958 ms`
- market data age: `20958 ms`
- runtime signal lag age: `0 ms`
- runtime sessions: `runningCount=5`, no stale session ids
- alerts: none

## VPS / Logs / Pressure Boundary

`VPS_HOST` is present, but no SSH credential family or dedicated read-only VPS
pressure binding names are present in this runner. Therefore host-level CPU,
memory, disk, proxy pressure, container-engine pressure, and sanitized raw log
window capture were not attempted. The available server-health proof for this
heartbeat is Coolify resource/deployment projection plus application,
worker-readiness, runtime-freshness, PostgreSQL, and Redis health.

## Final Disposition

The previously blocked read-only health path is restored enough for this DRE
issue:

- Coolify binding names are present.
- Coolify project/environment/resource/deployment readback works.
- No visible active deployment rows were present.
- PostgreSQL and Redis report `running:healthy`.
- Public app smoke passed.
- Protected worker readiness passed via fresh login path.
- Runtime freshness passed.
- Rollback guard says rollback is not indicated.

Residuals:

- Coolify application rows still report `running:unknown`; app-level smoke and
  worker/runtime checks are the stronger readiness evidence.
- The pre-bound `SMOKE_AUTH_TOKEN` remains stale for `/workers/ready`; the
  working evidence path is email/password login.
- Host-level VPS pressure and sanitized log-window evidence require an
  approved read-only SSH/VPS status binding family if a later issue needs that
  depth.

## Safety

No deploy, push, restart, rollback, environment edit, database/Redis mutation,
secret/account value readback, raw log capture, screenshot, production account
mutation, exchange action, order, position, payment/subscription mutation, or
live-trading action occurred.
