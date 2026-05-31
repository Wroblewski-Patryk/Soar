# LUC-1105 - [Soar] Coolify production deploy health sweep (2026-05-31)

## Context
Critical Ops Release Lead heartbeat for fresh production deploy-health truth on Soar canonical hosts after prior degraded availability (`503`) evidence.

## Goal
Capture fresh read-only production health evidence and leave a clear issue disposition.

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
  - `curl -s -o NUL -w "%{http_code}"` spot-checks for canonical endpoints
  - `curl -s https://soar.luckysparrow.ch/api/build-info`
- Summary:
  - API `/health`, API `/ready`, Web `/`, and Web `/api/build-info` all returned `200`;
  - build-info reports `gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe` from `main` with `metadataSource=github-branch`;
  - no mutation actions were performed.
- Evidence:
  - `history/evidence/luc-1105-coolify-production-deploy-health-sweep-2026-05-31.md`
- Residual risk:
  - sweep scope excludes protected worker/auth probes in this heartbeat.
## Continuation - finish_successful_run_handoff
- Wake acknowledged from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Additional concrete read-only continuity diagnostics executed:
  - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --skip-workers`
  - `curl https://soar.luckysparrow.ch/api/build-info`
- Continuation outcome:
  - all canonical public probes remained `200`,
  - build-info parity remained unchanged on `main` (`gitSha=6839cd6b8884e26eca735ce32cea98c1dadccfbe`).
- Continuation disposition: `done`.
- Evidence:
  - `history/evidence/luc-1105-coolify-production-deploy-health-sweep-2026-05-31.md`
