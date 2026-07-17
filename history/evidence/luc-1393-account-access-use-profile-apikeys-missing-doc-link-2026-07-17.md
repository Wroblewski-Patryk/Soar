# LUC-1393 Evidence

- Issue: [LUC-1393](/LUC/issues/LUC-1393)
- Date: 2026-07-17
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-profile.md` now documents
  `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys` as the
  authenticated dashboard router mount that delegates the profile API-key
  lifecycle and connection-test surface into the profile module after the
  shared dashboard auth gate succeeds.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys` to
  `docs/modules/api-profile.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /profile/apiKeys|USE /profile/basic|GET /alerts|GET /metrics|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `USE /profile/apiKeys` as `missing_doc_link` under Account access.
- `docs/status/project-truth-index.md` no longer routes
  `Account access: USE /profile/apiKeys` as a project-truth gap.
- The remaining generated docs-owned priority rows now advance to
  `USE /profile/basic`, `GET /alerts`, and `GET /metrics`.

## Residual

- This issue closes only the scoped dashboard profile API-key router doc-link
  lane; the remaining docs-owned gaps are separate work.
- Paperclip closeout for [LUC-1393](/LUC/issues/LUC-1393) is handled
  separately from this durable repo evidence packet.
