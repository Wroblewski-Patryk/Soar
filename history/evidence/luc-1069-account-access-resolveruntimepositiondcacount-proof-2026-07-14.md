# LUC-1069 Evidence - Account access `resolveRuntimePositionDcaCount` proof

- Issue: [LUC-1069](/LUC/issues/LUC-1069)
- Date: 2026-07-14
- Owner: 09 QVE (QA & Verification Engineer)
- Scope: close the Account access `implemented_needs_proof` row for
  `apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts#resolveRuntimePositionDcaCount`
  with the smallest focused local proof slice and canonical generated-truth
  refresh only.

## Changes

- extended
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  with focused proof for raw-trade fallback when order ids are absent and for
  fail-closed non-negative truncation semantics;
- reused the existing helper relation in
  `docs/architecture/relations/priority-test-links.csv`;
- marked the helper verified in
  `docs/architecture/scanner-overrides.json`;
- refreshed architecture-awareness, app-completion, and project-truth outputs
  sequentially through the canonical Paperclip scripts.

## Verification

- `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.service.test.ts --run --reporter=dot`
  -> PASS (`1` file / `24` tests)
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  -> PASS
- `pnpm run architecture:graph:drift:strict`
  -> PASS
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  -> PASS
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  -> PASS
- `git diff --check`
  -> PASS with expected LF/CRLF warnings only

## Readback

- `docs/graphs/architecture-awareness.json` now records
  `resolveRuntimePositionDcaCount` as `status=verified` with evidence in
  `runtimeSessionPositionsRead.service.test.ts` and this packet.
- `docs/status/app-completion-index.json` now records
  `resolveRuntimePositionDcaCount` with `hasTest=true`,
  `hasDoc=true`, and `risk=none`.
- `docs/status/project-truth-index.json` no longer routes
  `resolveRuntimePositionDcaCount` from
  `runtimeSessionPositionDcaCount.ts` as the first Account access gap.
- The next Account access front row advances to
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#countRuntimeManagedPositions`
  as `missing_test_link`.

## Residual

- next owner/action: Test Automation Engineer + QA Regression Lead for
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#countRuntimeManagedPositions`
  `missing_test_link`
- no remaining proof action stays open on [LUC-1069](/LUC/issues/LUC-1069)
