# LUC-1313 Evidence

- Issue: [LUC-1313](/LUC/issues/LUC-1313)
- Date: 2026-07-16
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/logs`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-logs.md` now documents `USE /logs` as the authenticated
  dashboard router mount that delegates into `logsRouter` only after the shared
  `requireAuth` boundary succeeds.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/logs` to
  `docs/modules/api-logs.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /logs|USE /market-stream|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `USE /logs` as `missing_doc_link` under Account access.
- `docs/status/project-truth-index.md` no longer routes
  `Account access: USE /logs` as the first project-truth gap.
- The first overall project-truth gap now advances to
  `apps/api/src/router/dashboard.routes.ts#/market-stream` as
  `missing_test_link`.
- The only remaining generated `missing_doc_link` rows are now
  `apps/api/src/router/index.ts#/alerts` and
  `apps/api/src/router/index.ts#/metrics`.

## Residual

- This issue closes only the scoped dashboard logs router doc-link lane;
  proof and browser-review gaps remain separate work.
- Paperclip closeout for [LUC-1313](/LUC/issues/LUC-1313) is handled
  separately from this durable repo evidence packet.
