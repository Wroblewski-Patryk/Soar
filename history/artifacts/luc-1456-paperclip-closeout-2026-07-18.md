# LUC-1456 Closeout

- Issue: `LUC-1456`
- Status: `done`
- Lane: `Documentation Steward`

## Summary

Closed the generated Account access `missing_doc_link` row for
`apps/api/src/router/index.ts#/dashboard` by attaching the top-level dashboard
mount to the existing root API module docs and refreshing the generated truth
indexes.

## Files

- `docs/modules/api-root.md`
- `docs/architecture/relations/documentation-links.csv`
- `docs/architecture/scanner-overrides.json`
- `docs/graphs/*`
- `docs/status/*`
- `.agents/state/active-mission.md`
- `.agents/state/next-steps.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `history/tasks/luc-1456-account-access-use-dashboard-missing-doc-link-2026-07-18-task.md`
- `history/evidence/luc-1456-account-access-use-dashboard-missing-doc-link-2026-07-18.md`

## Verification

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `pnpm run architecture:graph:drift:strict`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS
- targeted `rg` readback
  -> PASS

## Readback

- `docs/status/app-completion-index.md` no longer emits `USE /dashboard` as
  `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer emits
  `Account access: USE /dashboard has app-completion risk missing_doc_link.`
- The remaining docs-owned rows advance to `GET /alerts` and `GET /metrics`.

## Source-Control Closure

- Local commit SHA: `not created in this lane`
- Exact no-commit blocker:
  source-control closure is owned by the sidecar issue
  [LUC-1458](/LUC/issues/LUC-1458), created because this heartbeat leaves a
  validated docs/state/history packet in a dirty worktree.
- Push status: `not pushed`
- Deploy impact: `none`

## Residual

- The scoped doc-link lane is complete.
- The runtime readiness blocker on `https://api.soar.luckysparrow.ch/ready`
  remains outside this docs-owned scope.
