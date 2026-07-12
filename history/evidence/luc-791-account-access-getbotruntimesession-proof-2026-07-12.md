# LUC-791 Account Access getBotRuntimeSession Proof

Date: 2026-07-12
Owner: 09 TAE (Test Automation Engineer)
Issue: [LUC-791](/LUC/issues/LUC-791)

## Scope

Prove the Account access missing-test-link row for:

- `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession`

## Changed

- Linked the controller entity to the existing executable proof in
  `apps/api/src/modules/bots/bots.e2e.test.ts` through
  `docs/architecture/relations/priority-test-links.csv`.
- Added a verified scanner override for the controller row in
  `docs/architecture/scanner-overrides.json`.
- Refreshed architecture-awareness, app-completion, and project-truth outputs.
- During the first readback this exposed a classifier mismatch, which was then
  repaired under [LUC-798](/LUC/issues/LUC-798). The final generated truth now
  treats the controller as test-covered and routes it only as a docs-owned
  `missing_doc_link` row.

## Verification

- Focused proof command:
  - PASS:
    `pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run -t "lists and returns runtime session monitoring summary with ownership isolation" --reporter=dot --test-timeout 30000`
- Proof behavior covered by the linked test:
  - owner `GET /dashboard/bots/:id/runtime-sessions/:sessionId` returns the
    session detail and summary metrics;
  - non-owner access to the same bot/session route fails closed with `404`.
- Readback commands:
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
    -> `10788` entities / `35264` relations.
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
    -> final readback for
    `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession` is
    `status: verified`, `hasTest=true`, `hasDoc=false`, `risk: missing_doc_link`.
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
    -> final first gap is docs-owned
    `apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd`
    as `missing_doc_link`, and the controller row is no longer routed as
    `missing_test_link`.
- Intermediate mismatch that was resolved by follow-up:
  - `docs/graphs/architecture-awareness.json` entity
    `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession`
    -> `status: verified`, evidence includes the linked e2e test.
  - The same graph contains a `tests` relation from
    `test:bots-e2e-test-ts:a3d2798461` to
    `function:getbotruntimesession:31527b2117`.
  - This temporarily diverged from `app-completion-index.json` until
    [LUC-798](/LUC/issues/LUC-798) refreshed the stale generated truth.

## Result

`getBotRuntimeSession` is now directly linked to executable ownership-isolation
proof, and the generated app-completion/project-truth outputs no longer classify
the controller as `missing_test_link`. The remaining gap for this controller is
docs-owned `missing_doc_link`.

## Follow-up

- [LUC-798](/LUC/issues/LUC-798) repaired the stale classifier/readback path.
- The next live owner for this controller row is Docs Memory Lead + Project
  Manager, because the final remaining risk is `missing_doc_link`, not test
  coverage.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, migration,
protected account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, bot activation, or
LIVE trading action occurred.
