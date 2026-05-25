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

For `LIVE`, the current position pnl fraction must be derived from canonical
exchange-synced margin truth whenever `marginUsed` is available. `LIVE` may
fall back to modeled margin only until stronger exchange truth is present.

If the next DCA is still valid and financially possible:

- `TSL` and `SL` must still not close
- `TTP` must still not close when at least one remaining DCA threshold is on
  the profit side (`>= 0` current position pnl fraction threshold)
- `TTP` may still close when all remaining DCA thresholds are loss-side only,
  because those levels do not represent pending profit-side continuation intent

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

## Core Rule 8: Armed Protection Floor Is Monotonic Until Canonical Close Handling Finishes

Once `SL`, `TTP`, or `TSL` arms for one open lifecycle, the effective
protected floor for that lifecycle must not loosen or disappear merely because
current `PnL` or price moved back through it.

Allowed:

- ratcheting protection upward when strategy semantics tighten it
- replacing one active protected floor with a stronger one
- clearing protection only after canonical close handling or explicit strategy
  deactivation for that lifecycle

Forbidden:

- lowering the active protected floor after it was armed
- erasing armed `TTP` / `TSL` state just because current `PnL` fell below the
  floor that should already protect the position

If current exchange truth shows the position moved beyond the active protected
floor before canonical close confirmation arrived:

- the lifecycle must be treated as protection-breached or close-pending
- runtime and read models must not present that position as if a weaker or
  fresh trailing floor still applied
- later exchange close confirmation must finalize the lifecycle and history

This rule exists to keep operator trust under fast moves and gap-through-stop
scenarios.

## Core Rule 9: LIVE Protection Must Converge Toward One Exchange-Side Effective Stop Order

For `LIVE`, `basic SL`, `advanced TTP`, and `advanced TSL` are different
strategy semantics, but they all converge operationally to one current
effective stop floor for the open lifecycle.

When the venue supports native protection orders, the target contract is:

- runtime computes the current effective protected floor
- Soar maintains one exchange-backed reduce-only protection order matching
  that floor
- when the effective floor tightens, the exchange-side stop order is replaced
  or amended to the stronger floor
- the repository must never loosen an already tighter protection order

This does not make the exchange order the source of strategy semantics.

Canonical ownership remains:

- runtime state and strategy config define why the floor exists
- exchange-side protection order defines last-mile execution at the venue

If an exchange-backed protection order fills and the position disappears:

- canonical lifecycle close must be materialized in local history
- close reason must preserve the semantic source (`SL`, `TTP`, or `TSL`)
- close initiator must preserve app-side automation authority when the order
  was placed by Soar

If exchange order fill cannot be proven yet:

- the position may remain in a temporary breach-pending or close-pending
  state
- runtime and UI must not imply the position is still protected by a weaker or
  reset dynamic stop

## Required Validation

Any implementation wave touching this contract must include:

- focused tests proving imported profitable `LIVE` positions do not expose
  stronger dynamic trailing stops than runtime can execute
- focused tests proving prospective hydration can arm forward `TTP` / `TSL`
  from the adoption point
- focused tests proving retrace closes after prospective hydration behave
  canonically
- focused tests proving `TTP` distinguishes pending profit-side DCA from
  loss-side-only DCA
- focused tests proving DCA-first gating remains consistent across
  `backtest`, `paper`, and `live`
- focused tests proving armed protection remains monotonic on pullback and
  gap-through-stop scenarios
- focused tests proving exchange-backed protection fill updates history and
  close attribution canonically when `LIVE` protection orders are introduced

## Forbidden Patterns

- UI/read-model sticky-high fallback acting as de facto execution truth
- retrospective trailing-state reconstruction from one exchange snapshot
- imported or recovered `LIVE` rows silently acting fully protected while
  runtime lacks canonical protection state
- fixing `LIVE` by weakening the `DCA-first` contract only in one mode
- resetting armed protection after a breach without canonical close handling
- treating exchange-side stop-order fill as optional bookkeeping instead of
  canonical lifecycle closure once proven
