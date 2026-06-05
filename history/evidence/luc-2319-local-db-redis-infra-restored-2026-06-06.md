# LUC-2319 Local DB/Redis Infra Restored Evidence

Date: 2026-06-06

## Summary

Local Soar Postgres and Redis infra is restored for DB-backed API e2e tests.
The previous Prisma connection blocker is cleared. The focused aggregate e2e
now reaches the runtime aggregate endpoint and fails on a product/backend
assertion, not local infra.

## Commands And Results

| Command | Result |
| --- | --- |
| `docker context use desktop-linux` | PASS, selected `desktop-linux`. |
| `Start-Process "$Env:ProgramFiles\Docker\Docker\Docker Desktop.exe" -WindowStyle Hidden` | PASS, start requested. |
| `docker info` | PASS after Docker Desktop backend startup; server reported 2 running containers and version `28.3.2`. |
| `docker ps --format "{{.ID}} {{.Names}} {{.Image}} {{.Ports}}"` | PASS; `soar-postgres-1` and `soar-redis-1` running with localhost port bindings. |
| Node TCP probe for `127.0.0.1:5432` and `127.0.0.1:6379` | PASS for both ports. |
| `docker inspect soar-postgres-1` | PASS; running, `127.0.0.1:5432->5432/tcp`. |
| `docker inspect soar-redis-1` | PASS; running, `127.0.0.1:6379->6379/tcp`. |
| Focused e2e default timeout | FAIL by Vitest `5000ms` timeout after API setup started; no Prisma connection failure. |
| Focused e2e with `--testTimeout=30000` | FAIL by assertion: `trades.total` returned `0`, expected `260`; endpoint status was `200`. |

## Exact QA Rerun Command

```powershell
pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "bounds aggregate hidden trade materialization while preserving trade totals" --reporter=verbose --testTimeout=30000
```

## Current Local Infra State

- `soar-postgres-1`: running, image `postgres:15`, published
  `127.0.0.1:5432->5432/tcp`.
- `soar-redis-1`: running, image `redis:7`, published
  `127.0.0.1:6379->6379/tcp`.
- Containers were left running intentionally for the immediate
  [LUC-2317](/LUC/issues/LUC-2317) QA handoff.

## Cleanup

After QA no longer needs the local endpoints:

```powershell
docker stop soar-postgres-1 soar-redis-1
```

## Residual Risk

The restored containers currently have no compose labels, so
`docker compose ps postgres redis` does not list them even though `docker ps`,
`docker inspect`, and port probes confirm they are running. If QA needs strict
compose ownership rather than only local endpoints, recreate them through
`docker compose up -d postgres redis` now that Docker Desktop is responsive.

## Boundary

No production deploy, restart, rollback, env edit, database mutation, account
mutation, secret readback, exchange mutation, protected smoke, or live-trading
action occurred.
