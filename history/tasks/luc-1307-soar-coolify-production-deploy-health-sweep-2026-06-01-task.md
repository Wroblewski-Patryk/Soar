# LUC-1307 - [Soar] Coolify production deploy health sweep (2026-06-01)

## Context
Critical Ops Release Lead continuation heartbeat (`issue_continuation_needed`) requiring fresh production deploy-health truth for canonical Soar hosts.

## Goal
Capture fresh read-only production health evidence and leave a clear disposition for this heartbeat.

## Constraints
- Read-only verification only.
- No deployment, restart, rollback, secret, or environment mutation.

## Definition of Done
- Public probes executed and status codes captured.
- Source snapshot captured (`HEAD`, `origin/main`).
- Build-info readback captured for deploy-freshness parity.
- Evidence persisted in `history/evidence/`.
- `TASK_BOARD` and `PROJECT_STATE` synchronized with final disposition.

## Forbidden
- Any production mutation.
- Any secret-value exposure.

## Stage
- `verification`

## Result Report
- Outcome: `done`.
- Commands executed:
  - `git rev-parse HEAD`
  - `git rev-parse origin/main`
  - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`
  - `Invoke-RestMethod -Uri https://soar.luckysparrow.ch/api/build-info -Method Get`
  - `Invoke-WebRequest -Uri https://api.soar.luckysparrow.ch/workers/ready -Method Get` (no token)
- Summary:
  - API `/health`, API `/ready`, Web `/`, and Web `/api/build-info` returned `200`.
  - Build-info reports `gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`, `gitRef=main`, `metadataSource=github-branch`, `buildId=9_MzvzTWKAhz25Nco5xPY`.
  - Protected endpoint `/workers/ready` returned `401` without credentials (expected fail-closed behavior).
  - No mutation actions were performed.
- Evidence:
  - `history/evidence/luc-1307-coolify-production-deploy-health-sweep-2026-06-01.md`
- Residual risk:
  - Sweep scope excludes authenticated protected worker-principal checks in this heartbeat.
