# LUC-1067 Evidence

- Issue: [LUC-1067](/LUC/issues/LUC-1067)
- Date: 2026-07-14
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts#resolveRuntimePositionDcaCount`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents
  `resolveRuntimePositionDcaCount` as the runtime position DCA-count helper
  that deduplicates entry-leg units by order id plus lifecycle action,
  compares that inferred add-count with explicit DCA trade count and runtime
  state current-adds, and returns the highest non-negative truncated signal.
- `docs/architecture/relations/documentation-links.csv` now maps the helper to
  `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "resolveRuntimePositionDcaCount|missing_doc_link|implemented_needs_proof|Account access" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `resolveRuntimePositionDcaCount` as `missing_doc_link`; it now routes as
  `implemented_needs_proof`.
- Global app-completion counts moved from `missingDocLink=1982` /
  `implementedNeedsProof=111` to `missingDocLink=1981` /
  `implementedNeedsProof=112`.
- `docs/status/project-truth-index.md` now routes
  `resolveRuntimePositionDcaCount` as the first Account access proof gap, not
  the first docs gap.

## Residual

- This issue closes only the scoped helper doc-link lane; the new
  `implemented_needs_proof` follow-up for `resolveRuntimePositionDcaCount`
  remains for QA/Project Manager routing, and the local source-control closure
  sidecar remains [LUC-1061](/LUC/issues/LUC-1061).
- Paperclip closeout for [LUC-1067](/LUC/issues/LUC-1067) is handled
  separately from this durable repo evidence packet.
