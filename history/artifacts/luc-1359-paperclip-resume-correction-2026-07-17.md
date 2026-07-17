Resume correction on Friday, July 17, 2026.

The `issue_blockers_resolved` wake does not match live runtime state.

Recheck performed after the wake:
- API `/health` -> `200`
- API `/ready` -> `503`
- Web `/` -> `200`
- Web `/api/build-info` -> `200`
- Coolify `GET /api/v1/databases/{redis}` still shows `status=restarting:unhealthy`
- Coolify bearer-token Redis `restart` / `start` still return `403 Missing required permissions: deploy`

Issue-thread correction:
- The janitor note that routed `LUC-1359` to source-control closure `LUC-1365` is not the real blocker for this runtime incident.
- Local dirty state does not prevent the production Redis recovery step.
- The actual blocker remains operational: a deploy-capable Coolify Redis mutation path is still unavailable in this runner, or Ops must execute the Redis recovery directly.

Required unblock owner/action:
1. Ops Release Lead or Security Review Lead provides deploy-capable Coolify credentials for the Redis resource or performs the single Redis recovery action directly.
2. After Redis recovery, rerun:
   - API `/health`
   - API `/ready`
   - Web `/`
   - Web `/api/build-info`
   - protected `/ready/details`
3. If API `/ready` still fails after Redis is healthy, continue with the next readiness branch: database ping or critical-secret readiness.

This issue should remain `blocked` on the real production recovery dependency, not on source-control closure.
