# LUC-1108 Account Access sumRuntimeManagedPositionQuantity Proof

## Header
- ID: LUC-1108
- Title: Account access `sumRuntimeManagedPositionQuantity` missing-test-link proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P1
- Module Confidence Rows: Account access / API bots runtime managed-position quantity repository helper executable proof
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: app-completion missing-test-link routing for Account access runtime managed-position quantity repository helper
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1108-ACCOUNT-ACCESS-SUMRUNTIMEMANAGEDPOSITIONQUANTITY-PROOF-2026-07-14
- Mission Status: VERIFIED

## Context

`LUC-1108` was dispatched from the Account access app-completion queue to close
the missing executable proof for
`apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionQuantity`.

## Goal

Close the missing-test-link lane for `sumRuntimeManagedPositionQuantity` with
the smallest focused automated proof and canonical traceability updates.

## Constraints

- Keep scope to focused repository proof linkage and readback only.
- No runtime behavior, deploy, push, restart, rollback, env edit, or protected
  account/session checks.
- Avoid broad repository-file test inference that would silently close adjacent
  rows.

## Definition of Done

- [x] Direct executable proof covers scoped `where` forwarding into
      `prisma.position.aggregate`.
- [x] Focused test command passes.
- [x] Canonical proof metadata links the helper to the focused spec.
- [x] Sequential generator readback no longer classifies the helper as
      `missing_test_link`.
- [x] Durable evidence names the next owner for the remaining docs gap.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/bots/sumRuntimeManagedPositionQuantity.repository.test.ts --run --reporter=dot`
- Source truth:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `pnpm run architecture:graph:drift:strict`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
- Manual checks:
  - targeted readback of `docs/status/app-completion-index.*`
  - targeted readback of `docs/status/project-truth-index.*`
  - targeted readback of `docs/architecture/relations/priority-test-links.csv`
  - targeted readback of `docs/architecture/scanner-overrides.json`
- Source-control readback:
  - `git diff --check`
- Reality status: verified

## Result Report

- Task summary:
  - added a focused repository proof in
    `sumRuntimeManagedPositionQuantity.repository.test.ts`, linked the helper
    directly through `priority-test-links.csv`, marked it verified in
    `scanner-overrides.json`, and advanced generated truth so the helper now
    routes as `missing_doc_link` instead of `missing_test_link`.
- Files changed:
  - `apps/api/src/modules/bots/sumRuntimeManagedPositionQuantity.repository.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated graph/status outputs
  - `history/evidence/luc-1108-account-access-sumruntimemanagedpositionquantity-proof-2026-07-14.md`
  - `history/tasks/luc-1108-account-access-sumruntimemanagedpositionquantity-proof-2026-07-14-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - focused Vitest proof for the repository helper, then serial
    architecture-awareness -> app-completion -> project-truth refresh plus
    drift and readback checks.
- What is incomplete:
  - the helper still lacks direct source-of-truth documentation and now routes
    as `missing_doc_link`.
- Next steps:
  - Docs Memory Lead + Project Manager own the remaining doc-link closure for
    `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionQuantity`;
  - the next Test Automation Engineer + QA Regression Lead front row is
    `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts#sumRuntimeManagedPositionRealizedPnl`;
  - no remaining Test Automation proof action stays open on this row.
