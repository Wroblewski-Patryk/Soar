# Task - LUC-2979 Restore Local PostgreSQL Test Dependency

## Header
- ID: LUC-2979
- Title: [Soar][DB][LUC-2977] Restore local PostgreSQL test dependency for Gate.io DB-backed ingestion proof
- Task Type: dependency restoration
- Current Stage: verification
- Status: DONE
- Owner: Deployment & Reliability Engineer
- Depends on: local PostgreSQL runtime availability
- Priority: P1
- Module Confidence Rows: Gate.io LIVE position sync ingestion / Local DB test dependency
- Requirement Rows: REQ-FUNC-017, Gate.io position ingestion readiness for LUC-1166
- Quality Scenario Rows: local DB-backed persistence proof
- Risk Rows: local dependency unavailable for DB-backed verification
- Iteration: 2026-06-08
- Operation Mode: BUILDER
- Mission ID: LUC-2979-RESTORE-LOCAL-POSTGRESQL-TEST-DEPENDENCY-2026-06-08
- Mission Status: VERIFIED

## Context
[LUC-2977](/LUC/issues/LUC-2977) is blocked because the focused DB-backed Gate.io
position ingestion proof cannot reach PostgreSQL at `localhost:5432`.
[LUC-2979](/LUC/issues/LUC-2979) was assigned to restore or provide the local
PostgreSQL test dependency and rerun the smallest focused proof.

## Goal
Restore a local PostgreSQL test service compatible with the repository default
local PostgreSQL DSN shape, with any password value redacted, or
record the exact environment blocker and owner/action when the dependency
cannot be restored from the current heartbeat.

## Constraints
- Do not change product/runtime logic to bypass DB-backed verification.
- Do not mutate production, deploy, push, restart, use secrets, use exchange
  accounts, open/cancel orders, alter live positions, or perform live-trading
  actions.
- Do not revert unrelated dirty worktree changes.
- Prefer existing project infra (`pnpm run go-live:infra:up` /
  `docker compose up -d postgres redis`) when Docker is available.

## Scope
- Local runtime dependency checks only.
- Focused verification command:
  `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/router/workers-health-readiness.test.ts --reporter=verbose`

## Implementation Plan
1. Check whether `localhost:5432` is already accepting TCP connections.
2. Check Docker Desktop availability for the existing compose-backed infra path.
3. Start Docker Desktop when the Docker engine is unavailable but installed.
4. Normalize any stale local Compose network/container state without deleting
   volumes.
5. Rerun the focused proof to preserve current pass/fail evidence.
6. Update source-of-truth state and Paperclip issue disposition.

## Acceptance Criteria
- Local PostgreSQL dependency is restored and the focused proof is rerun.
- Workers readiness auth/non-admin/fail-closed checks remain accounted for.
- DB-backed Gate.io persistence proof is not overclaimed while PostgreSQL is
  unavailable.
- Durable issue/project evidence records files changed, commands run,
  deployment impact, and residual risk.

## Definition of Done
- [x] Local PostgreSQL port checked.
- [x] Docker compose startup path checked.
- [x] Docker Desktop started when initially unavailable.
- [x] Stale Compose network/container state normalized while preserving the
      existing Postgres volume.
- [x] Focused proof rerun.
- [x] Source-of-truth evidence updated.
- [x] Paperclip issue disposition updated.

## Forbidden
- Production smoke.
- Deploy, push, restart, or rollback.
- Secret read/write/disclosure.
- Real account or exchange credential use.
- Order, position, database-production, or live-trading mutation.
- Runtime-code workaround for missing local DB.

## Validation Evidence
- Initial `Test-NetConnection -ComputerName localhost -Port 5432` reproduced
  the blocker: `TcpTestSucceeded: False`.
- Initial `docker version` reproduced the Docker blocker:
  `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`.
- Docker Desktop is installed at `C:\Program Files\Docker\Docker\Docker Desktop.exe`.
  Starting Docker Desktop brought the Docker server up:
  `Server: Docker Desktop 4.43.2 (199162)`.
- First `pnpm run go-live:infra:up` attempt failed because stale local
  `soar_default` network metadata had no Compose label, while
  `soar-postgres-1` and `soar-redis-1` were attached.
