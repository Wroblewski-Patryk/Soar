# LUC-1155 Evidence

- Issue: [LUC-1155](/LUC/issues/LUC-1155)
- Date: 2026-07-14
- Agent lane: Test Automation Engineer
- Scope: close the Admin operation `missing_test_link` routing for
  `apps/api/src/router/admin.routes.ts#/users`.
- Boundary: no runtime code mutation, no deploy, no push, no protected
  account/session proof outside the existing local e2e surface, and no
  unrelated `USE /admin` closure.

## Implemented and verified

- `docs/architecture/relations/priority-test-links.csv` now maps
  `apps/api/src/router/admin.routes.ts#/users` directly to
  `apps/api/src/modules/admin/users/users.e2e.test.ts`.
- `docs/architecture/scanner-overrides.json` now:
  - marks `apps/api/src/router/admin.routes.ts#/users` as `verified` with
    LUC-1155 evidence ownership; and
  - adds a direct `tests` relation override from
    `api_endpoint:use-users:2f4d7609a6` to
    `apps/api/src/modules/admin/users/users.e2e.test.ts`.
- The existing local e2e proof already covers the admin users router mount
  behavior:
  unauthenticated `401`, non-admin `403`, admin list readback, role mutation,
  subscription assignment, self-demotion block, and stale-session rejection
  after admin demotion.

## Validation

- `pnpm --filter api exec vitest run src/modules/admin/users/users.e2e.test.ts`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "Admin operation|USE /users|admin.routes.ts#/users|missing_test_link|needs_browser_review" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `apps/api/src/router/admin.routes.ts#/users` as `missing_test_link`; the
  endpoint now carries `hasTest: true` and advances to `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes `Admin operation:
  USE /users` as the first overall project-truth gap. The first gap is now
  `Account access: USE /users` with `missing_doc_link`, which moves to the
  Docs Memory lane.
- The remaining proof-owned Admin operation gap is now `USE /admin` as
  `missing_test_link`, while
  `apps/web/src/app/admin/users/page.tsx` and
  `apps/web/src/features/admin/users/pages/AdminUsersPage.tsx` remain
  `needs_browser_review`.

## Residual

- This issue closes only the scoped `USE /users` test-link lane.
- No runtime mutation, deploy, push, or protected browser proof is claimed
  here.
