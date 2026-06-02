# LUC-1161 - Reconcile public green endpoints with restart evidence (2026-05-31)

## Scope
- Reconcile latest public smoke-green endpoints with restart/crash evidence already captured in `LUC-1160`.
- Read-only verification only; no deploy/restart/mutation.

## Timestamp
- 2026-05-31T23:49:00+02:00 (Europe/Berlin)

## Inputs Reconciled
1. `history/evidence/luc-1160-coolify-restart-loop-diagnosis-2026-05-31.md`
2. `history/artifacts/luc-1163-workers-ready-smoke-recheck-2026-05-31.json`
3. Fresh recheck in this heartbeat:
   - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
   - `Invoke-RestMethod https://soar.luckysparrow.ch/api/build-info`

## Reconciled Facts
- Public endpoints are green and stable at probe time:
  - `API /health -> 200`
  - `API /ready -> 200`
  - `WEB / -> 200`
  - `WEB /api/build-info -> 200`
- Current public build-info remains:
  - `gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`
  - `buildId=9_MzvzTWKAhz25Nco5xPY`
  - `metadataGeneratedAt=2026-05-31T15:39:59.210Z`
  - `checkedAt=2026-05-31T21:49:10.142Z`
- Restart evidence still indicates a recent API crash/restart in Coolify history:
  - `last_restart_type=crash`
  - `last_restart_at=2026-05-31T21:08:45.000000Z`
  - `restart_count=2` for `soar-api` (from `LUC-1160` evidence packet)
- Protected readiness path remains auth-gated:
  - `API /workers/ready -> 401` in smoke (both prior and fresh recheck)

## Reconciliation Verdict
- Public reachability and build metadata are currently healthy (`implemented and verified`).
- Restart/crash history is real and unresolved at root-cause level (`implemented but not verified` for cause classification).
- No contradiction: both statements are simultaneously true (recovered public green + unresolved crash origin).
- Release confidence for runtime internals remains blocked by protected evidence gap.

## Residual Risk
- A transient production crash can recur without pre-crash host-level logs/events.
- Public green checks alone are insufficient to claim runtime/worker safety.

## Next Owner / Action
1. Ops Release Lead + platform/Coolify owner:
   - provide pre-crash retention logs/events around `2026-05-31T21:08:45Z` for cause classification.
2. Security-approved read-only principal owner:
   - provide/validate authorized probe path and rerun one protected `/workers/ready` smoke to move gate from `blocked`.

## Continuation Recheck (finish_successful_run_handoff)
- Recheck time: `2026-05-31T23:52:17.7430739+02:00` (Europe/Berlin)
- Smoke command rerun:
  - `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
- Result:
  - `API /health -> 200`
  - `API /ready -> 200`
  - `WEB / -> 200`
  - `WEB /api/build-info -> 200`
  - `API /workers/ready -> 401`
- Build-info refresh:
  - `gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`
  - `buildId=9_MzvzTWKAhz25Nco5xPY`
  - `metadataGeneratedAt=2026-05-31T15:39:59.210Z`
  - `checkedAt=2026-05-31T21:52:18.645Z`
- Continuation verdict unchanged:
  - public probes are green but are not sufficient to claim full readiness;
  - restart evidence + protected gate (`/workers/ready` unauthorized) keeps LUC-241 readiness blocked.
