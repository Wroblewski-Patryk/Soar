# LUC-3437 Coolify Resource Inventory Reconciliation

- Checked at: 2026-06-11T04:29:51Z
- Owner: 09 DRE (Deployment and Reliability Engineer)
- Mode: read-only Coolify API projection
- Scope: Soar project, production environment
- Process: release/deploy gate

## Result

Status: verified.

[LUC-3437](/LUC/issues/LUC-3437) reconciled the current Soar production
Coolify resource inventory. The authoritative deployment scope remains:

`Coolify project -> production environment -> resources`

No deploy, restart, rebuild, rollback, environment edit, database action, Redis
action, team setting change, account action, protected smoke, screenshot, raw
log capture, or production mutation was performed.

## Secret Handling

Present by name without value disclosure:

- `COOLIFY_BASE_URL`
- `COOLIFY_API_TOKEN`
- `COOLIFY_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_TEAM_ID`
- `COOLIFY_TEAM_ID`
- `COOLIFY_SOAR_API_APP_ID`
- `COOLIFY_SOAR_WEB_APP_ID`
- `COOLIFY_SOAR_POSTGRES_RESOURCE_ID`
- `COOLIFY_SOAR_REDIS_RESOURCE_ID`

Raw Coolify token values, raw resource ids, internal URLs, cookies,
credentials, database values, and log bodies were not printed or stored.

## Read-Only API Checks

| Check | Result |
| --- | --- |
| `GET /api/v1/version` | pass |
| `GET /api/v1/teams/current` | pass; selector resolved `LuckySparrow` |
| `GET /api/v1/teams` | pass |
| `GET /api/v1/projects` | pass |
| `GET /api/v1/projects/{configured-project-id}` | pass; resolved project `Soar` |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass |
| `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass |
| `GET /api/v1/resources` | pass; `17` visible global resource rows; not release authority |
| `GET /api/v1/deployments` | pass; `0` active deployment rows visible |

## Production Environment Inventory

| Resource | Type | Coolify status | Public FQDN | Commit metadata | Dockerfile | Restart count | Last restart |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| `soar-api` | application | `running:unknown` | yes | `HEAD` | `/apps/api/Dockerfile` | 0 | n/a |
| `soar-web` | application | `running:unknown` | yes | `b894e5dd` | `/apps/web/Dockerfile` | 0 | n/a |
| `workers-backtest` | application | `running:unknown` | no | `HEAD` | `/apps/api/Dockerfile.worker.backtest` | 0 | n/a |
| `workers-execution` | application | `running:unknown` | no | `HEAD` | `/apps/api/Dockerfile.worker.execution` | 2 | n/a |
| `workers-market-data` | application | `running:unknown` | no | `HEAD` | `/apps/api/Dockerfile.worker.market-data` | 0 | n/a |
| `workers-market-stream` | application | `running:unknown` | no | `HEAD` | `/apps/api/Dockerfile.worker.market-stream` | 0 | n/a |
| `postgresql` | postgresql | `running:healthy` | no | n/a | n/a | 52 | n/a |
| `redis` | redis | `running:healthy` | no | n/a | n/a | 682 | n/a |

## Counts

| Surface | Count |
| --- | ---: |
| Production applications | 6 |
| Production PostgreSQL resources | 1 |
| Production Redis resources | 1 |
| Production generic services | 0 |
| Canonical production-environment resources | 8 |
| Global visible Coolify resources | 17 |
| Active global deployment rows | 0 |

## Residual Risk

- Coolify application inventory status remains `running:unknown` for API, Web,
  and worker application rows. This is not app-level readiness proof.
- `workers-execution` retains restart metadata (`restartCount=2`).
- Redis and PostgreSQL are currently healthy, but historic restart counts
  remain visible.
- Public route smoke, protected auth smoke, worker readiness, rollback guard,
  SLO evidence, database restore, and release approval remain separate gates.

## Verification

| Check | Result |
| --- | --- |
| Names-only Coolify binding scan | pass; required variable names present, values not printed |
| Authenticated Coolify project/environment readback | pass; selector `LuckySparrow`, project `Soar`, production environment binding |
| Resource inventory projection | pass; 8 canonical production resources |
| Mutation check | pass; only `GET` requests were used |
