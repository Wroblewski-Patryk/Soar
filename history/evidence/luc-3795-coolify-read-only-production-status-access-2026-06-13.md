# LUC-3795 Coolify Read-Only Production Status Access

- Checked at: 2026-06-13T16:42:52Z
- Owner: 11 SPM (Soar Product Manager)
- Mode: operator access binding verification / read-only production status
- Scope: Soar Coolify project and production environment

## Result

Status: verified read-only.

[LUC-3795](/LUC/issues/LUC-3795) verified that the current Paperclip runner has
the required Soar Coolify read-only production status binding names and can use
them for authenticated Coolify `GET` status reads without exposing secret
values.

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

Missing required binding names: none.

Raw Coolify token values, configured ids, raw resource ids, internal URLs,
cookies, credentials, database values, labels, proxy settings, raw deployment
objects, and log bodies were not printed or stored.

## Read-Only API Checks

| Check | Result |
| --- | --- |
| `GET /api/v1/version` | pass |
| `GET /api/v1/teams/current` | pass; selector resolved `LuckySparrow` |
| `GET /api/v1/projects` | pass; `5` visible project rows |
| `GET /api/v1/projects/{configured-project-id}` | pass; resolved project `Soar` |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass |
| `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass; production environment id `6` |
| `GET /api/v1/resources` | pass; `17` visible global resource rows; not release authority |
| `GET /api/v1/deployments` | pass; `1` visible deployment row |

## Production Environment Projection

| Surface | Count / Names |
| --- | --- |
| Production applications | `6` |
| Production PostgreSQL resources | `1` |
| Production Redis resources | `1` |
| Production generic services | `0` |
| Canonical production-environment resources | `soar-web`, `workers-backtest`, `workers-market-stream`, `workers-execution`, `soar-api`, `workers-market-data`, `postgresql`, `redis` |
| Global visible Coolify resources | `17` |
| Visible deployment rows | `1` |

## Residual Risk

- This proves read-only Coolify production status access, not application
  readiness.
- Deployment row visibility alone does not prove successful auto-redeploy.
- Public route smoke, protected auth smoke, worker readiness, rollback guard,
  SLO evidence, database restore, and release approval remain separate gates.

## Verification

| Check | Result |
| --- | --- |
| Names-only Coolify binding scan | pass; required variable names present, values not printed |
| Authenticated Coolify project/environment readback | pass; selector `LuckySparrow`, project `Soar`, production environment id `6` |
| Deploy status endpoint readback | pass; `1` visible deployment row |
| Resource inventory projection | pass; 8 canonical production resources |
| Mutation check | pass; only `GET` requests were used |
