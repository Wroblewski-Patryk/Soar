# LUC-1393 Evidence

- Issue: [LUC-1393](/LUC/issues/LUC-1393)
- Date: 2026-07-17
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/profile/apiKeys`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented

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
- `rg -n "USE /profile/apiKeys|USE /profile/security|USE /reports|USE /profile/basic|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `node -` reproduction against `docs/graphs/architecture-awareness.json` confirming the exact endpoint now returns `hasDoc: true` when applying the same `hasLinkedType(..., "document")` logic used by `build-app-completion-index.mjs`
- `git diff --check`

## Readback

- `docs/graphs/architecture-awareness.json` now contains the direct relation
  `document:api-deep-dive-profile-module:fe29e29088 -> api_endpoint:use-profile-apikeys:680f20cf0c`
  with type `documents` and evidence `docs/modules/api-profile.md`.
- Direct reproduction against the generated graph returns
  `hasDoc: true` for `api_endpoint:use-profile-apikeys:680f20cf0c`.
- `docs/status/app-completion-index.json` still writes
  `evidence.hasDoc: false` and `risk: "missing_doc_link"` for the same
  endpoint.
- `docs/status/project-truth-index.md` therefore still routes
  `Account access: USE /profile/apiKeys has app-completion risk missing_doc_link.`

## Residual / blocker

- The Soar-side documentation repair is complete, but the issue is blocked on
  project-truth tooling: `build-app-completion-index.mjs` does not promote the
  endpoint out of `missing_doc_link` despite the refreshed document relation.
- Next owner/action:
  Paperclip docs/tooling owner must diagnose the generator contradiction in
  `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs`
  or the upstream architecture export path before `LUC-1393` can be closed.
