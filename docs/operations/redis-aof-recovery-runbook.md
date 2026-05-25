# Redis AOF Recovery Runbook

Date: 2026-05-02

## Purpose

Recover production Redis when the container crash-loops on a corrupted
append-only file, and keep future deployments from passing while Redis is
unavailable.

## Symptoms

- Coolify shows the `redis` database as `Restarting` / `unhealthy`.
- The container restart counter keeps increasing.
- API auth can fail with `Rate limit temporarily unavailable` or time out.
- Market-stream fanout can stop publishing runtime events to dashboard
  subscribers.
- Redis logs include:
  `Bad file format reading the append only file ... redis-check-aof --fix`.

## Immediate Recovery

1. Confirm the Redis resource is the Soar production Redis in Coolify.
2. Stop dependent app/worker services or place the system in a short
   maintenance window if user traffic is active.
3. Back up the Redis persistent volume before editing AOF files.
4. Run Redis AOF repair against the manifest named by the Redis log message,
   for example:

```bash
redis-check-aof --fix /data/appendonlydir/appendonly.aof.manifest
```

5. Start Redis and verify `redis-cli PING` returns `PONG`.
6. Restart API and worker services so rate-limit, market-stream publisher, and
   subscribers reconnect cleanly.
7. Run the post-deploy smoke gate with authenticated auth and worker checks.

## Cache-Only Fallback

If Redis is being used only for rate limits, transient runtime fanout, warmup
locks, and cache-like data, and AOF repair fails, the approved recovery option
is to preserve a backup and remove the broken AOF files so Redis can rebuild an
empty cache. Do not use this option if Redis has been promoted to store durable
business state.

## Prevention

- Production `/ready` must check Redis `PING`, not only secret presence.
- Deploy smoke must fail if `/ready` reports Redis dependency failure.
- Coolify should alert on Redis `restarting:unhealthy` and restart-count
  growth.
- Redis persistence mode must match data criticality:
  - cache/fanout/rate-limit Redis can prefer non-AOF or less strict persistence;
  - durable Redis requires AOF backups, tested repair, and restore drills.

## Verification

- Coolify Redis status is `running:healthy`.
- `GET /ready` returns `200`.
- Authenticated login succeeds.
- `/workers/health` and `/workers/ready` are green for the split-worker
  topology.
- Market-stream SSE emits at least one real market event after deployment.
