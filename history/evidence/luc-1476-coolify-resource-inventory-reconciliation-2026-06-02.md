# LUC-1476 Coolify Resource Inventory Reconciliation Evidence

Date: 2026-06-02
Owner: Ops Release Lead
Scope: read-only Coolify production resource inventory reconciliation for Soar

## Wake

- Issue: `LUC-1476` `[Ops][Soar] Reconcile Coolify resource inventory`
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
| Paperclip heartbeat context `GET /api/issues/LUC-1476/heartbeat-context` | pass |
| Names-only Coolify env binding check | pass: required names present; values not printed |
| Coolify project read `GET /api/v1/projects/{configured-project-id}` | pass: resolves to project `Soar` |
| Coolify environment list `GET /api/v1/projects/{configured-project-id}/environments` | pass: `production` present |
| Coolify production environment read `GET /api/v1/projects/{configured-project-id}/production` | pass: production environment present |
| Coolify resources list `GET /api/v1/resources` | pass: `17` total rows visible to read-only token |
| `pnpm run quality:guardrails` | fail: unrelated repository guardrail drift (`812/816` architecture graph coverage, `4` missing; source file size budget exceeded in `apps/api/src/modules/bots/bots.e2e.test.ts` and `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`) |

Fresh redacted readback timestamp: `2026-06-02T09:08:32Z`.

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

- Runtime binding names present: `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, and `COOLIFY_SOAR_PROJECT_ID`.
- `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` are absent in this runner, but not blocking because project-scoped read-only calls succeeded.
- The production environment endpoint exposes PostgreSQL resources under the `postgresqls` collection name.
- Application readiness is not proven by this inventory. Readiness must still be proven through release smoke: API `/health`, API `/ready`, Web `/`, Web `/api/build-info`, and protected `/workers/ready` with an approved read-only principal.
- Inventory reconciliation is complete for this issue; post-push auto-redeploy verification remains a separate deploy/smoke lane.
- Repository guardrails did not pass in this workspace because of pre-existing architecture graph/source-size drift outside the inventory evidence scope. No code or graph files were changed by this task.
