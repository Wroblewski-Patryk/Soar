# LUC-1473 Coolify Resource Inventory Reconciliation Evidence

Date: 2026-06-02
Owner: Ops Release Lead
Scope: read-only Coolify production resource inventory reconciliation for Soar

## Wake

- Issue: `LUC-1473` `[Ops][Soar] Reconcile Coolify resource inventory`
- Wake reason: `issue_assigned`
- Inline wake payload: `fallbackFetchNeeded=false`, pending comments `0/0`, latest comment id `unknown`
- Latest inline wake data contained no new comment batch, so there was no comment-driven change to acknowledge before the read-only inventory action.
- Issue status at heartbeat-context read: `in_progress`
- Checkout note: the harness had already claimed checkout for this run, so checkout was not repeated.

## Safety Boundary

- No secret values were printed, copied to files, or committed.
- No deploy, restart, rollback, env edit, database action, team setting change, account action, or live trading action was performed.
- Resource ids, direct URLs, internal connection URLs, labels, and server/proxy settings are treated as secret-adjacent and are not recorded here.

## Commands And Proof

| Check | Result |
| --- | --- |
| Paperclip heartbeat context `GET /api/issues/LUC-1473/heartbeat-context` | pass |
| Names-only Coolify env binding check | pass: required names present; values not printed |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass: resolves to project `Soar` |
| Coolify environment list `GET /api/v1/projects/{configured-project-id}/environments` | pass: `production` present |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/production` | pass: production environment present |
| Coolify resources list `GET /api/v1/resources` | pass: `17` total rows visible to read-only token |

Fresh redacted readback timestamp: `2026-06-02T09:03:08Z`.

## Redacted Inventory

| Resource | Type | Inventory status | Public FQDN | Dockerfile |
| --- | --- | --- | --- | --- |
| `soar-api` | application | `running:unknown` | yes | `/apps/api/Dockerfile` |
| `soar-web` | application | `running:unknown` | yes | `/apps/web/Dockerfile` |
| `workers-backtest` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.backtest` |
| `workers-execution` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.execution` |
| `workers-market-data` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.market-data` |
| `workers-market-stream` | application | `running:unknown` | no | `/apps/api/Dockerfile.worker.market-stream` |
| `postgresql` | postgresql | `running:healthy` | no | n/a |
| `redis` | redis | `running:healthy` | no | n/a |

Count: eight Soar production resources: six applications, one PostgreSQL resource, and one Redis resource.

## Notes

- The production environment endpoint exposes PostgreSQL resources under the `postgresqls` collection name.
- The fresh application projection did not expose Dockerfile fields; Dockerfile paths above are retained from the existing deployment contract and local Coolify-oriented Dockerfile inventory.
- Application inventory status remains `running:unknown` at the Coolify inventory layer. Application readiness must be proven separately through release smoke: API `/health`, API `/ready`, Web `/`, Web `/api/build-info`, and protected `/workers/ready` with an approved read-only principal.
- Inventory reconciliation is complete for this issue; post-push auto-redeploy verification remains a separate deploy/smoke lane.
