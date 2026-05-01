# V1DOGE Live Close And Reopen Audit

Date: 2026-05-01  
Scope: `LIVE` `DOGEUSDT` close at loss and stale DCA state after reopen  
Stage: planning/audit only

## Executive Summary

The reported `DOGEUSDT` loss close was an app-side automated close, not a user
app close and not an external exchange/manual close. The closed position
`d06cd442-1249-4b3f-b46e-7bc69e1355c0` was closed by `BOT_APP` with
`closeReason=TSL` at `2026-05-01T01:42:47.177Z`, with realized PnL
`-0.3500250000000007 USDT`.

The newly reopened `DOGEUSDT` row then showed stale DCA truth from the previous
lifecycle. The current open position
`eb03eb65-d3d2-4100-9368-04ed57372983`, opened at
`2026-05-01T01:50:55.213Z`, has only its own open anchor in the current
lifecycle, but the runtime `Positions` read model returned `dcaCount=2`,
`dcaExecutedLevels=[-20,-40]`, and `tradesCount=3`. That is a confirmed
read-model lifecycle-continuity bug.

The close itself requires a second implementation audit/fix before it can be
called safe: the engine is supposed to block `TSL` and `SL` while pending DCA is
still financially possible. Therefore this `TSL` close could only have been
valid if runtime had safely proven DCA was exhausted or unavailable. Current
operator surfaces do not show that proof, and the production trail is
ambiguous enough that the live-money path must be hardened.

## Production Facts

### Deployed Build

Production build-info still reported deployed SHA
`8db496373763d3a1fa58b15dc1dffa8268f3fe5f` on `main` during this audit.
This means production did not yet include the later local commit
`8580ea4e fix(api): count DCA across position replacements`.

That freshness gap explains part of the previous DCA visibility drift, but it
does not fully explain the app-side `TSL` close. The runtime close path must be
audited and fixed independently.

### Bot, Wallet, And Venue

- Bot: `50a15ab3-b89c-45d1-8dcb-29bc103349d8`
- Name: `live`
- Mode: `LIVE`
- Exchange: `BINANCE`
- Market type: `FUTURES`
- Position mode: `ONE_WAY`
- Wallet: `e8681471-a2e7-444d-aa16-e14d0fc5849d`
- Wallet mode: `LIVE`
- Wallet market: `BINANCE FUTURES`
- Allocation: `100%`
- Strategy: `3264841b-1efa-4a70-a8e9-b6cfa9ec1384`
- Symbol group: `BNBUSDT`, `DOGEUSDT`, `ETHUSDT`, `XRPUSDT`

### Strategy Values

The active strategy is `RSI 20 / 80`, interval `5m`, leverage `15`, wallet risk
`2`.

Open rules:

- Direction: both
- Long: `RSI(14) < 20`
- Short: `RSI(14) > 80`

Close rules:

- Close mode: `advanced`
- Basic TP: `3`
- Basic SL: `2`
- TTP levels:
  - arm `5`, trail `10`
  - arm `10`, trail `20`
  - arm `20`, trail `40`
  - arm `40`, trail `80`
- TSL:
  - loss start `-20`
  - recovery step `10`

Additional rules:

- DCA enabled: yes
- DCA mode: `advanced`
- DCA levels:
  - `-20`, multiplier `1`
  - `-40`, multiplier `1`
  - `-60`, multiplier `1`
- Order lifetime: `10 min`
- Position lifetime: `0 d`
- Margin mode: `ISOLATED`
- Max orders: `10`
- Max positions: `10`

Interpretation:

- `positionLifetime=0` must mean no position time-based close.
- `close.mode=advanced` means advanced `TTP` and `TSL` drive close behavior;
  basic `tp/sl` should not be used as active close authority for this strategy.
- `TSL percent=-20 / arm=10` is loss-side trailing: arm once loss reaches
  `-20%`, then close only according to the recovery-step semantics frozen in
  `V1SAFE-14`.
