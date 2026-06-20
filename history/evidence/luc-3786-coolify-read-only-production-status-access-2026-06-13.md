# LUC-3786 Coolify Read-Only Production Status Access

- Checked at: 2026-06-13T14:31:33Z
- Owner: 11 SPM (Soar Product Manager)
- Mode: read-only Coolify production status access verification
- Scope: Soar project, production environment

## Result

Status: verified read-only.

[LUC-3786](/LUC/issues/LUC-3786) verified that the current runner has the
expected Coolify binding names and can use them for authenticated read-only
Coolify `GET` status reads without exposing secret values.

No deploy, restart, rebuild, rollback, environment edit, database action,
Redis action, team setting change, account action, protected smoke,
screenshot, raw log capture, raw resource id storage, secret value readback,
or live-trading action was performed.

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
- `COOLIFY_SOAR_APP_ID`
- `COOLIFY_SOAR_POSTGRES_RESOURCE_ID`
- `COOLIFY_SOAR_REDIS_RESOURCE_ID`

Raw Coolify token values, raw configured ids, raw resource ids, internal URLs,
cookies, credentials, database values, labels, proxy settings, and log bodies
were not printed or stored. The configured production environment selector
value was treated as secret-adjacent and is not recorded here.

## Read-Only API Checks

| Check | Result |
| --- | --- |
| `GET /api/v1/version` | pass |
| `GET /api/v1/teams/current` | pass; selector resolved `LuckySparrow` |
| `GET /api/v1/teams` | pass; `1` visible team row |
| `GET /api/v1/projects` | pass; `5` visible project rows |
| `GET /api/v1/projects/{configured-project-id}` | pass; resolved project `Soar` |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass; `1` environment row |
| `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass |
| `GET /api/v1/resources` | pass; `17` visible global resource rows; not release authority |
| `GET /api/v1/deployments` | pass; `1` visible deployment row |

## Production Environment Inventory

| Resource | Type | Coolify status | Public FQDN | Commit metadata | Restart count |
| --- | --- | --- | --- | --- | ---: |
| `soar-web` | application | `running:unknown` | yes | `b894e5dd3061` | 0 |
| `workers-backtest` | application | `running:unknown` | no | `HEAD` | 0 |
| `workers-market-stream` | application | `running:unknown` | no | `HEAD` | 0 |
| `workers-execution` | application | `running:unknown` | no | `HEAD` | 0 |
| `soar-api` | application | `running:unknown` | yes | `HEAD` | 0 |
| `workers-market-data` | application | `running:unknown` | no | `HEAD` | 0 |
| `postgresql` | postgresql | `running:healthy` | no | n/a | 52 |
| `redis` | redis | `running:healthy` | no | n/a | 682 |

## Counts

| Surface | Count |
| --- | ---: |
| Production applications | 6 |
| Production PostgreSQL resources | 1 |
| Production Redis resources | 1 |
| Production generic services | 0 |
| Canonical production-environment resources | 8 |
| Global visible Coolify resources | 17 |
| Visible deployment rows | 1 |

## Deploy Status

- Read-only status access works for the Soar production Coolify hierarchy.
- The deployments endpoint showed one visible `soar-api` row with status
  `in_progress`, short commit `9f61eb9781c3`, and creation timestamp
  `2026-06-13T03:36:23.000000Z`.
- This inventory does not prove public route smoke, protected route smoke,
  worker readiness, log health, rollback readiness, restore readiness, SLO
  posture, or release approval.

## Verification

| Check | Result |
| --- | --- |
| Names-only Coolify binding scan | pass; required variable names present, values not printed |
| Authenticated Coolify project/environment readback | pass; selector `LuckySparrow`, project `Soar` |
| Deploy queue readback | pass; `1` visible `soar-api` deployment row |
| Resource inventory projection | pass; 8 canonical production resources |
| Mutation check | pass; only `GET` requests were used |
