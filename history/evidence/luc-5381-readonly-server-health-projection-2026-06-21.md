# LUC-5381 Read-Only Server-Health Projection

## Status

- Result: `DONE / VERIFIED_READ_ONLY / APP_HEALTHY / VPS_PRESSURE_LIMITED`
- Issue: [LUC-5381](/LUC/issues/LUC-5381)
- Wake reason: `issue_assigned`
- Environment: production
- Evidence date: 2026-06-21
- Checked at: `2026-06-21T00:40:54Z` through `2026-06-21T00:41:17Z`

## Wake Delta

[LUC-5381](/LUC/issues/LUC-5381) was created by
[LUC-5378](/LUC/issues/LUC-5378) after [LUC-4811](/LUC/issues/LUC-4811)
closed the prior Coolify binding blocker. This heartbeat resumed the DRE
read-only server-health projection instead of creating another binding issue.
The wake payload had no pending comments and `fallbackFetchNeeded=false`;
checkout was already claimed by the harness and was not repeated.

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
- dedicated read-only `VPS_*` status credential names beyond `VPS_HOST`
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
| `GET /api/v1/teams/current` | pass; selector `LuckySparrow` |
| `GET /api/v1/projects` | pass; `5` visible project rows |
| `GET /api/v1/projects/{configured-project-id}` | pass; project `Soar` |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass; `1` environment row |
| `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass; environment `production` |
| `GET /api/v1/resources` | pass; `17` visible global resource rows |
| `GET /api/v1/deployments` | pass; `0` visible deployment rows |

Global resource status counts:

| Status | Count |
| --- | ---: |
| `running:unknown` | 12 |
| `running:healthy` | 5 |

Production environment application inventory:

| Resource | Coolify status | Public FQDN | Dockerfile | Restart count |
| --- | --- | --- | --- | ---: |
| `soar-web` | `running:unknown` | yes | `/apps/web/Dockerfile` | 1 |
| `soar-api` | `running:unknown` | yes | `/apps/api/Dockerfile` | 2 |
| `workers-backtest` | `running:unknown` | no | `/apps/api/Dockerfile.worker.backtest` | 0 |
| `workers-execution` | `running:unknown` | no | `/apps/api/Dockerfile.worker.execution` | 2 |
| `workers-market-data` | `running:unknown` | no | `/apps/api/Dockerfile.worker.market-data` | 0 |
| `workers-market-stream` | `running:unknown` | no | `/apps/api/Dockerfile.worker.market-stream` | 0 |

Global resource readback confirmed PostgreSQL and Redis resources report
`running:healthy`. Application rows still report `running:unknown`, so
app-level smoke, protected worker readiness, runtime freshness, and rollback
guard are the stronger readiness evidence.

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
- worker heartbeat age: `11789 ms`
- market data age: `11789 ms`
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

## Validation

- `pnpm run -s ops:coolify-stack:env-check:test` -> PASS (`11/11`).
- Names-only environment scan -> PASS for Coolify, `VPS_HOST`, and smoke auth
  names; missing host-depth and protected release-gate families are recorded
  above.
- Coolify read-only projection -> PASS.
- Public smoke -> PASS.
- Protected worker readiness smoke -> PASS via fresh login path.
- Rollback guard -> PASS, `shouldRollback=false`.

## Final Disposition

The requested read-only server-health projection is complete enough to close
[LUC-5381](/LUC/issues/LUC-5381):

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
- Host-level VPS pressure and sanitized log-window evidence require an
  approved read-only SSH/VPS status binding family if a later issue needs that
  depth.
- Web build-info still reports the existing deployed SHA
  `42177530f2a2ddc22832133b545bccab6ab404eb`; release provenance remains a
  separate lane and was not changed here.

## Safety

No deploy, push, restart, rollback, environment edit, database/Redis mutation,
secret/account value readback, raw log capture, screenshot, production account
mutation, exchange action, order, position, payment/subscription mutation, or
live-trading action occurred.
