# Coolify Linux VPS Setup Guide (Service Mapping + Domains)

Date: 2026-04-03  
Owner: Ops + Release Engineering  
Scope: `DPL-03`

## Purpose
Provide one repeatable setup path for hosting CryptoSparrow on a Linux VPS with Coolify, including:
- service split (`postgres`, `redis`, `api`, `web`, `workers`),
- domain routing,
- deployment checks.

This guide is for the active PROD environment. Stage is intentionally parked as
of 2026-04-29 to avoid unused redeploy queues and duplicated VPS resource usage.
Reintroduce it only when the project again needs pre-production validation.

## Target Topology

For the active `prod` environment deploy:
1. Postgres service
2. Redis service
3. API service (`apps/api`)
4. Web service (`apps/web`)
5. Workers service (`apps/api` workers)

Do not run workers inside API process in VPS deployment.
Deployed worker ownership contract:
- canonical healthy state = split workers
- inline worker ownership is not a normal VPS topology
- if inline is ever used as an emergency fallback, treat the environment as
  degraded until split ownership is restored

## Domain Routing Contract

Production:
- Web: `soar.luckysparrow.ch`
- API: `api.soar.luckysparrow.ch`

Stage:
- currently disabled/removed from active Coolify deployment
- previous pattern, if reintroduced later:
  - Web: `stage.soar.luckysparrow.ch`
  - API: `stage-api.soar.luckysparrow.ch`

## Prerequisites

On VPS host:
- Docker Engine installed
- Coolify installed and reachable
- DNS records prepared for web/api domains
- Firewall open for HTTPS (`443`) and Coolify access path

Repository requirements:
- monorepo available to Coolify
- lockfile present (`pnpm-lock.yaml`)

## Step 1: Create Coolify Project and Environment

1. In Coolify, create project: `cryptosparrow`.
2. Create or keep only the `production` environment active.
3. If stage is reintroduced later, keep stage and prod resources separate and
   disable auto-deploy until the stage workflow is intentionally restored.

## Step 2: Provision Data Services

### Postgres
- Add managed Postgres service.
- Persistent volume required.
- Set database name/user/password.
- Capture internal connection string for app services.

### Redis
- Add managed Redis service.
- Persistent volume recommended.
- Capture internal connection string.

## Step 3: Add API Service (`apps/api`)

Docker build configuration (Coolify):
- Source: repository root (monorepo)
- Build pack: `Dockerfile`
- Docker build context: repository root (`.`)
- Dockerfile location: `apps/api/Dockerfile`
- Exposed port: `3001`

Runtime command:
- keep image default command (`node scripts/start-with-migrate.mjs`)
- startup behavior:
  1. run `prisma migrate deploy`,
  2. start API only if migrations succeed.

Health checks:
- `/health`
- `/ready`

Required environment variables:
- `NODE_ENV=production`
- `DATABASE_URL=<coolify-postgres-url>`
- `REDIS_URL=<coolify-redis-url>`
- `SERVER_URL=https://api.<env-domain>`
- `CLIENT_URL=https://<web-env-domain>`
- `CORS_ORIGINS=https://<web-env-domain>`
- `JWT_SECRET=<secret>`
- `COOKIE_DOMAIN=<shared-parent-domain>` (optional, for shared subdomain sessions, e.g. `luckysparrow.ch`)
- `COOKIE_SAME_SITE=<lax|strict|none>` (optional, default `lax`; use `none` only when web/api are cross-site)
- `API_KEY_ENCRYPTION_KEYS=<versioned-keys>`
- `API_KEY_ENCRYPTION_ACTIVE_VERSION=<active-version>`
- `COINGECKO_API_BASE_URL=https://api.coingecko.com/api/v3`
- `COIN_ICON_CACHE_TTL_MINUTES=360` (recommended baseline; tune per traffic profile)

Optional but recommended in PROD:
- `COINGECKO_API_KEY=<secret>`

Optional migration toggle:
- `API_AUTO_MIGRATE=true` (default behavior in API image)
- set `API_AUTO_MIGRATE=false` only for emergency/maintenance windows

Reference: `docs/operations/dev-stage-prod-environment-matrix.md`

## Step 4: Add Web Service (`apps/web`)

Docker build configuration (Coolify):
- Source: repository root (monorepo)
- Build pack: `Dockerfile`
- Docker build context: repository root (`.`)
- Dockerfile location: `apps/web/Dockerfile`
- Exposed port: `3002`

Runtime command:
- keep image default command (`pnpm --filter web start`)

Required environment variables:
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_BASE_URL=https://api.<env-domain>`
- `SOURCE_COMMIT=$SOURCE_COMMIT` when deploy-proof endpoints must expose the active web commit SHA
- `SOURCE_BRANCH=$COOLIFY_BRANCH` when deploy-proof endpoints must expose the active deployed branch

Deploy-proof note:
- In Coolify `Advanced` settings for the web application, enable `Include Source Commit in Build` when the build process must see `SOURCE_COMMIT`.
- The current Soar web build metadata path reads `SOURCE_COMMIT` / `SOURCE_BRANCH` first and falls back to repository git metadata only in local builds.

