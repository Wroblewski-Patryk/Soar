# LUC-5803 Authenticated Production Acceptance And Performance Sweep

## Context

[LUC-5803](/LUC/issues/LUC-5803) is the recurring QVE production acceptance and
performance sweep for Soar. It must verify production auth, dashboard route
coverage, representative backend timing, protected worker readiness, runtime
freshness, and rollback posture without mutating production data.

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
- Mission: `LUC-5803-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-28`.

## Constraints

- Use stored Paperclip/runtime secret references only; never print, copy, or
  write credential values, tokens, cookies, or protected response bodies.
- Read-only production verification only.
- Do not trade, mutate exchange keys, change billing, change production config,
  destroy data, deploy, push, restart, or roll back.
- Preserve unrelated dirty worktree changes.

## Implementation Plan

1. Read Paperclip heartbeat context for [LUC-5803](/LUC/issues/LUC-5803).
2. Run deploy smoke with fresh-login production audit auth.
3. Run production auth browser proof and UI module clickthrough.
4. Run protected runtime freshness and rollback guard checks.
5. Collect a representative timing sample and a focused market-catalog
   follow-up if needed.
6. Check browser/process cleanup.
7. Record evidence, update source-of-truth state, and disposition the issue.

## Acceptance Criteria

- Public API/Web smoke passes.
- Protected `/workers/ready` passes through approved/fresh-login auth path.
- Auth browser proof passes without leaking credentials or protected payloads.
- UI clickthrough passes for public, dashboard, admin, and legacy redirect
  routes.
- Runtime freshness is `PASS`.
- Rollback guard reports `shouldRollback=false`.
- Timing sample has only successful statuses, with any cold latency called out.
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
  `PASS / VERIFIED_PRODUCTION / AUTHENTICATED_ACCEPTANCE_PASS / PERFORMANCE_PASS / RUNTIME_HEALTHY`.
- Validation:
  - `node scripts/deploySmokeCheck.mjs` PASS for API `/health`, API `/ready`,
    Web `/`, Web `/api/build-info`, and protected `/workers/ready`.
  - `node scripts/runProdAuthSessionBrowserProof.mjs --i-understand-production-auth-proof ...` PASS.
  - `node scripts/runProdUiModuleClickthroughAudit.mjs ...` PASS.
  - `node scripts/checkPostDeployRuntimeFreshness.mjs` PASS.
  - `node scripts/evaluateRollbackGuard.mjs` PASS with `shouldRollback=false`.
  - Custom read-only timing sampler PASS, artifact
    `history/artifacts/luc-5803-production-performance-timing-2026-06-28.json`.
  - Browser/process cleanup check PASS: no `chrome-headless-shell`, `chrome`,
    or `msedge` validation processes found.
- Evidence:
  `history/evidence/luc-5803-authenticated-production-acceptance-performance-sweep-2026-06-28.md`;
  `history/evidence/luc-5803-prod-auth-session-browser-proof-2026-06-28.md`;
  `history/evidence/luc-5803-prod-ui-module-clickthrough-2026-06-28.md`;
  `history/artifacts/luc-5803-prod-auth-session-browser-proof-2026-06-28.json`;
  `history/artifacts/luc-5803-prod-ui-module-clickthrough-2026-06-28.json`;
  `history/artifacts/luc-5803-production-performance-timing-2026-06-28.json`.
- Source-control:
  no commit, push, deploy, restart, rollback execution, or production mutation
  was performed. Shared worktree was already mixed dirty and divergent before
  this heartbeat (`main...origin/main` `ahead 15, behind 1`).
- Residual risk:
  release-grade build provenance, host-level VPS pressure/log-window proof, and
  Coolify deployment-row readback remain separate Ops/release concerns. One
  `/dashboard/markets/catalog` cold sample reached `1513.6 ms`, then focused
  follow-up returned `200:8`, max `275.9 ms`.