- `TSL` and `SL` must remain blocked while the next DCA level is still valid
  and financially possible.

## DOGEUSDT Lifecycle Timeline

All times are UTC.

| Time | Lifecycle | Position | Side | Quantity | Price | Source |
| --- | --- | --- | --- | ---: | ---: | --- |
| 2026-05-01T00:00:04.270Z | OPEN | `a132...` | SELL | 75 | 0.10589 | EXCHANGE_SYNC |
| 2026-05-01T00:18:37.400Z | DCA #1 | `a132...` | SELL | 75 | 0.10738 | BOT |
| 2026-05-01T00:18:36.503Z | OPEN replacement | `e934...` | SELL | 150 | 0.106635 | EXCHANGE_SYNC |
| 2026-05-01T01:05:20.250Z | DCA #2 | `e934...` | SELL | 150 | 0.10814 | BOT |
| 2026-05-01T01:05:19.346Z | OPEN replacement | `d06...` | SELL | 300 | 0.1073875 | EXCHANGE_SYNC |
| 2026-05-01T01:42:50.861Z | CLOSE | `d06...` | BUY | 300 | 0.1085 | BOT / TSL |
| 2026-05-01T01:50:55.213Z | NEW OPEN | `eb03...` | SELL | 70 | 0.10867 | EXCHANGE_SYNC |

The incident close:

- Position id: `d06cd442-1249-4b3f-b46e-7bc69e1355c0`
- Close reason: `TSL`
- Close initiator: `BOT_APP`
- Action reason: `TRAILING_STOP`
- Realized PnL: `-0.3500250000000007`
- Fees on close trade: `0.016275`

The new open row:

- Position id: `eb03eb65-d3d2-4100-9368-04ed57372983`
- Opened at: `2026-05-01T01:50:55.213Z`
- Runtime `Positions` response showed `dcaCount=2`
- Runtime `Positions` response showed `dcaExecutedLevels=[-20,-40]`
- This is wrong for a fresh lifecycle unless the exchange/bot executed new DCA
  fills after `01:50:55Z`, which the inspected trade list did not show.

## Code Findings

### 1. Close Path Drops Strategy Identity

`RuntimePositionAutomationService` calls `closeByExitSignal` without passing
`position.strategyId`. The close trade is therefore created with a nullable or
missing strategy id even when the position itself has one.

Impact:

- The read model uses strategy identity to split same-symbol lifecycle windows.
- A close row without strategy id may fail `tradeBelongsToRuntimePositionIdentity`.
- If the close row is not recognized as the latest exit before a reopened
  position, stale DCA rows before the close can leak into the new open
  lifecycle.

This matches the production symptom: the fresh `eb03...` open row inherited the
old two DCA fills.

Required fix:

- Pass `strategyId: position.strategyId ?? undefined` into the close execution
  path.
- Ensure close `Order` and close `Trade` preserve strategy id for bot-managed
  strategy closes.
- Add a regression where a same-symbol close trade has strategy attribution and
  the next open starts with `dcaCount=0`.

### 2. Read-Model Continuity Is Too Dependent On Close Trade Strategy Identity

`runtimeSessionPositionsRead.service.ts` computes continuity start from
same-identity lifecycle trades. Because identity matching requires strategy id
when `position.strategyId` exists, a close trade with null strategy id may not
be used as the cutoff.

Impact:

- Old DCA rows can be considered supplemental DCA for a new open row.
- Operator sees stale DCA state on a new position.

Required fix:

- Keep strict strategy identity for scoped DCA attachment, but make lifecycle
  cutoff robust to canonical close rows linked directly to the previous
  position or carrying matching bot/wallet/symbol/side attribution even when a
  legacy close trade is missing strategy id.
- Add a backwards-compatible regression for existing production-like data where
  close trade strategy id is null.

### 3. `TSL` Close Can Only Pass Through DCA Completion Or Funds Exhaustion

`positionManagement.service.ts` enforces:

- DCA first
- then TP
- then TTP
- then SL
- then TSL

