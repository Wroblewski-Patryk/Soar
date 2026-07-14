# LUC-1111 Evidence

- Issue: [LUC-1111](/LUC/issues/LUC-1111)
- Date: 2026-07-14
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionQuantity`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push, no
  secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/architecture/relations/documentation-links.csv` now maps the helper to
  `docs/modules/api-bots.md`.
- `docs/status/app-completion-index.md` and
  `docs/status/project-truth-index.md` now advance the first Account access
  gap to `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionRealizedPnl`
  as `missing_test_link`.
- The module doc already described the helper contract; the missing piece was
  the canonical docs relation input needed by the generated truth pipeline.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `Select-String` readback on `docs/status/app-completion-index.md`,
  `docs/status/project-truth-index.md`, and
  `docs/architecture/relations/documentation-links.csv`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `sumRuntimeManagedPositionQuantity` as `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes
  `sumRuntimeManagedPositionQuantity` as the first Account access gap.
- The next overall Account access row now advances to
  `sumRuntimeManagedPositionRealizedPnl` as `missing_test_link`, while the
  next docs-owned row remains `runtimeSessionPositionsRead.service.test.ts#row`
  as `missing_doc_link`.

## Residual

- This issue closes only the scoped helper doc-link lane; the existing proof
  closure remains [LUC-1108](/LUC/issues/LUC-1108), and the local
  source-control closure sidecar remains [LUC-1061](/LUC/issues/LUC-1061).
- Paperclip closeout for [LUC-1111](/LUC/issues/LUC-1111) is handled
  separately from this durable repo evidence packet.
