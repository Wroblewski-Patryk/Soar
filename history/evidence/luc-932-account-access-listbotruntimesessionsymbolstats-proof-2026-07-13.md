# LUC-932 Account Access listBotRuntimeSessionSymbolStats Proof

Date: 2026-07-13
Owner: 09 TAE (Test Automation Engineer)
Issue: [LUC-932](/LUC/issues/LUC-932)

## Scope

Prove the Account access missing-test-link row for:

- `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats`

## Changed

- Linked the controller entity to the existing executable route proof in
  `apps/api/src/modules/bots/bots.e2e.test.ts` through
  `docs/architecture/relations/priority-test-links.csv`.
- Added a verified scanner override and explicit `tests` relation override for
  the controller entity in `docs/architecture/scanner-overrides.json`.
- Refreshed architecture-awareness, app-completion, and project-truth outputs
  in the required serial order.

## Verification

- Focused controller proof:
  - PASS:
    `corepack pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run -t "lists and returns runtime session monitoring summary with ownership isolation" --reporter=dot --test-timeout 30000`
  - Result: `1` test passed, remaining unrelated tests skipped by filter.
  - Covered behavior:
    - owner `GET /dashboard/bots/:id/runtime-sessions/:sessionId/symbol-stats`
      returns the symbol stats list and summary readback;
    - non-owner access to the same bot/session symbol-stats route fails closed
      with `404`.
- Sequential source-truth refresh:
  - PASS:
    `build-architecture-awareness-index.mjs`
  - PASS:
    `build-app-completion-index.mjs`
  - PASS:
    `build-project-truth-indexes.mjs --apply`

## Readback

- `docs/graphs/architecture-awareness.json` now marks the controller entity
  `verified` and includes direct test evidence to
  `apps/api/src/modules/bots/bots.e2e.test.ts`.
- `docs/status/app-completion-index.json` now reports:
  - controller row -> `status=verified`, `hasTest=true`, `hasDoc=false`,
    `risk=missing_doc_link`
- `docs/status/project-truth-index.json` no longer routes the controller row as
  `missing_test_link`; the remaining scoped follow-up is docs-owned
  `missing_doc_link`.

## Result

The missing-test-link proof lane for
`listBotRuntimeSessionSymbolStats` is closed locally. Generated truth now
classifies the controller row as a docs gap instead of a test gap.

## Follow-up

- Next owner:
  Docs Memory Lead + Project Manager.
- Remaining work:
  add direct source-of-truth doc links for
  `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessionSymbolStats`
  and continue the existing docs lane for
  `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts#listBotRuntimeSessionSymbolStats`.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, migration,
protected account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position close mutation, bot
activation, or LIVE trading action occurred.
