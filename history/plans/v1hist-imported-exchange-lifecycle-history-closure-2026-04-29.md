# V1HIST-A - Imported Exchange Lifecycle History Closure

Status: Closed
Owner: Codex Execution Agent
Date: 2026-04-29

## Summary

`V1HIST-A` is now closed as an implementation and focused verification packet.
Soar no longer relies only on active imported position rows to represent
mixed-origin lifecycle truth:

- newly imported `EXCHANGE_SYNC` positions can hydrate canonical opening
  history from authenticated exchange trade history,
- externally closed imported managed positions can backfill canonical close
  trade history and close timestamps when deterministic exchange truth exists,
- runtime operator history keeps imported closed positions visible with both
  `openedAt` and `closedAt`,
- dashboard history presentation now renders those lifecycle anchors as
  separate columns instead of compressing them into one ambiguous timestamp.

## What Changed

1. Exchange boundary and positions services now support authenticated
   trade-history reads for imported lifecycle hydration.
2. Imported opening-history hydration persists canonical imported `OPEN` /
   `DCA` / partial `CLOSE` trades and corrects `position.openedAt` to the first
   canonical fill when deterministic.
3. Reconciliation now attempts canonical close-history backfill before
   finalizing imported external-close truth, then persists missing imported
   `CLOSE` trades with `USER_EXCHANGE` attribution and prefers the last
   canonical close fill timestamp over a local `now()` close.
4. Runtime history UI now exposes separate `openedAt` and `closedAt` columns.

## Fail-Closed Notes

- No synthetic imported fills are created when exchange trade history is
  insufficient or ambiguous.
- Imported external-close trade backfill is best-effort under deterministic
  exchange evidence only; row-level close truth still proceeds without fake
  ledger writes when canonical detail cannot be proven.

## Validation

- `pnpm --filter api exec vitest run src/modules/positions/importedPositionHistoryHydrator.service.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/bots/bots.runtime-history-parity.e2e.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm --filter web run typecheck`
- `pnpm run quality:guardrails`

## Remaining Follow-Up

- Manual mixed-origin `LIVE` verification still belongs to the broader operator
  matrix in `history/audits/v1live-mixed-origin-verification-matrix-2026-04-29.md`
  and `history/audits/v1excel-manual-verification-matrix-2026-04-29.md`.
- No further code gap is currently queued under `V1HIST-A`.
