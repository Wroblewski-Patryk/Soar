# LUC-1040 Evidence - Account access `selectRuntimeOpenOrders` proof

- Issue: [LUC-1040](/LUC/issues/LUC-1040)
- Date: 2026-07-14
- Owner: 11 SPM (Soar Product Manager)
- Scope: close the Account access `implemented_needs_proof` row for
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#selectRuntimeOpenOrders`
  with the smallest local automated proof-link refresh and generated-truth
  rebuild only.

## Changes

- linked the helper directly in
  `docs/architecture/relations/priority-test-links.csv`;
- marked the helper verified in
  `docs/architecture/scanner-overrides.json` using the existing focused
  `runtimeSessionOpenOrdersReadModel.service.test.ts` proof;
- refreshed architecture-awareness, app-completion, and project-truth outputs.

## Verification

- `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts --run --reporter=dot`
  -> PASS (`1` file / `7` tests)
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  -> PASS
- `pnpm run architecture:graph:drift:strict`
  -> PASS
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  -> PASS
- `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
  -> PASS; first Account access gap advanced to
  `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveClosedResult`
  as `missing_doc_link`
- `git diff --check`
  -> PASS with expected LF/CRLF warnings only

## Heartbeat Re-Verification

- `2026-07-14` liveness-continuation rerun repeated the same focused proof
  chain without widening scope.
- Focused Vitest rerun passed again (`1` file / `7` tests).
- `2026-07-14` attempt `2/2` reran the bounded helper proof again in this
  heartbeat and reconfirmed the same pass result (`1` file / `7` tests).
- `build-architecture-awareness-index.mjs` rerun passed with `10955`
  entities, `36279` relations, `41` entity overrides, and `41` relation
  overrides applied.
- `pnpm run architecture:graph:drift:strict` rerun passed with `863/863`
  covered and `0` missing.
- `build-app-completion-index.mjs` rerun passed with Account access now at
  `53 ok / 131 missing_doc_link / 52 missing_test_link / 1 implemented_needs_proof / 31 needs_browser_review`.
- Sequential `build-project-truth-indexes.mjs --apply` rerun passed and still
  advanced the first Account access gap to
  `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveClosedResult`
  as `missing_doc_link`.
- `2026-07-14` follow-up liveness heartbeat reran the full scoped proof chain:
  focused Vitest PASS (`1` file / `7` tests), architecture-awareness PASS
  (`10958` entities / `36290` relations / `41` entity overrides / `42`
  relation overrides), and drift strict PASS (`863/863`, `0` missing).
- A standalone `build-app-completion-index.mjs` invocation hit a transient
  Windows file-open error on `docs/status/app-completion-index.json`, but the
  subsequent sequential
  `build-project-truth-indexes.mjs --apply` PASS refreshed the generated
  `app-completion` and `project-truth` outputs successfully.
- Current readback after that sequential rebuild shows Account access at
  `53 ok / 130 missing_doc_link / 52 missing_test_link / 2 implemented_needs_proof / 31 needs_browser_review`.
- Current first Account access gap is now
  `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveClosedResult`
  as `implemented_needs_proof`, not `missing_doc_link`.
- `2026-07-14` final liveness heartbeat reran the minimum authoritative
  closure slice again: focused Vitest PASS (`1` file / `7` tests) plus
  sequential `build-project-truth-indexes.mjs --apply` PASS.
- Current generated readback remains stable after that rerun:
  Account access stays at `53 ok / 130 missing_doc_link / 52 missing_test_link / 2 implemented_needs_proof / 31 needs_browser_review`.
- `selectRuntimeOpenOrders` remains removed from the Account access
  `implemented_needs_proof` queue, and `resolveClosedResult` remains the first
  Account access gap as `implemented_needs_proof`.
- `2026-07-14` subsequent liveness heartbeat reran the same minimum closure
  slice once more: focused Vitest PASS (`1` file / `7` tests) and sequential
  `build-project-truth-indexes.mjs --apply` PASS.
- Generated truth remained unchanged after that rerun:
  `selectRuntimeOpenOrders` stayed closed for this issue, and
  `resolveClosedResult` stayed the first Account access
  `implemented_needs_proof` gap.
- `2026-07-14` current heartbeat reran the smallest authoritative closure
  chain again: focused Vitest PASS (`1` file / `7` tests),
  `build-architecture-awareness-index.mjs` PASS (`10965` entities /
  `36323` relations / `42` entity overrides / `42` relation overrides),
  drift strict PASS (`863/863`, `0` missing), and sequential
  `build-project-truth-indexes.mjs --apply` PASS.
- Current authoritative readback advanced beyond the earlier adjacent
  `resolveClosedResult` row: `selectRuntimeOpenOrders` remains removed from
  Account access `implemented_needs_proof`, while the first Account access gap
  is now
  `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveSingleCanonicalStrategyId`
  as `missing_doc_link`.

## Readback

- `docs/status/app-completion-index.json` now records
  `selectRuntimeOpenOrders` with `status=verified`, `hasTest=true`,
  `hasDoc=true`, and no remaining `implemented_needs_proof` risk.
- `docs/status/project-truth-index.json` no longer routes
  `selectRuntimeOpenOrders` as the first Account access gap.

## Residual

- next owner/action: QA Regression Lead + Project Manager for
  the proof/doc queue has advanced past
  `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveClosedResult`;
  the current first Account access gap owner/action is Docs Memory Lead +
  Project Manager for
  `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts#resolveSingleCanonicalStrategyId`
  as `missing_doc_link`
- no remaining proof action stays open on [LUC-1040](/LUC/issues/LUC-1040)
