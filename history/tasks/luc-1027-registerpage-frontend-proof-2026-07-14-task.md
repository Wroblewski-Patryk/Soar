# Task

## Header
- ID: LUC-1027
- Title: Frontend proof for `RegisterPage` missing-test-link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: [LUC-1024](/LUC/issues/LUC-1024)
- Priority: P1
- Module Confidence Rows: Account access / Web auth register page executable proof
- Requirement Rows: not applicable
- Quality Scenario Rows: Account access public register route signed-out render and authenticated redirect
- Risk Rows: app-completion missing-test-link routing for `RegisterPage`
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1027-ACCOUNT-ACCESS-REGISTERPAGE-FRONTEND-PROOF-2026-07-14
- Mission Status: VERIFIED

## Context

`LUC-1027` was assigned as a narrow frontend lane to close the direct
`missing_test_link` proof gap for
`apps/web/src/features/auth/pages/RegisterPage.tsx#RegisterPage` without
expanding into broader auth workflow rewrites.

## Goal

Add the smallest direct local proof for `RegisterPage` and record the exact
next owner action for generated truth refresh.

## Constraints

- Keep scope to page-level proof and direct proof-link metadata.
- No runtime implementation changes, deploy, push, restart, rollback, env
  edits, or protected account/session checks.
- Do not absorb broader login/register flow ownership.

## Definition of Done

- [x] `RegisterPage` has direct page-level automated proof.
- [x] Focused web proof command passes.
- [x] Source-truth test-link metadata points directly at the page proof.
- [x] Durable evidence names the next owner for generated truth refresh.

## Validation Evidence

- Tests:
  - `pnpm --filter web exec vitest run src/features/auth/pages/RegisterPage.test.tsx`
  - `pnpm --filter web exec vitest run src/features/auth/pages/RegisterPage.test.tsx src/features/auth/components/RegisterForm.test.tsx src/features/auth/hooks/useRegisterForm.test.tsx`
- Manual checks:
  - targeted readback of `apps/web/src/features/auth/pages/RegisterPage.tsx`
  - targeted readback of `docs/architecture/relations/priority-test-links.csv`
- Source-control readback:
  - `git diff -- apps/web/src/features/auth/pages/RegisterPage.test.tsx docs/architecture/relations/priority-test-links.csv`
- Reality status: verified

## Result Report

- Task summary:
  - added a dedicated `RegisterPage` test file proving signed-out render and
    authenticated redirect behavior, then linked the page function directly in
    `priority-test-links.csv`.
- Files changed:
  - `apps/web/src/features/auth/pages/RegisterPage.test.tsx`
  - `docs/architecture/relations/priority-test-links.csv`
  - `history/tasks/luc-1027-registerpage-frontend-proof-2026-07-14-task.md`
  - `history/evidence/luc-1027-registerpage-frontend-proof-2026-07-14.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - targeted page proof first, then adjacent register auth tests to confirm the
    new page proof did not break neighboring contract coverage.
- Generated truth readback:
  - `docs/status/app-completion-index.*` already classifies `RegisterPage` as
    `missing_doc_link`, and `docs/status/project-truth-index.*` now matches
    that `missing_doc_link` routing for the same page.
- Next steps:
  - `09 EDL` and `09 QVE` should keep the broader generated truth refresh
    moving for the rest of the Account access backlog.
