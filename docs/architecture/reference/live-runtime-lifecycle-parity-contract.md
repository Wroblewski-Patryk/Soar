# LIVE Runtime Lifecycle Parity Contract

## Purpose

Freeze the canonical parity rules for `LIVE` position-management lifecycle
behavior after the broader `V1RESTART-A`, `V1CLOSE-A`, and `V1LIVE-A`
hardening waves.

This contract exists to remove the remaining gap where `PAPER` can behave
correctly while `LIVE` appears operationally similar but diverges in:

- add-fill application,
- DCA attribution,
- account-update write scope,
- runtime versus read-model strategy truth,
- runtime versus read-model protection-state truth,
- operator-visible degraded runtime diagnostics.

## Canonical Rule 1: Existing-Position Add Fills Must Update the Position

When a canonical `LIVE` fill confirms additional entry quantity on an already
open position:

- the linked `Position` must update through canonical add-update math,
- the new `quantity` and `entryPrice` must persist from fill truth,
- the position must not wait for later `ACCOUNT_UPDATE` or reconciliation as
  its primary add-update authority.

`ACCOUNT_UPDATE` may confirm or repair later exchange state, but it must not be
the first or only source of truth for a confirmed add fill that already has an
identified local `positionId`.

## Canonical Rule 2: Add Fills Must Preserve DCA Semantics

When runtime or user-originated `LIVE` execution adds to an already open
position and the semantic action is an add-leg:

- the persisted trade lifecycle action must be `DCA`,
- not generic `OPEN`,
- and runtime/reporting/operator history must be able to distinguish:
  - initial entry,
  - add-leg entry,
  - closing execution.

## Canonical Rule 3: Exchange Account Updates Are Confirmation/Repair, Not Broad Rewrite Authority

`ACCOUNT_UPDATE` for `LIVE` must reconcile only the positions that belong to
the canonical affected ownership scope.

It must not mutate or close every open row matching only:

- `userId`,
- `symbol`,
- `side`.

Approved write scope is:

- exact linked live wallet or canonical ownership candidate when
  deterministically known,
- otherwise explicit no-op with operator-visible degraded telemetry,
- never a broad convenience update across unrelated runtime contexts.

If the repository cannot determine one exact local candidate safely, it must
fail closed rather than rewrite multiple open rows.

## Canonical Rule 4: Runtime and Read Models Must Not Disagree About Strategy Truth

If runtime automation requires canonical strategy truth from `position.strategyId`
to execute DCA, TSL, or other strategy-derived lifecycle actions, then
operator-facing read models must not imply equivalent automation truth through a
looser symbol-level fallback.

Allowed:

- explicit degraded presentation such as "visible but strategy context unresolved"
- read-model fallback only when clearly labeled as non-canonical display aid

Forbidden:

- surfacing DCA/TSL plan truth as if runtime can execute it when canonical
  `strategyId` is missing or unresolved

## Canonical Rule 5: Fail-Closed Runtime Skips Must Be Operator-Visible

Money-impacting `LIVE` runtime skips must not remain console-only diagnostics.

At minimum, canonical operator-visible telemetry must exist for skip classes
such as:

- unresolved continuity state,
- missing canonical bot ownership,
- unresolved inherited execution context,
- missing or unresolved canonical strategy context,
- unresolved account-update candidate scope,
- live opt-in or wallet execution guard failures that block management.

## Canonical Rule 6: PAPER and LIVE Share One Lifecycle Meaning

`PAPER` and `LIVE` may differ at execution source, but not at lifecycle
meaning.

They must share:

- the same add-update position math,
- the same semantic distinction between `OPEN`, `DCA`, and `CLOSE`,
- the same PnL/ROI percent position-management semantics from
  `position-management-pnl-lifecycle-contract.md`,
- the same strategy-context requirements for automation,
- the same operator-visible degraded-state semantics when canonical truth is
  missing.

## Canonical Rule 7: Runtime and Read Models Must Not Disagree About Protection Truth

If `LIVE` runtime advanced protection (`TTP` / `TSL`) depends on persisted or
prospectively hydrated runtime protection state, operator-facing read models
must not imply a stronger dynamic stop than the runtime engine can really
execute.

Allowed:

- explicit labels such as `prospective_only` or degraded protection state
- showing configured trailing levels without claiming the current dynamic stop
  is armed

Forbidden:

- read-model sticky-high fallback acting as if it were execution truth for
  imported or recovered `LIVE` positions

## Canonical Rule 8: Imported Positions Start At Adoption Point

When a user opens or changes a position directly on the exchange, Soar must
reconcile the exchange position with local state before claiming lifecycle
authority.

Imported positions may become bot-managed only when ownership, wallet/execution
context, and strategy provenance are canonical. Once adopted:

- the current exchange position becomes the starting open lifecycle state
- previous DCA, TTP, or TSL history must not be invented from a snapshot
- prospective DCA/TTP/TSL management may start from the adoption point onward
- missing provenance must be visible as degraded telemetry rather than hidden
  behind normal automation display

## Required Validation For This Contract

Any implementation wave touching this area must include:

- focused tests for confirmed add-fill -> position repricing,
- focused tests for explicit `DCA` attribution,
- focused tests for account-update scope isolation,
- focused tests for runtime/read-model strategy-context parity,
- focused tests or telemetry assertions for fail-closed runtime skip visibility.
- focused tests for imported exchange-position adoption without invented
  trailing or DCA history when reconciliation scope is touched.

## Forbidden Patterns

- updating an existing position from live add-fill only indirectly through later
  account snapshots
- persisting add-leg fills as generic `OPEN` when the semantic action is `DCA`
- broad account-update mutation over all `userId + symbol + side` rows
- read-model fallback that visually upgrades a non-canonical strategy context
  into actionable runtime truth
- importing exchange positions as if Soar knew pre-adoption DCA or trailing
  history
- money-impacting runtime skips that are diagnosable only through local
  `console.warn`