## Step 5: Add Workers Service

Create dedicated worker services from the same API image.
Process ownership contract: `api` does not own worker lifecycle in production.

For deterministic production behavior create separate services:
- `workers-market-data`
- `workers-market-stream`
- `workers-backtest`
- `workers-execution`

Each worker service config:
- Build pack: `Dockerfile`
- Docker build context: repository root (`.`)
- Dockerfile location:
  - `workers-market-data` -> `apps/api/Dockerfile.worker.market-data`
  - `workers-market-stream` -> `apps/api/Dockerfile.worker.market-stream`
  - `workers-backtest` -> `apps/api/Dockerfile.worker.backtest`
  - `workers-execution` -> `apps/api/Dockerfile.worker.execution`
- Exposed port: none

Shared worker env:
- `NODE_ENV=production`
- `DATABASE_URL=<coolify-postgres-url>`
- `REDIS_URL=<coolify-redis-url>`
- runtime/queue keys required by current worker contract (`WORKER_*`, selected `RUNTIME_*`)
- `BINANCE_STREAM_URL` only when intentionally overriding the canonical default
  market-type endpoint

Binance stream endpoint contract:
- `SPOT` workers default to `wss://stream.binance.com:9443/ws`
- `FUTURES` workers default to `wss://fstream.binance.com/ws`
- do not point `FUTURES` runtime to the spot websocket unless an explicit
  degraded/test scenario is documented

Operational rule:
- a deployment is not considered topology-complete unless the split worker
  services are present and healthy

## Step 6: Attach Domains and TLS

1. Attach web domain to web service.
2. Attach api domain to api service.
3. Enable managed TLS in Coolify.
4. Verify certificates issued and routing healthy.

## Step 6A: Reverse-Proxy Cache Rules (Critical)

Cache policy must be fail-closed for authenticated/runtime surfaces.

Never cache (reverse proxy, CDN, edge):
- `/auth/*`
- `/dashboard/*`
- `/admin/*`
- API responses containing `Set-Cookie`
- SSE/event streams (`/dashboard/market-stream/*`)

Allowed cache scope (static only):
- `/_next/static/*`
- `/icons/*`
- immutable static assets (`*.js`, `*.css`, `*.png`, `*.svg`, `*.webp`, `*.woff2`, etc.)

Operational rules:
1. Respect origin `Cache-Control` headers from API (especially `no-store` on sensitive namespaces).
2. Do not override `no-store` with proxy defaults.
3. Do not enable HTML/document caching for dashboard/auth/admin pages.
4. Keep service-worker caching aligned to static-only contract (no runtime/API payload caching).

Quick verification checklist:
1. `curl -I https://api.<env-domain>/auth/me` should include `Cache-Control: no-store...`
2. `curl -I https://api.<env-domain>/dashboard` should include `Cache-Control: no-store...`
3. `curl -I https://api.<env-domain>/admin` should include `Cache-Control: no-store...`
4. `curl -I https://<web-env-domain>/_next/static/...` should be cacheable (`public, max-age` or equivalent immutable policy)
5. Dashboard runtime data should update after hard refresh without stale payload replay.

## Step 7: Migrations Before Go-Live

Before first stage/prod release:
1. Run DB migration job against target DB.
2. Confirm Prisma schema is up to date.
3. Confirm API starts without migration drift errors.

If migration fails, do not continue deployment.

Note:
- API startup runs `prisma migrate deploy` automatically (safe/idempotent path).
- Do **not** use destructive commands like `prisma migrate reset` or reseeding in production.

## Step 8: Production Rollout

1. Deploy the selected SHA to PROD during a controlled window.
2. Run same health checks.
3. Run smoke checks from runbook:
   - `docs/operations/v1-ops-runbook.md`
4. Record deployment evidence.

## Rollback Baseline

If post-deploy health fails:
1. Roll back API/Web to previous stable release.
2. Keep DB safety in mind (prefer backward-compatible migrations).
3. Re-validate `/health` and `/ready`.
4. Log incident and rollback reason.

## Common Failure Points

1. Wrong `NEXT_PUBLIC_API_BASE_URL` -> web cannot reach API.
2. Reintroduced stage using prod DB/Redis by mistake.
3. Missing worker service -> runtime data stale.
4. Wrong/missing cookie session config (`COOKIE_DOMAIN`, `COOKIE_SAME_SITE`) for deployed domains.
5. API CORS not matching web domain.
6. Wrong Dockerfile path in Coolify (must point to `apps/api/Dockerfile` or `apps/web/Dockerfile`).
7. Using Docker mode without repository Dockerfile artifacts.
8. Coolify build-secrets injection + old Dockerfile frontend (`1.7`) can fail with `unexpected key 'env' in 'env=COOLIFY_URL'`; keep deploy Dockerfiles on `# syntax=docker/dockerfile:1.10` or newer.

## References
- `docs/operations/dev-stage-prod-environment-matrix.md`
- `docs/operations/coolify-trigger-wiring.md`
- `docs/engineering/local-development.md`
- `docs/planning/deployment-dev-prod-coolify-plan-2026-04-02.md`
- `docs/operations/v1-ops-runbook.md`
