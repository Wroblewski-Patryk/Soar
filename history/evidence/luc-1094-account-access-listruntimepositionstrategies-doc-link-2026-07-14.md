# LUC-1094 Evidence

- Issue: [LUC-1094](/LUC/issues/LUC-1094)
- Date: 2026-07-14
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimePositionStrategies`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents `listRuntimePositionStrategies` as
  the runtime position strategy repository helper that forwards the
  already-scoped Prisma strategy filter into `prisma.strategy.findMany` and
  returns the exact strategy id plus config projection used by account-scoped
  session position readbacks.
- `docs/architecture/relations/documentation-links.csv` now maps the helper to
  `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "listRuntimePositionStrategies|runtimeSessionPositionsRead.service.test.ts#row|missing_doc_link|Account access" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `listRuntimePositionStrategies` as `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes
  `listRuntimePositionStrategies` as the first Account access gap.
- The next overall Account access row advances to
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimePositionTradeRows`
  as `missing_test_link`, while the next docs-owned row is
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts#row`
  as `missing_doc_link`.

## Residual

- This issue closes only the scoped helper doc-link lane; the existing proof
  closure remains [LUC-1091](/LUC/issues/LUC-1091), and the local
  source-control closure sidecar remains [LUC-1061](/LUC/issues/LUC-1061).
- Paperclip closeout for [LUC-1094](/LUC/issues/LUC-1094) is handled
  separately from this durable repo evidence packet.
