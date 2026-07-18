# LUC-1460 - Production `/ready` 503 diagnosis - 2026-07-18

## Summary

`https://api.soar.luckysparrow.ch/ready` still returns HTTP `503` on Saturday, July 18, 2026. The narrowest evidence-backed classification remains: Soar API readiness is implemented in code, public behavior is verified, and the currently failing dependency is production `redis`, not the public web surface and not an unproven code regression.

## Exact evidence used

### Public read-only probes

- `GET https://api.soar.luckysparrow.ch/health` -> `200 {"status":"ok","service":"api",...}`
- `GET https://api.soar.luckysparrow.ch/ready` -> `503 {"status":"not_ready","service":"api"}`
- `GET https://soar.luckysparrow.ch/api/build-info` -> `200 {"buildId":"lyjMpIXMK3BggQfTjTOEL","gitSha":"b0b2c2ce9477a32fcda7717f447ad46aa4327589","gitRef":"main",...}`
- `GET https://soar.luckysparrow.ch/` -> `200`

### Local code readback

- `apps/api/src/router/index.ts`
  - `/ready` returns `503 {"status":"not_ready","service":"api"}` only when either:
    - `evaluateCriticalSecretsReadiness()` is not ready, or
    - `evaluateRuntimeDependencyReadiness()` is not ready.
- `apps/api/src/config/runtimeDependencyReadiness.ts`
  - readiness fails on:
    - Redis when `REDIS_REQUIRED` is effectively enabled and Redis `PING` fails
    - Postgres when DB query `SELECT 1` fails
- `apps/api/src/config/criticalSecretsReadiness.ts`
  - secret readiness validates `JWT_SECRET`, `API_KEY_ENCRYPTION_KEYS`, and related rotation/keyring rules.

### Existing source-of-truth evidence reused

- `.agents/state/system-health.md`
  - `2026-07-17 LUC-1368 protected Redis recovery path reprobe`
  - `2026-07-17 LUC-1387 Redis owner-path restoration gate`
  - `2026-07-17 LUC-1374 Redis restarting:unhealthy recheck`
- Those entries already prove the last exact failing production dependency surface:
  - Coolify Redis resource `redis -> restarting:unhealthy`
  - Postgres `postgresql -> running:healthy`
  - Redis recovery mutation path still blocked:
    - bearer `POST /api/v1/databases/{redis}/restart` -> `403 Missing required permissions: deploy`
    - owner-session follow-up recovery path -> `401 Unauthenticated`

## Classification

- Public API `/ready`: `implemented and verified`
- Public API `/ready/details`: `present in code, behavior unknown`
  - protected route; not re-run from this issue
- Root cause classification: `blocked by exact gate`
  - exact failing dependency/resource: production Coolify `redis`
- Public web root `/`: `implemented and verified`
- Public web build metadata `/api/build-info`: `implemented and verified`
  - current public runtime metadata:
    - `gitSha=b0b2c2ce9477a32fcda7717f447ad46aa4327589`
    - `buildId=lyjMpIXMK3BggQfTjTOEL`
    - `gitRef=main`

## Narrowest recovery lane

No new permit lane should be created from `LUC-1460`.

The narrowest existing owner path is already active:

- `LUC-1387` - single-action owner confirmation gate for exactly one Redis recovery action
  - action: `POST /api/v1/databases/{redis-id}/restart`
  - state in project truth: `IN_REVIEW / REDIS_RECOVERY_OWNER_PATH_PENDING_CONFIRMATION`

Related technical blocker:

- `LUC-1368` - deploy-capable Redis recovery path remains blocked until Security Review Lead or Ops Release Lead provides a deploy-capable owner/session path or performs that one Redis recovery action directly.

## Rollback implication

Unknown from public evidence alone. Current public evidence identifies the deployed Soar web SHA/build metadata and the failing dependency class, but it does not prove a new bad deploy. The current failure pattern is operational dependency failure (`redis restarting:unhealthy`) rather than a freshly classified application-code rollout regression.

## Required next owner/action

- Owner: Security Review Lead or Ops Release Lead
- Action: accept or execute the single Redis recovery action already narrowed in `LUC-1387`, or provide the least-privilege deploy-capable Coolify mutation path for that one action.
- After that action: DRE reruns bounded public readiness smoke and, if permit allows, protected diagnostics confirmation.
