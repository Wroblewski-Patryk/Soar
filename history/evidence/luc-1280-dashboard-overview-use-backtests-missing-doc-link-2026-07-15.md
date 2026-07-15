# LUC-1280 Evidence

- Issue: [LUC-1280](/LUC/issues/LUC-1280)
- Date: 2026-07-15
- Agent lane: Documentation Steward
- Scope: close the Dashboard overview `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/backtests`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-backtests.md` now documents `USE /backtests` as the
  authenticated dashboard router mount that delegates into `backtestsRouter`
  only after the shared `requireAuth` boundary succeeds.
- `docs/modules/api-backtests.md` now classifies
  `apps/api/src/router/dashboard.routes.ts#/backtests` in the architecture-
  awareness doc-link table.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/backtests` to
  `docs/modules/api-backtests.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /backtests|USE /bots|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `USE /backtests` as `missing_doc_link` under Dashboard overview.
- `docs/status/project-truth-index.md` no longer routes
  `Dashboard overview: USE /backtests` as the first project-truth gap.
- The first Dashboard overview project-truth gap now advances to
  `apps/api/src/router/dashboard.routes.ts#/bots` as `missing_test_link`.
- Dashboard overview aggregate counts changed from
  `{"ok":1,"missing_doc_link":1,"missing_test_link":14,"needs_browser_review":30}`
  to `{"ok":2,"missing_test_link":14,"needs_browser_review":30}` in
  `docs/status/app-completion-index.md`.

## Residual

- This issue closes only the scoped dashboard backtests router doc-link lane;
  later Dashboard overview proof and browser-review gaps remain separate work.
- Paperclip closeout for [LUC-1280](/LUC/issues/LUC-1280) is handled
  separately from this durable repo evidence packet.
