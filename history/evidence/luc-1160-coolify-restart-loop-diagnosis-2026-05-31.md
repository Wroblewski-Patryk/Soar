# LUC-1160 - Coolify restart-loop diagnosis evidence (2026-05-31)

## Scope
- Read-only production diagnostics for Soar availability and Coolify restart indicators.
- No mutation performed.

## Timestamp
- 2026-05-31T23:20:00+02:00 (Europe/Berlin)
- Continuation refresh: 2026-05-31T23:31:00+02:00 (Europe/Berlin)

## Public Probe Snapshot
- `https://api.soar.luckysparrow.ch/health -> 200`
- `https://api.soar.luckysparrow.ch/ready -> 200`
- `https://soar.luckysparrow.ch/ -> 200`
- `https://soar.luckysparrow.ch/api/build-info -> 200`

## Build Info Snapshot
- `gitSha`: `6839cd6b8884e26eca735ce32cea98c1dadccfbe`
- `gitRef`: `main`
- `metadataGeneratedAt`: `2026-05-31T15:39:59.210Z`
- `checkedAt`: `2026-05-31T21:13:51.459Z`

## Coolify Read-Only State (Soar apps)
- `soar-api`: `status=running:unknown`, `last_restart_type=crash`, `last_restart_at=2026-05-31T21:08:45.000000Z`, `restart_count=2`
- `soar-web`: `status=running:unknown`, `restart_count=0`
- `workers-backtest`: `status=running:unknown`, `restart_count=0`
- `workers-execution`: `status=running:unknown`, `restart_count=0`
- `workers-market-data`: `status=running:unknown`, `restart_count=0`
- `workers-market-stream`: `status=running:unknown`, `restart_count=0`

## Protected Endpoint Readability (no-auth check)
- `GET /workers/health -> 401`
- `GET /workers/ready -> 401`
- `GET /alerts -> 401`
- `GET /metrics -> 401`

## Collected Artifacts
- `history/artifacts/luc-1160-soar-api-logs-redacted-snippet-2026-05-31.txt`
  - contains post-recovery API request logs (200 responses);
  - no fatal stack trace visible in this returned log window.

## Diagnostic Conclusion
- Active restart loop is **not** confirmed at the end of this heartbeat.
- A transient API crash/restart did occur (`last_restart_type=crash`) and recovered automatically.
- Root-cause classification remains **unproven** due missing pre-crash stack trace in available log slice.

## Continuation Recheck (same issue heartbeat)
- Command: `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  - Result: PASS (`/health`, `/ready`, `/`, `/api/build-info` all `200`).
- Command: `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch`
  - Result: FAIL (`HTTP 401`, protected endpoint).
- Public availability sample window:
  - 20 probe rounds, 3-second cadence, targets `/health` and `/ready`.
  - Result: `20/20` success for each endpoint (`200` only), no transient failures in this window.

## Final Disposition For LUC-1160
- `blocked`
- Blocker owner/action:
  1. Ops Release Lead + platform/Coolify owner: provide pre-crash host/Coolify log retention around `2026-05-31T21:08:45Z` for crash classification.
  2. Security-approved read-only auth principal: permit protected runtime probes (`/workers/ready`, `/alerts`, `/metrics`) to rule out hidden runtime degradation.

## Required Follow-up
1. Retrieve host-level pre-crash logs/events around `2026-05-31T21:08:45Z` to classify cause.
2. Execute protected worker/alerts probes with approved read-only auth to exclude hidden runtime instability.
