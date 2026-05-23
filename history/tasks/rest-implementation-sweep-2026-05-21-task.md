# REST-IMPLEMENTATION-SWEEP-2026-05-21

## Context
- User asked for an agent-assisted check of the remaining implementation after
  the frontend/runtime DCA sweep.
- The coordinator split the work into frontend UX, backend/runtime, and
  QA/regression lanes. Architecture/Ops/Docs review stayed local because the
  agent thread limit was reached.

## Goal
- Verify whether remaining local frontend/backend implementation has obvious
  architecture, safety, or UX defects.
- Repair confirmed local defects that are safe to fix without protected
  production inputs or LIVE mutation.

## Constraints
- No production data mutation.
- No LIVE order/cancel/close execution.
- No hidden risk-acknowledgement bypasses.
- Preserve existing dirty worktree changes.

## Definition of Done
- Confirmed P0/P1 local defects repaired or explicitly recorded if out of
  safe local scope.
- Focused API/Web tests pass for touched behavior.
- API/Web typecheck pass for touched behavior.
- Source-of-truth docs and state files updated.

## Forbidden
- Do not claim current production `100%` without protected `AUD-19` evidence.
- Do not add workaround paths that bypass backend fail-closed contracts.
- Do not replace architecture with a new pattern during this sweep.

## Result Report
- Fixed Dashboard Home LIVE runtime actions so manual order, open-order cancel,
  and runtime position close require explicit operator confirmation before the
  Web client sends `riskAck: true`.
- Removed default `{ riskAck: true }` from Web runtime close/cancel service
  wrappers so future callers cannot silently inherit acknowledgement.
- Fixed LIVE manual runtime close in the API to fail closed when no trusted
  close reference price is available, instead of falling back to `entryPrice`.
- Added Admin Users confirmation flow for role and plan mutations.
- Recorded residual gaps: protected production `AUD-19`, Reports historical
  execution-mode snapshot migration, admin shared ViewState polish, bot
  preview/assistant server-page i18n drift, wallet reset modal consistency,
  profile mobile layout polish, native mobile deferred scope, and assistant
  hot-path orchestration deferred scope.

## Evidence
- `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/engine/positionManagement.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run`
  - Passed: `4` files / `99` tests.
- `corepack pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.open-orders-actions.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx src/features/admin/users/pages/AdminUsersPage.test.tsx --run`
  - Passed: `4` files / `14` tests.
- `corepack pnpm --filter api run typecheck`
  - Passed.
- `corepack pnpm --filter web run typecheck`
  - Passed.

