# V1LIVE Binance Execution and Takeover Hardening Plan (2026-04-26)

## Status

Queued

## Why This Wave Exists

Fresh analysis on 2026-04-26 confirms that the remaining live-trading issues do
not come from one isolated bug. The current repository still has contract drift
across:

- signal-driven `LIVE` order execution,
- exchange-synced position ownership and runtime visibility,
- takeover of positions opened manually on Binance,
- lifecycle truth after order submit,
- `PAPER` vs `LIVE` execution parity boundaries.

The required next step is not another local patch. It is one architecture-
aligned hardening wave that closes the whole path:

`signal -> order submit -> exchange fill/update truth -> position visibility -> runtime automation -> close/takeover`

under one canonical contract.

## Frozen Invariants

### 1. `PAPER` must not talk to the exchange

`PAPER` remains an exchange-free execution mode. It may reuse the same
execution-lifecycle contract as `LIVE`, but it must not perform exchange I/O.
Its fills, positions, and lifecycle updates must stay internal to the approved
paper execution path.

### 2. `LIVE` must use the existing exchange boundary, not a second subsystem

All Binance Futures live work must stay inside the approved exchange module and
its boundary services. This wave must not create a second exchange lifecycle,
sidecar takeover engine, or parallel runtime feed.

### 3. Takeover and runtime visibility must share one ownership classifier

The same ownership decision must drive:

- reconciliation/import,
- takeover-status reads,
- runtime position visibility,
- runtime close commands,
- orphan repair and rebind follow-up.

### 4. Missing exchange truth must stay unresolved

If canonical exchange entry or fill truth is unavailable, the system must fail
closed or remain unresolved. This wave must not synthesize live trading truth
from convenience fallbacks such as mark price.

## Confirmed Findings

### 1. Ownership truth is still split between reconciliation and runtime

The current codebase still uses different ownership rules in different places.
`runtimeExternalPositionOwner.service.ts` gates `LIVE` ownership with
`wallet.manageExternalPositions`, but
`livePositionReconciliation.service.ts` still has a fallback path that can mark
positions as owned through generic `apiKeyId` candidates.

That means a position can be:

- owned enough to be imported,
- but not owned enough to be surfaced or closed by the bot runtime.

### 2. Imported live entry truth still degrades to `markPrice`

`livePositionReconciliation.service.ts` still resolves imported entry truth by
falling back from exchange `entryPrice` to `markPrice`. That conflicts with the
already frozen live-safety contract. It creates synthetic certainty where the
system should stay explicit about missing truth.

### 3. Runtime visibility and close parity for imported owned positions is not stable

Focused DB-backed tests now show the exact user-reported path is still not
closed end-to-end:

- imported `EXCHANGE_SYNC BOT_MANAGED` `LIVE` positions are not always visible
  in runtime when symbol scope overlaps,
- imported `LIVE` positions chosen from the dashboard close flow can still end
  as `ignored`.

### 4. Signal-driven `LIVE` execution is under-proven end-to-end

The current `LIVE` path submits through the exchange boundary, but the
repository still lacks a fully trustworthy proof for:

- signal creates `LIVE` order,
- exchange confirms lifecycle progress,
- runtime consumes that truth,
- position appears and becomes automatable,
- close/update logic stays coherent.

### 5. Binance Futures lifecycle truth still relies mainly on REST snapshots

The exchange integration currently uses REST-style authenticated reads and
polling reconciliation. The codebase does not yet consume Binance Futures user
data stream events such as:

- `ACCOUNT_UPDATE`
- `ORDER_TRADE_UPDATE`
- optional `TRADE_LITE`

That keeps `LIVE` truth slower and more fragile than required for reliable
order/position/takeover handling.

## Official Binance Scope For This Wave

This wave is intentionally limited to Binance USD-M Futures and the already
approved exchange boundary.

Required Binance references:

- New Order:
  [Binance Futures New Order](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order)
- Open orders snapshot:
  [Binance Futures Current All Open Orders](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders)
- Position snapshot:
  [Binance Futures Position Information V3](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3)
- Balance snapshot:
  [Binance Futures Account Balance V3](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3)
- Exchange metadata:
  [Binance Futures Exchange Information](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information)
- Margin mode:
  [Binance Futures Change Margin Type](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type)
