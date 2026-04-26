# 06 Execution Lifecycle

## Purpose
Define how accepted decisions become orders, fills, positions, and lifecycle outcomes.

## Canonical Lifecycle
The canonical lifecycle for both manual and runtime entries is:

```text
entry intent -> order created -> order status evolves -> fill confirmed -> position opened or updated
```

Manual and bot-originated entries share this lifecycle. They do not use separate truth models.

## Order and Position Separation
- `Order` is the submitted intent and execution container.
- `Position` is downstream lifecycle state created or updated through fill authority.
- manual order commands do not open positions directly

## Fill Authority
### LIVE
- exchange fills and exchange sync are the authority for position-open visibility

### PAPER
- internal paper execution and fill simulation are the authority

## Runtime Side Effects
All runtime side-effecting commands must be idempotent for:
- `OPEN`
- `DCA`
- `CLOSE`
- `CANCEL`

Replayed commands must resolve to reuse or no-op, not duplicate side effects.

## Close Authority
Direct strategy `EXIT` may exist as analytical context, but close behavior follows the lifecycle manager contract.

Canonical close authority is lifecycle-based:
- `TP`
- `TTP`
- `SL`
- `TSL`
- `LIQUIDATION`
- account-floor protection

## Close Attribution

Close lifecycle truth has two separate dimensions:

1. `closeReason`
2. `closeInitiator`

`closeReason` explains why the position closed.

`closeInitiator` explains who or what initiated the close.

The system must not collapse these into one field or reconstruct one from the
other through UI inference.

Canonical initiator semantics are defined in:

- `reference/position-close-attribution-contract.md`

Examples:

- bot lifecycle take-profit:
  - `closeReason=TP`
  - `closeInitiator=BOT_APP`
- user closes from dashboard:
  - `closeReason=MANUAL`
  - `closeInitiator=USER_APP`
- position disappears from exchange without app-side close authority:
  - `closeReason=EXTERNAL_SYNC_MISSING`
  - `closeInitiator=USER_EXCHANGE`
- liquidation:
  - `closeReason=LIQUIDATION`
  - `closeInitiator=EXCHANGE`

## DCA-First Rule
Per-position evaluation order is:
1. `DCA`
2. close phase:
   - basic mode: `TP -> SL`
   - advanced mode: `TTP -> TSL`
3. liquidation and floor protection

If a DCA level is still valid and affordable, the runtime must not bypass it by guessing a different close path.

## Fee Contract
- LIVE fee truth comes from exchange fills and trades when available
- temporary estimated fees may exist only as traceable placeholders

## Example State Progression
```text
LONG accepted
-> order submitted
-> waiting_for_fill
-> filled
-> position_opened
-> lifecycle management
-> position_closed
```

## Non-Goals
- UI-specific copy or color semantics
- exchange-specific connector details

## Supporting References
- `reference/runtime-execution-idempotency-contract.md`
- `reference/live-fee-reconciliation-contract.md`
- `reference/position-lifecycle-parity-matrix.md`
- `reference/position-close-attribution-contract.md`

## Related Files
- [05 Strategy, Signal, and Decision Flow](./05_strategy-signal-and-decision-flow.md)
- [07 Modes, Parity, and Data](./07_modes-parity-and-data.md)
