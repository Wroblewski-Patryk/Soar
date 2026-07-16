# LUC-1329 Evidence

- Issue: [LUC-1329](/LUC/issues/LUC-1329)
- Date: 2026-07-16
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/router/dashboard.routes.ts#/market-stream`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-market-stream.md` now documents `USE /market-stream` as
  the authenticated dashboard router mount that delegates into
  `marketStreamRouter` only after the shared `requireAuth` boundary succeeds.
- `docs/architecture/relations/documentation-links.csv` now maps
  `apps/api/src/router/dashboard.routes.ts#/market-stream` to
  `docs/modules/api-market-stream.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "USE /market-stream|USE /markets|missing_doc_link|missing_test_link" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `USE /market-stream` as `missing_doc_link` under Account access.
- `docs/status/project-truth-index.md` no longer routes
  `Account access: USE /market-stream` as the first project-truth gap.
- The first overall project-truth gap now advances to
  `apps/api/src/router/dashboard.routes.ts#/markets` as `missing_test_link`.
- App-completion aggregate counts changed from
  `missingDocLink=3` / `riskItems=66` to `missingDocLink=2` / `riskItems=65`.
- The only remaining generated `missing_doc_link` rows are now
  `apps/api/src/router/index.ts#/alerts` and
  `apps/api/src/router/index.ts#/metrics`.

## Residual

- This issue closes only the scoped dashboard market-stream router doc-link
  lane; later proof and browser-review gaps remain separate work.
- Paperclip closeout for [LUC-1329](/LUC/issues/LUC-1329) is handled
  separately from this durable repo evidence packet.
