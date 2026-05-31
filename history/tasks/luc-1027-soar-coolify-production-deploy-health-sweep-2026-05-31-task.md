# LUC-1027 - [Soar] Coolify production deploy health sweep (2026-05-31)

## Context
Critical Ops Release Lead heartbeat for fresh production deploy-health truth on Soar.

## Goal
Capture fresh read-only production health evidence and leave a clear disposition for the issue.

## Scope
- Public production probes on canonical hosts:
  - `https://api.soar.luckysparrow.ch/health`
  - `https://api.soar.luckysparrow.ch/ready`
  - `https://soar.luckysparrow.ch/`
  - `https://soar.luckysparrow.ch/api/build-info`
- No production mutation.

## Implementation Plan
1. Acknowledge wake payload and execute one read-only health sweep.
2. Record source ref snapshot (`HEAD`, `origin/main`) and probe outcomes.
3. Persist evidence to `history/evidence/`.
4. Sync project state files with final status and unblock owner/action.

## Acceptance Criteria
- Public probes executed and status codes captured.
- No deploy/restart/rollback/env mutation performed.
- Final disposition is explicit (`done`/`blocked`/`in_review`/`delegated`).

## Definition of Done
- Read-only health sweep evidence written.
- Task closure artifact written.
- `TASK_BOARD` and `PROJECT_STATE` updated with outcome and next owner/action.

## Result Report
- Outcome: `blocked`.
- Commands executed:
  - `git rev-parse HEAD`
  - `git rev-parse origin/main`
  - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`
  - direct probe recheck via `Invoke-WebRequest` for the same four endpoints
- Result summary:
  - all four canonical public endpoints returned `503`,
  - build-info payload was unavailable because endpoint returned `503`,
  - no mutation actions were taken.
- Evidence:
  - `history/evidence/luc-1027-coolify-production-deploy-health-sweep-2026-05-31.md`
- Residual risk:
  - production runtime availability degraded on canonical public hosts.
- Unblock owner/action:
  1. Ops Release Lead + platform/Coolify runtime owner restore canonical availability and publish no-mutation incident note for the `503` interval.
  2. After recovery, rerun one read-only health sweep and publish fresh evidence.

