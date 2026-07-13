# LUC-950 Evidence

- Issue: [LUC-950](/LUC/issues/LUC-950)
- Date: 2026-07-13
- Agent lane: Documentation Steward
- Scope: close Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessions`
  and the paired
  `apps/api/src/modules/bots/runtimeSessionRead.service.ts#listBotRuntimeSessions`
  source-of-truth rows.
- Boundary: no runtime code mutation, no new proof tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now states the runtime sessions route contract as
  authenticated selected-bot ownership plus status/limit filter forwarding
  into the runtime-session summary query.
- `docs/modules/api-bots.md` now classifies both scoped entities in the
  Architecture-Awareness Doc-Link table.
- `docs/architecture/relations/documentation-links.csv` now maps both scoped
  entities to `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds matching `documents`
  relations for both scoped entities.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "listBotRuntimeSessions has app-completion risk missing_doc_link|apps/api/src/modules/bots/(bots.controller.ts#listBotRuntimeSessions|runtimeSessionRead.service.ts#listBotRuntimeSessions)" docs/status -S`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessions`
  or
  `apps/api/src/modules/bots/runtimeSessionRead.service.ts#listBotRuntimeSessions`
  as `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer reports
  `listBotRuntimeSessions` as the first Account access gap.
- The authoritative sequential readback dropped `missingDocLink` from `1989`
  to `1987`.
- The next docs-owned Account access routing advanced to
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats`.

## Residual

- The first attempted `project-truth` refresh in this heartbeat ran in
  parallel with `build-app-completion-index.mjs` and therefore produced a
  stale readback; the sequential rerun above is the only authoritative
  evidence. This matches the existing project learning in
  `.codex/context/LEARNING_JOURNAL.md`.
- Other docs-owned runtime session gaps such as `listBotRuntimeSessionSymbolStats`
  and `listBotRuntimeSessionTrades` remain outside this issue.
