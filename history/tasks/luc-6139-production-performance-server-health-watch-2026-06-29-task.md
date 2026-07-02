# LUC-6139 Production Performance And Server Health Watch - Task Contract

## Context

[LUC-6139](/LUC/issues/LUC-6139) assigned to DRE for a critical recurring
production performance and server-health watch.

## Goal

Verify current production health with the smallest read-only DRE proof packet:
public/protected deploy smoke, representative public/authenticated timing,
runtime freshness, rollback guard, and Coolify read-only projection.

## Constraints

- No deploy, push, restart, rollback execution, environment edit, secret/account
  value readback, DB/Redis mutation, raw log capture, production account
  mutation, subscription/payment mutation, exchange mutation, order, position,
  or live-trading action.
- Use existing approved smoke credential family only through process-local
  env-name mapping; do not print credential values.
- Keep the issue disposition explicit before ending the heartbeat.

## Definition of Done

- Deploy smoke passes or a blocker is recorded.
- Runtime freshness and rollback guard pass or a blocker is recorded.
- Representative timing sample is captured and interpreted.
- Coolify read-only production projection is captured.
- Evidence and project state are updated.
- Paperclip issue is updated with final disposition.

## Forbidden

- Production mutation.
- Secret value readback.
- Deploy/restart/rollback execution.
- Commit/push from the shared dirty worktree.
- Treating comments or local files as a live continuation path.

## Implementation Plan

1. Run existing production deploy smoke.
2. Run runtime freshness and rollback guard with approved smoke credential
   env-name mapping.
3. Sample public and authenticated production API timing.
4. Read Coolify status endpoints with GET-only calls.
5. Write evidence/task packet and update Paperclip issue.

## Acceptance Criteria

- All production health checks return pass results or fail-closed behavior.
- Any recurring watch item is named as residual risk.
- No protected action or mutation occurs.

## Result Report

Status: `DONE / VERIFIED_READ_ONLY / APP_HEALTHY /
MARKET_CATALOG_COLD_SAMPLE_WATCH / COOLIFY_QUEUE_WATCH`.

Validation:

- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`:
  PASS, including protected `/workers/ready -> 200`.
- Public timing: API `/health`, API `/ready`, Web `/`, and Web
  `/api/build-info` all returned `200:8`; max public sample `221.7 ms`.
- Authenticated dashboard/admin timing: all representative reads returned
  `200:3`; `/dashboard/markets/catalog` had one cold `1583.2 ms` sample.
- Focused `/dashboard/markets/catalog`: `200:8`, max `99.1 ms`.
- `pnpm exec node scripts/checkPostDeployRuntimeFreshness.mjs --base-url https://api.soar.luckysparrow.ch`:
  PASS with worker/market heartbeat age `2381 ms`, runtime signal lag `0 ms`,
  and five running sessions with no stale IDs.
- `pnpm exec node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch`:
  PASS, `shouldRollback=false`, topology `healthy`, alerts `[]`.
- Coolify read-only projection: version, current team, project, environments,
  production resources, resources, and deployments endpoints all returned
  `200`; eight production resources are visible.

Files changed:

- `history/evidence/luc-6139-production-performance-server-health-watch-2026-06-29.md`
- `history/tasks/luc-6139-production-performance-server-health-watch-2026-06-29-task.md`
- `.agents/state/active-mission.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`

Source-control closure:

- Repo path: `C:/Personal/Projekty/Aplikacje/Soar`
- Commit: not committed; read-only watch/evidence update in shared project
  worktree.
- Push: not needed.
- Deploy impact: none.

Residual risk:

- Market-catalog cold sample remains a watch item, though focused follow-up
  normalized.
- Coolify queued deployment rows remain visible.
- Host-level VPS pressure/log-window proof remains credential-gated and is not
  claimed here.
- Release-grade build provenance remains a separate source/release gate.
