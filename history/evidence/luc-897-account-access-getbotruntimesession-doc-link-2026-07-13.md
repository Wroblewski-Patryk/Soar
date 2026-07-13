# LUC-897 Account Access getBotRuntimeSession Doc-Link Evidence

Date: 2026-07-13
Owner: 04 DSM (Documentation Steward)
Issue: [LUC-897](/LUC/issues/LUC-897)

## Scope

Resolve the current Account access source-truth gap for:

- `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession`

## Changed

- Added the `getBotRuntimeSession` controller classification row to
  `docs/modules/api-bots.md`.
- Added the matching documentation-link relation to
  `docs/architecture/relations/documentation-links.csv`.
- Added the explicit `documents` relation override to
  `docs/architecture/scanner-overrides.json`.
- Regenerated architecture-awareness, app-completion, and project-truth
  outputs in the required sequential order.

## Verification

- Canonical doc classification readback:
  - PASS: `docs/modules/api-bots.md` now contains the
    `bots.controller.ts#getBotRuntimeSession` classification row in
    `## 9A. Architecture-Awareness Doc-Link Classification`.
- Documentation-link registry readback:
  - PASS:
    `docs/architecture/relations/documentation-links.csv` now contains
    `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession,docs/modules/api-bots.md`.
- Generated architecture-awareness readback:
  - PASS: `docs/graphs/architecture-awareness.json` now contains the
    `documents` relation from `docs/modules/api-bots.md` to
    `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession`.
- Generated app-completion readback:
  - PASS: `docs/status/app-completion-index.json` no longer includes
    `apps/api/src/modules/bots/bots.controller.ts#getBotRuntimeSession` in
    `priorityReviewItems`.
- Generated project-truth readback:
  - PASS: `docs/status/project-truth-index.json` no longer includes the
    controller row in `gaps`.
  - PASS: the first Account access gap advanced to
    `apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd`
    as `implemented_needs_proof`.
- Generator and integrity commands:
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
    -> `entities=10815`, `relations=35417`, `relationOverridesApplied=16`.
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
    -> `missingDocLink=1982`, `implementedNeedsProof=114`, controller row removed from priority review.
  - PASS:
    `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
    -> controller row removed from project-truth gaps.
  - PASS:
    `pnpm run architecture:graph:drift:strict`
    -> `853/853 covered`, `0 missing`.
  - PASS:
    `git diff --check`
    -> line-ending warnings only, no substantive diff errors.

## Result

Current truth for [LUC-897](/LUC/issues/LUC-897):

- The Account access controller row was a real docs-owned `missing_doc_link`
  before the source-truth update.
- The scoped docs/source-truth entries now ingest correctly into the generated
  graph and status indexes.
- The controller row is no longer a project-truth gap. The next live gap moves
  to QA-owned proof for
  `apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd`.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, migration,
protected account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position, bot activation, or
LIVE trading action occurred.
