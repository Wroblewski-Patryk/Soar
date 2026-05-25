# Execution Lifecycle Parity Contract

Status: Active  
Updated: 2026-04-22

## Purpose

Freeze one canonical execution and position lifecycle for Soar so `PAPER` and
`LIVE` differ only at the external execution boundary, not in domain flow.

This contract exists to stop the recurring drift where:

- runtime treats signal `markPrice` as execution truth,
- local position state closes before live exchange fill truth is known,
- `PAPER` and `LIVE` duplicate lifecycle logic instead of sharing one state
  machine,
- Binance-only runtime assumptions remain hidden behind generic exchange
  semantics.

## Product Intent

For V1:

- `LIVE` must work on the exchange without silent lifecycle errors.
- `PAPER` must behave like the same bot lifecycle, except exchange checks and
  exchange fills are satisfied by a synthetic fill adapter.
- position management, DCA, TP, SL, trailing, exit handling, and reporting must
  follow one shared lifecycle authority.

## Non-Negotiable Rules

1. One position lifecycle authority must govern both `PAPER` and `LIVE`.
2. Fill truth must come from canonical fill data, not from signal `markPrice`.
3. Position open and close state changes must happen only after canonical fill
   authority confirms them.
4. `PAPER` may bypass exchange I/O, but it may not bypass lifecycle semantics.
5. Exchange-specific scope must be explicit everywhere it is still limited.
6. Closure requires red/green regression locks for the risky paths.

## Canonical Lifecycle

### Shared Domain Stages

1. signal or operator intent is accepted
2. execution request is normalized
3. order is submitted through an execution adapter
4. fill truth is resolved through a canonical fill result
5. order lifecycle authority applies state transition
6. position lifecycle authority mutates open, add, reduce, or close state
7. trade ledger and runtime telemetry are written from canonical fill truth
8. post-fill automation and reconciliation continue from the same domain state

### PAPER vs LIVE Boundary

- `PAPER`:
  - uses synthetic fills through the same fill-result contract
  - skips external exchange credential and network interaction
  - must still pass through order submission, fill resolution, position
    mutation, and trade-ledger stages in the same order
- `LIVE`:
  - uses authenticated exchange execution and fill reconciliation
  - must not mark order, trade, or position state as final before canonical
    fill truth exists

### Shared Execution Request Contract

Every runtime execution path that enters the canonical lifecycle must normalize
to one request shape with:

- actor scope: `userId`, optional `botId`, optional `walletId`,
- strategy/runtime scope: optional `strategyId`, optional `runtimeSessionId`,
- market scope: `symbol`, `side`, `type`, `mode`,
- execution intent: `quantity`, optional reference `markPrice`,
- lifecycle ownership: runtime-origin commands must persist with `origin=BOT`.

The normalized request may differ at the adapter boundary only in how fills are
obtained, not in what the downstream lifecycle expects.

### Shared Canonical Fill Result Contract

Both `PAPER` and `LIVE` must hand the lifecycle the same canonical fill-result
shape:

- `status`: `OPEN`, `PARTIALLY_FILLED`, or `FILLED`,
- `positionId` when an open fill has already materialized a position,
- `averageFillPrice` and/or canonical execution `price`,
- `filledQuantity`,
- canonical fee fields (`fee`, `feeSource`, `feePending`, `feeCurrency`,
  `effectiveFeeRate`),
- optional exchange-native identifiers such as `exchangeTradeId`.

If this contract is not complete enough to finalize a lifecycle stage, the
system must remain explicitly `submitted` or pending rather than synthesizing a
final state.

## Canonical Truth Rules

### Fill Truth

- `averageFillPrice`, `filledQuantity`, `exchangeTradeId`, fill fees, and fill
  timestamps are canonical execution truth when present.
- signal `markPrice` may be used for pre-trade checks, previews, and fallback
  diagnostics only.
- signal `markPrice` must not be the authority for:
  - persisted trade price,
  - realized PnL,
  - final close price,
  - position entry price when real fill truth exists.

