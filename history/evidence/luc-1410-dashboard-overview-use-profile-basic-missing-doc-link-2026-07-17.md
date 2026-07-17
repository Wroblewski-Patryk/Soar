# LUC-1410 Evidence

- Issue: [LUC-1410](/LUC/issues/LUC-1410)
- Date: 2026-07-17
- Agent lane: Documentation Steward
- Scope: close the Dashboard overview `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/profile/basic`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-profile.md` now documents
  `apps/api/src/router/dashboard.routes.ts#/profile/basic` as the authenticated
  dashboard router mount that delegates profile read, profile update, and
  account-deletion routes into the profile module after the shared dashboard
  auth gate succeeds.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/profile/basic` to
  `docs/modules/api-profile.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /profile/basic|USE /wallets|USE /dashboard|GET /alerts|GET /metrics|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `USE /profile/basic` as `missing_doc_link` under Dashboard overview.
- `docs/status/project-truth-index.md` no longer routes
  `Dashboard overview: USE /profile/basic` as a project-truth gap.
- The next Dashboard overview priority rows now advance to
  `USE /wallets` and `USE /dashboard` as `missing_test_link`.
- The remaining generated docs-owned priority rows now narrow to
  `GET /alerts` and `GET /metrics`.

## Residual

- This issue closes only the scoped dashboard profile-basic router doc-link
  lane; the remaining proof and docs gaps are separate work.
- The generated project-truth packet still reports the unrelated live runtime
  blocker `api_ready ... /ready returned 503`, which remains owned outside this
  documentation issue.
