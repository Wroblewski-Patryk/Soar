# LUC-4413 Coolify Read-Only Production Status Access

- Checked at: 2026-06-20T22:18:07Z
- Owner: 11 SPM (Soar Product Manager)
- Mode: operator access binding verification / read-only production status
- Scope: Soar Coolify project and production environment

## Result

Status: verified read-only.

[LUC-4413](/LUC/issues/LUC-4413) verified that the current Paperclip runner has
the required Soar Coolify read-only production status binding names and can use
them for authenticated Coolify `GET` status reads without exposing secret
values.

No deploy, restart, rebuild, rollback, environment edit, database action,
Redis action, team setting change, account action, protected smoke,
screenshot, raw log capture, raw resource id storage, secret value readback,
raw Coolify object storage, or live-trading action was performed.

## Comment Acknowledgement

The wake comment selected the autonomous local repair/source-control lane. This
heartbeat therefore stayed inside the local Soar workspace, performed read-only
binding verification, wrote a redacted evidence packet, and did not push,
deploy, restart, mutate production, or expose secrets.

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
| `GET /api/v1/projects/{configured-project-id}/{configured-production-environment}` | pass; production environment `production` |
| `GET /api/v1/resources` | pass; `17` visible global resource rows; not release authority |
| `GET /api/v1/deployments` | pass; `0` visible deployment rows |

## Production Environment Projection

| Surface | Count / Names |
| --- | --- |
| Production applications | `6` |
| Production database resources | `1` |
| Production generic services | `0` |
| Canonical production application resources | `soar-api`, `soar-web`, `workers-backtest`, `workers-execution`, `workers-market-data`, `workers-market-stream` |
| Global visible Coolify resources | `17` |
| Visible deployment rows | `0` |
| Application inventory status | `running:unknown` for six application rows |
| Database inventory status | present; status projected as `unknown` in this redacted readback |

## Validation

| Check | Result |
| --- | --- |
| Names-only Coolify binding scan | pass; required variable names present, values not printed |
| Authenticated Coolify project/environment readback | pass; selector `LuckySparrow`, project `Soar`, production environment `production` |
| Deploy status endpoint readback | pass; `0` visible deployment rows |
| Resource inventory projection | pass; six application resources plus one database resource |
| Mutation check | pass; only `GET` requests were used |
| Local contract tests | `pnpm run -s ops:coolify-stack:env-check:test` pass (`11/11`) |
| Current runner stack-env preflight | expected fail-closed: `pnpm run -s ops:coolify-stack:env-check` reported required present `0/16`; this is a service stack env family, not the Coolify API status binding family verified here |

## Residual Risk

- This proves read-only Coolify production status access, not application
  readiness.
- Zero visible deployment rows means no active deployment was visible in this
  read-only snapshot; it is not proof of a successful auto-redeploy.
- Coolify application inventory status remains `running:unknown`; service
  health must still come from public/protected smoke and worker readiness gates.
- Public route smoke, protected auth smoke, worker readiness, rollback guard,
  SLO evidence, database restore, and release approval remain separate gates.
