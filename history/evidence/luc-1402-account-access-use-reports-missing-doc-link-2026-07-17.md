# LUC-1402 Evidence

- Issue: [LUC-1402](/LUC/issues/LUC-1402)
- Date: 2026-07-17
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/reports`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented

- `docs/modules/api-reports.md` now documents
  `apps/api/src/router/dashboard.routes.ts#/reports` as the authenticated
  dashboard router mount that delegates the reports analytics API surface into
  the reports module after the shared dashboard auth gate succeeds.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/reports` to
  `docs/modules/api-reports.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /reports|USE /profile/basic|missing_doc_link|Account access" docs/status/app-completion-index.md docs/status/project-truth-index.md`
- direct `node -` readback against
  `docs/graphs/architecture-awareness.json`,
  `docs/status/app-completion-index.json`, and
  `docs/status/project-truth-index.json`
- `git diff --check`

## Readback

- `docs/graphs/architecture-awareness.json` now contains the direct relation
  `document:api-deep-dive-reports-module:f225b792c8 -> api_endpoint:use-reports:cc94abde59`
  with type `documents` and evidence `docs/modules/api-reports.md`.
- `docs/status/app-completion-index.md` now reports
  `Account access: 24 entities; risks {"ok":24}` and no longer lists
  `USE /reports` in the priority review queue.
- Direct readback against `docs/status/app-completion-index.json` returns no
  `missing_doc_link` items at all, confirming the scoped `/reports` gap is
  cleared at the app-completion source.
- `docs/status/project-truth-index.{md,json}` still emits
  `Account access: USE /reports has app-completion risk missing_doc_link.`
  even though the source app-completion JSON no longer contains that item.

## Residual / blocker

- The Soar-side documentation repair is complete, but the issue remains blocked
  on downstream project-truth tooling or stale projection behavior.
- Next owner/action:
  Paperclip docs/tooling owner must diagnose why
  `build-project-truth-indexes.mjs` still projects `/reports` as an
  app-completion gap after `build-app-completion-index.mjs` has removed the
  route from `docs/status/app-completion-index.{json,md}`.
