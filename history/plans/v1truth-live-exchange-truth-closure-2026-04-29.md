# V1TRUTH-A - LIVE Exchange Truth Hardening Closure

Status: closed
Date: 2026-04-29
Owner: Codex Execution Agent

## Scope Closed

This closure confirms the final `V1TRUTH-A` hardening wave for `V1` is now
closed across the user-reported real-money drift class:

1. futures manual-order leverage/margin parity
2. app-driven `LIVE` manual close authority
3. pending external/manual exchange order versus open-position truth
4. final `DCA/TTP/TSL` protection-rule nuance

The canonical singular bot architecture remains unchanged:
`1 bot = 1 wallet + 1 symbol-group + 1 strategy`.

## Frozen Failure Matrix

| Failure class | Canonical finding | Resolution |
|---|---|---|
| Futures manual order used full notional instead of required margin in dashboard affordance logic | Web-side `FUTURES` budget, max-size, and free-funds validation drifted from leverage-aware backend intent | Closed in `V1TRUTH-02`; dashboard controller now uses leverage-aware required margin while preserving exchange min-notional truth |
| Manual close in `LIVE` depended too much on runtime-session context | App close path was not strictly exchange-authoritative | Closed in `V1TRUTH-03/04`; `LIVE` close now runs through the canonical exchange-backed `openOrder -> exchangeAdapterBoundary` path with `reduceOnly` |
| Pending external/manual exchange DCA could appear to inflate positions | Needed proof and reconcile hardening for same-owner same-symbol snapshot truth | Closed in `V1TRUTH-05/06`; pending order remains in `openOrders` until fill, and reconcile no longer duplicates an existing local owned `LIVE` position |
| `TTP` treated every pending DCA as a blanket block | This contradicted the approved user rule for loss-side-only DCA | Closed in `V1TRUTH-07/08`; `TTP` now waits only for remaining profit-side DCA thresholds, while `SL` and `TSL` keep the stricter fail-closed guard |

## Final Protection Rule

Canonical `DCA/TTP/TSL` semantics after closure:

- evaluation order remains `DCA -> close logic`
- `SL` and `TSL` remain blocked while pending DCA is still financially
  possible
- `TTP` is blocked only when some remaining DCA threshold is on the profit
  side (`>= 0` leveraged move threshold)
- `TTP` is allowed when all remaining DCA thresholds are loss-side only
- one shared lifecycle kernel remains the authority for `BACKTEST`, `PAPER`,
  and `LIVE`

## Validation Evidence

API closure pack:

```text
pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionCommand.service.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/orders/orders-positions.e2e.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/engine/positionManagement.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts
```

Result:
- `7/7` files PASS
- `99/99` tests PASS

Web closure pack:

```text
pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.manual-order.test.tsx src/features/dashboard-home/hooks/useManualOrderController.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-history.test.tsx
```

Result:
- `3/3` files PASS
- `15/15` tests PASS

Repository checks:

```text
pnpm --filter api run typecheck
pnpm --filter web run typecheck
pnpm run quality:guardrails
```

Result:
- all PASS

## Files of Record

- `history/plans/v1truth-live-exchange-truth-hardening-plan-2026-04-29.md`
- `history/tasks/v1truth-07-08-protection-rule-task-2026-04-29.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- `apps/api/src/modules/engine/positionManagement.service.ts`
- `apps/api/src/modules/engine/positionManagement.service.test.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`

## Residual Risk

No remaining open items from `V1TRUTH-A` remain in the canonical queue.
Post-`V1` work continues separately under `BOTMULTI-A`.
