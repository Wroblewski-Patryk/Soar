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
- In existing configurations and snapshots without `additional.dcaSizingBasis`,
  the effective version is `quantity_v1`: multiplier `1` adds the current asset
  quantity. The explicit `quantity_v1` value has the same behavior.
- The explicit `additional.dcaSizingBasis: "usdt_contribution_v1"` opts the
  computation engine, both BACKTEST replay paths, and PAPER/LIVE runtime into
  USDT contribution sizing. The strategy form does not yet expose this opt-in.
  Unknown versions fail parsing or runtime policy validation.
- For `usdt_contribution_v1`, current book contribution is the sum of confirmed
  fill notionals, represented by `averageEntryPrice * quantity` in the
  position state. The next add has USDT notional `bookContribution * multiplier`
  and asset quantity `addNotional / DCA fillPrice`; the new average uses the
  confirmed fill price and both quantities. A multiplier of `1` therefore adds
  the current USDT contribution. This amount excludes trading fees and funding;
  leverage affects required margin and ROI, not the USDT notional multiplier.
  BACKTEST uses its historical DCA probe fill price and reserves
  `addNotional / leverage` as margin.
- In PAPER/LIVE, SPOT contribution is confirmed quote spent and FUTURES
  contribution is confirmed USDT margin. With a fixed position leverage, these
  are `averageEntryPrice * quantity` for SPOT and that notional divided by
  leverage for FUTURES. The next add uses the current contribution times its
  multiplier, then converts the required notional at the current execution
  price. The order fill's actual price and quantity update the canonical
  position, so the next contribution and ROI derive from the filled average
  after restart. The DCA count and advanced level indices are recovered from
  confirmed DCA trades and successful execution dedupe records. If those records
  cannot be reconciled after restart, runtime DCA stops with
  `DCA_PROGRESS_UNCONFIRMED`. Trading fees and funding remain separate from
  contribution.
- Before a PAPER/LIVE USDT DCA order, runtime floors the requested asset
  quantity to the venue amount precision or quantity step. It checks minimum
  quantity and notional against this order quantity, then checks available
  funds for that quantity. Rounding never increases the requested add at the
  current mark price. A zero or too-small result blocks the add before dedupe
  or order submission; the actual fill drives subsequent contribution and ROI.
- Basic DCA repeats its first configured threshold and multiplier for exactly
  `dcaTimes` executions. Advanced DCA uses each configured threshold and
  multiplier pair once. Each later threshold is evaluated against ROI from the
  updated average entry. The versioned BACKTEST parser rejects incomplete or
  invalid USDT level pairs instead of silently falling back to old sizing.
- PAPER/LIVE require a canonical, in-sync position, matching strategy and bot
  ownership, a USDT pair, known venue minimum amount/notional and amount
  precision, and sufficient free wallet USDT before a USDT DCA order is
  submitted. If any of these checks fail, the add is blocked. Venues reporting
  an unknown contract size or a contract size other than one are blocked until contract conversion is
  represented in the runtime contribution calculation. For imported futures
  positions, the exchange-confirmed margin must agree with the canonical
  average, quantity, and leverage before another add. Quantity-based runtime
  DCA retains multiplier limit `2`; larger configured values fail closed.
  If a reached USDT DCA level is blocked specifically for insufficient funds,
  runtime records that reason and may close the position by configured stop
  loss only when the stop loss is exceeded. This exception does not apply to
  venue rule, precision, or other validation failures, nor before the DCA
  threshold is reached.
  Direct DCA reads the position and its active bot strategy links, rejects a
  supplied strategy or bot ID that differs from the canonical owner, and
  refuses an order if the position or strategy configuration cannot be read.
  Position automation blocks automatic DCA and protection closes with
  `PRETRADE_BLOCKED` when strategy configuration is unavailable; the owner's
  separate manual close path remains available. A full single-symbol BACKTEST replay with
  nonzero modeled fee verifies that fee changes trade cost, not the USDT
  contribution used by the DCA multiplier.

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

### DCA Before Basic Protection

For `usdt_contribution_v1`, a pending positive DCA level blocks `TP` and a
pending negative level blocks `SL`. The corresponding trailing protection is
blocked on the same side. A remaining negative level does not block `TP`; a
remaining positive level does not block `SL`. Basic DCA repeats the first level
exactly `dcaTimes`; advanced DCA executes only defined levels.

When a USDT DCA level executes, that decision does not also close the position
using pre-fill ROI or a pre-fill protection price. After the fill is confirmed,
the next decision uses the filled quantity, new average entry, and resulting
ROI. For example, two basic `-30%` adds with `SL = -20%` do not close on the
old `-20%` threshold immediately after the second add. A reached add blocked
specifically by insufficient funds may release `SL` if the stop is exceeded;
venue precision and validation failures do not count as exhausted funds.
An unfunded positive level remains pending and continues to block `TP`/`TTP`.
Funds exhaustion does not release `TSL` for a pending negative level.
Runtime records `dca_funds_exhausted`; both replay paths expose a bounded count
and samples of reached, unfunded DCA levels in parity diagnostics.

Stored `quantity_v1` snapshots keep their existing sizing and same-pass exit
behavior. Venue-side hard `TP`/`SL` orders must not bypass this application
ordering or imply that a protected DCA level is unreachable without evidence.

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

An imported OPEN anchor without canonical fill history carries `fee=null` and
`feePending=true`. A later CLOSE can record the exchange closure, but its net
realized PnL remains unknown while an entry or exit fee is missing or pending.
An explicit exchange fee of zero is known. This applies to both exchange-event
and immediate runtime CLOSE finalization, including later fee-event refreshes.
Closed imported positions with pending Trade fees remain eligible for history
backfill. Canonical history replaces the synthetic OPEN anchor, matches an
existing exchange-synced or bot-created CLOSE by exchange trade ID or an
unambiguous synthetic fill identity. A runtime CLOSE representing several
exchange fills remains one aggregate Trade with their combined fee and PnL.
When every OrderFill matches canonical history, backfill also settles Order and
OrderFill fees so later event replay preserves the settled result.
Runtime trade read models preserve nullable fee and PnL values; monitoring
tables show an unknown amount as unavailable rather than a settled zero.

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
