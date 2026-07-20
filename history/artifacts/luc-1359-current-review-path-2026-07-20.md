LUC-1359 is now in_review pending the existing LUC-1524 request_confirmation gate for Redis AOF recovery.

Current live state on 2026-07-20:
- API /health -> 200
- API /ready -> 503
- Web / -> 200
- Web /api/build-info -> 200
- Coolify redis -> exited:unhealthy
- Coolify bearer-token Redis restart/start -> 403 Missing required permissions: deploy

Important update:
- LUC-1524 already has a pending request_confirmation interaction titled "Confirm Redis cache-only recovery" with idempotencyKey `confirmation:LUC-1524:redis-aof-recovery:v1`.
- A duplicate request_confirmation attempt from this runner was rejected with `Issue is outside this actor's authorization boundary`.

Next owner/action:
- board/user review of the existing LUC-1524 gate; once accepted, route exactly one execution issue to DRE for the approved Redis recovery action.