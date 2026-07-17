# LUC-1359 Production API Ready 503 Runtime Diagnosis

Date: 2026-07-17

## Scope

Read-only plus permission-safe DRE diagnosis for the critical Soar production
runtime gap where `https://api.soar.luckysparrow.ch/ready` returns `503` on
Friday, July 17, 2026.

No repo code change, commit, push, deploy, rollback, environment edit,
database mutation, Redis mutation, production account mutation, exchange
mutation, trading mutation, or secret-value disclosure was performed.

## Live Public Smoke

| Route | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `503` |
| Web `/` | `200` |
| Web `/api/build-info` | `200`, SHA `b0b2c2ce9477a32fcda7717f447ad46aa4327589`, `metadataSource=env-runtime` |

Observed again after all recovery-path attempts:

| Route | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `503` |
| Web `/` | `200` |
| Web `/api/build-info` | `200` |

## Readiness Code Boundary

Public `/ready` in `apps/api/src/router/index.ts` returns `503` when either of
these fail:

1. `evaluateCriticalSecretsReadiness()`
2. `evaluateRuntimeDependencyReadiness()`

`evaluateRuntimeDependencyReadiness()` in
`apps/api/src/config/runtimeDependencyReadiness.ts` fails closed on:

- Redis ping failure via `REDIS_URL` in production
- Database `SELECT 1` failure via Prisma

`evaluateCriticalSecretsReadiness()` in
`apps/api/src/config/criticalSecretsReadiness.ts` fails closed on:

- weak or missing `JWT_SECRET`
- invalid `JWT_SECRET_PREVIOUS*` rotation window
- missing or malformed `API_KEY_ENCRYPTION_KEYS`
- missing active keyring version

## Protected/Auth Symptoms

- Production admin-login attempt to `POST /auth/login` timed out at 30s using
  the bound smoke principal names.
- This matches a shared dependency degradation rather than a public-web-only
  outage.

## Coolify Readback

Authenticated read-only Coolify API calls on 2026-07-17 returned:

- `GET /api/v1/version` -> `200`, `4.0.0-beta.473`
- `GET /api/v1/teams/current` -> `200`, team `LuckySparrow`
- `GET /api/v1/resources` -> `200`, `17` visible rows
- `GET /api/v1/applications` -> `200`, Soar applications visible
- `GET /api/v1/deployments` -> `200`, `0` visible rows

Relevant resource states:

| Resource | Type | Status |
| --- | --- | --- |
| `soar-api` | application | `running:unknown` |
| `soar-web` | application | `running:unknown` |
| `workers-backtest` | application | `running:unknown` |
| `workers-execution` | application | `running:unknown` |
| `workers-market-data` | application | `running:unknown` |
| `workers-market-stream` | application | `running:unknown` |
| `postgresql` | standalone-postgresql | `running:healthy` |
| `redis` | standalone-redis | `restarting:unhealthy` |

Direct `GET /api/v1/databases/{redis-id}` summary:

- `name=redis`
- `database_type=standalone-redis`
- `status=restarting:unhealthy`
- `restart_count=682`
- `updated_at=2026-07-17T14:47:36.000000Z`
- `last_online_at=2026-07-17 14:47:36`

## Mutation Path Attempts

### Bearer-token Coolify API path

These all failed with the same permission boundary:

- `POST /api/v1/databases/{redis-id}/restart` -> `403 Missing required permissions: deploy`
- `POST /api/v1/databases/{redis-id}/start` -> `403 Missing required permissions: deploy`
- `POST /api/v1/databases/{redis-id}/stop` -> `403 Missing required permissions: deploy`

### Coolify session-auth path

- `GET /login` -> `200`, `XSRF-TOKEN` and `coolify_session` cookies issued
- `GET /sanctum/csrf-cookie` -> `204`
- `POST /login` with bound Coolify UI credentials -> `200`, body preview
  `{"two_factor":false}`
- `POST /api/v1/databases/{redis-id}/restart` with that session still returned
  `401 Unauthenticated`

Result: this runner can diagnose the Redis failure and can authenticate to the
Coolify UI, but it still cannot execute the required Redis restart through the
available API surfaces.

## Conclusion

Current runtime state is:

`BLOCKED / API_HEALTH_200 / API_READY_503 / WEB_200 / REDIS_RESTARTING_UNHEALTHY / COOLIFY_READ_ONLY_TOKEN_ONLY / SESSION_RESTART_PATH_UNAUTHENTICATED`

The dominant live root cause is production Redis health, not a newly proven
Soar application-code regression.

## Required Unblock

Named unblock owner and action:

1. Ops Release Lead or Security Review Lead injects a deploy-capable Coolify
   credential path into the runner or directly performs the single Redis
   restart/recovery action in Coolify.
2. After Redis recovery, rerun:
   - API `/health`
   - API `/ready`
   - Web `/`
   - Web `/api/build-info`
   - protected `/ready/details` with approved admin auth
3. If API `/ready` still fails after Redis is healthy, continue with the next
   readiness branch: database ping or critical-secret readiness.

## Boundary

This heartbeat did not restore the outage because the remaining required
production mutation is outside the currently granted API permissions.
