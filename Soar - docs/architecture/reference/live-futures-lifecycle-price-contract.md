# LIVE Futures Lifecycle-Price Contract

Status: canonical
Accepted: 2026-04-29

## Purpose

Freeze one canonical lifecycle-price hierarchy for `LIVE FUTURES` runtime
protection and lifetime automation so money-impacting decisions prefer the same
price family Binance Futures uses for risk semantics whenever that truth is
available.

This contract exists because the repository already centralized lifecycle-price
resolution, but the stream boundary still exposed ticker `lastPrice` only,
which weakens parity for:

- `DCA`
- `TTP`
- `TSL`
- runtime position-lifetime close

## Core Rule 1: LIVE Futures Protection Prefers Mark Price

For `LIVE` positions on futures markets, lifecycle-price resolution must prefer
stream mark price when the approved exchange boundary can provide it.

Approved hierarchy:

1. futures stream `markPrice`
2. futures ticker `lastPrice`
3. latest positive recent candle close

This hierarchy applies to:

- runtime position automation
- runtime position-lifetime enforcement
- any other shared lifecycle path that explicitly consumes the runtime
  lifecycle-price seam

## Core Rule 2: SPOT Semantics Stay Unchanged

`SPOT` does not inherit futures mark-price requirements.

For `SPOT`, approved lifecycle-price hierarchy remains:

1. ticker `lastPrice`
2. latest positive recent candle close

Forbidden:

- inventing synthetic mark-price truth for spot
- blocking spot lifecycle evaluation because a mark-price field is absent

## Core Rule 3: One Shared Resolver Owns the Hierarchy

The repository must not fork separate price-authority logic across:

- runtime automation,
- runtime lifetime enforcement,
- or mode-specific callers.

All runtime money-impacting lifecycle-price consumers must reuse the canonical
resolver seam.

Forbidden:

- one service preferring mark price while another still hardcodes ticker last
  price
- duplicate fallback ladders in separate runtime modules

## Core Rule 4: Fallback Is Explicit, Not Silent Reinterpretation

If mark price is unavailable temporarily:

- the runtime may degrade to ticker `lastPrice`
- and then to recent candle close if ticker truth is unavailable too

But this is a degraded fallback, not a redefinition of canonical futures truth.

Implementations must keep the fallback order explicit in code and tests.

## Core Rule 5: Stream Expansion Must Stay Inside the Approved Boundary

Adding futures mark price is an extension of the approved Binance market-stream
boundary, not a second market-data subsystem.

Allowed:

- subscribing to Binance futures mark-price streams
- normalizing mark-price payload into the existing market-stream event family
- persisting mark price in the existing runtime ticker store

Forbidden:

- direct ad hoc exchange reads from runtime automation to fetch mark price
- separate one-off price caches outside the shared market-stream path

## Required Validation

Any wave touching this contract must include:

- stream normalization coverage for futures mark-price payloads
- subscription coverage proving futures mark-price channels are included
- shared resolver coverage proving `markPrice -> lastPrice -> candle close`
  order for futures
- runtime coverage proving automation/lifetime paths consume the shared
  stronger truth

## Forbidden Patterns

- treating futures ticker `lastPrice` as the strongest available lifecycle
  truth when mark price is already present
- introducing futures-only price logic directly in runtime callers instead of
  the shared resolver
- changing spot behavior to depend on futures-only data
