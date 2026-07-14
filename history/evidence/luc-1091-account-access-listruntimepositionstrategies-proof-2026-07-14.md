# LUC-1091 Evidence - Account access `listRuntimePositionStrategies` proof

## Scope

Close the Account access `missing_test_link` routing for
`apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimePositionStrategies`
using the smallest focused repository proof and generated-truth refresh only.

## Work Performed

- added `apps/api/src/modules/bots/listRuntimePositionStrategies.repository.test.ts`
  with a focused no-DB assertion that `listRuntimePositionStrategies`
  forwards the scoped `where` clause into `prisma.strategy.findMany`,
  preserves the exact projection selection, and returns the payload unchanged;
- added a direct `priority-test-links.csv` row for
  `runtimeSessionPositionsRead.repository.ts#listRuntimePositionStrategies` ->
  `listRuntimePositionStrategies.repository.test.ts`;
- added a `scanner-overrides.json` entity override marking the helper
  `verified` with task/evidence linkage.

## Verification

- PASS:
  `corepack pnpm --filter api exec vitest run src/modules/bots/listRuntimePositionStrategies.repository.test.ts --run --reporter=dot`
- PASS:
  `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
- PASS: `pnpm run architecture:graph:drift:strict`
- PASS:
  `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
- PASS:
  `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
- PASS:
  `git diff --check`
  with repository-wide existing LF->CRLF warnings only and no new patch-format errors from this slice.

## Readback

- `app-completion-index.json` no longer reports
  `listRuntimePositionStrategies` as `missing_test_link`.
- `project-truth-index.json` now routes the same helper as the first Account
  access `missing_doc_link` follow-up with Docs Memory ownership.
- the next Test Automation Engineer + QA Regression Lead front row is now
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimePositionTradeRows`
  as `missing_test_link`.

## Residual

- Next owner/action:
  Docs Memory Lead + Project Manager add the direct source-of-truth
  documentation link for
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#listRuntimePositionStrategies`.
- Current dirty-packet source-control closure remains owned separately by
  [LUC-1061](/LUC/issues/LUC-1061).
