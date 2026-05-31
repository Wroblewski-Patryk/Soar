# LUC-1065 - [Soar] Coolify production deploy health sweep (2026-05-31)

## Context
Critical Ops Release Lead heartbeat for fresh production deploy-health truth on Soar canonical hosts.

## Goal
Capture fresh read-only production health evidence and leave a clear issue disposition.

## Constraints
- Read-only verification only.
- No deployment, restart, rollback, secret, or environment mutation.

## Definition of Done
- Public probes executed and status codes captured.
- Source snapshot captured (`HEAD`, `origin/main`).
- Evidence persisted in `history/evidence/`.
- `TASK_BOARD` and `PROJECT_STATE` synchronized with final disposition.

## Forbidden
- Any production mutation.
- Any secret-value exposure.

## Stage
- `verification`

## Result Report
- Outcome: `blocked`.
- Commands executed:
  - `git rev-parse HEAD`
  - `git rev-parse origin/main`
  - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`
  - direct endpoint recheck via `Invoke-WebRequest`
- Summary:
  - all four canonical public endpoints returned `503`;
  - `build-info` remained unavailable due to `503` response;
  - no mutation actions were performed.
- Evidence:
  - `history/evidence/luc-1065-coolify-production-deploy-health-sweep-2026-05-31.md`
- Residual risk:
  - production runtime availability remains degraded on canonical public hosts.
- Unblock owner/action:
  1. Ops Release Lead + platform/Coolify runtime owner restore canonical production availability and publish no-mutation incident note for the `503` interval.
  2. After recovery, rerun one read-only production health sweep and publish fresh evidence.

## Continuation - finish_successful_run_handoff
- Wake acknowledged from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Additional concrete read-only diagnostics executed:
  - `Invoke-WebRequest -Method Head` for:
    - `https://api.soar.luckysparrow.ch/health`
    - `https://api.soar.luckysparrow.ch/ready`
    - `https://soar.luckysparrow.ch/`
    - `https://soar.luckysparrow.ch/api/build-info`
- Continuation outcome:
  - all four endpoints still return `503`,
  - `Server` and `x-request-id` headers were not present in returned responses,
  - failed-deploy diagnosis child lane artifact is present:
    `history/tasks/luc-1027-child-read-only-failed-deploy-diagnosis-2026-05-31-task.md`.
- Continuation disposition: `blocked` (no mutation path).

## Continuation - source_scoped_recovery_action
- Wake acknowledged from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Additional concrete read-only continuity diagnostics executed:
  - `git rev-parse HEAD` -> `fe041ecf324f4dcbb5b587875e2338c73d032eab`
  - `git rev-parse origin/main` -> `2dc983ced4a4c66e31e7f37264710c124955e57b`
  - `Invoke-WebRequest -Method Head` for canonical endpoints.
- Continuation outcome:
  - `https://api.soar.luckysparrow.ch/health -> 503`
  - `https://api.soar.luckysparrow.ch/ready -> 503`
  - `https://soar.luckysparrow.ch/ -> 503`
  - `https://soar.luckysparrow.ch/api/build-info -> 503`
- Continuation disposition: `blocked` (no mutation path).
- First-class unblock owner/action:
  1. Ops Release Lead + platform/Coolify runtime owner restore canonical production availability and publish no-mutation incident note for the `503` interval.
  2. After recovery, rerun one read-only production health sweep and publish fresh evidence.
