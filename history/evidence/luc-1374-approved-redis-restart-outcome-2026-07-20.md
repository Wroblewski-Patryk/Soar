# LUC-1374 Approved Redis restart outcome

Date: 2026-07-20

## Scope

DRE follow-up after the local-board comment at `2026-07-20T19:54:53.570Z`
stated that the deploy-permission blocker was removed through `LUC-1387` and
explicitly approved exactly one Redis restart mutation using
`$env:COOLIFY_DEPLOY_API_TOKEN`.

This heartbeat used the approved scope only:

1. presence-only env verification for `COOLIFY_DEPLOY_API_TOKEN`
2. exactly one `POST` restart against the Redis resource named by
   `COOLIFY_SOAR_REDIS_RESOURCE_ID`
3. post-restart Redis readback
4. post-restart Soar public `/health` and `/ready` probes

All Coolify proof commands were run from:

`C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse`

No extra Redis `start`/`stop`, no redeploy, no rollback, no env edit, no
database mutation, no secret-value disclosure, and no account/trading mutation
was performed.

## Approved Mutation

- `COOLIFY_DEPLOY_API_TOKEN` was present by name in the runner.
- Pre-restart attempt to `GET /api/v1/databases/{redis}` with the deploy token
  returned `403`, so the deploy token appears narrower than the read-only
  token for `GET` access in this runner.
- Approved mutation:
  `POST /api/v1/databases/{redis-id}/restart` with
  `$env:COOLIFY_DEPLOY_API_TOKEN` -> `200`
  `{"message":"Database restarting request queued."}`

## Post-Restart Redis Readback

Readback used the read-only Coolify token after the approved restart.

Poll window: 8 polls, 10 seconds apart, from roughly `19:55:55Z` through
`19:57:16Z` on Monday, July 20, 2026.

Observed result on every Redis poll:

- `status=exited:unhealthy`
- `restart_count=0`
- `updated_at=2026-07-20T19:55:36.000000Z`
- `last_online_at=2026-07-20 19:55:36`

Resource summary after the restart:

- Coolify `GET /api/v1/resources` reports
  `redis -> exited:unhealthy`
  at `2026-07-20T19:55:36.000000Z`.

## Post-Restart Public Smoke

Across the same 8-poll observation window:

- API `/health` remained `200` on every poll.
- API `/ready` remained `503` on every poll.

Representative timestamps:

- `/health` `200` at `2026-07-20T19:55:55.502Z`
- `/health` `200` at `2026-07-20T19:57:16.441Z`
- `/ready` `503` at every matching poll in that window

## Operational Interpretation

What is directly proved by this heartbeat:

- the earlier deploy-permission blocker is resolved for the approved restart
  action
- the approved single Redis restart was executed successfully
- Redis did not recover after that restart
- the Soar API readiness probe did not recover after that restart

What is not directly proved by this heartbeat:

- exact Redis container log root cause
- exact file-level Redis persistence defect

Inference from repository runbook only:

- this failure pattern remains consistent with the Redis AOF recovery class
  documented in `docs/operations/redis-aof-recovery-runbook.md`, which names
  recurring `Restarting` / `unhealthy` Redis incidents and the manual
  `redis-check-aof --fix` / cache-rebuild recovery path.

That inference is a runbook-guided classification, not a direct log proof from
this heartbeat.

## Conclusion

Current runtime state after the approved restart is:

`BLOCKED / APPROVED_RESTART_EXECUTED / REDIS_EXITED_UNHEALTHY / API_HEALTH_200 / API_READY_503`

The blocker is no longer the Coolify deploy permission. The blocker is now the
underlying Redis resource failure after restart, which needs manual host- or
Coolify-level repair beyond the one approved restart action.

## Required Unblock

Named unblock owner and action:

1. Ops Release Lead or Security Review Lead performs the next governed Redis
   recovery step from `docs/operations/redis-aof-recovery-runbook.md`:
   back up the Redis volume, inspect the failing persistence path, and either
   repair the AOF manifest or use the approved cache-only rebuild path if that
   policy is confirmed safe.
2. After Redis is healthy, rerun:
   - `pnpm run softwarehouse:coolify-reconciler`
   - `pnpm run softwarehouse:soar-acceptance-ledger`
   - API `/health`
   - API `/ready`
   - protected `/ready/details`
3. If Redis becomes healthy and `/ready` still fails, continue with the next
   readiness branch after Redis: database ping or critical-secret readiness.
