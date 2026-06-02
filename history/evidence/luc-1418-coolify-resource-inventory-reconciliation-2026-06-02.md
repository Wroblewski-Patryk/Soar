# LUC-1418 Coolify Resource Inventory Reconciliation

- Issue: `LUC-1418`
- Title: `[Ops][Soar] Reconcile Coolify resource inventory`
- Date: 2026-06-02
- Owner: Ops Release Lead
- Stage: verification
- Status: verified

## Scope

Refresh the Soar production Coolify resource inventory through authenticated
read-only Coolify API access and reconcile the result against operations source
truth. No deploy, restart, rollback, environment edit, database action, account
mutation, or secret readback was performed.

## Read-Only API Evidence

Fresh redacted Coolify API projection captured at `2026-06-02T05:19:13Z`.

- Required binding names were present without printing values:
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
  `COOLIFY_SOAR_PROJECT_ID`, and `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`.
- `GET /api/v1/projects/{configured-project-id}` succeeded and resolved to
  project `Soar`.
- `GET /api/v1/projects/{configured-project-id}/environments` succeeded.
- `GET /api/v1/projects/{configured-project-id}/production` succeeded.
- `GET /api/v1/resources` succeeded and returned `17` total rows.
- Production environment id: `6`.
- Redacted Soar production resource count: `8`.

## Reconciled Inventory

| Type | Name | Status | Public FQDN | Verification role |
| --- | --- | --- | --- | --- |
| application | `soar-api` | `running:unknown` | yes | API public/protected readiness |
| application | `soar-web` | `running:unknown` | yes | Web route and build-info |
| application | `workers-backtest` | `running:unknown` | no | Backtest worker liveness |
| application | `workers-execution` | `running:unknown` | no | Execution worker liveness |
| application | `workers-market-data` | `running:unknown` | no | Market-data worker liveness |
| application | `workers-market-stream` | `running:unknown` | no | Market-stream worker liveness |
| standalone-postgresql | `postgresql` | `running:healthy` | no | Production database dependency |
| standalone-redis | `redis` | `running:healthy` | no | Cache/queue dependency |

## Result

Implemented and verified: Soar production Coolify inventory still resolves to
eight resources under the Soar project production environment: six applications
plus PostgreSQL and Redis. There is no inventory drift from the prior LUC-1416
readback or the earlier LUC-1418 process-lost attempt.

## Residual Risk

- Coolify inventory status is not full application readiness. Public
  `/health`, `/ready`, Web `/`, Web `/api/build-info`, protected
  `/workers/ready`, and worker freshness remain separate release gates.
- Resource UUIDs and secret/config values were intentionally omitted from
  repository evidence. Operators must use approved secret bindings for any
  mutation or per-resource log action.

## Safety

- No secret values, resource UUIDs, database URLs, labels, proxy config,
  cookies, tokens, or environment values were stored.
- No production mutation was performed.
