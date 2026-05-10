# Task

## Header
- ID: V1-PRODUCT-ACTION-AUDIT-P0-2026-05-10
- Title: Seed product action audit and fix first P0 UI/runtime regressions
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: current V1 architecture and runtime contracts
- Priority: P0
- Iteration: 2026-05-10-PRODUCT-ACTION-AUDIT-P0
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is TESTER because the user-reported failures show audit evidence quality is the current bottleneck.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The user reported two concrete production-visible inconsistencies:

- a PAPER bot could not be deleted from the Bots UI
- the Dashboard positions table could show prospective TTP protection while the position was negative

These are treated as symptoms of a broader evidence-quality failure. Previous
V1 reports proved deployment health, route reachability, selected local
contracts, and some architecture alignment, but they did not prove every
user-visible action path on representative data.

## Goal
Fix the first two confirmed P0 regressions and create a product action audit
matrix that future iterations must execute module by module before V1 can be
called complete.

## Scope
- `apps/api/src/modules/bots/botsCommand.service.ts`
- `apps/api/src/modules/bots/bots.e2e.test.ts`
- `apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.ts`
- `apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.test.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts`
- `docs/operations/v1-product-action-audit-matrix-2026-05-10.md`
- canonical state/context files updated in this task

## Implementation Plan
1. Fix bot deletion cleanup for runtime dedupe references before deleting the bot.
2. Add DB-backed regression coverage for deleting a bot with runtime session data and runtime dedupe rows.
3. Fix dashboard/runtime TTP display so prospective protection is hidden when live PnL is not positive.
4. Add focused Web regression coverage for both runtime row building and dashboard display resolver.
5. Publish an initial full-surface product action audit matrix that distinguishes route reachability from action correctness.
6. Run focused validation and update state docs.

## Acceptance Criteria
- Deleting a bot with runtime history and dedupe records returns `204`, removes runtime session/event/stat rows, and keeps dedupe history with `botId=null`.
- Dashboard prospective TTP display is not shown for rows with non-positive live PnL.
- The audit matrix contains every V1 module/action family as PASS/FAIL/UNVERIFIED/BLOCKED and marks the two reported regressions explicitly.
- V1 state no longer claims that only protected/formal release evidence remains.

## Definition of Done
- [x] Focused API bot deletion test passes.
- [x] Focused Web runtime/dashboard TTP tests pass.
- [x] Audit matrix and source-of-truth state are updated.
- [x] Review confirms no workaround, duplicate logic, or architecture drift.

## Validation Evidence
- Tests:
  - `apps/web/node_modules/.bin/vitest.CMD run src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts --run` => PASS, `2` files, `13/13` tests.
  - `apps/api/node_modules/.bin/vitest.CMD run src/modules/bots/bots.e2e.test.ts --run -t "deletes bot with runtime history cleanup"` with local `DATABASE_URL` from `apps/api/.env` => PASS, `1/1` focused test.
  - `apps/web/node_modules/.bin/vitest.CMD run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` => PASS, `17/17` tests.
  - `apps/api/node_modules/.bin/tsc.CMD --noEmit` => PASS.
  - `apps/web/node_modules/.bin/tsc.CMD --noEmit` => PASS.
- Manual checks:
  - `git diff --check` => PASS with line-ending warnings only.
- Screenshots/logs:
  - Not captured in this slice; production destructive bot deletion was not performed.
- High-risk checks:
  - No LIVE bot activation, live-money order, or production user-data deletion was performed.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `.agents/core/operating-system.md`
  - `.agents/core/execution-loop.md`
  - `.codex/templates/task-template.md`
  - `docs/architecture/architecture-source-of-truth.md` indirectly via active state and V1 docs.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Result Report
- Task summary: seeded the action-level V1 audit matrix and fixed the first two confirmed P0 regressions: bot deletion cleanup now handles runtime dedupe references, and prospective TTP display is hidden when live PnL is not positive.
- Files changed: API bot command/e2e files, Web runtime/dashboard derivation tests and logic, this task doc, audit matrix, and state/context files.
- How tested: focused API/Web Vitest packs, API/Web typecheck, presenter regression, and diff check.
- What is incomplete: the full product action audit is not complete; only the first two confirmed regressions are fixed in this slice.
- Next steps: execute the audit matrix module-by-module, beginning with Bots CRUD/actions and Dashboard runtime tables.
