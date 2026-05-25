# Local DEV and Local PROD-like Startup Runbook

Canonical scope for local runtime startup procedures:
- `DEV` (watch mode, fast iteration)
- `local PROD-like` (build + start, near-deploy behavior)

## Prerequisites
- Node.js 20+
- pnpm 10+
- Docker Desktop (Postgres + Redis)

## Environment Baseline
Prepare local env files before first run:
- `apps/api/.env`
- `apps/web/.env.local`

Bootstrap command (PowerShell, repo root):
```powershell
Copy-Item apps/api/.env.example apps/api/.env -ErrorAction SilentlyContinue
Copy-Item apps/web/.env.example apps/web/.env.local -ErrorAction SilentlyContinue
```

Minimum local endpoints:
- API target: `http://localhost:3001`
- Web target: `http://localhost:3002`
- Postgres: `localhost:5432`
- Redis: `localhost:6379`

Minimum API secret-readiness keys for local runtime startup:
- `JWT_SECRET`
- `API_KEY_ENCRYPTION_KEYS`
- `API_KEY_ENCRYPTION_ACTIVE_VERSION`

`API_KEY_ENCRYPTION` is a compatibility alias only. Local API startup fails
closed when `API_KEY_ENCRYPTION_KEYS` is missing.

## A) Local DEV Startup (watch mode)

Local worker-ownership note:
- `inline` ownership is allowed in local development and targeted tests
- separate workers remain the preferred local path whenever you need runtime
  behavior close to `STAGE` / `PROD`
- do not treat successful local inline runs as proof of deployed topology

### 1) Install dependencies (repo root)
```bash
pnpm install
```

### 2) Start infrastructure (repo root)
```bash
docker compose up -d postgres redis
docker compose ps
```

Expected:
- `postgres` is `Up` on `5432`
- `redis` is `Up` on `6379`

### Docker troubleshooting on Windows
If Docker commands exist but local infrastructure still does not start, verify
the Desktop engine before assuming the repository is broken.

Recovery sequence:
```powershell
docker context ls
docker info
docker context use desktop-linux
Start-Process "$Env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
```

Wait until `docker info` shows a `Server:` section before retrying compose.

If `docker compose up -d postgres redis` fails with `port is already allocated`
for `5432` or `6379`, inspect existing containers first:
```powershell
docker ps -a
```

In this repository that usually means another local Postgres/Redis container is
already running and can already satisfy DB-backed API tests.

`pnpm run test:go-live:smoke` now reuses already-reachable local Postgres and
Redis instead of failing immediately on that port-collision case. It still
fails closed on real migration errors.

If the smoke wrapper reports Prisma `P3009`, the blocker is the target local
database state rather than the wrapper itself. Resolve the failed local
migration first, then rerun the smoke command.

Known local blocker pattern on this workstation/repo history:
- failed migration rows may refer to older migrations whose schema objects are
  already present in the shared local database;
- observed failure shapes include duplicate columns, duplicate enum types, or
  Prisma `P3009`/`P3018` after a previous partial local migration attempt;
- examples seen locally:
  - `20260424094500_add_single_context_bot_refs`
  - `20260430153000_add_position_margin_used`
  - `20260430190000_move_external_management_to_bot`
  - `20260430200000_add_live_wallet_cashflow_ledger`

Safe local recovery options:

1. Destructive local reset when preserving local DB contents does not matter:
```powershell
docker compose down -v
docker compose up -d postgres redis
pnpm run test:go-live:smoke
```

2. Non-destructive recovery when the schema already contains the failed
migration's expected objects and only migration history is dirty:
```powershell
Set-Location apps/api
.\node_modules\.bin\prisma.CMD migrate resolve --applied <failed_migration>
Set-Location ../..
pnpm run test:go-live:smoke
```

Use option 2 only after confirming the local DB already contains the expected
schema changes. This recovers local migration history; it is not a substitute
for real production migration validation.

### 3) Start API (terminal #1, repo root)
```bash
pnpm --filter api dev
```

### 4) Start Web (terminal #2, repo root)
```bash
pnpm --filter web dev
```

### 5) Start workers (terminal #3, repo root; recommended for runtime features)
```bash
pnpm run workers/dev
```

### 6) DEV verification
- open `http://localhost:3002`
- confirm API reachable at `http://localhost:3001/health`
- in bots/dashboard flows, confirm runtime data is updating (workers active)

