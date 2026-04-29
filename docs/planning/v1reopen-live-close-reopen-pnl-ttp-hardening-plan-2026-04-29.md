# V1REOPEN-A - LIVE Same-Symbol Close/Reopen Truth Hardening Plan

Status: Active
Owner: Codex Execution Agent
Stage: planning
Last Updated: 2026-04-29

## Context

Fresh real-account notes exposed a new `LIVE` regression class that is narrower
than the already closed `V1TRUTH-A` packet:

- an existing `LIVE` position on `DOGEUSDT` was closed manually through the app
  and the exchange confirmed the close,
- a new position on the same symbol was then opened,
- the application adopted the new position, but operator-visible `PnL%` became
  dramatically wrong (`exchange ~ +2.5%`, app `~ -38%`),
- and before the close, `TTP` still did not arm despite remaining `DCA`
  thresholds being loss-side only.

This does not look like a simple display math bug. The strongest repository
evidence points to lifecycle continuity drift during `close -> reopen` on the
same symbol: stale open-row identity, stale side/entry truth, or stale runtime
protection state can survive long enough to contaminate the next imported or
managed `LIVE` position.

## Goal

Make same-symbol `LIVE` close/reopen truth deterministic and fail-safe so a new
position never inherits stale position identity, stale side/PnL basis, or stale
runtime protection state from the just-closed lifecycle.

## Scope

- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `apps/api/src/modules/engine/runtimePositionState.store.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.ts`
- canonical queue/context docs

## Non-Goals

- no new runtime ownership model
- no new protection engine
- no UI-only masking of backend truth
- no exchange-side architectural redesign

## Architecture Alignment

Reviewed authorities:

- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`
- `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`

Confirmed likely drift areas:

- reconciliation still allows a stale imported/local open row to survive across
  a short missing-confirmation grace window,
- stale close paths do not obviously clear runtime protection state when a
  lifecycle is retired outside the normal app/bot close path,
- operator-visible `PnL%` on dashboard surfaces depends on canonical
  `entryPrice + side + markPrice` truth, so stale side or lifecycle identity
  can invert the sign even when the live price stream itself is correct,
- `TTP` semantics are already frozen correctly for loss-side-only `DCA`, so a
  failure here likely means stale lifecycle/protection continuity instead of a
  still-wrong rule.
- operator-visible `TTP` can still disappear even when row-level dynamic stop
  truth exists, because dashboard `TTP/TSL` columns are gated by one bot-level
  `showDynamicStopColumns` flag derived from active advanced-close topology
  instead of the actual reopened position rows. This makes `V1REOPEN-06`
  a real code-risk slice rather than a cosmetic UI follow-up.

## Execution Plan

1. Freeze the exact regression matrix for `LIVE close -> same-symbol reopen`
   across same-side and opposite-side reentry.
2. Add focused red coverage proving:
   - stale old rows do not remain operator-visible when a new exchange truth for
     the same symbol arrives,
   - same-symbol reopen does not inherit stale side/entry/PnL basis,
   - stale runtime protection state is cleared when the old lifecycle is closed
     or superseded,
   - `TTP` arms correctly on the reopened lifecycle when remaining `DCA`
     thresholds are loss-side only.
3. Harden reconciliation so same-symbol lifecycle discontinuity retires the old
   row immediately when exchange truth proves the old lifecycle no longer
   exists.
4. Harden runtime protection-state cleanup so stale lifecycle state cannot bleed
   into the reopened position.
5. Verify whether any web read-model guard is still needed after backend truth
   is fixed; if yes, keep it minimal and architecture-aligned. First candidate:
   stop hiding `TTP/TSL` columns solely because bot-level advanced-close
   topology is unresolved when row-level dynamic stop truth is already present.
6. Run focused API/web/guardrail validation and publish closure evidence.

## Acceptance Criteria

- Closing a `LIVE` position and reopening the same symbol cannot leave the old
  lifecycle row actionable or operator-visible as the active position.
- A reopened same-symbol position uses the new canonical `side`, `entryPrice`,
  `quantity`, and exchange-derived mark-price basis for displayed `PnL%`.
- Runtime protection state for the old lifecycle is removed or explicitly
  replaced before the reopened lifecycle is evaluated.
- `TTP` on the reopened lifecycle is not blocked by loss-side-only remaining
  `DCA` thresholds.
- Focused regression coverage proves both the lifecycle truth and the operator
  truth.

## Risks

- same-symbol reopen may arrive before the old lifecycle is formally closed in
  all data sources, so reconciliation must prefer canonical exchange truth
  without creating another sidecar ownership system
- protection-state cleanup must not erase valid state for the new lifecycle if
  it is already active
- any web-side adjustment must remain a read-model consumer of backend truth,
  not a second authority

## Validation Plan

- `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts`
- `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.aggregate.test.tsx src/features/dashboard-home/components/BotsManagement.runtime.test.tsx`
- `pnpm --filter api run typecheck`
- `pnpm --filter web run typecheck`
- `pnpm run quality:guardrails`

## Result Report

- Task summary: pending implementation
- Files changed: planning packet only
- How tested: `pnpm run quality:guardrails`
- What is incomplete: focused regression lock, reconciliation/runtime fix,
  closure evidence
- Next steps: `V1REOPEN-01..07`

## Implementation Status

- 2026-04-29: `V1REOPEN-06` is now closed. Backend runtime positions keep
  `showDynamicStopColumns=true` whenever any open row still carries real
  dynamic-stop truth, both web operator surfaces OR topology mode with actual
  row truth, and runtime serialization now restores the missing bot-managed
  `TTP` fallback/sticky continuity path from strategy levels plus persisted
  `trailingLossLimitPercent`.
- 2026-04-29: `V1REOPEN-05` remains open because the repo still needs one
  narrower proof for reopened `LIVE` positions with remaining loss-side-only
  `DCA` thresholds.