- Position mode:
  [Binance Futures Change Position Mode](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Position-Mode)
- Leverage:
  [Binance Futures Change Initial Leverage](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Initial-Leverage)
- User data stream root:
  [Binance Futures User Data Streams](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams)
- Account/position updates:
  [Binance Futures ACCOUNT_UPDATE](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Balance-and-Position-Update)
- Order updates:
  [Binance Futures ORDER_TRADE_UPDATE](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Order-Update)

## Execution Plan

### Wave: `V1LIVE-A`

1. `V1LIVE-01 audit(api+docs): publish canonical live-execution and takeover regression packet`
   - Freeze the exact current failure map, including:
     - ownership drift,
     - imported-entry truth drift,
     - runtime visibility/close regression,
     - missing Binance user-data stream lifecycle.
   - Touched files:
     - `docs/planning/v1live-01-investigation-audit-2026-04-26.md`
     - `docs/planning/v1live-01-investigation-audit-task-2026-04-26.md`
     - `docs/planning/mvp-next-commits.md`
     - `.codex/context/TASK_BOARD.md`
     - `.codex/context/PROJECT_STATE.md`

2. `V1LIVE-02 test(api-red): lock one canonical ownership classifier for imported LIVE positions`
   - Add failing coverage for disagreement between reconciliation,
     takeover-status, runtime visibility, and close authority.
   - Touched files:
     - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
     - `apps/api/src/modules/positions/positions.takeover-status.e2e.test.ts`
     - `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.test.ts`
     - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`

3. `V1LIVE-03 fix(api-ownership): reuse one ownership classifier across reconciliation, runtime, and takeover`
   - Remove any fallback path that can classify a position as owned under rules
     different from runtime/takeover logic.
   - Prefer shared ownership service extraction only if it reuses existing
     module boundaries and avoids duplication.
   - Primary files:
     - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
     - `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
     - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
     - `apps/api/src/modules/positions/positions.service.ts`

4. `V1LIVE-04 test(api-red): lock fail-closed imported entry/fill truth`
   - Add failing coverage proving imported live positions must not use
     `markPrice` as synthetic entry truth.
   - Touched files:
     - `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
     - `apps/api/src/modules/orders/orders.service.test.ts`

5. `V1LIVE-05 fix(api-reconciliation): remove synthetic mark-price entry fallback and keep unresolved states explicit`
   - Make imported live entry truth either canonical or unresolved.
   - Ensure downstream services and UI-facing reads tolerate unresolved live
     entry truth without inventing lifecycle certainty.
   - Primary files:
     - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
     - `apps/api/src/modules/positions/positions.service.ts`
     - `apps/api/src/modules/orders/orders.service.ts`
     - `apps/web/src/features/dashboard-home/hooks/useManualOrderController.ts`

6. `V1LIVE-06 test(api-runtime-red): lock runtime visibility and close parity for owned imported LIVE positions`
   - Add DB-backed regressions for:
     - runtime visibility of owned `EXCHANGE_SYNC BOT_MANAGED` rows,
     - dashboard-driven close on such rows,
     - conflict cases that must stay fail-closed.
   - Touched files:
     - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`
     - `apps/api/src/modules/bots/bots.runtime-takeover.e2e.test.ts`
     - `apps/api/src/modules/positions/positions.takeover-status.e2e.test.ts`

