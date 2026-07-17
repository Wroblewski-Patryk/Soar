Blocked on Friday, July 17, 2026.

Summary:
- Fresh public production probes reconfirmed API `/health` `200`, API `/ready` `503`, Web `/` `200`, and Web `/api/build-info` `200`.
- Fresh Coolify readback at `2026-07-17T16:31:37Z` still shows production `redis` as `restarting:unhealthy` with `restart_count=682`, while `postgresql` remains `running:healthy`.
- Fresh bearer-token Redis mutation probes still fail:
  - `POST /api/v1/databases/{redis-id}/restart` -> `403 Missing required permissions: deploy`
  - `POST /api/v1/databases/{redis-id}/start` -> `403 Missing required permissions: deploy`
  - `POST /api/v1/databases/{redis-id}/stop` -> `403 Missing required permissions: deploy`

Blocker:
- Remaining restore step still requires a deploy-capable Coolify Redis mutation path that is not available in this runner.

Required unblock owner/action:
1. Ops Release Lead or Security Review Lead provides deploy-capable Coolify credentials for the Redis resource or executes the single Redis recovery action directly.
2. After Redis recovers, rerun:
   - API `/health`
   - API `/ready`
   - Web `/`
   - Web `/api/build-info`
   - protected `/ready/details`
3. If API `/ready` still fails after Redis is healthy, continue with the next readiness branch: database ping or critical-secret readiness.

Evidence:
- `history/evidence/luc-1374-diagnose-and-recover-redis-restarting-unhealthy-2026-07-17.md`
- `history/tasks/luc-1374-diagnose-and-recover-redis-restarting-unhealthy-2026-07-17-task.md`
