# LUC-1402 Coolify Resource Inventory Reconciliation

- Issue: `LUC-1402`
- Title: `[Ops][Soar] Reconcile Coolify resource inventory`
- Date: 2026-06-02
- Owner: Ops Release Lead
- Stage: verification
- Status: verified

## Scope

Reconcile the Soar production Coolify resource inventory using read-only
Coolify API access and update operations source truth. No deploy, restart,
rollback, environment edit, database action, account mutation, or secret
readback was performed.

## Wake Context

- Wake reason: `issue_continuation_needed`.
- Inline wake payload used first.
- Pending comments: `0/0`.
- Fallback fetch needed: no.
- Issue state at heartbeat start: `blocked` in API context with no
  first-class blockers.
- Latest issue comment was a live-run janitor note cancelling a duplicate owner
  run and saying the kept owner lane should finish or hand off. This heartbeat
  handled the kept owner lane.

## Read-Only API Evidence

Fresh redacted Coolify API projection captured at `2026-06-02T03:24:56Z`.

- `GET /api/v1/projects/{configured-project-id}` succeeded.
- `GET /api/v1/projects/{configured-project-id}/environments` succeeded.
- `GET /api/v1/projects/{configured-project-id}/production` succeeded.
- `GET /api/v1/resources` succeeded.
- Production environment id: `6`.
- Redacted production resource count: `8`.

Compatibility note: the first PowerShell projection attempt failed before any
network call because this runner's PowerShell parser does not support the
`??` null-coalescing operator. The command was rerun with a compatible
`First-Prop` helper and passed.

## Reconciled Inventory

| Type | Name | Status | Dockerfile | Public FQDN | Restart Count | Last Online | Server Status | Verification role |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| application | `soar-api` | `running:unknown` | `/apps/api/Dockerfile` | yes | 5 | `2026-06-02 03:24:17` | true | API public/protected readiness |
| application | `soar-web` | `running:unknown` | `/apps/web/Dockerfile` | yes | 0 | `2026-06-02 03:24:17` | true | Web route and build-info |
| application | `workers-backtest` | `running:unknown` | `/apps/api/Dockerfile.worker.backtest` | no | 0 | `2026-06-02 03:24:17` | true | Backtest worker liveness |
| application | `workers-execution` | `running:unknown` | `/apps/api/Dockerfile.worker.execution` | no | 0 | `2026-06-02 03:24:17` | true | Execution worker liveness |
| application | `workers-market-data` | `running:unknown` | `/apps/api/Dockerfile.worker.market-data` | no | 0 | `2026-06-02 03:24:17` | true | Market-data worker liveness |
| application | `workers-market-stream` | `running:unknown` | `/apps/api/Dockerfile.worker.market-stream` | no | 0 | `2026-06-02 03:24:17` | true | Market-stream worker liveness |
| standalone-postgresql | `postgresql` | `running:healthy` | n/a | no | 52 | `2026-06-02 03:24:17` | true | Production database dependency |
| standalone-redis | `redis` | `running:healthy` | n/a | no | 682 | `2026-06-02 03:24:17` | true | Cache/queue dependency |

## Source Truth Updated

- `docs/operations/coolify-vps-deployment-contract.md`
- `docs/operations/service-topology.md`
- `docs/operations/runtime-config-ledger.csv`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Result

Implemented and verified: Soar production Coolify inventory is eight resources
under the Soar project production environment: six deployable applications plus
PostgreSQL and Redis. Post-push verification must remain resource-by-resource;
one legacy `COOLIFY_SOAR_APP_ID` style alias is not sufficient for release
proof.

## Residual Risk

- Coolify application inventory status is not full app readiness. Public
  `/health`, `/ready`, Web `/`, Web `/api/build-info`, protected
  `/workers/ready`, and worker freshness remain separate release gates.
- Resource UUIDs and secret/config values were intentionally omitted from
  repository evidence. Operators must use approved secret bindings for any
  mutation or per-resource log action.

## Safety

- No secret values, resource UUIDs, database URLs, labels, proxy config,
  cookies, tokens, or environment values were stored.
- No production mutation was performed.
