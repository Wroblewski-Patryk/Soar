# SAFEV1-A Live/Paper Runtime Safety Audit (2026-04-22)

Status: Active findings  
Scope: post-`RELEASE-HARDEN-A` V1 runtime safety review

## Review Target

Review the remaining V1-critical safety gaps where:

- `LIVE` can still synthesize invalid local truth from exchange data,
- runtime capital sizing can read the wrong exchange account,
- external-position ownership can be inferred heuristically instead of through
  canonical wallet/bot scope,
- production safeguards can silently degrade into weaker local-only behavior.

## Findings

### P0. Exchange reconciliation can still create or update open positions with zero entry price

Severity: Critical

Files:

- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`

Evidence:

- reconciliation currently persists `entryPrice` from
  `position.entryPrice ?? position.markPrice ?? 0`,
- an incomplete exchange snapshot can therefore create or refresh an open
  position with `entryPrice=0`,
- this violates the already frozen no-zero-entry lifecycle rule for V1.

Why this matters:

- realized and unrealized PnL, margin usage, stop logic, and operator display
  can all drift from executable truth,
- reconciliation becomes a back door that reintroduces the exact synthetic
  state we already removed from canonical order/fill/position lifecycle paths.

Required remediation:

- reconciliation must fail closed when canonical entry truth is unavailable,
- unresolved exchange positions must remain explicit unresolved sync state
  instead of becoming locally tradable zero-entry positions,
- regression tests must lock incomplete snapshot handling.

### P0. LIVE runtime capital context can still fall back to the latest user API key on the same exchange

Severity: Critical

Files:

- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- downstream consumers in runtime sizing and DCA checks

Evidence:

- wallet-scoped and bot-scoped API-key lookup exists,
- but when neither resolves, live capital context falls back to
  `findFirst({ userId, exchange, orderBy: updatedAt desc })`,
- that result feeds both runtime reference balance and funds-exhausted checks.

Why this matters:

- a bot can size entries or DCA using the balance from an unrelated account on
  the same exchange,
- `PAPER` and `LIVE` parity is broken at the safety boundary because `LIVE`
  stops being tied to canonical ownership truth,
- this is the same class of forbidden fallback we already removed from live
  order execution.

Required remediation:

- live capital context must be fail-closed to wallet-owned or bot-owned
  credentials only,
- unresolved live credential ownership must remain explicit unresolved capital
  context,
- regression tests must lock sizing and DCA behavior under missing or
  mismatched ownership.

### P1. External exchange position ownership is still resolved by symbol-level heuristics instead of one canonical owner contract

Severity: High

Files:

- `apps/api/src/modules/bots/runtimeExternalPositionOwner.service.ts`
- runtime bot positions/close command readers that consume it

Evidence:

- symbol ownership is assembled from configured groups, legacy strategies, and
  configured links into one flat symbol set,
- tie-breaking uses a hardcoded `Number.MIN_SAFE_INTEGER` execution order for
  the primary pass,
- effective ownership can therefore collapse to "first active/oldest bot for a
  symbol" instead of the canonical wallet/bot scope.

Why this matters:

- external takeover, runtime monitoring, and manual close can attach to the
  wrong bot when two bots overlap on symbol coverage,
- legacy compatibility bridges still influence live ownership decisions more
  than they should for V1.

Required remediation:

- external-position ownership must be derived from one explicit canonical owner
  contract with deterministic ambiguity handling,
- overlapping or unresolved ownership must stay explicit and fail closed,
- legacy symbol-only bridges must not outrank canonical wallet/bot scope.

### P1. Production rate limiting silently degrades to per-process in-memory mode after Redis failures

Severity: High

Files:

- `apps/api/src/middleware/rateLimit.ts`

Evidence:

- failed Redis client bootstrap is cached as `null`,
- request-time Redis errors fall back to local in-memory buckets,
- the same limiter is used on auth, trading, profile, and wallet preview
  endpoints.

Why this matters:

- in multi-instance production, the effective limit stops being global,
- the degradation is operator-invisible and can last until process restart,
- safety-critical write paths become easier to abuse exactly during infra
  partial failure.

Required remediation:

- production rate limiting must not silently settle into indefinite local-only
  mode,
- bootstrap and runtime Redis failures need explicit degraded-state policy and
  operator signal,
- regression coverage should lock the fail-closed or explicitly degraded
  contract.

## Review Result

The architecture is much cleaner than before, but V1 runtime safety is still
not fully closed because reconciliation, capital truth, external ownership, and
rate-limit degradation can still synthesize or accept non-canonical behavior.

## Recommended Follow-Up Wave

- `SAFEV1-A` as the dedicated remediation family:
  - zero-entry reconciliation closure,
  - fail-closed live capital truth,
  - canonical external ownership resolution,
  - explicit production rate-limit degradation contract,
  - focused closure validation and evidence sync.
