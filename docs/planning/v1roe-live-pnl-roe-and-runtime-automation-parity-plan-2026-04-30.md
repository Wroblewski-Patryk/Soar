# V1ROE-A - LIVE PnL / ROE Truth And Imported Automation Parity

Status: active  
Date: 2026-04-30  
Owner: Codex Planning Agent

## Why This Exists

Fresh authenticated production verification on `DOGEUSDT` exposed that two
different problems are currently overlapping and can look like one regression:

1. operator-visible `PnL %` in Soar is not the same metric as the percentage
   shown on Binance Futures,
2. imported/reopened `LIVE` position automation appears stale enough that
   `DCA` / `TTP` do not react even when Soar's own current leveraged move would
   already cross configured thresholds.

Both must be separated before implementation, otherwise the repository risks
mixing an architecture decision with a narrower runtime bugfix.

## Confirmed Current Evidence

### A. Soar `PnL %` is currently based on modeled entry margin, not exchange ROE

Current runtime/dashboard derivation uses:

- `marginUsed = entryNotional / leverage`
- `livePnlPct = unrealizedPnl / marginUsed * 100`

This is implemented in:

- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.ts`
- `apps/api/src/modules/bots/runtimePositionSerialization.service.ts`

This explains why a `LIVE SHORT` can show roughly `-67%` in Soar while Binance
shows roughly `-19%` if the exchange position currently carries more real
isolated margin than the simple `entryNotional / leverage` model.

### B. The exchange snapshot boundary already knows more margin truth than runtime surfaces expose

`positions.service.ts` already normalizes exchange fields such as:

- `initialMargin`
- `positionInitialMargin`
- `isolatedMargin`
- `isolatedWallet`

This proves the repository already has one approved source for exchange-side
margin truth, but that truth currently does not propagate into the canonical
runtime open-position read model used by dashboard and monitoring surfaces.

### C. Current `LIVE DOGEUSDT` automation appears stale beyond the percent semantics mismatch

Authenticated production evidence for session
`d5d250f0-04c3-4845-a74f-c5c01d37068c` shows:

- `DOGEUSDT` is open, `BOT_MANAGED`, `CONFIRMED`, and `actionable=true`
- configured `DCA` ladder is present: `[-25, -45, -60]`
- configured trailing levels are present
- `dynamicTtpStopLoss` and `dynamicTslStopLoss` remain `null`
- `dcaCount = 0`
- current open row uses `entryPrice=0.10185`, `markPrice=0.10645`,
  `unrealizedPnl=-0.2438`, `leverage=15`

Under current lifecycle semantics, that already implies an adverse leveraged
move well beyond `-25%`, so `DCA` should not remain idle forever if runtime is
processing fresh market events for this position.

Additional stale-runtime evidence:

- current-session `symbol-stats` row for `DOGEUSDT` stays anchored to the
  reopen/import moment
- `lastSignalContextSource` is only `configured_fallback`
- `lastSignalDecisionAt` is `null`
- no fresh runtime telemetry proves DCA/close evaluation after the reopen

This strongly suggests a second bug: imported/reopened `LIVE` position
automation continuity is not fully reattached to fresh runtime market truth.

## Approved Product Direction

On 2026-04-30 the user approved one shared lifecycle direction:

- operator-visible `PnL %` must align with exchange truth in `LIVE`
- `DCA/TTP/TSL` must not use a different hidden percentage semantics than the
  operator-visible lifecycle truth
- one shared lifecycle engine remains canonical across `BACKTEST`, `PAPER`,
  and `LIVE`
- `BACKTEST` and `PAPER` keep modeled margin semantics
- `LIVE` uses exchange-synced margin truth whenever canonical `marginUsed`
  exists, and only then falls back to modeled margin

This means the repository is not splitting into a second exchange-only
decision engine. It is moving to one shared `current position pnl fraction`
contract with mode-specific margin-basis authority.

## Architecture Mismatch That Required Explicit User Decision

The current approved lifecycle architecture defines `DCA`, `TTP`, and `TSL`
thresholds as leveraged move thresholds, not as exchange UI ROE.

References:

- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`

So if the product target becomes:

- primary operator `PnL %` must match exchange ROE semantics,
- and bot decisions must use the same exchange ROE semantics,

then this is an architecture change, not just a UI bugfix.

## Valid Options

### Option 1. Keep lifecycle thresholds on leveraged move, but fix operator truth and runtime staleness

