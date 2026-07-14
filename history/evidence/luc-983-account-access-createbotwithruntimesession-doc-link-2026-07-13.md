# LUC-983 Evidence

- Issue: [LUC-983](/LUC/issues/LUC-983)
- Date: 2026-07-13
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts#createBotWithRuntimeSession`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents the runtime close-authority
  route-pack bootstrap helper as the owned-bot plus owned-session setup path
  reused by fail-closed runtime position close scenarios.
- `docs/modules/api-bots.md` now classifies
  `createBotWithRuntimeSession` in the Architecture-Awareness Doc-Link table.
- `docs/architecture/relations/documentation-links.csv` now maps the scoped
  helper to `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` with stdout redirected to `history/artifacts/luc-983-build-architecture-awareness-log.txt`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "createBotWithRuntimeSession|getUserIdByEmail" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `createBotWithRuntimeSession` as `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes
  `createBotWithRuntimeSession` as the first Account access docs gap.
- `missingDocLink` dropped from `1982` to `1981`.
- The next docs-owned Account access routing advanced to
  `apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts#getUserIdByEmail`.

## Residual

- `getUserIdByEmail` remains the next scoped helper docs gap in the same
  route-pack file.
- No Paperclip control-plane mutation tool was available in this runner, so
  the durable repo packet is complete but the live issue status flip must be
  applied by the controlling harness or a board-capable agent.
