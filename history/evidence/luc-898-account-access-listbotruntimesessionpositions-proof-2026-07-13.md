# LUC-898 Account Access listBotRuntimeSessionPositions Proof

Date: 2026-07-13
Owner: 09 TAE (Test Automation Engineer)
Issue: [LUC-898](/LUC/issues/LUC-898)

## Scope

Prove the Account access missing-test-link rows for:

- `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionPositions`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts#listBotRuntimeSessionPositions`

## Changed

- Linked the controller entity to the existing executable route proof in
  `apps/api/src/modules/bots/bots.e2e.test.ts` through
  `docs/architecture/relations/priority-test-links.csv`.
- Added a focused no-DB spec
  `apps/api/src/modules/bots/runtimeSessionPositionsRead.list.test.ts` for the
  read-model service row.
- Added verified scanner overrides and explicit `tests` relation overrides for
  both scoped entities in `docs/architecture/scanner-overrides.json`.
- Refreshed architecture-awareness, app-completion, and project-truth outputs
  in the required sequential order.

## Verification

- Focused service proof:
  - PASS:
    `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.list.test.ts --run --reporter=dot`
  - Result: `1` file passed, `2` tests passed.
  - Covered behavior:
    - fail-closed `null` result when the selected user/bot does not own the
      runtime session;
    - `BOT_MANAGED` scoping for both runtime position reads and runtime
      open-order reads on the owned-session path.
- Focused controller proof:
  - PASS:
    `corepack pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run -t "lists and returns runtime session monitoring summary with ownership isolation" --reporter=dot --test-timeout 30000`
  - Result: `1` test passed, `26` skipped.
  - Covered behavior:
    - owner `GET /dashboard/bots/:id/runtime-sessions/:sessionId/positions`
      returns positions summary, open/history rows, and capital summary data;
    - non-owner access to the same bot/session positions route fails closed
      with `404`.
- Sequential source-truth refresh:
  - PASS:
    `build-architecture-awareness-index.mjs`
    -> `10831` entities / `35504` relations.
  - PASS:
    `build-app-completion-index.mjs`
    -> `missingTestLink=974`, `missingDocLink=1983`.
  - PASS:
    `build-project-truth-indexes.mjs --apply`.

## Readback

- `docs/graphs/architecture-awareness.json` now marks both scoped entities
  `verified` and includes direct `tests` relations to:
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.list.test.ts`
- `docs/status/app-completion-index.json` now reports:
  - controller row -> `status=verified`, `hasTest=true`, `hasDoc=false`,
    `risk=missing_doc_link`
  - read-model service row -> `status=verified`, `hasTest=true`,
    `hasDoc=false`, `risk=missing_doc_link`
- `docs/status/project-truth-index.md` no longer routes either scoped entity as
  `missing_test_link`; the first remaining scoped gap is docs-owned
  `missing_doc_link`.

## Result

The missing-test-link proof lane for `listBotRuntimeSessionPositions` is closed
locally. Both the controller and the read-model service now have direct
executable proof and generated truth reflects them as docs gaps rather than
test gaps.

## Follow-up

- Next owner:
  Docs Memory Lead + Project Manager.
- Remaining work:
  add direct source-truth doc links for both
  `listBotRuntimeSessionPositions` entities if the queue chooses to close the
  resulting `missing_doc_link` rows.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, migration,
protected account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position close mutation, bot
activation, or LIVE trading action occurred.
