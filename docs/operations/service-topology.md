# Service Topology

Last updated: 2026-06-11

## Purpose

Map runtime services, dependencies, ports, queues, jobs, storage, and health
surfaces.

## Services

| Service | Runtime | Path / image | Depends on | Exposes | Health/readiness | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| web | Coolify application `soar-web` | `/apps/web/Dockerfile` | api | `https://soar.luckysparrow.ch` | `/`, `/api/build-info` | Ops Release Lead |
| api | Coolify application `soar-api` | `/apps/api/Dockerfile` | postgresql, redis, external providers | `https://api.soar.luckysparrow.ch` | `/health`, `/ready`, protected `/workers/ready` | Ops Release Lead |
| workers-backtest | Coolify application `workers-backtest` | `/apps/api/Dockerfile.worker.backtest` | postgresql, redis | private | worker freshness through protected readiness | Ops Release Lead |
| workers-execution | Coolify application `workers-execution` | `/apps/api/Dockerfile.worker.execution` | postgresql, redis, exchange APIs | private | worker freshness through protected readiness | Ops Release Lead |
| workers-market-data | Coolify application `workers-market-data` | `/apps/api/Dockerfile.worker.market-data` | postgresql, redis, market-data providers | private | worker freshness through protected readiness | Ops Release Lead |
| workers-market-stream | Coolify application `workers-market-stream` | `/apps/api/Dockerfile.worker.market-stream` | postgresql, redis, exchange stream APIs | private | worker freshness through protected readiness | Ops Release Lead |
| postgresql | Coolify standalone PostgreSQL `postgresql` | managed service | persistent volume | private | Coolify resource status `running:healthy` in LUC-2264 readback | Ops Release Lead / DB owner |
| redis | Coolify standalone Redis `redis` | managed service | persistent volume | private | Coolify resource status `running:healthy` in LUC-2264 readback | Ops Release Lead |

## Dependency Graph

```text
user -> web -> api -> database
api -> queue -> worker -> external provider
```

Production Coolify inventory is verified as a resource hierarchy:

```text
Coolify Soar project -> production environment id 6
  -> soar-web
  -> soar-api
  -> workers-backtest
  -> workers-execution
  -> workers-market-data
  -> workers-market-stream
  -> postgresql
  -> redis
```

`LUC-1696` reconciliation note: the global Coolify resources endpoint still
exposes one redacted `postgresql-database-*` companion row. Treat that as a
global-list PostgreSQL alias/companion row, not as an additional
production-environment deployable resource. The canonical production
environment inventory remains the eight rows above.

`LUC-2153` split-worker topology proof reconciliation: latest read-only
project-scoped Coolify evidence from `LUC-2149` at `2026-06-05T09:52:00Z`
still resolves the same eight production-environment resources. This verifies
the production resource topology has four separate worker applications:
`workers-market-data`, `workers-market-stream`, `workers-backtest`, and
`workers-execution`. It does not by itself verify protected worker readiness or
runtime freshness because application inventory status remains
`running:unknown`; PostgreSQL and Redis report `running:healthy`. The global
resources endpoint returned `17` visible rows and remains non-authoritative for
deployment scope.

`LUC-1787` resource inventory reconciliation: latest read-only project-scoped
Coolify evidence from `2026-06-05T15:27:09Z` still resolves the same eight
production-environment resources under selector `LuckySparrow`, project
`Soar`, production environment `production` id `6`. The deploy governor should
use this project/environment inventory as the resource-by-resource target list.
Application rows report `running:unknown`; PostgreSQL and Redis report
`running:healthy`. No raw resource ids, secret values, URLs, labels, deploys,
restarts, rollbacks, env edits, database actions, team/account changes,
protected smoke, screenshots, or live-trading actions were performed.

`LUC-2264` read-only production status access refresh: latest project-scoped
Coolify evidence from `2026-06-05T18:53:12Z` reconfirmed selector
`LuckySparrow`, project `Soar`, production environment `production`, six
applications, PostgreSQL, Redis, zero generic services, `17` visible global
resource rows, and the same eight canonical production-environment resources.
Team selector bindings `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` were
present by name without values printed. The teams list endpoint returned `0`
rows in this runner, but current selector and project-scoped reads succeeded.
Application rows still report `running:unknown`; PostgreSQL and Redis report
`running:healthy`. This remains read-only topology/status evidence only;
protected smoke and deploy mutation readiness are separate release gates.

`LUC-3578` resource inventory reconciliation: latest project-scoped Coolify
evidence from `2026-06-11T20:10:21Z` reconfirmed selector `LuckySparrow`,
project `Soar`, the configured production environment binding, production
environment id `6`, six
applications, PostgreSQL, Redis, zero generic services, `17` visible global
resource rows, `0` active deployment rows, and the same eight canonical
production-environment resources. Application rows still report
`running:unknown`; PostgreSQL and Redis report `running:healthy`.
`workers-execution` retains restart metadata (`restartCount=2`). This closes
the stale inventory issue for downstream resource-by-resource deploy/status
verification, but it is not a deploy, restart, rollback, protected-smoke, or
release approval.

## Maintenance Rule

When a service, worker, queue, provider integration, or storage dependency is
added or changed, update this topology and the environment matrix.
