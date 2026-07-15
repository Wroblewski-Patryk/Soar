# LUC-1264 Evidence

- Issue: `LUC-1264`
- Date: `2026-07-15`
- Scope: close the Account access `missing_doc_link` routing for
  `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx` using the
  smallest canonical docs relation and generator-readable evidence only.

## Source-Truth Changes

- Added the direct documentation relation row:
  `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx -> docs/modules/web-admin.md`
  in `docs/architecture/relations/documentation-links.csv`.
- Added the matching feature-page coverage row in `docs/modules/web-admin.md`.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- targeted JSON/Markdown readback for:
  - `docs/graphs/architecture-awareness.json`
  - `docs/status/app-completion-index.md`
  - `docs/status/project-truth-index.md`
- `git diff --check`

## Readback

- `docs/graphs/architecture-awareness.json` now includes a direct `documents`
  relation from `document:web-deep-dive-admin-module:62c6205d4d` to
  `route:adminuserspage-tsx:784aa77abb`.
- `docs/status/app-completion-index.md` now reports
  `Account access: 14 entities; risks {"ok":14}` and no longer lists
  `AdminUsersPage.tsx` in the priority-review queue.
- `docs/status/project-truth-index.md` still reports
  `Account access: AdminUsersPage.tsx has app-completion risk missing_doc_link.`
  as the first gap after the same refresh.

## Follow-Up Resolution

- [LUC-1265](/LUC/issues/LUC-1265) reran the canonical truth refresh and
  cleared the stale `project-truth-index` emission without any additional docs
  edits.
- `docs/status/project-truth-index.{json,md}` now advance to
  `Dashboard overview: GET / has app-completion risk missing_test_link.`

## Conclusion

- The docs lane repair is real and generator-readable at the graph and
  app-completion layers.
- The stale `project-truth` packet is now cleared, so the original
  `AdminUsersPage.tsx` Account access doc-link issue is fully closed.