- Normalization performed:
  - stopped and removed only local `soar-postgres-1` and `soar-redis-1`
    containers;
  - removed only the stale `soar_default` network;
  - preserved existing Docker volumes;
  - reran `pnpm run go-live:infra:up`, which recreated `soar_default` and
    started `postgres` and `redis`.
- `docker compose ps` after normalization shows:
  - `soar-postgres-1` `Up`, `127.0.0.1:5432->5432/tcp`;
  - `soar-redis-1` `Up`, `127.0.0.1:6379->6379/tcp`.
- Final TCP checks:
  - `localhost:5432` `TcpTestSucceeded: True`;
  - `localhost:6379` `TcpTestSucceeded: True`.
- `docker exec soar-postgres-1 pg_isready -U postgres -d cryptosparrow`
  returned accepting connections. It also printed an existing collation version
  mismatch warning for `cryptosparrow`; that warning did not block the focused
  proof.
- Focused proof:
  - `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/router/workers-health-readiness.test.ts --reporter=verbose`
  - Passed after runtime restoration: `2` test files passed, `42` tests passed.
  - Gate.io DB-backed position ingestion cases passed.
  - `workers-health-readiness.test.ts` passed `8/8`.

## Architecture Evidence
- Affected architecture area: Gate.io LIVE position sync ingestion and local
  persistence verification.
- Fits approved architecture: yes. The repo expects a real PostgreSQL-backed
  Prisma test dependency for these cases.
- Mismatch discovered: no.
- Workaround introduced: no.
- Follow-up architecture update: not required; this is an environment
  dependency blocker, not a schema/runtime design change.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: no code/runtime change; rollback not applicable.
- Local process posture: Docker Desktop plus local Compose `postgres` and
  `redis` remain running intentionally because this issue restored the local
  DB-backed proof dependency and downstream [LUC-2977](/LUC/issues/LUC-2977)
  verification can reuse it. No browser, dev server, worker, production
  service, or protected runtime process was started.

## Security / Privacy Evidence
- Data classification: local dependency checks only.
- Secret handling: no secret values read or written.
- Account handling: no production account, test account, exchange account, API
  key, cookie, or token used.
- Mutation boundary: no production database, exchange, order, position, or
  live-trading mutation occurred.

## Result Report
- Task summary: restored the local Docker/PostgreSQL/Redis dependency for
  [LUC-2977](/LUC/issues/LUC-2977) by starting Docker Desktop, normalizing the
  stale local Compose network/container state, and rerunning
  `pnpm run go-live:infra:up`.
- Files changed: this task evidence file plus source-of-truth state updates.
- How tested: Docker engine check, `pnpm run go-live:infra:up`, `docker compose
  ps`, TCP checks for `5432` and `6379`, `pg_isready`, and the focused API
  Vitest proof.
- What is incomplete: no product-code blocker remains in this issue. Residual
  local DB maintenance note: `pg_isready` reports a collation version mismatch
  warning on the reused `cryptosparrow` volume; it did not block current proof.
- Next owner/action: DBE/QA can rerun or close the dependent
  [LUC-2977](/LUC/issues/LUC-2977) verification using the restored local
  Compose services.
- Paperclip disposition: mark [LUC-2980](/LUC/issues/LUC-2980) `done`; remove
  the local-runtime blocker from [LUC-2979](/LUC/issues/LUC-2979) if it still
  carries the old blocked relation.
- Disposition: verified local runtime dependency restored; no product-code
  failure was identified in this heartbeat.

## DBE Resume Closure
- Wake reason: `issue_blockers_resolved` for [LUC-2979](/LUC/issues/LUC-2979).
- [LUC-2980](/LUC/issues/LUC-2980) readback: `done`.
- `Test-NetConnection -ComputerName localhost -Port 5432` now reports
  `TcpTestSucceeded: True` on `127.0.0.1`.
- `docker version` now reports Docker Desktop server available.
- `docker ps --format "{{.Names}} {{.Status}} {{.Ports}}"` shows
  `soar-postgres-1` on `127.0.0.1:5432->5432/tcp` and `soar-redis-1` on
  `127.0.0.1:6379->6379/tcp`.
- DBE reran the exact focused proof:
  `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/router/workers-health-readiness.test.ts --reporter=verbose`.
- Result: passed with `2` test files and `42` tests passing.
- Final disposition: [LUC-2979](/LUC/issues/LUC-2979) can be marked `done`
  with the resolved [LUC-2980](/LUC/issues/LUC-2980) blocker cleared.
