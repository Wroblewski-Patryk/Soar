# Service Topology

Last updated: 2026-06-05

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
| postgresql | Coolify standalone PostgreSQL `postgresql` | managed service | persistent volume | private | Coolify resource status `running:healthy` in LUC-2069 readback | Ops Release Lead / DB owner |
| redis | Coolify standalone Redis `redis` | managed service | persistent volume | private | Coolify resource status `running:healthy` in LUC-2069 readback | Ops Release Lead |

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

`LUC-2069` read-only binding refresh: project-scoped Coolify reads at
`2026-06-05T03:20:28Z` still resolve the same eight production-environment
resources. Application inventory status remains `running:unknown`; PostgreSQL
and Redis report `running:healthy`. The global resources endpoint returned
`17` visible rows and remains non-authoritative for deployment scope.

## Maintenance Rule

When a service, worker, queue, provider integration, or storage dependency is
added or changed, update this topology and the environment matrix.
