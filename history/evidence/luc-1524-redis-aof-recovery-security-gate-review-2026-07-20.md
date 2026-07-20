# LUC-1524 Redis AOF Recovery Security Gate Review

Date: 2026-07-20

## Scope

Security review for [LUC-1524](/LUC/issues/LUC-1524), scoped to classifying
the Soar production Redis data boundary after a failed restart and defining the
narrowest governed recovery path.

No Redis mutation, SSH use, secret disclosure, deployment, rollback, or
production state change was performed from this issue.

## Decision

Soar Redis is classified as disposable cache / coordination / runtime-support
state, not the system of record for durable business truth.

That means:

- AOF repair is not needed to preserve Soar business data.
- The narrowest recovery path is a backup of the Redis persistent volume,
  followed by removal of the broken Redis AOF files and a Redis restart so the
  cache can rebuild empty.
- Because the recovery is destructive to Redis-local state, the owner still
  needs to confirm the exact recovery action before execution.

## Evidence

### Architecture and data-model evidence

- `docs/architecture/02_system-topology.md` states Redis is for cache,
  coordination, and runtime support.
- `docs/architecture/07_modes-parity-and-data.md` states Redis supports caches,
  coordination, and runtime support services, and that runtime truth must be
  durable in PostgreSQL.

### Code evidence

- `apps/api/src/config/runtimeDependencyReadiness.ts` only pings Redis for
  readiness and treats failure as a dependency check, not a data recovery
  contract.
- `apps/api/src/middleware/rateLimit.ts` uses Redis for rate-limit buckets with
  an in-memory fallback when Redis is unavailable.
- `apps/api/src/modules/market-stream/marketStreamFanout.ts` uses Redis for
  pub/sub fanout and NX/PX warmup locks with TTL semantics.
- `apps/api/src/workers/workerHeartbeat.ts` stores worker heartbeats in Redis
  with TTL expiry.
- `apps/api/src/modules/backtests/backtestRunQueue.ts` uses Redis for queue,
  processing, and dedupe keys only.
- `apps/api/src/modules/engine/runtimePositionState.store.ts` stores runtime
  position state with a 6-hour TTL and explicit in-memory fallback; it is
  non-blocking and non-durable by design.

### Runbook evidence

- `docs/operations/redis-aof-recovery-runbook.md` explicitly separates the
  AOF-repair path from the cache-only fallback.
- The cache-only fallback is only appropriate when Redis is limited to
  rate limits, transient runtime fanout, warmup locks, and cache-like data.

### Incident lineage

- [LUC-1374](/LUC/issues/LUC-1374) proved the restart-only path did not restore
  readiness.
- [LUC-1359](/LUC/issues/LUC-1359) remains the upstream production readiness
  incident that this gate is helping to unblock.

## Recovery Boundary

The correct governed boundary for the next operational step is:

1. Preserve a backup of the Redis persistent volume.
2. Remove only the broken Redis AOF files / manifest if the owner accepts the
   cache-only rebuild path.
3. Restart Redis.
4. Recheck `redis-cli PING`, Soar `/health`, Soar `/ready`, protected
   `/ready/details`, and worker readiness.

This review did not require SSH material or direct host binding. Existing
Coolify read-only bindings are sufficient for readback evidence; any SSH-based
mutation path would require separate approval and is not used here.

## Authorization Posture

This issue should not transition to `done`.

It should wait on a typed `request_confirmation` interaction that asks the
owner to approve:

- backup of the Redis persistent volume,
- cache-only rebuild by removing the broken AOF files,
- Redis restart,
- and the follow-up smoke sequence.

## Residual Risk

If the owner rejects the cache-only rebuild, Redis remains fail-closed and the
production readiness incident stays blocked.

If the owner later claims Redis contains durable business data, that would
require a separate evidence review because the current code and docs do not
support that claim.
