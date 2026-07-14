# LUC-1162 Evidence

- Issue: [LUC-1162](/LUC/issues/LUC-1162)
- Date: 2026-07-15
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/admin.routes.ts#/users`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, and no protected smoke.

## Implemented and verified

- `docs/modules/api-admin.md` now documents `USE /admin/users` as the shared
  admin-boundary router mount that delegates into `usersRouter` only after
  `requireAuth` and `requireRole('ADMIN')` are enforced at the parent
  `admin.routes.ts` layer.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/admin.routes.ts#/users` to `docs/modules/api-admin.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /users|admin.routes.ts#/users|missing_doc_link|USE /backtests|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `apps/api/src/router/admin.routes.ts#/users` as `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes `Account access:
  USE /users` as the first project-truth gap.
- The next docs-owned first gap advances to
  `apps/api/src/router/dashboard.routes.ts#/backtests` as `missing_doc_link`,
  while the remaining Admin operation proof-owned row stays
  `apps/api/src/router/admin.routes.ts#/` as `missing_test_link`.

## Residual

- This issue closes only the scoped `USE /users` doc-link lane.
- No runtime mutation, deploy, push, or protected browser proof is claimed
  here.
