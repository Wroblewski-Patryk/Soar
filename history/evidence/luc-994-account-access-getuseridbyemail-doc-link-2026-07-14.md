# LUC-994 Evidence

- Issue: [LUC-994](/LUC/issues/LUC-994)
- Date: 2026-07-14
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/bots.runtime-close-authority.route-pack.e2e.test.ts#getUserIdByEmail`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents the runtime close-authority
  route-pack owner-id lookup helper that resolves the authenticated owner from
  Prisma before runtime-session fixture setup.
- `docs/modules/api-bots.md` now classifies `getUserIdByEmail` in the
  Architecture-Awareness Doc-Link table.
- `docs/architecture/relations/documentation-links.csv` now maps the scoped
  helper to `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` with stdout redirected to `history/artifacts/luc-994-build-architecture-awareness-log.txt`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "getUserIdByEmail|seedTicker" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists `getUserIdByEmail` as
  `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes `getUserIdByEmail` as
  the first Account access docs gap.
- `missingDocLink` dropped from `1981` to `1980` after the serial generator refresh.
- The next docs-owned Account access routing advanced to
  `apps/api/src/modules/bots/bots.runtime-close-dca-authority.e2e.test.ts#seedTicker`.

## Residual

- `seedTicker` remains the next scoped helper docs gap in the Account access
  queue.
- Paperclip closeout for [LUC-994](/LUC/issues/LUC-994) is handled separately
  from this durable repo evidence packet.
