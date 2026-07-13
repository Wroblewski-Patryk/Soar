# LUC-944 Evidence

- Issue: [LUC-944](/LUC/issues/LUC-944)
- Date: 2026-07-13
- Agent lane: Documentation Steward
- Scope: close Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionPositions`
  and the paired
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#listBotRuntimeSessionPositions`
  source-of-truth row.
- Boundary: no runtime code mutation, no new proof tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now states the runtime session positions route
  contract as authenticated selected-bot ownership plus `BOT_MANAGED`-only
  scoped rows.
- `docs/modules/api-bots.md` now classifies both scoped entities in the
  Architecture-Awareness Doc-Link table.
- `docs/architecture/relations/documentation-links.csv` now maps both scoped
  entities to `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds matching `documents`
  relations for both scoped entities.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `pnpm run architecture:graph:drift:strict`
- `rg -n "listBotRuntimeSessionPositions has app-completion risk missing_doc_link|apps/api/src/modules/bots/(bots.controller.ts#listBotRuntimeSessionPositions|runtimeSessionPositionsRead.service.ts#listBotRuntimeSessionPositions)" docs/status -S`

## Readback

- `docs/status/project-truth-index.md` no longer reports
  `listBotRuntimeSessionPositions` as the first Account access gap.
- `docs/status/app-completion-index.md` no longer lists
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionPositions`
  or
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#listBotRuntimeSessionPositions`
  as `missing_doc_link`.
- The next docs-owned Account access routing advanced to
  `listBotRuntimeSessions`.

## Residual

- Runtime positions helper/repository rows with `missing_test_link` or other
  docs gaps remain outside this issue.
- The next docs-owned follow-up is the runtime sessions route family.
