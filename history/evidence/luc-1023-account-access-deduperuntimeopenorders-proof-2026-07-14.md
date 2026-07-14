# LUC-1023 Evidence - Account access `dedupeRuntimeOpenOrders` proof

- Issue: [LUC-1023](/LUC/issues/LUC-1023)
- Date: 2026-07-14
- Owner: 09 QVE (QA & Verification Engineer)
- Scope: close the Account access `implemented_needs_proof` row for
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders`
  with the smallest local automated proof and generated-truth refresh only.

## Changes

- added focused no-DB coverage in
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts`
  for exchange-id trimming, exchange-synced preference over bot duplicates,
  same-origin latest-update winner selection, newest-first ordering, and
  limit-preserving selection;
- linked the helper directly in
  `docs/architecture/relations/priority-test-links.csv`;
- marked the helper verified in
  `docs/architecture/scanner-overrides.json`;
- refreshed architecture-awareness, app-completion, and project-truth outputs.

## Verification

- `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts --run --reporter=dot`
  -> PASS (`1` file / `7` tests)
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  -> PASS (`10928` entities / `36128` relations / `entityOverridesApplied=34`)
- `pnpm run architecture:graph:drift:strict`
  -> PASS (`859/859`, `0` missing)
- first `build-app-completion-index.mjs` attempt
  -> FAIL (`UNKNOWN: unknown error, open docs/status/app-completion-index.json`)
- rerun `build-app-completion-index.mjs`
  -> PASS (`implementedNeedsProof=113`, down from `114`)
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  -> PASS; first Account access gap advanced to
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus`
  as `missing_doc_link`
- `corepack pnpm --filter api run typecheck`
  -> FAIL in unrelated existing files:
  `src/modules/auth/auth.loginUser.test.ts`,
  `src/modules/auth/auth.registerUser.test.ts`, and
  `src/modules/bots/runtimeSessionTradesRead.list.test.ts`
- `git diff --check`
  -> PASS with expected LF/CRLF warnings only

## Readback

- `docs/status/app-completion-index.json` now records
  `dedupeRuntimeOpenOrders` with `status=verified`, `hasTest=true`,
  `hasDoc=true`, and no remaining `implemented_needs_proof` risk.
- `docs/status/project-truth-index.json` no longer routes
  `dedupeRuntimeOpenOrders` as the first Account access gap.

## Residual

- next owner/action: Docs Memory Lead + Project Manager for
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus`
  `missing_doc_link`
- non-blocking repo baseline issue: API typecheck currently fails in unrelated
  pre-existing auth and runtime-trades test files; `LUC-1023` did not touch
  those surfaces
- no remaining QVE proof action stays open on [LUC-1023](/LUC/issues/LUC-1023)
