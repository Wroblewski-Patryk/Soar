# LUC-1073 Evidence

- Issue: [LUC-1073](/LUC/issues/LUC-1073)
- Date: 2026-07-14
- Agent lane: Documentation Steward
- Scope: close the Account access `missing_doc_link` routing for
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#countRuntimeManagedPositions`.
- Boundary: no runtime code mutation, no new tests, no deploy, no push,
  no secret/account readback, no DB mutation, no protected smoke.

## Implemented and verified

- `docs/modules/api-bots.md` now documents `countRuntimeManagedPositions` as
  the runtime managed-position count repository helper that forwards the
  already-scoped Prisma `where` contract into `prisma.position.count` without
  widening the selected bot-session boundary.
- `docs/architecture/relations/documentation-links.csv` now maps the helper to
  `docs/modules/api-bots.md`.
- `docs/architecture/scanner-overrides.json` now adds the matching
  `documents` relation override.

## Validation

- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `pnpm run architecture:graph:drift:strict`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
- `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
- `rg -n "countRuntimeManagedPositions|getRuntimePositionBotContext|missing_doc_link|missing_test_link|Account access" docs/status/app-completion-index.md docs/status/project-truth-index.md -S`
- `git diff --check`

## Readback

- `docs/status/app-completion-index.md` no longer lists
  `countRuntimeManagedPositions` as `missing_doc_link`.
- `docs/status/project-truth-index.md` no longer routes
  `countRuntimeManagedPositions` as the first Account access gap.
- The next Account access front row advances to
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#getRuntimePositionBotContext`
  as `missing_test_link`.

## Residual

- This issue closes only the scoped helper doc-link lane; the existing proof
  closure remains [LUC-1071](/LUC/issues/LUC-1071), and the local
  source-control closure sidecar remains [LUC-1061](/LUC/issues/LUC-1061).
- Paperclip closeout for [LUC-1073](/LUC/issues/LUC-1073) is handled
  separately from this durable repo evidence packet.
