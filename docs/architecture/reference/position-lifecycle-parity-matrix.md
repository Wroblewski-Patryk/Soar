# Position Lifecycle Parity Matrix (Soar Current Version)

Status: canonical contract for lifecycle parity and execution order. The
[current version product contract](../../product/current-version-contract.md)
owns required behavior; the local
[`positionManagement.service.ts`](../../../apps/api/src/modules/engine/positionManagement.service.ts)
and [focused tests](../../../apps/api/src/modules/engine/positionManagement.service.test.ts)
show selected implementation behavior, not whole-cycle PAPER/LIVE acceptance.

## Scope

This matrix defines lifecycle behavior that must be identical across:
- `BACKTEST`
- `PAPER`
- `LIVE`

The [legacy CryptoBot analysis](../archive/legacy-cryptobot-positions-analysis.md)
is historical context for loss-side (negative) DCA only. It is not the authority
for profit-side DCA or the complete current Soar lifecycle.

---

## Global Invariants

- One open position per symbol at a time.
- No direction flip on an already-open symbol.
- Lifecycle checks run in strict deterministic order.
- Event stream (`ENTRY`, `DCA`, `EXIT_*`) is produced by lifecycle engine, not by UI inference.

---

## Canonical Evaluation Order (Per Position, Per Cycle)

1. `DCA` (including DCA affordability check)
2. Close logic by mode:
   - basic mode: `TP -> SL`
   - advanced mode: `TTP -> TSL`
3. `LIQUIDATION` / hard account floor protection

Order is hard contract.

---

## DCA-First Guard (Mandatory)

For current USDT-contribution DCA, guard each protection by the side of the
remaining, unfilled DCA levels:

- Pending loss-side (negative) DCA blocks `SL` and `TSL`. Pending profit-side
  (non-negative) DCA blocks `TP` and `TTP`.
- `TP` or `TTP` may close at a profit while only loss-side DCA remains. `SL` or
  `TSL` may close while only profit-side DCA remains.
- If a reached loss-side DCA cannot be funded and the `SL` threshold is
  breached, `SL` closes the position and the insufficient-funds condition is
  reported. Exhausted funds do not generally release `TTP` or `TSL` while
  their matching-side DCA remains pending.
- An attempted USDT add is only a proposal until its fill is confirmed. Do not
  close using the pre-fill quantity, average entry, or protection price in
  that cycle.

---

## Trigger Matrix

| Step | Activation Gate | Trigger Condition | Side Effect | Reset Rules |
|---|---|---|---|---|
| `DCA` | `dca.enabled=true`, `dcaCount < maxAdds` | Current position pnl fraction crosses next configured DCA level | Propose an add; confirmed fill increases quantity, recalculates average entry, and advances DCA | Clear on open/close |
| `TP` (basic) | `close.mode=basic`, `tp.enabled`, no pending profit-side DCA | Profit reaches TP threshold | Close with `TP` reason | Clear DCA/TTP/TSL on close |
| `SL` (basic) | `close.mode=basic`, `sl.enabled`, no pending loss-side DCA or reached unfunded loss-side DCA | Price reaches SL threshold | Close with `SL` reason; report insufficient funds in the unfunded case | Clear DCA/TTP/TSL on close |
| `TTP` (advanced) | `close.mode=advanced`, `ttp levels active`, no pending profit-side DCA | Profit retraces by active trailing step from high watermark | Close with `TTP` reason | Clear DCA/TTP/TSL on close |
| `TSL` (advanced) | `close.mode=advanced`, `tsl levels active`, no pending loss-side DCA | Trailing-loss condition reached | Close with `TSL` reason | Clear DCA/TTP/TSL on close |
| `LIQUIDATION` | Futures risk boundary crossed | Mark/price breach of liquidation boundary | Force close with `LIQUIDATION` reason | Clear DCA/TTP/TSL on close |

---

## State Contract

Per-symbol runtime state:
- DCA progression (`currentAdds`, levels used)
- trailing anchor (for TTP/TSL)
- trailing loss limit

State reset on:
- position open,
- position close (any reason).

For imported or recovered `LIVE` positions:

- runtime may only use trailing state it actually persisted or safely
  initialized from the adoption point onward
- runtime may not retroactively guess an unseen trailing high watermark from a
  single exchange snapshot
- read models must not present a stronger dynamic `TTP` / `TSL` trigger than
  the runtime engine can execute

---

## Close Attribution Parity

Close parity must remain identical across `BACKTEST`, `PAPER`, and `LIVE` at
the domain-contract level:

- every close writes one canonical `closeReason`
- every close writes one canonical `closeInitiator`

Shared lifecycle examples:

| Scenario | closeReason | closeInitiator |
|---|---|---|
| Automated take-profit by bot | `TP` | `BOT_APP` |
| Automated stop-loss by bot | `SL` | `BOT_APP` |
| Manual close from app | `MANUAL` | `USER_APP` |
| Close detected after external exchange-only action | `EXTERNAL_SYNC_MISSING` | `USER_EXCHANGE` |
| Exchange liquidation | `LIQUIDATION` | `EXCHANGE` |
| Local orphan cleanup/repair | `SYSTEM_REPAIR` | `SYSTEM_REPAIR` |

`BACKTEST` and `PAPER` may not use all initiator variants in normal operation,
but they must still preserve the same contract shape where close attribution is
stored or exposed.

---

## Restart Continuity Parity

`LIVE` restart recovery introduces additional continuity semantics that are not
normal `BACKTEST` or ordinary `PAPER` concerns, but the lifecycle contract
still requires one explicit truth model rather than UI or reconcile guessing.

Canonical `LIVE` restart rules:

- restart does not authorize close
- one missing post-restart snapshot is not equal to closed
- recovered visibility and recovered actionability are separate truths
- exchange-event truth outranks one weak post-restart snapshot
- recovered automation requires canonical owner and strategy context

Shared lifecycle examples:

| Scenario | Required lifecycle truth |
|---|---|
| Position existed before restart and still exists on exchange | continuity preserved; position remains visible or recoverable, not closed |
| First post-restart snapshot misses position once | explicit recovery / uncertainty state, not final external close |
| Repeated stronger proof shows position disappeared during downtime | external close classification with canonical attribution |
| Position is recovered but strategy context is unresolved | visible but fail-closed for DCA/TSL/close automation |
| Position is recovered with deterministic bot, wallet, and strategy truth | may return to canonical managed lifecycle |

---

## Shared Engine Contract

Backtest, paper, and live must call one shared lifecycle decision engine with identical inputs:
- side,
- current price context,
- current position pnl fraction,
- strategy close config,
- DCA config,
- leverage/margin mode and canonical margin basis,
- reached DCA side and its affordability/funds-exhausted state.

Canonical margin-basis authority by mode:

- `BACKTEST`: modeled margin from simulated entry, quantity, and leverage
- `PAPER`: modeled margin from canonical paper position state
- `LIVE`: exchange-synced `marginUsed` when canonical truth is available;
  otherwise explicit modeled-margin fallback until stronger exchange truth
  arrives

Adapters may differ in price source and execution layer, but decision
semantics must be identical.

---

## Required Verification

- Unit tests for side-specific `TP`/`TTP` and `SL`/`TSL` guards, plus the
  reached, unfunded loss-side DCA exception for `SL` only.
- Parity tests ensuring same close reason for identical candle/price sequence in:
  - replay/backtest engine,
  - runtime paper/live engine.
- A durable PAPER cycle with DCA and a durable mock LIVE order/fill cycle;
  presence of focused unit tests does not establish these end-to-end proofs.
- UI parity checks: chart markers and counters must reflect lifecycle events only.