### Position Truth

- `OPEN` position creation requires canonical fill truth.
- `CLOSED` position transition requires canonical close fill truth.
- confirmed add-fills on an already open position require canonical position
  add-update truth from the fill path itself.
- submitted or partially-filled close orders must keep local position state
  unresolved until closure truth is confirmed.
- if closure truth is unresolved, the system must remain explicitly pending
  rather than pretending the position is closed.

### Trade and Telemetry Truth

- trade ledger entries must use canonical fill price and quantity.
- trade lifecycle semantics must distinguish initial `OPEN` from add-leg `DCA`
  when an existing position receives additional entry quantity.
- DCA, hard `TP`/`SL`, and advanced `TTP`/`TSL` must follow
  `position-management-pnl-lifecycle-contract.md`, including positive and
  negative DCA lanes, DCA-first close gating, unaffordable-DCA policy behavior,
  and monotonic trailing protection.
- realized PnL must be computed from canonical entry and exit fill truth plus
  canonical fees.
- runtime telemetry may display signal/reference price, but must not confuse it
  with execution price.
- runtime-generated orders, positions, and trades must preserve bot ownership
  truth via `origin=BOT` instead of falling back to user/manual ownership.
- fail-closed money-impacting runtime skips must become canonical operator
  telemetry, not only local console diagnostics.

### LIVE Futures Lifecycle-Price Truth

- `LIVE FUTURES` lifecycle-price evaluation must prefer futures mark price when
  the approved stream boundary provides it.
- ticker `lastPrice` and recent candle close remain explicit degraded fallbacks,
  not equal-priority truth sources.
- callers must reuse one shared lifecycle-price resolver seam instead of
  embedding their own futures-price hierarchy.

### Account Update Scope Truth

- exchange account-update reconciliation is a confirmation/repair input, not a
  broad rewrite authority over all open rows sharing one `userId + symbol +
  side`.
- when canonical ownership scope is ambiguous, the system must fail closed and
  avoid mutating multiple candidate rows.

## Exchange Scope Truth

- if runtime scan, automation, reconciliation, or snapshot flows are still
  Binance-only in V1, that scope must be explicit in code and docs.
- no service may accept broad exchange semantics and silently synthesize
  `BINANCE` as truth.
- future exchange expansion must extend the same lifecycle boundary, not fork a
  second lifecycle path.
- the runtime scan watchdog is intentionally Binance-scoped today and must
  declare that scope in its contracts instead of pretending to be generic.

## Required Task Packet Content

Every task in this remediation family must define:

- exact lifecycle risk being removed,
- exact files and modules in scope,
- predecessor dependencies,
- explicit non-goals,
- acceptance criteria,
- required validation commands,
- required docs/context sync outputs.

If a task mixes lifecycle authority, exchange scope truth, and UI surface work
without a tight boundary, it must be split first.

## Forbidden Patterns

- closing a local position before live close fill truth is confirmed
- computing persisted realized PnL from signal `markPrice` when fill truth
  exists or should exist
- writing runtime trades with signal `markPrice` instead of canonical fill
  price
- implementing separate position-flow semantics for `PAPER` and `LIVE`
- letting backtest, paper, and live disagree on DCA-first PnL lifecycle
  behavior or trailing ratchet semantics
- generic runtime or watchdog exchange contracts that still hardcode
  `BINANCE`
- regression tests that only cover happy-path `FILLED` flows while omitting
  pending and partial live transitions

## Required Closure Outputs

This remediation family is only closed when all of the following exist and
agree:

- detailed plan under `docs/planning/`
- active queue state in `docs/planning/mvp-next-commits.md`
- mirrored phase state in `docs/planning/mvp-execution-plan.md`
- synchronized `.codex/context/TASK_BOARD.md`
- synchronized `.codex/context/PROJECT_STATE.md`
- focused validation evidence under `docs/operations/`
- updated architecture/module docs for changed lifecycle or exchange-scope
  truth
