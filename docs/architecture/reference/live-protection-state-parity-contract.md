# LIVE Protection-State Parity Contract

Status: canonical
Accepted: 2026-04-29

## Purpose

Freeze one canonical parity model for `LIVE` `DCA`, `TTP`, and `TSL` when a
position is:

- opened by the bot in the normal lifecycle,
- imported from the exchange,
- or recovered after runtime restart.

This contract exists because `LIVE` protection must not look more armed on
operator surfaces than it is in the runtime engine, especially for imported
and recovered positions.

## Core Rule 1: Runtime Protection State Is Canonical Execution Truth

For `LIVE`, the canonical execution truth for advanced protection behavior is
the runtime protection state actually available to the lifecycle engine.

This includes at minimum:

- DCA progression (`currentAdds`)
- trailing anchor / effective favorable-move tracking
- trailing take-profit high watermark and active step
- trailing stop loss limit

Read models may visualize only the protection state that runtime can
canonically execute.

Forbidden:

- deriving a stronger dynamic `TTP` / `TSL` stop in the read model than the
  runtime engine can prove and execute

## Core Rule 2: Imported or Recovered LIVE Positions Must Not Pretend to Know Unseen Trailing History

When a `LIVE` position becomes managed through exchange import or restart
recovery, the repository must not retroactively invent a prior unseen high
watermark or prior unseen trailing-loss path.

Forbidden:

- reconstructing `TTP` trigger history from one current snapshot as if the
  bot had observed the whole move already
- immediately closing a newly imported position because a display-only
  fallback implies the trailing stop would have been hit earlier

## Core Rule 3: Prospective Hydration Is Allowed

When a managed imported or recovered `LIVE` position has canonical owner,
strategy, and execution context, but no prior runtime protection state:

- the runtime may initialize a prospective protection state from current truth
- protection then becomes valid from the moment of adoption onward
- this state is not equivalent to full historical continuity

Approved prospective initialization examples:

- `currentAdds = 0` when no canonical DCA progression truth exists
- active `TTP` level starts from current favorable move if the arm threshold is
  already crossed at adoption time
- active `TSL` level starts from current favorable move if its arm threshold is
  already crossed at adoption time

This is valid only as forward-looking protection from the adoption point.

## Core Rule 4: If Prospective Hydration Cannot Be Proven Safely, Degrade Explicitly

If runtime cannot prove one safe protection-state initialization path, the
position may remain visible and even manually closeable, but it must not
present itself as fully protection-actionable.

At minimum, operator surfaces must be able to distinguish:

- canonical runtime protection state present
- prospective-only runtime protection state
- protection state unresolved / degraded

## Core Rule 5: Read Models Must Not Use Display-Only Sticky Fallback As Execution Truth

Display-only fallback helpers must not create the illusion that dynamic `TTP`
or `TSL` is armed when:

- runtime state is missing, or
- the state has not yet been hydrated prospectively

Allowed:

- showing configured trailing levels
- showing that advanced close mode exists
- showing explicit degradation or prospective-only protection state

Forbidden:

- showing a computed dynamic stop line or protected PnL threshold that the
  runtime engine is not actually using

## Core Rule 6: DCA-First Guard Remains Canonical

This contract does not remove the existing `DCA-first` architecture rule.

If the next DCA is still valid and financially possible:

- `TTP`, `TSL`, and `SL` must still not close

But parity work must prove the same rule is applied consistently in:

- `BACKTEST`
- `PAPER`
- `LIVE`

for imported/recovered `LIVE` positions as well as bot-opened `LIVE`
positions.

## Core Rule 7: PAPER and LIVE Share Forward Semantics, Not Hidden Retrospective Guessing

`LIVE` may differ from `PAPER` only where exchange observability differs.

If `PAPER` knows a full replayed price history and `LIVE` adopts a position
midstream from the exchange:

- `LIVE` must not fake that missing history
- `LIVE` may only protect prospectively from the adoption point unless stronger
  persisted runtime state already exists

This is an intentional fail-closed difference in observability, not a license
for read-model overstatement.

## Required Validation

Any implementation wave touching this contract must include:

- focused tests proving imported profitable `LIVE` positions do not expose
  stronger dynamic trailing stops than runtime can execute
- focused tests proving prospective hydration can arm forward `TTP` / `TSL`
  from the adoption point
- focused tests proving retrace closes after prospective hydration behave
  canonically
- focused tests proving DCA-first gating remains consistent across
  `backtest`, `paper`, and `live`

## Forbidden Patterns

- UI/read-model sticky-high fallback acting as de facto execution truth
- retrospective trailing-state reconstruction from one exchange snapshot
- imported or recovered `LIVE` rows silently acting fully protected while
  runtime lacks canonical protection state
- fixing `LIVE` by weakening the `DCA-first` contract only in one mode
