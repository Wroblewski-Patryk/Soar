# LUC-1374 Redis unhealthy recheck

Date: 2026-07-20

## Scope

Fresh DRE recheck after an `issue_blockers_resolved` wake on Monday, July 20,
2026. The objective was to verify whether the claimed unblock actually enabled
the smallest governed Redis recovery action from the Paperclip control-plane
workspace.

All commands in this heartbeat were run from:

`C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse`

No repo code change, deploy, rollback, environment edit, database mutation,
Redis mutation, secret-value disclosure, account mutation, or trading mutation
was performed.

## Presence-Only Environment Check

These required bindings are present by name in the runner:

- `COOLIFY_BASE_URL`
- `COOLIFY_API_TOKEN`
- `COOLIFY_TOKEN`
- `COOLIFY_SOAR_PROJECT_ID`
- `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`
- `COOLIFY_SOAR_REDIS_RESOURCE_ID`
- `COOLIFY_SOAR_POSTGRES_RESOURCE_ID`
- `COOLIFY_SOAR_APP_ID`
- `COOLIFY_SOAR_TEAM_ID`
- `COOLIFY_TEAM_ID`

## Live Public Smoke

Observed on Monday, July 20, 2026 around `19:50Z`:

| Route | Result |
| --- | --- |
| API `/health` | `200` |
| API `/ready` | `503` |
| Web `/` | `200` |
| Web `/api/build-info` | `200`, SHA `b0b2c2ce9477a32fcda7717f447ad46aa4327589`, `metadataSource=env-runtime` |

## Coolify Readback

Fresh `GET /api/v1/resources` readback at `2026-07-20T19:50:37.000000Z`:

| Resource | Status |
| --- | --- |
| `soar-web` | `running:unknown` |
| `workers-backtest` | `running:unknown` |
| `workers-execution` | `running:unknown` |
| `workers-market-data` | `running:unknown` |
| `workers-market-stream` | `running:unknown` |
| `soar-api` | `running:unknown` |
| `postgresql` | `running:healthy` |
| `redis` | `restarting:unhealthy` |

Direct database readback:

### Redis

- `database_type=standalone-redis`
- `status=restarting:unhealthy`
- `restart_count=682`
- `updated_at=2026-07-20T19:50:37.000000Z`
- `last_online_at=2026-07-20 19:50:37`

### PostgreSQL

- `database_type=standalone-postgresql`
- `status=running:healthy`
- `restart_count=52`
- `updated_at=2026-07-20T19:50:37.000000Z`
- `last_online_at=2026-07-20 19:50:37`

## Mutation Path Probe

Fresh bearer-token mutation probes on Monday, July 20, 2026:

- `POST /api/v1/databases/{redis-id}/restart` -> `403 Missing required permissions: deploy`
- `POST /api/v1/databases/{redis-id}/start` -> `403 Missing required permissions: deploy`
- `POST /api/v1/databases/{redis-id}/stop` -> `403 Missing required permissions: deploy`

## Conclusion

The `issue_blockers_resolved` wake does not match the live environment.

Current runtime state remains:

`BLOCKED / API_READY_503 / REDIS_RESTARTING_UNHEALTHY / COOLIFY_DEPLOY_PERMISSION_MISSING`

The prior blocker from Friday, July 17, 2026 is still active on Monday, July
20, 2026. No recovery-capable permission path was actually restored for this
runner.

## Required Unblock

1. Ops Release Lead or Security Review Lead must provide a deploy-capable
   Coolify Redis mutation path or directly perform the single Redis recovery
   action.
2. After Redis recovery, rerun:
   - API `/health`
   - API `/ready`
   - Web `/`
   - Web `/api/build-info`
   - protected `/ready/details`
3. If API `/ready` still fails after Redis is healthy, continue with the next
   readiness branch: database ping or critical-secret readiness.
