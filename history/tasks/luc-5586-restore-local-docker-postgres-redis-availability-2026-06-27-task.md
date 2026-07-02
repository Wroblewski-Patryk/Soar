# LUC-5586 Restore Local Docker/Postgres/Redis Availability

## Header
- ID: LUC-5586
- Title: Restore local Docker/Postgres/Redis availability for QA API smoke
- Task Type: ops
- Current Stage: verification
- Status: DONE
- Owner: DRE
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001 / local QA smoke infrastructure
- Iteration: 2026-06-27 LUC-5586
- Operation Mode: BUILDER
- Mission ID: LUC-5586-LOCAL-DOCKER-POSTGRES-REDIS-AVAILABILITY-2026-06-27
- Mission Status: DONE / LOCAL_INFRA_RESTORED / API_AND_BACKTESTS_PROVEN

## Context
[LUC-5577](/LUC/issues/LUC-5577) repaired the repeatable smoke runner but left
QA API/backtests smoke blocked because Docker Desktop Linux engine was
unavailable and local `127.0.0.1:5432` / `127.0.0.1:6379` were closed.

## Goal
Restore local Docker-backed Postgres and Redis availability for the Soar
workspace and prove that the DB-backed API smoke and Backtests suite can run.

## Constraints
- Do not deploy, push, restart production, edit production env, read secret
  values, mutate production accounts, mutate exchange state, submit orders, or
  perform live-trading actions.
- Keep scope to local Docker Desktop, local Compose services, and repeatable QA
  smoke evidence.
- Do not revert unrelated dirty worktree changes from other active lanes.
- Keep Docker/Postgres/Redis running after the heartbeat because this issue is
  explicitly restoring local availability for QA follow-up.

## Definition Of Done
- Docker Desktop Linux engine is available.
- Local `postgres` and `redis` compose services run on loopback ports.
- API smoke with infra wrapper passes.
- Focused Backtests e2e passes with local infra available.
- Any residual runner orchestration issue is classified separately from local
  runtime availability.
- Soar source-of-truth files and Paperclip issue are updated with evidence.

## Implementation / Action
1. Confirmed initial blocker reproduced:
   - `docker info` failed on `//./pipe/dockerDesktopLinuxEngine`.
   - `Test-NetConnection 127.0.0.1 -Port 5432` failed.
   - `Test-NetConnection 127.0.0.1 -Port 6379` failed.
2. Started Docker Desktop from
   `C:\Program Files\Docker\Docker\Docker Desktop.exe`.
3. Waited until `docker info` reported:
   - `Server Version: 28.3.2`
   - `Operating System: Docker Desktop`
   - `OSType: linux`
4. Ran `docker compose up -d postgres redis`.
5. Verified running containers:
   - `soar-postgres-1`, image `postgres:15`, port
     `127.0.0.1:5432->5432/tcp`.
   - `soar-redis-1`, image `redis:7`, port
     `127.0.0.1:6379->6379/tcp`.
6. Verified loopback ports with `Test-NetConnection`.

## Acceptance Criteria
- Docker Linux engine available: passed.
- Postgres loopback port reachable: passed.
- Redis loopback port reachable: passed.
- API smoke pack passes through `pnpm run test:go-live:api:with-infra`: passed.
- Focused Backtests e2e passes while infra is up: passed.

## Validation Evidence
- `docker info` PASS after Docker Desktop start:
  `Server Version: 28.3.2`, `Operating System: Docker Desktop`,
  `OSType: linux`.
- `docker compose up -d postgres redis` PASS.
- `docker compose ps` PASS:
  `soar-postgres-1` and `soar-redis-1` running on loopback ports.
- `Test-NetConnection 127.0.0.1 -Port 5432` PASS:
  `TcpTestSucceeded=True`.
- `Test-NetConnection 127.0.0.1 -Port 6379` PASS:
  `TcpTestSucceeded=True`.
- `pnpm run qa:smoke-e2e:repeatable -- --checks api,backtests --artifact-prefix luc-5586-local-docker-postgres-redis-availability --today 2026-06-27`
  PARTIAL:
  - API smoke pack PASS (`45/45`, duration `56595ms`).
  - Focused Backtests check FAIL after the API wrapper ran
    `docker compose down`; failure was `Can't reach database server at
    localhost:5432`.
- After re-starting local infra:
  `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts --run`
  PASS (`1` file / `15` tests).
- Evidence files:
  - `history/artifacts/luc-5586-local-docker-postgres-redis-availability-2026-06-27.json`
  - `history/evidence/luc-5586-local-docker-postgres-redis-availability-2026-06-27.md`

## Residual Risk
- The combined repeatable runner sequence has a QA orchestration defect:
  `api` uses `test:go-live:api:with-infra`, which stops Compose services after
  API smoke, while the subsequent `backtests` check does not start infra.
  Local Docker/Postgres/Redis availability is restored, and Backtests pass
  when infra is up, so this residual belongs to the QA runner follow-up lane,
  not DRE runtime restoration.
- Docker Desktop, `soar-postgres-1`, and `soar-redis-1` were intentionally
  left running for QA follow-up. This is not a leaked validation process for
  this issue; it is the restored local runtime service requested by LUC-5586.

## Result Report
- Files changed:
  source-of-truth task/evidence/state/context files only; no runtime code
  changes were made by this DRE heartbeat.
- Verification:
  Docker engine, compose services, loopback ports, API smoke, and focused
  Backtests e2e verified.
- Commit:
  not committed; current worktree already contains unrelated active changes
  from other same-day lanes, and this issue produced evidence/state updates
  only.
- Push:
  not needed.
- Deploy impact:
  none.
- Next owner:
  [LUC-5590](/LUC/issues/LUC-5590) is assigned to QA/Test Automation to make
  the repeatable runner keep local infra alive across `api,backtests` or make
  `backtests` use the infra-aware wrapper before treating combined
  `--checks api,backtests` as a single green gate.
