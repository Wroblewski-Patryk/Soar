# LUC-960 Evidence

- Issue: [LUC-960](/LUC/issues/LUC-960)
- Date: 2026-07-13
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push before
  verification, no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents the runtime session symbol-stats
  controller contract as an authenticated selected-bot ownership read that
  returns the scoped symbol rows plus summary and fails closed with `404` for
  cross-owner or missing bot/session access.
- `docs/modules/api-bots.md` now classifies
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats`
  in the Architecture-Awareness Doc-Link table.
- `docs/architecture/relations/documentation-links.csv` now maps the scoped
  controller entity to `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation for the scoped controller entity.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "listBotRuntimeSessionSymbolStats has app-completion risk missing_doc_link|apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats" docs/status -S`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats`
  as `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes
  `listBotRuntimeSessionSymbolStats` from the controller row as the first
  Account access docs gap.
- The authoritative sequential readback dropped `missingDocLink` from `1987`
  to `1986`.
- The next docs-owned Account access routing advanced to
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionTrades`.

## Residual

- The paired read-service docs gap for
  `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts#listBotRuntimeSessionSymbolStats`
  remains outside this issue.
- Source-control closure was handled in the same issue because the worktree was
  clean at start and this heartbeat produced one coherent docs-only packet.