## B) Local PROD-like Startup (build + start)

Use this mode to validate behavior close to STAGE/PROD process ownership.

Canonical expectation:
- local PROD-like should mirror split worker ownership as closely as the local
  machine allows
- if you intentionally run inline for debugging, treat that as a local-only
  degraded shortcut, not as deployment-equivalent proof

### Fast path (one command, with preflight checks)
```bash
pnpm run prod-like/start
```

Preflight includes:
- required env files (`apps/api/.env`, `apps/web/.env.local`),
- build of `api` and `web`,
- fail-fast orchestration of `api`, `web`, and `workers`.

If you prefer manual startup, use the steps below.

### 1) Start infrastructure (repo root)
```bash
docker compose up -d postgres redis
docker compose ps
```

### 2) Build API + Web (repo root)
```bash
pnpm --filter api build
pnpm --filter web build
```

### 3) Start API in production mode (terminal #1, repo root)
```bash
pnpm --filter api run run
```
Use `pnpm --filter api start` for the production-safe launcher that applies
`prisma migrate deploy` through `scripts/start-with-migrate.mjs`. Use
`pnpm --filter api run db:reset:local` only for the explicit destructive local
reset + seed workflow.

### 4) Start Web in production mode (terminal #2, repo root)
```bash
pnpm --filter web start
```

### 5) Start workers from built artifacts (terminal #3, repo root)
```bash
pnpm run workers/prod
```

### 6) PROD-like verification
- `GET http://localhost:3001/health` -> `200`
- `GET http://localhost:3001/ready` -> `200`
- open `http://localhost:3002`
- login + open `/dashboard`
- if bots are enabled, confirm runtime updates with no watch tooling

## C) Local Docker App Stack (Coolify parity)

Use this mode when the goal is deployment-shape parity with the VPS/Coolify
topology. It builds the same API, Web, and split worker Dockerfiles used by the
Coolify service map, while also starting local Postgres and Redis containers.

This mode is the preferred local proof before changing VPS service topology,
Dockerfiles, worker ownership, production env wiring, or deploy smoke scripts.
It is heavier than watch-mode DEV and should not replace quick inner-loop
development.

### 1) Prepare local Docker env
```powershell
Copy-Item .env.docker.example .env.docker -ErrorAction SilentlyContinue
```

Then edit `.env.docker` and rotate local-only values before long-lived use:
- `JWT_SECRET`
- `API_KEY_ENCRYPTION_KEYS`
- `POSTGRES_PASSWORD`
- `REDIS_PASSWORD`

Do not put production secrets or live exchange API credentials in
`.env.docker` unless the current task explicitly requires a protected local
proof and the operator has approved that risk.

### 2) Validate compose rendering
```bash
pnpm run docker:app:config
```

Expected:
- compose renders `api`, `web`, four split worker services, `postgres`, and
  `redis`;
- missing `.env.docker` cannot block this validation because it uses
  `.env.docker.example`.

### 3) Build images
```bash
pnpm run docker:app:build
```

Expected:
- API image builds from `apps/api/Dockerfile`;
- Web image builds from `apps/web/Dockerfile`;
- worker images build from the dedicated worker Dockerfiles.

### 4) Start the full local app stack
```bash
pnpm run docker:app:up
pnpm run docker:app:ps
```

Expected:
- API is available at `http://localhost:3001`;
- Web is available at `http://localhost:3002`;
- Postgres and Redis bind only to `127.0.0.1`;
- worker services run as separate containers, matching Coolify ownership.

### 5) Docker stack verification
```bash
curl http://localhost:3001/health
curl http://localhost:3001/ready
```

Then open `http://localhost:3002`, log in, and verify dashboard/runtime pages.
Use read-only exchange checks unless a separate LIVE mutation approval exists.

### 6) Stop the Docker app stack
```bash
pnpm run docker:app:down
```

This stops the app, worker, Postgres, and Redis containers created by the
parity compose file. Use `docker volume ls` before removing volumes manually.

## Stop / Cleanup

Stop app processes in their terminals (`Ctrl+C`), then:
```bash
docker compose down
```

## Quality Gate (Typecheck)
- `pnpm --filter api run typecheck`
- `pnpm --filter web run typecheck`
- `pnpm run typecheck` (aggregate root)

## Related Docs
- `docs/operations/dev-stage-prod-environment-matrix.md`
- `history/plans/deployment-dev-prod-coolify-plan-2026-04-02.md`
