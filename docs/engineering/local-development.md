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
Use `pnpm --filter api start` only for destructive local reset flow (Prisma reset + seed).

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
- `docs/planning/deployment-dev-prod-coolify-plan-2026-04-02.md`


