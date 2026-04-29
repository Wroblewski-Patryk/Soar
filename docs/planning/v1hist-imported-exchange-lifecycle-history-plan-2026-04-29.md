# V1HIST-A - Imported Exchange Lifecycle History Truth Plan

Status: Active
Owner: Codex Execution Agent
Stage: planning
Last Updated: 2026-04-29

## Context

Fresh operator notes exposed one more `LIVE` truth gap that is separate from
the already hardened open-position and protection flows:

- an external exchange position can be imported into Soar and managed by the
  bot/runtime,
- the imported position becomes visible in active positions,
- but operator history does not preserve enough lifecycle truth for that
  imported position,
- and when the imported position is later closed manually on the exchange, the
  close is not represented in history with the same fidelity expected from a
  bot-managed lifecycle.

Repository evidence strongly suggests this is a real missing vertical slice,
not only a table-rendering defect:

- reconciliation can create and update imported `EXCHANGE_SYNC` positions from
  exchange snapshot truth,
- stale imported positions can be closed when exchange truth disappears,
- but that import/close path does not yet guarantee canonical trade-ledger
  history for the imported opening lifecycle or for external close truth,
- and the dashboard history table currently prefers one timestamp column
  (`closedAt ?? openedAt`) instead of exposing both lifecycle anchors clearly.

## Goal

Make imported exchange-managed lifecycle history truthful and operator-complete
for `V1`, so a position adopted from the exchange preserves:

- when it was opened,
- how Soar started managing it,
- when it closed,
- and who or what closed it,

without inventing a second lifecycle system outside the approved execution and
reconciliation architecture.

## Scope

- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.ts`
- exchange adapter surfaces needed for historical imported-lifecycle truth
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- `docs/operations/v1excel-manual-verification-matrix-2026-04-29.md`
- canonical queue/context docs

## Non-Goals

- no new ownership model
- no exchange-specific sidecar database outside existing lifecycle entities
- no UI-only masking of missing backend lifecycle truth
- no broad architecture redesign of the execution engine

## Architecture Alignment

Reviewed authorities:

- `docs/architecture/reference/execution-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-runtime-lifecycle-parity-contract.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`

This packet fits approved architecture:

- imported or externally closed `LIVE` positions still belong to the same
  canonical lifecycle truth,
- fill and close history must stay inside existing `Position` / `Order` /
  `Trade` authority,
- reconciliation may hydrate or repair lifecycle truth, but it must not become
  a parallel fake-history system,
- operator history surfaces must consume persisted lifecycle truth instead of
  guessing from current runtime rows only.

## Root-Cause Summary

1. Imported exchange positions are persisted as open positions, but the import
   path does not yet guarantee an equivalent opening-history ledger.
2. Exchange-side close detection can close the imported position row, but does
   not yet guarantee close-history parity when that close is discovered through
   reconciliation instead of a canonical local order fill.
3. Operator history presentation currently compresses lifecycle time into one
   timestamp column, which hides the distinction between `openedAt` and
   `closedAt` even when both fields exist.
4. The current manual verification matrix is too coarse for mixed-origin
   `exchange/app` lifecycle truth and does not explicitly freeze wait-based
   `DCA/TTP/TSL` scenarios.

## Execution Plan

1. Freeze the exact failure matrix for imported-position open history, imported
   position close history, and history-table timestamp fidelity.
2. Freeze one explicit contract for imported lifecycle history truth:
   - imported opening lifecycle must preserve canonical open timestamp truth,
   - imported externally closed lifecycle must preserve canonical close
     attribution and close timestamp truth,
   - history surfaces must distinguish open time from close time.
3. Add focused red coverage for:
   - imported open position with missing historical ledger,
   - imported position later closed on exchange without local close order,
   - history read-model fidelity for opened/closed timestamps,
   - bot ownership continuity for imported then externally closed positions.
4. Harden exchange/reconciliation flow so imported lifecycle truth is hydrated
   through approved existing lifecycle entities instead of snapshot-only rows.
5. Harden history read-model and UI so operator-visible history shows the full
   lifecycle anchors and attribution truth.
6. Publish a dedicated mixed-origin live verification matrix that covers:
   - open/close from exchange,
   - open/close from app,
   - mixed-origin sequences,
   - waiting windows for `DCA`, `TTP`, and `TSL`,
   - restart/recovery truth after each scenario family.
7. Run focused API/web validation and closure evidence after implementation.

## Acceptance Criteria

- An imported exchange position that becomes bot-managed preserves truthful
  opening history in canonical lifecycle entities.
- If that imported managed position is later closed on the exchange, Soar
  persists close history instead of only removing it from active positions.
- Operator-visible history exposes both `openedAt` and `closedAt` truthfully
  for imported/external lifecycles.
- Mixed-origin `exchange/app` lifecycle scenarios are frozen in one explicit
  manual verification matrix with expected wait points and expected outcomes.
- Focused regression coverage proves imported lifecycle history does not depend
  on operator memory or log inspection.

## Risks

- exchange adapters may not currently expose enough historical fill/trade data
  for imported lifecycle hydration, which would require one careful boundary
  extension rather than a local workaround
- reconciliation-driven close truth must not synthesize fake realized PnL when
  exchange close execution detail is still unavailable
- history-table improvements must remain a consumer of persisted lifecycle
  truth, not a second authority

## Validation Plan

- `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/bots/runtimeSessionTradesRead.service.test.ts`
- `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- `pnpm --filter api run typecheck`
- `pnpm --filter web run typecheck`
- `pnpm run quality:guardrails`

## Result Report

- Task summary: planning packet only
- Files changed: planning docs, operations matrix, queue/context sync
- How tested: `pnpm run quality:guardrails`
- What is incomplete: implementation wave for imported lifecycle history truth
- Next steps: `V1HIST-01..07`

## Implementation Status

- 2026-04-29: Closed the first operator-truth slice of `V1HIST-A`. Dashboard
  history positions now expose separate `openedAt` and `closedAt` columns
  instead of compressing lifecycle time into one ambiguous timestamp, and a
  focused API parity lock now proves that a closed imported
  `EXCHANGE_SYNC BOT_MANAGED` position remains visible in `historyItems` with
  both timestamps preserved. The deeper imported opening-history hydration and
  external-close ledger parity work remains open under `V1HIST-01..05` and
  `V1HIST-07`.
- 2026-04-29: Closed the first backend hydration slice for imported opening
  history. The exchange boundary now exposes authenticated trade-history reads,
  imported-position hydration reconstructs the current open lifecycle only when
  canonical fill truth is sufficient to do so deterministically, and Soar
  persists imported `OPEN` / `DCA` / partial `CLOSE` trade rows plus updates
  `position.openedAt` from the first canonical fill instead of trusting the
  weaker exchange position snapshot timestamp. External-close ledger parity is
  still open.
- 2026-04-29: Closed the external-close ledger parity slice. Reconciliation
  now attempts one canonical exchange trade-history backfill before classifying
  an imported `EXCHANGE_SYNC` position as externally closed, then persists any
  missing imported `CLOSE` trades with `USER_EXCHANGE` attribution and updates
  `position.closedAt` to the last canonical close fill when deterministic
  trade truth exists. The implementation remains fail-closed: if exchange trade
  history is insufficient, Soar still closes the position row but does not
  invent synthetic trade ledger truth. The remaining open work is the final
  `V1HIST-01/02/07` closure sync and evidence pack.
