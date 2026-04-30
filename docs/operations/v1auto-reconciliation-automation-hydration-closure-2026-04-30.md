# V1AUTO-02 Closure - Reconciliation Automation Hydration

Status: closed
Date: 2026-04-30
Owner: Codex Execution Agent

## What Closed

`LIVE` imported automation no longer has to wait passively for a later ticker
event after reconciliation already adopted a canonically owned imported
position.

`livePositionReconciliation` now reuses the canonical runtime automation entry
point and triggers prospective hydration when all of the following are true:

- imported row is `BOT_MANAGED`
- continuity is `CONFIRMED`
- exchange-sync truth includes finite positive `markPrice`

The hook runs after both:

- managed imported position creation
- managed imported position update

It delegates to `runtimePositionAutomationService.handleTickerEvent(...)`
instead of creating any imported-only execution path.

## Why This Fits Architecture

This closure follows
`docs/architecture/reference/live-protection-state-parity-contract.md`,
especially Core Rule 3:

- imported or recovered `LIVE` positions may be hydrated prospectively from the
  adoption point onward
- runtime must use the same canonical execution engine
- the repository must not invent retrospective protection history

The new reconciliation hook therefore acts only as a wake-up trigger for the
existing engine from fresh exchange truth.

## Files

- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.types.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`

## Validation

- `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm run quality:guardrails`

## Remaining Follow-up

- protected post-deploy verification on the real `LIVE DOGEUSDT` flow
- separate evaluation of the stale runtime-session summary seam if it remains
  after imported automation starts reacting correctly
