# LUC-1399 Coolify Resource Inventory Reconciliation

- Issue: `LUC-1399`
- Title: `[Ops][Soar] Reconcile Coolify resource inventory`
- Date: 2026-06-02
- Owner: Ops Release Lead
- Stage: verification
- Status: verified

## Scope

Reconcile the active issue with the existing redacted Coolify production
inventory evidence, refresh the read-only Coolify API projection, and promote
the result into operations source truth. No deploy, restart, rollback,
environment edit, database action, or account mutation was performed.

## Wake Context

- Wake reason: `issue_assigned`
- Inline payload used first.
- Pending comments: `0/0`
- Fallback fetch needed: no
- Issue state at heartbeat start: `blocked` with no first-class blockers.
- Latest issue comment was a live-run janitor note saying a duplicate owner run
  was cancelled and the kept owner lane should finish or hand off. This run
  handled that kept owner lane and did not repeat checkout.

## Evidence Used

- Redacted Coolify API inventory:
  `history/evidence/luc-1371-coolify-resource-inventory-2026-06-02.md`
- LUC-1371 task packet:
  `history/tasks/luc-1371-soar-coolify-resource-inventory-2026-06-02-task.md`
- Fresh read-only Coolify API refresh at `2026-06-02T03:19:44Z`:
  - `GET /api/v1/projects/{configured-project-id}` succeeded.
  - `GET /api/v1/projects/{configured-project-id}/environments` succeeded.
  - `GET /api/v1/projects/{configured-project-id}/production` succeeded.
  - `GET /api/v1/resources` succeeded and produced the allowlisted projection
    below.
- Operations source-of-truth updated:
  `docs/operations/coolify-vps-deployment-contract.md`

## Reconciled Inventory

| Type | Name | Status | Dockerfile | Public FQDN | Restart Count | Verification role |
| --- | --- | --- | --- | --- | ---: | --- |
| application | `soar-api` | `running:unknown` | `/apps/api/Dockerfile` | yes | 5 | API public/protected readiness |
| application | `soar-web` | `running:unknown` | `/apps/web/Dockerfile` | yes | 0 | Web route and build-info |
| application | `workers-backtest` | `running:unknown` | `/apps/api/Dockerfile.worker.backtest` | no | 0 | Backtest worker liveness |
| application | `workers-execution` | `running:unknown` | `/apps/api/Dockerfile.worker.execution` | no | 0 | Execution worker liveness |
| application | `workers-market-data` | `running:unknown` | `/apps/api/Dockerfile.worker.market-data` | no | 0 | Market-data worker liveness |
| application | `workers-market-stream` | `running:unknown` | `/apps/api/Dockerfile.worker.market-stream` | no | 0 | Market-stream worker liveness |
| standalone-postgresql | `postgresql` | `running:healthy` | n/a | no | 52 | Production database dependency |
| standalone-redis | `redis` | `running:healthy` | n/a | no | 682 | Cache/queue dependency |

Last online readback for all eight production resources was
`2026-06-02 03:19:14`; server status was `true` for each row.

## Result

Implemented and verified: Soar production resource inventory is eight
resources in production environment id `6`: six Coolify applications plus
PostgreSQL and Redis. Future post-push deploy verification must check resources
individually rather than using one legacy app id.

## Residual Risk

- The existing inventory records Coolify application status, not full
  app-level readiness. Protected `/workers/ready` and worker freshness checks
  remain separate release evidence.
- The earlier LUC-1371 runner recorded `COOLIFY_SOAR_PROJECT_ID` binding drift.
  That drift was not reproduced in this heartbeat: configured project lookup
  and production environment lookup both succeeded. Keep this as a watch item
  for future runners rather than an active blocker for this inventory.

## Safety

- No secret values, resource UUIDs, database URLs, labels, proxy config,
  cookies, tokens, or environment values were stored.
- No production mutation was performed.
