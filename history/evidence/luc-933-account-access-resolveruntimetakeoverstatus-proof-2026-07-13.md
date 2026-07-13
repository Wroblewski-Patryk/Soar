# LUC-933 Account Access resolveRuntimeTakeoverStatus Proof

Date: 2026-07-13
Owner: 09 TAE (Test Automation Engineer)
Issue: [LUC-933](/LUC/issues/LUC-933)

## Scope

Prove the Account access missing-test-link row for:

- `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus`

## Changed

- Added focused helper proof in
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts`.
- Linked the helper to executable proof through
  `docs/architecture/relations/priority-test-links.csv`.
- Added a verified scanner override and explicit `tests` relation override for
  the helper in `docs/architecture/scanner-overrides.json`.
- Refreshed architecture-awareness, app-completion, and project-truth outputs
  in the required serial order.

## Verification

- Focused helper proof:
  - PASS:
    `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts --run --reporter=dot`
  - Result: `1` file passed, `5` tests passed.
  - Covered behavior:
    - non-exchange rows fail closed to `null`;
    - exchange-synced manual rows map to `MANUAL_ONLY`;
    - exchange-synced owned bot-managed rows map to
      `OWNED_AND_MANAGED`;
    - drifted unowned rows map to `AMBIGUOUS`;
    - in-sync unowned rows map to `UNOWNED`.
- Sequential source-truth refresh:
  - PASS:
    `build-architecture-awareness-index.mjs`
  - PASS:
    `build-app-completion-index.mjs`
  - PASS:
    `build-project-truth-indexes.mjs --apply`

## Readback

- `docs/graphs/architecture-awareness.json` now marks the helper entity
  `verified` and includes direct test evidence to
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts`.
- `docs/status/app-completion-index.json` now reports:
  - helper row -> `status=verified`, `hasTest=true`, `hasDoc=false`,
    `risk=missing_doc_link`
- `docs/status/project-truth-index.json` no longer routes the helper as
  `missing_test_link`; the remaining scoped follow-up is docs-owned
  `missing_doc_link`.

## Result

The missing-test-link proof lane for `resolveRuntimeTakeoverStatus` is closed
locally. Generated truth now classifies the helper row as a docs gap instead of
a test gap.

## Follow-up

- Next owner:
  Docs Memory Lead + Project Manager.
- Remaining work:
  add direct source-of-truth doc links for
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#resolveRuntimeTakeoverStatus`
  and continue the same docs closure for the adjacent
  `dedupeRuntimeOpenOrders` and `selectRuntimeOpenOrders` helper rows, which
  now also read as `missing_doc_link`.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, migration,
protected account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position close mutation, bot
activation, or LIVE trading action occurred.
