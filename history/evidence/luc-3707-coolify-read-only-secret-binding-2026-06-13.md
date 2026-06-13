# LUC-3707 Coolify Read-Only Secret Binding Verification

- Checked at: 2026-06-13T02:20:50Z
- Owner: 10 SPA (Security & Privacy Auditor)
- Mode: security read-only secret-binding verification
- Scope: Soar Coolify production status access binding

## Result

Status: verified.

[LUC-3707](/LUC/issues/LUC-3707) verified that the current runner has the
expected Coolify read-only binding names and can use them for authenticated
Coolify `GET` status reads without exposing secret values.

No deploy, restart, rebuild, rollback, environment edit, database action,
Redis action, team setting change, account action, protected smoke,
screenshot, raw log capture, raw resource id storage, secret value readback, or
live-trading action was performed.

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

Raw token values, raw configured ids, internal URLs, cookies, credentials,
database values, and log bodies were not printed or stored. The configured
production environment binding value was treated as secret-adjacent and is not
recorded here; only the resolved production environment id is recorded.

## Read-Only API Checks

| Check | Result |
| --- | --- |
| `GET /api/v1/version` | pass |
| `GET /api/v1/teams/current` | pass; selector resolved `LuckySparrow` |
| `GET /api/v1/teams` | pass; `1` visible team row |
| `GET /api/v1/projects` | pass; `5` visible project rows |
| `GET /api/v1/projects/{configured-project-id}` | pass; resolved project `Soar` |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass; `1` environment row |
| `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass; production environment id `6` |
| `GET /api/v1/resources` | pass; `17` visible global resource rows; not release authority |
| `GET /api/v1/deployments` | pass; `0` active deployment rows visible |

## Production Environment Projection

| Surface | Count / Names |
| --- | --- |
| Production applications | `6` |
| Production PostgreSQL resources | `1` |
| Production Redis resources | `1` |
| Production generic services | `0` |
| Canonical production-environment resources | `soar-api`, `soar-web`, `workers-backtest`, `workers-execution`, `workers-market-data`, `workers-market-stream`, `postgresql`, `redis` |
| Global visible Coolify resources | `17` |
| Active global deployment rows | `0` |

## Residual Risk

- This proves read-only Coolify binding usability, not application readiness.
- Coolify inventory is not a substitute for public route smoke, protected auth
  smoke, worker readiness, rollback guard, SLO evidence, database restore, or
  release approval.
- Security scope did not attempt mutation-permission probing because that
  would violate the no-mutation boundary for this issue.

## Verification

| Check | Result |
| --- | --- |
| Names-only Coolify binding scan | pass; required variable names present, values not printed |
| Authenticated Coolify readback | pass; selector `LuckySparrow`, project `Soar`, production environment id `6` |
| Resource projection sanity | pass; eight canonical production resources visible |
| Mutation check | pass; only `GET` requests were used |
