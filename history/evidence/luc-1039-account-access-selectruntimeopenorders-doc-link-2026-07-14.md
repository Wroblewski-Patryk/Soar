# LUC-1039 Evidence

- Issue: [LUC-1039](/LUC/issues/LUC-1039)
- Date: 2026-07-14
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#selectRuntimeOpenOrders`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents `selectRuntimeOpenOrders` as the
  runtime open-orders selection helper that returns the post-dedupe count and
  fail-closes the returned page to the requested limit.
- `docs/modules/api-bots.md` now classifies the helper in the
  Architecture-Awareness doc-link table.
- `docs/architecture/relations/documentation-links.csv` now maps the helper to
  `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "selectRuntimeOpenOrders|missing_doc_link|implemented_needs_proof|Account access" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `selectRuntimeOpenOrders` as `missing_doc_link`; it now routes as
  `implemented_needs_proof`.
- `docs/status/project-truth-index.md` now routes the helper as the first
  Account access proof gap, not the first docs gap.
- `missingDocLink` dropped from `1985` to `1984` after the sequential
  generator refresh.
- The next Account access docs-owned gap advanced to
  `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveClosedResult`
  as `missing_doc_link`.

## Artifacts

- architecture-awareness rebuild log:
  `history/artifacts/luc-1039-build-architecture-awareness-log.txt`

## Residual

- This issue closes only the scoped helper doc-link lane; adjacent docs/proof
  gaps remain separate follow-ups owned by the next routed lane.
- Paperclip closeout for [LUC-1039](/LUC/issues/LUC-1039) is handled
  separately from this durable repo evidence packet.
