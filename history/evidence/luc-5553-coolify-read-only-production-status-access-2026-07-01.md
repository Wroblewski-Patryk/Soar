# LUC-5553 Coolify Read-Only Production Status Access

Date: 2026-07-01

## Scope

Operator read-only Coolify production status access check for Soar.

No deploy, push, restart, rollback, environment edit, direct secret readback,
database/Redis mutation, production account mutation, exchange/payment
mutation, order, position, subscription mutation, live-trading action, raw
Coolify object storage, or log-body capture was performed.

## Wake Context

The latest Paperclip wake comment selected an autonomous local
repair/source-control closure lane. It explicitly allowed local repository
inspection, relevant validation, and a local commit when evidence supports
closure, while keeping push, deploy, production restart, protected smoke/live
account mutation, and secret disclosure forbidden.

## Source Snapshot

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Branch: `main`
- Worktree before this heartbeat: dirty from unrelated active lanes, including
  code, docs, history, context, and agent-state files.
- Files intentionally added by this heartbeat:
  - `history/evidence/luc-5553-coolify-read-only-production-status-access-2026-07-01.md`
  - `history/tasks/luc-5553-operator-coolify-bind-read-only-production-status-access-2026-07-01-task.md`

## Binding Names

Names-only environment scan found the Coolify status binding family present.
No values were printed or stored.

- `COOLIFY_BASE_URL`: present
- `COOLIFY_API_TOKEN`: present
- `COOLIFY_TOKEN`: present
- `COOLIFY_SOAR_PROJECT_ID`: present
- `COOLIFY_SOAR_TEAM_ID`: present
- `COOLIFY_TEAM_ID`: present
- `COOLIFY_SOAR_API_APP_ID`: present
- `COOLIFY_SOAR_WEB_APP_ID`: present
- `COOLIFY_SOAR_POSTGRES_RESOURCE_ID`: present
- `COOLIFY_SOAR_REDIS_RESOURCE_ID`: present

## Read-Only Coolify GET Proof

Command class: process-local Node `fetch` script using existing environment
bindings and allowlisted summary output only.

Result: `PASS`

- checked at `2026-06-30T23:45:27.249Z`
- `GET /api/v1/version`: `200`
- `GET /api/v1/teams`: `200`
- `GET /api/v1/teams/current`: `200`
- `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}`: `200`
- `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}/environments`: `200`
- `GET /api/v1/projects/{COOLIFY_SOAR_PROJECT_ID}/production`: `200`
- `GET /api/v1/resources`: `200`

Redacted projection:

- current team selector: id `0`, name `LuckySparrow`
- configured project resolved to `Soar`
- environments included `production`
- visible resource rows: `17`
- production counts: `6` applications, `1` PostgreSQL, `1` Redis

Production resource status:

| Kind | Resource | Status |
| --- | --- | --- |
| application | `soar-api` | `running:unknown` |
| application | `soar-web` | `exited:unhealthy` |
| application | `workers-backtest` | `exited:unhealthy` |
| application | `workers-execution` | `running:unknown` |
| application | `workers-market-data` | `running:unknown` |
| application | `workers-market-stream` | `running:unknown` |
| postgresql | `postgresql` | `running:healthy` |
| redis | `redis` | `running:healthy` |

## Diagnosis

LUC-5553's binding objective is satisfied for read-only production status
access: this runner can authenticate to Coolify, resolve the expected Soar
project/environment, list production resource collections, and read current
resource status without mutating Coolify.

The unhealthy `soar-web` and `workers-backtest` statuses are not fixed by this
operator-access task. They remain production restoration work for the
Ops/Coolify mutation owner path already represented by [LUC-6331](/LUC/issues/LUC-6331)
and recent read-only deploy-health sweeps.

## Disposition

`DONE / COOLIFY_READ_ONLY_STATUS_ACCESS_BOUND / PRODUCTION_PROJECTION_READABLE /
NO_PRODUCTION_MUTATION`.

## Residual Risk

- This proof confirms read-only Coolify status access, not application
  readiness.
- `soar-web` and `workers-backtest` remain `exited:unhealthy`; restoring them
  requires a separately approved production mutation path.
- The repository remains dirty from unrelated lanes, so push/deploy remains
  forbidden from this heartbeat.
