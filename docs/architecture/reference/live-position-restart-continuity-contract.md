# LIVE Position Restart Continuity Contract

Status: canonical  
Accepted: 2026-04-28

## Purpose

Freeze one restart-safe continuity model for `LIVE` positions so worker or bot
restart does not destroy truthful exchange-position state, ownership, or
post-restart automation context.

This contract exists because:

- restart is an execution interruption, not market truth,
- one weak post-restart snapshot must not close or de-own a real exchange
  position,
- recovered positions must regain enough canonical context for safe DCA,
  trailing, and close behavior.

## Scope

Applies to:

- execution-worker restart,
- runtime loop restart,
- bot downtime with `LIVE` positions still open on the exchange,
- first and subsequent authenticated recovery passes,
- event-driven recovery for supported exchange families,
- operator-facing runtime visibility of recovered or uncertain positions.

Does not apply to:

- `BACKTEST`,
- ordinary `PAPER` runtime lifecycle,
- unsupported exchange families outside the currently approved boundary.

## Core Principles

### 1. Restart does not authorize lifecycle finality

Restart must never by itself:

- close an open `LIVE` position,
- erase ownership truth,
- remove continuity from local history,
- silently downgrade a managed position into disappearance.

### 2. Evidence has strict priority

Restart recovery must evaluate evidence in this order:

1. confirmed exchange order/account/position events
2. durable local lifecycle state already persisted before restart
3. repeated authenticated exchange snapshot confirmation
4. explicit repair-only actions

The system must not let a single weaker source overwrite a stronger already
persisted truth.

### 3. Missing once is not closed

If an open `LIVE` position was previously confirmed and one post-restart
snapshot no longer shows it, the system must first enter an explicit recovery
or uncertainty state.

It must not immediately:

- set `status=CLOSED`,
- classify the position as exchange-manually closed,
- destroy bot ownership,
- remove it from operator visibility without an explicit degraded state.

### 4. Recovery must preserve or restore management context

If canonical ownership remains deterministic, recovered position continuity
must preserve or restore:

- `botId`
- `walletId`
- `strategyId`
- management policy
- exchange execution context

Recovered visibility without recovered management context is insufficient to
claim safe resumed automation.

### 5. Fail-closed still applies

Preserving continuity must not weaken money-path safety.

If the system cannot prove:

- ownership,
- strategy context,
- or actionable market truth,

the position may remain visible but must become explicitly non-actionable until
truth is restored.

## Canonical Recovery States

The implementation may choose exact field names, but the domain contract must
support these semantic states:

### A. Confirmed and managed

- exchange truth or strong local continuity confirms the position is open
- ownership is deterministic
- canonical management context is available
- automation may resume when other lifecycle gates allow it

### B. Recovering / awaiting confirmation

- the position was previously open
- current recovery evidence is incomplete or conflicting
- the system is not yet allowed to finalize close or delete continuity

This state is visible and explicit.

### C. Recovered but not yet actionable

- the position is still believed or confirmed to exist
- but management context is unresolved or incomplete
- operator sees the row
- automation and action controls stay fail-closed

### D. External close confirmed

- stronger evidence confirms the position no longer exists on the exchange
- close attribution must remain distinct from repair-only cleanup

### E. Repair-only cleanup

- local row cleanup was performed for consistency reasons only
- this is not equivalent to confirmed external trading behavior

## Event and Snapshot Priority

### Supported exchange events

For currently supported live adapter families, confirmed exchange events are
the strongest recovery authority for:

- open/update continuity
- close continuity
- liquidation or exchange-forced close

### Snapshot reconciliation

Authenticated REST reconciliation is recovery and confirmation authority, not
one-pass destructive authority after restart.

Reconciliation may:

- restore visibility,
- restore ownership-backed continuity,
- confirm sustained external disappearance after stronger criteria are met,
- classify stale local debt for repair-only closure.

Reconciliation may not:

- treat first-pass absence as final close by default,
- override stronger persisted event truth,
- invent strategy ownership or bot ownership by guessing.

## Ownership Restoration Rules

### Deterministic restoration only

Recovered `LIVE` positions may regain bot ownership only when canonical
ownership proof is deterministic under the approved wallet-first ownership
contract.

Allowed proof examples:

- exact `apiKeyId + symbol` ownership result
- wallet-bound canonical owner already persisted and still valid
- exchange-event linkage to an already owned order or position lifecycle

Forbidden proof:

- first matching strategy
- first active bot on same symbol
- symbol-only guessing without canonical owner proof

### Wallet and strategy restoration

If the system restores `botId`, it must also restore or preserve the canonical
`walletId` and, where deterministic, the canonical `strategyId`.

If `strategyId` cannot be proven safely:

- the position remains visible,
- automation remains fail-closed,
- the unresolved state is explicit.

## Close Classification During Downtime

The contract must preserve the difference between:

- still open after restart
- temporarily missing/unconfirmed after restart
- manually closed on exchange during downtime
- liquidation or exchange-forced close during downtime
- repair-only local cleanup

This contract extends, and must remain compatible with:

- `reference/position-close-attribution-contract.md`

## Runtime Automation Contract

Recovered `LIVE` positions may re-enter DCA, TTP, TSL, SL, or manual close
authority only when all of the following are true:

- position is still open by sufficiently strong evidence
- ownership is deterministic
- execution context is canonical
- strategy context is canonical
- the row is marked actionable rather than recovering/unresolved

If any requirement is missing, automation must remain explicit and fail-closed.

## Operator Surface Contract

Operator-facing runtime surfaces must not represent recovery uncertainty as
absence.

The API and UI must be able to show at least:

- managed and recovered
- recovering / awaiting exchange confirmation
- recovered but not actionable
- externally closed
- repair-only closure

## Required Verification

Implementation closure must prove:

- first post-restart snapshot miss does not close a still-open position
- recovered owned positions reappear under the correct bot scope
- recovered owned positions regain enough context for safe DCA/trailing when
  deterministic
- manual exchange close during downtime remains distinct from repair cleanup
- liquidation during downtime remains distinct from manual exchange close
- ambiguous or unresolved ownership stays visible and fail-closed

## Related Contracts

- `reference/wallet-source-of-truth-contract.md`
- `reference/execution-lifecycle-parity-contract.md`
- `reference/position-close-attribution-contract.md`
- `reference/position-lifecycle-parity-matrix.md`
