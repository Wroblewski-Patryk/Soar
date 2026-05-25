# Task: Web Dashboard Selected-Bot Load Dependency Closure

Date: 2026-05-24

## Context

The active readiness mission continued with locally executable verification while
full production V1 GO remains blocked on protected inputs. Repository lint found
one Dashboard Home hook warning in
`apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`.

## Goal

Remove the selected-bot load dependency drift so Dashboard Home runtime loading
keeps its React hook dependency contract explicit and warning-free.

## Constraints

- Keep the change scoped to the confirmed hook dependency issue.
- Do not change Dashboard Home product behavior beyond correcting dependency
  tracking.
- Do not run protected production proof or LIVE exchange mutation without
  approved operator context.

## Implementation Plan

1. Keep `load` stable while allowing it to read the current selected bot
   through a synchronized ref.
2. Run focused Dashboard Home hook tests.
3. Run Web lint/typecheck and repository guardrails.
4. Sync source-of-truth state for the touched module.

## Acceptance Criteria

- Focused Dashboard Home hook tests pass.
- Web lint reports no ESLint warnings or errors for the touched scope.
- Web typecheck passes.
- Repository guardrails pass, including strict architecture graph drift.
- V1 production readiness status remains truthfully blocked on protected
  inputs and evidence gates.

## Definition of Done

- Code fix is implemented.
- Validation evidence is recorded.
- Task board, project state, system health, active mission, and module
  confidence ledger are updated.

## Result Report

Status: **VERIFIED_LOCAL**

Changed:

- `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
  now syncs `selectedBotId` into `selectedBotIdRef` and reads that ref inside
  `load`, keeping the callback warning-free without turning bot selection into
  a full reload trigger.

Validation:

- `corepack pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx --run --reporter=dot`
  passed (`1` file / `4` tests).
- `corepack pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run --reporter=dot`
  passed (`3` files / `26` tests), covering the selection stability regression
  exposed by the full Web suite.
- `corepack pnpm --filter web run test -- --run` passed (`150` files / `534`
  tests).
- `corepack pnpm --filter web run lint` passed with no ESLint warnings/errors.
- `corepack pnpm --filter web run typecheck` passed.
- `corepack pnpm run quality:guardrails` passed.
- `corepack pnpm run architecture:graph:drift:strict` passed with `796/796`
  covered and `0` missing.
- `corepack pnpm run lint` passed with no ESLint warnings/errors.

Residual Risk:

- This is local code quality and dependency-contract proof only. The current V1
  release candidate remains `NO-GO` until protected production auth/context,
  restore/rollback/UI/LIVEIMPORT/RC evidence, and real approver inputs are
  available and pass.
