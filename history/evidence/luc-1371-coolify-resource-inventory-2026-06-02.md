# LUC-1371 Coolify Resource Inventory

- Issue: `LUC-1371`
- Title: `[Ops][Soar] Reconcile Coolify resource inventory`
- Date: 2026-06-02
- Owner: Ops Release Lead
- Stage: verification
- Status: verified

## Scope

Read-only Coolify API reconciliation for the Soar production project/environment.
No deploy, restart, rollback, environment edit, database action, or account
mutation was performed.

## Safety

- Secret values were not stored in this artifact.
- Resource UUIDs are not stored in this artifact.
- Database URLs, tokens, labels, proxy configuration, and environment values are
  excluded.
- Output below is allowlisted to resource name, type, status, branch, Dockerfile,
  public-FQDN presence, last-online timestamp, restart count, and server status.

## Coolify Readback

- Coolify project list contained project `Soar`.
- Configured `COOLIFY_SOAR_PROJECT_ID` did not match the API-listed Soar project
  UUID in this runner; the listed `Soar` project UUID was used for read-only
  reconciliation.
- Environment: `production`
- Environment UUID: redacted
- Checked at: `2026-06-02T01:24:55Z`

## Resource Inventory

| Type | Name | Status | Branch | Dockerfile | Public FQDN Present | Last Online | Restart Count | Server Status |
| --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| application | `soar-api` | `running:unknown` | `main` | `/apps/api/Dockerfile` | yes | `2026-06-02 01:24:15` | 5 | true |
| application | `soar-web` | `running:unknown` | `main` | `/apps/web/Dockerfile` | yes | `2026-06-02 01:24:15` | 0 | true |
| application | `workers-backtest` | `running:unknown` | `main` | `/apps/api/Dockerfile.worker.backtest` | no | `2026-06-02 01:24:15` | 0 | true |
| application | `workers-execution` | `running:unknown` | `main` | `/apps/api/Dockerfile.worker.execution` | no | `2026-06-02 01:24:15` | 0 | true |
| application | `workers-market-data` | `running:unknown` | `main` | `/apps/api/Dockerfile.worker.market-data` | no | `2026-06-02 01:24:15` | 0 | true |
| application | `workers-market-stream` | `running:unknown` | `main` | `/apps/api/Dockerfile.worker.market-stream` | no | `2026-06-02 01:24:15` | 0 | true |
| postgresql | `postgresql` | `running:healthy` | n/a | n/a | no | `2026-06-02 01:24:15` | 52 | true |
| redis | `redis` | `running:healthy` | n/a | n/a | no | `2026-06-02 01:24:15` | 682 | true |

## Counts

| Category | Count |
| --- | ---: |
| Applications | 6 |
| Services | 0 |
| PostgreSQL | 1 |
| Redis | 1 |
| Total | 8 |

## Result

The production resource inventory is reconciled as eight resources: six
applications plus Postgres and Redis. This supports resource-by-resource
post-push verification instead of a single legacy app-id check.

## Residual Risk

- `running:unknown` is Coolify status readback, not application-level readiness.
  Post-push verification still needs route/resource-specific smoke evidence.
- `COOLIFY_SOAR_PROJECT_ID` binding drift remains: the configured value in this
  runner did not match the API-listed `Soar` project UUID. Ops/Security should
  refresh the Paperclip secret binding before using project-scoped automation.
