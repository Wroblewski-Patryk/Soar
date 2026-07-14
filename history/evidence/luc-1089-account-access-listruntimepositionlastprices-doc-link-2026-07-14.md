# LUC-1089 Evidence

- Issue: [LUC-1089](/LUC/issues/LUC-1089)
- Date: 2026-07-14
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimePositionLastPrices`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents `listRuntimePositionLastPrices` as
  the runtime position last-prices repository helper that forwards the
  already-scoped Prisma symbol-stat filter into
  `prisma.botRuntimeSymbolStat.findMany` and returns the exact symbol,
  mark-price, and updated-at projection used by account-scoped session
  position readbacks.
- `docs/architecture/relations/documentation-links.csv` now maps the helper to
  `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "listRuntimePositionLastPrices|listRuntimePositionStrategies|runtimeSessionPositionsRead.service.test.ts#row|missing_doc_link|missing_test_link|Account access" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `listRuntimePositionLastPrices` as `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes
  `listRuntimePositionLastPrices` as the first Account access gap.
- The next overall Account access front row advances to
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimePositionStrategies`
  as `missing_test_link`, while the next docs-owned Account access row is
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts#row`
  as `missing_doc_link`.

## Residual

- This issue closes only the scoped helper doc-link lane; the existing proof
  closure remains [LUC-1087](/LUC/issues/LUC-1087), and the local
  source-control closure sidecar remains [LUC-1061](/LUC/issues/LUC-1061).
- Paperclip closeout for [LUC-1089](/LUC/issues/LUC-1089) is handled
  separately from this durable repo evidence packet.
