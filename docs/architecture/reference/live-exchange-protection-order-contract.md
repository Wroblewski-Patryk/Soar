# LIVE Exchange Protection Order Contract

Status: proposed canonical target
Proposed: 2026-04-30

## Purpose

Define the target architecture for venue-side protection execution in `LIVE`
once Soar maintains exchange-backed stop orders for open positions.

This contract exists because runtime-only `SL`, `TTP`, and `TSL` logic is not
enough under rapid moves, API latency, or temporary worker interruption.

## Scope

- `LIVE` mode only
- exchange venues that support reduce-only stop-style protection orders
- one open position lifecycle at a time

## Core Rule 1: One Effective Protected Floor Per Open Lifecycle

At any moment an open `LIVE` lifecycle may have one current effective
protected floor.

That floor may originate from:

- basic `SL`
- advanced `TTP`
- advanced `TSL`

Different strategy mechanisms may change which semantic source currently owns
the floor, but Soar must not treat them as separate simultaneously executable
venue-side stop authorities for the same lifecycle.

## Core Rule 2: Strategy Semantics Stay In Runtime, Execution Moves To Exchange

Runtime remains the canonical owner of:

- DCA progression
- trailing activation and ratcheting
- semantic reason for the current floor

Exchange order ownership is execution-only:

- the exchange order mirrors the currently active floor
- it does not replace runtime as the source of why that floor exists

## Core Rule 3: Venue Protection Order Must Tighten, Never Loosen

When the active protected floor improves:

- Soar may create, replace, or amend the exchange-backed protection order

Forbidden:

- lowering a tighter venue-side stop to a weaker one
- deleting an active protection order without immediately replacing it with an
  equally strong or stronger one, unless the lifecycle closed or protection
  was intentionally disabled by canonical strategy state

## Core Rule 4: Close History Must Materialize From Proven Exchange Fill

If the venue-side protection order fills and the position disappears:

- local lifecycle history must be updated canonically
- `closeReason` preserves the semantic source of the floor (`SL`, `TTP`,
  `TSL`)
- `closeInitiator` preserves app automation authority when Soar placed the
  protection order

The repository must not leave a successful venue-side protection close as only
an exchange-side side effect with no local lifecycle closure.

## Core Rule 5: Breach-Pending Is Better Than Silent Reset

If market truth moves beyond the effective protected floor but Soar has not
yet confirmed the protection-order fill:

- runtime may mark the lifecycle as `breach-pending` or `close-pending`
- UI may show degraded or pending status

Forbidden:

- silently resetting armed protection
- presenting a new weaker floor as if the prior protection was never breached

## Required Future Implementation Areas

- exchange boundary support for native reduce-only stop order lifecycle
- canonical persistence for current effective protection order identity/state
- reconciliation between runtime floor and exchange order state
- close-attribution and history materialization on exchange-backed stop fill
- operator surfaces for active protected percent and order state

## Forbidden Patterns

- separate parallel stop orders for `SL`, `TTP`, and `TSL` on one lifecycle
  without one canonical effective-floor owner
- UI-only protection truth with no exchange or runtime execution authority
- backfilling close history from guesswork instead of proven fill or canonical
  reconciliation
