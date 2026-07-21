# LUC-1553 Execute Approved Cache-Only Redis AOF Recovery

Date: 2026-07-20

## Scope

Executed the approved cache-only Redis AOF recovery path for the Soar
production Redis after the restart failure and subsequent worker heartbeat
loss.

This heartbeat did not touch application source code, exchange workflows,
account state, or any non-Redis production data store.

## Recovery Actions

### 1. Preserved Redis volume backup

Created a compressed backup of the Redis persistent volume on the VPS before
removing AOF files.

### 2. Removed broken AOF files

Removed only the Redis append-only files from the production Redis volume so
Redis could rebuild its cache state on restart.

### 3. Restarted Redis through Coolify

Issued the Coolify database restart request for the production Redis resource
and waited for the container to report healthy.

### 4. Freed host disk pressure

The VPS root filesystem was at 97% usage and worker logs showed:
`MISCONF Errors writing to the AOF file: No space left on device`.

Pruned Docker build cache only, reclaiming 2.686 GB, which raised free space
on the host to about 4.9 GB and reduced root usage to 94%.

## Verification

### Host and Redis runtime

- Redis resource status returned to `running:healthy`.
- Redis container status remained `running` and healthy after the restart.
- Host free space increased from about `2.7 GB` to `4.9 GB`.

### Worker and API smoke

Authenticated production smoke against:

- `https://api.soar.luckysparrow.ch`
- `https://soar.luckysparrow.ch`

Result: all checks passed.

- `API /health -> 200`
- `API /ready -> 200`
- `WEB / -> 200`
- `WEB /api/build-info -> 200`
- `API /workers/ready -> 200`

### Monitoring readback

Worker logs previously showed `MISCONF` AOF write failures while the host was
disk constrained. After cache pruning and restart, the protected readiness
probe returned `200`, confirming the worker heartbeat path recovered.

## Evidence

- Runbook: `docs/operations/redis-aof-recovery-runbook.md`
- Security gate review: `history/evidence/luc-1524-redis-aof-recovery-security-gate-review-2026-07-20.md`
- Smoke check: `node scripts/deploySmokeCheck.mjs --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`

## Outcome

The approved cache-only Redis AOF recovery is complete. Redis is healthy,
host storage pressure has been reduced, and the production smoke gate,
including protected worker readiness, now passes.

