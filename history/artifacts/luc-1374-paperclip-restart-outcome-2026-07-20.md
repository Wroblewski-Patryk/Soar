Blocked on Monday, July 20, 2026 after the approved Redis restart.

Comment handling:
- The local-board comment at `2026-07-20T19:54:53.570Z` changed the blocker class.
- `COOLIFY_DEPLOY_API_TOKEN` was present and used explicitly for the approved mutation.
- Exactly one approved mutation was executed:
  `POST /api/v1/databases/{redis-id}/restart` -> `200`
  `{"message":"Database restarting request queued."}`

Outcome:
- The permission blocker is resolved for this one restart action.
- Redis did not recover.
- Post-restart Coolify readback shows `redis -> exited:unhealthy` at `2026-07-20T19:55:36Z`.
- Post-restart public probes show API `/health` stayed `200` while API `/ready` stayed `503` throughout the observation window.

New blocker:
- The issue is no longer blocked on missing deploy permission.
- It is now blocked on underlying Redis resource repair after a successful restart attempt.

Required unblock owner/action:
1. Ops Release Lead or Security Review Lead performs the next governed Redis recovery step from `docs/operations/redis-aof-recovery-runbook.md`:
   back up the Redis volume, inspect the failing persistence path, and either repair the AOF manifest or use the approved cache-only rebuild path if that policy is confirmed safe.
2. After Redis becomes healthy, rerun:
   - `pnpm run softwarehouse:coolify-reconciler`
   - `pnpm run softwarehouse:soar-acceptance-ledger`
   - API `/health`
   - API `/ready`
   - protected `/ready/details`
3. If Redis becomes healthy and `/ready` still fails, continue with the next readiness branch after Redis.

Evidence:
- `history/evidence/luc-1374-approved-redis-restart-outcome-2026-07-20.md`
