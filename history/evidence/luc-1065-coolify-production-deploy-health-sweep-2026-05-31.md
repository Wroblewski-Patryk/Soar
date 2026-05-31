# LUC-1065 - Coolify Production Deploy Health Sweep (2026-05-31)

## Scope
- Read-only public production health check on canonical domains.
- No deploy/restart/rollback/env mutation.

## Execution Timestamp
- 2026-05-31T12:31:14+02:00

## Source Snapshot
- local `HEAD`: `fe041ecf324f4dcbb5b587875e2338c73d032eab`
- remote `origin/main`: `2dc983ced4a4c66e31e7f37264710c124955e57b`

## Probe Results
- `https://api.soar.luckysparrow.ch/health -> 503`
- `https://api.soar.luckysparrow.ch/ready -> 503`
- `https://soar.luckysparrow.ch/ -> 503`
- `https://soar.luckysparrow.ch/api/build-info -> 503`

## Tool Output Summary
- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`
  - `FAIL API /health -> 503`
  - `FAIL API /ready -> 503`
  - `FAIL WEB / -> 503`
  - `FAIL WEB /api/build-info -> 503`
  - `failed checks: 4`

## Disposition
- `blocked` (canonical production availability degraded).

## Unblock Owner / Action
1. Ops Release Lead + platform/Coolify runtime owner restore canonical production availability and publish no-mutation incident note for the `503` interval.
2. After recovery, rerun one read-only production health sweep and publish fresh evidence.

## Continuation - source_scoped_recovery_action
- Execution timestamp: `2026-05-31T14:39:00+02:00`.
- Additional read-only continuity recheck executed:
  - `git rev-parse HEAD`
  - `git rev-parse origin/main`
  - `Invoke-WebRequest -Method Head` on canonical API/Web endpoints.
- Snapshot:
  - local `HEAD`: `fe041ecf324f4dcbb5b587875e2338c73d032eab`
  - remote `origin/main`: `2dc983ced4a4c66e31e7f37264710c124955e57b`
- Recheck outcome:
  - `https://api.soar.luckysparrow.ch/health -> 503`
  - `https://api.soar.luckysparrow.ch/ready -> 503`
  - `https://soar.luckysparrow.ch/ -> 503`
  - `https://soar.luckysparrow.ch/api/build-info -> 503`
- Continuation disposition: `blocked` (no production mutation path opened in this heartbeat).
