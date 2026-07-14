# Task

## Header
- ID: LUC-1030
- Title: Frontend proof for `PasswordVisibilityToggle` and `useHydrationReady` missing-test-link rows
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: not applicable
- Priority: P1
- Module Confidence Rows: Account access / Web auth password-visibility and hydration-ready executable proof
- Requirement Rows: not applicable
- Quality Scenario Rows: Account access auth-form password toggle semantics and hydration fail-closed render contract
- Risk Rows: app-completion missing-test-link routing for `PasswordVisibilityToggle` and `useHydrationReady`
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1030-ACCOUNT-ACCESS-PASSWORD-VISIBILITY-AND-HYDRATION-FRONTEND-PROOF-2026-07-14
- Mission Status: VERIFIED

## Context

`LUC-1030` was assigned as a narrow frontend lane to close the direct
`missing_test_link` proof gaps for:

- `apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx#PasswordVisibilityToggle`
- `apps/web/src/features/auth/hooks/useHydrationReady.ts`
- `apps/web/src/features/auth/hooks/useHydrationReady.ts#useHydrationReady`

The scope is limited to focused local proof, direct proof-link metadata, and
generated truth readback for these exact rows.

## Goal

Add the smallest direct local proof for the password-visibility control and the
hydration-ready hook, then refresh indexed truth so the scoped rows no longer
route as `missing_test_link`.

## Constraints

- Keep scope to frontend proof and direct proof-link metadata.
- No runtime implementation changes, deploy, push, restart, rollback, env
  edits, or protected account/session checks.
- Do not absorb broader auth workflow, UX polish, or docs-link ownership.

## Definition of Done

- [x] `PasswordVisibilityToggle` has direct component-level automated proof.
- [x] `useHydrationReady` has direct hook-level automated proof.
- [x] Focused web proof command passes.
- [x] Source-truth test-link metadata points directly at the new proof files.
- [x] Generated app-completion and project-truth readback no longer classify
      the scoped rows as `missing_test_link`.
- [x] Durable evidence records the next owner for the remaining docs gap.

## Validation Evidence

- Tests:
  - `corepack pnpm --filter web exec vitest run src/features/auth/components/PasswordVisibilityToggle.test.tsx src/features/auth/hooks/useHydrationReady.test.tsx`
  - `corepack pnpm --filter web run typecheck`
- Generated truth refresh:
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply`
- Manual checks:
  - targeted readback of the new test files
  - targeted readback of `docs/architecture/relations/priority-test-links.csv`
  - targeted readback of `docs/status/app-completion-index.json`
  - targeted readback of `docs/status/project-truth-index.json`
- Source-control readback:
  - `git diff --check`
- Reality status: verified

## Result Report

- Task summary:
  - added direct tests for the auth password toggle and hydration helper,
    linked them in `priority-test-links.csv`, marked the scoped entities
    verified in `scanner-overrides.json`, and refreshed generated truth so the
    scoped rows now route as `missing_doc_link` instead of `missing_test_link`.
- Files changed:
  - `apps/web/src/features/auth/components/PasswordVisibilityToggle.test.tsx`
  - `apps/web/src/features/auth/hooks/useHydrationReady.test.tsx`
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - `docs/graphs/architecture-awareness.*`
  - `docs/graphs/architecture-proof-register.csv`
  - `docs/graphs/architecture-graph.*`
  - `docs/graphs/architecture-health.json`
  - `docs/status/app-completion-index.*`
  - `docs/status/project-truth-index.*`
  - `docs/status/event-chain-index.*`
  - `docs/status/runtime-error-index.*`
  - `docs/status/operational-readiness-index.*`
  - `docs/status/architecture-*.md`
  - `history/tasks/luc-1030-password-visibility-toggle-and-hydration-ready-frontend-proof-2026-07-14-task.md`
  - `history/evidence/luc-1030-password-visibility-toggle-and-hydration-ready-frontend-proof-2026-07-14.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested:
  - focused frontend proof first, then web typecheck, then the standard Soar
    architecture-awareness plus app-completion plus project-truth refresh path.
- What is incomplete:
  - direct source-of-truth docs links for the password toggle and hydration
    helper are still missing.
- Next steps:
  - `Docs Memory Lead + Project Manager` should close the new
    `missing_doc_link` follow-up for:
    `apps/web/src/features/auth/components/PasswordVisibilityToggle.tsx#PasswordVisibilityToggle`,
    `apps/web/src/features/auth/hooks/useHydrationReady.ts`, and
    `apps/web/src/features/auth/hooks/useHydrationReady.ts#useHydrationReady`.