7. `V1LIVE-07 fix(api-runtime): recover imported-position runtime visibility and close authority`
   - Make imported owned live positions visible and closeable through the same
     canonical runtime/read-model path used by the rest of execution.
   - Primary files:
     - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
     - `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
     - `apps/api/src/modules/orders/orders.service.ts`
     - `apps/api/src/modules/positions/positions.service.ts`
     - `apps/api/src/modules/engine/executionOrchestrator.service.ts`

8. `V1LIVE-08 test(api-engine-red): lock signal -> LIVE order -> position lifecycle truth`
   - Add focused regression coverage for signal-driven live execution and
     remove stale fixtures that still represent retired contracts.
   - Touched files:
     - `apps/api/src/modules/engine/runtime-flow.e2e.test.ts`
     - `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
     - `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
     - `apps/api/src/modules/orders/orders-positions.e2e.test.ts`

9. `V1LIVE-09 refactor(api-exchange): add Binance Futures user-data stream inside the existing exchange boundary`
   - Implement `listenKey` lifecycle and websocket consumption without
     creating a second exchange subsystem.
   - REST remains bootstrap/recovery only; event stream becomes lifecycle
     truth for live order and position updates.
   - Primary files:
     - `apps/api/src/modules/exchange/exchangeAdapterBoundary.service.ts`
     - `apps/api/src/modules/exchange/ccxtFuturesConnector.service.ts`
     - `apps/api/src/modules/exchange/liveOrderAdapter.service.ts`
     - `apps/api/src/modules/exchange/exchangeAuthenticatedRead.service.ts`
     - new `apps/api/src/modules/exchange/binanceFuturesUserDataStream*.ts`
     - new focused tests under `apps/api/src/modules/exchange/`

10. `V1LIVE-10 fix(api-execution): wire Binance order/account events into canonical order and position lifecycle`
    - Normalize `ACCOUNT_UPDATE` and `ORDER_TRADE_UPDATE` into the existing
      execution lifecycle so runtime, orders, and positions all see the same
      event truth.
    - Primary files:
      - `apps/api/src/modules/orders/orders.service.ts`
      - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
      - `apps/api/src/modules/engine/executionOrchestrator.service.ts`
      - `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
      - exchange event handlers created in `V1LIVE-09`

11. `V1LIVE-11 cleanup(api+tests+web): remove stale fallback paths, stale fixtures, and misleading manual-order semantics`
    - Remove compatibility or diagnostic paths that actively conflict with the
      approved execution model.
    - Keep orphan repair as a repair tool only, not as normal lifecycle truth.
    - Primary files:
      - `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
      - `apps/api/src/modules/orders/orders.service.ts`
      - `apps/api/src/modules/engine/runtime-flow.e2e.test.ts`
      - `apps/web/src/features/dashboard-home/hooks/useManualOrderController.ts`
      - any focused stale test fixtures touched during `V1LIVE-08..10`

12. `V1LIVE-12 qa(closure): rerun focused live/paper/takeover closure pack and sync canonical docs/context`
    - Required closure evidence:
      - signal-driven `LIVE` open truth,
      - manual `LIVE` open truth,
      - `PAPER` no-exchange parity,
      - imported-position takeover visibility/close,
      - adapter boundary parity and user-data-stream lifecycle.
    - Touched files:
      - `docs/planning/mvp-next-commits.md`
      - `docs/planning/mvp-execution-plan.md`
      - `.codex/context/TASK_BOARD.md`
      - `.codex/context/PROJECT_STATE.md`

## Delivery Rules For This Wave

- Start with red tests before fixes.
- Keep one canonical execution lifecycle.
- Keep `PAPER` and `LIVE` adapter parity at the contract boundary, not by
  mixing internals.
- Keep Binance websocket/event support inside `modules/exchange`.
- Use REST snapshots for bootstrap, recovery, and reconciliation guardrails,
  not as the primary live lifecycle source.
- Do not broaden scope to other exchanges in this wave.

## Priority Order

1. `V1LIVE-01`
2. `V1LIVE-02`
3. `V1LIVE-03`
4. `V1LIVE-04`
5. `V1LIVE-05`
6. `V1LIVE-06`
7. `V1LIVE-07`
8. `V1LIVE-08`
9. `V1LIVE-09`
10. `V1LIVE-10`
11. `V1LIVE-11`
12. `V1LIVE-12`

## Non-Goals

- no second takeover engine,
- no new exchange beyond Binance Futures,
- no relaxation of fail-closed ownership ambiguity,
- no `PAPER` exchange access,
- no workaround that hides missing live truth behind synthetic prices or
  optimistic UI copy.

## Validation Target

At minimum for the full closure wave:

- `pnpm --filter api exec vitest run src/modules/positions/livePositionReconciliation.service.test.ts src/modules/positions/positions.takeover-status.e2e.test.ts`
- `pnpm --filter api exec vitest run src/modules/bots/runtimeExternalPositionOwner.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts`
- `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts src/modules/orders/orders-positions.e2e.test.ts`
- `pnpm --filter api exec vitest run src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtime-flow.e2e.test.ts`
- focused exchange adapter tests added for Binance user-data stream support
- `pnpm --filter api run typecheck`
- `pnpm --filter web run typecheck`
- `pnpm run quality:guardrails`
