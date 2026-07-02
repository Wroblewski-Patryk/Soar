# LUC-5915 Authenticated Production Acceptance And Performance Sweep

## Context

[LUC-5915](/LUC/issues/LUC-5915) is the assigned QVE production acceptance and
performance sweep for Soar. The heartbeat wake had no pending comments and
identified this issue as critical, already checked out by the harness.

## Goal

Refresh authenticated production acceptance evidence for the current Soar
production deployment and close the issue with exact proof, residual risk, and
source-control/deploy disposition.

## Scope

- Stage: `verification`.
- Affected layers: production Web, production API, auth/session boundary,
  protected worker readiness, runtime freshness, rollback guard, performance
  timing, evidence/state docs.
- Issue lane owner: QVE.
- Mission:
  `LUC-5915-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-28`.

## Constraints

- Use stored Paperclip/runtime secret references only; never print, copy, or
  write credential values, tokens, cookies, or protected response bodies.
- Read-only production verification only.
- Do not trade, mutate exchange keys, change billing, change production config,
  destroy data, deploy, push, restart, or roll back.
- Preserve unrelated dirty worktree changes.

## Implementation Plan

1. Consume the inline Paperclip wake payload for [LUC-5915](/LUC/issues/LUC-5915).
2. Run production deploy smoke with explicit production API/Web targets.
3. Map approved `PROD_UI_AUDIT_*` credentials into process-local smoke,
   freshness, rollback, auth-proof, and UI-proof env variables without
   printing secret values.
4. Run production auth browser proof and UI module clickthrough.
5. Run protected runtime freshness and rollback guard checks.
6. Collect a representative timing sample.
7. Check browser/process cleanup.
8. Record evidence, update source-of-truth state, and disposition the issue.

## Acceptance Criteria

- Public API/Web smoke passes.
- Protected `/workers/ready` passes through approved audit-login auth path.
- Auth browser proof passes without leaking credentials or protected payloads.
- UI clickthrough passes for public, dashboard, admin, and legacy redirect
  routes.
- Runtime freshness is `PASS`.
- Rollback guard reports `shouldRollback=false`.
- Timing sample has successful public statuses and expected fail-closed
  unauthenticated protected statuses.
- No validation browser processes remain.
- Evidence and source-of-truth state files are updated.

## Definition Of Done

- Evidence file exists under `history/evidence/`.
- Raw machine artifacts exist under `history/artifacts/`.
- Task contract exists under `history/tasks/`.
- `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`,
  `.agents/state/module-confidence-ledger.md`, `.agents/state/system-health.md`,
  `.agents/state/active-mission.md`, and `.agents/state/next-steps.md` reflect
  the result.
- Paperclip issue is updated to `done` with evidence and residual risk.

## Result Report

- Result:
  `PASS / VERIFIED_PRODUCTION / AUTHENTICATED_ACCEPTANCE_PASS / PERFORMANCE_PASS / RUNTIME_HEALTHY / TRANSIENT_LOGOUT_502_RETRIED_PASS`.
- Validation:
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
    PASS after process-local audit-login env mapping.
  - Stale/current token path returned protected `/workers/ready` `401`,
    matching the known fail-closed residual.
  - `pnpm run ops:prod-auth:proof -- --i-understand-production-auth-proof ...`
    first run FAIL with `/auth/logout -> 502`; retry PASS.
  - `pnpm run ops:ui:prod-clickthrough ...` PASS.
  - `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch`
    PASS after process-local `DEPLOY_FRESHNESS_*` mapping.
  - `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch`
    PASS after process-local `ROLLBACK_GUARD_*` mapping with
    `shouldRollback=false`.
  - Custom read-only timing sampler PASS, artifact
    `history/artifacts/luc-5915-production-performance-timing-2026-06-28.json`.
  - Browser/process cleanup check PASS: no validation browser processes found.
- Evidence:
  `history/evidence/luc-5915-authenticated-production-acceptance-performance-sweep-2026-06-28.md`;
  `history/evidence/luc-5915-prod-auth-session-browser-proof-2026-06-28.md`;
  `history/evidence/luc-5915-prod-auth-session-browser-proof-retry-2026-06-28.md`;
  `history/evidence/luc-5915-prod-ui-module-clickthrough-2026-06-28.md`;
  `history/artifacts/luc-5915-prod-auth-session-browser-proof-2026-06-28.json`;
  `history/artifacts/luc-5915-prod-auth-session-browser-proof-retry-2026-06-28.json`;
  `history/artifacts/luc-5915-prod-ui-module-clickthrough-2026-06-28.json`;
  `history/artifacts/luc-5915-production-performance-timing-2026-06-28.json`.
- Source-control:
  no commit, push, deploy, restart, rollback execution, or production mutation
  was performed. Shared worktree was already mixed dirty and divergent before
  this heartbeat (`main...origin/main` `ahead 15, behind 2`).
- Residual risk:
  release-grade build provenance, host-level VPS pressure/log-window proof,
  Coolify deployment-row readback, and stale `SMOKE_AUTH_TOKEN` cleanup remain
  separate owner concerns. One transient `/auth/logout -> 502` was observed
  and immediately retried to PASS.
