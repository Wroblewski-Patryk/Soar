# LUC-1071 Evidence - Account access `countRuntimeManagedPositions` proof

## Scope

Close the Account access `missing_test_link` routing for
`apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#countRuntimeManagedPositions`
using the smallest focused repository proof and generated-truth refresh only.

## Work Performed

- added `apps/api/src/modules/bots/countRuntimeManagedPositions.repository.test.ts`
  with a focused no-DB assertion that
  `countRuntimeManagedPositions` forwards the scoped `where` clause into
  `prisma.position.count` and returns the count unchanged;
- added a direct `priority-test-links.csv` row for
  `runtimeSessionPositionsRead.repository.ts#countRuntimeManagedPositions` ->
  `countRuntimeManagedPositions.repository.test.ts`;
- added a `scanner-overrides.json` entity override marking the helper
  `verified` with task/evidence linkage.

## Verification

- PASS:
  `corepack pnpm --filter api exec vitest run src/modules/bots/countRuntimeManagedPositions.repository.test.ts --run --reporter=dot`
  (`1` file / `1` test)
- PASS:
  `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  (`10978` entities / `36392` relations / `entityOverridesApplied=45`)
- PASS: `pnpm run architecture:graph:drift:strict` (`864/864`, `0` missing)
- PASS:
  `build-app-completion-index.mjs`
  (`missingTestLink=958`, down from `959`; `missingDocLink=1982`, up from `1981`)
- PASS:
  `build-project-truth-indexes.mjs --apply`
  (`totalGaps=3503`, unchanged; first gap moved from `missing_test_link` to
  `missing_doc_link` for the same helper)

## Readback

- `app-completion-index.json` now reports
  `countRuntimeManagedPositions` with `hasTest=true`, `hasDoc=false`,
  `risk=missing_doc_link`.
- `project-truth-index.json` now advances the first Account access gap to the
  same helper as a docs-owned `missing_doc_link` follow-up instead of a
  Test-Automation-owned `missing_test_link`.

## Residual

- Next owner/action:
  Docs Memory Lead + Project Manager add the direct documentation link for
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#countRuntimeManagedPositions`.
- Current dirty-packet source-control closure remains owned separately by
  [LUC-1061](/LUC/issues/LUC-1061).
