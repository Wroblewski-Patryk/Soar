# LUC-1696 Coolify Resource Inventory Reconciliation

- Checked at: 2026-06-03T14:27:06Z
- Mode: read-only Coolify API projection
- Scope: Soar project, production environment
- Safety: no secret values, resource ids, deploys, restarts, rollback, env edits,
  database actions, team setting changes, protected smoke, or production
  mutation.

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
| Global Soar-relevant safe rows | 9 |
| Global rows matching production environment id | 8 |

## Canonical Production Environment Resources

| Name | Type | Status | Public FQDN present | Restart count | Dockerfile |
| --- | --- | --- | --- | ---: | --- |
| `soar-web` | application | `running:unknown` | yes | 0 | `/apps/web/Dockerfile` |
| `workers-backtest` | application | `running:unknown` | no | 0 | `/apps/api/Dockerfile.worker.backtest` |
| `workers-market-stream` | application | `running:unknown` | no | 0 | `/apps/api/Dockerfile.worker.market-stream` |
| `workers-execution` | application | `running:unknown` | no | 0 | `/apps/api/Dockerfile.worker.execution` |
| `workers-market-data` | application | `running:unknown` | no | 0 | `/apps/api/Dockerfile.worker.market-data` |
| `soar-api` | application | `running:unknown` | yes | 5 | `/apps/api/Dockerfile` |
| `postgresql` | postgresql | `running:healthy` | no | 52 | n/a |
| `redis` | redis | `running:healthy` | no | 682 | n/a |

## Global Resource Reconciliation

The global resources endpoint returned one extra Soar-relevant PostgreSQL
companion row outside the production environment id match:
`postgresql-database-<redacted>`. Treat this as the known global-list
PostgreSQL alias/companion row, not as a ninth production deploy or smoke
target.

## Result

`LUC-1696` is reconciled: Coolify production still has the expected canonical
eight-resource environment inventory, and the resource-by-resource release gate
can use those eight rows as the deploy/status/smoke target list.
