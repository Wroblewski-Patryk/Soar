# V1REOPEN-A - LIVE Same-Symbol Close/Reopen Truth Closure

Status: Closed
Owner: Codex Execution Agent
Date: 2026-04-29

## Summary

`V1REOPEN-A` is now closed.

Soar now treats same-symbol `LIVE close -> reopen` as a canonical lifecycle
replacement instead of a loose continuation:

- stale opposite-side or superseded same-side lifecycle rows are retired during
  reconciliation,
- stale persisted runtime protection state is cleared when that lifecycle is
  retired,
- runtime/operator surfaces no longer hide row-level dynamic stop truth only
  because bot-level topology metadata drifted,
- and focused runtime coverage now proves that a reopened imported `LIVE`
  position can arm and execute `TTP` correctly when all remaining `DCA`
  thresholds are loss-side only.

## Validation

- `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/orders/orders-positions.e2e.test.ts`
- `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/bots/components/BotsManagement.test.tsx`
- `pnpm --filter api run typecheck`
- `pnpm --filter web run typecheck`
- `pnpm run quality:guardrails`
