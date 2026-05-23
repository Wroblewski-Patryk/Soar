# V1 LIVE Mixed-Origin Verification Matrix

Status: Planned
Date: 2026-04-29
Owner: Codex Execution Agent

## Purpose

Freeze one explicit manual verification matrix for `V1 LIVE` lifecycle truth
where position origin and close origin may differ:

- opened on exchange, closed on exchange
- opened on exchange, closed in app
- opened in app, closed on exchange
- opened in app, closed in app

This matrix complements `history/audits/v1excel-manual-verification-matrix-2026-04-29.md`
by expanding the real operator scenarios that require waiting for `DCA`,
`TTP`, and `TSL`.

## Global Preconditions

- one active `LIVE` bot with confirmed ownership of the tested symbol
- one symbol selected for isolation during the scenario run
- exchange account and Soar app both accessible
- bot strategy thresholds known before the run:
  - `DCA` levels
  - `TTP` activation logic
  - `TSL` activation logic
  - `SL` baseline
- operator captures:
  - Soar positions table
  - Soar orders table
  - Soar history table
  - exchange open positions/orders view
  - timestamps for significant actions

## Expected Truth In Every Scenario

- active positions reflect only still-open positions
- pending orders remain in orders until exchange confirms fill or cancel
- imported exchange-managed lifecycle remains attributable to the bot
- history keeps both lifecycle anchors:
  - when opened
  - when closed
- close attribution reflects the real initiator
- after restart/reopen, Soar truth remains the same as before refresh

## Scenario Family A - Exchange-Origin Open

### A1 - Open on exchange, import into app, hold open

1. Open a new position directly on the exchange for a symbol owned by the live bot.
2. Wait for Soar to import and adopt the position.
3. Verify:
   - position appears once in active positions
   - no fake duplicate appears in orders
   - entry side, quantity, and `PnL%` match exchange truth within expected price drift
   - history contains the lifecycle row with truthful `openedAt`

### A2 - Open on exchange, import, then close on exchange

1. Execute `A1`.
2. Close the imported position directly on the exchange.
3. Wait for Soar reconciliation/event truth.
4. Verify:
   - active positions remove the row
   - history records the closed lifecycle
   - history shows both `openedAt` and `closedAt`
   - close attribution is exchange-side, not app-side

### A3 - Open on exchange, import, then close in app

1. Execute `A1`.
2. Close the position from the Soar dashboard.
3. Verify:
   - exchange confirms close
   - Soar active positions clear correctly
   - history records the close with app-side close attribution

## Scenario Family B - App-Origin Open

### B1 - Open in app, hold open

1. Open a new position from the Soar dashboard.
2. Verify:
   - exchange position opens
   - Soar shows the position once
   - orders and history reflect the opening lifecycle truthfully

### B2 - Open in app, close in app

1. Execute `B1`.
2. Close from the Soar dashboard.
3. Verify:
   - exchange close succeeds
   - Soar history preserves open and close lifecycle anchors
   - no orphan active row remains

### B3 - Open in app, close on exchange

1. Execute `B1`.
2. Close manually on the exchange.
3. Wait for Soar to detect external close.
4. Verify:
   - active row disappears
   - history still contains the full lifecycle
   - close attribution is exchange-side

## Scenario Family C - Pending Order Versus Position Truth

### C1 - External DCA order pending

1. Start from one open managed live position.
2. Place an additional same-side DCA order on the exchange that remains pending.
3. Verify:
   - active position size does not inflate before fill
   - pending order appears only in orders
   - history does not treat the pending order as a fill

### C2 - External DCA order fills later

1. Execute `C1`.
2. Wait until the exchange fills the pending order.
3. Verify:
   - position quantity and entry truth update after fill only
   - order leaves open orders
   - history records the add-leg as `DCA`, not generic `OPEN`

## Scenario Family D - Same-Symbol Close/Reopen Continuity

### D1 - Close and reopen on the same symbol

1. Open or import a live position on one symbol.
2. Close it fully.
3. Open a new position on the same symbol.
4. Verify:
   - new lifecycle does not inherit stale `PnL%`
   - `TTP` / `TSL` state from the old lifecycle does not bleed into the new one
   - history shows two distinct lifecycles, not one merged row

## Scenario Family E - Wait-Based Protection Scenarios

### E1 - DCA on loss-side threshold only

1. Use a strategy where remaining `DCA` thresholds are loss-side only.
2. Open or import the position.
3. Wait for price movement toward the loss-side threshold.
4. Verify:
   - `TTP` is not blocked just because loss-side-only `DCA` remains possible
   - `SL` / `TSL` still honor the stricter DCA-first fail-closed contract where applicable

### E2 - TTP activation after profit move

1. Open or import a position with profit-side movement available.
2. Wait until profit conditions arm `TTP`.
3. Verify:
   - dashboard surfaces show `TTP`
   - dynamic stop truth remains visible after pullback
   - close executes if price returns through the armed threshold

### E3 - TSL activation after DCA exhaustion or invalidation

1. Start from a position where DCA has already executed or can no longer apply.
2. Wait for the trailing setup to arm.
3. Verify:
   - `TSL` becomes visible and actionable
   - exchange close occurs when trailing threshold is breached
   - history records the close reason and initiator truthfully

## Scenario Family F - Restart And Recovery

### F1 - Refresh/reopen the dashboard mid-lifecycle

1. During any active scenario above, refresh the dashboard or reopen the app.
2. Verify:
   - active positions, orders, and dynamic stops remain truthful
   - no duplicate position appears
   - imported/manual history continuity remains intact

### F2 - Runtime restart/recovery during managed lifecycle

1. During an active managed position, restart the runtime session if operationally safe.
2. Verify after recovery:
   - active lifecycle truth matches exchange truth
   - pending orders remain pending
   - history retains prior events and does not backfill fake fills

## Evidence To Capture Per Scenario

- tested symbol and market type
- bot id and runtime session id when available
- action origin: `exchange` or `app`
- timestamps:
  - opened
  - imported or observed by Soar
  - order placed
  - filled
  - closed
- Soar screenshots for positions, orders, history
- exchange screenshots for positions/orders history
- API payloads or logs when available
- pass/fail result
- exact drift note if failed

## Exit Rule

`V1 LIVE` operator truth is only claimable when every scenario family above has
either:

- passed with evidence,
- been proven not applicable for the current candidate,
- or been converted into an explicit blocking fix packet with evidence.
