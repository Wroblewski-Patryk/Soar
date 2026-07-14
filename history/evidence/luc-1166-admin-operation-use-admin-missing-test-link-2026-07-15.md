# LUC-1166 Evidence

- Issue: `LUC-1166`
- Date: `2026-07-15`
- Scope: close the Admin operation `missing_test_link` routing for
  `apps/api/src/router/index.ts#/admin` using the smallest existing admin API
  proof link and generator-readable evidence only.

## Source-Truth Changes

- Added the direct proof relation row:
  `apps/api/src/router/index.ts#/admin -> apps/api/src/modules/admin/users/users.e2e.test.ts`
  in `docs/architecture/relations/priority-test-links.csv`.
- Added the verified entity override and direct test relation override for
  `api_endpoint:use-admin:9b16797c60` in
  `docs/architecture/scanner-overrides.json`.

## Validation

- `pnpm --filter api exec vitest run src/modules/admin/users/users.e2e.test.ts --run`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /admin|Admin operation|missing_test_link|needs_browser_review" docs/status/app-completion-index.md docs/status/project-truth-index.md`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer routes
  `Admin operation | missing_test_link | api_endpoint | USE /admin`; the row now
  advances to
  `Account access | missing_doc_link | api_endpoint | USE /admin`.
- `docs/status/project-truth-index.json` now reports the first gap for
  `api_endpoint:use-admin:9b16797c60` as
  `Account access: USE /admin has app-completion risk missing_doc_link.`
- The scoped QA/Test gap is therefore closed; the remaining follow-up for this
  route is Docs/PM ownership, not test-link repair.
