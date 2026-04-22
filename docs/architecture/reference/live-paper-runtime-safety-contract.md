# Live/Paper Runtime Safety Contract

Status: Active  
Updated: 2026-04-22

## Purpose

Freeze the remaining V1 runtime safety rules so `LIVE` and `PAPER` keep one
shared domain flow while all exchange-specific uncertainty is handled
explicitly and fail closed.

## Product Intent

For V1:

- `LIVE` must execute against the exchange without hidden ownership fallbacks
  or synthetic lifecycle truth,
- `PAPER` must use the same order, fill, position, and capital semantics,
  except that exchange I/O is satisfied by synthetic or local adapters,
- unresolved exchange truth must stay unresolved instead of being converted
  into plausible-looking local truth.

## Non-Negotiable Rules

1. `LIVE` and `PAPER` share one canonical domain lifecycle for signal, order,
   fill, position, and runtime automation.
2. Exchange-derived state may enter the canonical model only when required
   truth fields are present and valid.
3. Missing ownership, missing entry price, or missing capital context in
   `LIVE` must fail closed.
4. `PAPER` may bypass exchange I/O, but it may not bypass lifecycle semantics,
   sizing rules, or ownership boundaries.
5. Legacy compatibility bridges may support reads, but they may not silently
   outrank canonical wallet/bot ownership in write or management flows.

## Canonical Truth Rules

### Reconciliation Truth

- exchange reconciliation must not create or refresh an open position with
  `entryPrice <= 0`,
- if exchange snapshot data lacks canonical entry truth, the position must stay
  unresolved and operator-readable,
- reconciliation is not allowed to reintroduce synthetic zero-entry state that
  the execution lifecycle already forbids.

### Capital Truth

- live reference balance and funds-exhausted checks must resolve credentials
  only from canonical wallet-owned or bot-owned exchange context,
- "latest user API key on the same exchange" is forbidden as a capital or
  sizing fallback,
- unresolved live capital context must stay explicit unresolved state and must
  not silently become permissive balance truth.

### External Ownership Truth

- exchange-synced positions may be managed only when one canonical owner can be
  derived deterministically,
- symbol-only heuristic ownership is insufficient when canonical wallet/bot
  scope is ambiguous or overlapping,
- ambiguity must stay explicit and fail closed for management actions.

### Production Safeguard Truth

- rate limiting on production-sensitive endpoints must not silently degrade into
  indefinite per-process-only enforcement,
- degraded limiter state must be explicit, bounded, and operator-visible,
- safety contracts for auth and trading writes are not considered satisfied if
  they depend on silent infra fallback.

## PAPER vs LIVE Boundary

- `PAPER`
  - uses the same lifecycle and sizing contracts,
  - skips authenticated exchange network calls,
  - may satisfy fill and balance truth through synthetic adapters.
- `LIVE`
  - uses authenticated exchange reads and writes,
  - must fail closed when exchange ownership or exchange truth is unresolved,
  - must never infer live capital or live position truth from unrelated user
    credentials.

## Required Task Packet Content

Every task in this family must define:

- exact risk being removed,
- exact files and modules in scope,
- predecessor dependencies,
- non-goals,
- acceptance criteria,
- required validation,
- required docs/context sync outputs.

## Forbidden Patterns

- persisting open positions with `entryPrice=0` from exchange reconciliation
- using unrelated recent API keys to infer live capital truth
- resolving live external-position ownership by broad symbol heuristics when
  canonical owner scope is ambiguous
- silently falling back from production Redis-backed rate limits to indefinite
  local-only protection
- diverging `PAPER` and `LIVE` domain flow just to work around missing
  exchange truth

## Required Closure Outputs

This remediation family is only closed when all of the following exist and
agree:

- detailed plan under `docs/planning/`
- active queue in `docs/planning/mvp-next-commits.md`
- mirrored phase state in `docs/planning/mvp-execution-plan.md`
- synchronized `.codex/context/TASK_BOARD.md`
- synchronized `.codex/context/PROJECT_STATE.md`
- focused validation evidence under `docs/operations/`
