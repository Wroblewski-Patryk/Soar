Blocked on Friday, July 17, 2026.

Summary:
- Public production probes reconfirmed API `/health` `200`, API `/ready` `503`, Web `/` `200`, and Web `/api/build-info` `200`.
- Readiness code inspection shows `/ready` fails closed on critical-secret readiness or runtime dependency readiness.
- Coolify readback narrows the live fault to production Redis: `redis` is `restarting:unhealthy` while `postgresql` remains `running:healthy` and Soar applications remain `running:unknown`.
- The bound Coolify API token is read-only for this recovery surface: Redis `restart` / `start` / `stop` all return `403 Missing required permissions: deploy`.
- Coolify UI session login with the bound `COOLIFY_LOGIN_*` credentials succeeded (`two_factor=false`), but the API restart path still returned `401 Unauthenticated`.

Blocker:
- Remaining restore step requires a deploy-capable Coolify Redis mutation path that is not available in this runner.

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
- `history/evidence/luc-1359-restore-production-api-ready-503-runtime-2026-07-17.md`
- `history/tasks/luc-1359-restore-production-api-ready-503-runtime-2026-07-17-task.md`
