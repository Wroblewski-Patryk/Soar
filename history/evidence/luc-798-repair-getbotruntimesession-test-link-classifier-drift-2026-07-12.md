# LUC-798 Repair getBotRuntimeSession Test-Link Classifier Drift

Date: 2026-07-12
Owner: 09 RTE (Runtime & Adapter Engineer)
Issue: [LUC-798](/LUC/issues/LUC-798)

## Scope

Verify and refresh the generated source-truth readback for:

- `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession`

## Findings

- The current architecture-awareness graph already contains the expected
  `tests` relation from `apps/api/src/modules/bots/bots.e2e.test.ts` to
  `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession`.
- The controller entity is currently `status: verified`, owner
  `QA Regression Lead`, and its graph evidence includes the e2e test file.
- Rebuilding `app-completion` from the current graph now sets
  `evidence.hasTest=true` for the controller row and reclassifies it to
  `risk=missing_doc_link`.
- Rebuilding `project-truth` confirms the controller row no longer appears as
  `missing_test_link`.

## Verification

- Graph readback:
  - `docs/graphs/architecture-awareness.json`
    -> controller row has `status: verified` and inbound `tests` relation from
    `test:bots-e2e-test-ts:a3d2798461`.
- Generator commands:
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
- Refreshed readback:
  - `docs/status/app-completion-index.json` now records
    `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession` with
    `hasTest=true`, `hasDoc=false`, and `risk=missing_doc_link`.
  - `docs/status/project-truth-index.json` no longer reports the controller
    row as `missing_test_link`.

## Result

The reported `getBotRuntimeSession` test-link classifier drift is resolved in
the current workspace by refreshing generated status outputs from the current
graph. No runtime-adapter code change was justified or made.

## Residual

- `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession` still
  needs doc-link closure and is now correctly routed as `missing_doc_link`.
- `apps/api/src/modules/bots/runtimeSessionRead.service.ts#getBotRuntimeSession`
  remains a distinct `missing_test_link` row and requires separate proof or
  direct test-link routing.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, migration,
protected smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, bot activation, or
LIVE trading action occurred.