Scope:

- keep `DCA/TTP/TSL` engine semantics unchanged
- add explicit exchange-margin / ROE truth to `LIVE` open-position read models
- make operator UI show exchange-aligned percent as primary truth
- optionally show internal strategy percent as secondary/debug truth
- fix imported/reopened `LIVE` automation so DCA/TTP actually process fresh
  market events again

Pros:

- smallest risk to current backtest/paper/live parity contract
- closes the obvious operator truth drift
- fixes the real automation bug without redefining strategy semantics

Cons:

- operator will see two possible meanings of “percent” unless labeling is very
  explicit
- bot thresholds still will not mean the same thing as Binance UI ROE

### Option 2. Migrate the lifecycle contract to exchange-style ROE semantics

Scope:

- redefine `DCA/TTP/TSL` thresholds from leveraged move to actual margin/ROE
- propagate real margin truth across backtest, paper, and live
- update architecture contracts, engine logic, UI, tests, and migration notes

Pros:

- one shared semantics between Soar operator percent and exchange UI percent
- strategy triggers become easier to reason about relative to the exchange

Cons:

- this is a larger architecture change
- parity impact across `BACKTEST`, `PAPER`, and `LIVE`
- higher risk of unintended strategy behavior changes

### Option 3. Hybrid model

Scope:

- primary operator UI percent follows exchange ROE
- lifecycle engine keeps current leveraged-move thresholds
- imported/reopened `LIVE` automation continuity is fixed
- UI labels the decision metric separately where needed

Pros:

- lowest product risk while still aligning the main operator truth with the
  exchange

Cons:

- the product keeps two different percentage semantics
- requires very explicit labeling to avoid confusion

## Recommended Direction

Recommendation: **Option 1 or Option 3**.

Reason:

- there is already independent evidence of a real imported/reopened `LIVE`
  automation continuity bug,
- and changing lifecycle thresholds to exchange ROE in the same wave would mix
  two risks together.

## Planned Implementation Slices After Decision

### V1ROE-01

Freeze the chosen semantics in architecture and planning docs.

### V1ROE-02

Lock API/runtime contract coverage for:

- `runtime-sessions/:id/positions` returning canonical `marginUsed`
- `runtime-sessions/:id/positions` returning canonical
  `unrealizedPnlPercent`
- one explicit proof that `LIVE` read truth uses persisted margin basis rather
  than the old modeled-margin shortcut when those values differ

### V1ROE-03

Repair isolated-futures exchange margin normalization so `LIVE` uses the same
real margin basis the operator sees on the exchange when extra isolated margin
has been added to the position.

### V1ROE-04

Run focused prod-faithful verification for:

- operator `PnL %` truth
- DCA execution
- TTP/TSL visibility and execution after reopen/import

## Implementation Progress

### 2026-04-30 - first closure slice

Closed in code:

- `Position.marginUsed` now persists canonical exchange-synced margin basis for
  `LIVE`
- exchange snapshot normalization and reconciliation now carry that truth into
  managed `LIVE` positions
- runtime lifecycle evaluation now accepts one canonical
  `current position pnl fraction`, so `LIVE` can evaluate `DCA/TTP/TSL` on
  exchange-style margin truth while `PAPER` and `BACKTEST` keep modeled-margin
  parity
- runtime/read-model/dashboard surfaces now expose `marginUsed` and
  `unrealizedPnlPercent` so operator-visible `PnL %` stays aligned with the
  same canonical basis

Still open:

- red-lock coverage proving the `runtime positions` API contract cannot drop
  `marginUsed` or `unrealizedPnlPercent` silently
- fresh protected production verification on the affected `DOGEUSDT` flow
- remaining `V1EXCEL-03` manual-matrix evidence for mixed-origin `LIVE`
  scenarios and restart/recovery proof

### 2026-04-30 - isolated margin normalization slice

Closed in code:

- exchange snapshot normalization for isolated futures positions now prefers
  `isolatedWallet` over `initialMargin`-style fields when deriving canonical
  `marginUsed`
- focused unit coverage locks both branches: isolated positions use isolated
  wallet margin truth, non-isolated positions keep initial-margin precedence

Still open:

- fresh protected production verification on the affected `DOGEUSDT` flow
- remaining `V1EXCEL-03` manual-matrix evidence for mixed-origin `LIVE`
  scenarios and restart/recovery proof
