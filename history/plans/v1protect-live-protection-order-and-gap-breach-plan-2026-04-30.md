# V1PROTECT - LIVE Protection Order And Gap-Breach Plan

Status: Planned
Date: 2026-04-30
Owner: Codex Planning Agent

## Why This Wave Exists

Fresh production observations show one remaining protection gap that is now
clearly narrower than generic `TTP/TSL` parity:

- armed `TTP` / `TSL` state must remain monotonic in runtime and UI
- fast moves can cross the protected floor before app-side close confirmation
- `LIVE` still lacks one exchange-backed protection-order contract tying
  `basic SL`, `advanced TTP`, and `advanced TSL` to canonical venue-side
  execution

## Confirmed Repository State

Current architecture already freezes:

- runtime protection state is canonical execution truth
- imported/recovered `LIVE` positions may only hydrate protection
  prospectively
- read models must not imply stronger trailing truth than runtime can execute
- close attribution already separates `closeReason` from `closeInitiator`

What is still missing as an explicit architecture-and-implementation slice:

1. monotonic breach semantics once a protected floor is armed
2. one canonical exchange-side protection-order model for `LIVE`
3. history/update rules when venue-side stop fill closes the position
4. UI/API display parity for any currently active stop floor expressed in
   strategy-relative percent

## Target Outcome

For `LIVE`:

- an armed protected floor never silently loosens or disappears
- Soar can mirror the current effective floor as one exchange-backed
  reduce-only protection order when the venue supports it
- if that order fills, the local lifecycle closes canonically with truthful
  history and attribution
- operator surfaces show the current active protected floor in percent/value in
  the appropriate protection column

## Proposed Slices

### V1PROTECT-01

`docs(architecture): freeze monotonic breach semantics and exchange-backed protection-order target`

Goal:

- publish canonical architecture for:
  - armed protection monotonicity
  - breach-pending semantics
  - one effective floor per lifecycle
  - exchange-backed protection-order convergence

### V1PROTECT-02

`test(api-runtime-red): lock gap-through-stop and armed-state monotonicity`

Goal:

- prove runtime never silently resets armed `SL/TTP/TSL`
- prove pullback/gap scenarios preserve or close from the tracked floor

### V1PROTECT-03

`feature(api-exchange): introduce canonical LIVE protection-order state and exchange boundary support`

Goal:

- persist one current protection-order identity/state per open lifecycle
- support create/replace/cancel flows through the approved exchange boundary

### V1PROTECT-04

`fix(api-runtime): map basic SL and advanced TTP/TSL into one effective protected floor`

Goal:

- centralize the active floor owner and prevent parallel conflicting stop
  authorities per lifecycle

### V1PROTECT-05

`fix(api-reconcile+history): materialize proven exchange stop fills into canonical close lifecycle`

Goal:

- when the venue-side protection order fills and the position disappears,
  update:
  - `Position`
  - close history
  - attribution
  - trade/order linkage

### V1PROTECT-06

`fix(api+web-runtime): show current active protection percent/value truthfully in Positions and History`

Goal:

- display the active protected floor in the right runtime column
- distinguish:
  - active protection
  - breach-pending/close-pending
  - no active protection

### V1PROTECT-07

`qa(prod-manual): execute fast-move and exchange-side stop scenarios on LIVE`

Goal:

- verify:
  - arm
  - ratchet
  - pullback close
  - gap-through-stop
  - exchange-side fill -> local history parity

## Risks

- exchange venues differ in stop-order semantics and event timing
- close attribution may drift if fill proof is weak or delayed
- UI could overstate protection if breach-pending state is not explicit

## Non-Goals

- redesigning strategy configuration UX
- introducing multiple simultaneous venue-side protection orders for one
  lifecycle
- weakening the existing `DCA-first` rule
