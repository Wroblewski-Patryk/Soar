# Redis AOF Recovery - 2026-05-07

## Summary
Production Redis in Coolify entered a crash loop on 2026-05-07 because Redis
could not load its incremental AOF file.

## Impact
- API `/health`: `200`
- API `/ready`: `503` before recovery because Redis was unavailable
- Web `/auth/login`: `200`
- Coolify Redis resource: `Restarting (unhealthy)`, over 670 restarts

## Root Cause Evidence
Coolify Redis logs repeatedly reported:

```text
Bad file format reading the append only file appendonly.aof.5.incr.aof:
make a backup of your AOF file, then use ./redis-check-aof --fix
```

Redis loaded the base AOF RDB, then failed on:

```text
appendonlydir/appendonly.aof.5.incr.aof
```

## Recovery Actions
1. Switched Coolify to Root Team and opened Soar production Redis.
2. Identified Redis container:

```text
tsij579cy1kfcuxs8onbbxll
```

3. Identified Redis volume:

```text
redis-data-tsij579cy1kfcuxs8onbbxll
```

4. Stopped the crash-looping Redis container.
5. Created a volume-local backup before repair:

```text
/data/redis-aof-backup-20260507141035.tgz
```

6. Ran Redis AOF repair against the incremental AOF:

```bash
redis-check-aof --fix appendonlydir/appendonly.aof.5.incr.aof
```

Repair result:

```text
AOF analyzed: size=2338238, ok_up_to=1257460, diff=1080778
Successfully truncated AOF appendonlydir/appendonly.aof.5.incr.aof
```

7. Started Redis again.

## Verification
- Docker status after restart:

```text
tsij579cy1kfcuxs8onbbxll Up (healthy)
```

- Coolify status after restart:

```text
redis (localhost) Running (healthy)
```

- Redis log after restart:

```text
DB loaded from incr file appendonly.aof.5.incr.aof
Ready to accept connections tcp
Background saving terminated with success
```

- Public smoke:

```text
GET https://api.soar.luckysparrow.ch/health -> 200
GET https://api.soar.luckysparrow.ch/ready -> 200
GET https://soar.luckysparrow.ch/auth/login -> 200
```

## Follow-Up
- Monitor Redis restart count and `/ready` during the next deploy cycle.
- If AOF corruption recurs, consider adding an explicit Redis AOF recovery
  runbook section or reviewing Redis persistence mode for this workload.
- Coolify showed multiple queued/in-progress deployments during the incident;
  verify the deployment queue is drained before declaring the full production
  environment quiet.
