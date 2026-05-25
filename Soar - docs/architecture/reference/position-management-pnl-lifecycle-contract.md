# Position Management PnL Lifecycle Contract

Status: canonical  
Updated: 2026-05-06

## Purpose

Define how position management reacts to current position PnL/ROI percent for
`DCA`, `TP`, `SL`, `TTP`, and `TSL`.

This contract makes the user-facing strategy settings, runtime bot loop,
backtest replay, paper trading, and live exchange protection behavior converge
on one logical lifecycle.

## Scope

- Applies to `BACKTEST`, `PAPER`, and `LIVE`.
- Applies per open position lifecycle, not globally per bot or symbol.
- Applies after position ownership, strategy provenance, execution context, and
  lifecycle-price truth have been resolved by their canonical contracts.

## Strategy Close Mode

Each strategy chooses exactly one close-management mode for an open position:

- `basic`: hard `TP` and hard `SL`
- `advanced`: `TTP` and `TSL`

Runtime and backtest must not mix `basic` and `advanced` close mechanisms for
the same position lifecycle. If `basic` is selected, configured trailing
settings are ignored for execution. If `advanced` is selected, hard `TP`/`SL`
settings are not the close authority for that lifecycle unless a separate
approved account-floor or liquidation rule applies.

## Per-Position Evaluation Order

For every fresh market update, the position-management pass evaluates an open
position in this order:

1. refresh market/order/position truth needed for the lifecycle pass
2. evaluate and execute eligible `DCA`
3. evaluate the selected close mode:
   - `basic`: `TP -> SL`
   - `advanced`: `TTP -> TSL`
4. apply liquidation and account-floor protection
5. persist or publish updated lifecycle state for operator views

If a DCA level is enabled, valid, still pending, and affordable, close
management must not bypass it by guessing a different close path. If DCA is
disabled, exhausted, inapplicable to the current PnL direction, or explicitly
classified as unaffordable according to the strategy policy, close management
continues normally.

## DCA Lanes

DCA levels are evaluated from current PnL/ROI percent and may be positive or
negative.

- Positive DCA levels execute as PnL moves upward.
- Negative DCA levels execute as PnL moves downward.
- Each level has an execution threshold and a size multiplier.
- A multiplier of `1` means the DCA add size equals the current position size
  according to the runtime sizing contract for the lifecycle.

The execution ladder must be deterministic. For normalized strategy evaluation:

- positive thresholds execute from closest to zero to farther profit, for
  example `20%` before `40%`
- negative thresholds execute from closest to zero to farther loss, for example
  `-20%` before `-40%` before `-60%`

If a stored or imported configuration presents levels in an order that conflicts
with threshold reachability, validation or the read model must make the
effective execution order explicit instead of relying on ambiguous row numbers.

Example normalized advanced ladder:

```text
1: 20%, multiplier 1
2: 40%, multiplier 1
3: -20%, multiplier 1
4: -40%, multiplier 1
5: -60%, multiplier 1
```

When PnL reaches `20%`, the first positive DCA executes. When PnL later reaches
`40%`, the second positive DCA executes. If PnL instead moves downward, the
negative lane executes at `-20%`, then `-40%`, then `-60%`.

## DCA Funds Policy

Before treating a pending DCA level as blocking close management, runtime must
know whether the next add can be funded.

If the next DCA cannot be funded:

- write operator-visible telemetry or audit logs with the reason
- do not silently pretend the DCA was executed
- apply the strategy's DCA-funds policy

Canonical policy options:

- `block_protection`: keep close protection blocked while the DCA remains
  pending, making the risk explicit to the operator
- `release_protection`: classify the remaining DCA ladder as non-blocking for
  this pass and allow `TP`/`SL` or `TTP`/`TSL` to protect the position

The safer default for live automation should be `release_protection`: if the
bot cannot add risk because funds are unavailable, it should not also block
protective closing. Any different default must be explicit in the strategy
contract and UI copy.

## Basic Close Mode

### Take Profit

`TP` is a hard favorable PnL threshold.

If `TP = 10%`:

- `9.5%` does not close
- `11.3%` closes because `11.3% > 10%`

### Stop Loss

`SL` is a hard unfavorable PnL threshold.

If `SL = -10%`:

- `-9.5%` does not close
- `-11.3%` closes because `-11.3% < -10%`

### DCA Reachability Warnings

When `basic` mode and DCA are both enabled, configuration validation must warn
or block unreachable DCA levels:

- positive DCA levels above `TP` cannot execute before hard take-profit closes
  the position
- negative DCA levels below `SL` cannot execute before hard stop-loss closes
  the position

For example, if `TP = 10%`, a positive DCA at `20%` is unreachable. If
`SL = -10%`, a negative DCA at `-20%` is unreachable.

In `LIVE`, venue-side hard `TP`/`SL` orders must not make the application claim
that an unreachable DCA level can still execute. The implementation must either
delay or reshape venue protection according to the approved DCA-first lifecycle
contract, or make the unreachable DCA state explicit before the strategy can be
treated as valid.

## Advanced Close Mode