For `SL` and `TSL`, the relevant guard is `dcaProtectionSatisfied`, which is
true only when:

- DCA is disabled or completed, or
- `dcaFundsExhausted=true`

Therefore, the `DOGEUSDT` `TSL` close means runtime believed one of these was
true. The strategy still had three configured DCA levels and the observed
ledger showed only two executed DCA fills before the close. That leaves the
high-risk possibilities:

- runtime DCA state was wrong or stale,
- runtime treated the remaining DCA as financially exhausted,
- runtime was evaluating a replacement/imported position without hydrated DCA
  progression,
- or production was on an older code path than the latest local expectations.

Required fix:

- Add explicit runtime event payloads whenever `dcaFundsExhausted` unlocks
  `SL` or `TSL`.
- Store or expose the evaluated protection decision snapshot:
  `currentAdds`, `dcaLevelCount`, `nextDcaLevel`, `estimatedAddedQuantity`,
  `requiredMargin`, `freeCash`, `dcaFundsExhausted`, `closeReason`.
- Add tests proving `TSL` cannot close while pending DCA is valid and
  affordable.
- Add tests proving `TSL` may close only when pending DCA is exhausted and that
  the exhausted reason is visible.

### 4. Production UI Did Not Show TSL Runtime Truth

The close was executed as `TSL`, but the operator did not see TSL armed or
explained. The current open row also returns `dynamicTslStopLoss=null`.

Required fix:

- Runtime and read models must expose protection status distinctly:
  - configured levels
  - runtime state present
  - prospective state
  - degraded/unavailable state
  - DCA funds exhausted unlocking `SL/TSL`
  - close pending or protection breached
- The dashboard must not hide the difference between "not armed", "armed but
  not serialized", and "armed/closed already".

### 5. Basic vs Advanced Needs Locked Coverage

The active strategy uses `close.mode=advanced`. Basic `tp=3` and `sl=2` are
present in config but should not override the advanced close contract.

Required coverage:

- `close.mode=basic`:
  - use basic TP/SL
  - ignore advanced TTP/TSL for execution
- `close.mode=advanced`:
  - use advanced TTP/TSL
  - do not close from basic TP/SL
  - preserve DCA-first guard

### 6. Futures Market Source Must Stay Exact

The bot and wallet are `BINANCE + FUTURES`. Runtime code compares ticker event
`exchange` and `marketType` before processing a position, and fallback reads
select futures endpoints when `marketType=FUTURES`.

Residual risk:

- Some connector naming still uses generic `fetchMarkPrice` or CCXT ticker
  `last`, which must be proven not to hit spot endpoints under futures bot
  context.

Required coverage:

- `LIVE FUTURES` strategy signals load Binance futures klines.
- `LIVE FUTURES` runtime lifecycle prices use futures ticker/mark-price source.
- fallback ticker prices use `/fapi` futures endpoints.
- `SPOT` and `FUTURES` cannot share cache keys or fallback prices for the same
  symbol.

## Required Repair Plan

### V1DOGE-02: Runtime Close/Reopen Lifecycle State Fix

Goal:

- Stop stale DCA/protection state from crossing a closed same-symbol lifecycle
  into a new open lifecycle.
- Preserve strategy id on bot-managed close orders/trades.
- Make the read-model cutoff robust for legacy close rows that already lack
  strategy id.

Acceptance:

- Fresh same-symbol reopen after a bot `TSL` close shows `dcaCount=0`.
- Previous lifecycle keeps its own DCA history.
- Close trade keeps `strategyId`.
- Existing legacy close rows without strategy id still cut off old DCA for new
  opens when position/bot/wallet/symbol/side chronology proves the boundary.

### V1DOGE-03: DCA-First Close Authority Matrix

Goal:

- Prove every close authority obeys configured DCA state and affordability.

Acceptance:

