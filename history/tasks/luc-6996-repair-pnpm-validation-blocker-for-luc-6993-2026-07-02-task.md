# Task

## Header
- ID: LUC-6996
- Title: Repair pnpm validation blocker for LUC-6993 release candidate
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: CTO
- Depends on: LUC-6993
- Priority: P0
- Module Confidence Rows: Web dashboard validation path
- Requirement Rows: LUC-6993 candidate dependency validation
- Quality Scenario Rows: release validation reproducibility
- Risk Rows: package-manager metadata drift
- Iteration: 2026-07-02
- Operation Mode: BUILDER
- Mission ID: LUC-6996-REPAIR-PNPM-VALIDATION-BLOCKER-2026-07-02
- Mission Status: VERIFIED

## Context
LUC-6993 prepared candidate commit `47965acc` on branch
`luc-6993-promote-luc-6939-dashboard-hydration-repair`, but clean validation
was blocked before useful test execution by pnpm `11.7.0` reporting
`ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`.

## Goal
Restore the frozen dependency install and focused Web validation path for
candidate `47965acc` without changing product behavior or deployment state.

## Scope
- `package.json`
- `pnpm-workspace.yaml`
- `history/tasks/luc-6996-repair-pnpm-validation-blocker-for-luc-6993-2026-07-02-task.md`

## Implementation Plan
1. Reproduce the frozen install blocker on the clean LUC-6993 candidate worktree.
2. Move the existing pnpm overrides from ignored `package.json#pnpm.overrides`
   to pnpm's current workspace settings.
3. Convert the previous build-script policy to pnpm 11 `allowBuilds`.
4. Rerun frozen install, focused dashboard a11y smoke, and Web typecheck.

## Acceptance Criteria
- `pnpm install --frozen-lockfile` succeeds with pnpm `11.7.0`.
- Focused Web dashboard a11y smoke succeeds.
- Web typecheck succeeds.
- No push, deploy, restart, rollback, secret readback, account mutation,
  database/Redis mutation, exchange action, order, position, payment,
  subscription, or live-trading action occurs.

## Definition of Done
- Dependency metadata repair is committed in the candidate worktree.
- Validation commands and outcomes are recorded.
- Remaining risks are explicit.

## Forbidden
- No release push or deploy from this blocker issue.
- No product behavior changes.
- No temporary bypass of pnpm frozen install.
- No secret or production account access.

## Result Report
- Task summary:
  moved pnpm overrides into `pnpm-workspace.yaml` because pnpm 11 ignores the
  `pnpm` field in `package.json`; converted build-script policy to
  `allowBuilds` with existing approved native/runtime builders set to `true`
  and unapproved/previously ignored builders set to `false`.
- Files changed:
  `package.json`, `pnpm-workspace.yaml`, this evidence file.
- Validation:
  - PASS: `pnpm install --frozen-lockfile` under pnpm `11.7.0`.
  - PASS: `pnpm --filter web exec vitest run src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/app/dashboard/dashboard.a11y.smoke.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx`
    (`3` files / `11` tests).
  - PASS: `pnpm --filter web run typecheck`.
  - PASS: `git diff --check -- package.json pnpm-workspace.yaml` with CRLF
    warnings only.
- Additional observation:
  the documented script form
  `pnpm --filter web test -- src/ui/layout/dashboard/PageTitle.a11y.test.tsx src/app/dashboard/dashboard.a11y.smoke.test.tsx src/ui/layout/dashboard/Header.responsive.test.tsx`
  unexpectedly ran a broader Web suite in this environment. It failed on
  pre-existing dashboard runtime expectations in
  `HomeLiveWidgets.runtime-table-audit.test.tsx` and
  `HomeLiveWidgets.test.tsx`; the direct focused `vitest run` command passed.
- Deployment impact:
  none. No production mutation was performed.
- Residual risk:
  the broader dashboard runtime test failures are outside this metadata repair
  and should remain owned by the dashboard repair/release validation lane if
  full-suite Web validation is required before promotion.
- Next owner:
  LUC-6993 release owner can resume candidate source-control/push/deploy
  provenance gating after reviewing this local validation repair.
