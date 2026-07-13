# LUC-934 Account Access dedupeRuntimeOpenOrders Readback Closure

Date: 2026-07-13
Owner: 09 TAE (Test Automation Engineer)
Issue: [LUC-934](/LUC/issues/LUC-934)

## Scope

Validate whether the wake-title Account access `missing_test_link` claim for:

- `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders`

still required new test-automation work after the adjacent runtime open-orders
helper proof landed locally in [LUC-933](/LUC/issues/LUC-933).

## Verification

- Focused helper proof readback:
  - PASS:
    `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts --run --reporter=dot`
  - Result: `1` file passed, `5` tests passed.
- Sequential source-truth refresh:
  - PASS:
    `build-architecture-awareness-index.mjs`
  - PASS:
    `build-app-completion-index.mjs`
  - PASS:
    `build-project-truth-indexes.mjs --apply`

## Readback

- `docs/graphs/architecture-awareness.csv` now shows
  `dedupeRuntimeOpenOrders` with direct test linkage to
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.test.ts`.
- `docs/status/app-completion-index.json` now reports the scoped row as:
  - `status=implemented`
  - `hasTest=true`
  - `hasDoc=false`
  - `risk=missing_doc_link`
- `docs/status/project-truth-index.json` routes the scoped row as:
  - `Account access: dedupeRuntimeOpenOrders has app-completion risk missing_doc_link.`

## Result

`LUC-934` did not require a new proof implementation. Fresh local verification
confirms the prior `missing_test_link` title is stale: the helper is already
covered by executable proof, and the remaining gap is direct documentation
linkage.

## Next Owner

- Docs Memory Lead + Project Manager

## Remaining Work

- add a direct source-of-truth docs link for
  `apps/api/src/modules/bots/runtimeSessionOpenOrdersReadModel.service.ts#dedupeRuntimeOpenOrders`.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, migration,
protected account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position close mutation, bot
activation, or LIVE trading action occurred.
