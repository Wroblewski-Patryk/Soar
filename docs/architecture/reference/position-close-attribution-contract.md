# Position Close Attribution Contract

Status: canonical contract for close attribution after user approval on
2026-04-27.

## Purpose

Define one canonical model for who or what initiated a position close, separate
from the existing close-reason lifecycle contract.

This contract exists so runtime, reconciliation, exchange events, dashboard
close actions, history views, and audit/reporting all describe the same close
outcome without guessing from logs or orphan states.

## Core Rule

Position close semantics must persist two different truths:

1. `closeReason`
2. `closeInitiator`

They must not be collapsed into one field.

## Dimension 1: `closeReason`

`closeReason` answers:

- why the position closed

Examples:

- `TP`
- `TTP`
- `SL`
- `TSL`
- `LIQUIDATION`
- `ACCOUNT_FLOOR`
- `MANUAL`
- `EXTERNAL_SYNC_MISSING`
- `SYSTEM_REPAIR`

`closeReason` remains lifecycle-facing and policy-facing.

## Dimension 2: `closeInitiator`

`closeInitiator` answers:

- who or what initiated the close

Canonical enum scope for V1 hardening:

- `BOT_APP`
- `USER_APP`
- `USER_EXCHANGE`
- `EXCHANGE`
- `SYSTEM_REPAIR`

### Canonical Meanings

- `BOT_APP`
  - the application runtime closed the position automatically through approved
    lifecycle automation
- `USER_APP`
  - the user initiated the close from the application UI or API command path
- `USER_EXCHANGE`
  - the application detected that the position was closed outside the app on
    the linked exchange, with no stronger canonical app-side close authority
- `EXCHANGE`
  - the exchange itself forced or confirmed closure through venue-side
    mechanics such as liquidation
- `SYSTEM_REPAIR`
  - the system closed the local record as a repair or cleanup action, not as a
    user or lifecycle trading action

## Canonical Mapping Rules

### 1. Bot-driven lifecycle close

If the runtime lifecycle closes a position through canonical automated policy:

- `closeInitiator = BOT_APP`
- `closeReason` comes from lifecycle authority such as `TP`, `SL`, `TTP`,
  `TSL`, or `ACCOUNT_FLOOR`

### 2. User closes from dashboard or app API

If the user clicks close in the dashboard or triggers the close through the app
API:

- `closeInitiator = USER_APP`
- `closeReason = MANUAL`

The later exchange fill confirmation must preserve that initiator instead of
rewriting it to a generic exchange-origin close.

### 3. User closes directly on the exchange

If the app did not create the close intent, and exchange truth later proves the
position disappeared or was closed externally:

- `closeInitiator = USER_EXCHANGE`
- `closeReason = EXTERNAL_SYNC_MISSING` for reconcile-driven disappearance
  unless stronger exchange event truth provides a more precise reason

This path must be treated as canonical external closure detection, not as a
generic orphan cleanup.

### 4. Exchange-forced close

If exchange truth proves venue-side forced close, such as liquidation:

- `closeInitiator = EXCHANGE`
- `closeReason = LIQUIDATION`

### 5. System repair / orphan cleanup

If the system closes a local row only because canonical ownership or lifecycle
truth cannot be repaired:

- `closeInitiator = SYSTEM_REPAIR`
- `closeReason = SYSTEM_REPAIR`

This path must stay clearly distinct from real trading closes.

## Write-Path Ownership

The close-attribution model must be applied consistently by:

- runtime lifecycle close execution
- dashboard close-position command path
- exchange event application
- live reconciliation when exchange no longer confirms the position
- orphan-repair or repair-only maintenance flows

No UI or read model may infer close initiator from `origin`, `syncState`, or
free-text logs when canonical persisted attribution is available.

## Persistence Contract

At minimum, canonical close attribution must persist on `Position`.

Preferred V1 hardening target:

- persist `closeReason` and `closeInitiator` on `Position`
- persist close attribution on close-side `Trade` rows as well when a close
  trade is materialized

The read model may derive summary labels from those persisted fields, but must
not substitute a different truth model.

## Event and Reconciliation Priority

When both app-side intent and exchange-side confirmation exist:

1. app-side close intent establishes the provisional `closeInitiator`
2. exchange confirmation finalizes the close lifecycle state
3. exchange confirmation may refine `closeReason`
4. exchange confirmation must not erase a stronger existing initiator truth
   unless the previous attribution was explicitly provisional and incorrect

## Fail-Closed Rule

If the system cannot distinguish between:

- `USER_EXCHANGE`
- `EXCHANGE`
- `SYSTEM_REPAIR`

it must choose the most conservative canonical value supported by the concrete
write path, and remain explicit rather than inventing certainty.

For V1 hardening, reconcile-driven live disappearance without app-side close
authority should be treated as:

- `closeInitiator = USER_EXCHANGE`
- `closeReason = EXTERNAL_SYNC_MISSING`

unless exchange event truth proves a stronger venue-side cause such as
`LIQUIDATION`.

## Operator Surface Contract

Runtime history, positions history, and trade history must be able to expose
human-readable close attribution based on the canonical persisted model, for
example:

- `Closed by bot`
- `Closed by user in app`
- `Closed on exchange`
- `Liquidated on exchange`
- `Closed during repair`

Presentation copy may vary by locale, but the underlying mapping must stay
deterministic.
