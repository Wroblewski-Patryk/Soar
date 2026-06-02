# LUC-1405 Coolify Resource Inventory Reconciliation

- Issue: `LUC-1405`
- Title: `[Ops][Soar] Reconcile Coolify resource inventory`
- Date: 2026-06-02
- Owner: Ops Release Lead
- Stage: verification
- Status: verified

## Scope

Refresh the Soar production Coolify resource inventory through authenticated
read-only Coolify API access and reconcile this issue against the operations
source of truth. No deploy, restart, rollback, environment edit, database
action, account mutation, or secret readback was performed.

## Wake Context

- Wake reason: `issue_assigned`.
- Inline wake payload used first.
- Pending comments: `0/0`.
- Fallback fetch needed: no.
- Harness had already checked out the issue; checkout was not repeated.
- Issue state at heartbeat start: `in_progress` with no first-class blockers.

## Read-Only API Evidence

Fresh redacted Coolify API projection captured at `2026-06-02T03:34:19Z`.

- Required binding names were present without printing values:
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`,
  `COOLIFY_SOAR_PROJECT_ID`, and `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`.
- `GET /api/v1/projects/{configured-project-id}` succeeded and resolved to
  project `Soar`.
- `GET /api/v1/projects/{configured-project-id}/environments` succeeded.
- `GET /api/v1/projects/{configured-project-id}/production` succeeded.
- `GET /api/v1/resources` succeeded and returned `17` total rows.
- Production environment id: `6`.
- Redacted Soar production resource count: `8`.

## Reconciled Inventory

| Type | Name | Status | Branch | Dockerfile | Public FQDN | Restart Count | Last Online | Server Status | Verification role |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| application | `soar-api` | `running:unknown` | `main` | `/apps/api/Dockerfile` | yes | 5 | `2026-06-02 03:34:15` | true | API public/protected readiness |
| application | `soar-web` | `running:unknown` | `main` | `/apps/web/Dockerfile` | yes | 0 | `2026-06-02 03:34:15` | true | Web route and build-info |
| application | `workers-backtest` | `running:unknown` | `main` | `/apps/api/Dockerfile.worker.backtest` | no | 0 | `2026-06-02 03:34:15` | true | Backtest worker liveness |
| application | `workers-execution` | `running:unknown` | `main` | `/apps/api/Dockerfile.worker.execution` | no | 0 | `2026-06-02 03:34:15` | true | Execution worker liveness |
| application | `workers-market-data` | `running:unknown` | `main` | `/apps/api/Dockerfile.worker.market-data` | no | 0 | `2026-06-02 03:34:15` | true | Market-data worker liveness |
| application | `workers-market-stream` | `running:unknown` | `main` | `/apps/api/Dockerfile.worker.market-stream` | no | 0 | `2026-06-02 03:34:15` | true | Market-stream worker liveness |
| standalone-postgresql | `postgresql` | `running:healthy` | n/a | n/a | no | 52 | `2026-06-02 03:34:15` | true | Production database dependency |
| standalone-redis | `redis` | `running:healthy` | n/a | n/a | no | 682 | `2026-06-02 03:34:15` | true | Cache/queue dependency |

## Result

Implemented and verified: Soar production Coolify inventory is eight resources
under the Soar project production environment: six applications plus PostgreSQL
and Redis. Future post-push verification must remain resource-by-resource; one
legacy app id is not sufficient for release proof.

## Residual Risk

- Coolify application inventory status is not full application readiness.
  Public `/health`, `/ready`, Web `/`, Web `/api/build-info`, protected
  `/workers/ready`, and worker freshness remain separate release gates.
- Resource UUIDs and secret/config values were intentionally omitted from
  repository evidence. Operators must use approved secret bindings for any
  mutation or per-resource log action.

## Safety

- No secret values, resource UUIDs, database URLs, labels, proxy config,
  cookies, tokens, or environment values were stored.
- No production mutation was performed.
