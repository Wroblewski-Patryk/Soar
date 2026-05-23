# REVIEW-B Runtime/Exchange Production Audit (2026-04-22)

Status: Completed  
Scope: post-`XLIFE-A` critical-path review

## Review Target

Review the remaining production-risk surfaces around:

- bot runtime execution,
- exchange order truth,
- position mutation authority,
- operator exchange snapshots,
- watchdog/runtime infrastructure scope truth.

## Findings

### P0. Runtime DCA still bypasses canonical fill truth and can mutate position state before live fill is confirmed

Severity: Critical

Files:

- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`

Evidence:

- DCA opens a market order via `openOrderLifecycle(...)`.
- if the order remains `OPEN` or `PARTIALLY_FILLED`, runtime immediately tries to
  "finalize" it with `closeOrderLifecycle(...)`.
- regardless of canonical fill truth, the code then updates local position
  quantity and entry price and persists a `DCA` trade from requested
  `input.markPrice` and requested quantity.

Why this matters:

- this recreates the same pre-`XLIFE-A` anti-pattern that was already removed
  from runtime `OPEN/CLOSE` flow,
- `LIVE` can overstate DCA fills that never actually completed on the exchange,
- `PAPER` and `LIVE` are still not truly on one lifecycle path for add-legs.

Required remediation:

- DCA must move to the same canonical fill-result application path as
  `OPEN/CLOSE`,
- pending or partially-filled DCA orders must remain explicit pending state,
  not mutate local position truth early,
- DCA trade price/fee/quantity must come from canonical fill truth.

### P1. Submitted runtime dedupe is marked terminal too early and can suppress legitimate retries forever

Severity: High

Files:

- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/engine/runtimeExecutionDedupe.service.ts`

Evidence:

- `OPEN` and `CLOSE` submitted branches call `markSucceeded(...)` with `orderId`
  only, even when no canonical position result exists yet.
- `RuntimeExecutionDedupeService.acquire(...)` treats `SUCCEEDED` as reusable
  terminal state.
- there is no linked reconciliation path that reopens or invalidates dedupe
  when the submitted exchange order later fails, expires, or is canceled.

Why this matters:

- a failed or canceled submitted exchange order can leave runtime logically
  stuck in `submitted` forever,
- future signals on the same dedupe window can be suppressed despite no real
  execution outcome,
- this is especially dangerous for `EXIT`, where a bot may believe close is
  already in-flight forever and stop retrying.

Required remediation:

- submitted dedupe must become a non-terminal state, or
- reconciliation must be able to reopen failed/canceled submitted commands,
- regression tests must cover `submitted -> canceled/failed -> retry allowed`.

### P1. Generic exchange snapshot selection is ambiguous when a user has multiple API keys

Severity: High

Files:

- `apps/api/src/modules/positions/positions.service.ts`

Evidence:

- `fetchExchangePositionsSnapshot(...)` selects the most recently updated
  supported API key for the user,
- the endpoint is not scoped to wallet, bot, or explicit api-key selection.

Why this matters:

- the operator can receive a valid but wrong account snapshot when multiple
  exchange keys exist,
- this undermines trust in runtime diagnostics and manual recovery decisions,
- the issue becomes worse as the user adds more wallets or exchanges.

Required remediation:

- generic snapshot reads must become explicit about ownership,
- either require explicit `apiKeyId`/wallet context or fail closed when
  multiple eligible keys exist,
- operator docs and API contract must stop implying deterministic truth where
  account selection is ambiguous.

### P2. Runtime watchdog scans all open-position symbols while remaining Binance-only

Severity: Medium

Files:

- `apps/api/src/modules/engine/runtimeScanLoop.service.ts`

Evidence:

- scan symbol inventory is built from all open positions without exchange
  filtering,
- `getTickerSnapshot(...)` and emitted events remain explicitly
  `exchange: 'BINANCE'`.

Why this matters:

- the watchdog can appear alive while silently ignoring non-Binance runtime
  position coverage,
- future exchange rollout risks accidental false confidence in watchdog
  protection.

Required remediation:

- scan symbol selection must align with explicit watchdog scope, or
- the watchdog must refuse unsupported position scope instead of silently
  pretending coverage.

## Review Result

The repository is much cleaner after `TRUTH-A` and `XLIFE-A`, but production
truth is not yet fully closed because DCA/add-leg execution and submitted-order
retry semantics remain weaker than the new canonical lifecycle.

## Recommended Follow-Up Wave

- `REVIEW-B` as a dedicated executor-ready remediation family:
  - DCA lifecycle parity,
  - submitted dedupe non-terminality,
  - deterministic exchange snapshot ownership,
  - watchdog scope truth.
