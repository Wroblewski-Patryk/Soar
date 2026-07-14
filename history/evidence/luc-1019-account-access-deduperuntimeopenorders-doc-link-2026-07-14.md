# LUC-1019 Evidence

- Issue: [LUC-1019](/LUC/issues/LUC-1019)
- Date: 2026-07-14
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents the runtime open-orders dedupe helper
  that collapses rows by exchange order identity, falls back to local ids, prefers
  exchange-synced rows over local shadows, and sorts the surviving items by newest
  creation then update time.
- `docs/modules/api-bots.md` now classifies the scoped helper in the
  Architecture-Awareness Doc-Link table.
- `docs/architecture/relations/documentation-links.csv` now maps the scoped
  helper to `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "dedupeRuntimeOpenOrders|resolveRuntimeTakeoverStatus|implemented_needs_proof|missing_doc_link|Account access" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders` as
  `missing_doc_link`; it now routes as `implemented_needs_proof`.
- `docs/status/project-truth-index.md` now routes the scoped helper as the first
  Account access proof-owned gap instead of a docs-owned gap.
- `missingDocLink` dropped from `1979` to `1978` after the serial generator
  refresh.
- The next first-gap routing advanced to
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders`
  as `implemented_needs_proof`, with `resolveRuntimeTakeoverStatus` behind it as
  the next docs-owned gap.

## Residual

- This issue closes only the scoped helper doc-link lane; adjacent docs/proof
  gaps remain separate follow-ups owned by the next routed lane.
- Paperclip closeout for [LUC-1019](/LUC/issues/LUC-1019) is handled separately
  from this durable repo evidence packet.
