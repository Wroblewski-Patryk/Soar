# LUC-1584 Coolify Resource Inventory Reconciliation - 2026-06-02

## Scope

Read-only Coolify production inventory reconciliation for Soar.

No deploy, restart, rollback, environment edit, database action, team setting
change, account action, or live trading action was performed.

## Binding Check

- `COOLIFY_BASE_URL`: present by name; value not printed.
- `COOLIFY_API_TOKEN`: present by name; value not printed.
- `COOLIFY_TOKEN`: present by name as compatibility alias; value not printed.
- `COOLIFY_SOAR_PROJECT_ID`: present by name; value not printed.
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`: present by name; value not printed.
- `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID`: absent in this runner; not an
  active blocker while current-team and project-scoped read-only probes pass.

## Read-Only Coolify API Evidence

Captured at `2026-06-02T19:08:59Z`.

| Probe | Result |
| --- | --- |
| `GET /api/v1/teams/current` | pass; current selector id `0`, name `LuckySparrow` |
| `GET /api/v1/projects/{configured-project-id}` | pass; project resolves to `Soar` |
| `GET /api/v1/projects/{configured-project-id}/production` | pass; production environment id `6`, six applications, one PostgreSQL, one Redis |
| `GET /api/v1/resources` | pass; `17` visible resource rows |

## Redacted Production Inventory

| Resource | Coolify type | Status | Public FQDN | Dockerfile |
| --- | --- | --- | --- | --- |
| `soar-api` | application | `running:unknown` | yes | `/apps/api/Dockerfile` |
| `soar-web` | application | `running:unknown` | yes | `/apps/web/Dockerfile` |
| `workers-backtest` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.backtest` |
| `workers-execution` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.execution` |
| `workers-market-data` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.market-data` |
| `workers-market-stream` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.market-stream` |
| `postgresql` | standalone-postgresql | `running:healthy` | no | n/a |
| `redis` | standalone-redis | `running:healthy` | no | n/a |

Count: eight Soar production resources: six applications, one PostgreSQL
resource, and one Redis resource.

## Release Interpretation

- Inventory reconciliation is verified for the Coolify hierarchy
  `project -> production environment -> resources`.
- Application rows expose `running:unknown` at the inventory layer, so
  resource inventory is not a substitute for API/Web/worker readiness smoke.
- Data service rows report `running:healthy`.
- Legacy direct app id aliases are not sufficient release proof; release gates
  must verify all eight resources and then run endpoint/worker readiness proof.

## Safety

- No secret values, tokens, cookies, passwords, database URLs, resource ids, or
  account data were printed or stored.
- No production mutation was executed.
