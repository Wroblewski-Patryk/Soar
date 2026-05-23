# REVIEW-C Runtime State and Reconciliation Audit (2026-04-22)

Status: Active findings  
Scope: post-`REVIEW-B` production-readiness review

## Review Target

Review the remaining production-risk surfaces around:

- runtime state replay after dedupe reuse,
- exchange snapshot error-contract truth,
- live reconciliation truth for disappearing exchange orders,
- operator trust in runtime-versus-exchange diagnostics.

## Findings

### P0. Reused completed DCA dedupe can still rehydrate runtime state from synthetic math instead of canonical persisted position truth

Severity: Critical

Files:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`

Evidence:

- completed DCA dedupe reuse currently returns only `executed=true` without the
  canonical next quantity or next entry price,
- the runtime state continuation path then falls back to locally computed
  `result.nextState`,
- that fallback is derived from evaluation-time math, not from the persisted
  post-fill position truth already stored in the database.

Why this matters:

- a crash or replay window can still reintroduce DCA drift after the main
  pre-fill mutation bug was already fixed in `REVIEW-B`,
- runtime state may diverge from the canonical persisted position even when the
  exchange/order lifecycle is already complete,
- later automation decisions can be made against stale or synthetic
  quantity/entry-price assumptions.

Required remediation:

- completed DCA dedupe reuse must reload canonical next-state truth from the
  persisted position and not from local replay math,
- the runtime state handoff must distinguish `reused completed` from
  `newly executed` and from `still pending`,
- regression tests must lock crash/replay recovery around canonical
  quantity/entry-price restoration.

### P1. Exchange position snapshot fetch failures can bypass the normalized exchange-error contract

Severity: High

Files:

- `apps/api/src/modules/positions/positions.service.ts`

Evidence:

- the raw authenticated exchange fetch is executed before the main normalization
  `try/catch`,
- only later branches translate failures into `ExchangeSnapshotError` with the
  intended operator-facing error code.

Why this matters:

- real exchange transport or adapter failures can leak as generic 500s instead
  of the explicit exchange-fetch failure contract,
- operator recovery UX becomes inconsistent exactly on the diagnostics path that
  should be the most truthful under stress,
- future automation or UI layers cannot rely on one stable error family.

Required remediation:

- all authenticated exchange snapshot fetch failures must be normalized through
  one explicit `ExchangeSnapshotError` path,
- controller/API responses must stay deterministic for network, adapter, and
  unsupported-operation failures,
- regression tests must lock the error-family contract.

### P1. Live reconciliation treats disappearance from the exchange open-orders snapshot as `CANCELED`, even when the order may have filled

Severity: High

Files:

- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`

Evidence:

- reconciliation builds `seenOpenExchangeOrderIds` only from the current
  exchange open-orders snapshot,
- any previously synced local order missing from that open-only set is closed
  through `closeStaleSyncedOrder(...)`,
- the helper hard-sets `status='CANCELED'` and `syncState='ORPHAN_LOCAL'`.

Why this matters:

- disappearing from the open-orders list is not proof of cancelation; it can
  also mean fill, reject, expire, or exchange-side archival behavior,
- local order truth can become strictly wrong even while the exchange behaved
  correctly,
- that wrong terminal state poisons later operator diagnostics, retries, and
  recovery logic.

Required remediation:

- open-order disappearance must become an explicit unresolved reconciliation
  state until terminal lifecycle truth is confirmed,
- reconciliation must not synthesize `CANCELED` when the exchange only proved
  `not currently open`,
- regression tests must lock the distinction between `not open anymore` and
  `confirmed canceled`.

## Review Result

`TRUTH-A`, `XLIFE-A`, and `REVIEW-B` closed the largest lifecycle and ownership
gaps, but runtime truth is still not fully production-safe because replay,
operator diagnostics, and reconciliation semantics can still drift from
canonical persisted or exchange-confirmed state.

## Recommended Follow-Up Wave

- `REVIEW-C` as a dedicated executor-ready remediation family:
  - canonical runtime-state replay after dedupe reuse,
  - deterministic exchange snapshot error normalization,
  - truthful reconciliation for disappearing open orders,
  - focused closure validation and evidence sync.
