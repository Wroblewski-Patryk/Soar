# Task

## Header
- ID: LUC-1031
- Title: Account access `fetchAuthenticatedBalancePreview` missing-test-link proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P1
- Module Confidence Rows: Account access / API wallets authenticated balance preview helper executable proof
- Requirement Rows: not applicable
- Quality Scenario Rows: not applicable
- Risk Rows: app-completion missing-test-link routing for Account access wallet balance preview helper
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1031-ACCOUNT-ACCESS-FETCHAUTHENTICATEDBALANCEPREVIEW-PROOF-2026-07-14
- Mission Status: VERIFIED

## Context

`LUC-1031` was dispatched from the Account access app-completion queue to close
the missing executable proof for
`apps/api/src/modules/wallets/wallets.service.ts#fetchAuthenticatedBalancePreview`.

## Goal

Close the missing-test-link lane for
`fetchAuthenticatedBalancePreview` with the smallest focused automated proof and
canonical traceability updates.

## Constraints

- Keep scope to focused proof linkage and readback only.
- No runtime behavior changes beyond exporting the existing helper for direct
  test access.
- No deploy, push, restart, rollback, env edits outside test runtime setup, or
  protected account/session checks.

## Definition of Done

- [x] Direct executable proof covers the test-runtime fallback and authenticated
      payload extraction path.
- [x] Focused test command passes.
- [x] Canonical proof metadata links the helper to the focused spec.
- [x] Sequential generator readback no longer classifies the helper as
      `missing_test_link`.
- [x] Durable evidence names the next owner for the remaining docs gap.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter api exec vitest run src/modules/wallets/wallets.service.test.ts --run --reporter=dot`
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
  - added a focused no-DB helper proof in `wallets.service.test.ts`, linked the
    helper directly through `priority-test-links.csv`, marked it verified in
    `scanner-overrides.json`, and advanced generated truth so the helper now
    routes as `missing_doc_link` instead of `missing_test_link`.
- Files changed:
  - `apps/api/src/modules/wallets/wallets.service.ts`
  - `apps/api/src/modules/wallets/wallets.service.test.ts`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - generated graph/status outputs
  - `history/artifacts/luc-1031-build-architecture-awareness-log.txt`
  - `history/evidence/luc-1031-account-access-fetchauthenticatedbalancepreview-proof-2026-07-14.md`
  - `history/tasks/luc-1031-account-access-fetchauthenticatedbalancepreview-proof-2026-07-14-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - focused Vitest proof for the helper, then serial
    architecture-awareness -> app-completion -> project-truth refresh plus
    drift and readback checks.
- What is incomplete:
  - the helper still lacks direct source-of-truth documentation and now routes
    as `missing_doc_link`.
- Next steps:
  - Docs Memory Lead + Project Manager own the remaining doc-link closure for
    `apps/api/src/modules/wallets/wallets.service.ts#fetchAuthenticatedBalancePreview`;
  - no remaining Integration Domain Engineer action stays open on this proof
    row.
