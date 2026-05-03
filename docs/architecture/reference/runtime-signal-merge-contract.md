# Runtime Signal Merge Contract (Post-V1 BOTMULTI)

Status: canonical, refreshed for `BOTMULTI-01` on 2026-05-03.

## Purpose
Define deterministic action resolution when multiple strategies attached to one
bot market-group emit conflicting signals for the same symbol and evaluation
window.

## Scope
- Applies to runtime modes: `BACKTEST`, `PAPER`, `LIVE`.
- Resolution unit: `(botId, botMarketGroupId, symbol, intervalWindow)`.
- Strategy output domain: `LONG | SHORT | EXIT | NO_TRADE`.

## Preconditions
- Runtime evaluates only enabled entities:
  - enabled bot
  - exactly one enabled active bot market-group for the selected bot
  - enabled market-group strategy links
- Signal timestamps are normalized to one interval window.
- All signals in one resolution unit are evaluated in one merge pass.

## Hard Guardrails (executed before merge)
1. Kill switch active -> forced `NO_TRADE`.
2. Symbol is externally/manual managed and not delegated to bot -> forced `NO_TRADE`.
3. No-flip rule:
   - if open `LONG`, ignore all `SHORT` opens until close.
   - if open `SHORT`, ignore all `LONG` opens until close.
4. Global/bot/group risk caps breached -> forced `NO_TRADE` or forced `EXIT` (if required by risk policy).

## Deterministic Merge Order
1. `EXIT` priority:
   - if any enabled strategy emits `EXIT`, choose `EXIT`.
   - tie-break for `EXIT` metadata uses lowest numeric `priority`, then lowest
     `strategyLinkId`.
2. Directional vote:
   - compute weighted score for `LONG` and `SHORT`:
     - `directionScore = sum(link.weight)` over strategies voting this direction.
   - if one direction score is greater and passes `minDirectionalScore`, choose that direction.
3. Tie / weak consensus:
   - if scores are equal or winner is below threshold -> `NO_TRADE`.

## Tie-Break Rules
Order is always deterministic:
1. Lower numeric `priority` wins. `1` is higher priority than `100`.
2. If same priority, higher `weight` wins.
3. If still tied, lower lexical `strategyId` wins.
4. If still tied, lower lexical `marketGroupStrategyLinkId` wins.

## Safety Overrides
- `EXIT` can close existing position even when directional vote indicates opposite action.
- `NO_TRADE` is valid and preferred when certainty is insufficient.
- Runtime must never "guess" by random selection.

## Audit Requirements
For each resolution unit store merge trace:
- bot/group/symbol/window identifiers
- participating strategy outputs
- applied guardrails
- directional scores and threshold
- final action and tie-break path
- primary strategy provenance for downstream order and position lifecycle
  ownership

## Lifecycle Boundary
The merge contract decides the accepted proposal; it does not bypass execution
or lifecycle guardrails. Accepted `OPEN`, `DCA`, `CLOSE`, and `EXIT` intents
must still pass wallet, ownership, pre-trade, no-flip, exchange-min-order,
continuity, and LIVE entitlement checks.

For directional merges where several strategies contribute to the winning
direction, the primary strategy provenance is selected by the deterministic
tie-break sequence. That provenance owns the resulting order/position lifecycle
configuration unless a later explicit transfer contract is implemented.

## Backtest/Paper/Live Parity Rule
- Same merge algorithm and tie-break sequence in all three modes.
- Only execution adapter differs (simulation vs real exchange side effects).

## Config Defaults (V1)
- `minDirectionalScore`: `1.0`
- default `weight`: `1.0`
- default `priority`: `100` (normal priority; lower numbers are more urgent)
- if no explicit config found for a link, runtime applies defaults above.
