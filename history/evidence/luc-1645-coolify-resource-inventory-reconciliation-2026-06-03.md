# LUC-1645 Coolify Resource Inventory Reconciliation - 2026-06-03

## Scope

Read-only Coolify production resource inventory reconciliation for Soar.

No deploy, restart, rollback, environment edit, database action, team setting
change, account action, secret readback, or live trading action was performed.

## Binding Check

- `PAPERCLIP_API_URL`: present by name; value not printed.
- `PAPERCLIP_API_KEY`: present by name; value not printed.
- `COOLIFY_BASE_URL`: present by name; value not printed.
- `COOLIFY_API_TOKEN`: present by name; value not printed.
- `COOLIFY_TOKEN`: present by name as compatibility alias; value not printed.
- `COOLIFY_SOAR_PROJECT_ID`: present by name; value not printed.
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`: present by name; value not printed.
- `COOLIFY_SOAR_API_APP_ID`: present by name; not used as source truth.
- `COOLIFY_SOAR_WEB_APP_ID`: present by name; not used as source truth.

## Read-Only Coolify API Evidence

Captured at `2026-06-03T03:07:02Z`.

| Probe | Result |
| --- | --- |
| `GET /api/issues/LUC-1645/heartbeat-context` | pass; issue `LUC-1645` read back as `in_progress`, priority `critical`, zero first-class blockers |
| Names-only env binding check | pass; required Paperclip and Coolify binding names present without values printed |
| `GET /api/v1/teams/current` | pass; current selector id `0`, name `LuckySparrow` |
| `GET /api/v1/teams` | pass; two teams visible |
| `GET /api/v1/projects/{configured-project-id}` | pass; project resolves to `Soar` |
| `GET /api/v1/projects/{configured-project-id}/environments` | pass; single environment `production` present |
| `GET /api/v1/projects/{configured-project-id}/production` | pass; six applications, one PostgreSQL, one Redis, zero generic services |
| `GET /api/v1/resources` | pass; `17` visible rows; `8` rows match the production environment id, and `9` Soar-relevant global rows match the allowlisted name/type projection because Coolify exposes both `postgresql` and one redacted PostgreSQL companion row |

Current heartbeat recheck at `2026-06-03T03:08:47Z` confirmed the same
canonical production-environment count through read-only Coolify API:
six applications, one PostgreSQL resource, one Redis resource, zero generic
services, and no missing expected canonical resource names. The recheck used
the Coolify environment response fields `applications`, `postgresqls`, and
`redis`; no secret values or raw resource ids were printed.

## Redacted Production Environment Inventory

| Resource | Coolify type | Status | Public FQDN | Dockerfile expectation |
| --- | --- | --- | --- | --- |
| `soar-api` | application | `running:unknown` | yes | `/apps/api/Dockerfile` |
| `soar-web` | application | `running:unknown` | yes | `/apps/web/Dockerfile` |
| `workers-backtest` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.backtest` |
| `workers-execution` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.execution` |
| `workers-market-data` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.market-data` |
| `workers-market-stream` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.market-stream` |
| `postgresql` | standalone-postgresql | `running:healthy` | no | n/a |
| `redis` | standalone-redis | `running:healthy` | no | n/a |

Count: eight canonical Soar production-environment resources: six
applications, one PostgreSQL resource, and one Redis resource.

The fresh Coolify production-environment response returned null application
`dockerfile` fields in this projection, so Dockerfile values above are recorded
as documented topology expectations from `docs/operations/service-topology.md`
and `docs/operations/coolify-linux-vps-setup-guide.md`, not as fresh API field
readback.

## Operational Notes

- PostgreSQL reports `running:healthy` with restart count `52`.
- Redis reports `running:healthy` with restart count `682`.
- `soar-api` reports restart count `5`.
- Web and worker application rows did not expose restart counts in the
  production-environment projection used for this readback.
- Restart history remains a production reliability watch item for later
  smoke/SLO review, not an inventory blocker.

## Global Resource Reconciliation

The global resources endpoint returned nine Soar-relevant rows in the
allowlisted all-resource projection:

- the six production applications listed above;
- `redis`;
- `postgresql`;
- one `postgresql-database-*` PostgreSQL companion row with the generated
  suffix redacted.

Release interpretation: the production environment endpoint remains the
canonical resource-by-resource deploy/smoke target and contains one PostgreSQL
resource. The extra global PostgreSQL row remains a Coolify global-list
alias/companion row for reconciliation, not an additional Soar deployable
application or a ninth production-environment smoke target.

## Release Interpretation

- Inventory reconciliation is verified for the Coolify hierarchy
  `project -> production environment -> resources`.
- Application rows expose `running:unknown` at the inventory layer, so resource
  inventory is not a substitute for API/Web/worker readiness smoke.
- Data service rows report `running:healthy`.
- Legacy direct app id aliases remain insufficient release proof; release gates
  must verify all eight production-environment resources and then run
  endpoint/worker readiness proof.

## Safety

- No secret values, tokens, cookies, passwords, database URLs, account data, or
  raw resource ids were printed or stored.
- No production mutation was executed.
