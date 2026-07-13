# LUC-938 Runtime Session Trades And Symbol-Stats Backend Reads

Date: 2026-07-13
Owner: 09 CBE (Core Backend Engineer)
Issue: [LUC-938](/LUC/issues/LUC-938)

## Scope

Prove the Account access backend-read rows for:

- `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionTrades`
- `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts#listBotRuntimeSessionTrades`
- confirm generated truth for the already-local
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats`
- confirm generated truth for the existing
  `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts#listBotRuntimeSessionSymbolStats`

## Changed

- Added a focused no-DB spec
  `apps/api/src/modules/bots/runtimeSessionTradesRead.list.test.ts` for the
  runtime trades read-service row.
- Linked the trades controller entity to the existing executable route proof in
  `apps/api/src/modules/bots/bots.e2e.test.ts` through
  `docs/architecture/relations/priority-test-links.csv`.
- Added verified scanner overrides and explicit `tests` relation overrides for
  the scoped `trades` controller and read-service entities in
  `docs/architecture/scanner-overrides.json`.
- Refreshed architecture-awareness, app-completion, and project-truth outputs
  in the required sequential order.
- Confirmed the existing local `symbol-stats` proof lane from
  [LUC-932](/LUC/issues/LUC-932) remains materialized as docs-owned
  `missing_doc_link`, not `missing_test_link`.

## Verification

- Focused `trades` read-service proof:
  - PASS:
    `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionTradesRead.list.test.ts --run --reporter=dot`
  - Result: `1` file passed, `2` tests passed.
  - Covered behavior:
    - fail-closed `null` result when the selected user/bot does not own the
      runtime session;
    - canonical selected-symbol scoping and query forwarding into the runtime
      trade read path for an owned session.
- Focused controller proof:
  - PASS:
    `corepack pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run -t "lists and returns runtime session monitoring summary with ownership isolation" --reporter=dot --test-timeout 30000`
  - Result: `1` test passed, `26` skipped.
  - Covered behavior:
    - owner `GET /dashboard/bots/:id/runtime-sessions/:sessionId/trades`
      returns the trades list and summary readback;
    - non-owner access to the same bot/session trades route fails closed with
      `404`;
    - owner/non-owner `symbol-stats` route behavior remains covered by the same
      focused runtime monitoring slice.
- Sequential source-truth refresh:
  - PASS:
    `build-architecture-awareness-index.mjs`
    -> `10848` entities / `35603` relations.
  - PASS:
    `build-app-completion-index.mjs`
    -> `missingTestLink=969`, `missingDocLink=1988`.
  - PASS:
    `build-project-truth-indexes.mjs --apply`.

## Readback

- `docs/graphs/architecture-awareness.json` now marks the scoped `trades`
  controller and read-service entities `verified` with direct `tests`
  relations to:
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
  - `apps/api/src/modules/bots/runtimeSessionTradesRead.list.test.ts`
- `docs/status/app-completion-index.json` now reports:
  - `bots.controller.ts#listBotRuntimeSessionTrades`
    -> `hasTest=true`, `hasDoc=false`, `risk=missing_doc_link`
  - `runtimeSessionTradesRead.service.ts#listBotRuntimeSessionTrades`
    -> `hasTest=true`, `hasDoc=false`, `risk=missing_doc_link`
  - `bots.controller.ts#listBotRuntimeSessionSymbolStats`
    -> `hasTest=true`, `hasDoc=false`, `risk=missing_doc_link`
  - `runtimeSessionSymbolStatsRead.service.ts#listBotRuntimeSessionSymbolStats`
    -> `hasTest=true`, `hasDoc=false`, `risk=missing_doc_link`
- `docs/status/project-truth-index.md` no longer routes any of the scoped
  runtime `trades` or `symbol-stats` backend rows as `missing_test_link`.

## Result

The backend-read proof lane for runtime session `trades` is now closed locally,
and the paired runtime `symbol-stats` backend read lane remains synchronized in
generated truth. The scoped rows now route as docs-owned `missing_doc_link`
follow-ups instead of test gaps.

## Follow-up

- Next owner:
  Docs Memory Lead + Project Manager.
- Remaining work:
  add direct source-of-truth doc links for the scoped runtime `trades` and
  `symbol-stats` controller/read-service entities.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, migration,
protected account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position close mutation, bot
activation, or LIVE trading action occurred.