- `SL` blocked while next DCA is valid and affordable.
- `TSL` blocked while next DCA is valid and affordable.
- `TTP` blocked only when remaining DCA contains profit-side thresholds.
- `TTP` may close when remaining DCA thresholds are loss-side only.
- `SL` and `TSL` may close when DCA is completed or explicitly exhausted.
- `dcaFundsExhausted` decisions are operator-visible.

### V1DOGE-04: Basic/Advanced Strategy Option Parity

Goal:

- Lock exact behavior of every strategy switch and value used by the operator.

Acceptance:

- Basic close mode uses only basic TP/SL.
- Advanced close mode uses only advanced TTP/TSL for trailing semantics.
- Advanced DCA levels preserve exact percentages and multipliers.
- `dcaTimes`, `dcaLevels`, and `dcaMode` do not conflict silently.
- `positionLifetime=0` cannot close a position.
- `orderLifetime=10 min` affects orders only, not open positions.

### V1DOGE-05: Futures-Only Market Data And Wallet Authority

Goal:

- Prove `BINANCE + FUTURES` bots never evaluate strategy, lifecycle, DCA, or
  PnL from spot market data.

Acceptance:

- Futures bot signal klines use futures data.
- Futures bot lifecycle prices use futures ticker/mark data.
- Futures wallet balance reads use futures account balance.
- Spot/futures cache keys are isolated.
- Tests fail if a futures bot reads spot fallback data for `DOGEUSDT`.

### V1DOGE-06: Operator Decision Trail

Goal:

- Give the user a clear explanation for every runtime close decision.

Acceptance:

- Every automated close has a persisted decision snapshot.
- Dashboard history can show why a close happened:
  - close authority
  - evaluated PnL
  - DCA state
  - next DCA requirement
  - funds available or exhausted
  - protection state
- If runtime cannot prove the close authority, it must not close.

## Immediate Recommendation

Treat `V1DOGE-02` and `V1DOGE-03` as P0 before further real-money runtime
trust claims. Until those are implemented and deployed, the safest operational
posture is to consider app-side advanced `TSL` decisions on imported/replaced
LIVE futures positions not sufficiently explainable.

No hidden bypass should be added. The fix should strengthen the existing
canonical lifecycle/protection contracts.

## 2026-05-01 Local Implementation Closure

Task:

- `docs/planning/v1doge-02-runtime-close-reopen-hardening-task-2026-05-01.md`

Implemented:

- Runtime automated closes now pass `strategyId` through
  `runtimePositionAutomation` into the existing execution orchestrator, so new
  bot-managed close orders/trades retain strategy identity.
- Runtime `Positions` continuity now uses same bot/wallet/symbol lifecycle
  close boundaries to cut off stale DCA for fresh same-symbol opens, while
  strict current-lifecycle matching still governs supplemental DCA attachment.
  This handles legacy close rows that already lack `strategyId` without
  allowing unrelated strategy DCA rows to attach.
- `SL` and `TSL` close authority now has focused DCA-first regression coverage:
  pending affordable DCA blocks the close; explicit DCA funds exhaustion allows
  protections to execute.
- Runtime telemetry now records:
  - `PRETRADE_BLOCKED` when the next DCA level is explicitly funds-exhausted.
  - `SIGNAL_DECISION` before an automated protection close, with
    `positionId`, close reason, current DCA count, DCA level count, DCA funds
    exhaustion flag, estimated next DCA quantity, mark price, leverage, and
    current PnL fraction.

Validation:

- `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts`
- `pnpm --filter api exec vitest run src/modules/engine/positionManagement.service.test.ts`
- `pnpm --filter api exec vitest run src/modules/bots/bots.runtime-imported-dca-visibility.e2e.test.ts`
- `pnpm --filter api exec vitest run src/modules/engine/runtimeSignalMarketDataGateway.test.ts`

Residual production requirement:

- After deployment, run protected production verification against the active
  `DOGEUSDT`/same-symbol lifecycle payload and runtime events. Local closure is
  not a substitute for deployed-candidate evidence on the live-money path.
