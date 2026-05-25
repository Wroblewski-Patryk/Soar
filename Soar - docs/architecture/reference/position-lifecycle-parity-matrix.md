# Position Lifecycle Parity Matrix (CryptoBot -> CryptoSparrow)

Status: canonical contract for lifecycle parity and execution order.

## Scope

This matrix defines lifecycle behavior that must be identical across:
- `BACKTEST`
- `PAPER`
- `LIVE`

Reference deep-dive:
- [Legacy CryptoBot Positions Module - Deep Analysis](../archive/legacy-cryptobot-positions-analysis.md)

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

If there are pending DCA levels and next DCA is still financially possible:
- `TSL` and `SL` must not close the position yet.
- `TTP` must not close while any remaining DCA threshold is on the profit side
  (`>= 0` current position pnl fraction threshold).
- `TTP` may close if all remaining DCA thresholds are loss-side only, because
  those levels do not represent pending profit-side continuation.

If pending DCA exists but next DCA is not affordable:
- close protections may execute (`TTP`/`TSL`/`SL`) to avoid uncontrolled loss.

This is required for parity with expected strategy semantics in CryptoSparrow.

---

## Trigger Matrix

| Step | Activation Gate | Trigger Condition | Side Effect | Reset Rules |
|---|---|---|---|---|
| `DCA` | `dca.enabled=true`, `dcaCount < maxAdds` | Current position pnl fraction crosses next configured DCA level | Increase quantity and recalc average entry; increment DCA count | Clear on open/close |
| `TP` (basic) | `close.mode=basic`, `tp.enabled` | Profit reaches TP threshold | Close with `TP` reason | Clear DCA/TTP/TSL on close |
| `SL` (basic) | `close.mode=basic`, `sl.enabled`, DCA-first guard allows close | Price reaches SL threshold | Close with `SL` reason | Clear DCA/TTP/TSL on close |
| `TTP` (advanced) | `close.mode=advanced`, `ttp levels active`, DCA-first guard allows close for remaining profit-side DCA only | Profit retraces by active trailing step from high watermark | Close with `TTP` reason | Clear DCA/TTP/TSL on close |
| `TSL` (advanced) | `close.mode=advanced`, `tsl levels active`, DCA-first guard allows close | Trailing-loss condition reached | Close with `TSL` reason | Clear DCA/TTP/TSL on close |
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
- affordability flag for next DCA.

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

- Unit tests for DCA-first guard, profit-side-vs-loss-side `TTP` gating, and
  affordability exception.
- Parity tests ensuring same close reason for identical candle/price sequence in:
  - replay/backtest engine,
  - runtime paper/live engine.
- UI parity checks: chart markers and counters must reflect lifecycle events only.
