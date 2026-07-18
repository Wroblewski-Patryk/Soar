# LUC-1443 Closeout

- Issue: `LUC-1443`
- Status: `done`
- Lane: `QA/Test`

## Summary

Closed the generated Dashboard overview `missing_test_link` row for
`apps/api/src/router/index.ts#/dashboard` by linking the existing `/dashboard`
mount proof to the top-level router mount and refreshing the generated truth
indexes.

## Files

- `docs/architecture/relations/priority-test-links.csv`
- `docs/architecture/scanner-overrides.json`
- `docs/graphs/*`
- `docs/status/*`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `history/tasks/luc-1443-dashboard-overview-use-dashboard-missing-test-link-2026-07-17-task.md`
- `history/evidence/luc-1443-dashboard-overview-use-dashboard-missing-test-link-2026-07-17.md`

## Verification

- `pnpm --filter api exec vitest run src/middleware/requireAuth.test.ts --run`
  -> PASS (`1` file / `9` tests)
- `pnpm --filter api exec vitest run src/router/cacheHeaders.test.ts --run`
  -> PASS (`1` file / `3` tests)
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `pnpm run architecture:graph:drift:strict`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS

## Readback

- `docs/status/app-completion-index.md` now records
  `USE /dashboard` as `Account access | missing_doc_link`.
- `docs/status/project-truth-index.md` now records
  `Account access: USE /dashboard has app-completion risk missing_doc_link.`
- `Dashboard overview: USE /dashboard has app-completion risk missing_test_link`
  is no longer emitted by the generated truth.

## Residual

- The scoped proof-link lane is complete.
- The same endpoint still needs a separate docs-owned closure for
  `missing_doc_link`.
