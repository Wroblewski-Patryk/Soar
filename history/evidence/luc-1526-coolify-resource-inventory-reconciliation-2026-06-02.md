# LUC-1526 Coolify Resource Inventory Reconciliation Evidence

Date: 2026-06-02
Owner: Ops Release Lead
Scope: read-only Coolify production resource inventory reconciliation for Soar

## Wake

- Issue: `LUC-1526` `[Ops][Soar] Reconcile Coolify resource inventory`
- Wake reason: `issue_assigned`
- Inline wake payload: `fallbackFetchNeeded=false`, pending comments `0/0`, latest comment id `unknown`
- The inline wake data contained no new comment batch, so there was no product or operator comment to change the read-only inventory action.
- Checkout was already claimed by the harness and was not repeated.

## Safety Boundary

- No secret values were printed, copied to files, or committed.
- No deploy, restart, rollback, env edit, database action, team setting change, account action, or live trading action was performed.
- Resource ids, direct URLs, internal connection URLs, labels, and server/proxy settings are treated as secret-adjacent and are not recorded here.

## Commands And Proof

| Check | Result |
| --- | --- |
| Paperclip heartbeat context `GET /api/issues/LUC-1526/heartbeat-context` | pass |
| Names-only Coolify env binding check | pass: required names present; values not printed |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass: `200`, resolves to project `Soar` |
| Coolify environment list `GET /api/v1/projects/{configured-project-id}/environments` | pass: `200`, `production` present |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/production` | pass: `200`, `6` applications, `1` PostgreSQL, `1` Redis |
| Coolify resources list `GET /api/v1/resources` | pass: `200`, `17` total rows visible to read-only token |

Fresh redacted readback timestamp: `2026-06-02T15:09:05Z`.

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

- `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, and `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT` are present by name in this runner.
- `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but project-scoped reads succeeded, so that is not an active blocker for this inventory reconciliation.
- The production environment endpoint exposes PostgreSQL resources under the `postgresqls` collection name.
- The production environment endpoint did not expose Dockerfile fields in this projection, so Dockerfile paths remain the previously documented resource contract rather than new API output.
- Application readiness must be proven separately through release smoke: API `/health`, API `/ready`, Web `/`, Web `/api/build-info`, and protected `/workers/ready` with an approved read-only principal.
- Inventory reconciliation is complete for this issue; post-push auto-redeploy verification remains a separate deploy/smoke lane.
