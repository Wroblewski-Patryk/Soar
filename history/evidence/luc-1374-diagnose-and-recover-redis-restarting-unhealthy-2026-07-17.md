# LUC-1374 Redis restarting:unhealthy Diagnosis

Date: 2026-07-17

## Scope

Focused DRE production-runtime diagnosis for `LUC-1374` on Friday, July 17,
2026. Scope stayed limited to fresh public smoke, fresh Coolify readback, and
permission-safe mutation-path probes for the Soar production Redis resource.

No repo code change, commit, push, deploy, rollback, environment edit,
database mutation, Redis mutation, production account mutation, exchange
mutation, or secret-value disclosure was performed.

## Live Public Smoke

Observed on 2026-07-17 around `16:31Z`:

| Route | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `503` |
| Web `/` | `200` |
| Web `/api/build-info` | `200`, SHA `b0b2c2ce9477a32fcda7717f447ad46aa4327589`, `metadataSource=env-runtime` |

## Coolify Readback

Authenticated bearer-token Coolify API calls on 2026-07-17 returned:

- `GET /api/v1/version` -> `200`, `4.0.0-beta.473`
- `GET /api/v1/teams/current` -> `200`, team `LuckySparrow`
- `GET /api/v1/resources` -> `200`

Relevant resource states at `updated_at=2026-07-17T16:31:37.000000Z`:

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

Direct database readback:

### Redis

- `name=redis`
- `database_type=standalone-redis`
- `status=restarting:unhealthy`
- `restart_count=682`
- `updated_at=2026-07-17T16:31:37.000000Z`
- `last_online_at=2026-07-17 16:31:37`

### PostgreSQL

- `name=postgresql`
- `database_type=standalone-postgresql`
- `status=running:healthy`
- `restart_count=52`
- `updated_at=2026-07-17T16:31:37.000000Z`
- `last_online_at=2026-07-17 16:31:37`

## Mutation Path Probe

Bearer-token Coolify mutation attempts on 2026-07-17:

- `POST /api/v1/databases/{redis-id}/restart` -> `403 Missing required permissions: deploy`
- `POST /api/v1/databases/{redis-id}/start` -> `403 Missing required permissions: deploy`
- `POST /api/v1/databases/{redis-id}/stop` -> `403 Missing required permissions: deploy`

Result: this runner still has read-only diagnosis access for the Redis incident
but still does not have the deploy-capable Redis mutation permission needed to
recover the resource.

## Conclusion

Current runtime state on Friday, July 17, 2026 is:

`BLOCKED / API_HEALTH_200 / API_READY_503 / WEB_200 / REDIS_RESTARTING_UNHEALTHY / COOLIFY_DEPLOY_PERMISSION_MISSING`

`LUC-1374` does not reveal a new Soar application-code regression. The live
dominant fault remains the production Redis resource in Coolify.

## Required Unblock

Named unblock owner and action:

1. Ops Release Lead or Security Review Lead provides a deploy-capable Coolify
   Redis mutation path or directly performs the single Redis recovery action.
2. After Redis recovers, rerun:
   - API `/health`
   - API `/ready`
   - Web `/`
   - Web `/api/build-info`
   - protected `/ready/details`
3. If API `/ready` still fails after Redis is healthy, continue with the next
   readiness branch: database ping or critical-secret readiness.
