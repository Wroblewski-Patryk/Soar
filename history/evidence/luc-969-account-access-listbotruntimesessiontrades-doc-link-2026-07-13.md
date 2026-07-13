# LUC-969 Evidence

- Issue: [LUC-969](/LUC/issues/LUC-969)
- Date: 2026-07-13
- Agent lane: Core Backend Engineer
- Scope: reconcile the Account access `listBotRuntimeSessionTrades`
  proof-to-doc mapping for both
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionTrades`
  and
  `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#listBotRuntimeSessionTrades`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now states the runtime session trades route
  contract as authenticated selected-bot ownership plus explicit-symbol
  intersection with the selected bot's active configured scope.
- `docs/modules/api-bots.md` now classifies both scoped `listBotRuntimeSessionTrades`
  entities in the Architecture-Awareness Doc-Link table.
- `docs/architecture/relations/documentation-links.csv` now maps both scoped
  entities to `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds matching `documents`
  relations for both scoped entities.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "listBotRuntimeSessionTrades has app-completion risk missing_doc_link|apps/api/src/modules/bots/(bots.controller.ts#listBotRuntimeSessionTrades|runtimeSessionTradesRead.service.ts#listBotRuntimeSessionTrades)" docs/status -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionTrades`
  or
  `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#listBotRuntimeSessionTrades`
  as `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes
  `listBotRuntimeSessionTrades` as the first Account access docs gap.
- The authoritative sequential readback dropped `missingDocLink` from `1986`
  to `1984`.
- The next docs-owned Account access routing advanced to
  `registerAndLogin` helper rows, with
  `apps/api/src/modules/bots/bots.duplicate-guard.e2e.test.ts#registerAndLogin`
  as the first gap.

## Residual

- The repo already had unrelated local dirty state before this heartbeat,
  including the uncommitted `LUC-970` proof-readback packet. This issue does
  not claim source-control closure for the broader worktree.
- No additional backend proof work remains for `listBotRuntimeSessionTrades`;
  the scoped capability is now closed as both test-linked and doc-linked in
  local generated truth.
