# LUC-1456 Evidence

- Issue: `LUC-1456`
- Date: `2026-07-18`
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/index.ts#/dashboard` using the existing root API module
  documentation surface and generator-readable evidence only.

## Source-Truth Changes

- Added the direct documentation relation row:
  `apps/api/src/router/index.ts#/dashboard -> docs/modules/api-root.md`
  in `docs/architecture/relations/documentation-links.csv`.
- Added the direct docs relation override for the same router mount in
  `docs/architecture/scanner-overrides.json`.
- Expanded `docs/modules/api-root.md` so the top-level
  `router.use('/dashboard', applyNoStoreHeaders, dashboardRoutes)` mount is
  explicitly documented as the Account access namespace boundary for downstream
  dashboard API modules.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /dashboard|GET /alerts|GET /metrics|missing_doc_link|apps/api/src/router/index.ts#/dashboard" docs/status/app-completion-index.md docs/status/project-truth-index.md docs/architecture/relations/documentation-links.csv docs/architecture/scanner-overrides.json -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer routes
  `Account access | missing_doc_link | api_endpoint | USE /dashboard`.
- `docs/status/project-truth-index.md` no longer routes
  `Account access: USE /dashboard has app-completion risk missing_doc_link.`
- The remaining generated docs-owned app-completion gaps are now
  `Unclassified user workflow | missing_doc_link | api_endpoint | GET /alerts`
  and `GET /metrics`.
- The first overall generated project-truth gap remains the runtime blocker
  `api_ready https://api.soar.luckysparrow.ch/ready returned 503`.

## Residual

- This issue closes only the scoped `USE /dashboard` doc-link lane.
- Local source-control closure is delegated to
  [LUC-1458](/LUC/issues/LUC-1458).
- No runtime mutation, deploy, push, or protected browser proof is claimed
  here.