Advanced close mode uses trailing protection from PnL/ROI percent.

The canonical field meanings are:

- activation percent: the PnL threshold that arms or changes a trailing regime
- trail distance percent: the distance between the best tracked PnL and the
  protected close threshold

UI labels may use shorter names, but code and architecture must not confuse
the activation threshold with the trail distance.

### Trailing Take Profit

`TTP` tracks favorable positive movement and closes on pullback through the
protected percent.

Example levels:

```text
1: activation 25%, trail distance 12%
2: activation 50%, trail distance 25%
3: activation 100%, trail distance 50%
```

Example progression:

```text
0% -> 10% -> 13% -> 24%
26% => protected percent 14% because 26 - 12 = 14
29% => protected percent 17% because 29 - 12 = 17
51% => protected percent 26% because 51 - 25 = 26
49% => no weakening; protected percent remains 26%
25% => close by TTP
```

The tracked high and protected percent must ratchet only in the protective
direction. Switching to a higher activation level with a wider trail distance
is allowed only if the resulting protected percent is not weaker than the
current protected percent.

It is valid for a position to close by TTP before it ever reaches later
configured levels.

### Trailing Stop Loss

`TSL` tracks recovery from unfavorable movement and closes if PnL falls back
through the protected loss threshold.

Example levels:

```text
1: activation -50%, trail distance 25%
2: activation -25%, trail distance 12%
```

Example progression:

```text
0% -> -10% -> -13% -> -27%
-51% => protected percent -76% because -51 - 25 = -76
-43% => protected percent -68% because -43 - 25 = -68
-45% => no weakening; protected percent remains -68%
-24% => protected percent -36% because -24 - 12 = -36
-37% => close by TSL
```

TSL protection must move only toward lower risk as the position recovers. It
must not loosen because the market moves back in the unfavorable direction.

### Single Effective Protection Source

For one open lifecycle, runtime may track configured `TTP` and `TSL` state, but
there must be only one current effective close authority for the venue-side
protected floor. Runtime remains the semantic source of truth for whether the
current floor came from `TTP` or `TSL`.

## LIVE Exchange Orders And Reconciliation

In `LIVE`, the application must reconcile both exchange orders and exchange
positions with local lifecycle state.

The bot loop must account for:

- orders created by Soar
- order fills and partial fills on the exchange
- exchange-side cancellation, manual close, or manual position changes
- positions opened manually on the exchange

If Soar opened the position, submitted the add/close orders, and observed the
fills, the local lifecycle has complete provenance. If the user opened or
changed a position directly on the exchange, Soar must import or reconcile it
from exchange truth and mark any missing lifecycle provenance explicitly.

Imported manual exchange positions are adoption-point positions:

- Soar may persist them as starting open positions once ownership and execution
  context are canonical
- Soar must not invent historical DCA, TTP, or TSL events that happened before
  adoption
- prospective DCA/TTP/TSL management may start only from the adoption point
  when strategy context is canonical

## Runtime Loop Shape

For every runtime tick or fresh market-data pass, the bot should follow this
logical order:

1. ingest fresh market data and lifecycle price truth
2. refresh open orders and open positions or consume authoritative exchange
   events available for the mode
3. reconcile local orders, fills, positions, and imported/manual exchange state
4. for each managed open position, run DCA-first position management
5. close only after the relevant DCA gate is satisfied or released by policy
6. evaluate strategy signals for new entries
7. submit eligible open orders through the canonical execution adapter
8. publish telemetry/read models for dashboard freshness

This loop may be split across workers or event handlers, but the resulting
state transitions must preserve the same logical order and audit trail.

## Backtest Parity

Backtest replay must use the same position-management decision core as runtime
wherever possible.

Differences are allowed only at adapter boundaries:

- simulated fills instead of exchange fills
- historical candle or mark-price inputs instead of live streams
- deterministic replay-time account and funds model instead of real balances

Backtest reports and timelines must preserve lifecycle semantics such as
`OPEN`, `DCA`, `TP`, `SL`, `TTP`, `TSL`, liquidation, and final-range closure
without replacing them with generic close events.

## Validation Requirements

Any implementation task touching this contract must include focused coverage
for:

- `basic` mode ignoring advanced trailing settings
- `advanced` mode using `TTP`/`TSL` instead of hard `TP`/`SL`
- DCA-first gating before close management
- positive and negative DCA lane ordering
- unreachable DCA warnings in `basic` mode
- unaffordable DCA policy behavior
- TTP and TSL monotonic ratcheting
- imported `LIVE` position adoption without invented trailing history
- exchange order/position reconciliation when user changes state outside Soar

## Forbidden Patterns

- silently mixing `basic` and `advanced` close authority for one position
- placing venue-side `TP`/`SL` in a way that contradicts DCA-first behavior
  while still presenting the DCA ladder as executable
- weakening a previously tighter TTP/TSL protected percent
- treating console-only diagnostics as enough for money-impacting DCA or close
  skips
- inventing historical DCA or trailing state for imported exchange positions
- allowing backtest, paper, and live to fork separate lifecycle meanings
