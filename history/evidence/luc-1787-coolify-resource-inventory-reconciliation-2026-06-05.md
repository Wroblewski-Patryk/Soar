# LUC-1787 Coolify Resource Inventory Reconciliation

- Checked at: 2026-06-05T15:27:09Z
- Mode: read-only Coolify API projection
- Scope: Soar project, production environment
- Safety: no secret values, raw resource ids, URLs, labels, deploys, restarts,
  rollback, env edits, database actions, team setting changes, protected smoke,
  account actions, screenshots, or live-trading actions.

## Wake Context

The board/operator refreshed Coolify access and resource inventory refs without
exposing secret values. The actionable change for this heartbeat was to verify
the refreshed access through the Coolify API and update deploy-governor evidence
with an allowlisted resource projection.

## Binding Names

Present by name in this runner without value disclosure:

- `COOLIFY_BASE_URL`
- `COOLIFY_API_TOKEN`
- `COOLIFY_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_API_APP_ID`
- `COOLIFY_SOAR_WEB_APP_ID`

Not materialized under the probed legacy env names in this runner:

- `COOLIFY_SOAR_POSTGRES_ID`
- `COOLIFY_SOAR_REDIS_ID`
- `COOLIFY_SOAR_APP_ID`

This is not an inventory blocker because the authoritative source for release
scope is the Coolify project -> production environment -> resources hierarchy,
not raw resource id disclosure.

## Selector And Project

- Current Coolify team/workspace: id `0`, name `LuckySparrow`
- Project: `Soar`
- Environment: `production`
- Environment id: `6`

## Counts

| Surface | Count |
| --- | ---: |
| Production applications | 6 |
| Production PostgreSQL resources | 1 |
| Production Redis resources | 1 |
| Production generic services | 0 |
| Canonical production-environment resources | 8 |
| Global visible Coolify rows | 17 |

## Canonical Production Environment Resources

| Name | Type | Status | Public FQDN present | Restart count | Dockerfile |
| --- | --- | --- | --- | ---: | --- |
| `soar-api` | application | `running:unknown` | yes | 5 | `/apps/api/Dockerfile` |
| `soar-web` | application | `running:unknown` | yes | 0 | `/apps/web/Dockerfile` |
| `workers-backtest` | application | `running:unknown` | no | 0 | `/apps/api/Dockerfile.worker.backtest` |
| `workers-execution` | application | `running:unknown` | no | 0 | `/apps/api/Dockerfile.worker.execution` |
| `workers-market-data` | application | `running:unknown` | no | 0 | `/apps/api/Dockerfile.worker.market-data` |
| `workers-market-stream` | application | `running:unknown` | no | 0 | `/apps/api/Dockerfile.worker.market-stream` |
| `postgresql` | postgresql | `running:healthy` | no | 52 | n/a |
| `redis` | redis | `running:healthy` | no | 682 | n/a |

## Deploy Governor Result

`LUC-1787` is reconciled: the deploy governor can use the eight
project-scoped production resources above as the resource-by-resource
deploy/status/smoke target list. Legacy single-app-id shortcuts remain
non-authoritative.

Residual risk: Coolify application inventory status remains `running:unknown`
for API, Web, and worker application rows. Worker readiness, queue ownership,
runtime freshness, and log-health remain separate protected-smoke/readiness
gates.
