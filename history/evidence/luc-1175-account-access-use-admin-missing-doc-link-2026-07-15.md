# LUC-1175 Evidence

- Issue: `LUC-1175`
- Date: `2026-07-15`
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/index.ts#/admin` using the smallest existing admin API
  documentation relation and generator-readable evidence only.

## Source-Truth Changes

- Added the direct documentation relation row:
  `apps/api/src/router/index.ts#/admin -> docs/modules/api-admin.md`
  in `docs/architecture/relations/documentation-links.csv`.
- Added the direct docs relation override for the same router mount in
  `docs/architecture/scanner-overrides.json`.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /admin|missing_doc_link|USE /backtests|page.tsx has app-completion risk needs_browser_review" docs/status/app-completion-index.md docs/status/project-truth-index.md`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer routes
  `Account access | missing_doc_link | api_endpoint | USE /admin`; the Account
  access flow summary is now `{"ok":11}`.
- `docs/status/project-truth-index.md` now reports the first gap as
  `Admin operation: page.tsx has app-completion risk needs_browser_review.`
- The next docs-owned generated gap advances to
  `Dashboard overview | missing_doc_link | api_endpoint | USE /backtests`.
