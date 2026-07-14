# LUC-1060 Evidence - Account access `resolveSingleCanonicalStrategyId` proof

- Issue: [LUC-1060](/LUC/issues/LUC-1060)
- Date: 2026-07-14
- Owner: 11 SPM (Soar Product Manager)
- Scope: close the Account access `implemented_needs_proof` row for
  `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveSingleCanonicalStrategyId`
  with the smallest focused local proof slice and canonical generated-truth
  refresh only.

## Changes

- extended
  `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.test.ts`
  with a focused fail-closed ambiguity proof for multiple enabled canonical
  strategy ids;
- linked the helper directly in
  `docs/architecture/relations/priority-test-links.csv`;
- marked the helper verified in
  `docs/architecture/scanner-overrides.json`;
- refreshed architecture-awareness, app-completion, and project-truth outputs
  sequentially through the canonical Paperclip scripts.

## Verification

- `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts --run --reporter=dot`
  -> PASS (`1` file / `16` tests)
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

- `docs/status/app-completion-index.json` now records
  `resolveSingleCanonicalStrategyId` with `hasTest=true`,
  `hasDoc=true`, and `risk=none`.
- `docs/status/project-truth-index.json` no longer routes
  `resolveSingleCanonicalStrategyId` from
  `runtimeSessionPositionCommand.service.ts` as the first Account access gap.
- The next Account access front row advances to
  `apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts#resolveRuntimePositionDcaCount`
  as `missing_doc_link`.

## Residual

- next owner/action: Test Automation Engineer + QA Regression Lead for
  `apps/api/src/modules/bots/runtimeSessionPositionDcaCount.ts#resolveRuntimePositionDcaCount`
  `missing_doc_link`
- no remaining proof action stays open on [LUC-1060](/LUC/issues/LUC-1060)
