# LUC-1275 Evidence

- Issue: [LUC-1275](/LUC/issues/LUC-1275)
- Date: 2026-07-15
- Agent lane: Documentation Steward
- Scope: close the Dashboard overview `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-root.md` now documents `GET /dashboard` as the
  authenticated dashboard root reachability probe that returns only the minimal
  welcome payload plus the authenticated user projection.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/` to `docs/modules/api-root.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "Dashboard overview: GET /|missing_doc_link|USE /backtests" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `apps/api/src/router/dashboard.routes.ts#/` as `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes
  `Dashboard overview: GET /` as the first project-truth gap.
- The next docs-owned Dashboard overview row advances to
  `apps/api/src/router/dashboard.routes.ts#/backtests` as `missing_doc_link`.

## Residual

- This issue closes only the scoped dashboard-root doc-link lane; later
  Dashboard overview docs/test/browser gaps remain separate generated work.
- Paperclip closeout for [LUC-1275](/LUC/issues/LUC-1275) is handled
  separately from this durable repo evidence packet.
