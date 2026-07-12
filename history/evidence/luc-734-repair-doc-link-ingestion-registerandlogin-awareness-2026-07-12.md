# LUC-734 Repair doc-link ingestion for registerAndLogin awareness graph

Date: 2026-07-12
Owner: 09 EDL (Engineering Delivery Lead)
Issue: [LUC-734](/LUC/issues/LUC-734)

## Scope

Repair generated source-of-truth ingestion for:

- `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin`

## Changed

- Refreshed the canonical Soar `architecture-awareness` export.
- Rebuilt app-completion and project-truth from the refreshed awareness graph.
- Recorded the sequencing pitfall in `.codex/context/LEARNING_JOURNAL.md`.
- Did not change runtime/product code.

## Verification

- Generated awareness relation readback:
  - PASS: `docs/graphs/architecture-awareness.json` now contains
    `document:api-deep-dive-backtests-module:0a87980ceb -> documents ->
    function:registerandlogin:ae67364dcb`.
- Generated app-completion readback:
  - PASS: `docs/status/app-completion-index.json -> priorityReviewItems`
    no longer contains
    `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin`.
- Generated project-truth readback:
  - PASS: `docs/status/project-truth-index.md` no longer routes the first gap
    to `registerAndLogin`; the new first gap is
    `Account access: getOwnedBotRuntimeSession has app-completion risk missing_doc_link.`
- Canonical generator runs:
  - PASS:
    `build-architecture-awareness-index.mjs` -> `10777` entities,
    `35200` relations.
  - PASS:
    `build-app-completion-index.mjs` -> `missingDocLink=1984`.
  - PASS:
    `build-project-truth-indexes.mjs --apply` -> first gap advanced to
    `apps/api/src/modules/bots/botOwnership.service.ts#getOwnedBotRuntimeSession`.

## Root Cause

The canonical source-truth inputs for the Backtests helper were already present.
The effective repair was to rebuild downstream generated indexes from the fresh
awareness graph in the correct order:

1. `architecture-awareness`
2. `app-completion`
3. `project-truth`

When downstream indexes read a stale graph, the row remained incorrectly routed
as `missing_doc_link`.

## Result

Current truth for [LUC-734](/LUC/issues/LUC-734):

- `registerAndLogin` now has generated documentation linkage in
  `architecture-awareness.json`.
- The scoped row is no longer in the app-completion priority review queue.
- Project truth advanced beyond the scoped Backtests helper.

## Next Owner / Action

- Owner: Docs Memory Lead + Project Manager.
- Action: route the new first Account access doc-link gap for
  `apps/api/src/modules/bots/botOwnership.service.ts#getOwnedBotRuntimeSession`.

## Boundary

No runtime Backtests/auth/bots code, deploy, push, restart, rollback, env edit,
migration, protected account/session smoke, secret/account readback, DB/Redis
mutation, exchange/payment/subscription mutation, order, position, bot
activation, or LIVE trading action occurred.
