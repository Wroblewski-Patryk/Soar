# LUC-1368 Protected Redis Recovery Path Evidence

Date: 2026-07-17

## Scope

Focused DRE protected-gate verification for the live Soar production readiness
incident on Friday, July 17, 2026. Scope stayed limited to:

- fresh Redis resource readback from Coolify;
- bounded bearer-token restart reprobe;
- bounded owner-login session reprobe;
- bounded public smoke for Soar API/Web;
- source-of-truth and issue disposition updates.

No repo runtime-code change, deploy, rollback, environment edit, database
mutation, Redis mutation, production account mutation, or secret disclosure was
performed.

## Public Soar Smoke

Observed around `2026-07-17T22:30Z`:

| Route | Result |
| --- | --- |
| `https://api.soar.luckysparrow.ch/health` | `200` |
| `https://api.soar.luckysparrow.ch/ready` | `503` |
| `https://soar.luckysparrow.ch/` | `200` |
| `https://soar.luckysparrow.ch/api/build-info` | `200`, SHA `b0b2c2ce9477a32fcda7717f447ad46aa4327589`, `metadataSource=env-runtime` |

## Coolify Redis Readback

Using bound Coolify auth and the bound Redis resource id:

- `GET /api/v1/databases/{redis-id}` -> `name=redis`
- `database_type=standalone-redis`
- `status=restarting:unhealthy`
- `restart_count=682`
- `updated_at=2026-07-17T22:30:37.000000Z`
- `last_online_at=2026-07-17 22:30:37`

## Auth Path Probes

### Bearer-token API path

- `POST /api/v1/databases/{redis-id}/restart` -> `403`
- response body preview: `{"message":"Missing required permissions: deploy"}`

Result: the injected Coolify bearer token is still read-only for this recovery
surface.

### Owner-login session path

Using the injected `COOLIFY_LOGIN_*` bindings with a cookie-jar `curl` flow:

1. `GET /login` and `GET /sanctum/csrf-cookie` issued CSRF material.
2. `POST /login` with the bound owner credentials returned `200` and body
   preview `{"two_factor":false}`.
3. Subsequent session-backed `GET /api/v1/teams/current` still returned `401`
   `{"message":"Unauthenticated."}`.
4. Subsequent session-backed
   `POST /api/v1/databases/{redis-id}/restart` still returned `401`
   `{"message":"Unauthenticated."}`.

Result: the runner can authenticate to the Coolify UI login surface but still
does not obtain a usable authenticated API mutation session for the Redis
restart endpoint.

## Conclusion

Current protected-gate state on Friday, July 17, 2026:

`BLOCKED / REDIS_RESTARTING_UNHEALTHY / API_READY_503 / BEARER_RESTART_403_DEPLOY / OWNER_LOGIN_200_BUT_SESSION_API_401`

`LUC-1368` did not produce a deploy-capable Redis recovery path. The remaining
blocker is exact:

- the bearer path is still missing deploy permission;
- the owner-login session path still does not authenticate the Coolify API.

## Required Unblock

1. Security Review Lead or Ops Release Lead provides a deploy-capable Coolify
   bearer/session mutation path to this runner, or performs the one Redis
   recovery action directly.
2. After Redis is healthy, rerun:
   - API `/health`
   - API `/ready`
   - Web `/`
   - Web `/api/build-info`
   - protected `/ready/details`
