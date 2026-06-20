# LUC-3773 Coolify Read-Only Production Status Access

- Checked at: 2026-06-13T12:56:34Z
- Owner: 11 SPM (Soar Product Manager)
- Mode: operator access verification / read-only production status
- Scope: Soar Coolify production deploy status reconciliation access

## Result

Status: verified.

[LUC-3773](/LUC/issues/LUC-3773) confirmed that the current Paperclip runner has
the required Soar Coolify read-only production status bindings and can use them
for authenticated Coolify `GET` reads without exposing secret values.

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
database values, labels, proxy config, full Coolify objects, and log bodies
were not printed or stored.

## Read-Only API Checks

| Check | Result |
| --- | --- |
| `GET /api/v1/projects/{configured-project-id}` | pass; resolved project `Soar` |
| `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass; resolved environment `production` |
| `GET /api/v1/deployments` | pass; deploy-status endpoint readable |

## Production Environment Projection

| Surface | Count / Names |
| --- | --- |
| Canonical production-environment resources | `8` |
| Production applications | `soar-api`, `soar-web`, `workers-backtest`, `workers-execution`, `workers-market-data`, `workers-market-stream` |
| Production PostgreSQL resources | `postgresql` reports `running:healthy`, restart count `52` |
| Production Redis resources | `redis` reports `running:healthy`, restart count `682` |
| Application status projection | all six applications report `running:unknown` in Coolify inventory |
| Public FQDN presence | `soar-api` and `soar-web` present; worker applications private |
| Visible deployment rows sampled | `1` active row: `soar-api`, status `in_progress`, short commit `9f61eb97` |

## Residual Risk

- This proves read-only Coolify production status access, not application
  readiness.
- The active `soar-api` deployment row should be monitored by Ops/Release if a
  release lane depends on this deploy finishing.
- Coolify inventory is not a substitute for public route smoke, protected auth
  smoke, worker readiness, rollback guard, SLO evidence, database restore, or
  release approval.

## Verification

| Check | Result |
| --- | --- |
| Names-only Coolify binding scan | pass; required variable names present, values not printed |
| Authenticated Coolify project readback | pass; project `Soar` |
| Authenticated production environment readback | pass; environment `production`; eight canonical resources visible |
| Authenticated deployment status readback | pass; one active deployment row visible |
| Mutation boundary | pass; only `GET` requests were used |
