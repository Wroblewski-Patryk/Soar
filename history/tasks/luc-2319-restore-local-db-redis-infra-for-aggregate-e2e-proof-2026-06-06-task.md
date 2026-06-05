# Task

## Header
- ID: LUC-2319
- Title: Restore local DB/Redis infra for aggregate e2e proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Priority: P0
- Mission ID: LUC-2319-LOCAL-DB-REDIS-INFRA-2026-06-06
- Mission Status: VERIFIED

## Context
[LUC-2317](/LUC/issues/LUC-2317) could not run the focused DB-backed runtime
aggregate e2e proof because local Postgres and Redis were unavailable.

## Goal
Restore a Soar-local Postgres/Redis test endpoint without using Paperclip
control-plane storage, then hand the exact rerun command back to QA.

## Scope
- Local Docker Desktop engine readiness.
- Local Soar Postgres and Redis containers bound to `127.0.0.1:5432` and
  `127.0.0.1:6379`.
- Focused [LUC-2317](/LUC/issues/LUC-2317) rerun readiness.

## Implementation Plan
1. Confirm Docker Desktop and local port state.
2. Start Docker Desktop using the documented local-development recovery path.
3. Verify Docker engine and local Postgres/Redis bindings.
4. Run the focused aggregate e2e command to confirm the blocker moved beyond
   DB connectivity.
5. Record evidence and handoff.

## Acceptance Criteria
- `docker info` succeeds.
- `127.0.0.1:5432` and `127.0.0.1:6379` are reachable.
- Exact QA rerun command is recorded for [LUC-2317](/LUC/issues/LUC-2317).

## Definition of Done
- Local infra readiness is verified with commands.
- Any remaining proof failure is classified separately from infra readiness.
- No production, secret, account, exchange, or live-trading mutation occurs.

## Forbidden
- Production deploy/restart/rollback.
- Production database, Redis, account, exchange, or live-trading mutation.
- Secret value logging.
- Use of Paperclip control-plane embedded Postgres as Soar app test DB.

## Validation Evidence
- `docker context use desktop-linux` -> selected `desktop-linux`.
- `Start-Process "$Env:ProgramFiles\Docker\Docker\Docker Desktop.exe" -WindowStyle Hidden` -> Docker Desktop requested.
- `docker info` -> PASS after backend startup; server reported `Containers: 2`, `Running: 2`, `Server Version: 28.3.2`.
- `docker ps --format "{{.ID}} {{.Names}} {{.Image}} {{.Ports}}"` -> PASS:
  - `soar-redis-1 redis:7 127.0.0.1:6379->6379/tcp`
  - `soar-postgres-1 postgres:15 127.0.0.1:5432->5432/tcp`
- Node TCP readiness probe -> PASS for ports `5432` and `6379`.
- `docker inspect soar-postgres-1` -> running, `127.0.0.1:5432`.
- `docker inspect soar-redis-1` -> running, `127.0.0.1:6379`.
- Focused default e2e:
  `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "bounds aggregate hidden trade materialization while preserving trade totals" --reporter=verbose`
  -> reached API setup and failed on Vitest default `5000ms` timeout, not Prisma connection.
- Focused extended e2e:
  `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "bounds aggregate hidden trade materialization while preserving trade totals" --reporter=verbose --testTimeout=30000`
  -> endpoint returned `200`; test failed assertion at
  `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts:534`
  because `trades.total` was `0`, expected `260`.
- Reality status: infra verified; downstream aggregate assertion failed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: local-only DB/Redis test endpoints restored.
- Cleanup guidance: keep containers running for the immediate QA rerun; stop
  with `docker stop soar-postgres-1 soar-redis-1` after QA no longer needs them.
- Observability impact: none.

## Result Report
- Task summary: local Docker Desktop recovered enough for Soar Postgres and
  Redis containers to serve localhost test endpoints.
- Files changed: this task packet, evidence packet, and state/context summaries.
- How tested: Docker engine readiness, container/port inspection, Node TCP
  readiness, and focused aggregate e2e reruns.
- What is incomplete: [LUC-2317](/LUC/issues/LUC-2317) now has a functional
  aggregate assertion failure rather than an infra blocker.
- Next steps: Test Automation / Backend should rerun the focused command and
  investigate `trades.total` returning `0` instead of `260`.
- Decisions made: leave local `soar-postgres-1` and `soar-redis-1` running
  intentionally for the immediate QA handoff.
