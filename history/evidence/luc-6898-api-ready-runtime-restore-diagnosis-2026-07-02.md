# LUC-6898 API Ready Runtime Restore Diagnosis And Closure

Date: 2026-07-02

## Scope

Read-only DRE diagnosis for [LUC-6898](/LUC/issues/LUC-6898), the critical
runtime gap where public API readiness returned `503`.

No deploy, push, restart, rollback execution, env edit, database/Redis
mutation, production account mutation, exchange/payment mutation, order,
position, subscription mutation, live-trading action, secret value readback, or
raw Coolify/log payload storage was performed.

## Source / Target

- Repository path: `C:/Personal/Projekty/Aplikacje/Soar`
- Local branch state: `main...origin/main [ahead 22, behind 3]`
- Worktree: already dirty before this heartbeat from unrelated lanes.
- Production API: `https://api.soar.luckysparrow.ch`
- Production Web: `https://soar.luckysparrow.ch`
- Web build-info target: `c357d957741f56835f27a1fc3a948dad43a91036`,
  `gitRef=main`, `metadataSource=env-runtime`.

## Public Smoke

Manual probes:

| Route | Result |
| --- | --- |
| API `/health` | `200`, body `{"status":"ok","service":"api",...}` |
| API `/ready` | `503` |
| Web `/` | `200` |
| Web `/api/build-info` | `200`, SHA `c357d957741f...` |
| API `/workers/ready` unauthenticated | `401` |

Command:

```powershell
corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `FAIL`

- `PASS API /health -> 200`
- `FAIL API /ready -> status 503`
- `PASS WEB / -> 200`
- `PASS WEB /api/build-info -> 200`

## Protected Readiness Attempt

- `GET /ready/details` without auth returned `401`, as expected.
- `GET /ready/details` with the existing `PROD_UI_AUDIT_ADMIN_TOKEN` bearer
  also returned `401`; token path is not currently accepted for ops details.
- Fresh admin login using existing `PROD_UI_AUDIT_ADMIN_*` names returned
  `503`. Secret values and account response payloads were not printed or
  stored.

## Code-Level Diagnosis

`apps/api/src/router/index.ts` implements public `/ready` as:

- `evaluateCriticalSecretsReadiness()`
- `evaluateRuntimeDependencyReadiness()`

`apps/api/src/config/runtimeDependencyReadiness.ts` checks:

- Redis via `REDIS_URL` when production Redis is required.
- Database via Prisma `SELECT 1` unless `DATABASE_REQUIRED=false`.

`apps/api/src/middleware/rateLimit.ts` returns HTTP `503` with the operational
message `Rate limit temporarily unavailable` when Redis cannot be reached and
production fallback is not allowed.

Interpretation: the public API process is alive, but production readiness is
not acceptable. The strongest current read-only signal is Redis-dependent
failure: admin login is stopped by the Redis-backed rate limiter at `503`, and
public `/ready` also evaluates Redis as a required dependency.

## Coolify Read-Only Diagnosis

Current runner has Coolify binding names present:

- `COOLIFY_BASE_URL`
- `COOLIFY_API_TOKEN`
- `COOLIFY_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_API_APP_ID`
- `COOLIFY_SOAR_WEB_APP_ID`
- `COOLIFY_SOAR_POSTGRES_RESOURCE_ID`
- `COOLIFY_SOAR_REDIS_RESOURCE_ID`

Read-only Coolify API checks returned HTTP `500` for:

- `/api/v1/version`
- `/api/v1/teams/current`
- `/api/v1/projects/{project}`
- `/api/v1/projects/{project}/environments`
- `/api/v1/projects/{project}/production`
- `/api/v1/resources`
- `/api/v1/deployments`
- `/api/v1/applications/{api-app-id}`
- `/api/v1/applications/{web-app-id}`

This blocks resource-by-resource status readback and any safe Coolify lifecycle
mutation from this heartbeat. It also means the provider/control-plane health
is part of the recovery path, not just Soar application readiness.

## Root-Cause Status

`PARTIALLY_DIAGNOSED / API_PROCESS_ALIVE / API_READY_503 /
REDIS_DEPENDENCY_SUSPECTED / ADMIN_LOGIN_503 / COOLIFY_API_500 /
PRODUCTION_MUTATION_REQUIRED`.

The exact missing readiness issue from `/ready/details` could not be obtained
because protected auth is currently unavailable. The most likely runtime cause
is Redis unavailability or Redis connection/config failure, based on the
production rate limiter fail-closed behavior and `/ready` dependency code.

## Required Recovery

Ops/provider recovery must proceed with an explicit production mutation permit
or equivalent already-approved emergency runbook:

1. Restore Coolify API read-only status first, because every Coolify endpoint
   currently returns `500`.
2. Inspect the Soar production Redis resource and `soar-api` application
   status/logs without exposing secrets.
3. If Redis is down or stale, restart/recover Redis using the documented
   rollback and smoke plan.
4. If Redis is healthy but API readiness still fails, restart or redeploy only
   the named `soar-api` resource on the current `main` artifact/SHA, then smoke.
5. Rerun public smoke, protected `/ready/details`, runtime freshness,
   rollback guard, and resource inventory.

Paperclip recovery child: [LUC-6901](/LUC/issues/LUC-6901).

## Closure Verification

After child recovery [LUC-6901](/LUC/issues/LUC-6901) reached `done`, DRE
reran the smallest read-only public production proof for parent closure.

Command:

```powershell
corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result: `PASS`

- `PASS API /health -> 200`
- `PASS API /ready -> 200`
- `PASS WEB / -> 200`
- `PASS WEB /api/build-info -> 200`

Manual route readback:

| Route | Result |
| --- | --- |
| API `/health` | `200`, body status `ok`, timestamp `2026-07-02T14:27:47.255Z` |
| API `/ready` | `200`, body `{"status":"ready","service":"api"}` |
| Web `/api/build-info` | `200`, SHA `c357d957741f56835f27a1fc3a948dad43a91036`, `gitRef=main`, `metadataSource=env-runtime`, checked at `2026-07-02T14:27:47.448Z` |

Closure status: `DONE / PUBLIC_API_READY_RESTORED /
PUBLIC_DEPLOY_SMOKE_PASS / WEB_PUBLIC_PASS / NO_DRE_PRODUCTION_MUTATION`.

## Boundary

No source-control closure is possible from this evidence-only heartbeat because
the repository was already dirty and divergent, and no product code was changed.
No DRE push, deploy, restart, rollback, env edit, DB/Redis mutation, account
mutation, exchange/payment mutation, order, position, subscription mutation,
live-trading action, secret value readback, or protected response-body capture
occurred in the closure heartbeat.
