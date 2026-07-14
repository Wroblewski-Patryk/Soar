# LUC-1079 Evidence - Account access `listRuntimeManagedPositions` proof

## Scope

Close the Account access `missing_test_link` routing for
`apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimeManagedPositions`
using the smallest focused repository proof and generated-truth refresh only.

## Work Performed

- added
  `apps/api/src/modules/bots/listRuntimeManagedPositions.repository.test.ts`
  with a focused no-DB assertion that `listRuntimeManagedPositions` forwards
  the scoped `where` clause and `limit` into `prisma.position.findMany`,
  preserves canonical runtime ordering and projection selection, and returns
  the payload unchanged;
- added a direct `priority-test-links.csv` row for
  `runtimeSessionPositionsRead.repository.ts#listRuntimeManagedPositions` ->
  `listRuntimeManagedPositions.repository.test.ts`;
- added a `scanner-overrides.json` entity override marking the helper
  `verified` with task/evidence linkage.

## Verification

- PASS:
  `corepack pnpm --filter api exec vitest run src/modules/bots/listRuntimeManagedPositions.repository.test.ts --run --reporter=dot`
- PASS:
  `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
- PASS: `pnpm run architecture:graph:drift:strict`
- PASS:
  `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
- PASS:
  `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`

## Readback

- `app-completion-index.json` no longer reports
  `listRuntimeManagedPositions` as `missing_test_link`.
- `project-truth-index.json` now routes the same helper as the first Account
  access `missing_doc_link` follow-up with Docs Memory ownership.

## Residual

- Next owner/action:
  Docs Memory Lead + Project Manager add the direct source-of-truth
  documentation link for
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimeManagedPositions`.
- Current dirty-packet source-control closure remains owned separately by
  [LUC-1061](/LUC/issues/LUC-1061).
