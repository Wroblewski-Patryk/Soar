# LUC-1116 Evidence - Account access `sumRuntimeManagedPositionRealizedPnl` proof

## Scope

Close the Account access `missing_test_link` routing for
`apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionRealizedPnl`
using the smallest focused repository proof and generated-truth refresh only.

## Work Performed

- added `apps/api/src/modules/bots/sumRuntimeManagedPositionRealizedPnl.repository.test.ts`
  with a focused no-DB assertion that
  `sumRuntimeManagedPositionRealizedPnl` forwards the scoped `where` clause
  into `prisma.position.aggregate`, requests the exact
  `_sum.realizedPnl` selection, and returns the aggregate payload unchanged;
- added a direct `priority-test-links.csv` row for
  `runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionRealizedPnl`
  -> `sumRuntimeManagedPositionRealizedPnl.repository.test.ts`;
- added a `scanner-overrides.json` entity override marking the helper
  `verified` with task/evidence linkage;
- refreshed the generated architecture-awareness, app-completion, and
  project-truth indexes.

## Verification

- PASS:
  `pnpm --filter api test -- --run src/modules/bots/sumRuntimeManagedPositionRealizedPnl.repository.test.ts`
- PASS:
  `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
- PASS: `pnpm run architecture:graph:drift:strict`
- PASS:
  `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
- PASS:
  `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`

## Readback

- `app-completion-index.json` no longer routes
  `sumRuntimeManagedPositionRealizedPnl` as the first Account access
  `missing_test_link` gap.
- `project-truth-index.json` advances the first Account access gap to
  `useHydrationReady.ts` as `missing_doc_link`.

## Residual

- No runtime mutation, deploy, push, or protected proof is claimed here.
